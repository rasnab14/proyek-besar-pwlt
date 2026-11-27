// components/transaksi/SewaHeader.tsx
"use client";

import React from "react";
import Link from "next/link";

interface SewaHeaderProps {
  role: "admin" | "owner";
  onOpenSelectBooking?: () => void;
  onOpenDirectRental?: () => void;
}

export function SewaHeader({
  role,
  onOpenSelectBooking,
  onOpenDirectRental,
}: SewaHeaderProps) {
  if (role === "owner") {
    return (
      <div className="tx-header-wrap">
        <div className="tx-header-left">
          <span className="tx-breadcrumb">OWNER / MONITORING TRANSAKSI / PENYEWAAN</span>
          <h1 className="tx-title">Monitoring Transaksi Penyewaan</h1>
          <p className="tx-subtitle">
            Pantau penyewaan berjalan tanpa mengubah data operasional.
          </p>
          <div className="tx-owner-tabs">
            <span className="tx-tab-item active">Penyewaan</span>
            <Link href="/owner/transaksi/jual" className="tx-tab-item">
              Penjualan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tx-header-wrap">
      <div className="tx-header-left">
        <span className="tx-breadcrumb">ADMIN / TRANSAKSI / PENYEWAAN</span>
        <h1 className="tx-title">Transaksi Penyewaan</h1>
        <p className="tx-subtitle">
          Dari booking atau transaksi langsung tanpa booking.
        </p>
      </div>

      <div className="tx-header-actions">
        <Link
          href="/admin/booking"
          className="tx-btn-secondary"
        >
          Dari booking
        </Link>
        {onOpenDirectRental ? (
          <button
            type="button"
            className="tx-btn-primary"
            onClick={onOpenDirectRental}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            + Transaksi langsung
          </button>
        ) : (
          <Link href="/admin/transaksi/sewa/baru" className="tx-btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            + Transaksi langsung
          </Link>
        )}
      </div>
    </div>
  );
}
