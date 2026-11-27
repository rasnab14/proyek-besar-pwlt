"use client";

import { useState } from "react";
import Link from "next/link";
import "./owner-dashboard.css";

interface TransactionItem {
  id: string;
  code: string;
  customer: string;
  items: string;
  time: string;
  hour: number;
  price: string;
  priceNum: number;
  status: string;
}

export default function OwnerDashboardPage() {
  // ─── Toasts ───
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // ─── Period Switcher ───
  const [selectedPeriod, setSelectedPeriod] = useState<"harian" | "bulan" | "3bulan" | "tahun">("harian");

  // Dynamic KPI Data based on period
  const kpiData = {
    harian: {
      pendapatan: "Rp 816.000",
      pendapatanSub: "Pembayaran yang masuk pada hari ini",
      pengeluaran: "Rp 180.000",
      pengeluaranSub: "Biaya operasional hari ini",
      transaksi: "3 / 2",
      transaksiSub: "5 transaksi",
      booking: "11 · 14",
      bookingSub: "11 Selesai · 2 Batal terpisah",
    },
    bulan: {
      pendapatan: "Rp 19.180.000",
      pendapatanSub: "Akumulasi pembayaran bulan November",
      pengeluaran: "Rp 4.860.000",
      pengeluaranSub: "Total operasional bulan ini",
      transaksi: "96 / 38",
      transaksiSub: "134 transaksi",
      booking: "28 · 45",
      bookingSub: "Target tercapai 92%",
    },
    "3bulan": {
      pendapatan: "Rp 58.450.000",
      pendapatanSub: "September – November 2026",
      pengeluaran: "Rp 14.200.000",
      pengeluaranSub: "Total biaya 3 bulan terakhir",
      transaksi: "280 / 115",
      transaksiSub: "395 transaksi",
      booking: "82 · 90",
      bookingSub: "Pertumbuhan +18% QoQ",
    },
    tahun: {
      pendapatan: "Rp 215.800.000",
      pendapatanSub: "Total tahun buku 2026",
      pengeluaran: "Rp 52.300.000",
      pengeluaranSub: "Total pengeluaran tahun berjalan",
      transaksi: "1.120 / 450",
      transaksiSub: "1.570 transaksi",
      booking: "310 · 340",
      bookingSub: "Laba bersih estimasi 75.7%",
    },
  };

  // ─── Date Navigator State ───
  const [dayOffset, setDayOffset] = useState<number>(0);
  const baseDate = new Date(2026, 10, 21); // 21 Nov 2026

  const getCurrentDisplayDate = () => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + dayOffset);
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();

    return {
      formatted: `${mm}/${dd}/${yyyy}`,
      label: `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${yyyy}${dayOffset === 0 ? " (hari ini)" : ""}`,
    };
  };

  const currentDisplay = getCurrentDisplayDate();

  // ─── Modals State ───
  const [activeModal, setActiveModal] = useState<
    "laporan" | "transaksi-detail" | "kondisi-barang" | "aktivitas-semua" | null
  >(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);
  const [selectedKondisiTitle, setSelectedKondisiTitle] = useState<string>("");

  // ─── Hourly Chart Interactive Filter ───
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  // Hourly bars data
  const hourlyData = [
    { hour: 8, height: "20%", amount: "Rp 35.000" },
    { hour: 9, height: "45%", amount: "Rp 112.000" },
    { hour: 10, height: "85%", amount: "Rp 150.000" },
    { hour: 11, height: "42%", amount: "Rp 180.000" },
    { hour: 12, height: "38%", amount: "Rp 65.000" },
    { hour: 13, height: "48%", amount: "Rp 95.000" },
    { hour: 14, height: "65%", amount: "Rp 115.000" },
    { hour: 15, height: "58%", amount: "Rp 340.000" },
    { hour: 16, height: "72%", amount: "Rp 130.000" },
    { hour: 17, height: "55%", amount: "Rp 80.000" },
    { hour: 18, height: "50%", amount: "Rp 95.000" },
    { hour: 19, height: "30%", amount: "Rp 50.000" },
    { hour: 20, height: "25%", amount: "Rp 45.000" },
    { hour: 21, height: "22%", amount: "Rp 40.000" },
  ];

  // ─── Transactions Data ───
  const transactions: TransactionItem[] = [
    {
      id: "1",
      code: "TJ-0141",
      customer: "Andi Nugraha",
      items: "Gas Kaleng 230 g × 4",
      time: "09.07",
      hour: 9,
      price: "Rp 112.000",
      priceNum: 112000,
      status: "Lunas (QRIS)",
    },
    {
      id: "2",
      code: "TS-0464",
      customer: "Maya Sari",
      items: "Carrier 60L × 2 · 3 hari",
      time: "11.20",
      hour: 11,
      price: "Rp 180.000",
      priceNum: 180000,
      status: "Lunas (Tunai)",
    },
    {
      id: "3",
      code: "TJ-0143",
      customer: "Dimas Anggara",
      items: "Headlamp LED × 1",
      time: "13.33",
      hour: 13,
      price: "Rp 95.000",
      priceNum: 95000,
      status: "Lunas (Debit)",
    },
    {
      id: "4",
      code: "TS-0466",
      customer: "Sinta Maharani",
      items: "Paket Pendakian 2 Orang · 2 hari",
      time: "15.45",
      hour: 15,
      price: "Rp 340.000",
      priceNum: 340000,
      status: "Lunas (Transfer BCA)",
    },
    {
      id: "5",
      code: "TS-0467",
      customer: "Budi Hartono",
      items: "Sleeping Bag × 2 · 2 hari",
      time: "17.59",
      hour: 17,
      price: "Rp 80.000",
      priceNum: 80000,
      status: "Lunas (QRIS)",
    },
  ];

  const visibleTransactions = selectedHour !== null
    ? transactions.filter((t) => Math.abs(t.hour - selectedHour) <= 1)
    : transactions;

  return (
    <div className="main-content">
      {/* ─── Floating Toast Notification ─── */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast-msg">
            <span className="toast-dot" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ─── Hero Banner ─── */}
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER</span>
          <h1 className="hero-title">Dashboard</h1>
          <p className="hero-sub">
            Ringkasan keuangan dan operasional · November 2026
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/owner/laporan/keuangan" className="btn-hero-pri">
            Lihat laporan
          </Link>
        </div>
        {/* Mountain Contour SVG Lines Background */}
        <svg
          className="hero-ridge"
          viewBox="0 0 520 170"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <circle cx="440" cy="42" r="15" fill="#0EA5E9" fillOpacity="0.9" />
          <path
            d="M0 170L70 100l40 40 80-100 70 80 60-50 90 100V170Z"
            fill="white"
            fillOpacity="0.06"
          />
          <path
            d="M130 170l60-70 40 45 70-85 90 110z"
            fill="white"
            fillOpacity="0.08"
          />
          <path
            d="M0 160L70 100l40 40 80-100 70 80 60-50 90 100"
            stroke="#0EA5E9"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </section>

      {/* ─── Toolbar: Periode & Filter Tanggal ─── */}
      <div className="toolbar-section">
        <div className="toolbar-row">
          {/* Segmented Filter Pills */}
          <div className="tab-pill-group">
            <button
              type="button"
              onClick={() => {
                setSelectedPeriod("harian");
                showToast("Beralih ke tampilan rekap Harian");
              }}
              className={`tab-pill-btn ${selectedPeriod === "harian" ? "active" : ""}`}
            >
              Harian
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPeriod("bulan");
                showToast("Beralih ke tampilan Bulan Ini (November 2026)");
              }}
              className={`tab-pill-btn ${selectedPeriod === "bulan" ? "active" : ""}`}
            >
              Bulan ini
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPeriod("3bulan");
                showToast("Beralih ke tampilan 3 Bulan Terakhir");
              }}
              className={`tab-pill-btn ${selectedPeriod === "3bulan" ? "active" : ""}`}
            >
              3 bulan terakhir
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPeriod("tahun");
                showToast("Beralih ke tampilan Tahun Ini (2026)");
              }}
              className={`tab-pill-btn ${selectedPeriod === "tahun" ? "active" : ""}`}
            >
              Tahun ini
            </button>
          </div>

          {/* Date Picker Controls */}
          <div className="date-controls">
            <button
              type="button"
              className="date-nav-btn"
              onClick={() => {
                setDayOffset((prev) => prev - 1);
                showToast("Melihat rekap tanggal sebelumnya");
              }}
              title="Hari Sebelumnya"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div
              className="date-input-wrap"
              onClick={() => showToast(`Tanggal terpilih: ${currentDisplay.label}`)}
              title="Klik untuk info tanggal"
            >
              <span className="date-val">{currentDisplay.formatted}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <button
              type="button"
              className="date-nav-btn"
              onClick={() => {
                setDayOffset((prev) => prev + 1);
                showToast("Melihat rekap tanggal berikutnya");
              }}
              title="Hari Berikutnya"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button
              type="button"
              className="date-today-btn"
              onClick={() => {
                setDayOffset(0);
                showToast("Reset ke Hari ini: Sabtu, 21 Nov 2026");
              }}
            >
              Hari ini
            </button>
          </div>
        </div>

        <div className="rekap-text">
          <span>Rekap {selectedPeriod} ·</span>
          <strong>{currentDisplay.label}</strong>
        </div>
      </div>

      {/* ─── Row 1: 4 KPI Cards (Dynamic to Selected Period) ─── */}
      <section className="kpi-grid">
        {/* Card 1: Pendapatan diterima (Dark Navy) */}
        <div
          className="kpi-card kpi-dark"
          onClick={() => setActiveModal("laporan")}
          title="Klik untuk rincian laporan pendapatan"
        >
          <span className="kpi-label">Pendapatan diterima</span>
          <div className="kpi-value">{kpiData[selectedPeriod].pendapatan}</div>
          <div className="kpi-desc">{kpiData[selectedPeriod].pendapatanSub}</div>
        </div>

        {/* Card 2: Pengeluaran tercatat */}
        <div
          className="kpi-card"
          onClick={() => showToast(`Total pengeluaran ${selectedPeriod}: ${kpiData[selectedPeriod].pengeluaran}`)}
          title="Klik untuk rincian pengeluaran"
        >
          <span className="kpi-label">Pengeluaran tercatat</span>
          <div className="kpi-value">{kpiData[selectedPeriod].pengeluaran}</div>
          <div className="kpi-bottom-row">
            <span className="kpi-desc">{kpiData[selectedPeriod].pengeluaranSub}</span>
            <svg className="sparkline" viewBox="0 0 80 24" fill="none">
              <path d="M2 18 C 18 10, 36 22, 54 12 S 78 8, 78 8" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Transaksi sewa / jual */}
        <div
          className="kpi-card"
          onClick={() => showToast(`Rasio Transaksi: ${kpiData[selectedPeriod].transaksi} (${kpiData[selectedPeriod].transaksiSub})`)}
          title="Klik untuk rasio perbandingan sewa vs jual"
        >
          <span className="kpi-label">Transaksi sewa / jual</span>
          <div className="kpi-value">{kpiData[selectedPeriod].transaksi}</div>
          <div className="kpi-bottom-row">
            <span className="kpi-desc">{kpiData[selectedPeriod].transaksiSub}</span>
            <svg className="sparkline" viewBox="0 0 80 24" fill="none">
              <path d="M2 16 C 22 22, 38 12, 56 18 S 78 6, 78 6" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Booking aktif · berjalan (§B.2.4) */}
        <div
          className="kpi-card"
          onClick={() => showToast(`Booking Aktif: 11 booking Selesai · Transaksi Berjalan: 14 transaksi (Booking Batal dipantau terpisah)`)}
          title="Klik untuk rincian booking & transaksi berjalan"
        >
          <span className="kpi-label">Booking aktif · berjalan</span>
          <div className="kpi-value">{kpiData[selectedPeriod].booking}</div>
          <div className="kpi-bottom-row">
            <span className="kpi-desc">{kpiData[selectedPeriod].bookingSub}</span>
            <svg className="sparkline" viewBox="0 0 80 24" fill="none">
              <path d="M2 18 C 20 12, 40 20, 60 10 S 78 14, 78 14" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── Row 2: Pendapatan per jam & Kondisi Barang ─── */}
      <div className="chart-grid">
        {/* Left Card: Bar Chart Pendapatan per jam */}
        <section className="content-card">
          <div className="chart-header">
            <div>
              <h2 className="card-title">
                <span className="card-dot" />
                Pendapatan per jam
              </h2>
              <p className="card-subtitle">
                {selectedHour !== null
                  ? `Menyorot transaksi jam ${selectedHour < 10 ? `0${selectedHour}` : selectedHour}.00 WIB (klik lagi untuk reset)`
                  : "Jam operasional 08.00 – 21.00 WIB, dalam ribu rupiah (klik batang untuk filter transaksi)"}
              </p>
            </div>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-swatch swatch-blue" />
                Pendapatan
              </span>
            </div>
          </div>

          <div className="hourly-bars-container">
            {hourlyData.map((b) => (
              <div
                key={b.hour}
                className={`bar-group ${selectedHour === b.hour ? "active-hour" : ""}`}
                onClick={() => {
                  if (selectedHour === b.hour) {
                    setSelectedHour(null);
                    showToast("Reset filter jam");
                  } else {
                    setSelectedHour(b.hour);
                    showToast(`Jam ${b.hour < 10 ? `0${b.hour}` : b.hour}.00 WIB: ${b.amount}`);
                  }
                }}
                title={`Pukul ${b.hour < 10 ? `0${b.hour}` : b.hour}.00: ${b.amount}`}
              >
                <div className="bar-col-single bar-blue" style={{ height: b.height }} />
                <span className="bar-label">{b.hour < 10 ? `0${b.hour}` : b.hour}</span>
              </div>
            ))}
          </div>

          <div className="chart-footer-row">
            <span>
              Jam tersibuk: <strong>10.00</strong>
              {selectedHour !== null && ` · Jam dipilih: ${selectedHour}.00`}
            </span>
            <span>Total hari ini: <strong>Rp 816.000</strong></span>
          </div>
        </section>

        {/* Right Card: Kondisi Barang */}
        <section className="content-card">
          <div className="kondisi-header">
            <h2 className="card-title">
              <span className="card-dot" />
              Kondisi barang
            </h2>
            <span className="saat-ini-tag">Saat ini</span>
          </div>
          <div className="kondisi-list">
            <div
              className="kondisi-row"
              onClick={() => {
                setSelectedKondisiTitle("Unit Sedang Disewa (38 Unit)");
                setActiveModal("kondisi-barang");
              }}
              title="Klik untuk melihat unit yang sedang disewa"
            >
              <span className="pill-badge pill-blue">
                <span className="badge-dot" />
                Disewa
              </span>
              <span className="kondisi-val">38 unit</span>
            </div>

            <div
              className="kondisi-row"
              onClick={() => {
                setSelectedKondisiTitle("Jadwal Dikembalikan Hari Ini (2 Transaksi)");
                setActiveModal("kondisi-barang");
              }}
              title="Klik untuk melihat transaksi pengembalian"
            >
              <span className="pill-badge pill-green">
                <span className="badge-dot" />
                Dikembalikan hari ini
              </span>
              <span className="kondisi-val">2 transaksi</span>
            </div>

            <div
              className="kondisi-row"
              onClick={() => {
                setSelectedKondisiTitle("Unit dalam Tahap Persiapan (6 Unit)");
                setActiveModal("kondisi-barang");
              }}
              title="Klik untuk melihat unit dalam persiapan sewa"
            >
              <span className="pill-badge pill-amber">
                <span className="badge-dot" />
                Persiapan
              </span>
              <span className="kondisi-val">6 unit</span>
            </div>

            <div
              className="kondisi-row"
              onClick={() => {
                setSelectedKondisiTitle("Unit Rusak / Klaim Penggantian (4 Unit)");
                setActiveModal("kondisi-barang");
              }}
              title="Klik untuk melihat rincian unit rusak"
            >
              <span className="pill-badge pill-red">
                <span className="badge-dot" />
                Rusak
              </span>
              <span className="kondisi-val">4 unit</span>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Row 3: Transaksi pada tanggal ini (Full Width) ─── */}
      <section className="content-card">
        <div className="trans-header">
          <h2 className="card-title">
            <span className="card-dot" />
            Transaksi pada tanggal ini
          </h2>
          <p className="card-subtitle">
            {selectedHour !== null
              ? `Menampilkan transaksi sekitar jam ${selectedHour}.00 WIB (${visibleTransactions.length} transaksi)`
              : "5 transaksi tercatat · menampilkan 5 terbaru (klik baris untuk rincian nota)"}
          </p>
        </div>
        <div className="trans-list">
          {visibleTransactions.map((tx) => (
            <div
              key={tx.id}
              className="trans-item-row"
              onClick={() => {
                setSelectedTransaction(tx);
                setActiveModal("transaksi-detail");
              }}
              title="Klik untuk melihat struk / rincian transaksi"
            >
              <div className="trans-item-left">
                <div className="trans-item-title">
                  {tx.code} · {tx.customer}
                </div>
                <div className="trans-item-sub">
                  {tx.items} · {tx.time}
                </div>
              </div>
              <div className="trans-item-price">{tx.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Row 4: 3 Insight Cards (Paling sering disewa, Produk terlaris, Pelanggan teraktif) ─── */}
      <section className="three-col-grid">
        {/* Card 1: Paling sering disewa */}
        <div className="content-card">
          <h2 className="card-title card-title-mb">
            <span className="card-dot" />
            Paling sering disewa
          </h2>
          <div className="ranking-list">
            <div
              className="ranking-row"
              onClick={() => showToast("Tenda Dome 4P: Okupansi sewa 88% di bulan November")}
            >
              <span className="ranking-name">Tenda Dome 4P</span>
              <span className="ranking-metric">2×</span>
            </div>
            <div
              className="ranking-row"
              onClick={() => showToast("Carrier 60L: 8 unit aktif disewa")}
            >
              <span className="ranking-name">Carrier 60L</span>
              <span className="ranking-metric">1×</span>
            </div>
            <div
              className="ranking-row"
              onClick={() => showToast("Sleeping Bag: Permintaan tertinggi akhir pekan")}
            >
              <span className="ranking-name">Sleeping Bag</span>
              <span className="ranking-metric">1×</span>
            </div>
          </div>
        </div>

        {/* Card 2: Produk terlaris */}
        <div className="content-card">
          <h2 className="card-title card-title-mb">
            <span className="card-dot" />
            Produk terlaris
          </h2>
          <div className="ranking-list">
            <div
              className="ranking-row"
              onClick={() => showToast("Gas Kaleng 230g: Terjual 52 pcs bulan ini")}
            >
              <span className="ranking-name">Gas Kaleng 230 g</span>
              <span className="ranking-metric">2 pcs</span>
            </div>
            <div
              className="ranking-row"
              onClick={() => showToast("Headlamp LED: Produk aksesoris terlaris")}
            >
              <span className="ranking-name">Headlamp</span>
              <span className="ranking-metric">4 pcs</span>
            </div>
            <div
              className="ranking-row"
              onClick={() => showToast("Raincoat: Laris di musim hujan")}
            >
              <span className="ranking-name">Raincoat</span>
              <span className="ranking-metric">2 pcs</span>
            </div>
          </div>
        </div>

        {/* Card 3: Pelanggan teraktif */}
        <div className="content-card">
          <h2 className="card-title card-title-mb">
            <span className="card-dot" />
            Pelanggan teraktif
          </h2>
          <div className="ranking-list">
            <div
              className="ranking-row"
              onClick={() => showToast("Rizky Ananda: Pelanggan loyal tier Gold (11 total transaksi)")}
            >
              <span className="ranking-name">Rizky Ananda</span>
              <span className="ranking-metric">2 trx</span>
            </div>
            <div
              className="ranking-row"
              onClick={() => showToast("Andi Nugraha: 7 total transaksi tahun 2026")}
            >
              <span className="ranking-name">Andi Nugraha</span>
              <span className="ranking-metric">1 trx</span>
            </div>
            <div
              className="ranking-row"
              onClick={() => showToast("Maya Sari: 5 total transaksi sewa")}
            >
              <span className="ranking-name">Maya Sari</span>
              <span className="ranking-metric">2 trx</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Row 5: Aktivitas Pengguna Terbaru ─── */}
      <section className="content-card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="card-dot" />
            Aktivitas pengguna terbaru
          </h2>
          <Link href="/owner/riwayat" className="pill-link">
            Semua
          </Link>
        </div>
        <div className="list-group">
          {/* Activity 1 */}
          <div
            className="activity-row"
            onClick={() => showToast("Aktivitas: Admin Toko mencatat penjualan TJ-0127 (2 Nov, 09.14)")}
          >
            <div className="avatar-circle av-green">AD</div>
            <div className="activity-info">
              <span className="activity-title">
                <strong>Admin Toko</strong> mencatat transaksi penjualan TJ-0127
              </span>
              <span className="activity-time">2 Nov, 09.14</span>
            </div>
          </div>

          {/* Activity 2 */}
          <div
            className="activity-row"
            onClick={() => showToast("Aktivitas: Pemilik Toko membatalkan booking BK-0239 (1 Nov, 16.20)")}
          >
            <div className="avatar-circle av-amber">OW</div>
            <div className="activity-info">
              <span className="activity-title">
                <strong>Pemilik Toko</strong> membatalkan booking BK-0239
              </span>
              <span className="activity-time">1 Nov, 16.20 · DP hangus Rp 60.000</span>
            </div>
          </div>

          {/* Activity 3 */}
          <div
            className="activity-row"
            onClick={() => showToast("Aktivitas: Admin Toko mengubah kondisi unit SPT003 menjadi Dicuci")}
          >
            <div className="avatar-circle av-cyan">AD</div>
            <div className="activity-info">
              <span className="activity-title">
                <strong>Admin Toko</strong> mengubah kondisi unit SPT003 menjadi Dicuci
              </span>
              <span className="activity-time">1 Nov, 13.02</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MODAL 1: Ringkasan Laporan Keuangan ─── */}
      {activeModal === "laporan" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ringkasan Laporan Keuangan &amp; Operasional</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  padding: "16px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>TOTAL PENDAPATAN (NOV)</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#0ea5e9" }}>
                    Rp 19.180.000
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>TOTAL PENGELUARAN</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#ef4444" }}>
                    Rp 4.860.000
                  </div>
                </div>
                <div style={{ gridColumn: "span 2", paddingTop: "8px", borderTop: "1px dashed #cbd5e1" }}>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>LABA BERSIH BERJALAN</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#16a34a" }}>
                    Rp 14.320.000 (Margin 74.6%)
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "13px", color: "#334155", lineHeight: "1.6" }}>
                <div>✓ <strong>Rasio Sewa vs Penjualan:</strong> 71.6% Sewa Alat / 28.4% Retail Perlengkapan</div>
                <div>✓ <strong>Tingkat Keterlambatan:</strong> 1.5% (Terkendali)</div>
                <div>✓ <strong>Total Unit Terawat Baik:</strong> 180 / 202 Unit (89.1%)</div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  showToast("Laporan Excel/CSV diekspor!");
                  setActiveModal(null);
                }}
              >
                Unduh Rekap Excel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  showToast("Laporan PDF berhasil di-download!");
                  setActiveModal(null);
                }}
              >
                Unduh PDF Laporan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: Detail Transaksi & Struk ─── */}
      {activeModal === "transaksi-detail" && selectedTransaction && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nota Transaksi {selectedTransaction.code}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px",
                  background: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <div style={{ fontSize: "11.5px", color: "#0369a1", fontWeight: 600 }}>NAMA PELANGGAN</div>
                  <div style={{ fontWeight: 800, fontSize: "15px", color: "#0f172a" }}>
                    {selectedTransaction.customer}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11.5px", color: "#0369a1", fontWeight: 600 }}>TOTAL BAYAR</div>
                  <div style={{ fontWeight: 800, fontSize: "18px", color: "#0284c7" }}>
                    {selectedTransaction.price}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "13px", lineHeight: "1.7", color: "#334155" }}>
                <div><strong>Rincian Item:</strong> {selectedTransaction.items}</div>
                <div><strong>Waktu Transaksi:</strong> {currentDisplay.label}, pukul {selectedTransaction.time} WIB</div>
                <div><strong>Metode Pembayaran:</strong> {selectedTransaction.status}</div>
                <div><strong>Kasir Penanggung Jawab:</strong> Admin Toko (Shift Pagi)</div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setActiveModal(null)}
              >
                Tutup
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  showToast(`Salinan nota ${selectedTransaction.code} siap dicetak!`);
                  setActiveModal(null);
                }}
              >
                Cetak Salinan Nota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: Detail Kondisi Barang ─── */}
      {activeModal === "kondisi-barang" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedKondisiTitle}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                Daftar unit fisik toko yang tercatat dalam status ini:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { name: "Tenda Dome 4P Consina (SPT001)", status: "Disewa oleh Andi N.", due: "Kembali 21.00 WIB" },
                  { name: "Carrier 60L Eiger (CR004)", status: "Disewa oleh Maya S.", due: "Kembali 24 Nov" },
                  { name: "Kompor Portable Kovar (KP012)", status: "Perlu pengecekan regulator", due: "Di bengkel toko" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "13px", color: "#0f172a" }}>{item.name}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>{item.status} · {item.due}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setActiveModal(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: Semua Aktivitas Pengguna ─── */}
      {activeModal === "aktivitas-semua" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Riwayat Aktivitas Sistem Lengkap</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { user: "Admin Toko", role: "Kasir", desc: "Mencatat transaksi penjualan TJ-0127", time: "2 Nov, 09.14", av: "AD", avClass: "av-green" },
                  { user: "Pemilik Toko", role: "Owner", desc: "Membatalkan booking BK-0239 (DP hangus Rp 60.000)", time: "1 Nov, 16.20", av: "OW", avClass: "av-amber" },
                  { user: "Admin Toko", role: "Kasir", desc: "Mengubah kondisi unit SPT003 menjadi Dicuci", time: "1 Nov, 13.02", av: "AD", avClass: "av-cyan" },
                  { user: "Admin Toko", role: "Kasir", desc: "Konfirmasi pembayaran DP booking BK-0238 (Rp 75.000)", time: "1 Nov, 10.45", av: "AD", avClass: "av-green" },
                  { user: "Pemilik Toko", role: "Owner", desc: "Menyetujui pengeluaran listrik toko Rp 510.000", time: "30 Okt, 18.00", av: "OW", avClass: "av-amber" },
                ].map((act, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  >
                    <div className={`avatar-circle ${act.avClass}`}>{act.av}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", color: "#0f172a" }}>
                        <strong>{act.user}</strong> ({act.role}): {act.desc}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "#64748b" }}>{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setActiveModal(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
