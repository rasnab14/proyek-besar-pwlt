// app/owner/transaksi/sewa/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import "@/components/transaksi/transaksi.css";
import {
  TransaksiSewaRecord,
  SewaFilterState,
  getStoredTransaksiSewa,
  SewaHeader,
  SewaSummaryCards,
  SewaFilterBar,
  SewaTableOwner,
  SewaDetailModal,
  PrintReceiptModal,
} from "@/components/transaksi";

export default function OwnerTransaksiSewaPage() {
  const [records, setRecords] = useState<TransaksiSewaRecord[]>([]);
  const [filters, setFilters] = useState<SewaFilterState>({
    searchQuery: "",
    status: "semua",
    dateRange: "1 – 30 Nov 2026",
  });

  // Modal states (Owner can view detail & receipt, but cannot create or alter operational data)
  const [selectedRecord, setSelectedRecord] = useState<TransaksiSewaRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [receiptRecord, setReceiptRecord] = useState<TransaksiSewaRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Sync data with storage (Single source of truth with Admin)
  const reloadData = () => {
    setRecords(getStoredTransaksiSewa());
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

  // Filtered records for Owner
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchKode = r.kode.toLowerCase().includes(q);
        const matchNama = r.pelanggan.nama.toLowerCase().includes(q);
        const matchBarang = r.barangDiPelanggan.toLowerCase().includes(q);
        if (!matchKode && !matchNama && !matchBarang) return false;
      }

      // Status (Lunas / Belum Lunas)
      if (filters.status !== "semua") {
        const isLunas = r.status === "lunas" || r.sisaTagihan === 0;
        if (filters.status === "lunas" && !isLunas) return false;
        if (filters.status === "belum_lunas" && isLunas) return false;
      }

      return true;
    });
  }, [records, filters]);

  const handleOpenDetail = (r: TransaksiSewaRecord) => {
    setSelectedRecord(r);
    setIsDetailOpen(true);
  };

  const handleOpenReceipt = (r: TransaksiSewaRecord) => {
    setReceiptRecord(r);
    setIsReceiptOpen(true);
  };

  return (
    <div className="main">
      <div className="tx-page-container">
        {/* Header with Title, Breadcrumbs, and Subnav Tabs (Penyewaan / Penjualan) */}
        <SewaHeader role="owner" />

        {/* 4 Summary Cards for Owner */}
        <SewaSummaryCards role="owner" records={records} />

        {/* Filter Bar */}
        <SewaFilterBar
          role="owner"
          filters={filters}
          onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
        />

        {/* Owner Data Table (Specific columns matching reference screenshot) */}
        <SewaTableOwner
          records={filteredRecords}
          onSelectRecord={handleOpenDetail}
        />
      </div>

      {/* Detail Modal (Read-only for Owner) */}
      <SewaDetailModal
        record={selectedRecord}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenReceipt={(r) => {
          setIsDetailOpen(false);
          handleOpenReceipt(r);
        }}
      />

      {/* Struk Modal */}
      <PrintReceiptModal
        record={receiptRecord}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
