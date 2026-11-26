import Link from "next/link";

export default function AdminStokPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · STOK</span>
          <h1 className="hero-title">Stok dan Ketersediaan</h1>
          <p className="hero-sub">
            Pantau unit barang sewa, kondisi fisik, dan ketersediaan stok
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/admin/dashboard" className="btn sm">
            ← Kembali ke Dashboard
          </Link>
        </div>
      </section>

      <div className="card">
        <div className="ch">
          <h2 className="ct">Ringkasan Unit Barang</h2>
          <span className="b in">Total 202 Unit</span>
        </div>
        <div className="pad">
          <div className="g4">
            <div className="kpi">
              <span className="kl">Tersedia</span>
              <div className="kv" style={{ color: "var(--st-ok-t)" }}>142</div>
              <span className="kn">Siap disewa langsung</span>
            </div>
            <div className="kpi">
              <span className="kl">Sedang Disewa</span>
              <div className="kv" style={{ color: "var(--acc-t)" }}>38</div>
              <span className="kn">Dalam masa peminjaman</span>
            </div>
            <div className="kpi">
              <span className="kl">Dicuci &amp; Persiapan</span>
              <div className="kv" style={{ color: "var(--st-wn-t)" }}>15</div>
              <span className="kn">Menunggu inspeksi</span>
            </div>
            <div className="kpi">
              <span className="kl">Rusak &amp; Perawatan</span>
              <div className="kv" style={{ color: "var(--st-er-t)" }}>7</div>
              <span className="kn">Perbaikan teknis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
