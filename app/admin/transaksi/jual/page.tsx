// app/admin/transaksi/jual/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  JualDeleteModal,
  PrintReceiptJualModal,
} from "@/components/transaksi-jual";

export default function AdminTransaksiJualPage() {
  const router = useRouter();
  const [records, setRecords] = useState<TransaksiJualRecord[]>([]);
  const [filters, setFilters] = useState<JualFilterState>({
    searchQuery: "",
    status: "semua",
    metode: "semua",
    dateRange: "1 – 30 Nov 2026",
  });

  // Modal states
  const [selectedRecord, setSelectedRecord] = useState<TransaksiJualRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Sync data
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

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchKode = r.kode.toLowerCase().includes(q);
        const matchPelanggan = r.pelanggan.nama.toLowerCase().includes(q);
        const matchBarang = r.barangRingkasan.toLowerCase().includes(q);
        if (!matchKode && !matchPelanggan && !matchBarang) return false;
      }

      // Status
      if (filters.status !== "semua" && r.status !== filters.status) {
        return false;
      }

      // Metode Pembayaran
      if (filters.metode !== "semua" && r.metodeBayar !== filters.metode) {
        return false;
      }

      return true;
    });
  }, [records, filters]);

  // Handlers for CRUD + Print
  const handleOpenDetail = (r: TransaksiJualRecord) => {
    setSelectedRecord(r);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = (r: TransaksiJualRecord) => {
    // Arahkan langsung ke form transaksi penjualan untuk koreksi pesanan / barang
    router.push(`/admin/transaksi/jual/baru?edit=${r.id}`);
  };

  const handleOpenDelete = (r: TransaksiJualRecord) => {
    setSelectedRecord(r);
    setIsDeleteOpen(true);
  };

  const handleOpenPrint = (r: TransaksiJualRecord) => {
    setSelectedRecord(r);
    setIsPrintOpen(true);
  };

  return (
    <div className="main">
      <div className="tx-page-container">
        {/* Header with Title & Action Button */}
        <JualHeader role="admin" />

        {/* 3 Summary Cards (Card 3: Transaksi Selesai) */}
        <JualSummaryCards records={records} />

        {/* Filter Bar */}
        <JualFilterBar
          filters={filters}
          onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
        />

        {/* Table Data (Columns: KODE | TANGGAL | PELANGGAN | BARANG | TOTAL | STATUS | AKSI) */}
        <JualTable
          records={filteredRecords}
          onDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onPrint={handleOpenPrint}
          onDelete={handleOpenDelete}
          role="admin"
        />
      </div>

      {/* Modals: Read (dengan Cetak Struk), Delete, Print */}
      <JualDetailModal
        isOpen={isDetailOpen}
        record={selectedRecord}
        onClose={() => setIsDetailOpen(false)}
        onPrint={(r) => {
          setIsDetailOpen(false);
          handleOpenPrint(r);
        }}
      />

      <JualDeleteModal
        isOpen={isDeleteOpen}
        record={selectedRecord}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={() => reloadData()}
      />

      <PrintReceiptJualModal
        isOpen={isPrintOpen}
        record={selectedRecord}
        onClose={() => setIsPrintOpen(false)}
      />
    </div>
  );
}
