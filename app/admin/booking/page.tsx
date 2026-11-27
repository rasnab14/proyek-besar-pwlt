// app/admin/booking/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import "@/components/booking/booking.css";
import {
  BookingRecord,
  BookingFilterState,
  INITIAL_BOOKINGS,
  getStoredBookings,
  saveOrUpdateBooking,
  deleteBookingFromStore,
  BookingPageHeader,
  BookingSummaryCards,
  BookingSearchFilters,
  BookingDataTable,
  BookingPagination,
  BookingEmptyState,
  BookingDetailModal,
  BookingCancellationDialog,
} from "@/components/booking";

export default function AdminBookingPage() {
  const router = useRouter();

  // ─── Data State (Synced with Shared Booking Store) ───
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);

  useEffect(() => {
    setBookings(getStoredBookings());
    const handleUpdate = () => {
      setBookings(getStoredBookings());
    };
    window.addEventListener("summit_bookings_updated", handleUpdate);
    return () => window.removeEventListener("summit_bookings_updated", handleUpdate);
  }, []);

  // ─── Filter State ───
  const [filters, setFilters] = useState<BookingFilterState>({
    searchQuery: "",
    status: "semua",
    pickupDate: "",
  });

  // ─── Pagination State ───
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ─── Modals State ───
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<BookingRecord | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<BookingRecord | null>(null);

  // ─── Toast Feedback ───
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "danger" } | null>(null);

  const showToast = (message: string, type: "success" | "warning" | "danger" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Filtering Logic ───
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Search Query (kode, nama pelanggan, no telepon)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchCode = b.kode.toLowerCase().includes(query);
        const matchName = b.pelanggan.nama.toLowerCase().includes(query);
        const matchPhone = b.pelanggan.telepon.toLowerCase().includes(query);
        if (!matchCode && !matchName && !matchPhone) return false;
      }

      // 2. Status Filter
      if (filters.status !== "semua" && b.status !== filters.status) {
        return false;
      }

      // 3. Pickup Date Filter
      if (filters.pickupDate && b.tanggalPengambilan !== filters.pickupDate) {
        return false;
      }

      return true;
    });
  }, [bookings, filters]);

  // ─── Pagination Logic ───
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  const handleFilterChange = (newFilters: Partial<BookingFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      status: "semua",
      pickupDate: "",
    });
    setCurrentPage(1);
  };

  // ─── Actions Handlers ───
  const handleOpenDetail = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const handleOpenCreate = () => {
    router.push("/admin/booking/baru");
  };

  const handleOpenEdit = (booking: BookingRecord) => {
    router.push(`/admin/booking/baru?id=${booking.id}`);
  };

  const handleConfirmDraft = (booking: BookingRecord) => {
    const updated: BookingRecord = {
      ...booking,
      status: "selesai",
      dpStatus: "lunas",
      dpMetode: booking.dpMetode || "qris",
      riwayat: [
        {
          waktu: "Hari Ini, Baru Saja",
          user: "Admin",
          aksi: "Booking Disepakati (Selesai)",
          catatan: "Status draft diubah menjadi booking Selesai resmi (siap diproses ke Transaksi Sewa).",
        },
        ...booking.riwayat,
      ],
    };

    saveOrUpdateBooking(updated);
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
    setIsDetailOpen(false);
    showToast(`Booking ${booking.kode} berhasil disepakati dan berstatus Selesai!`, "success");
  };

  const handleStartCancel = (booking: BookingRecord) => {
    setIsDetailOpen(false);
    setCancellingBooking(booking);
  };

  const handleConfirmCancel = (bookingId: string, alasan: string) => {
    let updatedBooking: BookingRecord | null = null;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            status: "dibatalkan",
            dpStatus: b.dpNominal > 0 ? "hangus" : b.dpStatus,
            alasanPembatalan: alasan,
            waktuPembatalan: "Hari Ini, Baru Saja",
            userPembatalan: "Admin",
            riwayat: [
              {
                waktu: "Hari Ini, Baru Saja",
                user: "Admin",
                aksi: "Booking Dibatalkan",
                catatan: `Alasan: ${alasan}. DP hangus: Rp ${b.dpNominal.toLocaleString()}`,
              },
              ...b.riwayat,
            ],
          };
          return updatedBooking;
        }
        return b;
      })
    );
    if (updatedBooking) {
      saveOrUpdateBooking(updatedBooking);
    }
    setCancellingBooking(null);
    showToast(`Booking berhasil dibatalkan. DP dicatat sebagai hangus sesuai SOP.`, "danger");
  };

  const handleConfirmDelete = () => {
    if (!deletingBooking) return;
    deleteBookingFromStore(deletingBooking.id);
    setBookings((prev) => prev.filter((b) => b.id !== deletingBooking.id));
    showToast(`Data booking ${deletingBooking.kode} berhasil dihapus.`, "success");
    setDeletingBooking(null);
  };

  return (
    <div className="main">
      <div className="booking-page-container">
        {/* 1. Header */}
        <BookingPageHeader role="admin" onCreateBooking={handleOpenCreate} />

        {/* 2. Summary Cards */}
        <BookingSummaryCards role="admin" bookings={bookings} />

        {/* 3. Search and Filters Bar */}
        <BookingSearchFilters
          role="admin"
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalFiltered={filteredBookings.length}
        />

        {/* 4. Booking Data Table Card */}
        <div className="booking-table-card">
          <div className="booking-table-header">
            <div>
              <h2 className="bth-title">Daftar Booking Masuk</h2>
              <div className="bth-sub">
                Kelola pemesanan aktif, konfirmasi kesepakatan, dan serah terima barang sewa.
              </div>
            </div>
            {filteredBookings.length > 0 && (
              <span className="b in" style={{ fontSize: "12px" }}>
                {filteredBookings.length} Total Data
              </span>
            )}
          </div>

          {filteredBookings.length === 0 ? (
            <BookingEmptyState onResetFilters={handleResetFilters} />
          ) : (
            <>
              <BookingDataTable
                role="admin"
                bookings={paginatedBookings}
                onViewDetail={handleOpenDetail}
                onEditBooking={handleOpenEdit}
                onDeleteBooking={(b) => setDeletingBooking(b)}
                onCancelBooking={handleStartCancel}
              />
              <BookingPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredBookings.length}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </div>
      </div>

      {/* ─── Modals ─── */}
      {/* 1. Detail Modal */}
      <BookingDetailModal
        role="admin"
        booking={selectedBooking}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedBooking(null);
        }}
        onEditBooking={handleOpenEdit}
        onConfirmBooking={handleConfirmDraft}
        onCancelBooking={handleStartCancel}
      />

      {/* 2. Cancellation Dialog with Reason */}
      <BookingCancellationDialog
        booking={cancellingBooking}
        isOpen={Boolean(cancellingBooking)}
        onClose={() => setCancellingBooking(null)}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* 3. Delete Confirmation Dialog */}
      {deletingBooking && (
        <div className="modal-overlay" onClick={() => setDeletingBooking(null)}>
          <div
            className="modal-container"
            style={{ maxWidth: "460px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#FEE2E2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="modal-title" style={{ fontSize: "16px" }}>Hapus Data Booking</h3>
                  <div style={{ fontSize: "12px", color: "var(--n600)" }}>{deletingBooking.kode}</div>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setDeletingBooking(null)}>✕</button>
            </div>

            <div className="modal-body" style={{ padding: "16px 20px" }}>
              <p style={{ margin: "0 0 10px 0", fontSize: "13.5px", color: "#334155" }}>
                Hapus booking <b>{deletingBooking.kode}</b> ({deletingBooking.pelanggan.nama})?
              </p>
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "6px", padding: "8px 12px", fontSize: "12px", color: "#991B1B" }}>
                Alokasi stok barang yang dipesan akan otomatis dilepaskan.
              </div>
            </div>

            <div className="modal-footer" style={{ padding: "12px 20px" }}>
              <button
                type="button"
                className="btn sm"
                onClick={() => setDeletingBooking(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn sm dng"
                onClick={handleConfirmDelete}
                style={{ background: "#DC2626", color: "#FFFFFF", border: "none" }}
              >
                Ya, Hapus Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toast Feedback ─── */}
      {toast && (
        <div className={`booking-toast ${toast.type}`}>
          <span>
            {toast.type === "success" && "✓ "}
            {toast.type === "warning" && "⚠️ "}
            {toast.type === "danger" && "✕ "}
          </span>
          {toast.message}
        </div>
      )}
    </div>
  );
}
