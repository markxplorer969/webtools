// admin-ocr-providers - kelola daftar provider OCR dari panel admin.
//
// KENAPA EDGE FUNCTION, BUKAN RPC
//   Nilai API key hanya ada di edge secret, bukan di database. Hanya fungsi ini
//   yang boleh membaca Deno.env, memanggil /models milik penyedia, lalu menulis
//   hasil uji ke tabel. Tabel ocr_providers tidak punya policy tulis; satu-
//   satunya jalur tulis adalah service role di sini. Pola sama dengan
//   admin-ocr-servers.
//
// KONTRAK (docs/API-ocr-provider.md v1.1)
//   daftar | tambah | ubah | uji | aktifkan | nonaktifkan | hapus
//   Galat selalu { error, kode } dengan status HTTP yang sesuai.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { requireAdmin } from "../_shared/admin-guard.ts";
import { segarkanRute } from "../_shared/gateway.ts";
import {
  buatLayanan,
  ProviderError,
  type BarisProvider,
  type BarisServer,
  type ProviderStore,
} from "../_shared/ocr-providers.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const KOLOM =
  "id,label,base_url,prefix,key_secret_name,aktif,status,uji_terakhir,uji_ok,uji_gambar_ok,uji_pesan,uji_ms,catatan,dibuat_pada,diperbarui_pada";

function buatStore(admin: SupabaseClient<any, "public", any>): ProviderStore {
  return {
    async list() {
      const { data, error } = await admin.from("ocr_providers").select(KOLOM).order("dibuat_pada", { ascending: true });
      if (error) throw new ProviderError("db_gagal", 500, `Gagal membaca provider: ${error.message}`);
      return (data ?? []) as BarisProvider[];
    },
    async byId(id) {
      const { data, error } = await admin.from("ocr_providers").select(KOLOM).eq("id", id).maybeSingle();
      if (error) throw new ProviderError("db_gagal", 500, `Gagal membaca provider: ${error.message}`);
      return (data as BarisProvider) ?? null;
    },
    async byPrefix(prefix) {
      const q = admin.from("ocr_providers").select(KOLOM);
      const { data, error } = prefix === null ? await q.is("prefix", null).maybeSingle() : await q.eq("prefix", prefix).maybeSingle();
      if (error) throw new ProviderError("db_gagal", 500, `Gagal membaca provider: ${error.message}`);
      return (data as BarisProvider) ?? null;
    },
    async insert(baris) {
      const { data, error } = await admin
        .from("ocr_providers")
        .insert({ ...baris, status: "draft", aktif: false })
        .select(KOLOM)
        .single();
      if (error) throw new ProviderError("db_gagal", 500, `Gagal menyimpan provider: ${error.message}`);
      return data as BarisProvider;
    },
    async update(id, patch) {
      const { data, error } = await admin.from("ocr_providers").update(patch).eq("id", id).select(KOLOM).single();
      if (error) throw new ProviderError("db_gagal", 500, `Gagal mengubah provider: ${error.message}`);
      return data as BarisProvider;
    },
    async remove(id) {
      const { error } = await admin.from("ocr_providers").delete().eq("id", id);
      if (error) throw new ProviderError("db_gagal", 500, `Gagal menghapus provider: ${error.message}`);
    },
    async servers() {
      const { data, error } = await admin.from("ocr_server_status").select("server_id,label,model,aktif");
      if (error) throw new ProviderError("db_gagal", 500, `Gagal membaca server: ${error.message}`);
      return (data ?? []) as BarisServer[];
    },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Metode tidak didukung.", kode: "metode_salah" }, 405);

  try {
    let adminAuth: { userId: string; email: string | null };
    try {
      adminAuth = await requireAdmin(req, corsHeaders);
    } catch (e) {
      if (e instanceof Response) {
        const status = e.status === 403 ? 403 : 401;
        return json(
          {
            error: status === 403 ? "Hanya admin yang bisa mengubah penyedia." : "Sesi berakhir, masuk lagi.",
            kode: status === 403 ? "forbidden" : "unauthorized",
          },
          status,
        );
      }
      throw e;
    }
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const layanan = buatLayanan({
      store: buatStore(admin),
      secret: (nama) => Deno.env.get(nama),
      gatewayUrl: () => Deno.env.get("OCR_GATEWAY_URL"),
    });

    const body = await req.json().catch(() => ({}));
    const aksi = typeof body?.aksi === "string" ? body.aksi : "";

    let hasil: unknown;
    switch (aksi) {
      case "daftar":
        hasil = await layanan.daftar();
        break;
      case "tambah":
        hasil = await layanan.tambah({
          label: body.label,
          base_url: body.base_url,
          prefix: body.prefix,
          key_secret_name: body.key_secret_name,
          catatan: body.catatan,
          dibuat_oleh: adminAuth.userId,
        });
        await segarkanRute();
        break;
      case "ubah":
        hasil = await layanan.ubah({
          id: body.id,
          label: body.label,
          base_url: body.base_url,
          prefix: body.prefix,
          key_secret_name: body.key_secret_name,
          catatan: body.catatan,
          konfirmasi: body.konfirmasi === true,
        });
        await segarkanRute();
        break;
      case "uji":
        hasil = await layanan.uji(String(body.id ?? ""), body.mode === "gambar" ? "gambar" : "teks");
        break;
      case "aktifkan":
        hasil = await layanan.aktifkan(String(body.id ?? ""));
        await segarkanRute();
        break;
      case "nonaktifkan":
        hasil = await layanan.nonaktifkan(String(body.id ?? ""), body.konfirmasi === true);
        await segarkanRute();
        break;
      case "hapus":
        hasil = await layanan.hapus(String(body.id ?? ""));
        await segarkanRute();
        break;
      default:
        return json({ error: "Aksi tidak dikenal.", kode: "aksi_tidak_sah" }, 400);
    }

    return json(hasil);
  } catch (e) {
    if (e instanceof Response) return e;
    if (e instanceof ProviderError) {
      return json({ error: e.message, kode: e.kode, ...e.tambahan }, e.status);
    }
    console.error("admin-ocr-providers", e);
    return json({ error: "Terjadi kesalahan di server.", kode: "server_error" }, 500);
  }
});
