import Link from "next/link";

export default function OwnerKategoriPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · KATEGORI</span>
          <h1 className="hero-title">Kategori Barang</h1>
          <p className="hero-sub">
            Pengelompokan kategori produk outdoor dan struktur inventaris
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
          <h2 className="ct">Struktur Kategori Inventaris</h2>
          <span className="b in">Kelola Kategori</span>
        </div>
        <div className="pad">
          <p className="sub">
            Master kategori untuk tenda, alat pendakian, penerangan, dan perlengkapan lainnya.
          </p>
        </div>
      </div>
    </div>
  );
}
