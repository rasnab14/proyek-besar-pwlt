// components/booking/RentalTransactionModal.tsx
"use client";

import React, { useState } from "react";
import { BookingRecord } from "./types";
import { formatRupiah, formatTanggal } from "@/lib/format";
import Link from "next/link";

interface RentalTransactionModalProps {
  booking: BookingRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteTransaction: (bookingId: string) => void;
}

export function RentalTransactionModal({
  booking,
  isOpen,
  onClose,
  onCompleteTransaction,
}: RentalTransactionModalProps) {
  const [metodePelunasan, setMetodePelunasan] = useState<"tunai" | "qris" | "transfer">("tunai");
  const [jenisJaminan, setJenisJaminan] = useState<"KTP" | "SIM" | "Kartu Mahasiswa">("KTP");
  const [noJaminan, setNoJaminan] = useState(booking?.pelanggan.noIdentitas || "");

  if (!isOpen || !booking) return null;

  const handleFinish = () => {
    onCompleteTransaction(booking.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: "580px" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rental-tx-title"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h2 id="rental-tx-title" className="modal-title">
              Proses Transaksi Sewa ({booking.kode})
            </h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ gap: "16px" }}>
          <div className="note ok">
            <div>
              <strong>Lanjut ke Transaksi Sewa (§E.24):</strong> Data pelanggan, barang sewa, dan periode telah otomatis terhubung dari booking {booking.kode} tanpa perlu input ulang.
            </div>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-item">
              <span className="dii-label">Pelanggan</span>
              <span className="dii-val">{booking.pelanggan.nama} ({booking.pelanggan.telepon})</span>
            </div>
            <div className="detail-info-item">
              <span className="dii-label">Jadwal Pengambilan</span>
              <span className="dii-val">{formatTanggal(booking.tanggalPengambilan)} · {booking.jamPengambilan}</span>
            </div>
            <div className="detail-info-item">
              <span className="dii-label">Durasi Sewa</span>
              <span className="dii-val">{booking.durasiHari} Hari (Kembali: {formatTanggal(booking.tanggalPengembalian)})</span>
            </div>
            <div className="detail-info-item">
              <span className="dii-label">Total Sewa</span>
              <span className="dii-val">{formatRupiah(booking.totalBiaya)}</span>
            </div>
          </div>

          {/* Sisa Pelunasan */}
          <div className="detail-financial-summary">
            <div className="dfs-row">
              <span>DP yang telah dibayar:</span>
              <span style={{ fontWeight: 600, color: "var(--acc-t)" }}>
                {formatRupiah(booking.dpNominal)} ({booking.dpMetode?.toUpperCase() || "LUNAS"})
              </span>
            </div>
            <div className="dfs-row total">
              <span>Tagihan Pelunasan Saat Ini:</span>
              <span style={{ color: "var(--st-ok-t)", fontSize: "16px" }}>
                {formatRupiah(booking.sisaPelunasan)}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Metode Pembayaran Pelunasan</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["tunai", "qris", "transfer"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`btn sm ${metodePelunasan === m ? "pri" : ""}`}
                  onClick={() => setMetodePelunasan(m)}
                  style={{ textTransform: "capitalize", flex: 1 }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group-grid">
            <div className="form-group">
              <label className="form-label">Jenis Identitas Jaminan</label>
              <select
                className="booking-select"
                value={jenisJaminan}
                onChange={(e) => setJenisJaminan(e.target.value as any)}
              >
                <option value="KTP">KTP Asli</option>
                <option value="SIM">SIM Asli</option>
                <option value="Kartu Mahasiswa">Kartu Mahasiswa (KTM)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nomor / Identitas Jaminan</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nomor identitas fisik ditahan"
                value={noJaminan}
                onChange={(e) => setNoJaminan(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn sm" onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn pri sm"
            style={{ background: "var(--st-ok)", borderColor: "var(--st-ok)" }}
            onClick={handleFinish}
          >
            ✓ Pelunasan Selesai &amp; Serahkan Barang
          </button>
        </div>
      </div>
    </div>
  );
}
