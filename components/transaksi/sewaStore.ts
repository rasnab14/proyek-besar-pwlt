// components/transaksi/sewaStore.ts
/**
 * Shared storage layer for Transaksi Penyewaan (Rental Transactions) between Admin & Owner.
 * Synchronizes with Booking, Pelanggan, and Stock single source of truth.
 * Sesuai KEBUTUHAN-FUNGSIONAL.md §F.1
 */

import { TransaksiSewaRecord, SewaItem, MetodePembayaran } from "./types";
import { INITIAL_TRANSAKSI_SEWA } from "./mockData";
import { BookingRecord } from "@/components/booking/types";
import { saveOrUpdateBooking } from "@/components/booking/bookingStore";

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
  jaminanFisik: string,
  metodePelunasan: MetodePembayaran,
  adminName: string = "Admin Toko"
): TransaksiSewaRecord {
  const nextKode = generateNextTransaksiKode();
  const now = new Date();
  const nowStr = now.toISOString().replace("T", " ").substring(0, 16);

  // Buat ringkasan barang di pelanggan
  const barangSummary = booking.items
    .map((it) => `${it.nama} ×${it.jumlah}`)
    .join(", ");

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
    sisaTagihan: 0, // Pelunasan dilakukan saat serah terima di toko (§F.1.19)
    statusPengambilan: "sudah_diambil",
    status: "lunas",
    statusPembayaran: "lunas",
    statusPengembalian: "belum_dikembalikan",
    tglKembaliDisplay: `${formatShortDate(booking.tanggalPengembalian)} (s.d. 21.00)`,
    tglDiambilDisplay: formatShortDate(now.toISOString().substring(0, 10)),
    jaminanFisik: jaminanFisik,
    metodePelunasan: metodePelunasan,
    waktuPengambilanAktual: nowStr,
    dibuatOleh: adminName,
    waktuDibuat: nowStr,
    riwayat: [
      {
        waktu: nowStr,
        user: adminName,
        aksi: `Serah Terima & Pelunasan dari Booking ${booking.kode}`,
        catatan: `Sisa tagihan Rp ${(booking.totalBiaya - booking.dpNominal).toLocaleString("id-ID")} dilunasi via ${metodePelunasan.toUpperCase()}. Jaminan: ${jaminanFisik}`,
      },
    ],
  };

  // Simpan transaksi
  saveOrUpdateTransaksiSewa(newTx);

  // Update audit log di booking
  booking.riwayat.push({
    waktu: nowStr,
    user: adminName,
    aksi: `Dilanjutkan ke Transaksi Penyewaan ${nextKode}`,
    catatan: "Barang diserahkan dan sisa tagihan dilunasi",
  });
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
  jaminanFisik: string;
  metodePembayaran: MetodePembayaran;
  adminName?: string;
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
    sisaTagihan: 0, // Transaksi langsung wajib langsung lunas di kasir saat serah terima
    statusPengambilan: "sudah_diambil",
    status: "lunas",
    statusPembayaran: "lunas",
    statusPengembalian: "belum_dikembalikan",
    tglKembaliDisplay: `${formatShortDate(tglSelesai)} (s.d. 21.00)`,
    tglDiambilDisplay: formatShortDate(data.tglMulai),
    jaminanFisik: data.jaminanFisik,
    metodePelunasan: data.metodePembayaran,
    waktuPengambilanAktual: nowStr,
    dibuatOleh: admin,
    waktuDibuat: nowStr,
    riwayat: [
      {
        waktu: nowStr,
        user: admin,
        aksi: "Transaksi Langsung Walk-in Dibuat",
        catatan: `Total ${total.toLocaleString("id-ID")} lunas via ${data.metodePembayaran.toUpperCase()}. Jaminan: ${data.jaminanFisik}`,
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
