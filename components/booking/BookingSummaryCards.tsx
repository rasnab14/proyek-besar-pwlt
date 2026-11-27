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
  const selesaiCount = bookings.filter((b) => b.status === "selesai" || b.status === "dikonfirmasi").length;
  const hangusCount = bookings.filter((b) => b.status === "hangus").length;
  const dibatalkanCount = bookings.filter((b) => b.status === "dibatalkan").length;

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

        {/* 3. Hangus */}
        <div className="booking-summary-card accent-warning">
          <div className="bsc-top">
            <span className="bsc-label">Hangus</span>
            <div className="bsc-icon-wrap amber">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <div className="bsc-value">{hangusCount}</div>
          <div className="bsc-sub">Tidak diambil lewat batas waktu</div>
        </div>

        {/* 4. Dibatalkan */}
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
          <div className="bsc-sub">Dibatalkan dengan alasan tercatat</div>
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

      {/* 3. Hangus */}
      <div className="booking-summary-card accent-warning">
        <div className="bsc-top">
          <span className="bsc-label">Hangus (Terpisah)</span>
          <div className="bsc-icon-wrap amber">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>
        <div className="bsc-value">{hangusCount}</div>
        <div className="bsc-sub">Tidak dihitung pendapatan sewa aktif</div>
      </div>

      {/* 4. Dibatalkan */}
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
    </div>
  );
}
