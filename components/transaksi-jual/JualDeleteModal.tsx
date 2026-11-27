// components/transaksi-jual/JualDeleteModal.tsx
"use client";

import React from "react";
import { TransaksiJualRecord } from "./types";
import { deleteTransaksiJual } from "./jualStore";
import { formatRupiah } from "@/lib/format";

interface JualDeleteModalProps {
  isOpen: boolean;
  record: TransaksiJualRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function JualDeleteModal({
  isOpen,
  record,
  onClose,
  onSuccess,
}: JualDeleteModalProps) {
  if (!isOpen || !record) return null;

  const handleDelete = () => {
    deleteTransaksiJual(record.id);
    onSuccess();
    onClose();
  };

  return (
    <div className="tx-modal-overlay" onClick={onClose}>
      <div
        className="tx-modal-container"
        style={{ maxWidth: "440px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tx-modal-header" style={{ borderBottom: "none", paddingBottom: "0" }}>
          <div style={{ textAlign: "center", width: "100%" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#FEE2E2",
                color: "#DC2626",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
            <h3 style={{ margin: "0", fontSize: "18px", fontWeight: 700, color: "#0F172A" }}>
              Hapus Transaksi {record.kode}?
            </h3>
            <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#64748B", lineHeight: 1.4 }}>
              Apakah Anda yakin ingin menghapus transaksi penjualan ini?
            </p>
          </div>
        </div>

        <div style={{ padding: "16px 24px" }}>
          <div style={{ background: "#F8FAFC", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12.5px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Pelanggan:</span>
              <span style={{ fontWeight: 600 }}>{record.pelanggan.nama || "Pelanggan Umum"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Total Nilai:</span>
              <span style={{ fontWeight: 700 }}>{formatRupiah(record.total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Barang:</span>
              <span style={{ fontWeight: 500, color: "#334155" }}>{record.barangRingkasan}</span>
            </div>
          </div>

          <div
            style={{
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: "8px",
              padding: "10px 12px",
              marginTop: "12px",
              fontSize: "12px",
              color: "#92400E",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <b>Pemulihan Stok:</b> Jumlah stok seluruh barang di transaksi ini akan dikembalikan otomatis ke inventaris retail toko.
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "18px" }}>
            <button type="button" className="tx-btn-secondary" onClick={onClose} style={{ justifyContent: "center" }}>
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              style={{
                background: "#DC2626",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "10px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
