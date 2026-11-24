// gateway.ts - pemilihan endpoint & kredensial berdasarkan prefix model.
//
// SUMBER KEBENARAN
//   Prefix dan URL dibaca dari tabel public.ocr_providers (aktif + status aktif),
//   dengan cache 60 detik di memori isolate. Bila tabel gagal dibaca atau kosong,
//   konstanta VIA lama dipakai supaya OCR tidak pernah mati total karena tabel
//   provider bermasalah.
//
//   Satu baris = satu prefix. Provider dengan dua prefix (ag/ dan cbai/)
//   didaftarkan sebagai dua baris, bukan satu baris berisi daftar.
//
// NILAI SECRET
//   Tabel hanya menyimpan NAMA secret (key_secret_name). Nilainya tetap dibaca
//   dari Deno.env. Baris dengan prefix NULL adalah gateway utama: URL-nya selalu
//   OCR_GATEWAY_URL dan tidak bisa diubah dari UI.
//
// CACHE
//   TTL 60 detik, kunci "ocr:providers:v1". Pembacaan dipicu saat modul dimuat
//   dan saat cache kedaluwarsa; kegagalan hanya menulis satu console.warn per
//   60 detik, tidak pernah melempar.

/** Gateway lama; fallback bila tabel provider kosong/gagal dibaca. */
const VIA: Record<string, { urlVar: string; keyVar: string; nama: string }> = {
  "nusa/": { urlVar: "NUSA_GATEWAY_URL", keyVar: "NUSA_GATEWAY_KEY", nama: "nusa" },
  "ag/": { urlVar: "ROUTER9_GATEWAY_URL", keyVar: "ROUTER9_GATEWAY_KEY", nama: "9router" },
  "cbai/": { urlVar: "ROUTER9_GATEWAY_URL", keyVar: "ROUTER9_GATEWAY_KEY", nama: "9router" },
};

export const UA_BROWSER =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const TTL_MS = 60_000;

export interface BarisRute {
  prefix: string | null;
  base_url: string | null;
  key_secret_name: string;
}

export interface Rute {
  prefix: string | null;
  url: string | null;
  keyVar: string;
  nama: string;
}

let ruteDinamis: Map<string, Rute> | null = null;
let dimuatPada = 0;
let sedangMemuat: Promise<void> | null = null;
let terakhirWarn = 0;

function env(nama: string): string | undefined {
  try {
    const v = Deno.env.get(nama);
    return v && v.length > 0 ? v : undefined;
  } catch {
    return undefined;
  }
}

/** Ubah baris tabel menjadi peta prefix -> rute. Diekspor untuk tes. */
export function ruteDariBaris(rows: BarisRute[]): Map<string, Rute> {
  const peta = new Map<string, Rute>();
  for (const r of rows) {
    const prefix = r.prefix && r.prefix.length > 0 ? r.prefix : null;
    peta.set(prefix ?? "", {
      prefix,
      url: prefix === null ? null : r.base_url,
      keyVar: r.key_secret_name,
      nama: prefix ?? "utama",
    });
  }
  return peta;
}

async function muatRute(): Promise<void> {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return;
  if (sedangMemuat) return sedangMemuat;

  sedangMemuat = (async () => {
    try {
      const res = await fetch(
        `${url}/rest/v1/ocr_providers?select=prefix,base_url,key_secret_name&aktif=eq.true&status=eq.aktif`,
        {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
          signal: AbortSignal.timeout(3_000),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = (await res.json()) as BarisRute[];
      const peta = ruteDariBaris(Array.isArray(rows) ? rows : []);
      if (peta.size > 0) {
        ruteDinamis = peta;
        dimuatPada = Date.now();
      }
    } catch (e) {
      if (Date.now() - terakhirWarn > TTL_MS) {
        terakhirWarn = Date.now();
        console.warn("ocr_providers tidak terbaca; memakai konstanta VIA", String(e));
      }
    } finally {
      sedangMemuat = null;
    }
  })();

  return sedangMemuat;
}

/** Paksa muat ulang (dipakai aksi admin setelah tambah/ubah provider). */
export async function segarkanRute(): Promise<void> {
  dimuatPada = 0;
  await muatRute();
}

function mungkinSegarkan(): void {
  if (sedangMemuat) return;
  if (!ruteDinamis || Date.now() - dimuatPada > TTL_MS) void muatRute();
}

/** Hook tes: pasang rute tanpa jaringan. */
export function _setRuteUntukTes(peta: Map<string, Rute> | null): void {
  ruteDinamis = peta;
  dimuatPada = Date.now();
}

export function _ruteSekarang(): Map<string, Rute> | null {
  return ruteDinamis;
}

if (env("SUPABASE_URL")) void muatRute();

/** Buang prefix penyedia dari nama model sebelum dikirim ke provider. */
export function stripRoutingPrefix(model: string): string {
  // Prefix TIDAK dibuang untuk gateway 9router: di sana prefix adalah bagian
  // dari nama model (namespace), bukan sekadar penanda routing.
  const kandidat = new Set<string>([...Object.keys(VIA), ...(ruteDinamis?.keys() ?? [])]);
  for (const prefix of kandidat) {
    if (!prefix || prefix === "ag/" || prefix === "cbai/") continue;
    if (model.startsWith(prefix)) return model.slice(prefix.length);
  }
  return model;
}

function headerDasar(headers: Record<string, string>): void {
  headers["Content-Type"] = "application/json";
  headers["User-Agent"] = UA_BROWSER;
}

function utama(
  apiKey: string | undefined,
  headers: Record<string, string>,
  keyVar?: string,
): { url: string; headers: Record<string, string> } | null {
  const url = env("OCR_GATEWAY_URL");
  const key = env(keyVar ?? "OCR_GATEWAY_KEY");
  if (url && key) {
    headers["Authorization"] = `Bearer ${key}`;
    return { url, headers };
  }
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
    return { url: "https://ai.gateway.lovable.dev/v1/chat/completions", headers };
  }
  return null;
}

function ruteUntukModel(model: string): Rute | undefined {
  const i = model.indexOf("/");
  if (i <= 0) return undefined;
  return ruteDinamis?.get(model.slice(0, i + 1));
}

/**
 * Tentukan URL + header untuk satu model.
 * Bentuk kembalian dipertahankan supaya pemanggil lama tidak berubah.
 */
export function gatewayUntuk(
  apiKey: string | undefined,
  model?: string,
): { url: string; headers: Record<string, string>; peringatan?: string } {
  mungkinSegarkan();
  const headers: Record<string, string> = {};
  headerDasar(headers);

  if (model) {
    const dinamis = ruteUntukModel(model);
    if (dinamis) {
      const url = dinamis.url ?? env("OCR_GATEWAY_URL");
      const key = env(dinamis.keyVar);
      if (url && key) {
        headers["Authorization"] = `Bearer ${key}`;
        return { url, headers };
      }
      const fallback = utama(undefined, headers);
      return {
        ...(fallback ?? { url: "", headers }),
        peringatan: `provider ${dinamis.prefix} memakai secret ${dinamis.keyVar} yang belum diatur - jatuh ke gateway utama`,
      };
    }

    // Konstanta lama HANYA dipakai bila tabel provider tidak terbaca/kosong.
    // Setelah ada baris di tabel, tabel itu satu-satunya sumber rute.
    if (ruteDinamis === null) {
      for (const [prefix, g] of Object.entries(VIA)) {
        if (!model.startsWith(prefix)) continue;
        const url = env(g.urlVar);
        const key = env(g.keyVar);
        if (url && key) {
          headers["Authorization"] = `Bearer ${key}`;
          return { url, headers };
        }
        return {
          ...(utama(apiKey, headers) ?? { url: "", headers }),
          peringatan: `model "${model}" memakai prefix ${prefix} tetapi ${g.urlVar}/${g.keyVar} belum diatur - jatuh ke gateway utama`,
        };
      }
    } else if (model.includes("/") && Date.now() - terakhirWarn > TTL_MS) {
      // Prefix tidak terdaftar: jangan diam-diam mengirim nama model asing ke
      // gateway utama tanpa jejak.
      terakhirWarn = Date.now();
      console.warn(`prefix pada model "${model}" tidak terdaftar di ocr_providers`);
    }
  }

  const barisUtama = ruteDinamis?.get("");
  const hasil = utama(apiKey, headers, barisUtama?.keyVar);
  return hasil ?? { url: "", headers };
}
