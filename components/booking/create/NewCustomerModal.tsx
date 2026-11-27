// components/booking/create/NewCustomerModal.tsx
"use client";

import React, { useState } from "react";
import { CustomerData } from "./types";

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: CustomerData) => void;
}

export function NewCustomerModal({ isOpen, onClose, onAddCustomer }: NewCustomerModalProps) {
  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [key: string]: string } = {};
    if (!nama.trim()) errs.nama = "Nama pelanggan wajib diisi";
    if (!telepon.trim()) errs.telepon = "Nomor WhatsApp wajib diisi";
    if (telepon.trim() && !/^[0-9+\-\s]{8,16}$/.test(telepon.trim())) {
      errs.telepon = "Format nomor WhatsApp tidak valid";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const newCustomer: CustomerData = {
      id: `cust-${Date.now()}`,
      nama: nama.trim(),
      telepon: telepon.trim(),
      alamat: alamat.trim() || undefined,
    };

    onAddCustomer(newCustomer);
    onClose();
    setNama("");
    setTelepon("");
    setAlamat("");
    setErrors({});
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: "480px" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h2 className="modal-title" style={{ fontSize: "16px" }}>+ Tambah Pelanggan Baru</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">
                Nama Pelanggan <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: Dimas Pratama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                autoFocus
              />
              {errors.nama && (
                <span style={{ fontSize: "11px", color: "var(--st-er-t)" }}>{errors.nama}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Nomor WhatsApp / Telepon <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: 0812-3456-7890"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
              />
              {errors.telepon && (
                <span style={{ fontSize: "11px", color: "var(--st-er-t)" }}>{errors.telepon}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Alamat / Asal Kampus / Domisili (Opsional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: Condongcatur, Sleman (opsional)"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn sm" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn pri sm">
              Simpan &amp; Pilih Pelanggan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
