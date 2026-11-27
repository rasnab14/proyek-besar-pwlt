// components/transaksi-jual/jualStore.ts
import { TransaksiJualRecord, ProdukJualItem } from "./types";
import { INITIAL_TRANSAKSI_JUAL, INITIAL_PRODUK_JUAL } from "./mockData";

const STORAGE_KEY_JUAL = "summit_transaksi_jual_data";
const STORAGE_KEY_PRODUK = "summit_produk_jual_data";

export function getStoredProdukJual(): ProdukJualItem[] {
  if (typeof window === "undefined") return INITIAL_PRODUK_JUAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUK);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PRODUK, JSON.stringify(INITIAL_PRODUK_JUAL));
      return INITIAL_PRODUK_JUAL;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRODUK_JUAL;
  } catch {
    return INITIAL_PRODUK_JUAL;
  }
}

export function saveStoredProdukJual(items: ProdukJualItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_PRODUK, JSON.stringify(items));
  window.dispatchEvent(new Event("summit_produkjual_updated"));
}

export function getStoredTransaksiJual(): TransaksiJualRecord[] {
  if (typeof window === "undefined") return INITIAL_TRANSAKSI_JUAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_JUAL);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_JUAL, JSON.stringify(INITIAL_TRANSAKSI_JUAL));
      return INITIAL_TRANSAKSI_JUAL;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TRANSAKSI_JUAL;
  } catch {
    return INITIAL_TRANSAKSI_JUAL;
  }
}

export function generateNextJualKode(): string {
  const list = getStoredTransaksiJual();
  const maxNumber = list.reduce((max, it) => {
    const match = it.kode.match(/TJ-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 127);
  const nextNum = maxNumber + 1;
  return `TJ-${nextNum.toString().padStart(4, "0")}`;
}

export function saveOrUpdateTransaksiJual(record: TransaksiJualRecord): void {
  if (typeof window === "undefined") return;
  try {
    const list = getStoredTransaksiJual();
    const idx = list.findIndex(
      (t) => t.id === record.id || t.kode.toLowerCase() === record.kode.toLowerCase()
    );
    let updatedList: TransaksiJualRecord[];
    if (idx >= 0) {
      updatedList = [...list];
      updatedList[idx] = record;
    } else {
      updatedList = [record, ...list];
    }
    localStorage.setItem(STORAGE_KEY_JUAL, JSON.stringify(updatedList));
    window.dispatchEvent(new Event("summit_transaksijual_updated"));
  } catch (err) {
    console.error("Failed to save sales transaction:", err);
  }
}

export function deleteTransaksiJual(idOrKode: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const list = getStoredTransaksiJual();
    const target = list.find((t) => t.id === idOrKode || t.kode.toLowerCase() === idOrKode.toLowerCase());
    if (!target) return false;

    // Restore stock
    const products = getStoredProdukJual();
    target.items.forEach((it) => {
      const p = products.find((prod) => prod.id === it.id);
      if (p) {
        p.stok += it.jumlah;
      }
    });
    saveStoredProdukJual(products);

    const filtered = list.filter((t) => t.id !== target.id);
    localStorage.setItem(STORAGE_KEY_JUAL, JSON.stringify(filtered));
    window.dispatchEvent(new Event("summit_transaksijual_updated"));
    return true;
  } catch (err) {
    console.error("Failed to delete sales transaction:", err);
    return false;
  }
}

export function createTransaksiJual(data: {
  pelanggan: { nama: string; telepon?: string; alamat?: string };
  items: Array<{
    id: string;
    kode: string;
    nama: string;
    kategori: string;
    jumlah: number;
    hargaSatuan: number;
    subtotal: number;
  }>;
  diskon: number;
  nominalBayar: number;
  metodeBayar: "tunai" | "qris" | "transfer";
  catatan?: string;
  kasir?: string;
}): TransaksiJualRecord {
  const nextKode = generateNextJualKode();
  const now = new Date();
  const nowStr = now.toISOString().replace("T", " ").substring(0, 16);

  const subtotal = data.items.reduce((acc, it) => acc + it.subtotal, 0);
  const total = Math.max(0, subtotal - data.diskon);
  const kembalian = Math.max(0, data.nominalBayar - total);
  const barangSummary = data.items.map((it) => `${it.nama} ×${it.jumlah}`).join(", ");

  // Potong stok barang retail otomatis
  const products = getStoredProdukJual();
  data.items.forEach((it) => {
    const p = products.find((prod) => prod.id === it.id);
    if (p) {
      p.stok = Math.max(0, p.stok - it.jumlah);
    }
  });
  saveStoredProdukJual(products);

  const newRecord: TransaksiJualRecord = {
    id: nextKode.toLowerCase(),
    kode: nextKode,
    waktu: nowStr,
    pelanggan: data.pelanggan,
    kasir: data.kasir || "Admin Toko",
    items: data.items,
    barangRingkasan: barangSummary,
    subtotal,
    diskon: data.diskon,
    total,
    nominalBayar: data.nominalBayar,
    kembalian,
    metodeBayar: data.metodeBayar,
    status: "selesai", // Setiap transaksi penjualan otomatis Selesai / Lunas
    catatan: data.catatan || "Penjualan ritel kasir",
  };

  saveOrUpdateTransaksiJual(newRecord);
  return newRecord;
}

export function updateTransaksiJual(
  idOrKode: string,
  data: {
    pelanggan: { nama: string; telepon?: string; alamat?: string };
    items: Array<{
      id: string;
      kode: string;
      nama: string;
      kategori: string;
      jumlah: number;
      hargaSatuan: number;
      subtotal: number;
    }>;
    diskon: number;
    nominalBayar: number;
    metodeBayar: "tunai" | "qris" | "transfer";
    catatan?: string;
    kasir?: string;
  }
): TransaksiJualRecord | null {
  if (typeof window === "undefined") return null;

  const list = getStoredTransaksiJual();
  const existing = list.find((t) => t.id === idOrKode || t.kode.toLowerCase() === idOrKode.toLowerCase());
  if (!existing) return null;

  // 1. Revert previous stock deduction from existing.items
  const products = getStoredProdukJual();
  existing.items.forEach((it) => {
    const p = products.find((prod) => prod.id === it.id);
    if (p) {
      p.stok += it.jumlah;
    }
  });

  // 2. Apply new stock deduction for new data.items
  data.items.forEach((it) => {
    const p = products.find((prod) => prod.id === it.id);
    if (p) {
      p.stok = Math.max(0, p.stok - it.jumlah);
    }
  });
  saveStoredProdukJual(products);

  const subtotal = data.items.reduce((acc, it) => acc + it.subtotal, 0);
  const total = Math.max(0, subtotal - data.diskon);
  const kembalian = Math.max(0, data.nominalBayar - total);
  const barangSummary = data.items.map((it) => `${it.nama} ×${it.jumlah}`).join(", ");

  const updatedRecord: TransaksiJualRecord = {
    ...existing,
    pelanggan: data.pelanggan,
    items: data.items,
    barangRingkasan: barangSummary,
    subtotal,
    diskon: data.diskon,
    total,
    nominalBayar: data.nominalBayar,
    kembalian,
    metodeBayar: data.metodeBayar,
    catatan: data.catatan !== undefined ? data.catatan : existing.catatan,
    kasir: data.kasir || existing.kasir,
  };

  saveOrUpdateTransaksiJual(updatedRecord);
  return updatedRecord;
}
