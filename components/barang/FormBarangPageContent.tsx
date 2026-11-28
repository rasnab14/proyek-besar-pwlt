// components/barang/FormBarangPageContent.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BarangRecord, JenisBarang, VariasiBarang } from "./types";
import { getStoredBarang, saveOrUpdateBarang, getStoredKategori } from "./barangStore";
import "./barang.css";

interface FormBarangPageContentProps {
  role: "admin" | "owner";
}

export function FormBarangPageContent({ role }: FormBarangPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const defaultJenis = (searchParams.get("jenis") as JenisBarang) || "sewa";

  const [categories, setCategories] = useState<string[]>([]);
  const [jenis, setJenis] = useState<JenisBarang>(defaultJenis);
  const [foto, setFoto] = useState<string | null>(null);

  // Informasi Umum
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [kategori, setKategori] = useState("Pakaian");
  const [infoSpesifikasi, setInfoSpesifikasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  // Checkbox spesifikasi yang membedakan variasi (Barang Sewa)
  const [specMerek, setSpecMerek] = useState(true);
  const [specUkuran, setSpecUkuran] = useState(true);
  const [specKapasitas, setSpecKapasitas] = useState(false);
  const [specJenis, setSpecJenis] = useState(false);
  const [customSpecs, setCustomSpecs] = useState<string[]>([]);
  const [activeCustomSpecs, setActiveCustomSpecs] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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
      }
    };
    reader.readAsDataURL(file);
  };

  const [isAddingCustomSpec, setIsAddingCustomSpec] = useState(false);
  const [newSpecInput, setNewSpecInput] = useState("");

  const handleConfirmAddCustomSpec = () => {
    if (newSpecInput && newSpecInput.trim()) {
      const clean = newSpecInput.trim();
      const formatted = clean.charAt(0).toUpperCase() + clean.slice(1);
      if (!customSpecs.includes(formatted)) {
        setCustomSpecs([...customSpecs, formatted]);
        setActiveCustomSpecs([...activeCustomSpecs, formatted]);
      } else if (!activeCustomSpecs.includes(formatted)) {
        setActiveCustomSpecs([...activeCustomSpecs, formatted]);
      }
      setNewSpecInput("");
      setIsAddingCustomSpec(false);
    }
  };

  const handleRemoveCustomSpec = (specName: string) => {
    setCustomSpecs(customSpecs.filter((s) => s !== specName));
    setActiveCustomSpecs(activeCustomSpecs.filter((s) => s !== specName));
  };

  // List Variasi
  const [variasiList, setVariasiList] = useState<VariasiBarang[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const kats = getStoredKategori();
    const katNames = kats.map((k) => k.nama);
    setCategories(katNames);

    if (editId) {
      const allBarang = getStoredBarang();
      const target = allBarang.find((b) => b.id === editId || b.kode.toLowerCase() === editId.toLowerCase());
      if (target) {
        setIsEditMode(true);
        setJenis(target.jenis);
        setFoto(target.foto || (target.jenis === "sewa" ? "🧥" : null));
        setNama(target.nama);
        setKode(target.kode);
        setKategori(target.kategori);
        setInfoSpesifikasi(
          typeof target.informasiSpesifikasi === "string"
            ? target.informasiSpesifikasi
            : "Waterproof, bahan ripstop"
        );
        setDeskripsi(
          typeof target.deskripsi === "string"
            ? target.deskripsi
            : "Jaket outdoor tahan angin dan air untuk pendakian gunung."
        );
        setVariasiList(target.variasi || []);
        return;
      }
    }

    // Default Tambah Baru (Sesuai Referensi Screenshot)
    if (defaultJenis === "jual") {
      setJenis("jual");
      setFoto(null);
      setNama("Gas Kaleng 230 g");
      setKode("GAS");
      setKategori("Alat masak");
      setInfoSpesifikasi("Butana campuran, tabung 230 g");
      setDeskripsi("Gas butana portabel untuk kompor camping outdoor.");
      setVariasiList([
        {
          id: `v-jual-1`,
          namaVariasi: "Merek Butana, 230 g",
          spesifikasi: "Merek Butana, 230 g",
          harga: 28000,
          stok: 64,
          batasStokMin: 10,
          satuan: "pcs",
          sku: "GAS-01",
        },
      ]);
    } else {
      setJenis("sewa");
      setFoto("🧥");
      setNama("Jaket Gunung");
      setKode("JKT");
      setKategori(katNames[0] || "Pakaian");
      setInfoSpesifikasi("Waterproof, bahan ripstop");
      setDeskripsi("Jaket outdoor tahan angin dan air untuk pendakian gunung.");
      setVariasiList([
        {
          id: `v-1`,
          namaVariasi: "Rimba · M",
          merek: "Rimba",
          ukuran: "M",
          kodeUnitRange: "JKT001 – JKT008",
          spesifikasi: "Merek Rimba, ukuran M",
          harga: 25000,
          stok: 8,
        },
        {
          id: `v-2`,
          namaVariasi: "Rimba · L",
          merek: "Rimba",
          ukuran: "L",
          kodeUnitRange: "JKT009 – JKT016",
          spesifikasi: "Merek Rimba, ukuran L",
          harga: 25000,
          stok: 8,
        },
        {
          id: `v-3`,
          namaVariasi: "Kelana · XL",
          merek: "Kelana",
          ukuran: "XL",
          kodeUnitRange: "JKT017 – JKT022",
          spesifikasi: "Merek Kelana, ukuran XL",
          harga: 35000,
          stok: 6,
        },
      ]);
    }
  }, [editId, defaultJenis]);

  const handleSwitchJenis = (newJenis: JenisBarang) => {
    setJenis(newJenis);
    if (newJenis === "jual") {
      setFoto(null);
      setNama("Gas Kaleng 230 g");
      setKode("GAS");
      setKategori("Alat masak");
      setInfoSpesifikasi("Butana campuran, tabung 230 g");
      setDeskripsi("Gas butana portabel untuk kompor camping outdoor.");
      setVariasiList([
        {
          id: `v-jual-1`,
          namaVariasi: "Merek Butana, 230 g",
          spesifikasi: "Merek Butana, 230 g",
          harga: 28000,
          stok: 64,
          batasStokMin: 10,
          satuan: "pcs",
          sku: "GAS-01",
        },
      ]);
    } else {
      setFoto("🧥");
      setNama("Jaket Gunung");
      setKode("JKT");
      setKategori("Pakaian");
      setInfoSpesifikasi("Waterproof, bahan ripstop");
      setDeskripsi("Jaket outdoor tahan angin dan air untuk pendakian gunung.");
      setVariasiList([
        {
          id: `v-1`,
          namaVariasi: "Rimba · M",
          merek: "Rimba",
          ukuran: "M",
          kodeUnitRange: "JKT001 – JKT008",
          spesifikasi: "Merek Rimba, ukuran M",
          harga: 25000,
          stok: 8,
        },
      ]);
    }
  };

  const recalculateUnitRanges = (prefix: string, list: VariasiBarang[]) => {
    let currentStart = 1;
    return list.map((v) => {
      const count = Number(v.stok) || 0;
      if (count <= 0) return { ...v, kodeUnitRange: "-" };
      const startNum = String(currentStart).padStart(3, "0");
      const endNum = String(currentStart + count - 1).padStart(3, "0");
      currentStart += count;
      return {
        ...v,
        kodeUnitRange: `${prefix}${startNum} – ${prefix}${endNum}`,
      };
    });
  };

  const handleAddVariasi = () => {
    if (jenis === "sewa") {
      const newItem: VariasiBarang = {
        id: `v-${Date.now()}`,
        namaVariasi: "Variasi Baru",
        merek: specMerek ? "Rimba" : "",
        ukuran: specUkuran ? "M" : "",
        kapasitas: specKapasitas ? "2P" : "",
        spesifikasi: "",
        harga: 25000,
        stok: 5,
      };
      const updated = recalculateUnitRanges(kode || "UNIT", [...variasiList, newItem]);
      setVariasiList(updated);
    } else {
      const num = variasiList.length + 1;
      setVariasiList((prev) => [
        ...prev,
        {
          id: `v-${Date.now()}`,
          namaVariasi: `Variasi ${num}`,
          spesifikasi: "Merek Butana, 230 g",
          harga: 28000,
          stok: 50,
          batasStokMin: 10,
          satuan: "pcs",
          sku: `${kode || "SKU"}-${String(num).padStart(2, "0")}`,
        },
      ]);
    }
  };

  const handleRemoveVariasi = (idx: number) => {
    if (variasiList.length <= 1) return;
    const filtered = variasiList.filter((_, i) => i !== idx);
    if (jenis === "sewa") {
      setVariasiList(recalculateUnitRanges(kode || "UNIT", filtered));
    } else {
      setVariasiList(filtered);
    }
  };

  const handleVariasiChange = (idx: number, field: keyof VariasiBarang, value: any) => {
    setVariasiList((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      if (field === "stok" && jenis === "sewa") {
        return recalculateUnitRanges(kode || "UNIT", copy);
      }
      return copy;
    });
  };

  const totalUnit = variasiList.reduce((acc, v) => acc + (Number(v.stok) || 0), 0);
  const prices = variasiList.map((v) => Number(v.harga) || 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const nextUnitStart = String(totalUnit + 1).padStart(3, "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kode.trim() || !nama.trim()) {
      setErrorMsg("Nama produk dan kode produk wajib diisi.");
      return;
    }

    let priceDisplay = "";
    if (minPrice === maxPrice) {
      priceDisplay = `Rp ${minPrice.toLocaleString("id-ID")}${jenis === "sewa" ? " / hari" : ""}`;
    } else {
      priceDisplay = `Rp ${minPrice.toLocaleString("id-ID")} – ${maxPrice.toLocaleString("id-ID")}${jenis === "sewa" ? " / hari" : ""}`;
    }

    const ringkasan =
      jenis === "sewa"
        ? `${variasiList.length} variasi · ukuran S–XXL, 2 merek`
        : `${variasiList.length} variasi · satu baris kuantitas`;

    saveOrUpdateBarang({
      id: editId || `brg-${Date.now()}`,
      kode: kode.trim().toUpperCase(),
      nama: nama.trim(),
      kategori,
      jenis,
      informasiSpesifikasi: infoSpesifikasi,
      deskripsi: deskripsi.trim() || "-",
      foto: foto || undefined,
      rentangHargaDisplay: priceDisplay,
      totalStokDisplay: `${totalUnit} ${jenis === "sewa" ? "unit" : "pcs"}`,
      ringkasanVariasi: ringkasan,
      variasi: variasiList,
      terkaitTransaksi: isEditMode,
    });

    const targetUrl = role === "owner" ? "/owner/barang" : "/admin/barang";
    router.push(targetUrl);
  };

  const backUrl = role === "owner" ? "/owner/barang" : "/admin/barang";

  return (
    <div className="main">
      <div className="brg-form-container">
        {/* Header Breadcrumb & Judul Sesuai Gambar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <span className="brg-badge">DATA BARANG / SEMUA BARANG / {isEditMode ? "UBAH" : "TAMBAH"}</span>
            <h1 className="brg-title" style={{ marginTop: "6px" }}>
              {isEditMode ? "Ubah Data Barang" : "Tambah / Ubah Barang"}
            </h1>
            <p className="brg-subtitle">
              Satu formulir untuk Barang Sewa dan Barang Jual; isian menyesuaikan jenis yang dipilih.
            </p>
          </div>
          <Link href={backUrl} className="tx-btn-secondary" style={{ textDecoration: "none" }}>
            ← Kembali ke Semua Barang
          </Link>
        </div>

        {/* Card Formulir Penuh (Clean Card Sesuai Screenshot) */}
        <div className="brg-card" style={{ width: "100%", padding: "28px" }}>
          <form onSubmit={handleSubmit}>
            {errorMsg && (
              <div style={{ padding: "10px 14px", background: "#FEE2E2", color: "#DC2626", borderRadius: "8px", fontSize: "12.5px", marginBottom: "18px" }}>
                {errorMsg}
              </div>
            )}

            {/* 1. Tombol Pilihan Jenis Barang (Tab Switcher) */}
            <div style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>
                Jenis barang
              </label>
              <div style={{ display: "inline-flex", background: "#F1F5F9", padding: "4px", borderRadius: "8px", gap: "4px" }}>
                <button
                  type="button"
                  onClick={() => handleSwitchJenis("sewa")}
                  style={{
                    padding: "7px 20px",
                    fontSize: "13px",
                    fontWeight: 600,
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    background: jenis === "sewa" ? "#0284C7" : "transparent",
                    color: jenis === "sewa" ? "#FFFFFF" : "#64748B",
                    boxShadow: jenis === "sewa" ? "0 1px 3px rgba(2,132,199,0.25)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  Barang Sewa
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchJenis("jual")}
                  style={{
                    padding: "7px 20px",
                    fontSize: "13px",
                    fontWeight: 600,
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    background: jenis === "jual" ? "#0284C7" : "transparent",
                    color: jenis === "jual" ? "#FFFFFF" : "#64748B",
                    boxShadow: jenis === "jual" ? "0 1px 3px rgba(2,132,199,0.25)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  Barang Jual
                </button>
              </div>
            </div>

            {/* 2. Foto Produk */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>
                Foto produk
              </label>
              <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />

                {/* Box Foto */}
                <div
                  style={{
                    width: "115px",
                    height: "115px",
                    borderRadius: "14px",
                    background: foto ? "#FEF3C7" : "#F8FAFC",
                    border: foto ? "1px solid #FDE68A" : "1.5px dashed #CBD5E1",
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
                        alt="Foto Produk"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <>
                        <span style={{ fontSize: "36px" }}>{foto}</span>
                        <span style={{ fontSize: "9px", fontWeight: 700, color: "#B45309", letterSpacing: "0.04em" }}>
                          FOTO SAAT INI
                        </span>
                      </>
                    )
                  ) : (
                    <>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.8">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <span style={{ fontSize: "10px", color: "#64748B", textAlign: "center", padding: "0 6px" }}>
                        Belum ada foto
                      </span>
                    </>
                  )}
                </div>

                {/* Upload Action */}
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#1E293B", margin: "0 0 4px" }}>
                    {foto ? "Foto produk" : "Foto produk belum diunggah"}
                  </p>
                  <p style={{ fontSize: "12px", color: "#64748B", margin: "0 0 10px" }}>
                    Tampil di Semua Barang, Detail Barang, dan katalog transaksi.
                  </p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: "7px 16px",
                        background: "#0F172A",
                        color: "#FFFFFF",
                        borderRadius: "6px",
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
                      {foto ? "Pilih foto" : "Pilih foto"}
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
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Hapus foto
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                    Format JPG, PNG, atau WebP · maksimal 2 MB · disarankan rasio 1:1 agar rapi pada katalog.
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Informasi Umum */}
            <div style={{ marginBottom: "26px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", margin: "0 0 14px" }}>
                Informasi umum
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                    Nama produk
                  </label>
                  <input
                    type="text"
                    className="tx-input"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    style={{ width: "100%", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                    Kode produk
                  </label>
                  <input
                    type="text"
                    className="tx-input"
                    value={kode}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setKode(val);
                      if (jenis === "sewa") {
                        setVariasiList((prev) => recalculateUnitRanges(val, prev));
                      }
                    }}
                    style={{ width: "100%", fontSize: "13px" }}
                  />
                  <span style={{ fontSize: "11px", color: "#64748B" }}>
                    {jenis === "sewa" ? "Dipakai sebagai awalan kode unit." : "Dipakai sebagai awalan SKU variasi."}
                  </span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                    Kategori
                  </label>
                  <select
                    className="tx-select"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    style={{ width: "100%", fontSize: "13px" }}
                  >
                    {categories.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                    Informasi spesifikasi
                  </label>
                  <input
                    type="text"
                    className="tx-input"
                    value={infoSpesifikasi}
                    onChange={(e) => setInfoSpesifikasi(e.target.value)}
                    placeholder={jenis === "sewa" ? "Waterproof, bahan ripstop" : "Butana campuran, tabung 230 g"}
                    style={{ width: "100%", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Deskripsi
                </label>
                <textarea
                  className="tx-input"
                  rows={2}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  style={{ width: "100%", fontSize: "13px" }}
                />
              </div>
            </div>

            {/* 4. Section Variasi: Menyesuaikan Jenis Barang (Sewa vs Jual) */}
            {jenis === "sewa" ? (
              /* --- VARIASI BARANG SEWA --- */
              <div style={{ marginBottom: "26px" }}>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}>
                    Spesifikasi yang membedakan variasi
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", cursor: "pointer", color: "#334155", fontWeight: 500 }}>
                      <input
                        type="checkbox"
                        checked={specMerek}
                        onChange={(e) => setSpecMerek(e.target.checked)}
                      />
                      Merek
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", cursor: "pointer", color: "#334155", fontWeight: 500 }}>
                      <input
                        type="checkbox"
                        checked={specUkuran}
                        onChange={(e) => setSpecUkuran(e.target.checked)}
                      />
                      Ukuran
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", cursor: "pointer", color: "#334155", fontWeight: 500 }}>
                      <input
                        type="checkbox"
                        checked={specKapasitas}
                        onChange={(e) => setSpecKapasitas(e.target.checked)}
                      />
                      Kapasitas
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", cursor: "pointer", color: "#334155", fontWeight: 500 }}>
                      <input
                        type="checkbox"
                        checked={specJenis}
                        onChange={(e) => setSpecJenis(e.target.checked)}
                      />
                      Jenis
                    </label>
                    {customSpecs.map((spec) => (
                      <label
                        key={spec}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12.5px",
                          cursor: "pointer",
                          color: "#334155",
                          fontWeight: 500,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={activeCustomSpecs.includes(spec)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setActiveCustomSpecs([...activeCustomSpecs, spec]);
                            } else {
                              setActiveCustomSpecs(activeCustomSpecs.filter((s) => s !== spec));
                            }
                          }}
                        />
                        <span>{spec}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCustomSpec(spec);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#94A3B8",
                            cursor: "pointer",
                            padding: "0 2px",
                            fontSize: "14px",
                            lineHeight: 1,
                          }}
                          title={`Hapus spesifikasi ${spec}`}
                        >
                          ×
                        </button>
                      </label>
                    ))}
                    {isAddingCustomSpec ? (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "#EFF6FF",
                          border: "1.5px solid #0284C7",
                          borderRadius: "8px",
                          padding: "3px 6px 3px 10px",
                          boxShadow: "0 2px 6px rgba(2, 132, 199, 0.15)",
                        }}
                      >
                        <input
                          type="text"
                          autoFocus
                          placeholder="Nama spesifikasi (mis. Warna, Bahan)..."
                          value={newSpecInput}
                          onChange={(e) => setNewSpecInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleConfirmAddCustomSpec();
                            } else if (e.key === "Escape") {
                              setIsAddingCustomSpec(false);
                              setNewSpecInput("");
                            }
                          }}
                          style={{
                            border: "none",
                            background: "transparent",
                            fontSize: "12.5px",
                            outline: "none",
                            color: "#0F172A",
                            width: "160px",
                            fontWeight: 500,
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleConfirmAddCustomSpec}
                          style={{
                            padding: "4px 10px",
                            background: "#0284C7",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingCustomSpec(false);
                            setNewSpecInput("");
                          }}
                          style={{
                            padding: "4px 6px",
                            background: "transparent",
                            color: "#64748B",
                            border: "none",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          title="Batal"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomSpec(true)}
                        style={{
                          padding: "5px 12px",
                          background: "#EFF6FF",
                          border: "1px solid #BFDBFE",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#0284C7",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.15s ease",
                        }}
                      >
                        + Spesifikasi lain
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "4px", height: "14px", background: "#0284C7", borderRadius: "2px" }} />
                        <h4 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                          Variasi &amp; unit awal
                        </h4>
                      </div>
                      <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 10px" }}>
                        Harga sewa dapat berbeda per variasi. Setiap unit dibuat sebagai satu baris dengan kode unik otomatis.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariasi}
                      style={{
                        padding: "6px 14px",
                        background: "#FFFFFF",
                        border: "1px solid #CBD5E1",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#0F172A",
                        cursor: "pointer",
                      }}
                    >
                      + Tambah variasi
                    </button>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                          {specMerek && <th style={{ padding: "8px 10px", textAlign: "left" }}>MEREK</th>}
                          {specUkuran && <th style={{ padding: "8px 10px", textAlign: "left" }}>UKURAN</th>}
                          {specKapasitas && <th style={{ padding: "8px 10px", textAlign: "left" }}>KAPASITAS</th>}
                          {specJenis && <th style={{ padding: "8px 10px", textAlign: "left" }}>JENIS</th>}
                          {activeCustomSpecs.map((spec) => (
                            <th key={spec} style={{ padding: "8px 10px", textAlign: "left" }}>
                              {spec.toUpperCase()}
                            </th>
                          ))}
                          <th style={{ padding: "8px 10px", textAlign: "left" }}>HARGA SEWA / HARI (RP)</th>
                          <th style={{ padding: "8px 10px", textAlign: "left", width: "110px" }}>JUMLAH UNIT</th>
                          <th style={{ padding: "8px 10px", textAlign: "left" }}>KODE UNIT YANG DIBUAT</th>
                          <th style={{ padding: "8px 10px", textAlign: "right" }} />
                        </tr>
                      </thead>
                      <tbody>
                        {variasiList.map((v, idx) => (
                          <tr key={v.id || idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                            {specMerek && (
                              <td style={{ padding: "8px 10px" }}>
                                <input
                                  type="text"
                                  className="tx-input"
                                  value={v.merek || ""}
                                  onChange={(e) => handleVariasiChange(idx, "merek", e.target.value)}
                                  style={{ width: "100%", fontSize: "12.5px", padding: "6px 8px" }}
                                />
                              </td>
                            )}
                            {specUkuran && (
                              <td style={{ padding: "8px 10px", width: "90px" }}>
                                <select
                                  className="tx-select"
                                  value={v.ukuran || "M"}
                                  onChange={(e) => handleVariasiChange(idx, "ukuran", e.target.value)}
                                  style={{ width: "100%", fontSize: "12.5px", padding: "6px 24px 6px 8px" }}
                                >
                                  <option value="S">S</option>
                                  <option value="M">M</option>
                                  <option value="L">L</option>
                                  <option value="XL">XL</option>
                                  <option value="XXL">XXL</option>
                                </select>
                              </td>
                            )}
                            {specKapasitas && (
                              <td style={{ padding: "8px 10px" }}>
                                <input
                                  type="text"
                                  className="tx-input"
                                  value={v.kapasitas || ""}
                                  onChange={(e) => handleVariasiChange(idx, "kapasitas", e.target.value)}
                                  placeholder="2P, 4P, 60L"
                                  style={{ width: "100%", fontSize: "12.5px", padding: "6px 8px" }}
                                />
                              </td>
                            )}
                            {specJenis && (
                              <td style={{ padding: "8px 10px" }}>
                                <input
                                  type="text"
                                  className="tx-input"
                                  value={v.jenisSpec || ""}
                                  onChange={(e) => handleVariasiChange(idx, "jenisSpec", e.target.value)}
                                  placeholder="Single / Double Layer"
                                  style={{ width: "100%", fontSize: "12.5px", padding: "6px 8px" }}
                                />
                              </td>
                            )}
                            {activeCustomSpecs.map((spec) => (
                              <td key={spec} style={{ padding: "8px 10px" }}>
                                <input
                                  type="text"
                                  className="tx-input"
                                  value={(v as any)[spec] || ""}
                                  onChange={(e) => handleVariasiChange(idx, spec as any, e.target.value)}
                                  placeholder={`Isi ${spec}`}
                                  style={{ width: "100%", fontSize: "12.5px", padding: "6px 8px" }}
                                />
                              </td>
                            ))}
                            <td style={{ padding: "8px 10px" }}>
                              <input
                                type="number"
                                min="0"
                                step="1000"
                                className="tx-input"
                                value={v.harga}
                                onChange={(e) => handleVariasiChange(idx, "harga", Number(e.target.value) || 0)}
                                style={{ width: "100%", fontSize: "12.5px", padding: "6px 8px", textAlign: "right" }}
                              />
                            </td>
                            <td style={{ padding: "8px 10px" }}>
                              <input
                                type="number"
                                min="1"
                                className="tx-input"
                                value={v.stok}
                                onChange={(e) => handleVariasiChange(idx, "stok", Number(e.target.value) || 0)}
                                style={{ width: "100%", fontSize: "12.5px", padding: "6px 8px", textAlign: "center" }}
                              />
                            </td>
                            <td style={{ padding: "8px 10px", color: "#0284C7", fontFamily: "monospace", fontSize: "11.5px", fontWeight: 600 }}>
                              {v.kodeUnitRange || "-"}
                            </td>
                            <td style={{ padding: "8px 10px", textAlign: "right" }}>
                              {variasiList.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariasi(idx)}
                                  style={{
                                    padding: "3px 8px",
                                    border: "1px solid #FECACA",
                                    background: "#FFF",
                                    color: "#DC2626",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Hapus
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ marginTop: "14px", background: "#F8FAFC", padding: "10px 14px", borderRadius: "8px", fontSize: "12.5px", color: "#64748B", display: "flex", gap: "16px" }}>
                    <span>Variasi <strong>{variasiList.length}</strong></span>
                    <span>·</span>
                    <span>Total unit <strong>{totalUnit} unit</strong></span>
                    <span>·</span>
                    <span>Harga sewa <strong>Rp {minPrice.toLocaleString("id-ID")} – Rp {maxPrice.toLocaleString("id-ID")}</strong></span>
                  </div>
                </div>

                <div style={{ marginTop: "14px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "12px 16px", fontSize: "12.5px", color: "#1E40AF" }}>
                  Penambahan unit berikutnya melanjutkan nomor (mulai <strong>{kode || "UNIT"}{nextUnitStart}</strong>) tanpa kode kembar. Kondisi awal setiap unit: Tersedia.
                </div>
              </div>
            ) : (
              /* --- VARIASI BARANG JUAL --- */
              <div style={{ marginBottom: "26px" }}>
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "4px", height: "14px", background: "#0284C7", borderRadius: "2px" }} />
                        <h4 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                          Variasi &amp; stok awal
                        </h4>
                      </div>
                      <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 10px" }}>
                        Barang jual dikelola per jumlah (kuantitas), tanpa unit individual. Setiap variasi mendapat SKU otomatis.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariasi}
                      style={{
                        padding: "6px 14px",
                        background: "#FFFFFF",
                        border: "1px solid #CBD5E1",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#0F172A",
                        cursor: "pointer",
                      }}
                    >
                      + Tambah variasi
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {variasiList.map((v, idx) => (
                      <div key={v.id || idx} style={{ border: "1px solid #E2E8F0", borderRadius: "8px", padding: "14px", background: "#FAFAFA" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                          <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#334155" }}>
                            Variasi {idx + 1}
                          </span>
                          {variasiList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVariasi(idx)}
                              style={{
                                padding: "2px 8px",
                                border: "1px solid #FECACA",
                                background: "#FFF",
                                color: "#DC2626",
                                borderRadius: "4px",
                                fontSize: "11.5px",
                                cursor: "pointer",
                              }}
                            >
                              Hapus
                            </button>
                          )}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", alignItems: "flex-end" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "11.5px", color: "#64748B", marginBottom: "4px" }}>
                              Spesifikasi variasi
                            </label>
                            <input
                              type="text"
                              className="tx-input"
                              value={v.spesifikasi}
                              onChange={(e) => handleVariasiChange(idx, "spesifikasi", e.target.value)}
                              placeholder="Merek Butana, 230 g"
                              style={{ width: "100%", fontSize: "12.5px", padding: "6px 8px" }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "11.5px", color: "#64748B", marginBottom: "4px" }}>
                              Harga jual (Rp)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="1000"
                              className="tx-input"
                              value={v.harga}
                              onChange={(e) => handleVariasiChange(idx, "harga", Number(e.target.value) || 0)}
                              style={{ width: "100%", fontSize: "12.5px", padding: "6px 8px", textAlign: "right" }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "11.5px", color: "#64748B", marginBottom: "4px" }}>
                              Stok awal
                            </label>
                            <input
                              type="number"
                              min="0"
                              className="tx-input"
                              value={v.stok}
                              onChange={(e) => handleVariasiChange(idx, "stok", Number(e.target.value) || 0)}
                              style={{ width: "100%", fontSize: "12.5px", padding: "6px 8px", textAlign: "center" }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "11.5px", color: "#64748B", marginBottom: "4px" }}>
                              Batas stok min
                            </label>
                            <input
                              type="number"
                              min="0"
                              className="tx-input"
                              value={v.batasStokMin || 10}
                              onChange={(e) => handleVariasiChange(idx, "batasStokMin", Number(e.target.value) || 0)}
                              style={{ width: "100%", fontSize: "12.5px", padding: "6px 8px", textAlign: "center" }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "11.5px", color: "#64748B", marginBottom: "4px" }}>
                              Satuan
                            </label>
                            <select
                              className="tx-select"
                              value={v.satuan || "pcs"}
                              onChange={(e) => handleVariasiChange(idx, "satuan", e.target.value)}
                              style={{ width: "100%", fontSize: "12.5px", padding: "6px 20px 6px 8px" }}
                            >
                              <option value="pcs">pcs</option>
                              <option value="unit">unit</option>
                              <option value="tabung">tabung</option>
                              <option value="kaleng">kaleng</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "11.5px", color: "#64748B" }}>
                          <span style={{ fontFamily: "monospace", color: "#0284C7" }}>
                            SKU {v.sku || `${kode || "SKU"}-${String(idx + 1).padStart(2, "0")}`}
                          </span>
                          <span style={{ color: "#94A3B8" }}>Peringatan stok menipis</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "14px", background: "#F8FAFC", padding: "10px 14px", borderRadius: "8px", fontSize: "12.5px", color: "#64748B", display: "flex", gap: "16px" }}>
                    <span>Variasi <strong>{variasiList.length}</strong></span>
                    <span>·</span>
                    <span>Total stok awal <strong>{totalUnit} pcs</strong></span>
                    <span>·</span>
                    <span>Harga jual <strong>Rp {minPrice.toLocaleString("id-ID")}</strong></span>
                  </div>
                </div>

                <div style={{ marginTop: "14px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "12px 16px", fontSize: "12.5px", color: "#1E40AF" }}>
                  Stok barang jual berkurang otomatis saat Transaksi Penjualan dan diatur manual lewat Penyesuaian stok (tambah, kurangi, atau koreksi) dengan alasan yang tercatat.
                </div>
              </div>
            )}

            {/* 5. Action Buttons Bawah */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px", paddingTop: "18px", borderTop: "1px solid #E2E8F0" }}>
              <Link
                href={backUrl}
                className="tx-btn-secondary"
                style={{ padding: "8px 22px", fontSize: "13px", textDecoration: "none" }}
              >
                Batal
              </Link>
              <button
                type="submit"
                className="tx-btn-primary"
                style={{ padding: "8px 26px", fontSize: "13px" }}
              >
                Simpan barang
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
