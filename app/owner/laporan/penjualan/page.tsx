import Link from "next/link";

export default function OwnerLaporanPenjualanPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · LAPORAN PENJUALAN</span>
          <h1 className="hero-title">Laporan Penjualan</h1>
          <p className="hero-sub">
            Analitik volume penjualan produk retail dan pendapatan toko
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/owner/dashboard" className="btn sm">
            ← Dashboard Owner
          </Link>
        </div>
      </section>

      <div className="card">
        <div className="ch">
          <h2 className="ct">Volume Penjualan Produk Retail</h2>
          <span className="b ok">38 Transaksi</span>
        </div>
        <div className="pad">
          <p className="sub">
            Produk terlaris: Gas Kaleng 230g (52 pcs), Headlamp LED (17 pcs), Raincoat (11 pcs).
          </p>
        </div>
      </div>
    </div>
  );
}
