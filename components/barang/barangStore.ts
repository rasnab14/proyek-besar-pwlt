// components/barang/barangStore.ts
import { BarangRecord, KategoriRecord, PaketRecord } from "./types";
import { INITIAL_BARANG, INITIAL_KATEGORI, INITIAL_PAKET } from "./mockData";

const KEY_BARANG = "summit_data_barang";
const KEY_KATEGORI = "summit_data_kategori";
const KEY_PAKET = "summit_data_paket";

// --- KATEGORI STORE ---
export function getStoredKategori(): KategoriRecord[] {
  if (typeof window === "undefined") return INITIAL_KATEGORI;
  try {
    const raw = localStorage.getItem(KEY_KATEGORI);
    if (!raw) {
      localStorage.setItem(KEY_KATEGORI, JSON.stringify(INITIAL_KATEGORI));
      return INITIAL_KATEGORI;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_KATEGORI;
  }
}

export function saveOrUpdateKategori(item: KategoriRecord) {
  const current = getStoredKategori();
  const idx = current.findIndex((k) => k.id === item.id);
  let updated: KategoriRecord[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = item;
  } else {
    updated = [item, ...current];
  }
  localStorage.setItem(KEY_KATEGORI, JSON.stringify(updated));
  window.dispatchEvent(new Event("summit_barang_updated"));
  return updated;
}

export function deleteKategori(id: string) {
  const current = getStoredKategori();
  const updated = current.filter((k) => k.id !== id);
  localStorage.setItem(KEY_KATEGORI, JSON.stringify(updated));
  window.dispatchEvent(new Event("summit_barang_updated"));
  return updated;
}

// --- BARANG STORE ---
export function getStoredBarang(): BarangRecord[] {
  if (typeof window === "undefined") return INITIAL_BARANG;
  try {
    const raw = localStorage.getItem(KEY_BARANG);
    if (!raw) {
      localStorage.setItem(KEY_BARANG, JSON.stringify(INITIAL_BARANG));
      return INITIAL_BARANG;
    }
    const parsed: BarangRecord[] = JSON.parse(raw);
    let hasNew = false;
    INITIAL_BARANG.forEach((initB) => {
      const existingIdx = parsed.findIndex((p) => p.id === initB.id || p.kode === initB.kode);
      if (existingIdx === -1) {
        parsed.push(initB);
        hasNew = true;
      } else {
        // Sync variasi IDs if they were missing or generic
        if (initB.variasi && parsed[existingIdx].variasi) {
          initB.variasi.forEach((iv) => {
            const pv = parsed[existingIdx].variasi?.find((v) => v.id === iv.id);
            if (!pv) {
              const matchedByName = parsed[existingIdx].variasi?.find(
                (v) => v.namaVariasi === iv.namaVariasi || (v.merek === iv.merek && v.ukuran === iv.ukuran)
              );
              if (matchedByName && matchedByName.id !== iv.id) {
                matchedByName.id = iv.id;
                hasNew = true;
              }
            }
          });
        }
      }
    });
    if (hasNew) {
      localStorage.setItem(KEY_BARANG, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return INITIAL_BARANG;
  }
}

export function saveOrUpdateBarang(item: BarangRecord) {
  const current = getStoredBarang();
  const idx = current.findIndex((b) => b.id === item.id);
  let updated: BarangRecord[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = item;
  } else {
    updated = [item, ...current];
  }
  localStorage.setItem(KEY_BARANG, JSON.stringify(updated));
  window.dispatchEvent(new Event("summit_barang_updated"));
  return updated;
}

export function deleteBarang(id: string) {
  const current = getStoredBarang();
  const target = current.find((b) => b.id === id);
  if (target?.terkaitTransaksi) {
    throw new Error(`Produk '${target.nama}' sudah terkait dengan transaksi atau riwayat aktif dan tidak dapat dihapus.`);
  }
  const updated = current.filter((b) => b.id !== id);
  localStorage.setItem(KEY_BARANG, JSON.stringify(updated));
  window.dispatchEvent(new Event("summit_barang_updated"));
  return updated;
}

// --- PAKET STORE ---
export function getStoredPaket(): PaketRecord[] {
  if (typeof window === "undefined") return INITIAL_PAKET;
  try {
    const raw = localStorage.getItem(KEY_PAKET);
    if (!raw) {
      localStorage.setItem(KEY_PAKET, JSON.stringify(INITIAL_PAKET));
      return INITIAL_PAKET;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PAKET;
  }
}

export function saveOrUpdatePaket(item: PaketRecord) {
  const current = getStoredPaket();
  const idx = current.findIndex((p) => p.id === item.id);
  let updated: PaketRecord[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = item;
  } else {
    updated = [item, ...current];
  }
  localStorage.setItem(KEY_PAKET, JSON.stringify(updated));
  window.dispatchEvent(new Event("summit_barang_updated"));
  return updated;
}

export function toggleStatusPaket(id: string) {
  const current = getStoredPaket();
  const updated = current.map((p) => {
    if (p.id === id) {
      return {
        ...p,
        status: p.status === "aktif" ? ("nonaktif" as const) : ("aktif" as const),
      };
    }
    return p;
  });
  localStorage.setItem(KEY_PAKET, JSON.stringify(updated));
  window.dispatchEvent(new Event("summit_barang_updated"));
  return updated;
}
