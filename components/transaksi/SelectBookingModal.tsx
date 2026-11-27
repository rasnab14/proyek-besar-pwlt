// components/transaksi/SelectBookingModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { getStoredBookings } from "@/components/booking/bookingStore";
import { BookingRecord } from "@/components/booking/types";
import { MetodePembayaran, TransaksiSewaRecord } from "./types";
import { createTransaksiFromBooking, getStoredTransaksiSewa } from "./sewaStore";

interface SelectBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTx: TransaksiSewaRecord) => void;
}

export function SelectBookingModal({ isOpen, onClose, onSuccess }: SelectBookingModalProps) {
  const [availableBookings, setAvailableBookings] = useState<BookingRecord[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [jaminanFisik, setJaminanFisik] = useState<string>("");
  const [metodePelunasan, setMetodePelunasan] = useState<MetodePembayaran>("tunai");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      // Sesuai §F.1.2: Transaksi penyewaan hanya dapat dibuat dari booking berstatus 'Selesai' yang belum dikonversi
      // Booking yang dihapus atau 'dibatalkan' DILARANG diproses menjadi transaksi sewa
      const allBookings = getStoredBookings();
      const existingTx = getStoredTransaksiSewa();
      const convertedBookingIds = new Set(
        existingTx
          .filter((t) => t.bookingId || t.bookingKode)
          .flatMap((t) => [t.bookingId, t.bookingKode].filter(Boolean) as string[])
      );

      const readyBookings = allBookings.filter(
        (b) =>
          b.status === "selesai" &&
          !convertedBookingIds.has(b.id) &&
          !convertedBookingIds.has(b.kode)
      );

      setAvailableBookings(readyBookings);
      if (readyBookings.length > 0) {
        setSelectedBookingId(readyBookings[0].id);
      } else {
        setSelectedBookingId("");
      }
      setJaminanFisik("");
      setMetodePelunasan("tunai");
      setErrorMsg("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedBooking = availableBookings.find((b) => b.id === selectedBookingId);
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) {
      setErrorMsg("Pilih data booking yang valid.");
      return;
    }
    if (!jaminanFisik.trim()) {
      setErrorMsg("Tuliskan jenis jaminan fisik yang diserahkan pelanggan (misal: KTP Asli).");
      return;
    }

    try {
      const newTx = createTransaksiFromBooking(
        selectedBooking,
        jaminanFisik.trim(),
        metodePelunasan
      );
      onSuccess(newTx);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memproses transaksi sewa.");
    }
  };

  return (
    <div className="tx-modal-overlay" onClick={onClose}>
      <div className="tx-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="tx-modal-header">
          <h2 className="tx-modal-title">Proses Transaksi dari Booking</h2>
          <button type="button" className="tx-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="tx-modal-body">
            {/* Info Notice */}
            <div className="tx-info-banner" style={{ fontSize: "12.5px" }}>
              <strong>Kebutuhan Fungsional §F.1.2 &amp; §F.1.19:</strong> Transaksi dari booking hanya dapat diproses dari booking berstatus <strong>Selesai</strong>. Data pemesanan otomatis terhubung tanpa input ulang.
            </div>

            {availableBookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#64748B" }}>
                <p style={{ margin: 0, fontWeight: 500 }}>
                  Tidak ada booking berstatus &quot;Selesai&quot; yang siap diproses.
                </p>
                <p style={{ fontSize: "12px", marginTop: "4px" }}>
                  Pastikan booking telah diselesaikan di menu Booking terlebih dahulu.
                </p>
              </div>
            ) : (
              <>
                {/* Pilih Booking */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Pilih Booking (Status Selesai)
                  </label>
                  <select
                    className="tx-select"
                    style={{ width: "100%" }}
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                  >
                    {availableBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.kode} — {b.pelanggan.nama} ({b.pelanggan.telepon}) · {formatRupiah(b.totalBiaya)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ringkasan Data Booking Terpilih */}
                {selectedBooking && (
                  <div
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      padding: "14px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12.5px" }}>
                      <div>
                        <span style={{ color: "#64748B", display: "block" }}>Pelanggan:</span>
                        <strong style={{ color: "#0F172A" }}>{selectedBooking.pelanggan.nama}</strong> ({selectedBooking.pelanggan.telepon})
                      </div>
                      <div>
                        <span style={{ color: "#64748B", display: "block" }}>Periode Sewa:</span>
                        <strong>{selectedBooking.tanggalPengambilan} s.d. {selectedBooking.tanggalPengembalian}</strong> ({selectedBooking.durasiHari} Hari)
                      </div>
                    </div>

                    <div style={{ fontSize: "12.5px", borderTop: "1px dashed #CBD5E1", paddingTop: "8px" }}>
                      <span style={{ color: "#64748B", display: "block" }}>Barang yang Disewa:</span>
                      <div style={{ marginTop: "4px", color: "#334155" }}>
                        {selectedBooking.items.map((it) => (
                          <div key={it.id} style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>• {it.nama} ×{it.jumlah}</span>
                            <span>{formatRupiah(it.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #E2E8F0",
                        paddingTop: "10px",
                        fontSize: "13px",
                      }}
                    >
                      <div>
                        <span style={{ color: "#64748B" }}>DP yang Dibayar: </span>
                        <strong style={{ color: "#0284C7" }}>{formatRupiah(selectedBooking.dpNominal)}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#64748B" }}>Sisa Tagihan Pelunasan: </span>
                        <strong style={{ color: "#D97706", fontSize: "15px" }}>
                          {formatRupiah(selectedBooking.sisaPelunasan)}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Input Jaminan Fisik (§F.1.8) */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                    Jaminan Fisik Diserahkan <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <p style={{ fontSize: "12px", color: "#64748B", margin: "0 0 6px 0" }}>
                    Ditulis manual jenis identitas tanpa nomor identitas (misal: <em>KTP Asli Rizky Ananda</em> atau <em>SIM A Dewi Lestari</em>).
                  </p>
                  <input
                    type="text"
                    className="tx-search-input"
                    style={{ paddingLeft: "12px" }}
                    placeholder="Contoh: KTP Asli atas nama penyewa"
                    value={jaminanFisik}
                    onChange={(e) => setJaminanFisik(e.target.value)}
                    required
                  />
                </div>

                {/* Metode Pembayaran Pelunasan (§F.1.20) */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Metode Pembayaran Pelunasan Sisa
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {(["tunai", "qris", "transfer"] as const).map((m) => (
                      <label
                        key={m}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 12px",
                          border: `1px solid ${metodePelunasan === m ? "#0284C7" : "#E2E8F0"}`,
                          borderRadius: "8px",
                          background: metodePelunasan === m ? "#F0F9FF" : "#FFFFFF",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        <input
                          type="radio"
                          name="pelunasan"
                          checked={metodePelunasan === m}
                          onChange={() => setMetodePelunasan(m)}
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>

                {errorMsg && (
                  <div style={{ color: "#DC2626", fontSize: "13px", background: "#FEF2F2", padding: "8px 12px", borderRadius: "6px" }}>
                    {errorMsg}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="tx-modal-footer">
            <button type="button" className="tx-btn-secondary" onClick={onClose}>
              Batal
            </button>
            {availableBookings.length > 0 && (
              <button type="submit" className="tx-btn-primary">
                Konfirmasi Serah Terima &amp; Pelunasan
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
