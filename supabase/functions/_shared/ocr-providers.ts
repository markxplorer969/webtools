// Logika murni fitur "Kelola Provider OCR" (tanpa Deno/DB global).
//
// Dipakai oleh edge function admin-ocr-providers dan oleh tes vitest, supaya
// validasi serta urutan uji bisa dibuktikan tanpa menembak produksi.
// Kontrak: docs/API-ocr-provider.md v1.1 dan docs/SCHEMA-ocr-provider.md v1.1.

export type StatusProvider = "draft" | "aktif" | "nonaktif";
export type ModeUji = "teks" | "gambar";

export interface BarisProvider {
  id: string;
  label: string;
  base_url: string | null;
  prefix: string | null;
  key_secret_name: string;
  aktif: boolean;
  status: StatusProvider;
  uji_terakhir: string | null;
  uji_ok: boolean | null;
  uji_gambar_ok: boolean | null;
  uji_pesan: string | null;
  uji_ms: number | null;
  catatan: string | null;
  dibuat_pada: string;
  diperbarui_pada: string;
}

export interface BarisServer {
  server_id: string;
  label: string;
  model: string;
  aktif: boolean;
}

export interface ProviderStore {
  list(): Promise<BarisProvider[]>;
  byId(id: string): Promise<BarisProvider | null>;
  byPrefix(prefix: string | null): Promise<BarisProvider | null>;
  insert(
    baris: Pick<BarisProvider, "label" | "base_url" | "prefix" | "key_secret_name" | "catatan"> & {
      dibuat_oleh: string | null;
    },
  ): Promise<BarisProvider>;
  update(id: string, patch: Partial<BarisProvider>): Promise<BarisProvider>;
  remove(id: string): Promise<void>;
  servers(): Promise<BarisServer[]>;
}

export interface Deps {
  store: ProviderStore;
  secret: (nama: string) => string | undefined;
  gatewayUrl: () => string | undefined;
  fetchImpl?: typeof fetch;
  now?: () => number;
}

export class ProviderError extends Error {
  constructor(
    public kode: string,
    public status: number,
    message: string,
    public tambahan: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

const POLA_PREFIX = /^[a-z0-9]{2,12}\/$/;
const POLA_SECRET = /^[A-Z][A-Z0-9_]{2,60}$/;
function isyaratTimeout(ms: number): AbortSignal | undefined {
  try {
    const A = AbortSignal as unknown as { timeout?: (ms: number) => AbortSignal };
    return typeof A.timeout === "function" ? A.timeout(ms) : undefined;
  } catch {
    return undefined;
  }
}

const TIMEOUT_UJI_MS = 20_000;
const JEDA_UJI_MS = 30_000;

function sebagaiObjek(v: unknown): Record<string, unknown> | null {
  return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;
}

function teks(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function prefixDari(model: string): string {
  const i = model.indexOf("/");
  return i > 0 ? model.slice(0, i + 1) : "";
}

function urlChat(base: string): string {
  const bersih = base.replace(/\/+$/, "");
  return bersih.endsWith("/chat/completions") ? bersih : `${bersih}/chat/completions`;
}

function urlModels(base: string): string {
  const bersih = base.replace(/\/+$/, "");
  if (bersih.endsWith("/chat/completions")) return `${bersih.slice(0, -"/chat/completions".length)}/models`;
  if (bersih.endsWith("/models")) return bersih;
  return `${bersih}/models`;
}

export function validasiLabel(v: unknown): string {
  const s = teks(v);
  if (s.length < 1 || s.length > 60 || /[\r\n\t]/.test(s)) {
    throw new ProviderError("label_tidak_sah", 400, "Label 1-60 karakter tanpa baris baru.");
  }
  return s;
}

export function validasiPrefix(v: unknown): string | null {
  if (v === undefined || v === null || v === "") return null;
  const s = teks(v);
  if (!s) return null;
  if (!POLA_PREFIX.test(s)) {
    throw new ProviderError("prefix_tidak_sah", 400, "Prefix contoh: bw/");
  }
  return s;
}

export function validasiSecretName(v: unknown): string {
  const s = teks(v);
  if (!POLA_SECRET.test(s)) {
    throw new ProviderError("secret_name_tidak_sah", 400, "Nama secret contoh: BANGUNWEB_GATEWAY_KEY");
  }
  return s;
}

export function validasiUrl(v: unknown, prefix: string | null): string | null {
  const s = teks(v);
  if (!s) {
    if (prefix === null) return null;
    throw new ProviderError("url_tidak_sah", 400, "URL wajib untuk provider berprefix.");
  }
  if (!s.startsWith("https://") || s.includes("?") || s.includes("#")) {
    throw new ProviderError("url_tidak_sah", 400, "URL harus https dan tanpa parameter.");
  }
  return s;
}

export function validasiCatatan(v: unknown): string | null {
  if (v === undefined) return null;
  const s = teks(v);
  if (s.length > 300) {
    throw new ProviderError("catatan_tidak_sah", 400, "Catatan maksimal 300 karakter.");
  }
  return s || null;
}

/** Bentuk yang aman dikirim ke browser: tanpa nilai secret. */
export function kePublik(row: BarisProvider, secretTerisi: boolean) {
  return {
    id: row.id,
    label: row.label,
    base_url: row.base_url,
    prefix: row.prefix,
    key_secret_name: row.key_secret_name,
    secret_terisi: secretTerisi,
    aktif: row.aktif,
    status: row.status,
    uji: {
      teks: {
        terakhir: row.uji_terakhir,
        ok: row.uji_ok,
        pesan: row.uji_ok === null ? null : row.uji_pesan,
        ms: row.uji_ok === null ? null : row.uji_ms,
      },
      gambar: {
        terakhir: row.uji_terakhir,
        ok: row.uji_gambar_ok,
        pesan: row.uji_gambar_ok === null ? null : row.uji_pesan,
        ms: row.uji_gambar_ok === null ? null : row.uji_ms,
      },
    },
    catatan: row.catatan,
    dibuat_pada: row.dibuat_pada,
    diperbarui_pada: row.diperbarui_pada,
  };
}

export function jumlahServerPerPrefix(servers: BarisServer[]): Record<string, number> {
  const hasil: Record<string, number> = {};
  for (const s of servers) {
    if (!s.aktif) continue;
    const p = prefixDari(s.model);
    hasil[p] = (hasil[p] ?? 0) + 1;
  }
  return hasil;
}

/** PNG 32x32 dua warna, dipakai untuk uji gambar (biaya minimal). */
const GAMBAR_UJI_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAHElEQVR4nO3OMQEAAAgDoJnc6BpjDyQgwEnVXg8G" +
  "AAH7Xk9cAAAAAElFTkSuQmCC";

export function buatLayanan(deps: Deps) {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const sekarang = deps.now ?? (() => Date.now());
  const ujiTerakhir = new Map<string, number>();

  function rahasia(row: BarisProvider): string | undefined {
    const v = deps.secret(row.key_secret_name);
    return v && v.length > 0 ? v : undefined;
  }

  async function ambil(id: string): Promise<BarisProvider> {
    const row = await deps.store.byId(id);
    if (!row) throw new ProviderError("provider_tidak_ada", 404, "Provider tidak ditemukan.");
    return row;
  }

  function dampak(row: BarisProvider, servers: BarisServer[]) {
    const p = row.prefix ?? "";
    return servers
      .filter((s) => s.aktif && prefixDari(s.model) === p)
      .map((s) => ({ server_id: s.server_id, label: s.label, model: s.model }));
  }

  async function daftar() {
    const [provider, servers] = await Promise.all([deps.store.list(), deps.store.servers()]);
    return {
      provider: provider.map((r) => kePublik(r, !!rahasia(r))),
      jumlah_server: jumlahServerPerPrefix(servers),
    };
  }

  async function tambah(input: {
    label?: unknown;
    base_url?: unknown;
    prefix?: unknown;
    key_secret_name?: unknown;
    catatan?: unknown;
    dibuat_oleh: string;
  }) {
    const label = validasiLabel(input.label);
    const prefix = validasiPrefix(input.prefix);
    const base_url = validasiUrl(input.base_url, prefix);
    const key_secret_name = validasiSecretName(input.key_secret_name);
    const catatan = validasiCatatan(input.catatan);

    const bentrok = await deps.store.byPrefix(prefix);
    if (bentrok) {
      if (prefix === null) {
        throw new ProviderError("gateway_utama_sudah_ada", 409, "Gateway utama sudah terdaftar.", {
          label: bentrok.label,
        });
      }
      throw new ProviderError("prefix_sudah_ada", 409, `Prefix ${prefix} sudah dipakai ${bentrok.label}.`, {
        label: bentrok.label,
      });
    }

    const row = await deps.store.insert({
      label,
      base_url,
      prefix,
      key_secret_name,
      catatan,
      dibuat_oleh: input.dibuat_oleh,
    });
    return { provider: kePublik(row, !!rahasia(row)) };
  }

  async function ubah(input: {
    id: string;
    label?: unknown;
    base_url?: unknown;
    prefix?: unknown;
    key_secret_name?: unknown;
    catatan?: unknown;
    konfirmasi?: boolean;
  }) {
    const row = await ambil(teks(input.id));
    const servers = await deps.store.servers();

    const label = input.label === undefined ? row.label : validasiLabel(input.label);
    const prefix = input.prefix === undefined ? row.prefix : validasiPrefix(input.prefix);
    const base_url = input.base_url === undefined ? row.base_url : validasiUrl(input.base_url, prefix);
    const key_secret_name =
      input.key_secret_name === undefined ? row.key_secret_name : validasiSecretName(input.key_secret_name);
    const catatan = input.catatan === undefined ? row.catatan : validasiCatatan(input.catatan);

    const ubahTarget = base_url !== row.base_url || prefix !== row.prefix || key_secret_name !== row.key_secret_name;

    if (ubahTarget) {
      const terdampak = dampak(row, servers);
      if (terdampak.length > 0 && input.konfirmasi !== true) {
        throw new ProviderError(
          "butuh_konfirmasi",
          409,
          `Penyedia dipakai ${terdampak.length} server aktif`,
          { terdampak },
        );
      }
      if (prefix !== row.prefix) {
        const bentrok = await deps.store.byPrefix(prefix);
        if (bentrok && bentrok.id !== row.id) {
          if (prefix === null) {
            throw new ProviderError("gateway_utama_sudah_ada", 409, "Gateway utama sudah terdaftar.", {
              label: bentrok.label,
            });
          }
          throw new ProviderError("prefix_sudah_ada", 409, `Prefix ${prefix} sudah dipakai ${bentrok.label}.`, {
            label: bentrok.label,
          });
        }
      }
    }

    const patch: Partial<BarisProvider> = { label, base_url, prefix, key_secret_name, catatan };
    if (ubahTarget) {
      Object.assign(patch, {
        aktif: false,
        status: "draft" as StatusProvider,
        uji_ok: null,
        uji_gambar_ok: null,
        uji_pesan: null,
        uji_ms: null,
        uji_terakhir: null,
      });
    }

    const baru = await deps.store.update(row.id, patch);
    return { provider: kePublik(baru, !!rahasia(baru)) };
  }

  async function uji(id: string, mode: ModeUji) {
    const row = await ambil(teks(id));
    const t = sekarang();
    const sebelumnya = ujiTerakhir.get(row.id) ?? 0;
    if (t - sebelumnya < JEDA_UJI_MS) {
      throw new ProviderError("uji_terlalu_sering", 429, "Tunggu 30 detik sebelum uji lagi.");
    }
    ujiTerakhir.set(row.id, t);

    const key = rahasia(row);
    if (!key) {
      throw new ProviderError(
        "secret_missing",
        400,
        `Secret ${row.key_secret_name} belum diatur di edge.`,
      );
    }

    const base = row.prefix === null ? (deps.gatewayUrl() ?? "") : (row.base_url ?? "");
    if (!base) {
      throw new ProviderError("url_tidak_sah", 400, "URL provider belum diatur.");
    }

    const mulai = sekarang();
    let res: Response;
    try {
      res = await fetchImpl(urlModels(base), {
        method: "GET",
        headers: { Authorization: `Bearer ${key}`, "User-Agent": UA_UJI },
        signal: isyaratTimeout(TIMEOUT_UJI_MS),
      });
    } catch {
      throw new ProviderError("provider_timeout", 504, "Penyedia tidak menjawab dalam 20 detik.");
    }

    if (!res.ok) {
      throw new ProviderError("provider_menolak", 502, `Penyedia menolak (${res.status}).`, {
        status_penyedia: res.status,
      });
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      throw new ProviderError("bukan_json", 502, "Respons bukan JSON.");
    }

    const root = sebagaiObjek(data);
    const models = (Array.isArray(root?.data) ? (root.data as unknown[]) : [])
      .map(sebagaiObjek)
      .filter((m): m is Record<string, unknown> => m !== null);
    const punyaCapabilities = models.filter((m) => sebagaiObjek(m.capabilities) !== null);
    if (models.length === 0 || punyaCapabilities.length === 0) {
      throw new ProviderError(
        "capabilities_tidak_ada",
        400,
        "Penyedia tidak melaporkan capabilities; tidak bisa dipakai.",
      );
    }

    const vision = punyaCapabilities.filter((m) => sebagaiObjek(m.capabilities)?.vision === true).map((m) => String(m.id));
    const tanpaVision =
      punyaCapabilities.length === models.length
        ? models.filter((m) => sebagaiObjek(m.capabilities)?.vision !== true).map((m) => String(m.id))
        : null;

    const modelTeks = String((vision[0] ? models.find((m) => String(m.id) === vision[0]) : punyaCapabilities[0])?.id ?? "");
    let modelChat = modelTeks;
    let thinkingKosong: string[] | null = null;
    let ok = true;
    let pesan = `HTTP 200 · ${models.length} model · vision: ${vision.slice(0, 3).join(", ") || "-"}`;

    if (mode === "gambar") {
      if (!vision.length) {
        throw new ProviderError(
          "capabilities_tidak_ada",
          400,
          "Penyedia tidak melaporkan model vision; uji gambar tidak bisa dijalankan.",
        );
      }
      modelChat = vision[0];
      const isi = await chat(fetchImpl, urlChat(base), key, {
        model: modelChat,
        max_tokens: 8,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Sebutkan satu warna yang terlihat. Satu kata." },
              { type: "image_url", image_url: { url: `data:image/png;base64,${GAMBAR_UJI_PNG}` } },
            ],
          },
        ],
      });
      if (!isi.content) {
        ok = false;
        thinkingKosong = [modelChat];
        pesan = "Provider menjawab tetapi content kosong (thinking).";
      } else {
        pesan = `HTTP 200 · gambar dibaca · ${modelChat}: ${isi.content.slice(0, 40)}`;
      }
    } else {
      const isi = await chat(fetchImpl, urlChat(base), key, {
        model: modelChat,
        max_tokens: 5,
        messages: [{ role: "user", content: "Balas satu kata: ok" }],
      });
      if (!isi.content) {
        pesan = `HTTP 200 · ${models.length} model · content kosong saat uji teks (${modelChat})`;
      }
    }

    const ms = sekarang() - mulai;
    const patch: Partial<BarisProvider> = {
      uji_terakhir: new Date(sekarang()).toISOString(),
      uji_pesan: pesan.slice(0, 500),
      uji_ms: ms,
    };
    if (mode === "teks") patch.uji_ok = ok;
    else patch.uji_gambar_ok = ok;
    await deps.store.update(row.id, patch);

    return {
      mode,
      hidup: true,
      ok,
      ms,
      jumlah_model: models.length,
      jumlah_vision: vision.length,
      model_vision: vision,
      model_tanpa_vision: tanpaVision,
      thinking_kosong: thinkingKosong,
      pesan,
    };
  }

  async function aktifkan(id: string) {
    const row = await ambil(teks(id));
    if (row.uji_ok !== true) {
      throw new ProviderError("belum_diuji", 409, "Uji teks dulu sampai lulus.");
    }
    if (row.uji_gambar_ok !== true) {
      throw new ProviderError("belum_uji_gambar", 409, "Uji gambar dulu sebelum mengaktifkan.");
    }
    const baru = await deps.store.update(row.id, { aktif: true, status: "aktif" });
    return { provider: kePublik(baru, !!rahasia(baru)) };
  }

  async function nonaktifkan(id: string, konfirmasi?: boolean) {
    const row = await ambil(teks(id));
    const servers = await deps.store.servers();
    const terdampak = dampak(row, servers);
    if (terdampak.length > 0 && konfirmasi !== true) {
      throw new ProviderError(
        "butuh_konfirmasi",
        409,
        `Penyedia dipakai ${terdampak.length} server aktif`,
        { terdampak },
      );
    }
    const baru = await deps.store.update(row.id, { aktif: false, status: "nonaktif" });
    return { provider: kePublik(baru, !!rahasia(baru)) };
  }

  async function hapus(id: string) {
    const row = await ambil(teks(id));
    if (row.prefix === null) {
      throw new ProviderError("gateway_utama_wajib", 409, "Gateway utama tidak bisa dihapus.");
    }
    const servers = await deps.store.servers();
    const dipakai = servers.filter((s) => prefixDari(s.model) === row.prefix);
    if (dipakai.length > 0) {
      throw new ProviderError("provider_dipakai", 409, "Masih dipakai server.", {
        terdampak: dipakai.map((s) => ({ server_id: s.server_id, label: s.label, model: s.model })),
      });
    }
    await deps.store.remove(row.id);
    return { ok: true, id: row.id };
  }

  return { daftar, tambah, ubah, uji, aktifkan, nonaktifkan, hapus };
}

const UA_UJI =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function chat(
  fetchImpl: typeof fetch,
  url: string,
  key: string,
  body: Record<string, unknown>,
): Promise<{ content: string }> {
  let res: Response;
  try {
    res = await fetchImpl(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "User-Agent": UA_UJI },
      body: JSON.stringify(body),
      signal: isyaratTimeout(TIMEOUT_UJI_MS),
    });
  } catch {
    throw new ProviderError("provider_timeout", 504, "Penyedia tidak menjawab dalam 20 detik.");
  }
  if (!res.ok) {
    throw new ProviderError("provider_menolak", 502, `Penyedia menolak (${res.status}).`, {
      status_penyedia: res.status,
    });
  }
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new ProviderError("bukan_json", 502, "Respons bukan JSON.");
  }
  const pilihan = sebagaiObjek(json)?.choices;
  const pesan = Array.isArray(pilihan) ? sebagaiObjek(sebagaiObjek(pilihan[0])?.message) : null;
  const isi = pesan?.content;
  return { content: typeof isi === "string" ? isi.trim() : "" };
}
