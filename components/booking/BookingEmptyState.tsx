// components/booking/BookingEmptyState.tsx
import React from "react";

interface BookingEmptyStateProps {
  onResetFilters?: () => void;
  message?: string;
}

export function BookingEmptyState({
  onResetFilters,
  message = "Tidak ada data booking yang sesuai dengan kriteria pencarian dan filter Anda.",
}: BookingEmptyStateProps) {
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        color: "var(--n600)",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "var(--n100)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--n400)",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
      <div>
        <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700, color: "var(--k)" }}>
          Data Booking Tidak Ditemukan
        </h3>
        <p style={{ margin: 0, fontSize: "13px", maxWidth: "420px" }}>{message}</p>
      </div>
      {onResetFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="btn sm"
          style={{ marginTop: "4px" }}
        >
          Reset Filter &amp; Pencarian
        </button>
      )}
    </div>
  );
}
