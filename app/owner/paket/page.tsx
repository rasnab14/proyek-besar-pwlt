// app/owner/paket/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import "@/components/barang/barang.css";
import "@/components/transaksi/transaksi.css";
import {
  PaketRecord,
  getStoredPaket,
  toggleStatusPaket,
  FormPaketModal,
} from "@/components/barang";

export default function OwnerPaketPage() {
  const [pakets, setPakets] = useState<PaketRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"semua" | "aktif" | "nonaktif">("semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PaketRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const reloadData = () => {
    setPakets(getStoredPaket());
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener("summit_barang_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("summit_barang_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PaketRecord) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (item: PaketRecord) => {
    toggleStatusPaket(item.id);
    showToast(
      `Paket '${item.nama}' berhasil di${item.status === "aktif" ? "nonaktifkan" : "aktifkan"}.`
    );
  };

  const filteredPakets = useMemo(() => {
    return pakets.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchKode = p.kode.toLowerCase().includes(q);
        const matchNama = p.nama.toLowerCase().includes(q);
        if (!matchKode && !matchNama) return false;
      }
      if (statusFilter !== "semua" && p.status !== statusFilter) return false;
      return true;
    });
  }, [pakets, searchQuery, statusFilter]);

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="main">
      <div className="brg-page-container">
        {toastMsg && (
          <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "#0F172A", color: "#FFF", padding: "12px 20px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 9999, fontSize: "13px" }}>
            {toastMsg}
          </div>
        )}

        <span className="brg-badge">DATA BARANG / PAKET PENYEWAAN</span>
        <div className="brg-header-row">
          <div>
            <h1 className="brg-title">Paket Penyewaan</h1>
            <p className="brg-subtitle">
              Kumpulan barang sewa dalam satu harga paket hemat.
            </p>
          </div>
          <Link href="/owner/paket/form" className="brg-btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            + Tambah paket
          </Link>
        </div>

        <div className="brg-card" style={{ marginBottom: "1.5rem" }}>
          <div className="brg-filter-bar" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="brg-search-input"
              placeholder="Cari kode atau nama paket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="brg-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="semua">Semua status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Grid Kartu Paket (Sesuai Screenshot Referensi) */}
        {filteredPakets.length === 0 ? (
          <div className="brg-card" style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
            Tidak ada paket penyewaan yang ditemukan.
          </div>
        ) : (
          <div className="brg-paket-grid">
            {filteredPakets.map((p) => (
              <div key={p.id} className="brg-paket-card">
                {/* Header Area Pink dengan Foto Label & 3D Cube Icon */}
                <div className="brg-paket-header-area">
                  <div className="brg-paket-top">
                    <span>{p.kode}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: p.status === "aktif" ? "#166534" : "#64748B" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: p.status === "aktif" ? "#22C55E" : "#94A3B8" }} />
                      {p.status === "aktif" ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>

                  <div className="brg-paket-center-icon">
                    {p.foto ? (
                      p.foto.startsWith("data:") || p.foto.startsWith("http") || p.foto.startsWith("/") ? (
                        <img
                          src={p.foto}
                          alt={p.nama}
                          style={{ maxHeight: "72px", maxWidth: "90%", objectFit: "contain", borderRadius: "8px" }}
                        />
                      ) : (
                        <span style={{ fontSize: "36px" }}>{p.foto}</span>
                      )
                    ) : (
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    )}
                  </div>

                  <span className="brg-paket-foto-label">FOTO</span>
                </div>

                {/* Body */}
                <div className="brg-paket-body">
                  <h3 className="brg-paket-title">{p.nama}</h3>
                  <div className="brg-paket-code">{p.kode}</div>

                  <div className="brg-paket-items">
                    {p.barangPenyusun.map((item, idx) => (
                      <span key={idx} className="brg-paket-item-pill">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="brg-paket-price">
                    {formatRupiah(p.hargaPerHari)} <span style={{ fontSize: "12px", fontWeight: "normal", color: "#64748B" }}>/ hari</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="brg-paket-actions">
                  <Link
                    href={`/owner/paket/form?edit=${p.id}`}
                    className="brg-btn-action"
                    style={{ textDecoration: "none", display: "inline-block", textAlign: "center" }}
                  >
                    Detail / ubah
                  </Link>
                  <button
                    type="button"
                    className="brg-btn-action"
                    onClick={() => handleToggleStatus(p)}
                    style={{ color: p.status === "aktif" ? "#DC2626" : "#0284C7" }}
                  >
                    {p.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="brg-info-banner blue">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <div>
            Hanya Barang Sewa yang dapat masuk paket. Komposisi dan harga paket disimpan salinannya di setiap booking atau transaksi, jadi perubahan paket tidak mengubah catatan lama.
          </div>
        </div>
      </div>

      <FormPaketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingPaket={editingItem}
        onSuccess={() => {
          reloadData();
          showToast("Paket penyewaan berhasil disimpan.");
        }}
      />
    </div>
  );
}
