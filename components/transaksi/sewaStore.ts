// components/transaksi/sewaStore.ts
/**
 * Shared storage layer for Transaksi Penyewaan (Rental Transactions) between Admin & Owner.
 * Synchronizes with Booking, Pelanggan, and Stock single source of truth.
 * Sesuai KEBUTUHAN-FUNGSIONAL.md §F.1
 */

import { TransaksiSewaRecord, SewaItem, MetodePembayaran } from "./types";
import { INITIAL_TRANSAKSI_SEWA } from "./mockData";
import { BookingRecord } from "@/components/booking/types";
import { getStoredBookings, saveOrUpdateBooking } from "@/components/booking/bookingStore";

const STORAGE_KEY = "summit_transaksi_sewa_data";

export function getStoredTransaksiSewa(): TransaksiSewaRecord[] {
  if (typeof window === "undefined") {
    return INITIAL_TRANSAKSI_SEWA;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRANSAKSI_SEWA));
      return INITIAL_TRANSAKSI_SEWA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TRANSAKSI_SEWA;
  } catch {
    return INITIAL_TRANSAKSI_SEWA;
  }
}

export function getTransaksiByIdOrKode(idOrKode: string): TransaksiSewaRecord | undefined {
  const list = getStoredTransaksiSewa();
  const search = idOrKode.toLowerCase().trim();
  return list.find((t) => t.id.toLowerCase() === search || t.kode.toLowerCase() === search);
}

export function saveOrUpdateTransaksiSewa(tx: TransaksiSewaRecord): void {
  if (typeof window === "undefined") return;
  try {
    const list = getStoredTransaksiSewa();
    const idx = list.findIndex(
      (t) => t.id === tx.id || t.kode.toLowerCase() === tx.kode.toLowerCase()
    );
    let updatedList: TransaksiSewaRecord[];
    if (idx >= 0) {
      updatedList = [...list];
      updatedList[idx] = tx;
    } else {
      updatedList = [tx, ...list];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event("summit_transaksi_updated"));
  } catch (err) {
    console.error("Failed to save transaction to storage:", err);
  }
}

/**
 * Update data transaksi penyewaan yang belum serah terima.
 * Menjamin sinkronisasi dua arah dengan booking asal jika berasal dari booking (§F.1.B).
 */
export function updateExistingTransaksiSewa(
  tx: TransaksiSewaRecord,
  syncWithOriginBooking: boolean = true
): { success: boolean; message?: string } {
  if (typeof window === "undefined") return { success: false, message: "Window undefined" };
  try {
    const list = getStoredTransaksiSewa();
    const existing = list.find((t) => t.id === tx.id || t.kode.toLowerCase() === tx.kode.toLowerCase());
    if (!existing) {
      return { success: false, message: "Transaksi tidak ditemukan." };
    }

    // Validasi Keamanan Data (§E): Transaksi yang sudah serah terima TIDAK BISA diubah
    if (existing.statusPengambilan === "sudah_diambil") {
      return {
        success: false,
        message: "Transaksi yang sudah serah terima tidak dapat diubah.",
      };
    }

    // Catat log audit pembaruan transaksi
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updatedRiwayat = [
      ...(existing.riwayat || []),
      {
        waktu: nowStr,
        user: tx.dibuatOleh || "Admin Toko",
        aksi: "Data Transaksi Diubah Sebelum Serah Terima",
        catatan: `Total tagihan: Rp ${tx.totalTagihan.toLocaleString("id-ID")}, durasi: ${tx.durasiHari} hari, ${tx.items.length} item.`,
      },
    ];

    const updatedTxRecord: TransaksiSewaRecord = {
      ...tx,
      riwayat: updatedRiwayat,
    };

    // Sinkronisasi dengan booking asal jika transaksi berasal dari Booking (§F.1.B)
    if (syncWithOriginBooking && tx.tipeAsal === "booking" && tx.bookingId) {
      const bookings = getStoredBookings();
      const originBooking = bookings.find(
        (b) => b.id === tx.bookingId || b.kode === tx.bookingKode
      );
      if (originBooking) {
        originBooking.items = tx.items.map((it) => ({
          id: it.id,
          nama: it.nama,
          tipe: it.tipe === "paket" ? "paket" : "satuan",
          kategori: it.kategori,
          jumlah: it.jumlah,
          hargaPerHari: it.hargaPerHari,
          subtotal: it.subtotal,
          itemsPaket: it.rincianPaket,
        }));
        originBooking.durasiHari = tx.durasiHari;
        originBooking.tanggalMulaiSewa = tx.tglMulai;
        originBooking.tanggalPengambilan = tx.tglMulai;
        originBooking.tanggalPengembalian = tx.tglSelesai;
        originBooking.tanggalSelesaiSewa = tx.tglSelesai;
        originBooking.totalBiaya = tx.totalTagihan;
        originBooking.sisaPelunasan = Math.max(0, tx.totalTagihan - originBooking.dpNominal);
        originBooking.riwayat.push({
          waktu: nowStr,
          user: tx.dibuatOleh || "Admin Toko",
          aksi: `Data Diperbarui Sinkron dari Transaksi ${tx.kode}`,
          catatan: `Perubahan produk, durasi, tanggal sewa, dan total harga disinkronkan secara otomatis.`,
        });
        saveOrUpdateBooking(originBooking);
      }
    }

    saveOrUpdateTransaksiSewa(updatedTxRecord);
    return { success: true };
  } catch (err) {
    console.error("Gagal memperbarui transaksi sewa:", err);
    return { success: false, message: "Terjadi kesalahan sistem saat memperbarui transaksi." };
  }
}

/**
 * Hapus Transaksi Penyewaan yang belum serah terima (§F.1.A & §F.1.D).
 * Mengembalikan alokasi stok produk dan merekonsiliasi booking asal jika ada.
 */
export function deleteTransaksiSewa(id: string): { success: boolean; message?: string } {
  if (typeof window === "undefined") return { success: false, message: "Window undefined" };
  try {
    const list = getStoredTransaksiSewa();
    const tx = list.find((t) => t.id === id || t.kode.toLowerCase() === id.toLowerCase());
    if (!tx) {
      return { success: false, message: "Transaksi tidak ditemukan." };
    }

    // Validasi Keamanan Data (§E): Transaksi yang sudah serah terima TIDAK BISA dihapus
    if (tx.statusPengambilan === "sudah_diambil") {
      return {
        success: false,
        message: "Transaksi yang sudah serah terima tidak dapat dihapus. Stok sedang aktif disewa pelanggan.",
      };
    }

    // Jika transaksi berasal dari booking, catat rekonsiliasi pembatalan transaksi di booking
    if (tx.tipeAsal === "booking" && tx.bookingId) {
      const bookings = getStoredBookings();
      const originBooking = bookings.find(
        (b) => b.id === tx.bookingId || b.kode === tx.bookingKode
      );
      if (originBooking) {
        originBooking.riwayat.push({
          waktu: new Date().toISOString().replace("T", " ").substring(0, 16),
          user: "Admin Toko",
          aksi: `Alokasi Transaksi ${tx.kode} Dihapus/Dibatalkan`,
          catatan: "Transaksi dihapus sebelum serah terima. Status booking tetap terjaga.",
        });
        saveOrUpdateBooking(originBooking);
      }
    }

    // Hapus dari daftar transaksi sewa aktif (otomatis mengembalikan stok yang dialokasikan)
    const updatedList = list.filter((t) => t.id !== tx.id && t.kode.toLowerCase() !== tx.kode.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event("summit_transaksi_updated"));

    return { success: true };
  } catch (err) {
    console.error("Gagal menghapus transaksi sewa:", err);
    return { success: false, message: "Terjadi kesalahan sistem saat menghapus transaksi." };
  }
}

export function generateNextTransaksiKode(): string {
  const list = getStoredTransaksiSewa();
  let maxNum = 414;
  list.forEach((t) => {
    const match = t.kode.match(/TS-0*(\d+)/i);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > maxNum) maxNum = n;
    }
  });
  return `TS-${String(maxNum + 1).padStart(4, "0")}`;
}

/**
 * Buat Transaksi Penyewaan dari Booking (hanya berstatus 'selesai')
 * Sesuai §F.1.2, §F.1.8, §F.1.17, §F.1.19
 */
export function createTransaksiFromBooking(
  booking: BookingRecord,
  jaminanFisik: string = "",
  metodePelunasan: MetodePembayaran = "tunai",
  adminName: string = "Admin Toko",
  sudahDiambil: boolean = true
): TransaksiSewaRecord {
  const nextKode = generateNextTransaksiKode();
  const now = new Date();
  const nowStr = now.toISOString().replace("T", " ").substring(0, 16);

  // Buat ringkasan barang di pelanggan
  const barangSummary = booking.items
    .map((it) => `${it.nama} ×${it.jumlah}`)
    .join(", ");

  const sisa = sudahDiambil ? 0 : Math.max(0, booking.totalBiaya - booking.dpNominal);
  const statusSewa = sisa === 0 ? "lunas" : "belum_lunas";

  const newTx: TransaksiSewaRecord = {
    id: nextKode.toLowerCase(),
    kode: nextKode,
    bookingId: booking.id,
    bookingKode: booking.kode,
    bookingTag: `dari ${booking.kode}`,
    tipeAsal: "booking",
    pelanggan: {
      nama: booking.pelanggan.nama,
      telepon: booking.pelanggan.telepon,
      alamat: booking.pelanggan.alamat || "Sumedang",
    },
    tglMulai: booking.tanggalPengambilan,
    tglSelesai: booking.tanggalPengembalian,
    durasiHari: booking.durasiHari,
    periodeDisplay: `${formatShortDate(booking.tanggalPengambilan)} - ${formatShortDate(booking.tanggalPengembalian)}`,
    items: booking.items.map((it) => ({
      id: it.id,
      nama: it.nama,
      tipe: it.tipe === "paket" ? "paket" : "satuan",
      kategori: it.kategori,
      jumlah: it.jumlah,
      hargaPerHari: it.hargaPerHari,
      subtotal: it.subtotal,
      rincianPaket: it.itemsPaket,
    })),
    barangDiPelanggan: barangSummary,
    totalTagihan: booking.totalBiaya,
    dpNominal: booking.dpNominal,
    sisaTagihan: sisa,
    statusPengambilan: sudahDiambil ? "sudah_diambil" : "belum_diambil",
    status: statusSewa,
    statusPembayaran: statusSewa,
    statusPengembalian: "belum_dikembalikan",
    tglKembaliDisplay: `${formatShortDate(booking.tanggalPengembalian)} (s.d. 21.00)`,
    tglDiambilDisplay: sudahDiambil ? formatShortDate(now.toISOString().substring(0, 10)) : "-",
    jaminanFisik: jaminanFisik || undefined,
    metodePelunasan: sudahDiambil ? metodePelunasan : undefined,
    waktuPengambilanAktual: sudahDiambil ? nowStr : undefined,
    dibuatOleh: adminName,
    waktuDibuat: nowStr,
    riwayat: [
      {
        waktu: nowStr,
        user: adminName,
        aksi: sudahDiambil
          ? `Serah Terima & Pelunasan dari Booking ${booking.kode}`
          : `Konversi Transaksi dari Booking ${booking.kode} (Menunggu Serah Terima)`,
        catatan: sudahDiambil
          ? `Sisa tagihan Rp ${(booking.totalBiaya - booking.dpNominal).toLocaleString("id-ID")} dilunasi via ${metodePelunasan.toUpperCase()}. Jaminan: ${jaminanFisik}`
          : `Transaksi dibuat dari booking, sisa tagihan Rp ${sisa.toLocaleString("id-ID")} menunggu pelunasan saat serah terima.`,
      },
    ],
  };

  // Simpan transaksi
  saveOrUpdateTransaksiSewa(newTx);

  // Update audit log di booking
  booking.riwayat = [
    {
      waktu: nowStr,
      user: adminName,
      aksi: `Dikonversi ke Transaksi Penyewaan ${nextKode}`,
      catatan: sudahDiambil
        ? "Barang fisik diserahkan dan sisa tagihan dilunasi"
        : "Transaksi penyewaan telah dibuat, menunggu serah terima barang fisik",
    },
    ...(booking.riwayat || []),
  ];
  if (sudahDiambil) {
    booking.isTodayPickup = false;
    booking.sisaPelunasan = 0;
  }
  saveOrUpdateBooking(booking);

  return newTx;
}

/**
 * Buat Transaksi Penyewaan Langsung Walk-in
 * Sesuai §F.1.2, §F.1.8, §F.1.31
 */
export function createTransaksiLangsung(data: {
  pelanggan: { nama: string; telepon: string; alamat?: string };
  tglMulai: string;
  durasiHari: number;
  items: SewaItem[];
  jaminanFisik?: string;
  metodePembayaran?: MetodePembayaran;
  adminName?: string;
  statusPengambilan?: "belum_diambil" | "sudah_diambil";
}): TransaksiSewaRecord {
  const nextKode = generateNextTransaksiKode();
  const now = new Date();
  const nowStr = now.toISOString().replace("T", " ").substring(0, 16);

  const admin = data.adminName || "Admin Toko";
  const startDate = new Date(data.tglMulai);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + data.durasiHari);
  const tglSelesai = endDate.toISOString().substring(0, 10);

  const total = data.items.reduce((acc, it) => acc + it.subtotal, 0);
  const barangSummary = data.items.map((it) => `${it.nama} ×${it.jumlah}`).join(", ");
  const isSudahDiambil = data.statusPengambilan !== "belum_diambil";

  const newTx: TransaksiSewaRecord = {
    id: nextKode.toLowerCase(),
    kode: nextKode,
    bookingTag: "langsung",
    tipeAsal: "langsung",
    pelanggan: data.pelanggan,
    tglMulai: data.tglMulai,
    tglSelesai: tglSelesai,
    durasiHari: data.durasiHari,
    periodeDisplay: `${formatShortDate(data.tglMulai)} - ${formatShortDate(tglSelesai)}`,
    items: data.items,
    barangDiPelanggan: barangSummary,
    totalTagihan: total,
    dpNominal: 0,
    sisaTagihan: isSudahDiambil ? 0 : total,
    statusPengambilan: isSudahDiambil ? "sudah_diambil" : "belum_diambil",
    status: isSudahDiambil ? "lunas" : "belum_lunas",
    statusPembayaran: isSudahDiambil ? "lunas" : "belum_lunas",
    statusPengembalian: "belum_dikembalikan",
    tglKembaliDisplay: `${formatShortDate(tglSelesai)} (s.d. 21.00)`,
    tglDiambilDisplay: isSudahDiambil ? formatShortDate(data.tglMulai) : "-",
    jaminanFisik: data.jaminanFisik,
    metodePelunasan: isSudahDiambil ? data.metodePembayaran : undefined,
    waktuPengambilanAktual: isSudahDiambil ? nowStr : undefined,
    dibuatOleh: admin,
    waktuDibuat: nowStr,
    riwayat: [
      {
        waktu: nowStr,
        user: admin,
        aksi: isSudahDiambil
          ? "Transaksi Langsung Walk-in Selesai & Diserahkan"
          : "Transaksi Langsung Dibuat (Menunggu Serah Terima)",
        catatan: isSudahDiambil
          ? `Total ${total.toLocaleString("id-ID")} lunas via ${data.metodePembayaran?.toUpperCase() || "TUNAI"}. Jaminan: ${data.jaminanFisik || "-"}`
          : `Tagihan Rp ${total.toLocaleString("id-ID")} menunggu serah terima & pelunasan kasir.`,
      },
    ],
  };

  saveOrUpdateTransaksiSewa(newTx);
  return newTx;
}

/**
 * Format tanggal pendek untuk tampilan tabel (misal "2 Nov", "30 Okt")
 */
function formatShortDate(dateStr: string): string {
  if (!dateStr) return "-";
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getDate()} ${months[d.getMonth()]}`;
  } catch {
    return dateStr;
  }
}
