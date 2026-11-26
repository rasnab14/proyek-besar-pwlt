import Link from "next/link";

export default function AdminKategoriPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · KATEGORI</span>
          <h1 className="hero-title">Kategori Barang</h1>
          <p className="hero-sub">
            Pengelompokan jenis peralatan outdoor dan inventaris toko
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
          <h2 className="ct">Daftar Kategori Produk</h2>
          <span className="b in">Kategori Aktif</span>
        </div>
        <div className="pad">
          <p className="sub">
            Tenda, Carrier, Sleeping Bag, Alat Masak, Aksesori, dan Pakaian Outdoor.
          </p>
        </div>
      </div>
    </div>
  );
}
