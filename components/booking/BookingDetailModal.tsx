// components/booking/BookingDetailModal.tsx
"use client";

import React from "react";
import Link from "next/link";
import { BookingRecord } from "./types";
import { BookingStatusBadge, DPStatusBadge } from "./BookingStatusBadge";
import { formatRupiah, formatTanggal } from "@/lib/format";

interface BookingDetailModalProps {
  role: "admin" | "owner";
  booking: BookingRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEditBooking?: (booking: BookingRecord) => void;
  onConfirmBooking?: (booking: BookingRecord) => void;
  onCancelBooking?: (booking: BookingRecord) => void;
  onProcessRental?: (booking: BookingRecord) => void;
}

export function BookingDetailModal({
  role,
  booking,
  isOpen,
  onClose,
  onEditBooking,
  onConfirmBooking,
  onCancelBooking,
  onProcessRental,
}: BookingDetailModalProps) {
  if (!isOpen || !booking) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-booking-title"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h2 id="modal-booking-title" className="modal-title">
              Detail Booking {booking.kode}
            </h2>
            <BookingStatusBadge status={booking.status} />
            <DPStatusBadge status={booking.dpStatus} />
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Cancellation Banner if cancelled */}
          {booking.status === "dibatalkan" && (
            <div className="note er" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                <span>✕</span> Booking Dibatalkan
              </div>
              <div>
                <strong>Alasan:</strong> {booking.alasanPembatalan || "Tidak ada rincian alasan."}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>
                Dibatalkan oleh: <strong>{booking.userPembatalan || "Pengguna Berwenang"}</strong> · {booking.waktuPembatalan}
              </div>
              <div style={{ fontSize: "12px", marginTop: "4px", color: "var(--st-er-t)" }}>
                ※ Sesuai ketentuan, booking dibatalkan tidak dapat dilanjutkan ke Transaksi Sewa. Uang muka DP sebesar {formatRupiah(booking.dpNominal)} dicatat sebagai <strong>dana yang tidak dikembalikan</strong> dan alokasi stok telah dilepaskan.
              </div>
            </div>
          )}

          {/* Section 1: Customer Information */}
          <div>
            <div className="detail-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Informasi Pelanggan
            </div>
            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span className="dii-label">Nama Lengkap</span>
                <span className="dii-val">{booking.pelanggan.nama}</span>
              </div>
              <div className="detail-info-item">
                <span className="dii-label">Nomor WhatsApp / Telepon</span>
                <span className="dii-val">{booking.pelanggan.telepon}</span>
              </div>
              <div className="detail-info-item">
                <span className="dii-label">Alamat Domisili</span>
                <span className="dii-val">{booking.pelanggan.alamat || "–"}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Rental Schedule */}
          <div>
            <div className="detail-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Jadwal &amp; Durasi Penyewaan
            </div>
            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span className="dii-label">Tanggal Booking</span>
                <span className="dii-val">
                  {booking.tanggalBooking
                    ? formatTanggal(booking.tanggalBooking, { includeDay: true })
                    : formatTanggal(booking.waktuDibuat)}
                </span>
              </div>
              <div className="detail-info-item">
                <span className="dii-label">Tanggal Mulai Sewa (Rencana)</span>
                <span className="dii-val">
                  {booking.tanggalMulaiSewa
                    ? formatTanggal(booking.tanggalMulaiSewa, { includeDay: true })
                    : booking.tanggalPengambilan
                    ? formatTanggal(booking.tanggalPengambilan, { includeDay: true })
                    : "-"}
                </span>
              </div>
              <div className="detail-info-item">
                <span className="dii-label">Durasi Sewa</span>
                <span className="dii-val" style={{ color: "var(--acc-t)" }}>
                  {booking.durasiHari} Hari
                </span>
              </div>
              <div className="detail-info-item">
                <span className="dii-label">Tanggal Selesai Sewa (Otomatis)</span>
                <span className="dii-val" style={{ color: "#0284C7", fontWeight: 600 }}>
                  {booking.tanggalSelesaiSewa
                    ? formatTanggal(booking.tanggalSelesaiSewa, { includeDay: true })
                    : booking.tanggalPengembalian
                    ? formatTanggal(booking.tanggalPengembalian, { includeDay: true })
                    : "-"}
                </span>
              </div>
              <div className="detail-info-item">
                <span className="dii-label">Pengambilan Fisik Barang</span>
                <span className="dii-val">
                  {booking.status === "selesai" ? (
                    <strong style={{ color: "var(--st-ok-t)" }}>Sudah Diambil (Transaksi Selesai)</strong>
                  ) : (
                    "Dicatat saat diproses ke Transaksi Sewa"
                  )}
                </span>
              </div>
              <div className="detail-info-item">
                <span className="dii-label">Waktu Pencatatan Sistem</span>
                <span className="dii-val" style={{ fontSize: "12px", color: "var(--n600)" }}>
                  {booking.waktuDibuat}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Ordered Items Table */}
          <div>
            <div className="detail-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              Rincian Barang &amp; Paket Sewa
            </div>
            <table className="detail-items-table">
              <thead>
                <tr>
                  <th>Nama Barang / Paket</th>
                  <th style={{ width: "90px", textAlign: "center" }}>Jumlah</th>
                  <th style={{ width: "120px", textAlign: "right" }}>Harga/Hari</th>
                  <th style={{ width: "130px", textAlign: "right" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {booking.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontWeight: 600, color: "var(--k)" }}>
                          {item.tipe === "paket" ? "📦 " : "⛺ "}
                          {item.nama}
                        </span>
                        {item.deskripsi && (
                          <span style={{ fontSize: "11.5px", color: "var(--n600)" }}>
                            {item.deskripsi}
                          </span>
                        )}
                        {/* Display composition if Package */}
                        {item.itemsPaket && item.itemsPaket.length > 0 && (
                          <div
                            style={{
                              marginTop: "4px",
                              padding: "4px 8px",
                              background: "#F8FAFC",
                              borderRadius: "4px",
                              border: "1px solid var(--n200)",
                              fontSize: "11px",
                              color: "var(--n800)",
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>Komposisi Paket:</span>{" "}
                            {item.itemsPaket.join(", ")}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: "center", fontWeight: 600 }}>{item.jumlah}x</td>
                    <td style={{ textAlign: "right", color: "var(--n600)" }}>
                      {formatRupiah(item.hargaPerHari)}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: "var(--k)" }}>
                      {formatRupiah(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 4: Financial Summary */}
          <div>
            <div className="detail-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              Ringkasan Pembayaran &amp; DP
            </div>
            <div className="detail-financial-summary">
              <div className="dfs-row">
                <span style={{ color: "var(--n600)" }}>Total Biaya Penyewaan:</span>
                <span style={{ fontWeight: 700 }}>{formatRupiah(booking.totalBiaya)}</span>
              </div>
              <div className="dfs-row">
                <span style={{ color: "var(--n600)" }}>
                  Uang Muka (DP {booking.dpPersen}%):
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 600, color: "var(--acc-t)" }}>
                    {formatRupiah(booking.dpNominal)}
                  </span>
                  {booking.dpMetode && (
                    <span
                      style={{
                        fontSize: "11px",
                        background: "var(--n100)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                      }}
                    >
                      {booking.dpMetode}
                    </span>
                  )}
                </div>
              </div>
              <div className="dfs-row total">
                <span>Sisa Pelunasan (saat ambil):</span>
                <span style={{ color: booking.sisaPelunasan > 0 ? "var(--k)" : "var(--st-ok)" }}>
                  {formatRupiah(booking.sisaPelunasan)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Additional Notes & History */}
          {booking.catatan && (
            <div className="note">
              <div>
                <strong>Catatan Booking:</strong> {booking.catatan}
              </div>
            </div>
          )}

          <div>
            <div className="detail-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Riwayat Aktivitas Booking
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                background: "var(--n50)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-md)",
                padding: "12px 16px",
                fontSize: "12.5px",
              }}
            >
              {booking.riwayat.map((log, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: i !== booking.riwayat.length - 1 ? "8px" : "0",
                    borderBottom:
                      i !== booking.riwayat.length - 1 ? "1px solid var(--n200)" : "none",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--k)" }}>{log.aksi}</span>
                    {log.catatan && <div style={{ color: "var(--n600)" }}>{log.catatan}</div>}
                  </div>
                  <div style={{ textAlign: "right", color: "var(--n600)", minWidth: "140px" }}>
                    <div>{log.waktu}</div>
                    <div style={{ fontSize: "11px" }}>oleh {log.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Role-Based Action Buttons */}
        <div className="modal-footer">
          <button type="button" className="btn sm" onClick={onClose}>
            Tutup
          </button>

          {/* Role: ADMIN Action Buttons */}
          {role === "admin" && (
            <>
              {booking.status === "draft" && (
                <>
                  <Link
                    href={`/admin/booking/baru?id=${booking.id}`}
                    className="btn pri sm"
                    title="Lanjutkan lengkapi data draft pada form Catat Booking"
                    onClick={onClose}
                  >
                    Lanjutkan Draft
                  </Link>
                </>
              )}

              {booking.status === "selesai" && (
                <button
                  type="button"
                  onClick={() => {
                    onCancelBooking?.(booking);
                  }}
                  className="btn sm dng"
                  title="Batalkan booking dengan alasan"
                >
                  Batalkan Booking
                </button>
              )}
            </>
          )}

          {/* Role: OWNER Action Buttons (Strictly Monitoring - Only Cancellation with Reason if allowed) */}
          {role === "owner" && (
            <>
              {booking.status === "selesai" && (
                <button
                  type="button"
                  onClick={() => {
                    onCancelBooking?.(booking);
                  }}
                  className="btn sm dng"
                  title="Batalkan booking resmi dengan alasan wajib"
                >
                  Batalkan Booking
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
