// components/barang/DetailUnitContent.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarangRecord, VariasiBarang } from "./types";
import { getStoredBarang, saveOrUpdateBarang } from "./barangStore";
import "./barang.css";

interface DetailUnitContentProps {
  kode: string;
  unitParam: string;
  role: "admin" | "owner";
}

export type UnitCondition =
  | "Tersedia"
  | "Disewa"
  | "Dicuci"
  | "Persiapan"
  | "Rusak"
  | "Perawatan";

export interface PhysicalUnit {
  kodeUnit: string;
  kondisi: UnitCondition;
  alokasi: string;
  diperbarui: string;
  catatan?: string;
}

export interface UnitHistoryLog {
  id: string;
  waktu: string;
  kodeUnit: string;
  perubahan: string;
  oleh: string;
  catatan?: string;
}

const CONDITION_COLORS: Record<UnitCondition, { bg: string; text: string; border: string; dot: string }> = {
  Tersedia: { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0", dot: "#22C55E" },
  Disewa: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE", dot: "#3B82F6" },
  Dicuci: { bg: "#FAF5FF", text: "#7E22CE", border: "#E9D5FF", dot: "#A855F7" },
  Persiapan: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A", dot: "#F59E0B" },
  Rusak: { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA", dot: "#EF4444" },
  Perawatan: { bg: "#F8FAFC", text: "#475569", border: "#CBD5E1", dot: "#64748B" },
};

export function DetailUnitContent({ kode, unitParam, role }: DetailUnitContentProps) {
  const router = useRouter();
  const [barang, setBarang] = useState<BarangRecord | null>(null);
  const [variasi, setVariasi] = useState<VariasiBarang | null>(null);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const [searchUnit, setSearchUnit] = useState<string>("");

  // Physical units state
  const [units, setUnits] = useState<PhysicalUnit[]>([]);
  const [historyLogs, setHistoryLogs] = useState<UnitHistoryLog[]>([]);

  // Modal states
  const [selectedUnitForEdit, setSelectedUnitForEdit] = useState<PhysicalUnit | null>(null);
  const [newCondition, setNewCondition] = useState<UnitCondition>("Tersedia");
  const [editNotes, setEditNotes] = useState<string>("");

  const [selectedUnitForDetail, setSelectedUnitForDetail] = useState<PhysicalUnit | null>(null);

  // Add Unit modal state
  const [isAddUnitOpen, setIsAddUnitOpen] = useState<boolean>(false);
  const [addUnitQty, setAddUnitQty] = useState<number>(1);
  const [addUnitCondition, setAddUnitCondition] = useState<UnitCondition>("Tersedia");
  const [addUnitNotes, setAddUnitNotes] = useState<string>("");

  const basePath = role === "owner" ? "/owner/barang" : "/admin/barang";
  const decodedUnitParam = decodeURIComponent(unitParam);

  // Load product and variation
  useEffect(() => {
    const all = getStoredBarang();
    const foundBarang = all.find(
      (b) => b.kode.toLowerCase() === kode.toLowerCase() || b.id.toLowerCase() === kode.toLowerCase()
    );

    if (foundBarang) {
      setBarang(foundBarang);
      const varList = foundBarang.variasi || [];
      // Match by id or match by index or decodedParam
      let foundVar = varList.find((v) => v.id === decodedUnitParam || v.id === unitParam);
      if (!foundVar) {
        // Try match by prefix/index if passed as var-X
        if (decodedUnitParam.startsWith("var-")) {
          const idx = parseInt(decodedUnitParam.replace("var-", ""), 10);
          if (!isNaN(idx) && varList[idx]) foundVar = varList[idx];
        }
      }
      if (!foundVar) {
        // Try match by merek, range, or namaVariasi
        foundVar = varList.find(
          (v) =>
            v.merek?.toLowerCase() === decodedUnitParam.toLowerCase() ||
            v.kodeUnitRange?.toLowerCase() === decodedUnitParam.toLowerCase() ||
            v.namaVariasi?.toLowerCase() === decodedUnitParam.toLowerCase()
        );
      }
      // If not found, strictly set to null so "Variasi Unit Tidak Ditemukan" is displayed without redirecting to another variation
      setVariasi(foundVar || null);
    }
  }, [kode, unitParam, decodedUnitParam]);

  // Generate / restore physical units
  useEffect(() => {
    if (!barang || !variasi) return;

    // Load saved conditions from localStorage
    let savedOverrides: Record<string, { kondisi: UnitCondition; catatan?: string; diperbarui: string }> = {};
    try {
      const raw = localStorage.getItem("summit_unit_conditions");
      if (raw) savedOverrides = JSON.parse(raw);
    } catch {
      // ignore
    }

    // Parse unit range
    const rangeStr = variasi.kodeUnitRange || "";
    const totalCount = Number(variasi.stok) || 8;

    // Extract start and end numbers e.g. "JKT009–JKT016" or "JKT001 - JKT008"
    const match = rangeStr.match(/([A-Za-z]+)\s*(\d+)\s*[–-]\s*([A-Za-z]*)\s*(\d+)/);
    let prefix = barang.kode || "UNT";
    let startNum = 1;
    let endNum = totalCount;

    if (match) {
      prefix = match[1];
      startNum = parseInt(match[2], 10);
      endNum = parseInt(match[4], 10);
    }

    const padLen = match && match[2] ? match[2].length : 3;
    const count = Math.max(1, endNum - startNum + 1);

    const generatedUnits: PhysicalUnit[] = [];
    for (let i = 0; i < count; i++) {
      const curNum = startNum + i;
      const curCode = `${prefix}${String(curNum).padStart(padLen, "0")}`;

      if (savedOverrides[curCode]) {
        generatedUnits.push({
          kodeUnit: curCode,
          kondisi: savedOverrides[curCode].kondisi,
          alokasi: savedOverrides[curCode].kondisi === "Disewa" ? "TS-0431 · kembali 21 Nov" : "Belum dialokasikan",
          diperbarui: savedOverrides[curCode].diperbarui || "Hari ini, 09.30 · Admin Toko",
          catatan: savedOverrides[curCode].catatan || "",
        });
      } else {
        // Default distribution matching screenshot (Gambar 3)
        let defaultKondisi: UnitCondition = "Tersedia";
        let defaultAlokasi = "Belum dialokasikan";
        let defaultDiperbarui = "12 Okt, 09.30 · Admin Toko";

        if (i === 0) {
          defaultKondisi = "Disewa";
          defaultAlokasi = "TS-0431 · kembali 21 Nov";
          defaultDiperbarui = "18 Nov, 09.12 · Admin Toko";
        } else if (i === 1) {
          defaultKondisi = "Disewa";
          defaultAlokasi = "TS-0435 · kembali 22 Nov";
          defaultDiperbarui = "18 Nov, 14.40 · Admin Toko";
        } else if (i === 3) {
          defaultKondisi = "Rusak";
          defaultAlokasi = "Belum dialokasikan";
          defaultDiperbarui = "21 Okt, 10.05 · Admin Toko";
        } else if (i === 4) {
          defaultKondisi = "Tersedia";
          defaultAlokasi = "Dibooking · 24-26 Nov (BK-0108)";
          defaultDiperbarui = "12 Okt, 09.30 · Admin Toko";
        }

        generatedUnits.push({
          kodeUnit: curCode,
          kondisi: defaultKondisi,
          alokasi: defaultAlokasi,
          diperbarui: defaultDiperbarui,
        });
      }
    }

    setUnits(generatedUnits);

    // Initial history logs
    setHistoryLogs([
      {
        id: "log-1",
        waktu: "21 Okt, 10.05",
        kodeUnit: generatedUnits[3]?.kodeUnit || `${prefix}012`,
        perubahan: "Perubahan kondisi: Tersedia → Rusak",
        oleh: "Admin Toko",
        catatan: "Resleting saku depan macet, perlu perbaikan.",
      },
      {
        id: "log-2",
        waktu: "18 Nov, 14.40",
        kodeUnit: generatedUnits[1]?.kodeUnit || `${prefix}010`,
        perubahan: "Alokasi Sewa: Transaksi TS-0435 (2 hari)",
        oleh: "Admin Toko",
      },
      {
        id: "log-3",
        waktu: "18 Nov, 09.12",
        kodeUnit: generatedUnits[0]?.kodeUnit || `${prefix}009`,
        perubahan: "Alokasi Sewa: Transaksi TS-0431 (3 hari)",
        oleh: "Admin Toko",
      },
      {
        id: "log-4",
        waktu: "12 Okt, 09.30",
        kodeUnit: `${prefix}${String(startNum).padStart(padLen, "0")}–${prefix}${String(endNum).padStart(padLen, "0")}`,
        perubahan: `Penambahan +${count} unit baru ke sistem`,
        oleh: "Admin Toko",
        catatan: "Kondisi awal masuk: Tersedia siap pakai.",
      },
    ]);
  }, [barang, variasi]);

  // KPI Calculations
  const conditionCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Total: units.length,
      Tersedia: 0,
      Disewa: 0,
      Dicuci: 0,
      Persiapan: 0,
      Rusak: 0,
      Perawatan: 0,
    };
    units.forEach((u) => {
      if (counts[u.kondisi] !== undefined) {
        counts[u.kondisi]++;
      }
    });
    return counts;
  }, [units]);

  // Filtered unit rows
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const matchFilter = activeFilter === "Semua" ? true : u.kondisi === activeFilter;
      const matchSearch = searchUnit.trim()
        ? u.kodeUnit.toLowerCase().includes(searchUnit.toLowerCase()) ||
          u.alokasi.toLowerCase().includes(searchUnit.toLowerCase()) ||
          (u.catatan || "").toLowerCase().includes(searchUnit.toLowerCase())
        : true;
      return matchFilter && matchSearch;
    });
  }, [units, activeFilter, searchUnit]);

  // Handle Save Ubah Kondisi
  const handleSaveCondition = () => {
    if (!selectedUnitForEdit) return;

    const updated = units.map((u) => {
      if (u.kodeUnit === selectedUnitForEdit.kodeUnit) {
        return {
          ...u,
          kondisi: newCondition,
          catatan: editNotes,
          diperbarui: `Hari ini, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} · ${role === "owner" ? "Owner Toko" : "Admin Toko"}`,
        };
      }
      return u;
    });

    setUnits(updated);

    // Save override to localStorage
    try {
      const raw = localStorage.getItem("summit_unit_conditions");
      const saved = raw ? JSON.parse(raw) : {};
      saved[selectedUnitForEdit.kodeUnit] = {
        kondisi: newCondition,
        catatan: editNotes,
        diperbarui: `Hari ini, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} · ${role === "owner" ? "Owner Toko" : "Admin Toko"}`,
      };
      localStorage.setItem("summit_unit_conditions", JSON.stringify(saved));
    } catch {
      // ignore
    }

    // Add log to history
    const newLog: UnitHistoryLog = {
      id: `log-${Date.now()}`,
      waktu: `Hari ini, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`,
      kodeUnit: selectedUnitForEdit.kodeUnit,
      perubahan: `Perubahan kondisi: ${selectedUnitForEdit.kondisi} → ${newCondition}`,
      oleh: role === "owner" ? "Owner Toko" : "Admin Toko",
      catatan: editNotes || "Pemeriksaan berkala unit fisik.",
    };
    setHistoryLogs((prev) => [newLog, ...prev]);

    setSelectedUnitForEdit(null);
    setEditNotes("");
  };

  // Preview kode unit berikutnya yang akan digenerate otomatis
  const nextCodePreview = useMemo(() => {
    if (!barang) return { prefix: "UNT", startNum: 1, endNum: 1, padLen: 3, previewText: "" };
    let prefix = barang.kode || "UNT";
    let maxNum = 0;
    let padLen = 3;

    units.forEach((u) => {
      const m = u.kodeUnit.match(/([A-Za-z]+)(\d+)/);
      if (m) {
        prefix = m[1];
        padLen = m[2].length;
        const n = parseInt(m[2], 10);
        if (n > maxNum) maxNum = n;
      }
    });

    if (maxNum === 0) maxNum = units.length;
    const qty = Math.max(1, Number(addUnitQty) || 1);
    const startNum = maxNum + 1;
    const endNum = maxNum + qty;

    const startCode = `${prefix}${String(startNum).padStart(padLen, "0")}`;
    const endCode = `${prefix}${String(endNum).padStart(padLen, "0")}`;
    const previewText = qty > 1 ? `${startCode} – ${endCode}` : startCode;

    return { prefix, startNum, endNum, padLen, previewText };
  }, [barang, units, addUnitQty]);

  // Handler Tambah Unit Otomatis
  const handleAddUnits = () => {
    if (!barang || !variasi || addUnitQty < 1) return;

    const { prefix, startNum, endNum, padLen, previewText } = nextCodePreview;
    const newUnitsCreated: PhysicalUnit[] = [];

    for (let num = startNum; num <= endNum; num++) {
      const curCode = `${prefix}${String(num).padStart(padLen, "0")}`;
      newUnitsCreated.push({
        kodeUnit: curCode,
        kondisi: addUnitCondition,
        alokasi: "Belum dialokasikan",
        diperbarui: `Hari ini, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} · ${role === "owner" ? "Owner Toko" : "Admin Toko"}`,
        catatan: addUnitNotes || "Pengadaan unit baru.",
      });
    }

    // 1. Update units state
    const updatedUnits = [...units, ...newUnitsCreated];
    setUnits(updatedUnits);

    // 2. Add log to history
    const newLog: UnitHistoryLog = {
      id: `log-${Date.now()}`,
      waktu: `Hari ini, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`,
      kodeUnit: previewText,
      perubahan: `Penambahan +${addUnitQty} unit baru (${addUnitCondition})`,
      oleh: role === "owner" ? "Owner Toko" : "Admin Toko",
      catatan: addUnitNotes || "Penambahan unit fisik otomatis via Detail Unit.",
    };
    setHistoryLogs((prev) => [newLog, ...prev]);

    // 3. Update master barang & variasi in store
    const all = getStoredBarang();
    const bIdx = all.findIndex((b) => b.id === barang.id || b.kode === barang.kode);
    if (bIdx >= 0) {
      const targetB = { ...all[bIdx] };
      const targetVarList = targetB.variasi ? [...targetB.variasi] : [];
      const vIdx = targetVarList.findIndex(
        (v) =>
          v.id === variasi.id ||
          (v.merek === variasi.merek && v.ukuran === variasi.ukuran)
      );

      if (vIdx >= 0) {
        const curV = { ...targetVarList[vIdx] };
        const newStok = (Number(curV.stok) || 0) + addUnitQty;
        curV.stok = newStok;

        const firstCode = units[0]?.kodeUnit || `${prefix}${String(1).padStart(padLen, "0")}`;
        const lastCode = `${prefix}${String(endNum).padStart(padLen, "0")}`;
        curV.kodeUnitRange = `${firstCode} – ${lastCode}`;

        targetVarList[vIdx] = curV;
        targetB.variasi = targetVarList;

        const totalStok = targetVarList.reduce((acc, v) => acc + (Number(v.stok) || 0), 0);
        targetB.totalStokDisplay = `${totalStok} unit`;

        saveOrUpdateBarang(targetB);
        setBarang(targetB);
        setVariasi(curV);
      }
    }

    setIsAddUnitOpen(false);
    setAddUnitQty(1);
    setAddUnitNotes("");
  };

  if (!barang || !variasi) {
    return (
      <div className="main">
        <div className="brg-form-container">
          <div className="brg-card" style={{ padding: "40px", textAlign: "center" }}>
            <h2 style={{ fontSize: "18px", color: "#0F172A", margin: "0 0 10px" }}>
              Variasi Unit Tidak Ditemukan
            </h2>
            <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "20px" }}>
              Variasi untuk kode produk <strong>{kode}</strong> tidak ditemukan.
            </p>
            <Link href={`${basePath}/${kode}`} className="tx-btn-primary" style={{ textDecoration: "none" }}>
              ← Kembali ke Detail Produk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const varNameDisplay = variasi.merek
    ? `${barang.nama} - ${variasi.merek}${variasi.ukuran ? ` · ${variasi.ukuran}` : ""}`
    : `${barang.nama} - ${variasi.namaVariasi}`;

  return (
    <div className="main">
      <div className="brg-form-container" style={{ gap: "22px" }}>
        {/* Breadcrumb & Navigation Header Sesuai Gambar 3 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <span className="brg-badge">
              STOK DAN KETERSEDIAAN / RINGKASAN PER VARIASI / DETAIL UNIT
            </span>
            <h1 className="brg-title" style={{ marginTop: "6px", marginBottom: "4px" }}>
              Detail Unit
            </h1>
            <p className="brg-subtitle" style={{ margin: 0 }}>
              Seluruh unit fisik dari satu variasi barang. Ubah kondisi per unit sesuai hasil pemeriksaan.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <Link
              href={`${basePath}/${barang.kode}`}
              className="tx-btn-secondary"
              style={{
                textDecoration: "none",
                padding: "8px 16px",
                fontSize: "12.5px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ← Kembali ke Detail Produk
            </Link>
            <Link
              href={`${basePath}/${barang.kode}`}
              className="tx-btn-secondary"
              style={{
                textDecoration: "none",
                padding: "8px 16px",
                fontSize: "12.5px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ← Ringkasan per Variasi
            </Link>
            <button
              type="button"
              onClick={() => setIsAddUnitOpen(true)}
              className="tx-btn-primary"
              style={{
                padding: "8px 18px",
                fontSize: "12.5px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              + Tambah unit
            </button>
          </div>
        </div>

        {/* Card 1: Profil Variasi Produk Lengkap (Sesuai Gambar 3) */}
        <div className="brg-card" style={{ width: "100%", padding: "26px 30px" }}>
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Box Foto Produk */}
            <div
              style={{
                width: "95px",
                height: "95px",
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
              {barang.foto && (barang.foto.startsWith("data:") || barang.foto.startsWith("http") || barang.foto.startsWith("/")) ? (
                <img
                  src={barang.foto}
                  alt={barang.nama}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <>
                  <span style={{ fontSize: "36px" }}>
                    {barang.kategori === "Pakaian" ? "🧥" : barang.kategori === "Tenda" ? "⛺" : "🎒"}
                  </span>
                  <span style={{ fontSize: "9px", fontWeight: 700, color: "#B45309", letterSpacing: "0.04em", marginTop: "2px" }}>
                    FOTO
                  </span>
                </>
              )}
            </div>

            {/* Judul & Detail Spesifikasi */}
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                  {varNameDisplay}
                </h2>
                <span className={`brg-badge-jenis ${barang.jenis}`}>
                  <span className="brg-badge-dot" />
                  {barang.jenis === "sewa" ? "Barang Sewa" : "Barang Jual"}
                </span>
              </div>

              <div style={{ fontSize: "12.5px", color: "#64748B", marginTop: "4px", marginBottom: "18px" }}>
                Kode produk: <strong style={{ color: "#0F172A" }}>{barang.kode}</strong> · Unit:{" "}
                <span style={{ color: "#0284C7", fontFamily: "monospace", fontWeight: 600 }}>
                  {variasi.kodeUnitRange || "-"}
                </span>{" "}
                · <strong style={{ color: "#0284C7" }}>Rp {(Number(variasi.harga) || 0).toLocaleString("id-ID")}</strong> / hari
              </div>

              {/* Grid Spesifikasi Sesuai Gambar 3 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "14px 20px",
                  paddingTop: "14px",
                  borderTop: "1px solid #F1F5F9",
                }}
              >
                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "#94A3B8", fontWeight: 500, marginBottom: "2px" }}>
                    Produk
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>
                    {barang.nama}
                  </span>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "#94A3B8", fontWeight: 500, marginBottom: "2px" }}>
                    Merek
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>
                    {variasi.merek || "-"}
                  </span>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "#94A3B8", fontWeight: 500, marginBottom: "2px" }}>
                    Ukuran
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>
                    {variasi.ukuran || "-"}
                  </span>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "#94A3B8", fontWeight: 500, marginBottom: "2px" }}>
                    Kapasitas
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>
                    {variasi.kapasitas || "-"}
                  </span>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "#94A3B8", fontWeight: 500, marginBottom: "2px" }}>
                    Jenis
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>
                    {variasi.jenisSpec || "-"}
                  </span>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "#94A3B8", fontWeight: 500, marginBottom: "2px" }}>
                    Karakteristik lain
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>
                    {barang.informasiSpesifikasi || variasi.spesifikasi || "Waterproof, ripstop"}
                  </span>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "#94A3B8", fontWeight: 500, marginBottom: "2px" }}>
                    Kategori
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>
                    {barang.kategori}
                  </span>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "#94A3B8", fontWeight: 500, marginBottom: "2px" }}>
                    Unit dialokasikan booking
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0284C7" }}>
                    {units.filter((u) => u.alokasi.toLowerCase().includes("booking")).length} unit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row of Condition KPI Cards (Gambar 3) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
          {/* Total unit */}
          <div className="brg-card" style={{ padding: "14px 18px", borderTop: "3px solid #0284C7" }}>
            <span style={{ fontSize: "11.5px", color: "#64748B", fontWeight: 600, display: "block" }}>
              Total unit
            </span>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", marginTop: "2px" }}>
              {conditionCounts.Total}
            </div>
          </div>

          {/* Tersedia */}
          <div className="brg-card" style={{ padding: "14px 18px", borderTop: "3px solid #22C55E" }}>
            <span style={{ fontSize: "11.5px", color: "#166534", fontWeight: 600, display: "block" }}>
              Tersedia
            </span>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#166534", marginTop: "2px" }}>
              {conditionCounts.Tersedia}
            </div>
          </div>

          {/* Disewa */}
          <div className="brg-card" style={{ padding: "14px 18px", borderTop: "3px solid #3B82F6" }}>
            <span style={{ fontSize: "11.5px", color: "#1D4ED8", fontWeight: 600, display: "block" }}>
              Disewa
            </span>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#1D4ED8", marginTop: "2px" }}>
              {conditionCounts.Disewa}
            </div>
          </div>

          {/* Dicuci */}
          <div className="brg-card" style={{ padding: "14px 18px", borderTop: "3px solid #A855F7" }}>
            <span style={{ fontSize: "11.5px", color: "#7E22CE", fontWeight: 600, display: "block" }}>
              Dicuci
            </span>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#7E22CE", marginTop: "2px" }}>
              {conditionCounts.Dicuci}
            </div>
          </div>

          {/* Persiapan */}
          <div className="brg-card" style={{ padding: "14px 18px", borderTop: "3px solid #F59E0B" }}>
            <span style={{ fontSize: "11.5px", color: "#B45309", fontWeight: 600, display: "block" }}>
              Persiapan
            </span>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#B45309", marginTop: "2px" }}>
              {conditionCounts.Persiapan}
            </div>
          </div>

          {/* Rusak */}
          <div className="brg-card" style={{ padding: "14px 18px", borderTop: "3px solid #EF4444" }}>
            <span style={{ fontSize: "11.5px", color: "#B91C1C", fontWeight: 600, display: "block" }}>
              Rusak
            </span>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#B91C1C", marginTop: "2px" }}>
              {conditionCounts.Rusak}
            </div>
          </div>

          {/* Perawatan */}
          <div className="brg-card" style={{ padding: "14px 18px", borderTop: "3px solid #64748B" }}>
            <span style={{ fontSize: "11.5px", color: "#475569", fontWeight: 600, display: "block" }}>
              Perawatan
            </span>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#475569", marginTop: "2px" }}>
              {conditionCounts.Perawatan}
            </div>
          </div>
        </div>

        {/* Card 2: Daftar Unit Fisik & Filter Table (Sesuai Gambar 3) */}
        <div className="brg-card" style={{ width: "100%", padding: "26px 30px" }}>
          {/* Header Section */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "4px", height: "16px", background: "#0284C7", borderRadius: "2px" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                Daftar unit
              </h3>
            </div>
            <p style={{ margin: "4px 0 0 12px", fontSize: "12.5px", color: "#64748B" }}>
              Satu unit satu baris, dikenali dari kode uniknya. Kondisi fisik terpisah dari alokasi booking.
            </p>
          </div>

          {/* Search, Filter Pills & Counter */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            {/* Search Input */}
            <div style={{ position: "relative", minWidth: "220px", flex: "1 1 240px" }}>
              <input
                type="text"
                placeholder="Cari kode unit, mis. JKT012..."
                value={searchUnit}
                onChange={(e) => setSearchUnit(e.target.value)}
                className="tx-input"
                style={{
                  width: "100%",
                  height: "38px",
                  fontSize: "12.5px",
                  padding: "0 14px",
                  borderRadius: "8px",
                  border: "1.5px solid #CBD5E1",
                }}
              />
            </div>

            {/* Condition Pills */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
              {(["Semua", "Tersedia", "Disewa", "Dicuci", "Persiapan", "Rusak", "Perawatan"] as const).map((c) => {
                const count = c === "Semua" ? conditionCounts.Total : conditionCounts[c] || 0;
                const isActive = activeFilter === c;

                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setActiveFilter(c)}
                    style={{
                      padding: "5px 11px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: isActive ? "1.5px solid #0284C7" : "1.5px solid #E2E8F0",
                      background: isActive ? "#EFF6FF" : "#FFFFFF",
                      color: isActive ? "#0284C7" : "#475569",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {c} {count}
                  </button>
                );
              })}
            </div>

            {/* Counter */}
            <span style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 500 }}>
              {filteredUnits.length} dari {units.length} unit
            </span>
          </div>

          {/* Physical Unit Table (Sesuai Gambar 3) */}
          <div style={{ overflowX: "auto", border: "1.5px solid #E2E8F0", borderRadius: "10px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0", color: "#475569", fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.03em" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left" }}>KODE UNIT</th>
                  <th style={{ padding: "12px 16px", textAlign: "left" }}>KONDISI</th>
                  <th style={{ padding: "12px 16px", textAlign: "left" }}>ALOKASI</th>
                  <th style={{ padding: "12px 16px", textAlign: "left" }}>DIPERBARUI</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "30px", textAlign: "center", color: "#64748B" }}>
                      Tidak ada unit yang sesuai dengan filter atau kata kunci pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredUnits.map((u, idx) => {
                    const styleConf = CONDITION_COLORS[u.kondisi] || CONDITION_COLORS.Tersedia;

                    return (
                      <tr
                        key={u.kodeUnit}
                        style={{
                          borderBottom: idx < filteredUnits.length - 1 ? "1px solid #F1F5F9" : "none",
                          transition: "background 0.15s ease",
                        }}
                      >
                        {/* Kode Unit */}
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "#0284C7", fontFamily: "monospace" }}>
                          {u.kodeUnit}
                        </td>

                        {/* Kondisi Badge */}
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "3px 10px",
                              borderRadius: "20px",
                              fontSize: "11.5px",
                              fontWeight: 600,
                              background: styleConf.bg,
                              color: styleConf.text,
                              border: `1px solid ${styleConf.border}`,
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: styleConf.dot,
                              }}
                            />
                            {u.kondisi}
                          </span>
                        </td>

                        {/* Alokasi */}
                        <td style={{ padding: "12px 16px", color: u.alokasi.startsWith("Belum") ? "#94A3B8" : "#0F172A", fontWeight: u.alokasi.startsWith("Belum") ? 400 : 500 }}>
                          {u.alokasi}
                        </td>

                        {/* Diperbarui */}
                        <td style={{ padding: "12px 16px", color: "#64748B", fontSize: "12px" }}>
                          {u.diperbarui}
                        </td>

                        {/* Aksi: Detail & Ubah kondisi */}
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "6px" }}>
                            <button
                              type="button"
                              onClick={() => setSelectedUnitForDetail(u)}
                              className="brg-btn-action"
                              style={{
                                background: "#FFFFFF",
                                border: "1.5px solid #CBD5E1",
                                padding: "5px 12px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#0F172A",
                                cursor: "pointer",
                              }}
                            >
                              Detail
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUnitForEdit(u);
                                setNewCondition(u.kondisi);
                                setEditNotes(u.catatan || "");
                              }}
                              className="tx-btn-secondary"
                              style={{
                                background: "#0F172A",
                                color: "#FFFFFF",
                                border: "none",
                                padding: "5px 12px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Ubah kondisi
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Riwayat Variasi (Sesuai Gambar 3) */}
        <div className="brg-card" style={{ width: "100%", padding: "26px 30px" }}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "4px", height: "16px", background: "#0284C7", borderRadius: "2px" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                Riwayat variasi
              </h3>
            </div>
            <p style={{ margin: "4px 0 0 12px", fontSize: "12.5px", color: "#64748B" }}>
              Pergerakan stok dan perubahan kondisi unit, terbaru di atas.
            </p>
          </div>

          <div style={{ overflowX: "auto", border: "1.5px solid #E2E8F0", borderRadius: "10px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0", color: "#475569", fontSize: "11.5px", fontWeight: 700 }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", width: "160px" }}>WAKTU</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", width: "140px" }}>KODE UNIT</th>
                  <th style={{ padding: "12px 16px", textAlign: "left" }}>PERUBAHAN / AKTIVITAS</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", width: "140px" }}>OLEH</th>
                </tr>
              </thead>
              <tbody>
                {historyLogs.map((log, idx) => (
                  <tr
                    key={log.id || idx}
                    style={{
                      borderBottom: idx < historyLogs.length - 1 ? "1px solid #F1F5F9" : "none",
                    }}
                  >
                    <td style={{ padding: "12px 16px", color: "#64748B", fontSize: "12.5px" }}>
                      {log.waktu}
                    </td>
                    <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#0284C7", fontWeight: 600 }}>
                      {log.kodeUnit}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#0F172A" }}>
                      <div style={{ fontWeight: 600 }}>{log.perubahan}</div>
                      {log.catatan && (
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                          Catatan: {log.catatan}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#334155", fontWeight: 500 }}>
                      {log.oleh}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Dialog: Ubah Kondisi Unit */}
      {selectedUnitForEdit && (
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
          onClick={() => setSelectedUnitForEdit(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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
                  Ubah Kondisi Unit
                </h3>
                <span style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", display: "block" }}>
                  Unit: <strong style={{ color: "#0284C7", fontFamily: "monospace" }}>{selectedUnitForEdit.kodeUnit}</strong> · {varNameDisplay}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUnitForEdit(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  color: "#94A3B8",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  Kondisi Fisik Baru
                </label>
                <select
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value as UnitCondition)}
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
                  <option value="Tersedia">🟢 Tersedia (Siap disewakan)</option>
                  <option value="Disewa">🔵 Disewa (Sedang dibawa penyewa)</option>
                  <option value="Dicuci">🟣 Dicuci (Proses pembersihan / laundry)</option>
                  <option value="Persiapan">🟡 Persiapan (Pengecekan kelengkapan)</option>
                  <option value="Rusak">🔴 Rusak (Perlu servis / tidak layak pakai)</option>
                  <option value="Perawatan">⚪ Perawatan (Maintenance rutin)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  Catatan Pemeriksaan / Alasan Perubahan
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Contoh: Resleting saku depan macet, kotor selesai dipakai camping..."
                  rows={3}
                  className="tx-input"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    border: "1.5px solid #CBD5E1",
                    padding: "10px 12px",
                    fontSize: "13px",
                    resize: "vertical",
                  }}
                />
              </div>

              <div
                style={{
                  background: "#F8FAFC",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  fontSize: "12px",
                  color: "#64748B",
                  lineHeight: 1.5,
                }}
              >
                💡 <em>Catatan:</em> Mengubah kondisi unit akan memperbarui status ketersediaan secara langsung dan tercatat di riwayat pergerakan.
              </div>
            </div>

            {/* Modal Footer */}
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
                onClick={() => setSelectedUnitForEdit(null)}
                className="tx-btn-secondary"
                style={{ padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveCondition}
                className="tx-btn-primary"
                style={{ padding: "8px 20px", fontSize: "13px", cursor: "pointer" }}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog: Detail Unit Lengkap */}
      {selectedUnitForDetail && (
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
          onClick={() => setSelectedUnitForDetail(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "520px",
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
                  Informasi Unit Fisik
                </h3>
                <span style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", display: "block" }}>
                  Kode: <strong style={{ color: "#0284C7", fontFamily: "monospace" }}>{selectedUnitForDetail.kodeUnit}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUnitForDetail(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  color: "#94A3B8",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "#64748B", display: "block", marginBottom: "2px" }}>
                    PRODUK & VARIASI
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>
                    {varNameDisplay}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#64748B", display: "block", marginBottom: "2px" }}>
                    STATUS KONDISI
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: "14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      background: CONDITION_COLORS[selectedUnitForDetail.kondisi]?.bg,
                      color: CONDITION_COLORS[selectedUnitForDetail.kondisi]?.text,
                    }}
                  >
                    {selectedUnitForDetail.kondisi}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#64748B", display: "block", marginBottom: "2px" }}>
                    STATUS ALOKASI
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>
                    {selectedUnitForDetail.alokasi}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#64748B", display: "block", marginBottom: "2px" }}>
                    TERAKHIR DIPERBARUI
                  </span>
                  <span style={{ fontSize: "13px", color: "#334155" }}>
                    {selectedUnitForDetail.diperbarui}
                  </span>
                </div>
              </div>

              {selectedUnitForDetail.catatan && (
                <div style={{ background: "#F8FAFC", padding: "12px 14px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                  <span style={{ fontSize: "11px", color: "#64748B", display: "block", marginBottom: "2px", fontWeight: 600 }}>
                    CATATAN FISIK
                  </span>
                  <span style={{ fontSize: "12.5px", color: "#334155" }}>
                    {selectedUnitForDetail.catatan}
                  </span>
                </div>
              )}
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #E2E8F0",
                background: "#F8FAFC",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedUnitForDetail(null)}
                className="tx-btn-secondary"
                style={{ padding: "8px 18px", fontSize: "13px", cursor: "pointer" }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Dialog: Tambah Unit Fisik Baru Otomatis */}
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
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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
                  Tambah Unit Fisik Baru
                </h3>
                <span style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", display: "block" }}>
                  Variasi: <strong>{varNameDisplay}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUnitOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  color: "#94A3B8",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
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
                    KODE UNIT OTOMATIS BERLANJUT
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
                    {units.length} unit
                  </span>
                </div>
              </div>

              {/* Input Jumlah Unit */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  Jumlah Unit yang Ditambahkan
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setAddUnitQty((q) => Math.max(1, q - 1))}
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
                    value={addUnitQty}
                    onChange={(e) => setAddUnitQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
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
                    onClick={() => setAddUnitQty((q) => q + 1)}
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
                <span style={{ fontSize: "11.5px", color: "#64748B", marginTop: "4px", display: "block" }}>
                  Setiap unit akan otomatis dibuatkan nomor kode fisik berurutan tanpa risiko bentrok.
                </span>
              </div>

              {/* Kondisi Awal */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  Kondisi Fisik Awal
                </label>
                <select
                  value={addUnitCondition}
                  onChange={(e) => setAddUnitCondition(e.target.value as UnitCondition)}
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
                  <option value="Tersedia">🟢 Tersedia (Siap disewakan)</option>
                  <option value="Persiapan">🟡 Persiapan (Perlu QC / kelengkapan)</option>
                  <option value="Perawatan">⚪ Perawatan (Pemeriksaan awal)</option>
                </select>
              </div>

              {/* Catatan / Keterangan Penambahan */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  Catatan Pengadaan / Alasan Penambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pembelian baru dari supplier, Restock batch 2..."
                  value={addUnitNotes}
                  onChange={(e) => setAddUnitNotes(e.target.value)}
                  className="tx-input"
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    border: "1.5px solid #CBD5E1",
                    padding: "0 12px",
                    fontSize: "13px",
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
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
                + Tambah {addUnitQty} Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
