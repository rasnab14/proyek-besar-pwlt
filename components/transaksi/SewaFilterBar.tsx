// components/transaksi/SewaFilterBar.tsx
"use client";

import React from "react";
import { SewaFilterState } from "./types";

interface SewaFilterBarProps {
  role: "admin" | "owner";
  filters: SewaFilterState;
  onFilterChange: (newFilters: Partial<SewaFilterState>) => void;
}

export function SewaFilterBar({ role, filters, onFilterChange }: SewaFilterBarProps) {
  return (
    <div className="tx-filter-card">
      {/* Search Input */}
      <div className="tx-search-wrap">
        <svg
          className="tx-search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="tx-search-input"
          placeholder="Cari kode transaksi atau pelanggan"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
        />
      </div>

      {/* Status Filter */}
      <select
        className="tx-select"
        value={filters.status}
        onChange={(e) => onFilterChange({ status: e.target.value })}
      >
        <option value="semua">Semua status</option>
        <option value="belum_lunas">Belum Lunas</option>
        <option value="lunas">Lunas</option>
      </select>

      {/* Date Range Badge */}
      <div className="tx-date-badge">
        1 – 30 Nov 2026
      </div>
    </div>
  );
}
