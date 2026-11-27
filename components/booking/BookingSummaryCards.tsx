// components/booking/BookingSummaryCards.tsx
"use client";

import React from "react";
import { BookingRecord } from "./types";

interface BookingSummaryCardsProps {
  role: "admin" | "owner";
  bookings: BookingRecord[];
}

export function BookingSummaryCards({
  role,
  bookings,
}: BookingSummaryCardsProps) {
  const draftCount = bookings.filter((b) => b.status === "draft").length;
  const selesaiCount = bookings.filter((b) => b.status === "selesai").length;
  const dibatalkanCount = bookings.filter((b) => b.status === "dibatalkan").length;
  const todayPickupCount = bookings.filter(
    (b) => b.status === "selesai" && Boolean(b.isTodayPickup)
  ).length;

  if (role === "admin") {
    return (
      <div className="booking-summary-grid">
        {/* 1. Selesai (Siap Transaksi) */}
        <div className="booking-summary-card accent-confirmed">
          <div className="bsc-top">
            <span className="bsc-label">Selesai (Siap Transaksi)</span>
            <div className="bsc-icon-wrap green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <div className="bsc-value">{selesaiCount}</div>
          <div className="bsc-sub">Siap diproses saat pengambilan barang</div>
        </div>

        {/* 2. Draft */}
        <div className="booking-summary-card accent-draft">
          <div className="bsc-top">
            <span className="bsc-label">Draft</span>
            <div className="bsc-icon-wrap neutral">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
          </div>
          <div className="bsc-value">{draftCount}</div>
          <div className="bsc-sub">Belum selesai dicatat admin</div>
        </div>

        {/* 3. Dibatalkan */}
        <div className="booking-summary-card" style={{ borderLeftColor: "var(--st-er)" }}>
          <div className="bsc-top">
            <span className="bsc-label">Dibatalkan</span>
            <div className="bsc-icon-wrap red">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          </div>
          <div className="bsc-value">{dibatalkanCount}</div>
          <div className="bsc-sub">Batal sewa / tidak diambil (alasan tercatat)</div>
        </div>

        {/* 4. Pengambilan Hari Ini */}
        <div className="booking-summary-card accent-done">
          <div className="bsc-top">
            <span className="bsc-label">Pengambilan Hari Ini</span>
            <div className="bsc-icon-wrap blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
          </div>
          <div className="bsc-value">{todayPickupCount}</div>
          <div className="bsc-sub">Siap serah terima &amp; pelunasan hari ini</div>
        </div>
      </div>
    );
  }

  // Owner View
  return (
    <div className="booking-summary-grid">
      {/* 1. Booking Aktif (Selesai) */}
      <div className="booking-summary-card accent-confirmed">
        <div className="bsc-top">
          <span className="bsc-label">Booking Aktif (Selesai)</span>
          <div className="bsc-icon-wrap green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <div className="bsc-value">{selesaiCount}</div>
        <div className="bsc-sub">Mengalokasikan stok untuk periode sewa</div>
      </div>

      {/* 2. Draft */}
      <div className="booking-summary-card accent-draft">
        <div className="bsc-top">
          <span className="bsc-label">Draft</span>
          <div className="bsc-icon-wrap neutral">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
        </div>
        <div className="bsc-value">{draftCount}</div>
        <div className="bsc-sub">Pemesanan belum tuntas</div>
      </div>

      {/* 3. Dibatalkan */}
      <div className="booking-summary-card" style={{ borderLeftColor: "var(--st-er)" }}>
        <div className="bsc-top">
          <span className="bsc-label">Dibatalkan (Terpisah)</span>
          <div className="bsc-icon-wrap red">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        </div>
        <div className="bsc-value">{dibatalkanCount}</div>
        <div className="bsc-sub">Tidak dihitung pendapatan sewa aktif</div>
      </div>

      {/* 4. Pengambilan Hari Ini */}
      <div className="booking-summary-card accent-done">
        <div className="bsc-top">
          <span className="bsc-label">Pengambilan Hari Ini</span>
          <div className="bsc-icon-wrap blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
        </div>
        <div className="bsc-value">{todayPickupCount}</div>
        <div className="bsc-sub">Jadwal serah terima barang hari ini</div>
      </div>
    </div>
  );
}
