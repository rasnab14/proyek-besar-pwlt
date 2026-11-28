// components/barang/FormPaketPageContent.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PaketRecord, BarangRecord } from "./types";
import { getStoredPaket, saveOrUpdatePaket, getStoredBarang, getStoredKategori } from "./barangStore";
import "./barang.css";

interface FormPaketPageContentProps {
  role: "admin" | "owner";
}

interface ItemPenyusun {
  id: string;
  nama: string;
  qty: number;
  spesifikasi?: string;
  foto?: string;
}

export function FormPaketPageContent({ role }: FormPaketPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  // Form Fields
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [hargaPerHari, setHargaPerHari] = useState<number>(150000);
  const [status, setStatus] = useState<"aktif" | "nonaktif">("aktif");
  const [foto, setFoto] = useState<string | null>(null);

  // External URL input toggle
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Items in Package
  const [items, setItems] = useState<ItemPenyusun[]>([
    { id: "p-item-1", nama: "Tenda Dome 2P", qty: 1, spesifikasi: "Kapasitas 2 Orang, Double Layer" },
    { id: "p-item-2", nama: "Carrier 60L", qty: 2, spesifikasi: "Kapasitas 60L, Bahan Cordura" },
    { id: "p-item-3", nama: "Sleeping Bag", qty: 2, spesifikasi: "Bahan Polar Dacron" },
    { id: "p-item-4", nama: "Matras", qty: 2, spesifikasi: "Matras Spon Foil" },
  ]);

  // Picker Modal State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerKategori, setPickerKategori] = useState("semua");
  const [pickerQtyMap, setPickerQtyMap] = useState<Record<string, number>>({});
  const [pickerSuccessNotice, setPickerSuccessNotice] = useState<string | null>(null);

  const [allSewaBarang, setAllSewaBarang] = useState<BarangRecord[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const rawBarang = getStoredBarang().filter((b) => b.jenis === "sewa");
    setAllSewaBarang(rawBarang);

    const kats = getStoredKategori().map((k) => k.nama);
    setKategoriList(kats);

    if (editId) {
      const allPaket = getStoredPaket();
      const target = allPaket.find(
        (p) => p.id === editId || p.kode.toLowerCase() === editId.toLowerCase()
      );
      if (target) {
        setIsEditMode(true);
        setKode(target.kode);
        setNama(target.nama);
        setDeskripsi(typeof target.deskripsi === "string" ? target.deskripsi : "");
        setHargaPerHari(target.hargaPerHari);
        setStatus(target.status);
        setFoto(target.foto || null);

        // Parse items string array e.g. "Tenda Dome 2P ×1"
        const parsedItems: ItemPenyusun[] = target.barangPenyusun.map((itemStr, idx) => {
          const parts = itemStr.split("×");
          if (parts.length === 2) {
            return {
              id: `edit-p-${idx}-${Date.now()}`,
              nama: parts[0].trim(),
              qty: parseInt(parts[1].trim(), 10) || 1,
            };
          }
          return {
            id: `edit-p-${idx}-${Date.now()}`,
            nama: itemStr.trim(),
            qty: 1,
          };
        });
        setItems(parsedItems.length > 0 ? parsedItems : [{ id: "p-1", nama: "Tenda Dome 2P", qty: 1 }]);
        return;
      }
    }

    // Default New Paket: Generate Next Sequential Code (PKT-001, PKT-002, ...)
    const allExisting = getStoredPaket();
    const highestNum = allExisting.reduce((max, p) => {
      const match = p.kode.match(/PKT-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        return Math.max(max, num);
      }
      return max;
    }, 0);
    const nextKode = `PKT-${String(highestNum + 1).padStart(3, "0")}`;
    setKode(nextKode);
  }, [editId]);

  // Handle Local File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file gambar (JPG, PNG, atau WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file gambar maksimal 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setFoto(event.target.result);
        setShowUrlInput(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Apply External URL
  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setFoto(urlInput.trim());
      setShowUrlInput(false);
      setUrlInput("");
    }
  };

  // Remove Item from Package
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      setErrorMsg("Paket penyewaan harus memiliki minimal 1 barang penyusun.");
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  // Change Item Qty directly
  const handleItemQtyChange = (id: string, qty: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, qty: Math.max(1, qty) };
        }
        return item;
      })
    );
  };

  // Add Item From Picker Form
  const handleAddFromPicker = (b: BarangRecord, variasiName?: string, specDetail?: string) => {
    const itemName = variasiName ? `${b.nama} (${variasiName})` : b.nama;
    const addQty = pickerQtyMap[b.id] || 1;

    // Check if item already exists
    const existingIndex = items.findIndex((it) => it.nama.toLowerCase() === itemName.toLowerCase());
    if (existingIndex >= 0) {
      const copy = [...items];
      copy[existingIndex].qty += addQty;
      setItems(copy);
    } else {
      setItems([
        ...items,
        {
          id: `item-${Date.now()}-${Math.random()}`,
          nama: itemName,
          qty: addQty,
          spesifikasi: specDetail || b.informasiSpesifikasi || b.kategori,
          foto: b.foto,
        },
      ]);
    }

    setPickerSuccessNotice(`"${itemName} ×${addQty}" ditambahkan ke paket.`);
    setTimeout(() => setPickerSuccessNotice(null), 2500);
  };

  // Filtered Barang for Picker Form
  const filteredPickerBarang = useMemo(() => {
    return allSewaBarang.filter((b) => {
      if (pickerKategori !== "semua" && b.kategori !== pickerKategori) return false;
      if (pickerSearch.trim()) {
        const q = pickerSearch.toLowerCase();
        const matchName = b.nama.toLowerCase().includes(q);
        const matchKode = b.kode.toLowerCase().includes(q);
        const matchKat = b.kategori.toLowerCase().includes(q);
        const matchSpec = (b.informasiSpesifikasi || "").toLowerCase().includes(q);
        const matchVar = (b.variasi || []).some((v) =>
          v.namaVariasi.toLowerCase().includes(q) || v.spesifikasi.toLowerCase().includes(q)
        );
        if (!matchName && !matchKode && !matchKat && !matchSpec && !matchVar) return false;
      }
      return true;
    });
  }, [allSewaBarang, pickerKategori, pickerSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg("Nama paket penyewaan wajib diisi.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (hargaPerHari <= 0) {
      setErrorMsg("Harga sewa paket harus lebih dari Rp 0.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Minimal satu barang penyusun wajib ditambahkan.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const barangPenyusunArray = items.map((it) => `${it.nama.trim()} ×${it.qty}`);

    const paketToSave: PaketRecord = {
      id: editId || `pkt-${Date.now()}`,
      kode: kode.trim() || `PKT-00${Math.floor(Math.random() * 90 + 10)}`,
      nama: nama.trim(),
      deskripsi: deskripsi.trim() || "Kumpulan barang sewa dalam satu harga paket hemat.",
      hargaPerHari,
      status,
      barangPenyusun: barangPenyusunArray,
      foto: foto || undefined,
    };

    saveOrUpdatePaket(paketToSave);

    const backUrl = role === "owner" ? "/owner/paket" : "/admin/paket";
    router.push(backUrl);
  };

  const backUrl = role === "owner" ? "/owner/paket" : "/admin/paket";

  const getProductIcon = (kat: string) => {
    if (kat === "Pakaian") return "🧥";
    if (kat === "Tenda") return "⛺";
    if (kat === "Tas") return "🎒";
    if (kat === "Alat masak") return "🍳";
    if (kat === "Tidur") return "🛏️";
    if (kat === "Penerangan") return "🔦";
    return "📦";
  };

  return (
    <div className="main">
      <div className="brg-form-container">
        {/* Navigation Breadcrumb & Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <span className="brg-badge">
              DATA BARANG / PAKET PENYEWAAN / {isEditMode ? "UBAH" : "TAMBAH"}
            </span>
            <h1 className="brg-title" style={{ marginTop: "6px" }}>
              {isEditMode ? "Ubah Paket Penyewaan" : "Tambah Paket Penyewaan"}
            </h1>
            <p className="brg-subtitle">
              Satu formulir untuk mendefinisikan bundel barang sewa dengan harga paket khusus dan foto visual.
            </p>
          </div>
          <Link href={backUrl} className="tx-btn-secondary" style={{ textDecoration: "none" }}>
            ← Kembali ke Paket Penyewaan
          </Link>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "12px 16px",
              background: "#FEE2E2",
              border: "1px solid #FCA5A5",
              color: "#DC2626",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Card 1: Foto & Informasi Umum Paket */}
          <div className="brg-card" style={{ width: "100%", padding: "28px" }}>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#0F172A",
                margin: "0 0 18px 0",
              }}
            >
              Foto &amp; Informasi Umum Paket
            </h2>

            {/* Section Foto Paket (Fleksibel: File Lokal atau URL Eksternal) */}
            <div style={{ marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #F1F5F9" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>
                Foto Paket Penyewaan
              </label>

              <div style={{ display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />

                {/* Box Foto Preview 1:1 */}
                <div
                  style={{
                    width: "115px",
                    height: "115px",
                    borderRadius: "14px",
                    background: foto ? "#FFE4E6" : "#F8FAFC",
                    border: foto ? "1px solid #FDA4AF" : "1.5px dashed #CBD5E1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    flexShrink: 0,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {foto ? (
                    foto.startsWith("data:") || foto.startsWith("http") || foto.startsWith("/") ? (
                      <img
                        src={foto}
                        alt="Foto Paket"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <>
                        <span style={{ fontSize: "36px" }}>{foto}</span>
                        <span style={{ fontSize: "9px", fontWeight: 700, color: "#BE123C", letterSpacing: "0.04em" }}>
                          FOTO PAKET
                        </span>
                      </>
                    )
                  ) : (
                    <>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.8">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                      <span style={{ fontSize: "10px", color: "#64748B", textAlign: "center", padding: "0 6px" }}>
                        Belum ada foto
                      </span>
                    </>
                  )}
                </div>

                {/* Upload & URL Action Controls */}
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#1E293B", margin: "0 0 4px" }}>
                    {foto ? "Foto paket terpasang" : "Unggah atau tautkan foto paket"}
                  </p>
                  <p style={{ fontSize: "12px", color: "#64748B", margin: "0 0 10px", lineHeight: 1.4 }}>
                    Foto tampil pada kartu katalog paket penyewaan dan nota transaksi. Anda dapat memilih file dari perangkat atau menggunakan URL gambar web.
                  </p>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: "7px 16px",
                        background: "#0F172A",
                        color: "#FFFFFF",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Pilih dari file
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      style={{
                        padding: "7px 14px",
                        background: "#EFF6FF",
                        color: "#0284C7",
                        border: "1px solid #BFDBFE",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      {showUrlInput ? "Tutup input URL" : "Pakai URL eksternal"}
                    </button>

                    {foto && (
                      <button
                        type="button"
                        onClick={() => setFoto(null)}
                        style={{
                          padding: "7px 14px",
                          background: "#FFFFFF",
                          color: "#DC2626",
                          border: "1px solid #FECACA",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Hapus foto
                      </button>
                    )}
                  </div>

                  {/* Inline External URL Input */}
                  {showUrlInput && (
                    <div style={{ marginTop: "12px", display: "flex", gap: "8px", maxWidth: "460px" }}>
                      <input
                        type="url"
                        className="tx-input"
                        placeholder="Tempel tautan gambar https://... (JPG, PNG, WebP)"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        style={{ fontSize: "12.5px" }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyUrl}
                        style={{
                          padding: "7px 16px",
                          background: "#0284C7",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Terapkan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nama & Kode Paket */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Nama Paket <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="text"
                  className="tx-input"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Paket Pendakian 2 Orang"
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Kode Paket (Otomatis)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="tx-input"
                    value={kode}
                    readOnly
                    style={{
                      background: "#F1F5F9",
                      color: "#334155",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      cursor: "not-allowed",
                      letterSpacing: "0.05em",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "10px",
                      fontSize: "10px",
                      background: "#E0F2FE",
                      color: "#0369A1",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontWeight: 700,
                    }}
                  >
                    OTOMATIS
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "#64748B", marginTop: "4px", display: "block" }}>
                  Dibuat otomatis berurutan oleh sistem agar unik dan tidak duplikat.
                </span>
              </div>
            </div>

            {/* Harga Sewa & Status Paket */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Harga Sewa Paket / Hari (Rp) <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  className="tx-input"
                  value={hargaPerHari}
                  onChange={(e) => setHargaPerHari(Number(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Status Paket
                </label>
                <select
                  className="tx-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "aktif" | "nonaktif")}
                >
                  <option value="aktif">Aktif (Dapat dipilih di Transaksi &amp; Booking)</option>
                  <option value="nonaktif">Nonaktif (Diarsipkan)</option>
                </select>
              </div>
            </div>

            {/* Deskripsi Paket */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "6px",
                }}
              >
                Deskripsi Paket
              </label>
              <textarea
                className="tx-input"
                rows={3}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Rincian paket atau panduan penggunaan bagi penyewa..."
              />
            </div>
          </div>

          {/* Card 2: Barang Penyusun Paket */}
          <div className="brg-card" style={{ width: "100%", padding: "28px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#0F172A",
                    margin: "0 0 4px 0",
                  }}
                >
                  Barang Penyusun Paket
                </h2>
                <p style={{ margin: 0, fontSize: "12.5px", color: "#64748B" }}>
                  Tentukan item barang sewa dan jumlah unit yang diperoleh pelanggan dalam satu paket.
                </p>
              </div>

              {/* Button "+ Tambah barang penyusun" membuka Form Pencari Visual */}
              <button
                type="button"
                onClick={() => {
                  setPickerSearch("");
                  setPickerKategori("semua");
                  setIsPickerOpen(true);
                }}
                style={{
                  padding: "9px 18px",
                  background: "#0284C7",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 1px 3px rgba(2, 132, 199, 0.2)",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                + Tambah barang penyusun
              </button>
            </div>

            {/* List Table of Selected Items */}
            <div style={{ overflowX: "auto", border: "1.5px solid #E2E8F0", borderRadius: "10px", marginBottom: "16px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0" }}>
                    <th style={{ padding: "11px 16px", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: "11.5px", textTransform: "uppercase" }}>
                      Nama Barang Sewa
                    </th>
                    <th style={{ padding: "11px 16px", textAlign: "left", width: "160px", fontWeight: 700, color: "#475569", fontSize: "11.5px", textTransform: "uppercase" }}>
                      Jumlah (Unit)
                    </th>
                    <th style={{ padding: "11px 16px", textAlign: "center", width: "100px", fontWeight: 700, color: "#475569", fontSize: "11.5px", textTransform: "uppercase" }}>
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: idx < items.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: 600, color: "#0F172A", fontSize: "13.5px" }}>
                          {item.nama}
                        </div>
                        {item.spesifikasi && (
                          <div style={{ fontSize: "11.5px", color: "#64748B", marginTop: "2px" }}>
                            {item.spesifikasi}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ color: "#64748B", fontWeight: 700 }}>×</span>
                          <input
                            type="number"
                            min="1"
                            className="tx-input"
                            value={item.qty}
                            onChange={(e) =>
                              handleItemQtyChange(item.id, parseInt(e.target.value, 10) || 1)
                            }
                            style={{ width: "85px", height: "38px", textAlign: "center", fontWeight: 600 }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          style={{
                            background: "#FFF5F5",
                            border: "1px solid #FECACA",
                            color: "#DC2626",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Tag */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
                padding: "12px 16px",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                fontSize: "12.5px",
              }}
            >
              <span style={{ fontWeight: 600, color: "#334155" }}>Pratinjau Bundel:</span>
              {items.map((it, idx) => (
                <span
                  key={idx}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #CBD5E1",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    color: "#0F172A",
                    fontWeight: 500,
                  }}
                >
                  {it.nama} ×{it.qty}
                </span>
              ))}
              <span style={{ marginLeft: "auto", fontWeight: 700, color: "#0284C7", fontSize: "13.5px" }}>
                Total Harga Paket: Rp {hargaPerHari.toLocaleString("id-ID")} / hari
              </span>
            </div>
          </div>

          {/* Banner Notice Sesuai Ketentuan */}
          <div
            style={{
              padding: "14px 18px",
              background: "#E0F2FE",
              border: "1px solid #BAE6FD",
              borderRadius: "10px",
              fontSize: "12.5px",
              color: "#0369A1",
              lineHeight: 1.5,
            }}
          >
            Hanya Barang Sewa yang dapat masuk paket. Komposisi dan harga paket disimpan salinannya di setiap booking atau transaksi, jadi perubahan paket tidak mengubah catatan lama.
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "12px",
              paddingBottom: "32px",
            }}
          >
            <Link
              href={backUrl}
              style={{
                padding: "9px 22px",
                background: "#FFFFFF",
                border: "1.5px solid #CBD5E1",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#475569",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Batal
            </Link>
            <button
              type="submit"
              style={{
                padding: "9px 26px",
                background: "#0F172A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              Simpan paket
            </button>
          </div>
        </form>

        {/* ─── MODAL FORM PEMILIH BARANG PENYUSUN VISUAL (SEARCH BAR + SPESIFIKASI + GAMBAR) ─── */}
        {isPickerOpen && (
          <div className="tx-modal-overlay">
            <div
              className="tx-modal-container"
              style={{
                maxWidth: "780px",
                maxHeight: "88vh",
                display: "flex",
                flexDirection: "column",
                background: "#FFFFFF",
                borderRadius: "16px",
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid #E2E8F0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
                    Pilih Barang Penyusun Paket
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#64748B" }}>
                    Cari produk sewa dan tentukan jumlah unit yang dimasukkan ke dalam paket bundel ini.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "22px",
                    color: "#94A3B8",
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "6px",
                  }}
                >
                  ×
                </button>
              </div>

              {/* Toast Notifikasi Sukses Tambah */}
              {pickerSuccessNotice && (
                <div
                  style={{
                    background: "#ECFDF5",
                    borderBottom: "1px solid #A7F3D0",
                    padding: "8px 24px",
                    fontSize: "12.5px",
                    color: "#065F46",
                    fontWeight: 600,
                  }}
                >
                  ✓ {pickerSuccessNotice}
                </div>
              )}

              {/* Search & Kategori Filter */}
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
                {/* Search Bar Input */}
                <div style={{ position: "relative", marginBottom: "12px" }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748B"
                    strokeWidth="2"
                    style={{ position: "absolute", left: "12px", top: "12px" }}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="tx-input"
                    placeholder="Cari berdasarkan nama produk, spesifikasi, merek, atau kode..."
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    style={{ paddingLeft: "38px" }}
                    autoFocus
                  />
                  {pickerSearch && (
                    <button
                      type="button"
                      onClick={() => setPickerSearch("")}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "10px",
                        background: "none",
                        border: "none",
                        color: "#94A3B8",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Filter Kategori Pills */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setPickerKategori("semua")}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "1px solid",
                      background: pickerKategori === "semua" ? "#0284C7" : "#FFFFFF",
                      borderColor: pickerKategori === "semua" ? "#0284C7" : "#CBD5E1",
                      color: pickerKategori === "semua" ? "#FFFFFF" : "#475569",
                    }}
                  >
                    Semua ({allSewaBarang.length})
                  </button>
                  {kategoriList.map((kat) => {
                    const count = allSewaBarang.filter((b) => b.kategori === kat).length;
                    return (
                      <button
                        key={kat}
                        type="button"
                        onClick={() => setPickerKategori(kat)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "1px solid",
                          background: pickerKategori === kat ? "#0284C7" : "#FFFFFF",
                          borderColor: pickerKategori === kat ? "#0284C7" : "#CBD5E1",
                          color: pickerKategori === kat ? "#FFFFFF" : "#475569",
                        }}
                      >
                        {kat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product List with Images & Specifications */}
              <div style={{ padding: "16px 24px", overflowY: "auto", flex: 1 }}>
                {filteredPickerBarang.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748B", fontSize: "13.5px" }}>
                    Tidak ada barang sewa yang cocok dengan pencarian &quot;{pickerSearch}&quot;.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {filteredPickerBarang.map((b) => {
                      const qtyToAdd = pickerQtyMap[b.id] || 1;
                      return (
                        <div
                          key={b.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            padding: "12px 16px",
                            border: "1.5px solid #E2E8F0",
                            borderRadius: "10px",
                            background: "#FFFFFF",
                            transition: "border-color 0.15s ease",
                          }}
                        >
                          {/* Gambar / Foto Produk */}
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "10px",
                              background: "#F8FAFC",
                              border: "1px solid #E2E8F0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {b.foto ? (
                              b.foto.startsWith("data:") || b.foto.startsWith("http") || b.foto.startsWith("/") ? (
                                <img
                                  src={b.foto}
                                  alt={b.nama}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : (
                                <span style={{ fontSize: "28px" }}>{b.foto}</span>
                              )
                            ) : (
                              <span style={{ fontSize: "24px" }}>{getProductIcon(b.kategori)}</span>
                            )}
                          </div>

                          {/* Detail Produk & Spesifikasi */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <span style={{ fontWeight: 700, color: "#0F172A", fontSize: "14px" }}>
                                {b.nama}
                              </span>
                              <span
                                style={{
                                  background: "#EFF6FF",
                                  color: "#1D4ED8",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                }}
                              >
                                {b.kategori}
                              </span>
                              <span style={{ fontSize: "11px", color: "#64748B", fontFamily: "monospace" }}>
                                {b.kode}
                              </span>
                            </div>

                            {/* Spesifikasi Detail */}
                            <div style={{ fontSize: "12.5px", color: "#475569", marginTop: "4px" }}>
                              <strong>Spesifikasi:</strong>{" "}
                              {b.informasiSpesifikasi || b.ringkasanVariasi || "Standar operasional outdoor"}
                            </div>

                            {/* Harga & Ketersediaan Stok */}
                            <div style={{ fontSize: "11.5px", color: "#64748B", marginTop: "3px" }}>
                              Harga normal: <strong style={{ color: "#0F172A" }}>{b.rentangHargaDisplay}</strong> · Stok:{" "}
                              <strong>{b.totalStokDisplay}</strong>
                            </div>
                          </div>

                          {/* Action & Qty Selector */}
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>Qty:</span>
                              <input
                                type="number"
                                min="1"
                                max="99"
                                value={qtyToAdd}
                                onChange={(e) =>
                                  setPickerQtyMap({
                                    ...pickerQtyMap,
                                    [b.id]: Math.max(1, parseInt(e.target.value, 10) || 1),
                                  })
                                }
                                style={{
                                  width: "55px",
                                  height: "36px",
                                  textAlign: "center",
                                  borderRadius: "6px",
                                  border: "1.5px solid #CBD5E1",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  background: "#FFFFFF",
                                }}
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddFromPicker(b, undefined, b.informasiSpesifikasi)}
                              style={{
                                padding: "8px 14px",
                                background: "#0F172A",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "12.5px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                transition: "all 0.15s ease",
                              }}
                            >
                              + Tambahkan
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: "14px 24px",
                  borderTop: "1px solid #E2E8F0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F8FAFC",
                }}
              >
                <div style={{ fontSize: "12.5px", color: "#475569" }}>
                  Item dalam paket saat ini: <strong>{items.length} jenis barang</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
                  style={{
                    padding: "8px 20px",
                    background: "#0284C7",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Selesai memilih
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
