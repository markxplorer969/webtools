import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

/**
 * Authorization guard for privileged edge functions.
 *
 * WHY THIS IS NOT OPTIONAL:
 * `verify_jwt` (and "having an Authorization header") is NOT authorization.
 * The Supabase publishable/anon key is itself a valid, signed project JWT that
 * ships in every browser bundle. Any function that only checks "is there a
 * bearer token?" is effectively public to the entire internet.
 *
 * This guard resolves the bearer token to a REAL end user (anon/service keys
 * resolve to no user and are rejected), then confirms that user holds the
 * `admin` role in public.user_roles — read through the service-role client so
 * RLS cannot mask the row.
 *
 * Throws a ready-to-return Response on failure so call sites cannot forget to
 * stop execution.
 */
export async function requireAdmin(
  req: Request,
  corsHeaders: Record<string, string>,
): Promise<{ userId: string; email: string | null }> {
  const fail = (status: number, error: string) =>
    new Response(JSON.stringify({ error }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) throw fail(401, "Unauthorized");

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Reject the anon key, the service key, forged tokens and expired sessions:
  // only a genuine user session resolves to a user here.
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  const user = userData?.user;
  if (userErr || !user) throw fail(401, "Unauthorized");

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: roleRow } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!roleRow) throw fail(403, "Forbidden: admin role required");

  return { userId: user.id, email: user.email ?? null };
}