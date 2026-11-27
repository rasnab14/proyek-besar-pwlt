// components/booking/BookingPagination.tsx
import React from "react";

interface BookingPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function BookingPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: BookingPaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="booking-pagination">
      <div>
        Menampilkan <strong>{startItem}</strong> – <strong>{endItem}</strong> dari{" "}
        <strong>{totalItems}</strong> data
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Halaman sebelumnya"
        >
          ‹ Sebelumnya
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`pagination-btn ${p === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Halaman berikutnya"
        >
          Berikutnya ›
        </button>
      </div>
    </div>
  );
}
