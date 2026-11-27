// components/transaksi-jual/types.ts

export type MetodePembayaranJual = "tunai" | "qris" | "transfer";
export type StatusTransaksiJual = "selesai" | "dibatalkan";

export interface TransaksiJualItem {
  id: string;
  kode: string; // SKU
  nama: string;
  kategori: string;
  jumlah: number;
  hargaSatuan: number;
  subtotal: number;
}

export interface PelangganJual {
  id?: string;
  nama: string;
  telepon?: string;
  alamat?: string;
}

export interface TransaksiJualRecord {
  id: string;
  kode: string; // e.g. TJ-0127
  waktu: string; // ISO string or formatted
  pelanggan: PelangganJual;
  kasir: string;
  items: TransaksiJualItem[];
  barangRingkasan: string; // e.g. "Gas kaleng ×4, Pisau lipat ×1"
  subtotal: number;
  diskon: number;
  total: number;
  nominalBayar: number;
  kembalian: number;
  metodeBayar: MetodePembayaranJual;
  status: StatusTransaksiJual;
  catatan?: string;
}

export interface ProdukJualItem {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
  deskripsi?: string;
}

export interface JualFilterState {
  searchQuery: string;
  status: "semua" | "selesai" | "dibatalkan";
  metode: "semua" | "tunai" | "qris" | "transfer";
  dateRange: string;
}
