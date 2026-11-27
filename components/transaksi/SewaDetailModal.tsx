// components/transaksi/SewaDetailModal.tsx
"use client";

import React from "react";
import { TransaksiSewaRecord } from "./types";

interface SewaDetailModalProps {
  record: TransaksiSewaRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipt: (record: TransaksiSewaRecord) => void;
  onProcessHandover?: (record: TransaksiSewaRecord) => void;
}

export function SewaDetailModal({
  record,
  isOpen,
  onClose,
  onOpenReceipt,
  onProcessHandover,
}: SewaDetailModalProps) {
  if (!isOpen || !record) return null;

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="tx-modal-overlay" onClick={onClose}>
      <div className="tx-modal-container" style={{ maxWidth: "650px" }} onClick={(e) => e.stopPropagation()}>
        <div className="tx-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 className="tx-modal-title">Detail Transaksi {record.kode}</h2>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "4px",
                background: record.tipeAsal === "booking" ? "#E0F2FE" : "#F1F5F9",
                color: record.tipeAsal === "booking" ? "#0284C7" : "#475569",
              }}
            >
              {record.bookingTag}
            </span>
          </div>
          <button type="button" className="tx-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="tx-modal-body" style={{ maxHeight: "75vh" }}>
          {/* Status Badges Row */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              padding: "10px 14px",
              background: "#F8FAFC",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", color: "#64748B", display: "block" }}>Pengambilan:</span>
              <span className="tx-dot-badge">
                <span className={`tx-dot ${record.statusPengambilan === "sudah_diambil" ? "tx-dot-green" : "tx-dot-amber"}`} />
                {record.statusPengambilan === "sudah_diambil" ? "Sudah diambil" : "Belum diambil"}
              </span>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#64748B", display: "block" }}>Status Transaksi:</span>
              <span className="tx-dot-badge">
                <span className={`tx-dot ${record.status === "lunas" || record.sisaTagihan === 0 ? "tx-dot-green" : "tx-dot-amber"}`} />
                {record.status === "lunas" || record.sisaTagihan === 0 ? "Lunas" : "Belum Lunas"}
              </span>
            </div>
          </div>

          {/* Customer & Period Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "12px", borderRadius: "8px" }}>
              <span style={{ fontSize: "11.5px", color: "#64748B", fontWeight: 600 }}>INFORMASI PELANGGAN</span>
              <div style={{ marginTop: "6px", fontWeight: 700, color: "#0F172A" }}>{record.pelanggan.nama}</div>
              <div style={{ color: "#334155" }}>{record.pelanggan.telepon}</div>
              {record.pelanggan.alamat && <div style={{ fontSize: "12px", color: "#64748B" }}>{record.pelanggan.alamat}</div>}
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "12px", borderRadius: "8px" }}>
              <span style={{ fontSize: "11.5px", color: "#64748B", fontWeight: 600 }}>PERIODE &amp; JADWAL</span>
              <div style={{ marginTop: "6px", fontWeight: 600, color: "#0F172A" }}>
                {record.periodeDisplay} ({record.durasiHari} Hari)
              </div>
              <div style={{ fontSize: "12px", color: "#64748B" }}>Kembali: {record.tglKembaliDisplay}</div>
              {record.waktuPengambilanAktual && (
                <div style={{ fontSize: "12px", color: "#16A34A" }}>Diambil: {record.waktuPengambilanAktual} WIB</div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#0F172A", display: "block", marginBottom: "6px" }}>
              Barang Sewa / Paket
            </span>
            <div style={{ border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
              <table className="tx-table" style={{ fontSize: "12.5px" }}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style={{ textAlign: "center" }}>Qty</th>
                    <th>Harga/Hari</th>
                    <th style={{ textAlign: "right" }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {record.items.map((it) => (
                    <tr key={it.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{it.nama}</div>
                        {it.rincianPaket && (
                          <div style={{ fontSize: "11px", color: "#64748B" }}>
                            {it.rincianPaket.join(", ")}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>{it.jumlah}</td>
                      <td>{formatRupiah(it.hargaPerHari)}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>{formatRupiah(it.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "13px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Total Biaya Sewa:</span>
              <strong>{formatRupiah(record.totalTagihan)}</strong>
            </div>
            {record.dpNominal > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#0284C7" }}>
                <span>DP yang telah dibayar (Booking):</span>
                <span>- {formatRupiah(record.dpNominal)}</span>
              </div>
            )}
            {record.biayaTambahan && record.biayaTambahan > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#DC2626" }}>
                <span>Biaya Tambahan {record.biayaTambahanKet}:</span>
                <span>+ {formatRupiah(record.biayaTambahan)}</span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #E2E8F0",
                paddingTop: "8px",
                fontSize: "14.5px",
              }}
            >
              <span>Sisa Tagihan:</span>
              <strong style={{ color: record.sisaTagihan > 0 ? "#D97706" : "#16A34A" }}>
                {record.sisaTagihan > 0 ? formatRupiah(record.sisaTagihan) : "LUNAS"}
              </strong>
            </div>
          </div>

          {/* Jaminan Fisik (§F.1.8) */}
          <div style={{ background: "#FEF9C3", border: "1px solid #FEF08A", padding: "10px 14px", borderRadius: "8px", fontSize: "12.5px" }}>
            <span style={{ fontWeight: 600, color: "#854D0E" }}>Jaminan Fisik Diserahkan (§F.1.8): </span>
            <span style={{ color: "#713F12" }}>{record.jaminanFisik || "Belum dicatat"}</span>
          </div>

          {/* Riwayat Aktivitas Audit */}
          {record.riwayat && record.riwayat.length > 0 && (
            <div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", display: "block", marginBottom: "6px" }}>
                RIWAYAT AKTIVITAS
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                {record.riwayat.map((log, idx) => (
                  <div key={idx} style={{ padding: "6px 10px", background: "#F1F5F9", borderRadius: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                      <strong>{log.aksi}</strong>
                      <span>{log.waktu}</span>
                    </div>
                    {log.catatan && <div style={{ color: "#64748B", marginTop: "2px" }}>{log.catatan}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="tx-modal-footer">
          {record.statusPengambilan === "belum_diambil" && onProcessHandover && (
            <button
              type="button"
              className="tx-btn-primary"
              style={{ background: "#D97706", borderColor: "#D97706" }}
              onClick={() => {
                onClose();
                onProcessHandover(record);
              }}
            >
              Serah Terima &amp; Pelunasan
            </button>
          )}
          <button
            type="button"
            className="tx-btn-secondary"
            onClick={() => onOpenReceipt(record)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Cetak Struk
          </button>
          <button type="button" className="tx-btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
