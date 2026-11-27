// app/owner/transaksi/jual/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import "@/components/transaksi/transaksi.css";
import {
  TransaksiJualRecord,
  JualFilterState,
  getStoredTransaksiJual,
  JualHeader,
  JualSummaryCards,
  JualFilterBar,
  JualTable,
  JualDetailModal,
  PrintReceiptJualModal,
} from "@/components/transaksi-jual";

export default function OwnerTransaksiJualPage() {
  const [records, setRecords] = useState<TransaksiJualRecord[]>([]);
  const [filters, setFilters] = useState<JualFilterState>({
    searchQuery: "",
    status: "semua",
    metode: "semua",
    dateRange: "1 – 30 Nov 2026",
  });

  const [selectedRecord, setSelectedRecord] = useState<TransaksiJualRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const reloadData = () => {
    setRecords(getStoredTransaksiJual());
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener("summit_transaksijual_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("summit_transaksijual_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchKode = r.kode.toLowerCase().includes(q);
        const matchPelanggan = r.pelanggan.nama.toLowerCase().includes(q);
        const matchBarang = r.barangRingkasan.toLowerCase().includes(q);
        if (!matchKode && !matchPelanggan && !matchBarang) return false;
      }
      if (filters.status !== "semua" && r.status !== filters.status) {
        return false;
      }
      if (filters.metode !== "semua" && r.metodeBayar !== filters.metode) {
        return false;
      }
      return true;
    });
  }, [records, filters]);

  const handleOpenDetail = (r: TransaksiJualRecord) => {
    setSelectedRecord(r);
    setIsDetailOpen(true);
  };

  const handleOpenPrint = (r: TransaksiJualRecord) => {
    setSelectedRecord(r);
    setIsPrintOpen(true);
  };

  return (
    <div className="main">
      <div className="tx-page-container">
        {/* Header with Title & Monitoring Tabs */}
        <JualHeader role="owner" />

        {/* 3 Summary Cards */}
        <JualSummaryCards records={records} />

        {/* Filter Bar */}
        <JualFilterBar
          filters={filters}
          onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
        />

        {/* Table Data (Owner Mode: Detail & Struk only) */}
        <JualTable
          records={filteredRecords}
          onDetail={handleOpenDetail}
          onEdit={() => {}}
          onPrint={handleOpenPrint}
          onDelete={() => {}}
          role="owner"
        />
      </div>

      <JualDetailModal
        isOpen={isDetailOpen}
        record={selectedRecord}
        onClose={() => setIsDetailOpen(false)}
        onPrint={(r) => {
          setIsDetailOpen(false);
          handleOpenPrint(r);
        }}
      />

      <PrintReceiptJualModal
        isOpen={isPrintOpen}
        record={selectedRecord}
        onClose={() => setIsPrintOpen(false)}
      />
    </div>
  );
}
