// app/owner/laporan/penyewaan/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getStoredBookings } from "@/components/booking/bookingStore";
import { BookingRecord } from "@/components/booking/types";
import { getStoredTransaksiSewa } from "@/components/transaksi/sewaStore";
import { TransaksiSewaRecord } from "@/components/transaksi/types";

export default function OwnerLaporanPenyewaanPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [transaksiList, setTransaksiList] = useState<TransaksiSewaRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"transaksi" | "dibatalkan">("transaksi");
  const [searchQuery, setSearchQuery] = useState("");
  const [periodeFilter, setPeriodeFilter] = useState("semua");

  const reloadData = () => {
    setBookings(getStoredBookings());
    setTransaksiList(getStoredTransaksiSewa());
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener("summit_bookings_updated", handleUpdate);
    window.addEventListener("summit_transaksi_updated", handleUpdate);
    return () => {
      window.removeEventListener("summit_bookings_updated", handleUpdate);
      window.removeEventListener("summit_transaksi_updated", handleUpdate);
    };
  }, []);

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  // Filter cancelled bookings
  const cancelledBookings = useMemo(() => {
    return bookings.filter((b) => b.status === "dibatalkan");
  }, [bookings]);

  // Summary Metrics
  const totalOmzetSewa = useMemo(() => {
    return transaksiList.reduce((acc, t) => acc + (t.totalTagihan || 0), 0);
  }, [transaksiList]);

  const totalDpHangus = useMemo(() => {
    return cancelledBookings.reduce((acc, b) => acc + (b.dpNominal || 0), 0);
  }, [cancelledBookings]);

  const totalNilaiBatal = useMemo(() => {
    return cancelledBookings.reduce((acc, b) => acc + (b.totalBiaya || 0), 0);
  }, [cancelledBookings]);

  // Filtered lists
  const filteredTransaksi = useMemo(() => {
    return transaksiList.filter((t) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.kode.toLowerCase().includes(q) ||
        t.pelanggan.nama.toLowerCase().includes(q) ||
        t.bookingTag.toLowerCase().includes(q)
      );
    });
  }, [transaksiList, searchQuery]);

  const filteredCancelled = useMemo(() => {
    return cancelledBookings.filter((b) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.kode.toLowerCase().includes(q) ||
        b.pelanggan.nama.toLowerCase().includes(q) ||
        (b.alasanPembatalan && b.alasanPembatalan.toLowerCase().includes(q))
      );
    });
  }, [cancelledBookings, searchQuery]);

  return (
    <div className="main">
      {/* 1. Header Hero */}
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · LAPORAN PENYEWAAN</span>
          <h1 className="hero-title">Laporan Penyewaan &amp; Reservasi</h1>
          <p className="hero-sub">
            Statistik utilisasi unit sewa, transaksi terealisasi, serta riwayat booking yang dibatalkan
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/owner/dashboard" className="btn sm">
            ← Dashboard Owner
          </Link>
        </div>
      </section>

      {/* 2. Top Summary KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        {/* Card 1: Total Transaksi Sewa */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--n600)", textTransform: "uppercase" }}>
            Transaksi Sewa Terealisasi
          </span>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--k)", marginTop: "4px" }}>
            {transaksiList.length}
          </div>
          <span style={{ fontSize: "12px", color: "var(--st-ok-t)", fontWeight: 500 }}>
            Aktif &amp; sudah diambil pelanggan
          </span>
        </div>

        {/* Card 2: Total Omzet Sewa */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--n600)", textTransform: "uppercase" }}>
            Total Omzet Sewa Realisasi
          </span>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--st-ok-t)", marginTop: "4px" }}>
            {formatRupiah(totalOmzetSewa)}
          </div>
          <span style={{ fontSize: "12px", color: "var(--n600)" }}>
            Berdasarkan transaksi sewa resmi
          </span>
        </div>

        {/* Card 3: Booking Dibatalkan */}
        <div className="card" style={{ padding: "18px 20px", borderLeft: "4px solid var(--st-er)" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--st-er-t)", textTransform: "uppercase" }}>
            Booking Dibatalkan
          </span>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--st-er-t)", marginTop: "4px" }}>
            {cancelledBookings.length}
          </div>
          <span style={{ fontSize: "12px", color: "var(--n600)" }}>
            Nilai batal: {formatRupiah(totalNilaiBatal)}
          </span>
        </div>

        {/* Card 4: Dana Hangus (DP Non-Refundable) */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--n600)", textTransform: "uppercase" }}>
            DP Hangus (Kompensasi Batal)
          </span>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "#D97706", marginTop: "4px" }}>
            {formatRupiah(totalDpHangus)}
          </div>
          <span style={{ fontSize: "12px", color: "var(--n600)" }}>
            Penerimaan non-omzet sewa
          </span>
        </div>
      </div>

      {/* 3. Tab Switcher */}
      <div className="card" style={{ marginBottom: "20px", padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => setActiveTab("transaksi")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "transaksi" ? "#0284C7" : "transparent",
                color: activeTab === "transaksi" ? "#FFFFFF" : "var(--n700)",
                fontWeight: 600,
                fontSize: "13.5px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Transaksi Sewa Berjalan ({transaksiList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("dibatalkan")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "dibatalkan" ? "#DC2626" : "transparent",
                color: activeTab === "dibatalkan" ? "#FFFFFF" : "var(--n700)",
                fontWeight: 600,
                fontSize: "13.5px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Riwayat Booking Dibatalkan ({cancelledBookings.length})
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="text"
              placeholder="Cari kode, nama pelanggan, atau alasan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "7px 12px",
                borderRadius: "6px",
                border: "1px solid var(--n300)",
                fontSize: "13px",
                width: "280px",
              }}
            />
          </div>
        </div>
      </div>

      {/* 4. Tab Content: Transaksi Sewa */}
      {activeTab === "transaksi" && (
        <div className="card">
          <div className="ch">
            <h2 className="ct">Daftar Transaksi Penyewaan Terealisasi</h2>
            <span className="b ok">{filteredTransaksi.length} Transaksi</span>
          </div>
          <div className="pad" style={{ padding: 0 }}>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>KODE</th>
                    <th>PELANGGAN</th>
                    <th>SUMBER</th>
                    <th>PERIODE</th>
                    <th className="tar">TOTAL</th>
                    <th>JAMINAN</th>
                    <th style={{ textAlign: "center" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransaksi.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--n500)" }}>
                        Belum ada transaksi penyewaan yang sesuai dengan kriteria.
                      </td>
                    </tr>
                  ) : (
                    filteredTransaksi.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <span style={{ fontWeight: 700, color: "#0284C7" }}>{t.kode}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{t.pelanggan.nama}</div>
                          <div style={{ fontSize: "11.5px", color: "var(--n500)" }}>{t.pelanggan.telepon}</div>
                        </td>
                        <td>
                          <span className={`b ${t.tipeAsal === "booking" ? "nu" : "in"}`} style={{ fontSize: "11px" }}>
                            {t.tipeAsal === "booking" ? t.bookingTag : "Langsung"}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: "12.5px" }}>{t.periodeDisplay}</div>
                          <div style={{ fontSize: "11px", color: "var(--n500)" }}>{t.durasiHari} Hari</div>
                        </td>
                        <td className="tar" style={{ fontWeight: 700 }}>
                          {formatRupiah(t.totalTagihan)}
                        </td>
                        <td style={{ fontSize: "12px", color: "var(--n700)" }}>
                          {t.jaminanFisik || "–"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="b ok" style={{ fontSize: "11.5px" }}>
                            {t.statusPengambilan === "sudah_diambil" ? "Sudah Diambil" : "Belum Diambil"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab Content: Riwayat Booking Dibatalkan */}
      {activeTab === "dibatalkan" && (
        <div className="card">
          <div className="ch" style={{ borderBottom: "1px solid var(--n200)" }}>
            <div>
              <h2 className="ct" style={{ color: "var(--st-er-t)" }}>
                Riwayat &amp; Audit Trail Booking Dibatalkan
              </h2>
              <div style={{ fontSize: "12.5px", color: "var(--n600)", marginTop: "2px" }}>
                Sesuai regulasi, data booking dibatalkan tidak masuk omzet sewa aktif dan alokasi stok telah dikembalikan ke inventaris.
              </div>
            </div>
            <span className="b er">{filteredCancelled.length} Dibatalkan</span>
          </div>

          <div style={{ padding: "12px 18px", background: "#FEF2F2", borderBottom: "1px solid #FEE2E2", fontSize: "12.5px", color: "#991B1B" }}>
            <strong>Ketentuan Sistem (§E.20 &amp; §L.18):</strong> Booking yang dibatalkan TIDAK BOLEH dikonversi menjadi transaksi penyewaan aktif dan tidak dihitung ke omzet sewa yang terealisasi. Uang muka (DP) yang telah dibayar dicatat sebagai dana hangus.
          </div>

          <div className="pad" style={{ padding: 0 }}>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>KODE BOOKING</th>
                    <th>PELANGGAN</th>
                    <th>RENCANA SEWA</th>
                    <th>WAKTU PEMBATALAN</th>
                    <th>ALASAN PEMBATALAN</th>
                    <th>DIBATALKAN OLEH</th>
                    <th className="tar">DP HANGUS</th>
                    <th style={{ textAlign: "center" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCancelled.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "36px", color: "var(--n500)" }}>
                        Tidak ada data booking yang dibatalkan.
                      </td>
                    </tr>
                  ) : (
                    filteredCancelled.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <span style={{ fontWeight: 700, color: "#DC2626" }}>{b.kode}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.pelanggan.nama}</div>
                          <div style={{ fontSize: "11.5px", color: "var(--n500)" }}>{b.pelanggan.telepon}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: "12.5px" }}>{b.tanggalPengambilan}</div>
                          <div style={{ fontSize: "11px", color: "var(--n500)" }}>{b.durasiHari} Hari</div>
                        </td>
                        <td style={{ fontSize: "12px", color: "var(--n700)" }}>
                          {b.waktuPembatalan || "–"}
                        </td>
                        <td>
                          <div style={{ maxWidth: "260px", fontSize: "12.5px", color: "#B91C1C", fontWeight: 500 }}>
                            {b.alasanPembatalan || "Tidak ada rincian alasan"}
                          </div>
                        </td>
                        <td style={{ fontSize: "12px", fontWeight: 600, color: "var(--n700)" }}>
                          {b.userPembatalan || "Admin Toko"}
                        </td>
                        <td className="tar" style={{ fontWeight: 700, color: b.dpNominal > 0 ? "#D97706" : "var(--n500)" }}>
                          {b.dpNominal > 0 ? formatRupiah(b.dpNominal) : "Rp 0 (Tanpa DP)"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="b er" style={{ fontSize: "11px" }}>
                            Dibatalkan
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
