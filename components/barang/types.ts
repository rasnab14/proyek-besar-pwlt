// components/barang/types.ts
/**
 * Types & Domain Interfaces for Data Barang
 * Kategori Barang, Semua Barang, Paket Penyewaan
 * Sesuai KEBUTUHAN-FUNGSIONAL.md §C dan Screenshot Desain
 */

export type JenisBarang = "sewa" | "jual";

export interface VariasiBarang {
  id: string;
  namaVariasi: string; // e.g. "Rimba · M" | "Kapasitas 4P"
  merek?: string; // e.g. "Rimba", "Kelana"
  ukuran?: string; // e.g. "S", "M", "L", "XL", "XXL"
  kapasitas?: string; // e.g. "2P", "4P", "60L"
  jenisSpec?: string;
  kodeUnitRange?: string; // e.g. "JKT001–JKT008" | "SPT001–SPT008"
  spesifikasi: string; // e.g. "Merek Rimba, ukuran M"
  harga: number; // Harga sewa per hari atau harga jual
  stok: number; // Jumlah unit atau pcs
  batasStokMin?: number; // untuk barang jual
  satuan?: string; // e.g. "pcs", "unit", "kaleng"
  sku?: string; // e.g. "GAS-01"
  [key: string]: any;
}

export interface BarangRecord {
  id: string;
  kode: string; // e.g. "JKT", "SPT", "CRR", "GAS"
  nama: string; // e.g. "Jaket Gunung", "Tenda Dome", "Carrier", "Gas Kaleng 230 g"
  kategori: string; // e.g. "Pakaian", "Tenda", "Tas", "Alat masak", "Tidur", "Penerangan"
  jenis: JenisBarang; // "sewa" | "jual"
  informasiSpesifikasi?: string; // e.g. "Waterproof, bahan ripstop"
  deskripsi: string;
  foto?: string;
  rentangHargaDisplay: string; // e.g. "Rp 25.000 – 35.000 / hari"
  totalStokDisplay: string; // e.g. "38 unit" | "64 pcs"
  ringkasanVariasi: string; // e.g. "5 variasi · ukuran S–XXL, 2 merek"
  variasi: VariasiBarang[];
  terkaitTransaksi?: boolean; // Proteksi penghapusan (§C.17)
}

export interface KategoriRecord {
  id: string;
  nama: string; // e.g. "Tenda", "Tas", "Tidur", "Alat masak", "Penerangan", "Pakaian"
  deskripsi: string; // e.g. "Tenda dome dan tenda keluarga"
  jumlahBarang: number;
}

export interface PaketItem {
  barangId: string;
  namaBarang: string;
  jumlah: number;
}

export interface PaketRecord {
  id: string;
  kode: string; // e.g. "PKT-001"
  nama: string; // e.g. "Paket Pendakian 2 Orang"
  deskripsi: string;
  hargaPerHari: number;
  status: "aktif" | "nonaktif";
  barangPenyusun: string[]; // e.g. ["Tenda Dome 2P ×1", "Carrier 60L ×2", "Sleeping Bag ×2", "Matras ×2"]
  items?: PaketItem[];
  foto?: string; // image data URL, external URL, or preset
}
