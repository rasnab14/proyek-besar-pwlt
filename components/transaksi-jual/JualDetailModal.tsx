// components/transaksi-jual/JualDetailModal.tsx
"use client";

import React from "react";
import { TransaksiJualRecord } from "./types";
import { formatRupiah } from "@/lib/format";

interface JualDetailModalProps {
  isOpen: boolean;
  record: TransaksiJualRecord | null;
  onClose: () => void;
  onPrint?: (r: TransaksiJualRecord) => void;
}

export function JualDetailModal({
  isOpen,
  record,
  onClose,
  onPrint,
}: JualDetailModalProps) {
  if (!isOpen || !record) return null;

  return (
    <div className="tx-modal-overlay" onClick={onClose}>
      <div
        className="tx-modal-container"
        style={{ maxWidth: "580px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="tx-modal-header">
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#0284C7", background: "#E0F2FE", padding: "2px 8px", borderRadius: "10px" }}>
              DETAIL TRANSAKSI PENJUALAN
            </span>
            <h2 className="tx-modal-title" style={{ marginTop: "4px" }}>
              {record.kode}
            </h2>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748B" }}>
              Waktu: {record.waktu} · Kasir: {record.kasir}
            </p>
          </div>
          <button type="button" className="tx-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "75vh", overflowY: "auto" }}>
          {/* Info Pelanggan & Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "#F8FAFC", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12.5px" }}>
            <div>
              <span style={{ color: "#64748B", display: "block" }}>Pelanggan:</span>
              <span style={{ fontWeight: 700, color: "#0F172A" }}>
                {record.pelanggan.nama || "Pelanggan Umum"}
              </span>
              {record.pelanggan.telepon && (
                <span style={{ color: "#475569", display: "block", fontSize: "11.5px" }}>
                  {record.pelanggan.telepon}
                </span>
              )}
            </div>
            <div>
              <span style={{ color: "#64748B", display: "block" }}>Status Pembayaran:</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#166534" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16A34A" }}></span>
                Selesai (Lunas)
              </span>
              <span style={{ color: "#475569", display: "block", fontSize: "11.5px" }}>
                Metode: {record.metodeBayar.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Rincian Barang yang Dibeli */}
          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>
              Barang yang Dibeli ({record.items.length} item)
            </h4>
            <div style={{ border: "1px solid #CBD5E1", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 2px 0 rgba(15, 23, 42, 0.05)" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: "12.5px" }}>
                <thead>
                  <tr style={{ background: "#F1F5F9", color: "#1E293B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", borderBottom: "2px solid #CBD5E1" }}>Nama Barang</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", borderBottom: "2px solid #CBD5E1" }}>Qty</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", borderBottom: "2px solid #CBD5E1" }}>Harga Satuan</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", borderBottom: "2px solid #CBD5E1" }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {record.items.map((it, idx) => (
                    <tr key={it.id} style={{ background: idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "11px 14px", borderBottom: "1px solid #E2E8F0", fontWeight: 600, color: "#1E293B" }}>
                        {it.nama}
                        <span style={{ display: "block", fontSize: "11px", color: "#64748B" }}>
                          SKU: {it.kode} · {it.kategori}
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", borderBottom: "1px solid #E2E8F0", textAlign: "center", fontWeight: 600 }}>
                        {it.jumlah}
                      </td>
                      <td style={{ padding: "11px 14px", borderBottom: "1px solid #E2E8F0", textAlign: "right", color: "#475569" }}>
                        {formatRupiah(it.hargaSatuan)}
                      </td>
                      <td style={{ padding: "11px 14px", borderBottom: "1px solid #E2E8F0", textAlign: "right", fontWeight: 700, color: "#0F172A" }}>
                        {formatRupiah(it.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rincian Finansial Kasir */}
          <div style={{ background: "#F8FAFC", padding: "14px", borderRadius: "8px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600, color: "#0F172A" }}>{formatRupiah(record.subtotal)}</span>
            </div>
            {record.diskon > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#DC2626" }}>
                <span>Diskon Manual</span>
                <span style={{ fontWeight: 600 }}>- {formatRupiah(record.diskon)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E2E8F0", paddingTop: "8px", fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>
              <span>Total Penjualan</span>
              <span style={{ color: "#0284C7" }}>{formatRupiah(record.total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#475569", fontSize: "12.5px" }}>
              <span>Uang Diterima ({record.metodeBayar.toUpperCase()})</span>
              <span style={{ fontWeight: 600 }}>{formatRupiah(record.nominalBayar)}</span>
            </div>
            {record.kembalian > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#166534", fontSize: "12.5px", background: "#DCFCE7", padding: "4px 8px", borderRadius: "4px" }}>
                <span>Kembalian</span>
                <span style={{ fontWeight: 700 }}>{formatRupiah(record.kembalian)}</span>
              </div>
            )}
            {record.catatan && (
              <div style={{ fontSize: "11.5px", color: "#64748B", marginTop: "4px" }}>
                <b>Catatan:</b> {record.catatan}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="tx-modal-footer">
          {onPrint && (
            <button
              type="button"
              className="tx-btn-secondary"
              onClick={() => onPrint(record)}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Cetak Struk
            </button>
          )}
          <button type="button" className="tx-btn-primary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
