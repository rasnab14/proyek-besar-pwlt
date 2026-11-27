// components/transaksi-jual/JualFilterBar.tsx
"use client";

import React from "react";
import { JualFilterState } from "./types";

interface JualFilterBarProps {
  filters: JualFilterState;
  onFilterChange: (newFilters: Partial<JualFilterState>) => void;
}

export function JualFilterBar({ filters, onFilterChange }: JualFilterBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "#FFFFFF",
        padding: "10px 14px",
        borderRadius: "10px",
        border: "1px solid #E2E8F0",
        flexWrap: "wrap",
      }}
    >
      {/* Search Input */}
      <div style={{ flex: 1, minWidth: "240px", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Cari kode transaksi atau pelanggan..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: "13px",
            color: "#0F172A",
          }}
        />
      </div>

      {/* Filter Status */}
      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ status: e.target.value as JualFilterState["status"] })}
        style={{
          border: "1px solid #CBD5E1",
          borderRadius: "6px",
          padding: "6px 10px",
          fontSize: "12.5px",
          color: "#334155",
          background: "#FFFFFF",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="semua">Semua status</option>
        <option value="selesai">Selesai (Lunas)</option>
        <option value="dibatalkan">Dibatalkan</option>
      </select>

      {/* Filter Metode Pembayaran */}
      <select
        value={filters.metode}
        onChange={(e) => onFilterChange({ metode: e.target.value as JualFilterState["metode"] })}
        style={{
          border: "1px solid #CBD5E1",
          borderRadius: "6px",
          padding: "6px 10px",
          fontSize: "12.5px",
          color: "#334155",
          background: "#FFFFFF",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="semua">Semua pembayaran</option>
        <option value="tunai">Tunai</option>
        <option value="qris">QRIS</option>
        <option value="transfer">Transfer</option>
      </select>

      {/* Date Range Display */}
      <div
        style={{
          fontSize: "12.5px",
          color: "#64748B",
          padding: "6px 10px",
          background: "#F8FAFC",
          borderRadius: "6px",
          border: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>{filters.dateRange}</span>
      </div>
    </div>
  );
}
