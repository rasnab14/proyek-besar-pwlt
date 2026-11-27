// components/transaksi/types.ts
/**
 * Types and Domain Interfaces for Transaksi Penyewaan (Rental Transaction)
 * Sesuai KEBUTUHAN-FUNGSIONAL.md §F.1, ALUR-NAVIGASI.md, & Screenshot Referensi Admin/Owner
 */

export type StatusPengambilan = "belum_diambil" | "sudah_diambil";
export type StatusSewa = "lunas" | "belum_lunas";
export type StatusPembayaranSewa = StatusSewa; // Alias kompatibilitas
export type StatusPengembalian = "belum_dikembalikan" | "sebagian" | "seluruhnya";
export type MetodePembayaran = "tunai" | "qris" | "transfer";

export interface SewaItem {
  id: string;
  nama: string;
  tipe: "satuan" | "paket";
  kategori: string;
  jumlah: number;
  hargaPerHari: number;
  subtotal: number;
  rincianPaket?: string[];
}

export interface SewaCustomer {
  nama: string;
  telepon: string;
  alamat?: string;
  instansi?: string;
}

export interface SewaAuditLog {
  waktu: string;
  user: string;
  aksi: string;
  catatan?: string;
}

export interface TransaksiSewaRecord {
  id: string; // e.g. "ts-0413"
  kode: string; // e.g. "TS-0413"
  bookingId?: string; // Tautan relasi booking asal
  bookingKode?: string; // e.g. "BK-0242"
  bookingTag: string; // e.g. "dari BK-0242" | "dari BK-0245 · H-1" | "langsung"
  tipeAsal: "booking" | "langsung";
  pelanggan: SewaCustomer;
  tglMulai: string; // YYYY-MM-DD
  tglSelesai: string; // YYYY-MM-DD
  durasiHari: number;
  periodeDisplay: string; // e.g. "2 - 5 Nov"
  items: SewaItem[];
  barangDiPelanggan: string; // Teks ringkasan barang di pelanggan (untuk Owner view)
  totalTagihan: number;
  dpNominal: number; // 0 jika tanpa DP / langsung
  sisaTagihan: number; // totalTagihan - (dpNominal + pelunasan)
  statusPengambilan: StatusPengambilan;
  status: StatusSewa; // "lunas" | "belum_lunas"
  statusPembayaran?: StatusSewa;
  statusOperasional?: string;
  statusPengembalian: StatusPengembalian;
  terlambatHari?: number; // legacy/informational
  tglKembaliDisplay: string; // e.g. "31 Okt" | "2 Nov (s.d. 21.00)"
  tglDiambilDisplay?: string; // e.g. "28 Okt"
  biayaTambahan?: number; // misal 100000
  biayaTambahanKet?: string; // misal "(denda)"
  jaminanFisik?: string; // Ditulis manual oleh Admin, tanpa nomor jaminan (misal: "KTP Asli Rizky Ananda")
  metodePelunasan?: MetodePembayaran;
  waktuPengambilanAktual?: string; // YYYY-MM-DD HH:mm
  dibuatOleh: string;
  waktuDibuat: string;
  riwayat: SewaAuditLog[];
}

export interface SewaFilterState {
  searchQuery: string;
  status: string; // "semua" | "lunas" | "belum_lunas"
  dateRange: string;
}
