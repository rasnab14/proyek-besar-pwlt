// components/pengembalian/ProsesKembaliModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { TransaksiSewaRecord, StatusPengembalian } from "@/components/transaksi/types";
import { selesaikanPengembalian, hitungMasaSewa } from "./pengembalianStore";

interface ProsesKembaliModalProps {
  record: TransaksiSewaRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProsesKembaliModal({
  record,
  isOpen,
  onClose,
  onSuccess,
}: ProsesKembaliModalProps) {
  const [statusKembali, setStatusKembali] = useState<StatusPengembalian>("seluruhnya");
  const [dendaNominal, setDendaNominal] = useState<number>(0);
  const [dendaKet, setDendaKet] = useState<string>("");
  const [kembalikanJaminan, setKembalikanJaminan] = useState<boolean>(true);
  const [catatan, setCatatan] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (record) {
      const tracking = hitungMasaSewa(record.tglSelesai, record.statusPengembalian);
      if (tracking.statusMasaSewa === "terlambat") {
        const estDenda = tracking.hariTerlambat * 50000;
        setDendaNominal(estDenda);
        setDendaKet(`Denda keterlambatan ${tracking.hariTerlambat} hari`);
      } else {
        setDendaNominal(0);
        setDendaKet("");
      }
      setStatusKembali("seluruhnya");
      setKembalikanJaminan(true);
      setCatatan("");
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const tracking = hitungMasaSewa(record.tglSelesai, record.statusPengembalian);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      selesaikanPengembalian(record.id, {
        statusPengembalian: statusKembali,
        biayaTambahan: dendaNominal,
        biayaTambahanKet: dendaKet,
        catatan,
        kembalikanJaminan,
      });
      onSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tx-modal-overlay">
      <div className="tx-modal-card" style={{ maxWidth: "560px" }}>
        <div className="tx-modal-header">
          <div>
            <h2 className="tx-modal-title">Formulir Pengembalian Barang</h2>
            <p className="tx-modal-subtitle">
              Pemeriksaan fisik unit kembali, denda, dan pelepasan jaminan · {record.kode}
            </p>
          </div>
          <button type="button" className="tx-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tx-modal-body">
          {/* Summary Box */}
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#64748B" }}>Penyewa:</span>
              <span style={{ fontSize: "13px", fontWeight: 600 }}>{record.pelanggan.nama} ({record.pelanggan.telepon})</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#64748B" }}>Jadwal Kembali:</span>
              <span style={{ fontSize: "13px", fontWeight: 500 }}>{record.tglKembaliDisplay || record.tglSelesai}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#64748B" }}>Status Waktu:</span>
              <span className={`tx-dot-badge`}>
                <span className={`tx-dot ${tracking.badgeClass}`} />
                {tracking.badgeLabel}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: "#64748B" }}>Jaminan Tersimpan:</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#2563EB" }}>
                {record.jaminanFisik || "KTP / Identitas Penyewa"}
              </span>
            </div>
          </div>

          {/* Status Pengembalian */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
              Kondisi Pengembalian Barang
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="statusKembali"
                  checked={statusKembali === "seluruhnya"}
                  onChange={() => setStatusKembali("seluruhnya")}
                />
                Dikembalikan Seluruhnya (Lengkap)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="statusKembali"
                  checked={statusKembali === "sebagian"}
                  onChange={() => setStatusKembali("sebagian")}
                />
                Dikembalikan Sebagian
              </label>
            </div>
          </div>

          {/* Biaya Tambahan / Denda */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
              Biaya Tambahan / Denda (Jika Ada)
            </label>
            <input
              type="number"
              min="0"
              step="5000"
              className="tx-input"
              value={dendaNominal}
              onChange={(e) => setDendaNominal(Number(e.target.value) || 0)}
              placeholder="0"
              style={{ width: "100%", marginBottom: "6px" }}
            />
            {dendaNominal > 0 ? (
              <input
                type="text"
                className="tx-input"
                value={dendaKet}
                onChange={(e) => setDendaKet(e.target.value)}
                placeholder="Alasan denda (keterlambatan/kerusakan/kotor)..."
                style={{ width: "100%", fontSize: "12px" }}
              />
            ) : null}
          </div>

          {/* Checkbox Jaminan */}
          <div style={{ marginBottom: "14px", padding: "10px", background: "#EFF6FF", borderRadius: "8px", border: "1px solid #BFDBFE" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 500, color: "#1E3A8A", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={kembalikanJaminan}
                onChange={(e) => setKembalikanJaminan(e.target.checked)}
              />
              Serahkan kembali jaminan fisik ({record.jaminanFisik || "KTP"}) kepada pelanggan
            </label>
          </div>

          {/* Catatan Pemeriksaan */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
              Catatan Pemeriksaan Unit (Opsional)
            </label>
            <textarea
              className="tx-input"
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Unit lengkap, bersih, siap masuk antrean cuci/persiapan..."
              style={{ width: "100%" }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" className="tx-btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Batal
            </button>
            <button type="submit" className="tx-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan & Selesaikan Pengembalian"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
