// components/booking/create/BookingSuccessModal.tsx
"use client";

import React from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { CustomerData, CartItem } from "./types";

function formatDateShort(dateStr: string): string {
  if (!dateStr) return "-";
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${d} ${months[m - 1]} ${y}`;
}

interface BookingSuccessModalProps {
  isOpen: boolean;
  bookingCode: string;
  customer: CustomerData | null;
  cart: CartItem[];
  tanggalBooking: string;
  tanggalMulaiSewa: string;
  durasiHari: number;
  tanggalSelesaiSewa: string;
  totalBiaya: number;
  dpNominal: number;
  sisaPembayaran: number;
  isDraft?: boolean;
  onReset: () => void;
}

export function BookingSuccessModal({
  isOpen,
  bookingCode,
  customer,
  cart,
  tanggalBooking,
  tanggalMulaiSewa,
  durasiHari,
  tanggalSelesaiSewa,
  totalBiaya,
  dpNominal,
  sisaPembayaran,
  isDraft = false,
  onReset,
}: BookingSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-container"
        style={{ maxWidth: "540px" }}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="modal-header"
          style={{
            background: isDraft ? "#F3F4F6" : "#F0FDF4",
            borderBottomColor: isDraft ? "#E5E7EB" : "#BBF7D0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px", color: isDraft ? "#4B5563" : "#16A34A" }}>
              {isDraft ? "📝" : "✓"}
            </span>
            <h2
              className="modal-title"
              style={{ color: isDraft ? "#1F2937" : "#166534", fontSize: "16px" }}
            >
              {isDraft
                ? `Draft Booking Berhasil Disimpan (${bookingCode})`
                : `Booking Berhasil Dicatat (${bookingCode})`}
            </h2>
          </div>
        </div>

        <div className="modal-body" style={{ gap: "16px" }}>
          <p style={{ margin: 0, fontSize: "13.5px", color: "#374151" }}>
            {isDraft
              ? "Data booking draft telah berhasil disimpan. Anda dapat membukanya kembali kapan saja melalui tombol Lanjutkan di Daftar Booking."
              : "Pemesanan barang sewa telah berhasil disepakati dan dicatat resmi. Booking berstatus Selesai ini siap diproses lebih lanjut melalui menu Transaksi Penyewaan."}
          </p>

          <div className="detail-info-grid">
            <div className="detail-info-item">
              <span className="dii-label">Pelanggan</span>
              <span className="dii-val">{customer?.nama} ({customer?.telepon})</span>
            </div>
            <div className="detail-info-item">
              <span className="dii-label">Tanggal Booking</span>
              <span className="dii-val">{formatDateShort(tanggalBooking)}</span>
            </div>
            <div className="detail-info-item">
              <span className="dii-label">Tanggal Mulai Sewa</span>
              <span className="dii-val">{formatDateShort(tanggalMulaiSewa)}</span>
            </div>
            <div className="detail-info-item">
              <span className="dii-label">Durasi Sewa</span>
              <span className="dii-val">{durasiHari} Hari</span>
            </div>
            <div className="detail-info-item">
              <span className="dii-label">Tanggal Selesai Sewa</span>
              <span className="dii-val" style={{ color: "#0284C7", fontWeight: 700 }}>
                {formatDateShort(tanggalSelesaiSewa)}
              </span>
            </div>
            <div className="detail-info-item">
              <span className="dii-label">Total Barang</span>
              <span className="dii-val">{cart.reduce((a, b) => a + b.jumlah, 0)} unit</span>
            </div>
          </div>

          <div className="detail-financial-summary">
            <div className="dfs-row">
              <span>Total Biaya Sewa:</span>
              <span style={{ fontWeight: 700 }}>{formatRupiah(totalBiaya)}</span>
            </div>
            <div className="dfs-row">
              <span>DP yang Diterima:</span>
              <span style={{ fontWeight: 700, color: "var(--acc-t)" }}>{formatRupiah(dpNominal)}</span>
            </div>
            <div className="dfs-row total">
              <span>Sisa Pelunasan Saat Ambil:</span>
              <span style={{ color: "#111827" }}>{formatRupiah(sisaPembayaran)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: "space-between" }}>
          <button type="button" className="btn sm" onClick={onReset}>
            + Catat Booking Baru
          </button>
          <Link href="/admin/booking" className="btn pri sm">
            Lihat di Daftar Booking →
          </Link>
        </div>
      </div>
    </div>
  );
}
