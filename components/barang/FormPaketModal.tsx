// components/barang/FormPaketModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { PaketRecord } from "./types";
import { saveOrUpdatePaket, getStoredPaket } from "./barangStore";

interface FormPaketModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPaket: PaketRecord | null;
  onSuccess: () => void;
}

export function FormPaketModal({
  isOpen,
  onClose,
  editingPaket,
  onSuccess,
}: FormPaketModalProps) {
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [hargaPerHari, setHargaPerHari] = useState<number>(150000);
  const [barangPenyusunStr, setBarangPenyusunStr] = useState("");
  const [status, setStatus] = useState<"aktif" | "nonaktif">("aktif");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (editingPaket) {
      setKode(editingPaket.kode);
      setNama(editingPaket.nama);
      setDeskripsi(editingPaket.deskripsi);
      setHargaPerHari(editingPaket.hargaPerHari);
      setBarangPenyusunStr(editingPaket.barangPenyusun.join(", "));
      setStatus(editingPaket.status);
    } else {
      const allExisting = getStoredPaket();
      const highestNum = allExisting.reduce((max, p) => {
        const match = p.kode.match(/PKT-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          return Math.max(max, num);
        }
        return max;
      }, 0);
      setKode(`PKT-${String(highestNum + 1).padStart(3, "0")}`);
      setNama("");
      setDeskripsi("");
      setHargaPerHari(150000);
      setBarangPenyusunStr("Tenda Dome 2P ×1, Carrier 60L ×1, Sleeping Bag ×1");
      setStatus("aktif");
    }
    setErrorMsg("");
  }, [editingPaket, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg("Nama paket penyewaan wajib diisi.");
      return;
    }
    if (hargaPerHari <= 0) {
      setErrorMsg("Harga sewa paket harus lebih dari Rp 0.");
      return;
    }

    const items = barangPenyusunStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    saveOrUpdatePaket({
      id: editingPaket ? editingPaket.id : `pkt-${Date.now()}`,
      kode: kode || `PKT-00${Math.floor(Math.random() * 90 + 10)}`,
      nama: nama.trim(),
      deskripsi: deskripsi.trim() || "-",
      hargaPerHari,
      status,
      barangPenyusun: items.length > 0 ? items : ["Tenda Dome 2P ×1", "Sleeping Bag ×1"],
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="tx-modal-overlay">
      <div className="tx-modal-card" style={{ maxWidth: "520px" }}>
        <div className="tx-modal-header">
          <div>
            <h2 className="tx-modal-title">
              {editingPaket ? "Ubah Paket Penyewaan" : "Tambah Paket Penyewaan"}
            </h2>
            <p className="tx-modal-subtitle">
              Paket bundling hemat beberapa barang sewa dalam satu harga
            </p>
          </div>
          <button type="button" className="tx-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tx-modal-body">
          {errorMsg && (
            <div style={{ padding: "8px 12px", background: "#FEE2E2", color: "#DC2626", borderRadius: "6px", fontSize: "12px", marginBottom: "12px" }}>
              {errorMsg}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                Kode Paket (Otomatis)
              </label>
              <input
                type="text"
                className="tx-input"
                value={kode}
                readOnly
                style={{ width: "100%", background: "#F1F5F9", cursor: "not-allowed", fontFamily: "monospace", fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                Nama Paket <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="text"
                className="tx-input"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Paket Pendakian 2 Orang"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                Harga Sewa Paket / Hari (Rp) <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                className="tx-input"
                value={hargaPerHari}
                onChange={(e) => setHargaPerHari(Number(e.target.value) || 0)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
                Status Paket
              </label>
              <select
                className="tx-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                style={{ width: "100%" }}
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
              Barang Penyusun Paket (Pisahkan tanda koma)
            </label>
            <textarea
              className="tx-input"
              rows={2}
              value={barangPenyusunStr}
              onChange={(e) => setBarangPenyusunStr(e.target.value)}
              placeholder="Tenda Dome 2P ×1, Carrier 60L ×2, Sleeping Bag ×2..."
              style={{ width: "100%", fontSize: "12.5px" }}
            />
            <span style={{ fontSize: "11.5px", color: "#64748B" }}>
              Hanya Barang Sewa yang dapat dimasukkan ke dalam paket penyewaan.
            </span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
              Deskripsi Paket
            </label>
            <input
              type="text"
              className="tx-input"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Keterangan singkat keunggulan paket..."
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" className="tx-btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="tx-btn-primary">
              Simpan Paket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
