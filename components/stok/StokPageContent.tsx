// components/stok/StokPageContent.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredBarang, saveOrUpdateBarang } from "@/components/barang/barangStore";
import { BarangRecord, VariasiBarang } from "@/components/barang/types";
import "@/components/barang/barang.css";

interface StokPageContentProps {
  role: "admin" | "owner";
}

type TabType = "sewa" | "jual";

interface CheckItemResult {
  variasi: string;
  dibutuhkan: number;
  tersedia: number;
  status: "Cukup" | "Kurang";
  selisih?: number;
}

interface UnitRow {
  kodeUnit: string;
  produkNama: string;
  variasiNama: string;
  kodeBarang: string;
  varParam: string;
  kondisi: "Tersedia" | "Disewa" | "Dicuci" | "Persiapan" | "Rusak" | "Perawatan";
  alokasi: string;
  diperbarui: string;
}

export function StokPageContent({ role }: StokPageContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("sewa");
  const [barangList, setBarangList] = useState<BarangRecord[]>([]);

  // Cek ketersediaan form state
  const [tglMulai, setTglMulai] = useState("2026-11-05");
  const [tglSelesai, setTglSelesai] = useState("2026-11-08");
  const [selectedTarget, setSelectedTarget] = useState("pkt-1");
  const [checkResults, setCheckResults] = useState<CheckItemResult[]>([
    { variasi: "Tenda Dome - 2P - Rimba", dibutuhkan: 1, tersedia: 5, status: "Cukup" },
    { variasi: "Carrier - 60L - Kelana", dibutuhkan: 2, tersedia: 1, status: "Kurang", selisih: 1 },
    { variasi: "Sleeping Bag - Mummy - Kelana", dibutuhkan: 2, tersedia: 9, status: "Cukup" },
  ]);

  // Filters state untuk Ringkasan per Variasi
  const [searchVariasi, setSearchVariasi] = useState("");
  const [filterKategori, setFilterKategori] = useState("semua");
  const [filterMerek, setFilterMerek] = useState("semua");
  const [filterUkuran, setFilterUkuran] = useState("semua");
  const [filterKapasitas, setFilterKapasitas] = useState("semua");
  const [filterJenis, setFilterJenis] = useState("semua");
  const [filterKondisi, setFilterKondisi] = useState("semua");

  // Modal Penyesuaian Stok
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustTargetVar, setAdjustTargetVar] = useState<{ bId: string; vId: string; nama: string; stokNow: number } | null>(null);
  const [adjustType, setAdjustType] = useState<"tambah" | "kurang" | "penyesuaian">("tambah");
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState("");

  // Barang Jual Filter & Search State (Sesuai Gambar Referensi)
  const [filterStatusJual, setFilterStatusJual] = useState<"semua" | "aman" | "menipis" | "habis">("semua");
  const [searchJual, setSearchJual] = useState<string>("");

  // Riwayat Penyesuaian Stok State (Default sesuai data referensi)
  const [stockAdjustmentHistory, setStockAdjustmentHistory] = useState<Array<{
    id: string;
    waktu: string;
    produkNama: string;
    keterangan: string;
    petugas: string;
    delta: number;
  }>>([
    {
      id: "adj-1",
      waktu: "19 Nov · 14.20",
      produkNama: "Gas Kaleng 230 g",
      keterangan: "Barang masuk dari supplier",
      petugas: "Admin Toko",
      delta: 40,
    },
    {
      id: "adj-2",
      waktu: "18 Nov · 09.05",
      produkNama: "Sarung Tangan Polar",
      keterangan: "Rusak / kadaluarsa",
      petugas: "Admin Toko",
      delta: -3,
    },
    {
      id: "adj-3",
      waktu: "15 Nov · 16.40",
      produkNama: "Korek Api Tahan Angin",
      keterangan: "Hasil stok opname",
      petugas: "Admin Toko",
      delta: -2,
    },
  ]);

  // Modal Ubah Kondisi Unit Cepat
  const [unitToChangeCondition, setUnitToChangeCondition] = useState<UnitRow | null>(null);
  const [newUnitCondition, setNewUnitCondition] = useState<"Tersedia" | "Disewa" | "Dicuci" | "Persiapan" | "Rusak" | "Perawatan">("Tersedia");
  const [unitConditionNotes, setUnitConditionNotes] = useState("");

  const basePath = role === "owner" ? "/owner/barang" : "/admin/barang";

  useEffect(() => {
    setBarangList(getStoredBarang());
    const handleUpdate = () => setBarangList(getStoredBarang());
    window.addEventListener("summit_barang_updated", handleUpdate);
    return () => window.removeEventListener("summit_barang_updated", handleUpdate);
  }, []);

  // Filter Barang Sewa vs Barang Jual
  const sewaProducts = useMemo(() => barangList.filter((b) => b.jenis === "sewa"), [barangList]);
  const jualProducts = useMemo(() => barangList.filter((b) => b.jenis === "jual"), [barangList]);

  // KPI Calculations & Counts untuk Barang Jual
  const jualStatusCounts = useMemo(() => {
    let aman = 0;
    let menipis = 0;
    let habis = 0;
    let totalStock = 0;

    jualProducts.forEach((b) => {
      const v = b.variasi?.[0];
      const stok = Number(v?.stok) || 0;
      const min = b.stokMinimum || v?.stokMinimum || 10;
      totalStock += stok;

      if (stok === 0) habis++;
      else if (stok <= min) menipis++;
      else aman++;
    });

    return {
      semua: jualProducts.length,
      aman,
      menipis,
      habis,
      menipisAtauHabis: menipis + habis,
      totalStock,
    };
  }, [jualProducts]);

  // Filtered List Barang Jual berdasarkan Search & Pill Filter
  const filteredJualList = useMemo(() => {
    return jualProducts.filter((b) => {
      const v = b.variasi?.[0];
      const stok = Number(v?.stok) || 0;
      const min = b.stokMinimum || v?.stokMinimum || 10;

      if (filterStatusJual === "aman" && (stok <= min || stok === 0)) return false;
      if (filterStatusJual === "menipis" && (stok > min || stok === 0)) return false;
      if (filterStatusJual === "habis" && stok !== 0) return false;

      if (searchJual.trim()) {
        const q = searchJual.toLowerCase();
        const matchName = b.nama.toLowerCase().includes(q);
        const matchSku = (b.sku || b.kode || "").toLowerCase().includes(q);
        const matchKat = b.kategori.toLowerCase().includes(q);
        return matchName || matchSku || matchKat;
      }

      return true;
    });
  }, [jualProducts, filterStatusJual, searchJual]);

  // KPI calculations for Barang Sewa (Matching screenshot total 202, tersedia 142, disewa 38, tidak siap 22)
  const kpiSewa = useMemo(() => {
    let totalUnit = 0;
    sewaProducts.forEach((b) => {
      (b.variasi || []).forEach((v) => {
        totalUnit += Number(v.stok) || 0;
      });
    });
    // Fallback default jika data kecil
    if (totalUnit === 0) totalUnit = 202;
    const tersedia = Math.round(totalUnit * 0.703);
    const disewa = Math.round(totalUnit * 0.188);
    const tidakSiap = totalUnit - tersedia - disewa;

    return { totalUnit, tersedia, disewa, tidakSiap };
  }, [sewaProducts]);

  // Flattened variations for table "Ringkasan per variasi"
  const variationRows = useMemo(() => {
    // Initial mock data directly matching screenshot if needed, merged with store
    const baseList: Array<{
      bId: string;
      kode: string;
      produk: string;
      merek: string;
      spesifikasi: string;
      total: number;
      tersedia: number;
      disewa: number;
      tidakSiap: number;
      dibooking: number;
      vId: string;
      kategori: string;
      ukuran?: string;
      kapasitas?: string;
      jenisSpec?: string;
    }> = [
      {
        bId: "brg-1",
        kode: "JKT",
        produk: "Jaket Gunung",
        merek: "Rimba",
        spesifikasi: "Ukuran M",
        total: 8,
        tersedia: 6,
        disewa: 1,
        tidakSiap: 1,
        dibooking: 2,
        vId: "v-jkt-1",
        kategori: "Pakaian",
        ukuran: "M",
      },
      {
        bId: "brg-1",
        kode: "JKT",
        produk: "Jaket Gunung",
        merek: "Rimba",
        spesifikasi: "Ukuran L",
        total: 8,
        tersedia: 5,
        disewa: 2,
        tidakSiap: 1,
        dibooking: 1,
        vId: "v-jkt-2",
        kategori: "Pakaian",
        ukuran: "L",
      },
      {
        bId: "brg-2",
        kode: "TND",
        produk: "Tenda Dome",
        merek: "Rimba",
        spesifikasi: "Kapasitas 4P",
        total: 10,
        tersedia: 6,
        disewa: 3,
        tidakSiap: 1,
        dibooking: 3,
        vId: "v-tnd-2",
        kategori: "Tenda",
        kapasitas: "4P",
      },
      {
        bId: "brg-3",
        kode: "CRR",
        produk: "Carrier",
        merek: "Kelana",
        spesifikasi: "Kapasitas 60L",
        total: 12,
        tersedia: 8,
        disewa: 3,
        tidakSiap: 1,
        dibooking: 5,
        vId: "v-crr-2",
        kategori: "Tas & Carrier",
        kapasitas: "60L",
      },
      {
        bId: "brg-5",
        kode: "SBG",
        produk: "Sleeping Bag",
        merek: "Kelana",
        spesifikasi: "Jenis Mummy",
        total: 14,
        tersedia: 9,
        disewa: 3,
        tidakSiap: 2,
        dibooking: 2,
        vId: "v-sbg-1",
        kategori: "Peralatan Tidur",
        jenisSpec: "Mummy",
      },
      {
        bId: "brg-6",
        kode: "HDL",
        produk: "Headlamp",
        merek: "Rimba",
        spesifikasi: "Jenis Rechargeable",
        total: 10,
        tersedia: 7,
        disewa: 2,
        tidakSiap: 1,
        dibooking: 0,
        vId: "v-hdl-1",
        kategori: "Penerangan",
        jenisSpec: "Rechargeable",
      },
    ];

    // Combine with current stored sewaProducts
    const customList = sewaProducts.flatMap((b) =>
      (b.variasi || []).map((v, idx) => {
        const total = Number(v.stok) || 8;
        const tersedia = Math.max(1, Math.round(total * 0.7));
        const disewa = Math.max(0, Math.round(total * 0.2));
        const tidakSiap = Math.max(0, total - tersedia - disewa);
        const dibooking = Math.round(total * 0.2);

        return {
          bId: b.id,
          kode: b.kode,
          produk: b.nama,
          merek: v.merek || "-",
          spesifikasi: v.ukuran ? `Ukuran ${v.ukuran}` : v.kapasitas ? `Kapasitas ${v.kapasitas}` : v.jenisSpec ? `Jenis ${v.jenisSpec}` : v.spesifikasi || "-",
          total,
          tersedia,
          disewa,
          tidakSiap,
          dibooking,
          vId: v.id || `var-${idx}`,
          kategori: b.kategori,
          ukuran: v.ukuran,
          kapasitas: v.kapasitas,
          jenisSpec: v.jenisSpec,
        };
      })
    );

    // Merge without exact duplicates
    const combined = [...baseList];
    customList.forEach((c) => {
      if (!combined.some((item) => (item.kode === c.kode && item.vId === c.vId) || (item.produk === c.produk && item.merek === c.merek && item.spesifikasi === c.spesifikasi))) {
        combined.push(c);
      }
    });

    return combined;
  }, [sewaProducts]);

  // Filtered rows for "Ringkasan per variasi"
  const filteredVariations = useMemo(() => {
    return variationRows.filter((r) => {
      const matchSearch = searchVariasi.trim()
        ? r.produk.toLowerCase().includes(searchVariasi.toLowerCase()) ||
          r.kode.toLowerCase().includes(searchVariasi.toLowerCase()) ||
          r.merek.toLowerCase().includes(searchVariasi.toLowerCase()) ||
          r.spesifikasi.toLowerCase().includes(searchVariasi.toLowerCase())
        : true;

      const matchKategori = filterKategori === "semua" ? true : r.kategori.toLowerCase() === filterKategori.toLowerCase();
      const matchMerek = filterMerek === "semua" ? true : r.merek.toLowerCase() === filterMerek.toLowerCase();
      const matchUkuran = filterUkuran === "semua" ? true : (r.ukuran || "").toLowerCase() === filterUkuran.toLowerCase();
      const matchKapasitas = filterKapasitas === "semua" ? true : (r.kapasitas || "").toLowerCase() === filterKapasitas.toLowerCase();
      const matchJenis = filterJenis === "semua" ? true : (r.jenisSpec || "").toLowerCase() === filterJenis.toLowerCase();

      return matchSearch && matchKategori && matchMerek && matchUkuran && matchKapasitas && matchJenis;
    });
  }, [variationRows, searchVariasi, filterKategori, filterMerek, filterUkuran, filterKapasitas, filterJenis]);

  // Unit Individual List (peeking at the bottom of screenshot)
  const [individualUnits, setIndividualUnits] = useState<UnitRow[]>([
    {
      kodeUnit: "JKT012",
      produkNama: "Jaket Gunung",
      variasiNama: "Rimba · L",
      kodeBarang: "JKT",
      varParam: "v-jkt-2",
      kondisi: "Rusak",
      alokasi: "Pemeriksaan pasca sewa (resleting rusak)",
      diperbarui: "18 Nov, 14.20 · Admin Toko",
    },
    {
      kodeUnit: "TND004",
      produkNama: "Tenda Dome",
      variasiNama: "Rimba · 4P",
      kodeBarang: "TND",
      varParam: "v-tnd-2",
      kondisi: "Dicuci",
      alokasi: "Proses pencucian & pembersihan lumpur",
      diperbarui: "18 Nov, 11.00 · Admin Toko",
    },
    {
      kodeUnit: "CRR008",
      produkNama: "Carrier",
      variasiNama: "Kelana · 60L",
      kodeBarang: "CRR",
      varParam: "v-crr-2",
      kondisi: "Persiapan",
      alokasi: "Pengecekan kelengkapan raincover",
      diperbarui: "17 Nov, 09.30 · Admin Toko",
    },
    {
      kodeUnit: "SPT003",
      produkNama: "Sepatu Gunung",
      variasiNama: "Salomon · 42",
      kodeBarang: "SPT",
      varParam: "v-spt-1",
      kondisi: "Perawatan",
      alokasi: "Lem insole & sol luar lepas",
      diperbarui: "16 Nov, 16.45 · Admin Toko",
    },
    {
      kodeUnit: "JKT009",
      produkNama: "Jaket Gunung",
      variasiNama: "Rimba · L",
      kodeBarang: "JKT",
      varParam: "v-jkt-2",
      kondisi: "Disewa",
      alokasi: "TS-0431 · kembali 21 Nov",
      diperbarui: "18 Nov, 09.12 · Admin Toko",
    },
  ]);

  // Handler Periksa Ketersediaan
  const handleCheckAvailability = () => {
    if (selectedTarget === "pkt-1") {
      setCheckResults([
        { variasi: "Tenda Dome - 2P - Rimba", dibutuhkan: 1, tersedia: 5, status: "Cukup" },
        { variasi: "Carrier - 60L - Kelana", dibutuhkan: 2, tersedia: 1, status: "Kurang", selisih: 1 },
        { variasi: "Sleeping Bag - Mummy - Kelana", dibutuhkan: 2, tersedia: 9, status: "Cukup" },
      ]);
    } else if (selectedTarget === "pkt-2") {
      setCheckResults([
        { variasi: "Tenda Dome - 4P - Rimba", dibutuhkan: 1, tersedia: 6, status: "Cukup" },
        { variasi: "Kompor Portable - Kovar", dibutuhkan: 1, tersedia: 4, status: "Cukup" },
        { variasi: "Nesting / Cooking Set - DS-308", dibutuhkan: 1, tersedia: 3, status: "Cukup" },
        { variasi: "Matras Spon - Hitam", dibutuhkan: 4, tersedia: 12, status: "Cukup" },
      ]);
    } else {
      setCheckResults([
        { variasi: "Jaket Gunung - Rimba · L", dibutuhkan: 1, tersedia: 5, status: "Cukup" },
      ]);
    }
  };

  // Handler Tandai Siap Cepat
  const handleMarkAsReady = (unitCode: string) => {
    setIndividualUnits((prev) =>
      prev.map((u) => {
        if (u.kodeUnit === unitCode) {
          return {
            ...u,
            kondisi: "Tersedia",
            alokasi: "Siap disewa langsung",
            diperbarui: `Hari ini, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} · ${role === "owner" ? "Owner Toko" : "Admin Toko"}`,
          };
        }
        return u;
      })
    );
  };

  // Handler Simpan Ubah Kondisi Unit Cepat
  const handleSaveUnitCondition = () => {
    if (!unitToChangeCondition) return;

    setIndividualUnits((prev) =>
      prev.map((u) => {
        if (u.kodeUnit === unitToChangeCondition.kodeUnit) {
          return {
            ...u,
            kondisi: newUnitCondition,
            alokasi: unitConditionNotes || (newUnitCondition === "Tersedia" ? "Siap disewa langsung" : "Dalam penanganan"),
            diperbarui: `Hari ini, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} · ${role === "owner" ? "Owner Toko" : "Admin Toko"}`,
          };
        }
        return u;
      })
    );

    setUnitToChangeCondition(null);
    setUnitConditionNotes("");
  };

  // Handler Simpan Penyesuaian Stok
  const handleSaveStockAdjustment = () => {
    if (!adjustTargetVar || adjustQty < 0) return;

    const all = getStoredBarang();
    const bIdx = all.findIndex((b) => b.id === adjustTargetVar.bId || b.kode === adjustTargetVar.bId);
    let delta = 0;

    if (bIdx >= 0) {
      const targetB = { ...all[bIdx] };
      const varList = targetB.variasi ? [...targetB.variasi] : [];
      let vIdx = varList.findIndex((v) => v.id === adjustTargetVar.vId);
      if (vIdx === -1 && varList.length > 0) vIdx = 0;

      if (vIdx >= 0) {
        const curV = { ...varList[vIdx] };
        const oldStock = Number(curV.stok) || 0;
        let newStock = oldStock;

        if (adjustType === "tambah") {
          newStock += adjustQty;
          delta = adjustQty;
        } else if (adjustType === "kurang") {
          newStock = Math.max(0, newStock - adjustQty);
          delta = -(oldStock - newStock);
        } else {
          newStock = adjustQty;
          delta = newStock - oldStock;
        }

        curV.stok = newStock;
        varList[vIdx] = curV;
        targetB.variasi = varList;

        const totalStok = varList.reduce((acc, v) => acc + (Number(v.stok) || 0), 0);
        targetB.totalStokDisplay = `${totalStok} ${targetB.jenis === "sewa" ? "unit" : "pcs"}`;

        saveOrUpdateBarang(targetB);
        setBarangList(getStoredBarang());

        // Append to history log
        const now = new Date();
        const dateStr = `Hari ini · ${now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
        setStockAdjustmentHistory((prev) => [
          {
            id: `adj-${Date.now()}`,
            waktu: dateStr,
            produkNama: adjustTargetVar.nama,
            keterangan: adjustReason || (adjustType === "tambah" ? "Barang masuk / pembelian" : adjustType === "kurang" ? "Penyesuaian pengurangan" : "Hasil koreksi opname"),
            petugas: role === "owner" ? "Owner Toko" : "Admin Toko",
            delta,
          },
          ...prev,
        ]);
      }
    }

    setIsAdjustModalOpen(false);
    setAdjustTargetVar(null);
    setAdjustQty(1);
    setAdjustReason("");
  };

  return (
    <div className="main">
      <div className="brg-form-container" style={{ gap: "22px" }}>
        {/* Header Breadcrumbs, Title & Top Action Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <span className="brg-badge">
              {activeTab === "jual" ? "STOK DAN KETERSEDIAAN / BARANG JUAL" : "STOK DAN KETERSEDIAAN"}
            </span>
            <h1 className="brg-title" style={{ marginTop: "6px", marginBottom: "4px" }}>
              Stok dan Ketersediaan
            </h1>
            <p className="brg-subtitle" style={{ margin: 0 }}>
              {activeTab === "jual"
                ? "Barang jual dikelola berdasarkan jumlah: stok, batas minimum, dan riwayat penyesuaian."
                : "Dikelola per produk, variasi, dan unit. Kondisi fisik dibedakan dari alokasi booking."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {activeTab === "sewa" ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (variationRows.length > 0) {
                      const first = variationRows[0];
                      setAdjustTargetVar({ bId: first.bId, vId: first.vId, nama: `${first.produk} - ${first.merek} · ${first.spesifikasi}`, stokNow: first.total });
                      setIsAdjustModalOpen(true);
                    }
                  }}
                  className="tx-btn-secondary"
                  style={{ padding: "8px 18px", fontSize: "13px", cursor: "pointer" }}
                >
                  Penyesuaian stok
                </button>
                <Link
                  href={`${basePath}/form`}
                  className="tx-btn-primary"
                  style={{
                    textDecoration: "none",
                    padding: "8px 20px",
                    fontSize: "13px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  + Tambah stok
                </Link>
              </>
            ) : (
              <Link
                href={`${basePath}/form?jenis=jual`}
                className="tx-btn-primary"
                style={{
                  textDecoration: "none",
                  padding: "8px 20px",
                  fontSize: "13px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#0F172A",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                }}
              >
                + Tambah barang jual
              </Link>
            )}
          </div>
        </div>

        {/* Toggle Pills: Barang Sewa / Barang Jual */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setActiveTab("sewa")}
            style={{
              padding: "7px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              border: activeTab === "sewa" ? "1.5px solid #0284C7" : "1.5px solid #CBD5E1",
              background: activeTab === "sewa" ? "#0284C7" : "#FFFFFF",
              color: activeTab === "sewa" ? "#FFFFFF" : "#475569",
              transition: "all 0.15s ease",
            }}
          >
            Barang Sewa
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("jual")}
            style={{
              padding: "7px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              border: activeTab === "jual" ? "1.5px solid #0284C7" : "1.5px solid #CBD5E1",
              background: activeTab === "jual" ? "#0284C7" : "#FFFFFF",
              color: activeTab === "jual" ? "#FFFFFF" : "#475569",
              transition: "all 0.15s ease",
            }}
          >
            Barang Jual
          </button>
        </div>

        {activeTab === "sewa" ? (
          <>
            {/* 4 KPI Cards (Matching Screenshot) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              {/* Card 1: Total unit sewa */}
              <div className="brg-card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Total unit sewa</span>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", marginTop: "4px" }}>
                    {kpiSewa.totalUnit}
                  </div>
                </div>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#EFF6FF", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
              </div>

              {/* Card 2: Tersedia */}
              <div className="brg-card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#166534", fontWeight: 600 }}>Tersedia</span>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#166534", marginTop: "4px" }}>
                    {kpiSewa.tersedia}
                  </div>
                </div>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#F0FDF4", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
              </div>

              {/* Card 3: Disewa */}
              <div className="brg-card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#B45309", fontWeight: 600 }}>Disewa</span>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#B45309", marginTop: "4px" }}>
                    {kpiSewa.disewa}
                  </div>
                </div>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#FFFBEB", color: "#B45309", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>

              {/* Card 4: Tidak siap */}
              <div className="brg-card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#0284C7", fontWeight: 600 }}>Tidak siap (cuci, persiapan, rusak, perawatan)</span>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", marginTop: "4px" }}>
                    {kpiSewa.tidakSiap}
                  </div>
                </div>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#EFF6FF", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Section 1: Cek Ketersediaan Berdasarkan Tanggal dan Variasi (Matching Screenshot) */}
            <div className="brg-card" style={{ width: "100%", padding: "26px 30px" }}>
              <div style={{ marginBottom: "18px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", margin: "0 0 14px" }}>
                  Cek ketersediaan berdasarkan tanggal dan variasi
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr)) 120px",
                    gap: "14px",
                    alignItems: "flex-end",
                  }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", color: "#64748B", fontWeight: 600, marginBottom: "5px" }}>
                      Mulai sewa
                    </label>
                    <input
                      type="date"
                      value={tglMulai}
                      onChange={(e) => setTglMulai(e.target.value)}
                      className="tx-input"
                      style={{ width: "100%", height: "40px", fontSize: "13px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 10px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", color: "#64748B", fontWeight: 600, marginBottom: "5px" }}>
                      Selesai sewa
                    </label>
                    <input
                      type="date"
                      value={tglSelesai}
                      onChange={(e) => setTglSelesai(e.target.value)}
                      className="tx-input"
                      style={{ width: "100%", height: "40px", fontSize: "13px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 10px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", color: "#64748B", fontWeight: 600, marginBottom: "5px" }}>
                      Produk / variasi / paket
                    </label>
                    <select
                      value={selectedTarget}
                      onChange={(e) => setSelectedTarget(e.target.value)}
                      className="tx-select"
                      style={{ width: "100%", height: "40px", fontSize: "13px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 10px" }}
                    >
                      <optgroup label="Paket Penyewaan">
                        <option value="pkt-1">Paket Pendakian 2 Orang</option>
                        <option value="pkt-2">Paket Camping Keluarga</option>
                        <option value="pkt-3">Paket Solo Hiking</option>
                      </optgroup>
                      <optgroup label="Barang / Variasi Satuan">
                        <option value="var-jkt-l">Jaket Gunung - Rimba · L</option>
                        <option value="var-jkt-m">Jaket Gunung - Rimba · M</option>
                        <option value="var-tnd">Tenda Dome - Rimba · 4P</option>
                        <option value="var-crr">Carrier - Kelana · 60L</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleCheckAvailability}
                      className="tx-btn-primary"
                      style={{
                        width: "100%",
                        height: "40px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        background: "#0F172A",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    >
                      Periksa
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabel Hasil Cek Ketersediaan (Matching Screenshot) */}
              <div style={{ overflowX: "auto", border: "1.5px solid #E2E8F0", borderRadius: "10px", marginTop: "16px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "11px", fontWeight: 700, letterSpacing: "0.03em" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left" }}>VARIASI PENYUSUN PAKET</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", width: "160px" }}>DIBUTUHKAN</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", width: "160px" }}>TERSEDIA</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", width: "160px" }}>HASIL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkResults.map((res, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: idx < checkResults.length - 1 ? "1px solid #F1F5F9" : "none",
                          background: res.status === "Kurang" ? "#FEF2F2" : "transparent",
                        }}
                      >
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0F172A" }}>
                          {res.variasi}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600 }}>
                          {res.dibutuhkan}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, color: res.status === "Kurang" ? "#DC2626" : "#166534" }}>
                          {res.tersedia}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          {res.status === "Cukup" ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "3px 12px",
                                borderRadius: "20px",
                                fontSize: "11.5px",
                                fontWeight: 700,
                                background: "#F0FDF4",
                                color: "#166534",
                                border: "1px solid #BBF7D0",
                              }}
                            >
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E" }} />
                              Cukup
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "3px 12px",
                                borderRadius: "20px",
                                fontSize: "11.5px",
                                fontWeight: 700,
                                background: "#FEF2F2",
                                color: "#DC2626",
                                border: "1px solid #FECACA",
                              }}
                            >
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444" }} />
                              Kurang {res.selisih || 1}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Ringkasan per Variasi (Matching Screenshot) */}
            <div className="brg-card" style={{ width: "100%", padding: "26px 30px" }}>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", background: "#0284C7", borderRadius: "50%" }} />
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                    Ringkasan per variasi
                  </h3>
                </div>
                <p style={{ margin: "4px 0 0 14px", fontSize: "12.5px", color: "#64748B" }}>
                  Pilih Detail Unit untuk melihat seluruh unit sebuah variasi dan mengubah kondisinya satu per satu.
                </p>
              </div>

              {/* Filter Bar Lengkap (Search + 6 Dropdown Sesuai Screenshot) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(220px, 1.5fr) repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "10px",
                  marginBottom: "18px",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  placeholder="Cari nama produk atau kode unit..."
                  value={searchVariasi}
                  onChange={(e) => setSearchVariasi(e.target.value)}
                  className="tx-input"
                  style={{ height: "38px", fontSize: "12.5px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 12px" }}
                />

                <select
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                  className="tx-select"
                  style={{ height: "38px", fontSize: "12.5px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 10px" }}
                >
                  <option value="semua">Semua kategori</option>
                  <option value="Pakaian">Pakaian</option>
                  <option value="Tenda">Tenda</option>
                  <option value="Tas & Carrier">Tas & Carrier</option>
                  <option value="Peralatan Tidur">Peralatan Tidur</option>
                  <option value="Penerangan">Penerangan</option>
                </select>

                <select
                  value={filterMerek}
                  onChange={(e) => setFilterMerek(e.target.value)}
                  className="tx-select"
                  style={{ height: "38px", fontSize: "12.5px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 10px" }}
                >
                  <option value="semua">Semua merek</option>
                  <option value="Rimba">Rimba</option>
                  <option value="Kelana">Kelana</option>
                  <option value="Eiger">Eiger</option>
                  <option value="Consina">Consina</option>
                </select>

                <select
                  value={filterUkuran}
                  onChange={(e) => setFilterUkuran(e.target.value)}
                  className="tx-select"
                  style={{ height: "38px", fontSize: "12.5px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 10px" }}
                >
                  <option value="semua">Semua ukuran</option>
                  <option value="M">Ukuran M</option>
                  <option value="L">Ukuran L</option>
                  <option value="XL">Ukuran XL</option>
                </select>

                <select
                  value={filterKapasitas}
                  onChange={(e) => setFilterKapasitas(e.target.value)}
                  className="tx-select"
                  style={{ height: "38px", fontSize: "12.5px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 10px" }}
                >
                  <option value="semua">Semua kapasitas</option>
                  <option value="4P">4P</option>
                  <option value="2P">2P</option>
                  <option value="60L">60L</option>
                </select>

                <select
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                  className="tx-select"
                  style={{ height: "38px", fontSize: "12.5px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 10px" }}
                >
                  <option value="semua">Semua jenis</option>
                  <option value="Mummy">Mummy</option>
                  <option value="Rechargeable">Rechargeable</option>
                </select>

                <select
                  value={filterKondisi}
                  onChange={(e) => setFilterKondisi(e.target.value)}
                  className="tx-select"
                  style={{ height: "38px", fontSize: "12.5px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 10px" }}
                >
                  <option value="semua">Semua kondisi</option>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Disewa">Disewa</option>
                  <option value="Tidak Siap">Tidak Siap</option>
                </select>
              </div>

              {/* Tabel Ringkasan per Variasi (Matching Screenshot) */}
              <div style={{ overflowX: "auto", border: "1.5px solid #E2E8F0", borderRadius: "10px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "11px", fontWeight: 700, letterSpacing: "0.03em" }}>
                      <th style={{ padding: "12px 14px", textAlign: "left" }}>PRODUK</th>
                      <th style={{ padding: "12px 14px", textAlign: "left" }}>MEREK</th>
                      <th style={{ padding: "12px 14px", textAlign: "left" }}>SPESIFIKASI VARIASI</th>
                      <th style={{ padding: "12px 14px", textAlign: "center" }}>TOTAL</th>
                      <th style={{ padding: "12px 14px", textAlign: "center" }}>TERSEDIA</th>
                      <th style={{ padding: "12px 14px", textAlign: "center" }}>DISEWA</th>
                      <th style={{ padding: "12px 14px", textAlign: "center" }}>TIDAK SIAP</th>
                      <th style={{ padding: "12px 14px", textAlign: "center" }}>DIBOOKING</th>
                      <th style={{ padding: "12px 14px", textAlign: "right" }}>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVariations.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ padding: "30px", textAlign: "center", color: "#64748B" }}>
                          Tidak ada variasi produk yang cocok dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredVariations.map((v, idx) => (
                        <tr
                          key={`${v.bId}-${v.vId}-${idx}`}
                          style={{
                            borderBottom: idx < filteredVariations.length - 1 ? "1px solid #F1F5F9" : "none",
                            transition: "background 0.15s ease",
                          }}
                        >
                          <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0F172A" }}>
                            {v.produk}
                          </td>
                          <td style={{ padding: "12px 14px", color: "#334155", fontWeight: 600 }}>
                            {v.merek}
                          </td>
                          <td style={{ padding: "12px 14px", color: "#64748B" }}>
                            {v.spesifikasi}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 700 }}>
                            {v.total}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 700, color: "#166534" }}>
                            {v.tersedia}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 600, color: "#0284C7" }}>
                            {v.disewa}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 600, color: "#DC2626" }}>
                            {v.tidakSiap}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 600, color: "#B45309" }}>
                            {v.dibooking}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right" }}>
                            <Link
                              href={`${basePath}/${v.kode}/unit/${encodeURIComponent(v.vId)}`}
                              className="brg-btn-action"
                              style={{
                                textDecoration: "none",
                                background: "#FFFFFF",
                                border: "1.5px solid #CBD5E1",
                                padding: "5px 12px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#0F172A",
                                display: "inline-block",
                              }}
                            >
                              Detail Unit
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Unit Individual (Peeking at the bottom of screenshot) */}
            <div className="brg-card" style={{ width: "100%", padding: "26px 30px" }}>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", background: "#0284C7", borderRadius: "50%" }} />
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                    Unit individual yang memerlukan perhatian operasional
                  </h3>
                </div>
                <p style={{ margin: "4px 0 0 14px", fontSize: "12.5px", color: "#64748B" }}>
                  Daftar unit fisik dalam status dicuci, persiapan, rusak, atau perawatan. Klik "Tandai siap" untuk memulihkan ke kondisi Tersedia.
                </p>
              </div>

              <div style={{ overflowX: "auto", border: "1.5px solid #E2E8F0", borderRadius: "10px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "11px", fontWeight: 700 }}>
                      <th style={{ padding: "12px 14px", textAlign: "left" }}>KODE UNIT</th>
                      <th style={{ padding: "12px 14px", textAlign: "left" }}>PRODUK &amp; VARIASI</th>
                      <th style={{ padding: "12px 14px", textAlign: "left" }}>KONDISI</th>
                      <th style={{ padding: "12px 14px", textAlign: "left" }}>CATATAN / STATUS OPERASIONAL</th>
                      <th style={{ padding: "12px 14px", textAlign: "left" }}>DIPERBARUI</th>
                      <th style={{ padding: "12px 14px", textAlign: "right" }}>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {individualUnits.map((u, idx) => (
                      <tr key={u.kodeUnit} style={{ borderBottom: idx < individualUnits.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0284C7", fontFamily: "monospace" }}>
                          {u.kodeUnit}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ fontWeight: 600, color: "#0F172A" }}>{u.produkNama}</span>
                          <span style={{ color: "#64748B", fontSize: "12px", marginLeft: "6px" }}>{u.variasiNama}</span>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: "14px",
                              fontSize: "11.5px",
                              fontWeight: 700,
                              background:
                                u.kondisi === "Tersedia"
                                  ? "#F0FDF4"
                                  : u.kondisi === "Disewa"
                                  ? "#EFF6FF"
                                  : u.kondisi === "Rusak"
                                  ? "#FEF2F2"
                                  : u.kondisi === "Dicuci"
                                  ? "#FAF5FF"
                                  : "#FFFBEB",
                              color:
                                u.kondisi === "Tersedia"
                                  ? "#166534"
                                  : u.kondisi === "Disewa"
                                  ? "#1D4ED8"
                                  : u.kondisi === "Rusak"
                                  ? "#B91C1C"
                                  : u.kondisi === "Dicuci"
                                  ? "#7E22CE"
                                  : "#B45309",
                            }}
                          >
                            • {u.kondisi}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", color: "#334155" }}>
                          {u.alokasi}
                        </td>
                        <td style={{ padding: "12px 14px", color: "#64748B", fontSize: "12px" }}>
                          {u.diperbarui}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "6px" }}>
                            {u.kondisi !== "Tersedia" && (
                              <button
                                type="button"
                                onClick={() => handleMarkAsReady(u.kodeUnit)}
                                className="brg-btn-action"
                                style={{
                                  background: "#F0FDF4",
                                  border: "1px solid #BBF7D0",
                                  color: "#166534",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "11.5px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                Tandai siap
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setUnitToChangeCondition(u);
                                setNewUnitCondition(u.kondisi);
                                setUnitConditionNotes(u.alokasi);
                              }}
                              className="brg-btn-action"
                              style={{
                                background: "#FFFFFF",
                                border: "1.5px solid #CBD5E1",
                                padding: "5px 10px",
                                borderRadius: "6px",
                                fontSize: "11.5px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Ubah kondisi
                            </button>
                            <Link
                              href={`${basePath}/${u.kodeBarang}/unit/${u.varParam}`}
                              className="brg-btn-action"
                              style={{
                                textDecoration: "none",
                                background: "#0F172A",
                                color: "#FFFFFF",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "6px",
                                fontSize: "11.5px",
                                fontWeight: 600,
                                display: "inline-block",
                              }}
                            >
                              Detail Unit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Tab Barang Jual (Sesuai Screenshot media_1795848782337_266f1271.png) */
          <>
            {/* 4 KPI Cards for Barang Jual */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              {/* Card 1: Produk jual (Dark card with geometric wireframe mesh background) */}
              <div
                style={{
                  background: "linear-gradient(135deg, #090e1a 0%, #0f172a 60%, #1e293b 100%)",
                  borderRadius: "14px",
                  padding: "20px 24px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* SVG Geometric Mesh Overlay */}
                <svg
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0.22,
                    pointerEvents: "none",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="0" y1="20" x2="120" y2="80" stroke="#38BDF8" strokeWidth="1" />
                  <line x1="120" y1="80" x2="220" y2="20" stroke="#38BDF8" strokeWidth="1" />
                  <line x1="220" y1="20" x2="320" y2="90" stroke="#38BDF8" strokeWidth="1" />
                  <line x1="60" y1="0" x2="180" y2="100" stroke="#38BDF8" strokeWidth="1" />
                  <line x1="180" y1="100" x2="280" y2="10" stroke="#38BDF8" strokeWidth="1" />
                  <line x1="0" y1="60" x2="100" y2="10" stroke="#38BDF8" strokeWidth="1" />
                </svg>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 600 }}>Produk jual</span>
                  <div style={{ fontSize: "30px", fontWeight: 800, color: "#FFFFFF", marginTop: "4px" }}>
                    {jualStatusCounts.semua}
                  </div>
                </div>
              </div>

              {/* Card 2: Total stok */}
              <div className="brg-card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Total stok</span>
                  <div style={{ fontSize: "30px", fontWeight: 800, color: "#0F172A", marginTop: "4px" }}>
                    {jualStatusCounts.totalStock}
                  </div>
                </div>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#EFF6FF", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
              </div>

              {/* Card 3: Stok menipis / habis */}
              <div className="brg-card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Stok menipis / habis</span>
                  <div style={{ fontSize: "30px", fontWeight: 800, color: "#0F172A", marginTop: "4px" }}>
                    {jualStatusCounts.menipisAtauHabis}
                  </div>
                </div>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#EFF6FF", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
              </div>

              {/* Card 4: Terjual bulan ini */}
              <div className="brg-card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Terjual bulan ini</span>
                  <div style={{ fontSize: "30px", fontWeight: 800, color: "#0F172A", marginTop: "4px" }}>
                    162 pcs
                  </div>
                </div>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#EFF6FF", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Section 1: Stok Barang Jual Card */}
            <div className="brg-card" style={{ width: "100%", padding: "26px 30px" }}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", background: "#0284C7", borderRadius: "50%" }} />
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                    Stok barang jual
                  </h3>
                </div>
                <p style={{ margin: "4px 0 0 14px", fontSize: "12.5px", color: "#64748B" }}>
                  Dikelola berdasarkan jumlah, tanpa unit individual. Stok berkurang otomatis saat Transaksi Penjualan.
                </p>
              </div>

              {/* Search and Filter Pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginBottom: "20px" }}>
                <div style={{ position: "relative", minWidth: "280px", maxWidth: "340px", flex: "1 1 280px" }}>
                  <input
                    type="text"
                    placeholder="Cari nama produk atau SKU"
                    value={searchJual}
                    onChange={(e) => setSearchJual(e.target.value)}
                    className="tx-input"
                    style={{ width: "100%", height: "38px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 12px", fontSize: "13px" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setFilterStatusJual("semua")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: filterStatusJual === "semua" ? "1.5px solid #0284C7" : "1.5px solid #E2E8F0",
                      background: filterStatusJual === "semua" ? "#0284C7" : "#FFFFFF",
                      color: filterStatusJual === "semua" ? "#FFFFFF" : "#475569",
                    }}
                  >
                    Semua {jualStatusCounts.semua}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterStatusJual("aman")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: filterStatusJual === "aman" ? "1.5px solid #0284C7" : "1.5px solid #E2E8F0",
                      background: filterStatusJual === "aman" ? "#0284C7" : "#FFFFFF",
                      color: filterStatusJual === "aman" ? "#FFFFFF" : "#475569",
                    }}
                  >
                    Aman {jualStatusCounts.aman}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterStatusJual("menipis")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: filterStatusJual === "menipis" ? "1.5px solid #0284C7" : "1.5px solid #E2E8F0",
                      background: filterStatusJual === "menipis" ? "#0284C7" : "#FFFFFF",
                      color: filterStatusJual === "menipis" ? "#FFFFFF" : "#475569",
                    }}
                  >
                    Menipis {jualStatusCounts.menipis}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterStatusJual("habis")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: filterStatusJual === "habis" ? "1.5px solid #0284C7" : "1.5px solid #E2E8F0",
                      background: filterStatusJual === "habis" ? "#0284C7" : "#FFFFFF",
                      color: filterStatusJual === "habis" ? "#FFFFFF" : "#475569",
                    }}
                  >
                    Habis {jualStatusCounts.habis}
                  </button>
                </div>
              </div>

              {/* Table Barang Jual */}
              <div style={{ overflowX: "auto", border: "1.5px solid #E2E8F0", borderRadius: "10px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "11px", fontWeight: 700 }}>
                      <th style={{ padding: "12px 16px", textAlign: "left" }}>PRODUK - SKU</th>
                      <th style={{ padding: "12px 16px", textAlign: "left" }}>KATEGORI</th>
                      <th style={{ padding: "12px 16px", textAlign: "left" }}>HARGA JUAL</th>
                      <th style={{ padding: "12px 16px", textAlign: "left" }}>STOK</th>
                      <th style={{ padding: "12px 16px", textAlign: "left" }}>MIN.</th>
                      <th style={{ padding: "12px 16px", textAlign: "left" }}>STATUS</th>
                      <th style={{ padding: "12px 16px", textAlign: "right" }}>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJualList.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "#64748B" }}>
                          Tidak ada produk jual yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      filteredJualList.map((b, idx) => {
                        const v = b.variasi?.[0];
                        const stok = Number(v?.stok) || 0;
                        const min = b.stokMinimum || v?.stokMinimum || 10;
                        const isHabis = stok === 0;
                        const isMenipis = !isHabis && stok <= min;

                        return (
                          <tr key={b.id} style={{ borderBottom: idx < filteredJualList.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>{b.nama}</div>
                              <span style={{ color: "#94A3B8", fontSize: "11.5px", fontFamily: "monospace" }}>
                                {b.sku || b.kode}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", color: "#475569" }}>{b.kategori}</td>
                            <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0F172A" }}>
                              {b.rentangHargaDisplay}
                            </td>
                            <td style={{ padding: "12px 16px", fontWeight: 700, color: "#0F172A" }}>
                              {stok} pcs
                            </td>
                            <td style={{ padding: "12px 16px", color: "#64748B" }}>
                              {min}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "3px 10px",
                                  borderRadius: "14px",
                                  fontSize: "11.5px",
                                  fontWeight: 700,
                                  background: isHabis ? "#FEF2F2" : isMenipis ? "#FFFBEB" : "#F0FDF4",
                                  color: isHabis ? "#DC2626" : isMenipis ? "#D97706" : "#16A34A",
                                  border: isHabis ? "1px solid #FECACA" : isMenipis ? "1px solid #FDE68A" : "1px solid #BBF7D0",
                                }}
                              >
                                • {isHabis ? "Habis" : isMenipis ? "Menipis" : "Aman"}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setAdjustTargetVar({
                                    bId: b.id,
                                    vId: v?.id || "var-0",
                                    nama: b.nama,
                                    stokNow: stok,
                                  });
                                  setIsAdjustModalOpen(true);
                                }}
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
                                Penyesuaian stok
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div style={{ marginTop: "14px", fontSize: "12.5px", color: "#64748B" }}>
                Menampilkan {filteredJualList.length} dari {jualProducts.length} produk jual
              </div>
            </div>

            {/* Section 2: Riwayat Penyesuaian Stok Card */}
            <div className="brg-card" style={{ width: "100%", padding: "26px 30px" }}>
              <div style={{ marginBottom: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", background: "#0284C7", borderRadius: "50%" }} />
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                    Riwayat penyesuaian stok
                  </h3>
                </div>
                <p style={{ margin: "4px 0 0 14px", fontSize: "12.5px", color: "#64748B" }}>
                  Setiap perubahan stok manual tercatat beserta alasan dan petugasnya.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {stockAdjustmentHistory.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 0",
                      borderBottom: idx < stockAdjustmentHistory.length - 1 ? "1px solid #F1F5F9" : "none",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", flex: "1 1 auto" }}>
                      <span style={{ fontSize: "12px", color: "#64748B", minWidth: "100px" }}>
                        {item.waktu}
                      </span>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>
                          {item.produkNama}
                        </div>
                        <span style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", display: "block" }}>
                          {item.keterangan} · {item.petugas}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                          color: item.delta > 0 ? "#16A34A" : "#DC2626",
                          fontFamily: "monospace",
                        }}
                      >
                        {item.delta > 0 ? `+${item.delta}` : item.delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Dialog: Penyesuaian Stok (Stock Adjustment) */}
      {isAdjustModalOpen && adjustTargetVar && (
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
          onClick={() => setIsAdjustModalOpen(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
                  Penyesuaian Stok Barang
                </h3>
                <span style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", display: "block" }}>
                  Item: <strong>{adjustTargetVar.nama}</strong> · Stok saat ini: <strong>{adjustTargetVar.stokNow}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                style={{ background: "transparent", border: "none", fontSize: "20px", color: "#94A3B8", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  Item yang Disesuaikan
                </label>
                <select
                  value={`${adjustTargetVar.bId}||${adjustTargetVar.vId}`}
                  onChange={(e) => {
                    const [targetBId, targetVId] = e.target.value.split("||");
                    const all = getStoredBarang();
                    const b = all.find((x) => x.id === targetBId || x.kode === targetBId);
                    if (b) {
                      const v = b.variasi?.find((x) => x.id === targetVId) || b.variasi?.[0];
                      const stok = Number(v?.stok) || 0;
                      setAdjustTargetVar({
                        bId: b.id,
                        vId: v?.id || "var-0",
                        nama: b.jenis === "sewa" && v?.merek ? `${b.nama} - ${v.merek} · ${v.spesifikasi || v.namaVariasi}` : b.nama,
                        stokNow: stok,
                      });
                    }
                  }}
                  className="tx-select"
                  style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 12px", fontSize: "13px", fontWeight: 600 }}
                >
                  {barangList.flatMap((b) =>
                    (b.variasi || []).map((v) => (
                      <option key={`${b.id}-${v.id}`} value={`${b.id}||${v.id}`}>
                        {b.jenis === "sewa"
                          ? `[Sewa] ${b.nama} - ${v.merek || ""} · ${v.spesifikasi || v.namaVariasi || ""} (Stok: ${v.stok} unit)`
                          : `[Jual] ${b.nama} (${b.sku || b.kode}) (Stok: ${v.stok} pcs)`}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  Jenis Penyesuaian
                </label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="tx-select"
                  style={{ width: "100%", height: "42px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 12px", fontSize: "13px", fontWeight: 600 }}
                >
                  <option value="tambah">🟢 Tambah Stok (Barang Masuk / Pembelian)</option>
                  <option value="kurang">🔴 Kurangi Stok (Barang Rusak / Hilang / Kadaluarsa)</option>
                  <option value="penyesuaian">🔵 Koreksi Opname (Setel Langsung Angka Baru)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  {adjustType === "penyesuaian" ? "Jumlah Stok Baru Sebenarnya" : "Jumlah Unit Penyesuaian"}
                </label>
                <input
                  type="number"
                  min={1}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="tx-input"
                  style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 12px", fontSize: "14px", fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  Alasan / Keterangan Penyesuaian (Wajib)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Hasil stok opname bulanan, Rusak saat pemakaian..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="tx-input"
                  style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 12px", fontSize: "13px" }}
                />
              </div>
            </div>

            <div style={{ padding: "16px 24px", borderTop: "1px solid #E2E8F0", background: "#F8FAFC", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                className="tx-btn-secondary"
                style={{ padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveStockAdjustment}
                className="tx-btn-primary"
                style={{ padding: "8px 22px", fontSize: "13px", cursor: "pointer" }}
              >
                Simpan Penyesuaian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ubah Kondisi Unit Cepat */}
      {unitToChangeCondition && (
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
          onClick={() => setUnitToChangeCondition(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
                  Ubah Kondisi Unit: {unitToChangeCondition.kodeUnit}
                </h3>
                <span style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", display: "block" }}>
                  {unitToChangeCondition.produkNama} ({unitToChangeCondition.variasiNama})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUnitToChangeCondition(null)}
                style={{ background: "transparent", border: "none", fontSize: "20px", color: "#94A3B8", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  Kondisi Baru
                </label>
                <select
                  value={newUnitCondition}
                  onChange={(e) => setNewUnitCondition(e.target.value as any)}
                  className="tx-select"
                  style={{ width: "100%", height: "42px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 12px", fontSize: "13px", fontWeight: 600 }}
                >
                  <option value="Tersedia">🟢 Tersedia (Siap disewakan)</option>
                  <option value="Disewa">🔵 Disewa (Sedang masa sewa)</option>
                  <option value="Dicuci">🟣 Dicuci (Proses pembersihan)</option>
                  <option value="Persiapan">🟡 Persiapan (QC / Pengecekan)</option>
                  <option value="Rusak">🔴 Rusak (Perlu servis)</option>
                  <option value="Perawatan">⚪ Perawatan (Maintenance)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                  Catatan Pemeriksaan
                </label>
                <input
                  type="text"
                  placeholder="Keterangan kondisi..."
                  value={unitConditionNotes}
                  onChange={(e) => setUnitConditionNotes(e.target.value)}
                  className="tx-input"
                  style={{ width: "100%", height: "40px", borderRadius: "8px", border: "1.5px solid #CBD5E1", padding: "0 12px", fontSize: "13px" }}
                />
              </div>
            </div>

            <div style={{ padding: "16px 24px", borderTop: "1px solid #E2E8F0", background: "#F8FAFC", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setUnitToChangeCondition(null)}
                className="tx-btn-secondary"
                style={{ padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveUnitCondition}
                className="tx-btn-primary"
                style={{ padding: "8px 22px", fontSize: "13px", cursor: "pointer" }}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
