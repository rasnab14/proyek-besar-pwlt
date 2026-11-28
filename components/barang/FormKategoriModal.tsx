// components/barang/FormKategoriModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { KategoriRecord } from "./types";
import { saveOrUpdateKategori } from "./barangStore";

interface FormKategoriModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingKategori: KategoriRecord | null;
  onSuccess: () => void;
}

export function FormKategoriModal({
  isOpen,
  onClose,
  editingKategori,
  onSuccess,
}: FormKategoriModalProps) {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (editingKategori) {
      setNama(editingKategori.nama);
      setDeskripsi(editingKategori.deskripsi);
    } else {
      setNama("");
      setDeskripsi("");
    }
    setErrorMsg("");
  }, [editingKategori, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg("Nama kategori wajib diisi.");
      return;
    }

    saveOrUpdateKategori({
      id: editingKategori ? editingKategori.id : `kat-${Date.now()}`,
      nama: nama.trim(),
      deskripsi: deskripsi.trim() || "-",
      jumlahBarang: editingKategori ? editingKategori.jumlahBarang : 0,
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="tx-modal-overlay">
      <div className="tx-modal-card" style={{ maxWidth: "440px" }}>
        <div className="tx-modal-header">
          <div>
            <h2 className="tx-modal-title">
              {editingKategori ? "Ubah Kategori Barang" : "Tambah Kategori Barang"}
            </h2>
            <p className="tx-modal-subtitle">
              Pengelompokan barang sewa dan barang jual toko
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

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
              Nama Kategori <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              className="tx-input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Tenda, Tas, Alat masak..."
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1E293B", marginBottom: "6px" }}>
              Deskripsi
            </label>
            <textarea
              className="tx-input"
              rows={2}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Contoh: Tenda dome dan tenda keluarga..."
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" className="tx-btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="tx-btn-primary">
              Simpan Kategori
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
