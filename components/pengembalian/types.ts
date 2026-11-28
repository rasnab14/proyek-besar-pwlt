// components/pengembalian/types.ts
/**
 * Types & Domain Interfaces for Pengembalian (Return Management & Rental Tracking)
 * Sesuai KEBUTUHAN-FUNGSIONAL.md §H & §I, ALUR-NAVIGASI.md
 */

export type StatusMasaSewa = "sedang_disewa" | "mendekati_tempo" | "terlambat" | "selesai";

export interface PengembalianItem {
  id: string;
  nama: string;
  kategori: string;
  jumlah: number;
  kondisiAwal: string;
  kondisiKembali?: "tersedia" | "dicuci" | "persiapan" | "rusak" | "perawatan";
  catatanKondisi?: string;
}

export interface PengembalianBiayaTambahan {
  id: string;
  jenis: "keterlambatan" | "kerusakan" | "kehilangan" | "lainnya";
  keterangan: string;
  nominal: number;
}
