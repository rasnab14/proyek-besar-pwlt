// components/booking/BookingCancellationDialog.tsx
"use client";

import React, { useState } from "react";
import { BookingRecord } from "./types";
import { formatRupiah } from "@/lib/format";

interface BookingCancellationDialogProps {
  booking: BookingRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (bookingId: string, alasan: string) => void;
}

export function BookingCancellationDialog({
  booking,
  isOpen,
  onClose,
  onConfirmCancel,
}: BookingCancellationDialogProps) {
  const [alasan, setAlasan] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !booking) return null;

  const handleSubmit = () => {
    if (!alasan.trim() || alasan.trim().length < 5) {
      setError("Alasan pembatalan wajib diisi minimal 5 karakter.");
      return;
    }
    onConfirmCancel(booking.id, alasan.trim());
    setAlasan("");
    setError("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: "520px" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-dialog-title"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h2 id="cancel-dialog-title" className="modal-title" style={{ color: "var(--st-er)" }}>
              Batalkan Booking {booking.kode}
            </h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ gap: "16px" }}>
          <p style={{ margin: 0, fontSize: "13.5px", color: "var(--k)" }}>
            Anda akan membatalkan pemesanan booking untuk pelanggan{" "}
            <strong>{booking.pelanggan.nama}</strong>.
          </p>

          {/* SOP DP Hangus Warning (§E.19) */}
          <div className="note er" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
              <span>⚠️</span> PERINGATAN REGULASI &amp; KEBIJAKAN DP HANGUS (§E.19)
            </div>
            <div style={{ fontSize: "12.5px" }}>
              {booking.dpNominal > 0 && booking.dpStatus === "lunas" ? (
                <>
                  Pelanggan telah membayar uang muka (DP) sebesar{" "}
                  <strong>{formatRupiah(booking.dpNominal)}</strong>. Sesuai regulasi Summit Adventure,
                  DP tersebut dicatat sebagai <strong>dana yang tidak dikembalikan (hangus)</strong>.
                </>
              ) : (
                <>Booking ini belum memiliki pembayaran DP yang terverifikasi.</>
              )}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.9 }}>
              Alokasi stok barang sewa terkait akan dilepaskan kembali ke ketersediaan umum.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Alasan Pembatalan <span className="req">*</span>
            </label>
            {/* Quick Reason Templates */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
              <button
                type="button"
                className="btn xs"
                style={{ fontSize: "11px", padding: "3px 8px", background: "#F1F5F9", color: "#334155" }}
                onClick={() => {
                  setAlasan("Pelanggan tidak datang mengambil barang fisik hingga batas waktu pengambilan (No-Show).");
                  if (error) setError("");
                }}
              >
                + Tidak Datang (No-Show)
              </button>
              <button
                type="button"
                className="btn xs"
                style={{ fontSize: "11px", padding: "3px 8px", background: "#F1F5F9", color: "#334155" }}
                onClick={() => {
                  setAlasan("Permintaan pembatalan sepihak dari pelanggan.");
                  if (error) setError("");
                }}
              >
                + Batal dari Pelanggan
              </button>
              <button
                type="button"
                className="btn xs"
                style={{ fontSize: "11px", padding: "3px 8px", background: "#F1F5F9", color: "#334155" }}
                onClick={() => {
                  setAlasan("Kendala cuaca ekstrem / kondisi darurat di lokasi pendakian.");
                  if (error) setError("");
                }}
              >
                + Cuaca Ekstrem
              </button>
            </div>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Tuliskan atau pilih alasan pembatalan..."
              value={alasan}
              onChange={(e) => {
                setAlasan(e.target.value);
                if (error) setError("");
              }}
            />
            {error && <span style={{ fontSize: "11px", color: "var(--st-er-t)" }}>{error}</span>}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn sm" onClick={onClose}>
            Kembali
          </button>
          <button
            type="button"
            className="btn sm dng"
            onClick={handleSubmit}
            title="Konfirmasi pembatalan pemesanan"
          >
            Konfirmasi Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}
