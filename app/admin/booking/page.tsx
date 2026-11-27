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

  const handleMarkHangus = (booking: BookingRecord) => {
    let updatedBooking: BookingRecord | null = null;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === booking.id) {
          updatedBooking = {
            ...b,
            status: "hangus",
            dpStatus: b.dpNominal > 0 ? "hangus" : b.dpStatus,
            riwayat: [
              {
                waktu: "Hari Ini, Baru Saja",
                user: "Admin",
                aksi: "Booking Dinyatakan Hangus",
                catatan: "Melewati batas toleransi pengambilan operasional tanpa konfirmasi (§E.12). DP dicatat sebagai penerimaan hangus dan stok dilepaskan.",
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
    setIsDetailOpen(false);
    showToast(`Booking ${booking.kode} berhasil ditandai Hangus. Stok telah dilepaskan kembali.`, "warning");
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
        onMarkHangus={handleMarkHangus}
      />

      {/* 2. Cancellation Dialog with Reason */}
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
