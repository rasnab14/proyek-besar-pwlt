// app/owner/booking/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import "@/components/booking/booking.css";
import {
  BookingRecord,
  BookingFilterState,
  INITIAL_BOOKINGS,
  BookingPageHeader,
  BookingSummaryCards,
  BookingSearchFilters,
  BookingDataTable,
  BookingPagination,
  BookingEmptyState,
  BookingDetailModal,
  BookingCancellationDialog,
} from "@/components/booking";

export default function OwnerBookingMonitoringPage() {
  // ─── Data State (Local Frontend State) ───
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);

  // ─── Filter State ───
  const [filters, setFilters] = useState<BookingFilterState>({
    searchQuery: "",
    status: "semua",
    pickupDate: "",
    dateRangeStart: "",
    dateRangeEnd: "",
  });

  // ─── Pagination State ───
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ─── Modals State ───
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<BookingRecord | null>(null);

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

      // 3. Date Range Filter
      if (filters.dateRangeStart && b.tanggalPengambilan < filters.dateRangeStart) {
        return false;
      }
      if (filters.dateRangeEnd && b.tanggalPengambilan > filters.dateRangeEnd) {
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
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      status: "semua",
      pickupDate: "",
      dateRangeStart: "",
      dateRangeEnd: "",
    });
    setCurrentPage(1);
  };

  // ─── Actions Handlers ───
  const handleOpenDetail = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const handleStartCancel = (booking: BookingRecord) => {
    setIsDetailOpen(false);
    setCancellingBooking(booking);
  };

  const handleConfirmCancel = (bookingId: string, alasan: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: "dibatalkan",
            dpStatus: b.dpNominal > 0 ? "hangus" : b.dpStatus,
            alasanPembatalan: alasan,
            waktuPembatalan: "Hari Ini, Baru Saja",
            userPembatalan: "Owner / Pimpinan",
            riwayat: [
              ...b.riwayat,
              {
                waktu: "Hari Ini, Baru Saja",
                user: "Owner",
                aksi: "Booking Dibatalkan oleh Owner",
                catatan: `Alasan: ${alasan}. DP hangus: Rp ${b.dpNominal.toLocaleString()}`,
              },
            ],
          };
        }
        return b;
      })
    );

    setCancellingBooking(null);
    showToast(`Booking berhasil dibatalkan oleh Owner dengan alasan tercatat.`, "danger");
  };

  return (
    <div className="main">
      <div className="booking-page-container">
        {/* 1. Page Header (Owner Monitoring) */}
        <BookingPageHeader role="owner" />

        {/* 2. Summary Cards (Owner: Draft, Dikonfirmasi, Selesai, DP diterima aktif) */}
        <BookingSummaryCards role="owner" bookings={bookings} />

        {/* 3. Search and Date Range Filters Bar */}
        <BookingSearchFilters
          role="owner"
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalFiltered={filteredBookings.length}
        />

        {/* 4. Booking Monitoring Table Card */}
        <div className="booking-table-card">
          <div className="booking-table-header">
            <div>
              <h2 className="bth-title">Data Monitoring Reservasi Sewa</h2>
              <div className="bth-sub">
                Pemantauan reservasi sewa dan jadwal pengambilan barang operasional toko.
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="b in" style={{ fontSize: "12px" }}>
                Mode: Hanya Lihat
              </span>
              {filteredBookings.length > 0 && (
                <span className="b nu" style={{ fontSize: "12px" }}>
                  {filteredBookings.length} Data
                </span>
              )}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <BookingEmptyState onResetFilters={handleResetFilters} />
          ) : (
            <>
              <BookingDataTable
                role="owner"
                bookings={paginatedBookings}
                onViewDetail={handleOpenDetail}
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
      {/* 1. Detail Modal (Owner Read-Only with Cancel Action) */}
      <BookingDetailModal
        role="owner"
        booking={selectedBooking}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedBooking(null);
        }}
        onCancelBooking={handleStartCancel}
      />

      {/* 2. Cancellation Dialog with Required Reason */}
      <BookingCancellationDialog
        booking={cancellingBooking}
        isOpen={Boolean(cancellingBooking)}
        onClose={() => setCancellingBooking(null)}
        onConfirmCancel={handleConfirmCancel}
      />

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
