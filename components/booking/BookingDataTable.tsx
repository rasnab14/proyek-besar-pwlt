// components/booking/BookingDataTable.tsx
"use client";

import React from "react";
import Link from "next/link";
import { BookingRecord } from "./types";
import { BookingStatusBadge, DPStatusBadge } from "./BookingStatusBadge";
import { formatRupiah, formatTanggal } from "@/lib/format";

interface BookingDataTableProps {
  role: "admin" | "owner";
  bookings: BookingRecord[];
  onViewDetail: (booking: BookingRecord) => void;
  onEditBooking?: (booking: BookingRecord) => void;
  onDeleteBooking?: (booking: BookingRecord) => void;
  onConfirmBooking?: (booking: BookingRecord) => void;
  onCancelBooking?: (booking: BookingRecord) => void;
  onProcessRental?: (booking: BookingRecord) => void;
}

export function BookingDataTable({
  role,
  bookings,
  onViewDetail,
  onEditBooking,
  onDeleteBooking,
  onCancelBooking,
  onProcessRental,
}: BookingDataTableProps) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: "110px" }}>Kode</th>
            <th>Pelanggan</th>
            <th>Barang / Paket</th>
            <th>Pengambilan</th>
            {role === "admin" && <th>Periode Sewa</th>}
            <th className="tar">Total</th>
            <th className="tar">DP</th>
            <th style={{ textAlign: "center" }}>Status</th>
            <th className="tar" style={{ width: role === "admin" ? "180px" : "100px" }}>
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const firstItem = booking.items[0];
            const otherItemsCount = booking.items.length - 1;

            return (
              <tr key={booking.id}>
                {/* 1. Kode */}
                <td>
                  <button
                    type="button"
                    onClick={() => onViewDetail(booking)}
                    className="booking-code-pill"
                    title="Lihat detail booking"
                  >
                    {booking.kode}
                  </button>
                </td>

                {/* 2. Pelanggan */}
                <td>
                  <div className="customer-cell">
                    <span className="customer-name">{booking.pelanggan.nama}</span>
                    <span className="customer-phone">{booking.pelanggan.telepon}</span>
                  </div>
                </td>

                {/* 3. Barang / Paket */}
                <td>
                  <div className="items-preview">
                    {firstItem && (
                      <span
                        className={`item-chip ${firstItem.tipe === "paket" ? "pkg" : ""}`}
                        title={firstItem.nama}
                      >
                        {firstItem.tipe === "paket" ? "📦 " : "⛺ "}
                        {firstItem.nama} ({firstItem.jumlah}x)
                      </span>
                    )}
                    {otherItemsCount > 0 && (
                      <span
                        style={{ fontSize: "11px", color: "var(--n600)" }}
                      >
                        +{otherItemsCount} barang lainnya
                      </span>
                    )}
                  </div>
                </td>

                {/* 4. Pengambilan */}
                <td>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 600, color: "var(--k)" }}>
                      {formatTanggal(booking.tanggalPengambilan)}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--n600)" }}>
                      {booking.jamPengambilan}
                    </span>
                    {booking.isTodayPickup && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#B45309",
                          background: "#FEF3C7",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          marginTop: "2px",
                          width: "fit-content",
                        }}
                      >
                        Hari Ini
                      </span>
                    )}
                  </div>
                </td>

                {/* 5. Periode Sewa (Admin Only) */}
                {role === "admin" && (
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600, color: "var(--k)" }}>
                        {booking.durasiHari} Hari
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--n600)" }}>
                        s/d {formatTanggal(booking.tanggalPengembalian)}
                      </span>
                    </div>
                  </td>
                )}

                {/* 6. Total */}
                <td className="tar" style={{ fontWeight: 700, color: "var(--k)" }}>
                  {formatRupiah(booking.totalBiaya)}
                </td>

                {/* 7. DP */}
                <td className="tar">
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span style={{ fontWeight: 600, color: "var(--k)" }}>
                      {formatRupiah(booking.dpNominal)}
                    </span>
                    <DPStatusBadge status={booking.dpStatus} />
                  </div>
                </td>

                {/* 8. Status */}
                <td style={{ textAlign: "center" }}>
                  <BookingStatusBadge status={booking.status} />
                </td>

                {/* 9. Aksi */}
                <td className="tar">
                  <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                    {role === "admin" ? (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        {/* 1. Detail */}
                        <button
                          type="button"
                          onClick={() => onViewDetail(booking)}
                          style={{
                            background: "#F8FAFC",
                            border: "1px solid #CBD5E1",
                            borderRadius: "6px",
                            padding: "5px 9px",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#334155",
                            cursor: "pointer",
                          }}
                          title="Lihat rincian lengkap booking"
                        >
                          Detail
                        </button>

                        {/* 2. Ubah */}
                        <button
                          type="button"
                          onClick={() => onEditBooking?.(booking)}
                          style={{
                            background: "#FEF3C7",
                            border: "1px solid #FDE68A",
                            borderRadius: "6px",
                            padding: "5px 9px",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#92400E",
                            cursor: "pointer",
                          }}
                          title="Ubah data pesanan booking"
                        >
                          Ubah
                        </button>

                        {/* 3. Hapus */}
                        <button
                          type="button"
                          onClick={() => onDeleteBooking?.(booking)}
                          style={{
                            background: "#FEE2E2",
                            border: "1px solid #FECACA",
                            borderRadius: "6px",
                            padding: "5px 9px",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#DC2626",
                            cursor: "pointer",
                          }}
                          title="Hapus data booking (dengan konfirmasi)"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      /* Owner Action: Hanya tombol Detail */
                      <button
                        type="button"
                        onClick={() => onViewDetail(booking)}
                        style={{
                          background: "#F8FAFC",
                          border: "1px solid #CBD5E1",
                          borderRadius: "6px",
                          padding: "5px 9px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#334155",
                          cursor: "pointer",
                        }}
                        title="Lihat detail monitoring booking"
                      >
                        Detail
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
