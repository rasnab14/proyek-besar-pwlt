// components/booking/create/BookingPaymentCard.tsx
"use client";

import React from "react";
import { PaymentMethod } from "./types";
import { formatRupiah } from "@/lib/format";

interface BookingPaymentCardProps {
  totalBiaya: number;
  dpWajib: number;
  hDiff: number;
  nominalDpDisepakati: number;
  onNominalDpDisepakatiChange: (val: number) => void;
  dpDiterimaSekarang: number;
  onDpDiterimaSekarangChange: (val: number) => void;
  metodePembayaran: PaymentMethod;
  onMetodePembayaranChange: (method: PaymentMethod) => void;
  onSubmitBooking: () => void;
  onSaveDraft?: () => void;
  isDraftEdit?: boolean;
  isSubmitting?: boolean;
}

export function BookingPaymentCard({
  totalBiaya,
  dpWajib,
  hDiff,
  nominalDpDisepakati,
  onNominalDpDisepakatiChange,
  dpDiterimaSekarang,
  onDpDiterimaSekarangChange,
  metodePembayaran,
  onMetodePembayaranChange,
  onSubmitBooking,
  onSaveDraft,
  isDraftEdit = false,
  isSubmitting = false,
}: BookingPaymentCardProps) {
  const sisaPembayaran = Math.max(0, totalBiaya - dpDiterimaSekarang);

  // Validation: Nominal DP disepakati < DP wajib (hanya berlaku jika ada kewajiban DP)
  const isUnderDpWajib = dpWajib > 0 && nominalDpDisepakati < dpWajib;

  // Dynamic Payment Status
  let statusText = "Belum dibayar";
  let statusClass = "unpaid";

  if (totalBiaya === 0) {
    statusText = "Belum dibayar";
    statusClass = "unpaid";
  } else if (dpDiterimaSekarang >= totalBiaya) {
    statusText = "Lunas";
    statusClass = "paid";
  } else if (dpDiterimaSekarang > 0) {
    if (nominalDpDisepakati > 0 && dpDiterimaSekarang >= nominalDpDisepakati) {
      statusText = "DP Lunas";
      statusClass = "partial";
    } else {
      statusText = "DP Sebagian";
      statusClass = "partial";
    }
  } else {
    statusText = "Belum dibayar";
    statusClass = "unpaid";
  }

  return (
    <div className="bc-card">
      <div className="bc-card-header">
        <h2 className="bc-card-title">Pembayaran</h2>
      </div>

      {/* Blue Calculation Banner (§4 & Reference Screenshot) */}
      {hDiff >= 2 ? (
        <div className="bc-pay-banner">
          Sistem mendeteksi booking <strong>H-{hDiff}</strong>. Ketentuan DP 25% dari total biaya penyewaan {formatRupiah(totalBiaya)} ={" "}
          <strong>{formatRupiah(dpWajib)}</strong>. Berlaku untuk booking minimal H-2 sebelum tanggal mulai sewa.
        </div>
      ) : (
        <div className="bc-pay-banner" style={{ background: "#F0FDF4", borderColor: "#BBF7D0", color: "#166534" }}>
          Sistem mendeteksi booking <strong>{hDiff === 1 ? "H-1" : "Hari-H"}</strong>. DP tidak wajib (<strong>Rp 0</strong>). Pembayaran penuh dapat diselesaikan saat pengambilan barang di toko.
        </div>
      )}

      {/* DP Wajib Row */}
      <div className="bc-pay-row">
        <span style={{ color: "#4B5563" }}>
          DP wajib ({hDiff >= 2 ? "25% × total penyewaan" : "0% / tidak wajib"})
        </span>
        <span style={{ fontWeight: 700, color: "#111827" }}>{formatRupiah(dpWajib)}</span>
      </div>

      {/* Input: Nominal DP Disepakati */}
      <div className="bc-pay-input-group">
        <label className="bc-form-label">Nominal DP disepakati</label>
        <input
          type="number"
          min={0}
          max={totalBiaya || 9999999}
          className={`bc-pay-input ${isUnderDpWajib ? "input-warning" : ""}`}
          value={nominalDpDisepakati}
          onChange={(e) => onNominalDpDisepakatiChange(Math.max(0, parseInt(e.target.value) || 0))}
        />
        {isUnderDpWajib ? (
          <div className="bc-pay-warning">
            ⚠️ Nominal DP yang disepakati ({formatRupiah(nominalDpDisepakati)}) lebih rendah dari ketentuan DP wajib ({formatRupiah(dpWajib)}).
          </div>
        ) : hDiff >= 2 ? (
          <div className="bc-pay-helper">
            Dihitung 25% dari harga sewa awal ({formatRupiah(dpWajib)}).
          </div>
        ) : (
          <div className="bc-pay-helper">
            Booking H-1 / Hari-H tidak mewajibkan DP (dapat diisi Rp 0 atau sesuai kesepakatan).
          </div>
        )}
      </div>

      {/* Input: DP Diterima Sekarang */}
      <div className="bc-pay-input-group">
        <label className="bc-form-label">DP diterima sekarang</label>
        <input
          type="number"
          min={0}
          max={totalBiaya || 9999999}
          className="bc-pay-input"
          value={dpDiterimaSekarang}
          onChange={(e) => onDpDiterimaSekarangChange(Math.max(0, parseInt(e.target.value) || 0))}
        />
        <div className="bc-pay-helper">
          Masukkan nominal pembayaran yang benar-benar diterima saat ini.
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="bc-pay-input-group">
        <label className="bc-form-label">Metode pembayaran</label>
        <div className="bc-methods-seg">
          <button
            type="button"
            className={`bc-method-btn ${metodePembayaran === "tunai" ? "active" : ""}`}
            onClick={() => onMetodePembayaranChange("tunai")}
          >
            Tunai
          </button>
          <button
            type="button"
            className={`bc-method-btn ${metodePembayaran === "qris" ? "active" : ""}`}
            onClick={() => onMetodePembayaranChange("qris")}
          >
            QRIS
          </button>
          <button
            type="button"
            className={`bc-method-btn ${metodePembayaran === "transfer" ? "active" : ""}`}
            onClick={() => onMetodePembayaranChange("transfer")}
          >
            Transfer
          </button>
        </div>
      </div>

      {/* Sisa Pembayaran Row */}
      <div className="bc-pay-row" style={{ marginTop: "14px" }}>
        <span style={{ color: "#4B5563" }}>Sisa pembayaran</span>
        <span style={{ fontWeight: 700, color: "#111827" }}>{formatRupiah(sisaPembayaran)}</span>
      </div>

      {/* Status Pembayaran Row */}
      <div className="bc-pay-row" style={{ marginBottom: "18px" }}>
        <span style={{ color: "#4B5563" }}>Status pembayaran</span>
        <span className={`bc-status-pill ${statusClass}`}>{statusText}</span>
      </div>

      {/* Action Buttons: Selesaikan Booking & Simpan Draft */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          type="button"
          className="bc-submit-btn"
          disabled={isSubmitting}
          onClick={onSubmitBooking}
          style={{ width: "100%" }}
        >
          {isSubmitting ? "Memproses Booking..." : "Selesaikan Booking"}
        </button>

        {onSaveDraft && (
          <button
            type="button"
            className="btn sm"
            style={{
              width: "100%",
              height: "40px",
              justifyContent: "center",
              border: "1px solid #D1D5DB",
              background: "#F9FAFB",
              color: "#374151",
              fontWeight: 600,
            }}
            disabled={isSubmitting}
            onClick={onSaveDraft}
          >
            {isDraftEdit ? "Simpan Perubahan Draft" : "Simpan sebagai Draft"}
          </button>
        )}
      </div>
    </div>
  );
}
