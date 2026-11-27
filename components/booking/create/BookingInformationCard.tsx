// components/booking/create/BookingInformationCard.tsx
"use client";

import React, { useState } from "react";
import { CustomerData } from "./types";
import { NewCustomerModal } from "./NewCustomerModal";

function formatDateShort(dateStr: string): string {
  if (!dateStr) return "-";
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${d} ${months[m - 1]} ${y}`;
}

interface BookingInformationCardProps {
  bookingCode?: string;
  customers: CustomerData[];
  selectedCustomer: CustomerData | null;
  onSelectCustomer: (customer: CustomerData) => void;
  onAddCustomer: (customer: CustomerData) => void;
  tanggalBooking: string;
  onTanggalBookingChange: (val: string) => void;
  tanggalMulaiSewa: string;
  onTanggalMulaiSewaChange: (val: string) => void;
  durasiHari: number;
  onDurasiHariChange: (val: number) => void;
  tanggalSelesaiSewa: string;
  hDiff: number;
  dateError?: string | null;
}

export function BookingInformationCard({
  bookingCode,
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddCustomer,
  tanggalBooking,
  onTanggalBookingChange,
  tanggalMulaiSewa,
  onTanggalMulaiSewaChange,
  durasiHari,
  onDurasiHariChange,
  tanggalSelesaiSewa,
  hDiff,
  dateError,
}: BookingInformationCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewCustModalOpen, setIsNewCustModalOpen] = useState(false);

  // Filter customers matching search
  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return c.nama.toLowerCase().includes(q) || c.telepon.includes(q);
  });

  return (
    <div className="bc-card">
      <div className="bc-card-header">
        <h2 className="bc-card-title">Informasi booking</h2>
        <span className="bc-code-badge">{bookingCode || "BK-0451"}</span>
      </div>

      {/* Customer Field */}
      <div>
        <label className="bc-form-label">Pelanggan</label>
        <div className="bc-customer-search-row">
          <input
            type="text"
            className="bc-customer-search-input"
            placeholder="Cari nama atau nomor WhatsApp pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="button"
            className="bc-new-cust-btn"
            onClick={() => setIsNewCustModalOpen(true)}
          >
            + Pelanggan baru
          </button>
        </div>

        {/* Customer Results List */}
        <div className="bc-customer-list">
          {filteredCustomers.slice(0, 3).map((cust) => {
            const isSelected = selectedCustomer?.id === cust.id;
            return (
              <div
                key={cust.id}
                className={`bc-customer-item ${isSelected ? "selected" : ""}`}
                onClick={() => onSelectCustomer(cust)}
              >
                <span className="bc-cust-name">
                  {isSelected && <span style={{ color: "#0284C7", marginRight: "6px" }}>✓</span>}
                  {cust.nama}
                </span>
                <span className="bc-cust-phone">{cust.telepon}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 1: Tanggal booking, Tanggal mulai sewa & Durasi sewa (§2) */}
      <div className="bc-date-duration-row">
        <div className="bc-field-col">
          <label className="bc-form-label">Tanggal booking</label>
          <input
            type="date"
            className="bc-date-input"
            value={tanggalBooking}
            onChange={(e) => onTanggalBookingChange(e.target.value)}
            title="Pilih tanggal kesepakatan pemesanan booking"
            suppressHydrationWarning
          />
        </div>

        <div className="bc-field-col">
          <label className="bc-form-label">Tanggal mulai sewa</label>
          <input
            type="date"
            className={`bc-date-input ${dateError ? "input-error" : ""}`}
            value={tanggalMulaiSewa}
            onChange={(e) => onTanggalMulaiSewaChange(e.target.value)}
            title="Pilih rencana tanggal mulai sewa barang"
            suppressHydrationWarning
          />
        </div>

        <div className="bc-field-col">
          <label className="bc-form-label">Durasi sewa</label>
          <div className="bc-duration-field">
            <input
              type="number"
              min={1}
              className="bc-date-input"
              value={durasiHari}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onDurasiHariChange(isNaN(val) || val < 1 ? 1 : val);
              }}
              title="Masukkan durasi sewa dalam hari"
              suppressHydrationWarning
            />
            <span className="bc-duration-suffix">hari</span>
          </div>
        </div>
      </div>

      {/* Row 2: Tanggal selesai sewa (otomatis) sesuai Screenshot Referensi (§2 & §3) */}
      <div className="bc-end-date-section">
        <span className="bc-end-date-label">Tanggal selesai sewa (otomatis)</span>
        <div className="bc-end-date-value" suppressHydrationWarning>
          {formatDateShort(tanggalSelesaiSewa)}
        </div>
      </div>

      {/* Date Validation Alert if Tanggal Mulai Sewa < Tanggal Booking */}
      {dateError && (
        <div className="bc-date-error-banner">
          <span>⚠️</span>
          <span>{dateError}</span>
        </div>
      )}

      {/* Notice Banner - Rapi, menyatu, tanpa stretched flex spacing */}
      <div className="bc-dp-notice-banner">
        {hDiff >= 2 ? (
          <>
            Sistem mendeteksi booking <strong>H-{hDiff}</strong> sebelum tanggal mulai sewa/pengambilan. Sesuai regulasi perusahaan, <strong>wajib DP sebesar 25%</strong> dari total biaya penyewaan. Pembayaran pelunasan diselesaikan saat pengambilan barang di toko.
          </>
        ) : (
          <>
            Sistem mendeteksi booking <strong>{hDiff === 1 ? "H-1" : "Hari-H"}</strong> sebelum tanggal mulai sewa. Sesuai regulasi perusahaan, <strong>DP tidak wajib (Rp 0)</strong>. Pembayaran penuh dapat diselesaikan saat serah terima barang di toko.
          </>
        )}
      </div>

      {/* New Customer Modal */}
      <NewCustomerModal
        isOpen={isNewCustModalOpen}
        onClose={() => setIsNewCustModalOpen(false)}
        onAddCustomer={(newCust) => {
          onAddCustomer(newCust);
          onSelectCustomer(newCust);
        }}
      />
    </div>
  );
}
