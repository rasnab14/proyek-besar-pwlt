// app/owner/barang/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import "@/components/barang/barang.css";
import "@/components/transaksi/transaksi.css";
import {
  BarangRecord,
  getStoredBarang,
  deleteBarang,
  getStoredKategori,
  FormBarangModal,
} from "@/components/barang";

export default function OwnerBarangPage() {
  const [barangList, setBarangList] = useState<BarangRecord[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("semua");
  const [filterJenis, setFilterJenis] = useState<"semua" | "sewa" | "jual">("semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BarangRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const reloadData = () => {
    setBarangList(getStoredBarang());
    const kats = getStoredKategori();
    setCategories(kats.map((k) => k.nama));
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

  const showToast = (text: string, isError = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: BarangRecord) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: BarangRecord) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk '${item.nama}' (${item.kode})?`)) {
      try {
        deleteBarang(item.id);
        showToast(`Produk '${item.nama}' berhasil dihapus.`);
      } catch (err: any) {
        showToast(err.message || "Gagal menghapus produk.", true);
      }
    }
  };

  const filteredBarang = useMemo(() => {
    return barangList.filter((b) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchKode = b.kode.toLowerCase().includes(q);
        const matchNama = b.nama.toLowerCase().includes(q);
        if (!matchKode && !matchNama) return false;
      }
      if (selectedKategori !== "semua" && b.kategori !== selectedKategori) return false;
      if (filterJenis !== "semua" && b.jenis !== filterJenis) return false;
      return true;
    });
  }, [barangList, searchQuery, selectedKategori, filterJenis]);

  const getProductIcon = (b: BarangRecord) => {
    if (b.kategori === "Pakaian") return "🧥";
    if (b.kategori === "Tenda") return "⛺";
    if (b.kategori === "Tas") return "🎒";
    if (b.kategori === "Alat masak") return "🍳";
    if (b.kategori === "Tidur") return "🛏️";
    if (b.kategori === "Penerangan") return "🔦";
    return "📦";
  };

  return (
    <div className="main">
      <div className="brg-page-container">
        {toastMsg && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              background: toastMsg.isError ? "#DC2626" : "#0F172A",
              color: "#FFF",
              padding: "12px 20px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 9999,
              fontSize: "13px",
            }}
          >
            {toastMsg.text}
          </div>
        )}

        <span className="brg-badge">DATA BARANG / SEMUA BARANG</span>
        <div className="brg-header-row">
          <div>
            <h1 className="brg-title">Semua Barang</h1>
            <p className="brg-subtitle">
              Satu produk dapat memiliki beberapa variasi (merek, ukuran, kapasitas, jenis). Barang sewa dikelola per unit, barang jual per kuantitas.
            </p>
          </div>
          <Link href="/owner/barang/form" className="brg-btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            + Tambah barang
          </Link>
        </div>

        <div className="brg-card">
          <div className="brg-filter-bar">
            <input
              type="text"
              className="brg-search-input"
              placeholder="Cari nama atau kode produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="brg-select"
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
            >
              <option value="semua">Semua kategori</option>
              {categories.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>

            <div className="brg-filter-pills">
              <button
                type="button"
                className={`brg-pill ${filterJenis === "semua" ? "active" : ""}`}
                onClick={() => setFilterJenis("semua")}
              >
                Semua
              </button>
              <button
                type="button"
                className={`brg-pill ${filterJenis === "sewa" ? "active" : ""}`}
                onClick={() => setFilterJenis("sewa")}
              >
                Barang Sewa
              </button>
              <button
                type="button"
                className={`brg-pill ${filterJenis === "jual" ? "active" : ""}`}
                onClick={() => setFilterJenis("jual")}
              >
                Barang Jual
              </button>
            </div>
          </div>

          <div className="brg-table-wrap">
            <table className="brg-table">
              <thead>
                <tr>
                  <th style={{ width: "45px" }}>FOTO</th>
                  <th style={{ width: "18%" }}>KODE · PRODUK</th>
                  <th style={{ width: "12%" }}>KATEGORI</th>
                  <th style={{ width: "10%" }}>JENIS</th>
                  <th style={{ width: "24%" }}>VARIASI</th>
                  <th style={{ width: "18%" }}>HARGA SEWA / JUAL</th>
                  <th style={{ width: "10%" }}>STOK</th>
                  <th style={{ width: "10%", textAlign: "right" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredBarang.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
                      Tidak ada produk yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredBarang.map((b) => (
                    <React.Fragment key={b.id}>
                      <tr className="brg-parent-row">
                        <td>
                          <div className="brg-avatar-box">
                            {getProductIcon(b)}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: "#0F172A" }}>
                            <span style={{ color: "#64748B", fontWeight: 700, marginRight: "4px" }}>
                              {b.kode} ·
                            </span>
                            {b.nama}
                          </div>
                        </td>
                        <td style={{ color: "#475569" }}>{b.kategori}</td>
                        <td>
                          <span className={`brg-badge-jenis ${b.jenis}`}>
                            <span className="brg-badge-dot" />
                            {b.jenis === "sewa" ? "Sewa" : "Jual"}
                          </span>
                        </td>
                        <td style={{ color: "#334155" }}>{b.ringkasanVariasi}</td>
                        <td style={{ fontWeight: 600, color: "#0F172A" }}>
                          {b.rentangHargaDisplay}
                        </td>
                        <td style={{ fontWeight: 600 }}>{b.totalStokDisplay}</td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "5px" }}>
                            <Link
                              href={`/owner/barang/${b.kode}`}
                              className="brg-btn-action"
                              style={{ textDecoration: "none" }}
                            >
                              Detail
                            </Link>
                            <Link
                              href={`/owner/barang/form?edit=${b.id}`}
                              className="brg-btn-action"
                              style={{ textDecoration: "none" }}
                            >
                              Ubah
                            </Link>
                            <button
                              type="button"
                              className="brg-btn-action brg-btn-danger"
                              onClick={() => handleDelete(b)}
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>

                      {b.variasi && b.variasi.length > 0 && b.variasi.map((v, vIdx) => (
                        <tr key={v.id || vIdx} className="brg-sub-row">
                          <td />
                          <td style={{ paddingLeft: "24px", color: "#475569", fontWeight: 500 }}>
                            {v.namaVariasi}
                          </td>
                          <td style={{ color: "#0284C7", fontSize: "11.5px", fontFamily: "monospace" }}>
                            <Link
                              href={`/owner/barang/${b.kode}/unit/${encodeURIComponent(v.id || `var-${vIdx}`)}`}
                              style={{ color: "#0284C7", textDecoration: "none", fontWeight: 600 }}
                            >
                              {v.kodeUnitRange || "-"}
                            </Link>
                          </td>
                          <td />
                          <td style={{ color: "#64748B" }}>{v.spesifikasi}</td>
                          <td style={{ color: "#334155" }}>
                            Rp {v.harga.toLocaleString("id-ID")}
                          </td>
                          <td style={{ color: "#475569" }}>
                            {v.stok} {b.jenis === "sewa" ? "unit" : "pcs"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <Link
                              href={`/owner/barang/${b.kode}/unit/${encodeURIComponent(v.id || `var-${vIdx}`)}`}
                              className="brg-btn-action"
                              style={{ textDecoration: "none", fontSize: "11px", padding: "3px 8px" }}
                            >
                              Detail Unit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="tx-pagination" style={{ borderTop: "1px solid #E2E8F0", marginTop: "1rem", paddingTop: "0.75rem" }}>
            <span>
              Menampilkan 1-{filteredBarang.length} dari {barangList.length} produk
            </span>
            <div className="tx-pagination-buttons">
              <button type="button" className="tx-page-btn" disabled>
                Sebelumnya
              </button>
              <button type="button" className="tx-page-btn" disabled>
                Berikutnya
              </button>
            </div>
          </div>
        </div>

        <div className="brg-info-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            Produk yang sudah terkait transaksi atau riwayat penting tidak dapat dihapus langsung; sistem meminta konfirmasi dan alasan keamanan data.
          </div>
        </div>
      </div>

      <FormBarangModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingBarang={editingItem}
        kategoriOptions={categories}
        onSuccess={() => {
          reloadData();
          showToast("Data barang berhasil disimpan.");
        }}
      />
    </div>
  );
}
