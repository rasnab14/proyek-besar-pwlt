// app/admin/transaksi/sewa/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import "@/components/transaksi/transaksi.css";
import {
  TransaksiSewaRecord,
  SewaFilterState,
  getStoredTransaksiSewa,
  saveOrUpdateTransaksiSewa,
  SewaHeader,
  SewaSummaryCards,
  SewaFilterBar,
  SewaTableAdmin,
  SelectBookingModal,
  DirectRentalModal,
  SewaDetailModal,
  PrintReceiptModal,
} from "@/components/transaksi";

export default function AdminTransaksiSewaPage() {
  const [records, setRecords] = useState<TransaksiSewaRecord[]>([]);
  const [filters, setFilters] = useState<SewaFilterState>({
    searchQuery: "",
    status: "semua",
    dateRange: "1 – 30 Nov 2026",
  });

  // Modal states
  const [isSelectBookingOpen, setIsSelectBookingOpen] = useState(false);
  const [isDirectRentalOpen, setIsDirectRentalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TransaksiSewaRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [receiptRecord, setReceiptRecord] = useState<TransaksiSewaRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Sync data with storage
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

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchKode = r.kode.toLowerCase().includes(q);
        const matchNama = r.pelanggan.nama.toLowerCase().includes(q);
        const matchBooking = r.bookingTag.toLowerCase().includes(q);
        if (!matchKode && !matchNama && !matchBooking) return false;
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

  const handleProcessHandover = (r: TransaksiSewaRecord) => {
    const jaminan = prompt(
      `Masukkan jaminan fisik yang diserahkan pelanggan (${r.pelanggan.nama}):`,
      r.jaminanFisik || "KTP Asli"
    );
    if (!jaminan) return;

    const now = new Date();
    const nowStr = now.toISOString().replace("T", " ").substring(0, 16);

    const updated: TransaksiSewaRecord = {
      ...r,
      jaminanFisik: jaminan,
      statusPengambilan: "sudah_diambil",
      status: "lunas",
      statusPembayaran: "lunas",
      sisaTagihan: 0,
      waktuPengambilanAktual: nowStr,
      riwayat: [
        ...(r.riwayat || []),
        {
          waktu: nowStr,
          user: "Admin Toko",
          aksi: "Serah Terima & Pelunasan Kasir Selesai",
          catatan: `Barang diserahkan. Jaminan: ${jaminan}. Status lunas.`,
        },
      ],
    };

    saveOrUpdateTransaksiSewa(updated);
    reloadData();
  };

  return (
    <div className="main">
      <div className="tx-page-container">
        {/* Header with Title, Breadcrumbs, & Action Buttons */}
        <SewaHeader role="admin" />

        {/* Callout Info Banner matching reference screenshot */}
        <div className="tx-info-banner">
          Alur pembayaran: booking minimal H-2 membayar DP 25% lebih dulu, booking H-1 dan transaksi langsung tanpa DP. Barang hanya diserahkan setelah sisa tagihan dilunasi di toko, jadi status &quot;Sudah diambil&quot; selalu berarti Lunas.
        </div>

        {/* 4 Summary Cards */}
        <SewaSummaryCards role="admin" records={records} />

        {/* Filter Bar */}
        <SewaFilterBar
          role="admin"
          filters={filters}
          onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
        />

        {/* Admin Data Table */}
        <SewaTableAdmin
          records={filteredRecords}
          onSelectRecord={handleOpenDetail}
          onPrintReceipt={handleOpenReceipt}
          onProcessHandover={handleProcessHandover}
        />
      </div>

      {/* Modals */}
      <SelectBookingModal
        isOpen={isSelectBookingOpen}
        onClose={() => setIsSelectBookingOpen(false)}
        onSuccess={(newTx) => {
          reloadData();
          handleOpenReceipt(newTx);
        }}
      />

      <DirectRentalModal
        isOpen={isDirectRentalOpen}
        onClose={() => setIsDirectRentalOpen(false)}
        onSuccess={(newTx) => {
          reloadData();
          handleOpenReceipt(newTx);
        }}
      />

      <SewaDetailModal
        record={selectedRecord}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenReceipt={(r) => {
          setIsDetailOpen(false);
          handleOpenReceipt(r);
        }}
        onProcessHandover={handleProcessHandover}
      />

      <PrintReceiptModal
        record={receiptRecord}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
