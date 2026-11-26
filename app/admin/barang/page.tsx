import Link from "next/link";

export default function AdminBarangPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · DATA BARANG</span>
          <h1 className="hero-title">Semua Barang</h1>
          <p className="hero-sub">
            Katalog lengkap master data barang sewa dan barang jual
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
          <h2 className="ct">Katalog Produk &amp; Unit</h2>
          <span className="b in">Master Data</span>
        </div>
        <div className="pad">
          <p className="sub">
            Daftar seluruh item tenda, tas carrier, sleeping bag, kompor, dan perlengkapan lainnya.
          </p>
        </div>
      </div>
    </div>
  );
}
