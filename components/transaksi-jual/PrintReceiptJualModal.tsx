// components/transaksi-jual/PrintReceiptJualModal.tsx
"use client";

import React, { useState } from "react";
import { TransaksiJualRecord } from "./types";
import { formatRupiah } from "@/lib/format";

interface PrintReceiptJualModalProps {
  isOpen: boolean;
  record: TransaksiJualRecord | null;
  onClose: () => void;
}

export function PrintReceiptJualModal({
  isOpen,
  record,
  onClose,
}: PrintReceiptJualModalProps) {
  const [paperSize, setPaperSize] = useState<"58mm" | "80mm" | "A4">("80mm");
  const [showKasir, setShowKasir] = useState<boolean>(true);
  const [showSK, setShowSK] = useState<boolean>(true);
  const [copies, setCopies] = useState<number>(1);

  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="tx-modal-overlay" onClick={onClose}>
      <div
        className="tx-modal-container"
        style={{ maxWidth: "800px", width: "92vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="tx-modal-header">
          <div>
            <h2 className="tx-modal-title">Cetak Bukti Transaksi Penjualan</h2>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748B" }}>
              Pratinjau struk penjualan retail resmi Summit Rental &amp; Store.
            </p>
          </div>
          <button type="button" className="tx-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content: 2 Kolom (Pengaturan & Preview Struk) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "20px",
            padding: "20px 24px",
            maxHeight: "75vh",
            overflowY: "auto",
          }}
        >
          {/* Kolom Kiri: Pengaturan Cetak */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Pilihan Ukuran Kertas */}
            <div>
              <label className="bc-form-label">Ukuran Kertas</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {(["58mm", "80mm", "A4"] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setPaperSize(sz)}
                    style={{
                      padding: "8px 4px",
                      borderRadius: "6px",
                      border: paperSize === sz ? "2px solid #0EA5E9" : "1px solid #CBD5E1",
                      background: paperSize === sz ? "#F0F9FF" : "#FFFFFF",
                      color: paperSize === sz ? "#0369A1" : "#334155",
                      fontWeight: 600,
                      fontSize: "12.5px",
                      cursor: "pointer",
                    }}
                  >
                    {sz === "58mm" ? "58 mm (Kecil)" : sz === "80mm" ? "80 mm (Standar)" : "A4 (Faktur)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Opsi Informasi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label className="bc-form-label">Informasi yang Ditampilkan</label>
              <label style={{ fontSize: "12.5px", color: "#334155", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={showKasir}
                  onChange={(e) => setShowKasir(e.target.checked)}
                />
                Tampilkan Nama Kasir
              </label>
              <label style={{ fontSize: "12.5px", color: "#334155", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={showSK}
                  onChange={(e) => setShowSK(e.target.checked)}
                />
                Tampilkan Catatan &amp; Terima Kasih
              </label>
            </div>

            {/* Jumlah Salinan */}
            <div>
              <label className="bc-form-label">Jumlah Salinan</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setCopies((c) => Math.max(1, c - 1))}
                  style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #CBD5E1", background: "#FFFFFF", cursor: "pointer", fontWeight: 700 }}
                >
                  -
                </button>
                <span style={{ fontSize: "14px", fontWeight: 700, minWidth: "24px", textAlign: "center" }}>
                  {copies}
                </span>
                <button
                  type="button"
                  onClick={() => setCopies((c) => Math.min(5, c + 1))}
                  style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #CBD5E1", background: "#FFFFFF", cursor: "pointer", fontWeight: 700 }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={handlePrint}
                className="tx-btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
              >
                Cetak Sekarang
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="tx-btn-secondary"
                style={{ justifyContent: "center" }}
              >
                Unduh PDF
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Preview Struk Termal */}
          <div
            style={{
              background: "#F8FAFC",
              padding: "16px",
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: paperSize === "58mm" ? "240px" : paperSize === "80mm" ? "300px" : "100%",
                background: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                padding: "16px 14px",
                fontFamily: "monospace",
                fontSize: "11px",
                lineHeight: 1.4,
                color: "#1E293B",
                borderRadius: "4px",
              }}
            >
              <div style={{ textAlign: "center", borderBottom: "1px dashed #CBD5E1", paddingBottom: "10px", marginBottom: "10px" }}>
                <div style={{ fontWeight: 800, fontSize: "13px" }}>SUMMIT RENTAL &amp; STORE</div>
                <div>Jl. Kaliurang Km 12.5, Sleman</div>
                <div>Telp/WA: 0812-3456-7890</div>
              </div>

              <div style={{ borderBottom: "1px dashed #CBD5E1", paddingBottom: "8px", marginBottom: "8px", fontSize: "10.5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>No: {record.kode}</span>
                  <span>{record.waktu.split(" ")[0]}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Plg: {record.pelanggan.nama || "Umum"}</span>
                  {showKasir && <span>Kasir: {record.kasir}</span>}
                </div>
              </div>

              {/* Items */}
              <div style={{ borderBottom: "1px dashed #CBD5E1", paddingBottom: "8px", marginBottom: "8px" }}>
                {record.items.map((it) => (
                  <div key={it.id} style={{ marginBottom: "4px" }}>
                    <div style={{ fontWeight: 600 }}>{it.nama}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                      <span>{it.jumlah} × {formatRupiah(it.hargaSatuan)}</span>
                      <span style={{ color: "#0F172A", fontWeight: 700 }}>{formatRupiah(it.subtotal)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ borderBottom: "1px dashed #CBD5E1", paddingBottom: "8px", marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal:</span>
                  <span>{formatRupiah(record.subtotal)}</span>
                </div>
                {record.diskon > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Diskon:</span>
                    <span>-{formatRupiah(record.diskon)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "12px", marginTop: "4px" }}>
                  <span>TOTAL:</span>
                  <span>{formatRupiah(record.total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                  <span>Bayar ({record.metodeBayar.toUpperCase()}):</span>
                  <span>{formatRupiah(record.nominalBayar)}</span>
                </div>
                {record.kembalian > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Kembalian:</span>
                    <span>{formatRupiah(record.kembalian)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", color: "#166534", fontWeight: 700 }}>
                  <span>STATUS:</span>
                  <span>SELESAI (LUNAS)</span>
                </div>
              </div>

              {showSK && (
                <div style={{ textAlign: "center", fontSize: "9.5px", color: "#64748B", marginTop: "10px" }}>
                  <div>Barang yang dibeli tidak dapat ditukar kecuali ada cacat pabrik.</div>
                  <div style={{ marginTop: "4px", fontWeight: 700 }}>*** TERIMA KASIH ***</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
