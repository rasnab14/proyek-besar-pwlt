// components/transaksi/HandoverModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { TransaksiSewaRecord, MetodePembayaran } from "./types";
import { formatRupiah } from "@/lib/format";
import { saveOrUpdateTransaksiSewa } from "./sewaStore";
import { getStoredBookings, saveOrUpdateBooking } from "@/components/booking/bookingStore";

interface HandoverModalProps {
  isOpen: boolean;
  record: TransaksiSewaRecord | null;
  onClose: () => void;
  onSuccess: (updatedRecord: TransaksiSewaRecord) => void;
}

export function HandoverModal({
  isOpen,
  record,
  onClose,
  onSuccess,
}: HandoverModalProps) {
  const [jaminanFisik, setJaminanFisik] = useState("");
  const [metodePelunasan, setMetodePelunasan] = useState<MetodePembayaran>("tunai");
  const [nominalDiterima, setNominalDiterima] = useState<number>(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setJaminanFisik(record.jaminanFisik || `KTP Asli an. ${record.pelanggan.nama}`);
      setMetodePelunasan(record.metodePelunasan || "tunai");
      setNominalDiterima(record.sisaTagihan || 0);
      setIsConfirmOpen(false);
      setErrorMsg(null);
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const sisa = record.sisaTagihan || 0;
  const kembalian = Math.max(0, nominalDiterima - sisa);

  const handleOpenConfirmation = () => {
    if (record.statusPengambilan === "sudah_diambil") {
      setErrorMsg("Transaksi ini sudah melakukan serah terima sebelumnya. Proses serah terima hanya dapat dilakukan satu kali.");
      return;
    }
    if (!jaminanFisik.trim()) {
      setErrorMsg("Wajib mencatat jenis identitas jaminan fisik (misal: KTP Asli atau SIM A).");
      return;
    }
    if (sisa > 0 && nominalDiterima < sisa) {
      setErrorMsg(`Uang diterima kurang dari sisa tagihan (${formatRupiah(sisa)}).`);
      return;
    }
    setErrorMsg(null);
    setIsConfirmOpen(true);
  };

  const handleExecuteHandover = () => {
    if (record.statusPengambilan === "sudah_diambil") {
      setErrorMsg("Transaksi ini sudah pernah diserahterimakan.");
      setIsConfirmOpen(false);
      return;
    }

    const now = new Date();
    const nowStr = now.toISOString().replace("T", " ").substring(0, 16);

    const updated: TransaksiSewaRecord = {
      ...record,
      jaminanFisik: jaminanFisik.trim(),
      statusPengambilan: "sudah_diambil",
      status: "lunas",
      statusPembayaran: "lunas",
      sisaTagihan: 0,
      metodePelunasan,
      waktuPengambilanAktual: nowStr,
      riwayat: [
        ...(record.riwayat || []),
        {
          waktu: nowStr,
          user: "Admin Toko",
          aksi: "Serah Terima & Pelunasan Kasir Selesai",
          catatan: `Barang diserahkan ke pelanggan. Jaminan fisik: ${jaminanFisik.trim()}. Pelunasan: ${formatRupiah(sisa)} (${metodePelunasan.toUpperCase()}).`,
        },
      ],
    };

    // Update transaksi penyewaan
    saveOrUpdateTransaksiSewa(updated);

    // Sinkronisasi pembaruan ke booking terkait (§F.1.B Poin 2)
    if (record.tipeAsal === "booking" && (record.bookingId || record.bookingKode)) {
      const allBookings = getStoredBookings();
      const originBooking = allBookings.find(
        (b) =>
          (record.bookingId && b.id.toLowerCase() === record.bookingId.toLowerCase()) ||
          (record.bookingKode && b.kode.toLowerCase() === record.bookingKode.toLowerCase())
      );

      if (originBooking) {
        originBooking.isTodayPickup = false;
        originBooking.sisaPelunasan = 0;
        originBooking.riwayat = [
          {
            waktu: nowStr,
            user: "Admin Toko",
            aksi: `Serah Terima Transaksi ${record.kode} Berhasil`,
            catatan: `Barang fisik telah diserahkan (Sudah diambil). Jaminan: ${jaminanFisik.trim()}. Sisa sewa LUNAS.`,
          },
          ...(originBooking.riwayat || []),
        ];
        saveOrUpdateBooking(originBooking);
      }
    }

    setIsConfirmOpen(false);
    onSuccess(updated);
    onClose();
  };

  return (
    <>
      <div className="tx-modal-overlay" onClick={onClose}>
        <div
          className="tx-modal-container"
          style={{ maxWidth: "560px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="tx-modal-header">
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#D97706", background: "#FEF3C7", padding: "2px 8px", borderRadius: "10px" }}>
                SERAH TERIMA & PELUNASAN SEWA
              </span>
              <h2 className="tx-modal-title" style={{ marginTop: "4px" }}>
                {record.kode}
              </h2>
              <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#64748B" }}>
                Pelanggan: <b>{record.pelanggan.nama}</b> ({record.pelanggan.telepon})
              </p>
            </div>
            <button type="button" className="tx-modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "75vh", overflowY: "auto" }}>
            {errorMsg && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "8px 12px", borderRadius: "6px", fontSize: "12.5px" }}>
                {errorMsg}
              </div>
            )}

            {/* Info Periode & Barang */}
            <div style={{ background: "#F8FAFC", padding: "12px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12.5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "#64748B" }}>Periode Sewa:</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>{record.periodeDisplay} ({record.durasiHari} Hari)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#64748B" }}>Batas Kembali:</span>
                <span style={{ fontWeight: 600, color: "#D97706" }}>{record.tglKembaliDisplay}</span>
              </div>
              <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "8px" }}>
                <span style={{ color: "#64748B", display: "block", marginBottom: "4px" }}>Barang yang Diserahkan:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {record.items.map((it) => (
                    <span
                      key={it.id}
                      style={{
                        background: "#E2E8F0",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#1E293B",
                      }}
                    >
                      {it.nama} ×{it.jumlah}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Jaminan Fisik (Wajib) */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                Jenis Identitas Jaminan Fisik <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="text"
                value={jaminanFisik}
                onChange={(e) => setJaminanFisik(e.target.value)}
                placeholder="Misal: KTP Asli an. Maya Sari atau SIM A"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <span style={{ display: "block", fontSize: "11.5px", color: "#64748B", marginTop: "4px" }}>
                Ditulis secara manual tanpa nomor identitas (misal: KTP Asli atas nama penyewa atau SIM A).
              </span>
            </div>

            {/* Rincian Finansial & Pelunasan */}
            <div style={{ background: "#F8FAFC", padding: "14px", borderRadius: "8px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                <span>Total Biaya Sewa:</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>{formatRupiah(record.totalTagihan)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                <span>DP Diterima ({record.bookingTag}):</span>
                <span style={{ fontWeight: 600, color: "#166534" }}>{formatRupiah(record.dpNominal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E2E8F0", paddingTop: "8px", fontSize: "14px", fontWeight: 700 }}>
                <span>Sisa Pelunasan di Kasir:</span>
                <span style={{ color: sisa > 0 ? "#D97706" : "#166534" }}>
                  {sisa > 0 ? formatRupiah(sisa) : "LUNAS"}
                </span>
              </div>

              {sisa > 0 && (
                <>
                  <div style={{ marginTop: "6px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>
                      Metode Pelunasan:
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                      {(["tunai", "qris", "transfer"] as MetodePembayaran[]).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMetodePelunasan(m)}
                          style={{
                            padding: "7px 10px",
                            borderRadius: "6px",
                            border: metodePelunasan === m ? "2px solid #0284C7" : "1px solid #CBD5E1",
                            background: metodePelunasan === m ? "#E0F2FE" : "#FFFFFF",
                            color: metodePelunasan === m ? "#0284C7" : "#475569",
                            fontWeight: 600,
                            fontSize: "12px",
                            cursor: "pointer",
                            textTransform: "uppercase",
                          }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: "4px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                      Uang Diterima:
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={nominalDiterima}
                      onChange={(e) => setNominalDiterima(parseInt(e.target.value, 10) || 0)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #CBD5E1",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  {kembalian > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", background: "#DCFCE7", padding: "6px 10px", borderRadius: "6px", color: "#166534", fontWeight: 700, fontSize: "12.5px" }}>
                      <span>Kembalian:</span>
                      <span>{formatRupiah(kembalian)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="tx-modal-footer">
            <button type="button" className="tx-btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button
              type="button"
              className="tx-btn-primary"
              style={{ background: "#D97706", borderColor: "#D97706" }}
              onClick={handleOpenConfirmation}
            >
              Konfirmasi & Serahkan Barang
            </button>
          </div>
        </div>
      </div>

      {/* Dialog Konfirmasi Ringkas & Jelas */}
      {isConfirmOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100001,
            padding: "16px",
          }}
          onClick={() => setIsConfirmOpen(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "12px",
              padding: "20px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
              Serahkan Barang {record.kode}?
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
              Jaminan: <b>{jaminanFisik}</b>
              <br />
              Pelunasan: <b>{formatRupiah(sisa)} ({metodePelunasan.toUpperCase()})</b>
              <br />
              Status akan diperbarui menjadi <b>Sudah diambil</b> dan <b>Lunas</b>.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                className="tx-btn-secondary"
                style={{ padding: "7px 14px", fontSize: "12.5px" }}
                onClick={() => setIsConfirmOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="tx-btn-primary"
                style={{ padding: "7px 14px", fontSize: "12.5px", background: "#D97706", borderColor: "#D97706" }}
                onClick={handleExecuteHandover}
              >
                Ya, Serahkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
