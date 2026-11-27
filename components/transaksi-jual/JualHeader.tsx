// components/transaksi-jual/JualHeader.tsx
"use client";

import React from "react";
import Link from "next/link";

interface JualHeaderProps {
  role?: "admin" | "owner";
}

export function JualHeader({ role = "admin" }: JualHeaderProps) {
  if (role === "owner") {
    return (
      <div className="tx-header-wrap">
        <div className="tx-header-left">
          <span className="tx-breadcrumb">OWNER / MONITORING TRANSAKSI / PENJUALAN</span>
          <h1 className="tx-title">Monitoring Transaksi Penjualan</h1>
          <p className="tx-subtitle">
            Pemantauan transaksi penjualan barang retail tanpa mengubah data operasional.
          </p>
          <div className="tx-owner-tabs">
            <Link href="/owner/transaksi/sewa" className="tx-tab-item">
              Penyewaan
            </Link>
            <span className="tx-tab-item active">Penjualan</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tx-header-wrap">
      <div className="tx-header-left">
        <span className="tx-breadcrumb">ADMIN / TRANSAKSI / PENJUALAN</span>
        <h1 className="tx-title">Transaksi Penjualan</h1>
        <p className="tx-subtitle">
          Penjualan barang jual; stok berkurang otomatis.
        </p>
      </div>

      <div className="tx-header-actions">
        <Link href="/admin/transaksi/jual/baru" className="tx-btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Transaksi penjualan
        </Link>
      </div>
    </div>
  );
}
