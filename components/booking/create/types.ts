// components/booking/create/types.ts

export interface CustomerData {
  id: string;
  nama: string;
  telepon: string;
  alamat?: string;
  catatan?: string;
}

export interface CatalogProduct {
  id: string;
  kode: string; // SKU e.g. CR4, CR6, DM2
  nama: string;
  tipe: "satuan" | "paket";
  kategori: string;
  hargaPerHari: number;
  totalUnit: number;
  unitTersedia: number;
  deskripsi?: string;
  itemsPaket?: string[];
  iconType: "tenda" | "tas" | "masak" | "tidur" | "aksesoris" | "paket";
}

export interface CartItem {
  id: string;
  kode: string;
  nama: string;
  tipe: "satuan" | "paket";
  kategori: string;
  hargaPerHari: number;
  jumlah: number;
  unitTersedia: number;
  subtotal: number;
  itemsPaket?: string[];
}

export type PaymentMethod = "tunai" | "qris" | "transfer";

export interface BookingFormState {
  customer: CustomerData | null;
  tanggalBooking: string; // YYYY-MM-DD
  tanggalMulaiSewa: string; // YYYY-MM-DD (rencana mulai sewa)
  durasiHari: number;
  tanggalSelesaiSewa: string; // YYYY-MM-DD (calculated: tanggalMulaiSewa + durasiHari)
  cart: CartItem[];
  nominalDpDisepakati: number;
  dpDiterimaSekarang: number;
  metodePembayaran: PaymentMethod;
  catatan?: string;
}
