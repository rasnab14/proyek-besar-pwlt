import Link from "next/link";

export default function AdminTransaksiJualPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · PENJUALAN</span>
          <h1 className="hero-title">Transaksi Penjualan</h1>
          <p className="hero-sub">
            Catatan penjualan langsung perlengkapan outdoor, gas kaleng, dan aksesori
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/admin/dashboard" className="btn sm">
            ← Dashboard
          </Link>
        </div>
      </section>

      <div className="card">
        <div className="ch">
          <h2 className="ct">Daftar Transaksi Penjualan</h2>
          <span className="b ok">Aktif</span>
        </div>
        <div className="pad">
          <p className="sub">
            Kelola penjualan langsung barang retail toko Summit Rental &amp; Store.
          </p>
        </div>
      </div>
    </div>
  );
}
