// components/pengembalian/pengembalianStore.ts
import { TransaksiSewaRecord, StatusPengembalian } from "@/components/transaksi/types";
import { getStoredTransaksiSewa, saveOrUpdateTransaksiSewa } from "@/components/transaksi/sewaStore";
import { StatusMasaSewa } from "./types";

/**
 * Menghitung sisa hari dan status masa sewa secara real-time
 * Berdasarkan tanggal selesai sewa (jam batas 21.00 WIB)
 */
export function hitungMasaSewa(tglSelesai: string, statusPengembalian: StatusPengembalian): {
  statusMasaSewa: StatusMasaSewa;
  sisaHari: number;
  hariTerlambat: number;
  badgeLabel: string;
  badgeClass: string;
} {
  if (statusPengembalian === "seluruhnya") {
    return {
      statusMasaSewa: "selesai",
      sisaHari: 0,
      hariTerlambat: 0,
      badgeLabel: "Selesai (Sudah Kembali)",
      badgeClass: "tx-dot-green",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = tglSelesai.split("-").map(Number);
  const targetDate = new Date(y, m - 1, d);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const terlambat = Math.abs(diffDays);
    return {
      statusMasaSewa: "terlambat",
      sisaHari: 0,
      hariTerlambat: terlambat,
      badgeLabel: `Terlambat ${terlambat} Hari`,
      badgeClass: "tx-dot-red",
    };
  } else if (diffDays <= 1) {
    return {
      statusMasaSewa: "mendekati_tempo",
      sisaHari: diffDays,
      hariTerlambat: 0,
      badgeLabel: diffDays === 0 ? "Jatuh Tempo Hari Ini" : "Mendekati Jatuh Tempo (H-1)",
      badgeClass: "tx-dot-amber",
    };
  } else {
    return {
      statusMasaSewa: "sedang_disewa",
      sisaHari: diffDays,
      hariTerlambat: 0,
      badgeLabel: `Masa Sewa Sisa ${diffDays} Hari`,
      badgeClass: "tx-dot-blue",
    };
  }
}

/**
 * Menyelesaikan proses pengembalian barang dan menyelaraskan ke sewaStore
 */
export function selesaikanPengembalian(
  trxId: string,
  data: {
    statusPengembalian: StatusPengembalian;
    biayaTambahan?: number;
    biayaTambahanKet?: string;
    catatan?: string;
    kembalikanJaminan: boolean;
  }
) {
  const all = getStoredTransaksiSewa();
  const tx = all.find((t) => t.id === trxId || t.kode.toLowerCase() === trxId.toLowerCase());
  if (!tx) return null;

  tx.statusPengembalian = data.statusPengembalian;
  if (data.biayaTambahan !== undefined && data.biayaTambahan > 0) {
    tx.biayaTambahan = (tx.biayaTambahan || 0) + data.biayaTambahan;
    tx.biayaTambahanKet = data.biayaTambahanKet || "Biaya keterlambatan/kerusakan";
    tx.totalTagihan = (tx.totalTagihan || 0) + data.biayaTambahan;
  }

  if (data.statusPengembalian === "seluruhnya") {
    tx.statusOperasional = "selesai";
    tx.riwayat.unshift({
      waktu: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: "Admin Kasir",
      aksi: `Pengembalian Barang Selesai${data.kembalikanJaminan ? " & Jaminan Dikembalikan" : ""}`,
      catatan: data.catatan || "Barang telah selesai diperiksa dan dicatat di menu Pengembalian.",
    });
  } else {
    tx.riwayat.unshift({
      waktu: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: "Admin Kasir",
      aksi: "Pengembalian Barang Sebagian",
      catatan: data.catatan || "Sebagian unit telah dikembalikan, sebagian masih berada di pelanggan.",
    });
  }

  saveOrUpdateTransaksiSewa(tx);
  return tx;
}
