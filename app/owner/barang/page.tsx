import Link from "next/link";

export default function OwnerBarangPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · DATA BARANG</span>
          <h1 className="hero-title">Semua Barang</h1>
          <p className="hero-sub">
            Katalog dan inventaris seluruh barang sewa dan produk retail toko
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
          <h2 className="ct">Inventaris Produk Toko</h2>
          <span className="b in">Master Data</span>
        </div>
        <div className="pad">
          <p className="sub">
            Kelola master data barang, harga sewa, variasi ukuran, dan stok barang jual.
          </p>
        </div>
      </div>
    </div>
  );
}
