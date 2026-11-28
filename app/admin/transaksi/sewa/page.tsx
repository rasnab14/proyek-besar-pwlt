// app/admin/transaksi/sewa/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import "@/components/transaksi/transaksi.css";
import {
  TransaksiSewaRecord,
  SewaFilterState,
  getStoredTransaksiSewa,
  saveOrUpdateTransaksiSewa,
  deleteTransaksiSewa,
  SewaHeader,
  SewaSummaryCards,
  SewaFilterBar,
  SewaTableAdmin,
  SelectBookingModal,
  DirectRentalModal,
  SewaDetailModal,
  PrintReceiptModal,
  HandoverModal,
} from "@/components/transaksi";

export default function AdminTransaksiSewaPage() {
  const [records, setRecords] = useState<TransaksiSewaRecord[]>([]);
  const [filters, setFilters] = useState<SewaFilterState>({
    searchQuery: "",
    status: "semua",
    dateRange: "1 – 30 Nov 2026",
  });

  // Modal states
  const router = useRouter();
  const [isSelectBookingOpen, setIsSelectBookingOpen] = useState(false);
  const [isDirectRentalOpen, setIsDirectRentalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TransaksiSewaRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [receiptRecord, setReceiptRecord] = useState<TransaksiSewaRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [handoverRecord, setHandoverRecord] = useState<TransaksiSewaRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<TransaksiSewaRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

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
    setHandoverRecord(r);
  };

  const handleEditRecord = (r: TransaksiSewaRecord) => {
    if (r.statusPengambilan === "sudah_diambil") {
      showToast("Transaksi yang sudah serah terima tidak dapat diubah.", "error");
      return;
    }
    // Sesuai Ketentuan Poin 2: Transaksi dari booking harus menggunakan form Booking yang sama
    if (r.tipeAsal === "booking") {
      router.push(`/admin/booking/baru?id=${r.bookingId || r.id}&transaksiId=${r.id}`);
    } else {
      router.push(`/admin/transaksi/sewa/baru?id=${r.id}`);
    }
  };

  const handleDeleteRecord = (r: TransaksiSewaRecord) => {
    if (r.statusPengambilan === "sudah_diambil") {
      showToast("Transaksi yang sudah serah terima tidak dapat dihapus.", "error");
      return;
    }
    setDeletingRecord(r);
  };

  const confirmDeleteRecord = () => {
    if (!deletingRecord) return;
    const res = deleteTransaksiSewa(deletingRecord.id);
    if (res.success) {
      showToast(`Transaksi ${deletingRecord.kode} berhasil dihapus dan stok barang telah dikembalikan.`, "success");
      reloadData();
    } else {
      showToast(res.message || "Gagal menghapus transaksi.", "error");
    }
    setDeletingRecord(null);
  };

  return (
    <div className="main">
      <div className="tx-page-container">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              zIndex: 99999,
              padding: "12px 18px",
              borderRadius: "8px",
              background: toastMessage.type === "success" ? "#065F46" : "#991B1B",
              color: "#FFFFFF",
              fontSize: "13.5px",
              fontWeight: 600,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>{toastMessage.type === "success" ? "✓" : "⚠"}</span>
            <span>{toastMessage.text}</span>
          </div>
        )}

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

        {/* Admin Data Table with Dynamic Actions (§F.1) */}
        <SewaTableAdmin
          records={filteredRecords}
          onSelectRecord={handleOpenDetail}
          onPrintReceipt={handleOpenReceipt}
          onProcessHandover={handleProcessHandover}
          onEditRecord={handleEditRecord}
          onDeleteRecord={handleDeleteRecord}
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

      {/* Formulir Serah Terima & Pelunasan Sewa */}
      <HandoverModal
        isOpen={Boolean(handoverRecord)}
        record={handoverRecord}
        onClose={() => setHandoverRecord(null)}
        onSuccess={(updated) => {
          reloadData();
          handleOpenReceipt(updated);
        }}
      />

      {/* Modal Konfirmasi Hapus Transaksi Sewa (§F.1.A & §F.1.D) */}
      {deletingRecord && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "16px",
          }}
          onClick={() => setDeletingRecord(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "440px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "#FEE2E2",
                  color: "#DC2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
                  Hapus Transaksi Sewa?
                </h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#64748B" }}>
                  Kode: {deletingRecord.kode} ({deletingRecord.pelanggan.nama})
                </p>
              </div>
            </div>
            <p style={{ margin: "0 0 20px 0", fontSize: "13.5px", color: "#334155", lineHeight: "1.5" }}>
              Apakah Anda yakin ingin menghapus transaksi sewa <strong>{deletingRecord.kode}</strong>? Stok produk yang dialokasikan akan <strong>otomatis dikembalikan</strong> ke ketersediaan toko.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setDeletingRecord(null)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E1",
                  background: "#F8FAFC",
                  color: "#334155",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteRecord}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#DC2626",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Ya, Hapus Transaksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
