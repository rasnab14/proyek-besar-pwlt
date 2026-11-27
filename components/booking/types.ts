// components/booking/types.ts
/**
 * Types & Domain Interfaces for Booking Module (Admin Booking & Owner Monitoring)
 * Strict adherence to docs/KEBUTUHAN-FUNGSIONAL.md §E & ALUR-NAVIGASI.md
 */

export type BookingStatus = "draft" | "dikonfirmasi" | "selesai" | "dibatalkan";

export type DPStatus = "lunas" | "belum" | "tidak_perlu" | "hangus";

export type DPMethod = "tunai" | "qris" | "transfer";

export interface BookingCustomer {
  nama: string;
  telepon: string;
  noIdentitas: string; // KTP atau SIM
  alamat?: string;
}

export interface BookingItem {
  id: string;
  nama: string;
  tipe: "satuan" | "paket";
  kategori: string;
  jumlah: number;
  hargaPerHari: number;
  subtotal: number;
  deskripsi?: string;
  itemsPaket?: string[]; // Jika tipe === "paket", rincian komponen barang
}

export interface BookingAuditLog {
  waktu: string;
  user: string;
  aksi: string;
  catatan?: string;
}

export interface BookingRecord {
  id: string;
  kode: string; // e.g. BK-0245
  pelanggan: BookingCustomer;
  items: BookingItem[];
  tanggalPengambilan: string; // YYYY-MM-DD
  jamPengambilan: string; // e.g. "09:00 WIB"
  durasiHari: number;
  tanggalPengembalian: string; // YYYY-MM-DD
  jamPengembalian: string; // e.g. "20:00 WIB"
  totalBiaya: number;
  dpPersen: number; // default 25% jika >= H-2
  dpNominal: number;
  dpStatus: DPStatus;
  dpMetode?: DPMethod;
  sisaPelunasan: number;
  status: BookingStatus;
  catatan?: string;
  dibuatOleh: string;
  waktuDibuat: string;
  riwayat: BookingAuditLog[];
  alasanPembatalan?: string;
  waktuPembatalan?: string;
  userPembatalan?: string;
  isTodayPickup?: boolean; // Jadwal pengambilan hari ini
}

export interface CatalogItem {
  id: string;
  kode: string;
  nama: string;
  tipe: "satuan" | "paket";
  kategori: string;
  hargaPerHari: number;
  stokTersedia: number;
  deskripsi?: string;
  itemsPaket?: string[];
}

export interface BookingFilterState {
  searchQuery: string;
  status: string; // 'semua' | BookingStatus
  pickupDate: string; // YYYY-MM-DD
  dateRangeStart?: string;
  dateRangeEnd?: string;
}
