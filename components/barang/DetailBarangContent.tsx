// components/barang/DetailBarangContent.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarangRecord, VariasiBarang } from "./types";
import { getStoredBarang, saveOrUpdateBarang } from "./barangStore";
import "./barang.css";

interface DetailBarangContentProps {
  kode: string;
  role: "admin" | "owner";
}

export function DetailBarangContent({ kode, role }: DetailBarangContentProps) {
  const router = useRouter();
  const [barang, setBarang] = useState<BarangRecord | null>(null);
  const [searchVariasi, setSearchVariasi] = useState("");

  // Add unit modal state
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [selectedVarIndex, setSelectedVarIndex] = useState(0);
  const [addQty, setAddQty] = useState(1);
  const [addNotes, setAddNotes] = useState("");
  const [riwayatStok, setRiwayatStok] = useState([
    {
      waktu: "20 Okt, 10.05",
      variasi: "Kelana · XL",
      perubahan: "Penambahan +6 (JKT017–JKT022)",
      oleh: "Admin Toko",
    },
    {
      waktu: "12 Okt, 09.30",
      variasi: "Rimba · L",
      perubahan: "Penambahan +8 (JKT009–JKT016)",
      oleh: "Admin Toko",
    },
  ]);

  const basePath = role === "owner" ? "/owner/barang" : "/admin/barang";

  useEffect(() => {
    const all = getStoredBarang();
    const found = all.find(
      (b) => b.kode.toLowerCase() === kode.toLowerCase() || b.id.toLowerCase() === kode.toLowerCase()
    );
    if (found) {
      setBarang(found);
    }
  }, [kode]);

  // Variasi calculations
  const filteredVariasi = useMemo(() => {
    if (!barang || !barang.variasi) return [];
    if (!searchVariasi.trim()) return barang.variasi;
    const q = searchVariasi.toLowerCase();
    return barang.variasi.filter((v) => {
      const matchMerek = (v.merek || "").toLowerCase().includes(q);
      const matchUkuran = (v.ukuran || "").toLowerCase().includes(q);
      const matchRange = (v.kodeUnitRange || "").toLowerCase().includes(q);
      const matchNama = (v.namaVariasi || "").toLowerCase().includes(q);
      const matchSpec = (v.spesifikasi || "").toLowerCase().includes(q);
      return matchMerek || matchUkuran || matchRange || matchNama || matchSpec;
    });
  }, [barang, searchVariasi]);

  if (!barang) {
    return (
      <div className="main">
        <div className="brg-form-container">
          <div className="brg-card" style={{ padding: "40px", textAlign: "center" }}>
            <h2 style={{ fontSize: "18px", color: "#0F172A", margin: "0 0 10px" }}>
              Produk Tidak Ditemukan
            </h2>
            <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "20px" }}>
              Produk dengan kode <strong>{kode}</strong> tidak ditemukan di database toko.
            </p>
            <Link href={basePath} className="tx-btn-primary" style={{ textDecoration: "none" }}>
              ← Kembali ke Semua Barang
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Summary counts
  const totalUnitCount = (barang.variasi || []).reduce((acc, v) => acc + (Number(v.stok) || 0), 0);
  const totalVariasiCount = (barang.variasi || []).length;
  // Estimated available vs rented for demo/display
  const totalTersedia = Math.max(1, Math.round(totalUnitCount * 0.7));
  const totalTidakSiap = Math.max(0, totalUnitCount - totalTersedia);

  const targetVar = barang?.variasi?.[selectedVarIndex] || null;

  // Next unit codes calculation
  const nextCodePreview = useMemo(() => {
    if (!barang) return { prefix: "UNT", startNum: 1, endNum: 1, padLen: 3, previewText: "" };
    let prefix = barang.kode || "UNT";
    let maxNum = 0;
    let padLen = 3;

    (barang.variasi || []).forEach((v) => {
      const match = (v.kodeUnitRange || "").match(/([A-Za-z]+)\s*(\d+)\s*[–-]\s*([A-Za-z]*)\s*(\d+)/);
      if (match) {
        prefix = match[1];
        padLen = match[2].length;
        const n1 = parseInt(match[2], 10);
        const n2 = parseInt(match[4], 10);
        if (n1 > maxNum) maxNum = n1;
        if (n2 > maxNum) maxNum = n2;
      }
    });

    if (maxNum === 0) maxNum = totalUnitCount || 8;
    const qty = Math.max(1, Number(addQty) || 1);
    const startNum = maxNum + 1;
    const endNum = maxNum + qty;

    const startCode = `${prefix}${String(startNum).padStart(padLen, "0")}`;
    const endCode = `${prefix}${String(endNum).padStart(padLen, "0")}`;
    const previewText = qty > 1 ? `${startCode} – ${endCode}` : startCode;

    return { prefix, startNum, endNum, padLen, previewText };
  }, [barang, totalUnitCount, addQty]);

  // Handler Tambah Unit Otomatis ke Variasi
  const handleAddUnits = () => {
    if (!barang || !barang.variasi || !targetVar) return;

    const { prefix, startNum, endNum, padLen, previewText } = nextCodePreview;
    const all = getStoredBarang();
    const bIdx = all.findIndex((b) => b.id === barang.id || b.kode === barang.kode);

    if (bIdx >= 0) {
      const targetB = { ...all[bIdx] };
      const targetVarList = targetB.variasi ? [...targetB.variasi] : [];
      const curV = { ...targetVarList[selectedVarIndex] };

      const newStok = (Number(curV.stok) || 0) + addQty;
      curV.stok = newStok;

      // Update range
      const firstCode = curV.kodeUnitRange?.split("–")[0]?.trim() || `${prefix}${String(startNum).padStart(padLen, "0")}`;
      const lastCode = `${prefix}${String(endNum).padStart(padLen, "0")}`;
      curV.kodeUnitRange = `${firstCode} – ${lastCode}`;

      targetVarList[selectedVarIndex] = curV;
      targetB.variasi = targetVarList;

      const totalStok = targetVarList.reduce((acc, v) => acc + (Number(v.stok) || 0), 0);
      targetB.totalStokDisplay = `${totalStok} unit`;

      saveOrUpdateBarang(targetB);
      setBarang(targetB);

      // Add to riwayat
      const varTitle = curV.merek ? `${curV.merek} · ${curV.ukuran || ""}` : curV.namaVariasi || "Variasi";
      setRiwayatStok((prev) => [
        {
          waktu: `Hari ini, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`,
          variasi: varTitle,
          perubahan: `Penambahan +${addQty} (${previewText})`,
          oleh: role === "owner" ? "Owner Toko" : "Admin Toko",
        },
        ...prev,
      ]);
    }

    setIsAddUnitOpen(false);
    setAddQty(1);
    setAddNotes("");
  };

  return (
    <div className="main">
      <div className="brg-form-container" style={{ gap: "22px" }}>
        {/* Header Breadcrumbs & Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <span className="brg-badge">DATA BARANG / SEMUA BARANG / {barang.kode}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
              <h1 className="brg-title" style={{ margin: 0 }}>
                {barang.nama}
              </h1>
              <span className={`brg-badge-jenis ${barang.jenis}`}>
                <span className="brg-badge-dot" />
                {barang.jenis === "sewa" ? "Barang Sewa" : "Barang Jual"}
              </span>
            </div>
            <p className="brg-subtitle" style={{ marginTop: "4px" }}>
              Kode produk: <strong>{barang.kode}</strong> · Kategori: <strong>{barang.kategori}</strong>
              {barang.informasiSpesifikasi ? ` · ${barang.informasiSpesifikasi}` : ""}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link
              href={`${basePath}/form?edit=${barang.id}`}
              className="tx-btn-secondary"
              style={{ textDecoration: "none", padding: "8px 18px", fontSize: "13px" }}
            >
              Ubah
            </Link>
            <button
              type="button"
              onClick={() => setIsAddUnitOpen(true)}
              className="tx-btn-primary"
              style={{ padding: "8px 18px", fontSize: "13px", cursor: "pointer", border: "none" }}
            >
              + Tambah unit
            </button>
          </div>
        </div>

        {/* Card 1: Informasi Produk (Clean, Tanpa Button Ganti Foto Sesuai Permintaan) */}
        <div className="brg-card" style={{ width: "100%", padding: "26px 30px" }}>
          <h2 style={{ fontSize: "14.5px", fontWeight: 700, color: "#0F172A", margin: "0 0 18px" }}>
            Informasi produk
          </h2>

          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Box Foto Produk Bersih */}
            <div
              style={{
                width: "115px",
                height: "115px",
                borderRadius: "14px",
                background: "#FEF3C7",
                border: "1px solid #FDE68A",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {barang.foto ? (
                barang.foto.startsWith("data:") || barang.foto.startsWith("http") || barang.foto.startsWith("/") ? (
                  <img
                    src={barang.foto}
                    alt={barang.nama}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <span style={{ fontSize: "40px" }}>{barang.foto}</span>
                    <span style={{ fontSize: "9px", fontWeight: 700, color: "#B45309", letterSpacing: "0.04em", marginTop: "2px" }}>
                      FOTO PRODUK
                    </span>
                  </>
                )
              ) : (
                <>
                  <span style={{ fontSize: "38px" }}>
                    {barang.kategori === "Pakaian" ? "🧥" : barang.kategori === "Tenda" ? "⛺" : "🎒"}
                  </span>
                  <span style={{ fontSize: "9px", fontWeight: 700, color: "#B45309", letterSpacing: "0.04em", marginTop: "2px" }}>
                    FOTO PRODUK
                  </span>
                </>
              )}
            </div>

            {/* Grid Informasi Produk */}
            <div style={{ flex: 1, minWidth: "280px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px 24px" }}>
              <div>
                <span style={{ display: "block", fontSize: "11.5px", color: "#64748B", fontWeight: 500, marginBottom: "3px" }}>
                  Kode produk
                </span>
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A", fontFamily: "monospace" }}>
                  {barang.kode}
                </span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11.5px", color: "#64748B", fontWeight: 500, marginBottom: "3px" }}>
                  Kategori
                </span>
                <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#0F172A" }}>
                  {barang.kategori}
                </span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11.5px", color: "#64748B", fontWeight: 500, marginBottom: "3px" }}>
                  Jenis barang
                </span>
                <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#0F172A" }}>
                  {barang.jenis === "sewa" ? "Barang Sewa" : "Barang Jual"}
                </span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11.5px", color: "#64748B", fontWeight: 500, marginBottom: "3px" }}>
                  Spesifikasi
                </span>
                <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#0F172A" }}>
                  {barang.informasiSpesifikasi || "Waterproof, bahan ripstop"}
                </span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: "11.5px", color: "#64748B", fontWeight: 500, marginBottom: "3px" }}>
                  Harga sewa
                </span>
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#0284C7" }}>
                  {barang.rentangHargaDisplay}
                </span>
              </div>

              {/* Rekomendasi Pengganti Kode Unit: Rentang Unit Terdaftar */}
              <div>
                <span style={{ display: "block", fontSize: "11.5px", color: "#64748B", fontWeight: 500, marginBottom: "3px" }}>
                  Rentang Unit Terdaftar
                </span>
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A", fontFamily: "monospace" }}>
                  {barang.variasi && barang.variasi.length > 0
                    ? `${barang.variasi[0]?.kodeUnitRange?.split("–")[0]?.trim() || barang.kode + "001"} – ${barang.variasi[barang.variasi.length - 1]?.kodeUnitRange?.split("–")[1]?.trim() || barang.kode + "022"}`
                    : `${barang.kode}001 – ${barang.kode}022`}
                </span>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ display: "block", fontSize: "11.5px", color: "#64748B", fontWeight: 500, marginBottom: "3px" }}>
                  Deskripsi
                </span>
                <p style={{ margin: 0, fontSize: "13px", color: "#334155", lineHeight: 1.5 }}>
                  {barang.deskripsi || "Jaket gunung untuk pendakian, tersedia beberapa ukuran dan merek."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 KPI Cards (Variasi, Total Unit, Tersedia, Tidak Siap) Sesuai Gambar 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          {/* Card 1: Variasi */}
          <div className="brg-card" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11.5px", color: "#64748B", fontWeight: 600 }}>Variasi</span>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F172A", marginTop: "2px" }}>
                {totalVariasiCount}
              </div>
            </div>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#EFF6FF", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
          </div>

          {/* Card 2: Total Unit */}
          <div className="brg-card" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11.5px", color: "#64748B", fontWeight: 600 }}>Total unit</span>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F172A", marginTop: "2px" }}>
                {totalUnitCount}
              </div>
            </div>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
          </div>

          {/* Card 3: Tersedia */}
          <div className="brg-card" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11.5px", color: "#64748B", fontWeight: 600 }}>Tersedia</span>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#166534", marginTop: "2px" }}>
                {totalTersedia}
              </div>
            </div>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>

          {/* Card 4: Tidak Siap / Disewa */}
          <div className="brg-card" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11.5px", color: "#64748B", fontWeight: 600 }}>Tidak siap / Disewa</span>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#991B1B", marginTop: "2px" }}>
                {totalTidakSiap}
              </div>
            </div>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#F0FDF4", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
          </div>
        </div>

        {/* Section: Variasi & Ringkasan Stok (Sesuai Gambar 2) */}
        <div className="brg-card" style={{ width: "100%", padding: "26px 30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", marginBottom: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "4px", height: "16px", background: "#0284C7", borderRadius: "2px" }} />
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                  Variasi &amp; ringkasan stok
                </h3>
              </div>
              <p style={{ margin: "3px 0 0 12px", fontSize: "12.5px", color: "#64748B" }}>
                Spesifikasi, harga sewa, dan jumlah unit per kondisi untuk setiap variasi.
              </p>
            </div>

            {/* Search Variasi */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="text"
                className="tx-input"
                placeholder="Cari merek, ukuran, atau kode unit..."
                value={searchVariasi}
                onChange={(e) => setSearchVariasi(e.target.value)}
                style={{ width: "260px", height: "38px", fontSize: "12.5px" }}
              />
              <span style={{ fontSize: "12px", color: "#64748B", whiteSpace: "nowrap" }}>
                {filteredVariasi.length} dari {totalVariasiCount} variasi
              </span>
            </div>
          </div>

          {/* Table Variasi dengan Tombol "Detail Unit" */}
          <div style={{ overflowX: "auto", border: "1.5px solid #E2E8F0", borderRadius: "10px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0", color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 14px", textAlign: "left" }}>MEREK</th>
                  <th style={{ padding: "12px 14px", textAlign: "left" }}>UKURAN</th>
                  <th style={{ padding: "12px 14px", textAlign: "left" }}>KAPASITAS</th>
                  <th style={{ padding: "12px 14px", textAlign: "left" }}>JENIS</th>
                  <th style={{ padding: "12px 14px", textAlign: "left" }}>HARGA SEWA / HARI</th>
                  <th style={{ padding: "12px 14px", textAlign: "center" }}>UNIT</th>
                  <th style={{ padding: "12px 14px", textAlign: "center" }}>TERSEDIA</th>
                  <th style={{ padding: "12px 14px", textAlign: "center" }}>DISEWA</th>
                  <th style={{ padding: "12px 14px", textAlign: "center" }}>TIDAK SIAP</th>
                  <th style={{ padding: "12px 14px", textAlign: "left" }}>KODE UNIT</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredVariasi.map((v, idx) => {
                  const unitTotal = Number(v.stok) || 1;
                  const unitTersedia = Math.max(1, Math.round(unitTotal * 0.7));
                  const unitDisewa = Math.max(0, Math.round(unitTotal * 0.2));
                  const unitTidakSiap = Math.max(0, unitTotal - unitTersedia - unitDisewa);
                  const unitTargetId = encodeURIComponent(v.id || `var-${idx}`);

                  return (
                    <tr key={v.id || idx} style={{ borderBottom: idx < filteredVariasi.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "#0F172A" }}>
                        {v.merek || v.namaVariasi?.split("·")[0]?.trim() || "-"}
                      </td>
                      <td style={{ padding: "12px 14px", color: "#334155" }}>
                        {v.ukuran || v.namaVariasi?.split("·")[1]?.trim() || "-"}
                      </td>
                      <td style={{ padding: "12px 14px", color: "#64748B" }}>
                        {v.kapasitas || "-"}
                      </td>
                      <td style={{ padding: "12px 14px", color: "#64748B" }}>
                        {v.jenisSpec || "-"}
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "#0F172A" }}>
                        Rp {(Number(v.harga) || 0).toLocaleString("id-ID")}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 700 }}>
                        {unitTotal}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center", color: "#166534", fontWeight: 600 }}>
                        {unitTersedia}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center", color: "#0369A1", fontWeight: 600 }}>
                        {unitDisewa}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center", color: "#DC2626", fontWeight: 600 }}>
                        {unitTidakSiap}
                      </td>
                      <td style={{ padding: "12px 14px", color: "#0284C7", fontFamily: "monospace", fontSize: "12px" }}>
                        {v.kodeUnitRange || "-"}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        {/* Tombol "Detail Unit" mengarahkan ke halaman Detail Unit (Gambar 3) */}
                        <Link
                          href={`${basePath}/${barang.kode}/unit/${unitTargetId}`}
                          className="brg-btn-action"
                          style={{
                            textDecoration: "none",
                            background: "#FFFFFF",
                            border: "1.5px solid #CBD5E1",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontWeight: 600,
                            color: "#0F172A",
                            display: "inline-block",
                          }}
                        >
                          Detail Unit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Riwayat Pergerakan Stok (Sesuai Gambar 2) */}
        <div className="brg-card" style={{ width: "100%", padding: "26px 30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ width: "4px", height: "16px", background: "#0284C7", borderRadius: "2px" }} />
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
              Riwayat pergerakan stok
            </h3>
          </div>

          <div style={{ overflowX: "auto", border: "1.5px solid #E2E8F0", borderRadius: "10px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0", color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                  <th style={{ padding: "11px 16px", textAlign: "left" }}>WAKTU</th>
                  <th style={{ padding: "11px 16px", textAlign: "left" }}>VARIASI</th>
                  <th style={{ padding: "11px 16px", textAlign: "left" }}>PERUBAHAN</th>
                  <th style={{ padding: "11px 16px", textAlign: "right" }}>OLEH</th>
                </tr>
              </thead>
              <tbody>
                {riwayatStok.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < riwayatStok.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                    <td style={{ padding: "12px 16px", color: "#64748B" }}>{r.waktu}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0F172A" }}>{r.variasi}</td>
                    <td style={{ padding: "12px 16px", color: "#166534", fontWeight: 500 }}>{r.perubahan}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: "#475569" }}>{r.oleh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tambah Unit ke Variasi */}
      {isAddUnitOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setIsAddUnitOpen(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
                  Tambah Unit ke Variasi
                </h3>
                <span style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", display: "block" }}>
                  Produk: <strong>{barang.nama}</strong> ({barang.kode})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUnitOpen(false)}
                style={{ background: "transparent", border: "none", fontSize: "20px", color: "#94A3B8", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Highlight Kode Otomatis */}
              <div
                style={{
                  background: "#F0FDF4",
                  border: "1.5px solid #BBF7D0",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#166534", letterSpacing: "0.04em", display: "block" }}>
                    KODE UNIT OTOMATIS BERIKUTNYA
                  </span>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", fontFamily: "monospace", marginTop: "2px", display: "block" }}>
                    {nextCodePreview.previewText}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "11px", color: "#166534", display: "block" }}>
                    Total saat ini
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>
                    {totalUnitCount} unit
                  </span>
                </div>
              </div>

              {/* Pilih Variasi */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  Pilih Variasi Produk Target
                </label>
                <select
                  value={selectedVarIndex}
                  onChange={(e) => setSelectedVarIndex(parseInt(e.target.value, 10))}
                  className="tx-select"
                  style={{
                    width: "100%",
                    height: "42px",
                    borderRadius: "8px",
                    border: "1.5px solid #CBD5E1",
                    padding: "0 12px",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {(barang.variasi || []).map((v, idx) => (
                    <option key={v.id || idx} value={idx}>
                      {v.merek ? `${v.merek} · ${v.ukuran || ""}` : v.namaVariasi} (Stok: {v.stok} unit · {v.kodeUnitRange})
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Jumlah Unit */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  Jumlah Unit yang Ditambahkan
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setAddQty((q) => Math.max(1, q - 1))}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      border: "1.5px solid #CBD5E1",
                      background: "#FFFFFF",
                      fontSize: "18px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={addQty}
                    onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="tx-input"
                    style={{
                      flex: 1,
                      height: "40px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "15px",
                      borderRadius: "8px",
                      border: "1.5px solid #CBD5E1",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setAddQty((q) => q + 1)}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      border: "1.5px solid #CBD5E1",
                      background: "#FFFFFF",
                      fontSize: "18px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #E2E8F0",
                background: "#F8FAFC",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setIsAddUnitOpen(false)}
                className="tx-btn-secondary"
                style={{ padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddUnits}
                className="tx-btn-primary"
                style={{ padding: "8px 22px", fontSize: "13px", cursor: "pointer" }}
              >
                + Tambah {addQty} Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
