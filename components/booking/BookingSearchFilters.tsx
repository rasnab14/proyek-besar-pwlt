// components/booking/BookingSearchFilters.tsx
"use client";

import React from "react";
import { BookingFilterState } from "./types";

interface BookingSearchFiltersProps {
  role: "admin" | "owner";
  filters: BookingFilterState;
  onFilterChange: (newFilters: Partial<BookingFilterState>) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export function BookingSearchFilters({
  role,
  filters,
  onFilterChange,
  onResetFilters,
  totalFiltered,
}: BookingSearchFiltersProps) {
  const isFiltered =
    Boolean(filters.searchQuery) ||
    filters.status !== "semua" ||
    Boolean(filters.pickupDate) ||
    Boolean(filters.dateRangeStart) ||
    Boolean(filters.dateRangeEnd);

  return (
    <div className="booking-filters-card">
      <div className="booking-filters-main">
        {/* Search Input */}
        <div className="booking-search-box">
          <svg
            className="booking-search-icon"
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
            className="booking-search-input"
            placeholder={
              role === "admin"
                ? "Cari kode booking, nama pelanggan, atau telepon..."
                : "Cari kode booking, pelanggan, atau no. telepon..."
            }
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          />
        </div>

        {/* Status Dropdown */}
        <div className="booking-filter-group">
          <select
            className="booking-select"
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            aria-label="Filter status booking"
          >
            <option value="semua">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="dikonfirmasi">Dikonfirmasi</option>
            <option value="selesai">Selesai</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>

          {/* Date Filter: Admin (Single Pickup Date) vs Owner (Date Range) */}
          {role === "admin" ? (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "var(--n600)", fontWeight: 500 }}>
                Pengambilan:
              </span>
              <input
                type="date"
                className="booking-date-input"
                value={filters.pickupDate}
                onChange={(e) => onFilterChange({ pickupDate: e.target.value })}
                title="Pilih tanggal pengambilan"
              />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "var(--n600)", fontWeight: 500 }}>
                Rentang:
              </span>
              <input
                type="date"
                className="booking-date-input"
                placeholder="Dari"
                value={filters.dateRangeStart || ""}
                onChange={(e) => onFilterChange({ dateRangeStart: e.target.value })}
                title="Rentang mulai"
              />
              <span style={{ fontSize: "12px", color: "var(--n400)" }}>–</span>
              <input
                type="date"
                className="booking-date-input"
                placeholder="Sampai"
                value={filters.dateRangeEnd || ""}
                onChange={(e) => onFilterChange({ dateRangeEnd: e.target.value })}
                title="Rentang akhir"
              />
            </div>
          )}

          {/* Reset button if filtered */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="btn sm"
              style={{ color: "var(--st-er-t)", borderColor: "var(--st-er-bg)" }}
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Quick Filter Chips & Results Count */}
      <div className="booking-filter-chips">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "var(--n600)" }}>Filter cepat:</span>
          <div className="booking-quick-tabs">
            <button
              type="button"
              className={`booking-quick-tab ${filters.status === "semua" ? "active" : ""}`}
              onClick={() => onFilterChange({ status: "semua" })}
            >
              Semua
            </button>
            <button
              type="button"
              className={`booking-quick-tab ${filters.status === "draft" ? "active" : ""}`}
              onClick={() => onFilterChange({ status: "draft" })}
            >
              Draft
            </button>
            <button
              type="button"
              className={`booking-quick-tab ${filters.status === "dikonfirmasi" ? "active" : ""}`}
              onClick={() => onFilterChange({ status: "dikonfirmasi" })}
            >
              Dikonfirmasi
            </button>
            <button
              type="button"
              className={`booking-quick-tab ${filters.status === "selesai" ? "active" : ""}`}
              onClick={() => onFilterChange({ status: "selesai" })}
            >
              Selesai
            </button>
          </div>
        </div>

        <div>
          Menampilkan <strong style={{ color: "var(--k)" }}>{totalFiltered}</strong> data booking
        </div>
      </div>
    </div>
  );
}
