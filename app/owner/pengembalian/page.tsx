// app/owner/pengembalian/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import "@/components/transaksi/transaksi.css";
import {
  TransaksiSewaRecord,
  getStoredTransaksiSewa,
  SewaDetailModal,
  PrintReceiptModal,
} from "@/components/transaksi";
import {
  PengembalianTable,
  hitungMasaSewa,
} from "@/components/pengembalian";

export default function OwnerPengembalianPage() {
  const [records, setRecords] = useState<TransaksiSewaRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"semua" | "aktif" | "terlambat" | "selesai">("semua");

  // Modals (Owner is read-only)
  const [selectedRecord, setSelectedRecord] = useState<TransaksiSewaRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [receiptRecord, setReceiptRecord] = useState<TransaksiSewaRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const reloadData = () => {
    // Memantau seluruh penyewaan yang telah serah terima ke pelanggan
    const all = getStoredTransaksiSewa();
    const sewaAktif = all.filter((r) => r.statusPengambilan === "sudah_diambil");
    setRecords(sewaAktif);
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener("summit_transaksi_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("summit_transaksi_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Filtered
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchKode = r.kode.toLowerCase().includes(q);
        const matchNama = r.pelanggan.nama.toLowerCase().includes(q);
        const matchBarang = (r.barangDiPelanggan || "").toLowerCase().includes(q);
        if (!matchKode && !matchNama && !matchBarang) return false;
      }

      const tracking = hitungMasaSewa(r.tglSelesai, r.statusPengembalian);
      if (filterStatus === "aktif" && r.statusPengembalian === "seluruhnya") return false;
      if (filterStatus === "terlambat" && tracking.statusMasaSewa !== "terlambat") return false;
      if (filterStatus === "selesai" && r.statusPengembalian !== "seluruhnya") return false;

      return true;
    });
  }, [records, searchQuery, filterStatus]);

  // Metrik Ringkasan Owner
  const sedangDisewa = records.filter((r) => r.statusPengembalian !== "seluruhnya").length;
  const terlambatCount = records.filter(
    (r) => r.statusPengembalian !== "seluruhnya" && hitungMasaSewa(r.tglSelesai, r.statusPengembalian).statusMasaSewa === "terlambat"
  ).length;
  const jatuhTempoHariIni = records.filter(
    (r) => r.statusPengembalian !== "seluruhnya" && hitungMasaSewa(r.tglSelesai, r.statusPengembalian).sisaHari === 0
  ).length;
  const sudahSelesai = records.filter((r) => r.statusPengembalian === "seluruhnya").length;

  return (
    <div className="main">
      <div className="tx-page-container">
        {/* Header */}
        <div className="tx-header-wrap">
          <div className="tx-header-left">
            <span className="tx-breadcrumb">OWNER / MONITORING PENGEMBALIAN &amp; TRACKING MASA SEWA</span>
            <h1 className="tx-title">Monitoring Pengembalian</h1>
            <p className="tx-subtitle">
              Pantau jadwal pengembalian, status masa sewa real-time, keterlambatan, dan denda operasional
            </p>
          </div>
          <div className="tx-header-actions">
            <Link href="/owner/transaksi/sewa" className="tx-btn-secondary">
              Monitoring Transaksi
            </Link>
          </div>
        </div>

        {/* 4 Kartu KPI Ringkasan (§B.2 & §H) */}
        <div className="tx-summary-grid">
          {/* Card 1: Sedang Disewa */}
          <div className="tx-summary-card">
            <div className="tx-card-header">
              <span className="tx-card-title">Sedang disewa</span>
              <div className="tx-card-icon tx-icon-blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                </svg>
              </div>
            </div>
            <div className="tx-card-main">
              <span className="tx-card-value">{sedangDisewa}</span>
              <span className="tx-card-sub">Unit aktif di pelanggan</span>
            </div>
          </div>

          {/* Card 2: Jadwal Hari Ini */}
          <div className="tx-summary-card">
            <div className="tx-card-header">
              <span className="tx-card-title">Jadwal hari ini</span>
              <div className="tx-card-icon tx-icon-amber">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <div className="tx-card-main">
              <span className="tx-card-value">{jatuhTempoHariIni}</span>
              <span className="tx-card-sub">Batas s.d. 21.00 WIB</span>
            </div>
          </div>

          {/* Card 3: Terlambat */}
          <div className="tx-summary-card">
            <div className="tx-card-header">
              <span className="tx-card-title">Terlambat kembali</span>
              <div className="tx-card-icon" style={{ background: "#FEE2E2", color: "#DC2626" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
            </div>
            <div className="tx-card-main">
              <span className="tx-card-value" style={{ color: terlambatCount > 0 ? "#DC2626" : "inherit" }}>
                {terlambatCount}
              </span>
              <span className="tx-card-sub">Berpotensi denda</span>
            </div>
          </div>

          {/* Card 4: Selesai Kembali */}
          <div className="tx-summary-card">
            <div className="tx-card-header">
              <span className="tx-card-title">Selesai dikembalikan</span>
              <div className="tx-card-icon tx-icon-green">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
            <div className="tx-card-main">
              <span className="tx-card-value">{sudahSelesai}</span>
              <span className="tx-card-sub">Pemeriksaan tuntas</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="tx-filter-bar">
          <div className="tx-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tx-search-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Cari kode transaksi, penyewa, atau barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tx-search-input"
            />
          </div>

          <div className="tx-filter-group">
            <select
              className="tx-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="semua">Semua Status</option>
              <option value="aktif">Belum Selesai (Aktif)</option>
              <option value="terlambat">Hanya Terlambat</option>
              <option value="selesai">Sudah Selesai</option>
            </select>
          </div>
        </div>

        {/* Tabel Antrean Monitoring Pengembalian Owner (Hanya Lihat) */}
        <PengembalianTable
          role="owner"
          records={filteredRecords}
          onOpenDetail={(r) => {
            setSelectedRecord(r);
            setIsDetailOpen(true);
          }}
        />
      </div>

      {/* Detail Modal */}
      <SewaDetailModal
        record={selectedRecord}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenReceipt={(r) => {
          setIsDetailOpen(false);
          setReceiptRecord(r);
          setIsReceiptOpen(true);
        }}
      />

      {/* Print Receipt Modal */}
      <PrintReceiptModal
        record={receiptRecord}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
