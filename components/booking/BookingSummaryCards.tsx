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
  const confirmedCount = bookings.filter((b) => b.status === "dikonfirmasi").length;
  const doneCount = bookings.filter((b) => b.status === "selesai").length;
  const dpPendingCount = bookings.filter(
    (b) => b.status !== "dibatalkan" && b.status !== "selesai" && b.dpStatus === "belum"
  ).length;
  const dpActiveCount = bookings.filter(
    (b) => b.status === "dikonfirmasi" && b.dpStatus === "lunas"
  ).length;

  if (role === "admin") {
    return (
      <div className="booking-summary-grid">
        {/* 1. Draft */}
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

        {/* 2. Dikonfirmasi */}
        <div className="booking-summary-card accent-confirmed">
          <div className="bsc-top">
            <span className="bsc-label">Dikonfirmasi</span>
            <div className="bsc-icon-wrap green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <div className="bsc-value">{confirmedCount}</div>
          <div className="bsc-sub">Menunggu jadwal pengambilan</div>
        </div>

        {/* 3. Selesai (jadi transaksi) */}
        <div className="booking-summary-card accent-done">
          <div className="bsc-top">
            <span className="bsc-label">Selesai (jadi transaksi)</span>
            <div className="bsc-icon-wrap blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <div className="bsc-value">{doneCount}</div>
          <div className="bsc-sub">Berhasil diserahkan ke pelanggan</div>
        </div>

        {/* 4. DP belum diterima */}
        <div className="booking-summary-card accent-warning">
          <div className="bsc-top">
            <span className="bsc-label">DP belum diterima</span>
            <div className="bsc-icon-wrap amber">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <div className="bsc-value">{dpPendingCount}</div>
          <div className="bsc-sub">Perlu konfirmasi pembayaran DP 25%</div>
        </div>
      </div>
    );
  }

  // Owner View
  return (
    <div className="booking-summary-grid">
      {/* 1. Draft */}
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
        <div className="bsc-sub">Pencatatan awal WhatsApp / toko</div>
      </div>

      {/* 2. Dikonfirmasi */}
      <div className="booking-summary-card accent-confirmed">
        <div className="bsc-top">
          <span className="bsc-label">Dikonfirmasi</span>
          <div className="bsc-icon-wrap green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>
        <div className="bsc-value">{confirmedCount}</div>
        <div className="bsc-sub">Reservasi aktif & stok teralokasi</div>
      </div>

      {/* 3. Selesai */}
      <div className="booking-summary-card accent-done">
        <div className="bsc-top">
          <span className="bsc-label">Selesai</span>
          <div className="bsc-icon-wrap blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <div className="bsc-value">{doneCount}</div>
        <div className="bsc-sub">Telah menjadi transaksi sewa</div>
      </div>

      {/* 4. DP diterima (aktif) */}
      <div className="booking-summary-card accent-confirmed">
        <div className="bsc-top">
          <span className="bsc-label">DP diterima (aktif)</span>
          <div className="bsc-icon-wrap green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
        </div>
        <div className="bsc-value">{dpActiveCount}</div>
        <div className="bsc-sub">Uang muka aktif terverifikasi</div>
      </div>
    </div>
  );
}
