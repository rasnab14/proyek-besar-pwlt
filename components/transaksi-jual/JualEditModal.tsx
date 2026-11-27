// components/transaksi-jual/JualEditModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { TransaksiJualRecord, MetodePembayaranJual } from "./types";
import { saveOrUpdateTransaksiJual } from "./jualStore";

interface JualEditModalProps {
  isOpen: boolean;
  record: TransaksiJualRecord | null;
  onClose: () => void;
  onSuccess: (updated: TransaksiJualRecord) => void;
}

export function JualEditModal({
  isOpen,
  record,
  onClose,
  onSuccess,
}: JualEditModalProps) {
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [telepon, setTelepon] = useState("");
  const [metodeBayar, setMetodeBayar] = useState<MetodePembayaranJual>("tunai");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    if (record) {
      setNamaPelanggan(record.pelanggan.nama || "");
      setTelepon(record.pelanggan.telepon || "");
      setMetodeBayar(record.metodeBayar);
      setCatatan(record.catatan || "");
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: TransaksiJualRecord = {
      ...record,
      pelanggan: {
        ...record.pelanggan,
        nama: namaPelanggan.trim() || "Pelanggan Umum",
        telepon: telepon.trim(),
      },
      metodeBayar,
      catatan: catatan.trim(),
    };

    saveOrUpdateTransaksiJual(updated);
    onSuccess(updated);
    onClose();
  };

  return (
    <div className="tx-modal-overlay" onClick={onClose}>
      <div
        className="tx-modal-container"
        style={{ maxWidth: "480px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tx-modal-header">
          <div>
            <h2 className="tx-modal-title">Ubah Transaksi {record.kode}</h2>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748B" }}>
              Koreksi data pelanggan, metode pembayaran, atau catatan transaksi.
            </p>
          </div>
          <button type="button" className="tx-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="bc-form-label">Nama Pelanggan</label>
            <input
              type="text"
              className="bc-pay-input"
              placeholder="Kosongkan jika Pelanggan Umum"
              value={namaPelanggan}
              onChange={(e) => setNamaPelanggan(e.target.value)}
            />
          </div>

          <div>
            <label className="bc-form-label">Nomor Telepon / WhatsApp</label>
            <input
              type="text"
              className="bc-pay-input"
              placeholder="08xxxxxxxxxx"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
            />
          </div>

          <div>
            <label className="bc-form-label">Metode Pembayaran</label>
            <div className="bc-methods-seg">
              {(["tunai", "qris", "transfer"] as MetodePembayaranJual[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`bc-method-btn ${metodeBayar === m ? "active" : ""}`}
                  onClick={() => setMetodeBayar(m)}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="bc-form-label">Catatan Transaksi</label>
            <textarea
              className="bc-pay-input"
              style={{ height: "68px", resize: "none" }}
              placeholder="Catatan opsional..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button type="button" className="tx-btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="tx-btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
