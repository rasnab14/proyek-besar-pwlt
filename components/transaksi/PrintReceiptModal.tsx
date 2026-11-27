// components/transaksi/PrintReceiptModal.tsx
"use client";

import React, { useState } from "react";
import { TransaksiSewaRecord } from "./types";

interface PrintReceiptModalProps {
  record: TransaksiSewaRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintReceiptModal({ record, isOpen, onClose }: PrintReceiptModalProps) {
  const [paperSize, setPaperSize] = useState<"58mm" | "80mm" | "A4">("80mm");
  const [showKasir, setShowKasir] = useState<boolean>(true);
  const [showPembayaran, setShowPembayaran] = useState<boolean>(true);
  const [showSK, setShowSK] = useState<boolean>(true);
  const [copies, setCopies] = useState<number>(1);

  if (!isOpen || !record) return null;

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `STRUK PENYEWAAN - 19 SUMMIT OUTDOOR\nKode: ${record.kode}\nPelanggan: ${record.pelanggan.nama}\nTotal: ${formatRupiah(record.totalTagihan)}\nStatus: ${(record.status || "lunas").toUpperCase()}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Struk-${record.kode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tx-modal-overlay" onClick={onClose}>
      <div className="tx-modal-container" style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
        <div className="tx-modal-header">
          <h2 className="tx-modal-title">Cetak Bukti / Struk Transaksi (§F.1.34)</h2>
          <button type="button" className="tx-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="tx-modal-body" style={{ maxHeight: "75vh" }}>
          {/* Pengaturan Kertas & Isi */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "4px" }}>
                Ukuran Kertas
              </label>
              <select
                className="tx-select"
                style={{ width: "100%" }}
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value as "58mm" | "80mm" | "A4")}
              >
                <option value="58mm">Thermal 58 mm</option>
                <option value="80mm">Thermal 80 mm (Standar POS)</option>
                <option value="A4">A4 / Invoice Standar</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "4px" }}>
                Jumlah Salinan
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="tx-search-input"
                style={{ paddingLeft: "10px" }}
                value={copies}
                onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
          </div>

          {/* Checklist Opsi Tampilan */}
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px 14px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", display: "block", marginBottom: "6px" }}>
              INFORMASI YANG DITAMPILKAN
            </span>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "12.5px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input type="checkbox" checked={showKasir} onChange={(e) => setShowKasir(e.target.checked)} />
                Nama Kasir
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input type="checkbox" checked={showPembayaran} onChange={(e) => setShowPembayaran(e.target.checked)} />
                Rincian Pembayaran
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input type="checkbox" checked={showSK} onChange={(e) => setShowSK(e.target.checked)} />
                Syarat &amp; Ketentuan
              </label>
            </div>
          </div>

          {/* Pratinjau Tampilan Struk */}
          <div>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", display: "block", marginBottom: "6px" }}>
              PRATINJAU STRUK ({paperSize})
            </span>
            <div
              style={{
                background: "#FFFFFF",
                border: "1px dashed #CBD5E1",
                borderRadius: "8px",
                padding: "16px",
                fontFamily: "monospace",
                fontSize: "12px",
                lineHeight: "1.5",
                color: "#0F172A",
                maxWidth: paperSize === "58mm" ? "260px" : paperSize === "80mm" ? "360px" : "100%",
                margin: "0 auto",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ textAlign: "center", borderBottom: "1px dashed #000", paddingBottom: "8px", marginBottom: "8px" }}>
                <strong style={{ fontSize: "14px" }}>19 SUMMIT OUTDOOR</strong>
                <div>Rental &amp; Outdoor Gear Sumedang</div>
                <div style={{ fontSize: "10px" }}>Jl. Pangeran Kornel No. 19, Sumedang</div>
              </div>

              <div style={{ marginBottom: "8px", fontSize: "11px" }}>
                <div>No: {record.kode}</div>
                <div>Tgl: {record.waktuDibuat || "2026-11-02 10:00"}</div>
                {showKasir && <div>Kasir: {record.dibuatOleh || "Admin Toko"}</div>}
                <div>Pelanggan: {record.pelanggan.nama}</div>
                <div>Jaminan: {record.jaminanFisik}</div>
              </div>

              <div style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", padding: "6px 0", margin: "6px 0" }}>
                {record.items.map((it, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{it.nama} ×{it.jumlah}</span>
                    <span>{formatRupiah(it.subtotal)}</span>
                  </div>
                ))}
              </div>

              {showPembayaran && (
                <div style={{ fontSize: "11.5px", marginTop: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Total Sewa:</span>
                    <strong>{formatRupiah(record.totalTagihan)}</strong>
                  </div>
                  {record.dpNominal > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>DP Diterima:</span>
                      <span>{formatRupiah(record.dpNominal)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: "4px" }}>
                    <span>Status:</span>
                    <span>{record.sisaTagihan === 0 ? "LUNAS" : `BELUM LUNAS (Sisa ${formatRupiah(record.sisaTagihan)})`}</span>
                  </div>
                </div>
              )}

              {showSK && (
                <div style={{ borderTop: "1px dashed #000", marginTop: "10px", paddingTop: "6px", fontSize: "9.5px", color: "#475569", textAlign: "center" }}>
                  Barang wajib dikembalikan sebelum batas waktu. Keterlambatan dikenakan denda sesuai ketentuan.
                  <div style={{ marginTop: "4px" }}>*** Terima Kasih ***</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="tx-modal-footer">
          <button type="button" className="tx-btn-secondary" onClick={handleDownload}>
            Unduh TXT / PDF
          </button>
          <button type="button" className="tx-btn-primary" onClick={handlePrint}>
            Cetak Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
