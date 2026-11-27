"use client";

import Link from "next/link";
import "./admin-dashboard.css";

export default function DashboardAdminPage() {
  return (
    <div className="main-content">
      {/* ─── Hero Banner ─── */}
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN</span>
          <h1 className="hero-title">Dashboard</h1>
          <p className="hero-sub">
            Senin, 2 November 2026 · ringkasan operasional hari ini · jam operasional 08.00–21.00 WIB
          </p>
        </div>
        <div className="hero-actions">
          {/* Sesuai ALUR-NAVIGASI.md: Cek ketersediaan -> /admin/stok */}
          <Link href="/admin/stok" className="btn-hero-sec">
            Cek ketersediaan
          </Link>
          {/* Sesuai ALUR-NAVIGASI.md: + Booking baru -> /admin/booking/baru */}
          <Link href="/admin/booking/baru" className="btn-hero-pri">
            + Booking baru
          </Link>
        </div>
        {/* Subtle Mountain Contour Lines in Background */}
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

      {/* ─── 4 KPI Metrics (Sesuai ALUR-NAVIGASI.md: Kartu KPI tidak bisa diklik) ─── */}
      <section className="kpi-grid">
        {/* Card 1: Booking perlu diproses (Dark) - Sesuai §B.1.1 */}
        <div className="kpi-card kpi-dark">
          <div className="kpi-top">
            <span className="kpi-label">Booking perlu diproses</span>
            <div className="kpi-icon-wrap dark-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">3</div>
          <div className="kpi-desc">3 Selesai (siap sewa) · 2 Dibatalkan</div>
        </div>

        {/* Card 2: Pengambilan hari ini */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Pengambilan hari ini</span>
            <div className="kpi-icon-wrap green-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">4</div>
          <div className="kpi-bottom-row">
            <span className="kpi-desc">1 sudah diambil</span>
            {/* Sparkline curve */}
            <svg className="sparkline" viewBox="0 0 80 24" fill="none">
              <path d="M2 18 C 20 8, 40 22, 60 10 S 78 4, 78 4" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Pengembalian hari ini */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Pengembalian hari ini</span>
            <div className="kpi-icon-wrap amber-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">6</div>
          <div className="kpi-bottom-row">
            <span className="kpi-desc">2 sudah dikembalikan</span>
            <svg className="sparkline" viewBox="0 0 80 24" fill="none">
              <path d="M2 16 C 18 22, 35 6, 52 14 S 78 8, 78 8" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Terlambat dikembalikan */}
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Terlambat dikembalikan</span>
            <div className="kpi-icon-wrap red-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10" />
                <path d="M12 20V4" />
                <path d="M6 20v-6" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">2</div>
          <div className="kpi-bottom-row">
            <span className="kpi-alert-tag">• Perlu tindak lanjut</span>
            <svg className="sparkline" viewBox="0 0 80 24" fill="none">
              <path d="M2 20 C 22 14, 42 22, 60 12 S 78 16, 78 16" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── Kondisi Stok Unit ─── */}
      <section className="content-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <span className="card-dot" />
              Kondisi stok unit
            </h2>
            <p className="card-subtitle">Barang sewa berdasarkan kondisi fisik unit</p>
          </div>
          {/* Sesuai ALUR-NAVIGASI.md: Lihat stok -> /admin/stok */}
          <Link href="/admin/stok" className="pill-link">
            Lihat stok
          </Link>
        </div>

        <div className="stok-body">
          {/* Donut Chart (Sesuai ALUR-NAVIGASI.md: Donat tidak bisa diklik) */}
          <div className="donut-container">
            <div className="donut-circle">
              <div className="donut-hole">
                <span className="donut-num">202</span>
                <span className="donut-label">total unit</span>
              </div>
            </div>
          </div>

          {/* 6 Status Cards */}
          <div className="stok-stats-grid">
            {/* Tersedia */}
            <div className="stat-pill stat-green">
              <div className="stat-head">
                <span className="stat-dot dot-green" />
                <span className="stat-name">Tersedia</span>
              </div>
              <div className="stat-value">142</div>
            </div>

            {/* Disewa */}
            <div className="stat-pill stat-blue">
              <div className="stat-head">
                <span className="stat-dot dot-blue" />
                <span className="stat-name">Disewa</span>
              </div>
              <div className="stat-value">38</div>
            </div>

            {/* Dicuci */}
            <div className="stat-pill stat-gray">
              <div className="stat-head">
                <span className="stat-dot dot-gray" />
                <span className="stat-name">Dicuci</span>
              </div>
              <div className="stat-value">9</div>
            </div>

            {/* Persiapan */}
            <div className="stat-pill stat-amber">
              <div className="stat-head">
                <span className="stat-dot dot-amber" />
                <span className="stat-name">Persiapan</span>
              </div>
              <div className="stat-value">6</div>
            </div>

            {/* Rusak */}
            <div className="stat-pill stat-red">
              <div className="stat-head">
                <span className="stat-dot dot-red" />
                <span className="stat-name">Rusak</span>
              </div>
              <div className="stat-value">4</div>
            </div>

            {/* Perawatan */}
            <div className="stat-pill stat-dark">
              <div className="stat-head">
                <span className="stat-dot dot-dark" />
                <span className="stat-name">Perawatan</span>
              </div>
              <div className="stat-value">3</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Grid 2 Kolom: Pengambilan & Pengembalian ─── */}
      <div className="two-col-grid">
        {/* Jadwal Pengambilan */}
        <section className="content-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-dot" />
              Jadwal pengambilan hari ini
            </h2>
            {/* Sesuai ALUR-NAVIGASI.md: Semua -> /admin/transaksi/sewa */}
            <Link href="/admin/transaksi/sewa" className="pill-link">
              Semua
            </Link>
          </div>
          <div className="list-group">
            {/* Item 1 */}
            <Link href="/admin/transaksi/sewa" className="list-item" style={{ textDecoration: "none" }}>
              <div className="avatar-circle av-green">RA</div>
              <div className="item-info">
                <span className="item-title">Rizky Ananda · BK-0241</span>
                <span className="item-sub">Tenda Dome 4P ×1, Carrier 60L ×2</span>
              </div>
              <div className="item-end">
                <span className="item-time">10.00</span>
                <span className="badge badge-amber">
                  <span className="badge-dot" />
                  Belum diambil
                </span>
              </div>
            </Link>

            {/* Item 2 */}
            <Link href="/admin/transaksi/sewa" className="list-item" style={{ textDecoration: "none" }}>
              <div className="avatar-circle av-amber">DP</div>
              <div className="item-info">
                <span className="item-title">Dewi Pratiwi · BK-0243</span>
                <span className="item-sub">Paket Pendakian 2 Orang ×1</span>
              </div>
              <div className="item-end">
                <span className="item-time">13.00</span>
                <span className="badge badge-amber">
                  <span className="badge-dot" />
                  Belum diambil
                </span>
              </div>
            </Link>

            {/* Item 3 */}
            <Link href="/admin/transaksi/sewa" className="list-item" style={{ textDecoration: "none" }}>
              <div className="avatar-circle av-cyan">BS</div>
              <div className="item-info">
                <span className="item-title">Budi Santoso · BK-0238</span>
                <span className="item-sub">Sleeping Bag ×3, Kompor ×1</span>
              </div>
              <div className="item-end">
                <span className="item-time">08.30</span>
                <span className="badge badge-green">
                  <span className="badge-dot" />
                  Sudah diambil
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Jadwal Pengembalian */}
        <section className="content-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-dot" />
              Jadwal pengembalian hari ini
            </h2>
            {/* Sesuai ALUR-NAVIGASI.md: Semua -> /admin/pengembalian */}
            <Link href="/admin/pengembalian" className="pill-link">
              Semua
            </Link>
          </div>
          <div className="list-group">
            {/* Item 1 */}
            <Link href="/admin/pengembalian" className="list-item" style={{ textDecoration: "none" }}>
              <div className="avatar-circle av-green">AN</div>
              <div className="item-info">
                <span className="item-title">Andi Nugraha · TS-0412</span>
                <span className="item-sub">Tenda Dome 2P ×2, Matras ×4</span>
              </div>
              <div className="item-end">
                <span className="item-time">s.d. 21.00</span>
                <span className="badge badge-blue">
                  <span className="badge-dot" />
                  Menunggu
                </span>
              </div>
            </Link>

            {/* Item 2 */}
            <Link href="/admin/pengembalian" className="list-item" style={{ textDecoration: "none" }}>
              <div className="avatar-circle av-amber">SW</div>
              <div className="item-info">
                <span className="item-title">Sari Wulandari · TS-0409</span>
                <span className="item-sub">Paket Camping Keluarga ×1</span>
              </div>
              <div className="item-end">
                <span className="item-time">s.d. 21.00</span>
                <span className="badge badge-blue">
                  <span className="badge-dot" />
                  Menunggu
                </span>
              </div>
            </Link>

            {/* Item 3 */}
            <Link href="/admin/pengembalian" className="list-item" style={{ textDecoration: "none" }}>
              <div className="avatar-circle av-cyan">HK</div>
              <div className="item-info">
                <span className="item-title">Hendra K. · TS-0405</span>
                <span className="item-sub">Carrier 50L ×1</span>
              </div>
              <div className="item-end">
                <span className="item-time">09.00</span>
                <span className="badge badge-green">
                  <span className="badge-dot" />
                  Dikembalikan
                </span>
              </div>
            </Link>
          </div>
        </section>
      </div>

      {/* ─── Grid 2 Kolom: Keterlambatan & Tindak Lanjut ─── */}
      <div className="two-col-grid">
        {/* Keterlambatan Pengembalian */}
        <section className="content-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-dot" />
              Keterlambatan pengembalian
            </h2>
          </div>
          <div className="list-group">
            {/* Item 1 - Sesuai ALUR-NAVIGASI.md: Proses -> /admin/pengembalian/TS-0398 */}
            <div className="action-row">
              <div className="item-info">
                <span className="item-title">Fajar M. · TS-0398</span>
                <span className="item-sub">Tanggal kembali 31 Okt 2026 (lewat tanggal)</span>
              </div>
              <div className="row-action-end">
                <span className="badge badge-red">
                  <span className="badge-dot" />
                  Terlambat 2 hari
                </span>
                <Link href="/admin/pengembalian/TS-0398" className="btn-outline-sm">
                  Proses
                </Link>
              </div>
            </div>

            {/* Item 2 - Sesuai ALUR-NAVIGASI.md: Proses -> /admin/pengembalian/TS-0401 */}
            <div className="action-row">
              <div className="item-info">
                <span className="item-title">Lina Marlina · TS-0401</span>
                <span className="item-sub">Tanggal kembali 1 Nov 2026 (lewat tanggal)</span>
              </div>
              <div className="row-action-end">
                <span className="badge badge-red">
                  <span className="badge-dot" />
                  Terlambat 1 hari
                </span>
                <Link href="/admin/pengembalian/TS-0401" className="btn-outline-sm">
                  Proses
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Perlu Ditindaklanjuti */}
        <section className="content-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-dot" />
              Perlu ditindaklanjuti
            </h2>
          </div>
          <div className="list-group">
            {/* Item 1 - Sesuai §B.1.8 & §E.25: Booking Selesai siap diserahterimakan */}
            <div className="action-row">
              <div className="item-info">
                <span className="item-title">2 booking Selesai siap diserahkan hari ini</span>
                <span className="item-sub">Proses ke Transaksi Sewa saat serah terima barang</span>
              </div>
              <Link href="/admin/booking" className="btn-outline-sm">
                Buka
              </Link>
            </div>

            {/* Item 2 - Sesuai §B.1.8 & §E.12: Booking Draft */}
            <div className="action-row">
              <div className="item-info">
                <span className="item-title">2 booking berstatus Draft</span>
                <span className="item-sub">Lengkapi kesepakatan pemesanan &amp; catat resmi</span>
              </div>
              <Link href="/admin/booking" className="btn-outline-sm">
                Buka
              </Link>
            </div>

            {/* Item 3 - Sesuai §B.1.8 & §E.12: Booking lewat jadwal pengambilan */}
            <div className="action-row">
              <div className="item-info">
                <span className="item-title">1 booking lewat jadwal pengambilan</span>
                <span className="item-sub">Perlu konfirmasi pelanggan / batalkan &amp; lepaskan alokasi stok</span>
              </div>
              <Link href="/admin/booking" className="btn-outline-sm">
                Buka
              </Link>
            </div>

            {/* Item 4 - Sesuai §B.1.8: Unit belum siap digunakan */}
            <div className="action-row">
              <div className="item-info">
                <span className="item-title">6 unit belum siap digunakan</span>
                <span className="item-sub">Dicuci, persiapan, atau perawatan</span>
              </div>
              <Link href="/admin/stok" className="btn-outline-sm">
                Buka
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Grid 2 Kolom: Transaksi & Pengeluaran Terbaru ─── */}
      <div className="two-col-grid">
        {/* Transaksi Terbaru */}
        <section className="content-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-dot" />
              Transaksi terbaru
            </h2>
            {/* Sesuai ALUR-NAVIGASI.md: Semua -> /admin/transaksi/sewa */}
            <Link href="/admin/transaksi/sewa" className="pill-link">
              Semua
            </Link>
          </div>
          <div className="list-group">
            {/* Item 1 */}
            <Link href="/admin/transaksi/sewa" className="transaction-row" style={{ textDecoration: "none" }}>
              <div className="item-info">
                <span className="mono-code">TS-0412</span>
                <span className="trans-sub">Andi Nugraha · Sewa</span>
              </div>
              <div className="trans-center">
                <span className="trans-nominal">Rp 420.000</span>
              </div>
              <span className="badge badge-amber">
                <span className="badge-dot" />
                Belum lunas
              </span>
            </Link>

            {/* Item 2 */}
            <Link href="/admin/transaksi/jual" className="transaction-row" style={{ textDecoration: "none" }}>
              <div className="item-info">
                <span className="mono-code">TJ-0127</span>
                <span className="trans-sub">Maya S. · Jual</span>
              </div>
              <div className="trans-center">
                <span className="trans-nominal">Rp 185.000</span>
              </div>
              <span className="badge badge-green">
                <span className="badge-dot" />
                Lunas
              </span>
            </Link>

            {/* Item 3 */}
            <Link href="/admin/transaksi/sewa" className="transaction-row" style={{ textDecoration: "none" }}>
              <div className="item-info">
                <span className="mono-code">TS-0411</span>
                <span className="trans-sub">Rizky Ananda · Sewa</span>
              </div>
              <div className="trans-center">
                <span className="trans-nominal">Rp 650.000</span>
              </div>
              <span className="badge badge-green">
                <span className="badge-dot" />
                Lunas
              </span>
            </Link>
          </div>
        </section>

        {/* Pengeluaran Terbaru */}
        <section className="content-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-dot" />
              Pengeluaran terbaru
            </h2>
            {/* Sesuai ALUR-NAVIGASI.md: Semua -> /admin/pengeluaran */}
            <Link href="/admin/pengeluaran" className="pill-link">
              Semua
            </Link>
          </div>
          <div className="list-group">
            {/* Item 1 */}
            <Link href="/admin/pengeluaran" className="transaction-row" style={{ textDecoration: "none" }}>
              <div className="item-info">
                <span className="item-title">Deterjen &amp; jasa cuci</span>
                <span className="item-sub">Perawatan · 1 Nov</span>
              </div>
              <div className="trans-center">
                <span className="trans-nominal">Rp 240.000</span>
              </div>
              <span className="badge badge-green">
                <span className="badge-dot" />
                Dibayar
              </span>
            </Link>

            {/* Item 2 */}
            <Link href="/admin/pengeluaran" className="transaction-row" style={{ textDecoration: "none" }}>
              <div className="item-info">
                <span className="item-title">Perbaikan resleting tenda</span>
                <span className="item-sub">Perbaikan · 31 Okt</span>
              </div>
              <div className="trans-center">
                <span className="trans-nominal">Rp 90.000</span>
              </div>
              <span className="badge badge-green">
                <span className="badge-dot" />
                Dibayar
              </span>
            </Link>

            {/* Item 3 */}
            <Link href="/admin/pengeluaran" className="transaction-row" style={{ textDecoration: "none" }}>
              <div className="item-info">
                <span className="item-title">Listrik toko</span>
                <span className="item-sub">Operasional · 30 Okt</span>
              </div>
              <div className="trans-center">
                <span className="trans-nominal">Rp 510.000</span>
              </div>
              <span className="badge badge-amber">
                <span className="badge-dot" />
                Belum dibayar
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
