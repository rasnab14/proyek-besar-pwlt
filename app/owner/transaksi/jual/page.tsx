import Link from "next/link";

export default function OwnerTransaksiJualPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · MONITORING JUAL</span>
          <h1 className="hero-title">Monitoring Penjualan</h1>
          <p className="hero-sub">
            Pemantauan transaksi penjualan produk retail dan perlengkapan habis pakai
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
          <h2 className="ct">Transaksi Penjualan Retail</h2>
          <span className="b ok">38 Transaksi Bulan Ini</span>
        </div>
        <div className="pad">
          <p className="sub">
            Daftar penjualan retail langsung perlengkapan outdoor Summit Rental &amp; Store.
          </p>
        </div>
      </div>
    </div>
  );
}
