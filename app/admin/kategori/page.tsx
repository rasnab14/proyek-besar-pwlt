// app/admin/kategori/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import "@/components/barang/barang.css";
import "@/components/transaksi/transaksi.css";
import {
  KategoriRecord,
  getStoredKategori,
  deleteKategori,
  FormKategoriModal,
} from "@/components/barang";

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<KategoriRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KategoriRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const reloadData = () => {
    setCategories(getStoredKategori());
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

  const handleOpenEdit = (item: KategoriRecord) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: KategoriRecord) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kategori '${item.nama}'?`)) {
      deleteKategori(item.id);
      showToast(`Kategori '${item.nama}' berhasil dihapus.`);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) => c.nama.toLowerCase().includes(q) || c.deskripsi.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  return (
    <div className="main">
      <div className="brg-page-container">
        {/* Toast */}
        {toastMsg && (
          <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "#0F172A", color: "#FFF", padding: "12px 20px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 9999, fontSize: "13px" }}>
            {toastMsg}
          </div>
        )}

        {/* Header */}
        <span className="brg-badge">DATA BARANG / KATEGORI BARANG</span>
        <div className="brg-header-row">
          <div>
            <h1 className="brg-title">Kategori Barang</h1>
            <p className="brg-subtitle">
              Pengelompokan barang sewa dan barang jual toko.
            </p>
          </div>
          <button type="button" className="brg-btn-primary" onClick={handleOpenAdd}>
            + Tambah kategori
          </button>
        </div>

        {/* Card Table */}
        <div className="brg-card">
          <div className="brg-filter-bar">
            <input
              type="text"
              className="brg-search-input"
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="brg-table-wrap">
            <table className="brg-table">
              <thead>
                <tr>
                  <th style={{ width: "25%" }}>NAMA KATEGORI</th>
                  <th style={{ width: "45%" }}>DESKRIPSI</th>
                  <th style={{ width: "15%" }}>JUMLAH BARANG</th>
                  <th style={{ width: "15%", textAlign: "right" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "30px", color: "#64748B" }}>
                      Tidak ada kategori barang yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.nama}</td>
                      <td style={{ color: "#64748B" }}>{c.deskripsi}</td>
                      <td style={{ fontWeight: 500 }}>{c.jumlahBarang}</td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            className="brg-btn-action"
                            onClick={() => handleOpenEdit(c)}
                          >
                            Ubah
                          </button>
                          <button
                            type="button"
                            className="brg-btn-action brg-btn-danger"
                            onClick={() => handleDelete(c)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FormKategoriModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingKategori={editingItem}
        onSuccess={() => {
          reloadData();
          showToast("Kategori berhasil disimpan.");
        }}
      />
    </div>
  );
}
