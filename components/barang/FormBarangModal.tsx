// components/barang/FormBarangModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { BarangRecord, JenisBarang, VariasiBarang } from "./types";
import { saveOrUpdateBarang } from "./barangStore";

interface FormBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBarang: BarangRecord | null;
  kategoriOptions: string[];
  onSuccess: () => void;
}

export function FormBarangModal({
  isOpen,
  onClose,
  editingBarang,
  kategoriOptions,
  onSuccess,
}: FormBarangModalProps) {
  const [jenis, setJenis] = useState<JenisBarang>("sewa");
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
  const [customSpecName, setCustomSpecName] = useState<string | null>(null);

  // List Variasi
  const [variasiList, setVariasiList] = useState<VariasiBarang[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (editingBarang) {
      setJenis(editingBarang.jenis);
      setFoto(editingBarang.foto || (editingBarang.jenis === "sewa" ? "🧥" : null));
      setNama(editingBarang.nama);
      setKode(editingBarang.kode);
      setKategori(editingBarang.kategori);
      setInfoSpesifikasi(editingBarang.informasiSpesifikasi || "Waterproof, bahan ripstop");
      setDeskripsi(editingBarang.deskripsi);
      setVariasiList(editingBarang.variasi || []);
    } else {
      setJenis("sewa");
      setFoto("🧥");
      setNama("Jaket Gunung");
      setKode("JKT");
      setKategori(kategoriOptions[0] || "Pakaian");
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
    setErrorMsg("");
  }, [editingBarang, isOpen, kategoriOptions]);

  // Saat berganti jenis sewa / jual
  const handleSwitchJenis = (newJenis: JenisBarang) => {
    setJenis(newJenis);
    if (newJenis === "jual") {
      setFoto(null);
      setNama("Gas Kaleng 230 g");
      setKode("GAS");
      setKategori("Alat masak");
      setInfoSpesifikasi("Butana campuran, tabung 230 g");
      setDeskripsi("Gas portabel untuk kompor camping.");
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
      setDeskripsi("Jaket outdoor tahan angin dan air.");
      setVariasiList([
        {
          id: `v-sewa-1`,
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

  if (!isOpen) return null;

  // Kalkulasi kode unit otomatis
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

  // Metrik Footer Tabel Variasi
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
      id: editingBarang ? editingBarang.id : `brg-${Date.now()}`,
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
      terkaitTransaksi: editingBarang ? editingBarang.terkaitTransaksi : false,
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="tx-modal-overlay">
      <div className="tx-modal-card" style={{ maxWidth: "780px", width: "95%", maxHeight: "90vh", overflowY: "auto", padding: "24px 28px" }}>
        {/* Header Breadcrumb & Judul Sesuai Gambar */}
        <div style={{ marginBottom: "16px" }}>
          <span className="brg-badge" style={{ marginBottom: "6px" }}>
            DATA BARANG / SEMUA BARANG / TAMBAH / UBAH
          </span>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", margin: "2px 0 4px" }}>
            {editingBarang ? "Ubah Data Barang" : "Tambah / Ubah Barang"}
          </h1>
          <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
            Satu formulir untuk Barang Sewa dan Barang Jual; isian menyesuaikan jenis yang dipilih.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {errorMsg && (
            <div style={{ padding: "10px 14px", background: "#FEE2E2", color: "#DC2626", borderRadius: "8px", fontSize: "12.5px", marginBottom: "16px" }}>
              {errorMsg}
            </div>
          )}

          {/* 1. Tombol Pilihan Jenis Barang (Tab Switcher) */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "8px", textTransform: "capitalize" }}>
              Jenis barang
            </label>
            <div style={{ display: "inline-flex", background: "#F1F5F9", padding: "4px", borderRadius: "8px", gap: "4px" }}>
              <button
                type="button"
                onClick={() => handleSwitchJenis("sewa")}
                style={{
                  padding: "7px 18px",
                  fontSize: "12.5px",
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
                  padding: "7px 18px",
                  fontSize: "12.5px",
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
          <div style={{ marginBottom: "22px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>
              Foto produk
            </label>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {/* Box Foto */}
              <div
                style={{
                  width: "105px",
                  height: "105px",
                  borderRadius: "14px",
                  background: foto ? "#FEF3C7" : "#F8FAFC",
                  border: foto ? "1px solid #FDE68A" : "1.5px dashed #CBD5E1",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  flexShrink: 0,
                }}
              >
                {foto ? (
                  <>
                    <span style={{ fontSize: "32px" }}>{foto}</span>
                    <span style={{ fontSize: "9px", fontWeight: 700, color: "#B45309", letterSpacing: "0.04em" }}>
                      FOTO SAAT INI
                    </span>
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.8">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span style={{ fontSize: "9.5px", color: "#64748B", textAlign: "center", padding: "0 6px" }}>
                      Belum ada foto
                    </span>
                  </>
                )}
              </div>

              {/* Action Upload & Keterangan */}
              <div>
                <p style={{ fontSize: "12.5px", fontWeight: 600, color: "#1E293B", margin: "0 0 4px" }}>
                  {foto ? "Foto produk" : "Foto produk belum diunggah"}
                </p>
                <p style={{ fontSize: "11.5px", color: "#64748B", margin: "0 0 10px" }}>
                  Tampil di Semua Barang, Detail Barang, dan katalog transaksi.
                </p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setFoto(foto ? (foto === "🧥" ? "⛺" : "🧥") : "🧥")}
                    style={{
                      padding: "6px 14px",
                      background: "#0F172A",
                      color: "#FFFFFF",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {foto ? "Ganti foto" : "Pilih foto"}
                  </button>
                  {foto && (
                    <button
                      type="button"
                      onClick={() => setFoto(null)}
                      style={{
                        padding: "6px 14px",
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
          <div style={{ marginBottom: "22px" }}>
            <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A", margin: "0 0 12px" }}>
              Informasi umum
            </h3>

            {/* Row 1: Nama Produk & Kode Produk */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "5px" }}>
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
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "5px" }}>
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

            {/* Row 2: Kategori & Informasi Spesifikasi */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "5px" }}>
                  Kategori
                </label>
                <select
                  className="tx-select"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  style={{ width: "100%", fontSize: "13px" }}
                >
                  {kategoriOptions.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "5px" }}>
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

            {/* Row 3: Deskripsi */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "5px" }}>
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
            /* --- VARIASI BARANG SEWA (§C.30–31 & Gambar 1) --- */
            <div style={{ marginBottom: "22px" }}>
              {/* Checkboxes spesifikasi pembeda */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Spesifikasi yang membedakan variasi
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={specMerek}
                      onChange={(e) => setSpecMerek(e.target.checked)}
                    />
                    Merek
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={specUkuran}
                      onChange={(e) => setSpecUkuran(e.target.checked)}
                    />
                    Ukuran
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={specKapasitas}
                      onChange={(e) => setSpecKapasitas(e.target.checked)}
                    />
                    Kapasitas
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={specJenis}
                      onChange={(e) => setSpecJenis(e.target.checked)}
                    />
                    Jenis
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt("Nama spesifikasi tambahan (maksimal 3):");
                      if (name && name.trim()) setCustomSpecName(name.trim());
                    }}
                    style={{
                      padding: "3px 10px",
                      background: "#FFFFFF",
                      border: "1px dashed #94A3B8",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#475569",
                      cursor: "pointer",
                    }}
                  >
                    + Spesifikasi lain
                  </button>
                  {customSpecName && (
                    <span style={{ fontSize: "12px", background: "#E0F2FE", color: "#0369A1", padding: "2px 8px", borderRadius: "4px" }}>
                      {customSpecName}
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-card: Variasi & unit awal */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "4px", height: "14px", background: "#0284C7", borderRadius: "2px" }} />
                      <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                        Variasi &amp; unit awal
                      </h4>
                    </div>
                    <p style={{ fontSize: "11.5px", color: "#64748B", margin: "2px 0 0 10px" }}>
                      Harga sewa dapat berbeda per variasi. Setiap unit dibuat sebagai satu baris dengan kode unik otomatis.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariasi}
                    style={{
                      padding: "5px 12px",
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

                {/* Tabel Variasi Sewa */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase" }}>
                        {specMerek && <th style={{ padding: "8px 10px", textAlign: "left" }}>MEREK</th>}
                        {specUkuran && <th style={{ padding: "8px 10px", textAlign: "left" }}>UKURAN</th>}
                        {specKapasitas && <th style={{ padding: "8px 10px", textAlign: "left" }}>KAPASITAS</th>}
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
                                style={{ width: "100%", fontSize: "12px", padding: "6px 8px" }}
                              />
                            </td>
                          )}
                          {specUkuran && (
                            <td style={{ padding: "8px 10px", width: "90px" }}>
                              <select
                                className="tx-select"
                                value={v.ukuran || "M"}
                                onChange={(e) => handleVariasiChange(idx, "ukuran", e.target.value)}
                                style={{ width: "100%", fontSize: "12px", padding: "6px 24px 6px 8px" }}
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
                                style={{ width: "100%", fontSize: "12px", padding: "6px 8px" }}
                              />
                            </td>
                          )}
                          <td style={{ padding: "8px 10px" }}>
                            <input
                              type="number"
                              min="0"
                              step="1000"
                              className="tx-input"
                              value={v.harga}
                              onChange={(e) => handleVariasiChange(idx, "harga", Number(e.target.value) || 0)}
                              style={{ width: "100%", fontSize: "12px", padding: "6px 8px", textAlign: "right" }}
                            />
                          </td>
                          <td style={{ padding: "8px 10px" }}>
                            <input
                              type="number"
                              min="1"
                              className="tx-input"
                              value={v.stok}
                              onChange={(e) => handleVariasiChange(idx, "stok", Number(e.target.value) || 0)}
                              style={{ width: "100%", fontSize: "12px", padding: "6px 8px", textAlign: "center" }}
                            />
                          </td>
                          <td style={{ padding: "8px 10px", color: "#0284C7", fontFamily: "monospace", fontSize: "11px", fontWeight: 600 }}>
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
                                  fontSize: "11.5px",
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

                {/* Footer Total Rangkuman Variasi Sesuai Gambar */}
                <div style={{ marginTop: "12px", background: "#F8FAFC", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: "#64748B", display: "flex", gap: "14px" }}>
                  <span>Variasi <strong>{variasiList.length}</strong></span>
                  <span>·</span>
                  <span>Total unit <strong>{totalUnit} unit</strong></span>
                  <span>·</span>
                  <span>Harga sewa <strong>Rp {minPrice.toLocaleString("id-ID")} – Rp {maxPrice.toLocaleString("id-ID")}</strong></span>
                </div>
              </div>

              {/* Notice Banner Biru Sesuai Gambar 1 */}
              <div style={{ marginTop: "12px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#1E40AF" }}>
                Penambahan unit berikutnya melanjutkan nomor (mulai <strong>{kode || "UNIT"}{nextUnitStart}</strong>) tanpa kode kembar. Kondisi awal setiap unit: Tersedia.
              </div>
            </div>
          ) : (
            /* --- VARIASI BARANG JUAL (§C.13 & Gambar 2) --- */
            <div style={{ marginBottom: "22px" }}>
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "4px", height: "14px", background: "#0284C7", borderRadius: "2px" }} />
                      <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                        Variasi &amp; stok awal
                      </h4>
                    </div>
                    <p style={{ fontSize: "11.5px", color: "#64748B", margin: "2px 0 0 10px" }}>
                      Barang jual dikelola per jumlah (kuantitas), tanpa unit individual. Setiap variasi mendapat SKU otomatis.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariasi}
                    style={{
                      padding: "5px 12px",
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

                {/* Sub-card Variasi Jual */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {variasiList.map((v, idx) => (
                    <div key={v.id || idx} style={{ border: "1px solid #E2E8F0", borderRadius: "8px", padding: "12px", background: "#FAFAFA" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
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
                              fontSize: "11px",
                              cursor: "pointer",
                            }}
                          >
                            Hapus
                          </button>
                        )}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.3fr 1fr 1fr 1fr", gap: "10px", alignItems: "flex-end" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", color: "#64748B", marginBottom: "4px" }}>
                            Spesifikasi variasi
                          </label>
                          <input
                            type="text"
                            className="tx-input"
                            value={v.spesifikasi}
                            onChange={(e) => handleVariasiChange(idx, "spesifikasi", e.target.value)}
                            placeholder="Merek Butana, 230 g"
                            style={{ width: "100%", fontSize: "12px", padding: "6px 8px" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", color: "#64748B", marginBottom: "4px" }}>
                            Harga jual (Rp)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            className="tx-input"
                            value={v.harga}
                            onChange={(e) => handleVariasiChange(idx, "harga", Number(e.target.value) || 0)}
                            style={{ width: "100%", fontSize: "12px", padding: "6px 8px", textAlign: "right" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", color: "#64748B", marginBottom: "4px" }}>
                            Stok awal
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="tx-input"
                            value={v.stok}
                            onChange={(e) => handleVariasiChange(idx, "stok", Number(e.target.value) || 0)}
                            style={{ width: "100%", fontSize: "12px", padding: "6px 8px", textAlign: "center" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", color: "#64748B", marginBottom: "4px" }}>
                            Batas stok min
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="tx-input"
                            value={v.batasStokMin || 10}
                            onChange={(e) => handleVariasiChange(idx, "batasStokMin", Number(e.target.value) || 0)}
                            style={{ width: "100%", fontSize: "12px", padding: "6px 8px", textAlign: "center" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", color: "#64748B", marginBottom: "4px" }}>
                            Satuan
                          </label>
                          <select
                            className="tx-select"
                            value={v.satuan || "pcs"}
                            onChange={(e) => handleVariasiChange(idx, "satuan", e.target.value)}
                            style={{ width: "100%", fontSize: "12px", padding: "6px 20px 6px 8px" }}
                          >
                            <option value="pcs">pcs</option>
                            <option value="unit">unit</option>
                            <option value="tabung">tabung</option>
                            <option value="kaleng">kaleng</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "11px", color: "#64748B" }}>
                        <span style={{ fontFamily: "monospace", color: "#0284C7" }}>
                          SKU {v.sku || `${kode || "SKU"}-${String(idx + 1).padStart(2, "0")}`}
                        </span>
                        <span style={{ color: "#94A3B8" }}>Peringatan stok menipis</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Total Rangkuman Jual */}
                <div style={{ marginTop: "12px", background: "#F8FAFC", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: "#64748B", display: "flex", gap: "14px" }}>
                  <span>Variasi <strong>{variasiList.length}</strong></span>
                  <span>·</span>
                  <span>Total stok awal <strong>{totalUnit} pcs</strong></span>
                  <span>·</span>
                  <span>Harga jual <strong>Rp {minPrice.toLocaleString("id-ID")}</strong></span>
                </div>
              </div>

              {/* Notice Banner Biru Sesuai Gambar 2 */}
              <div style={{ marginTop: "12px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#1E40AF" }}>
                Stok barang jual berkurang otomatis saat Transaksi Penjualan dan diatur manual lewat Penyesuaian stok (tambah, kurangi, atau koreksi) dengan alasan yang tercatat.
              </div>
            </div>
          )}

          {/* 5. Action Buttons Bawah */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #E2E8F0" }}>
            <button
              type="button"
              className="tx-btn-secondary"
              onClick={onClose}
              style={{ padding: "8px 20px", fontSize: "13px" }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="tx-btn-primary"
              style={{ padding: "8px 22px", fontSize: "13px" }}
            >
              Simpan barang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
