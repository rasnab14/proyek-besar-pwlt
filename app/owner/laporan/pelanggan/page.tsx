import Link from "next/link";

export default function OwnerLaporanPelangganPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · LAPORAN PELANGGAN</span>
          <h1 className="hero-title">Laporan Pelanggan</h1>
          <p className="hero-sub">
            Pertumbuhan pelanggan baru, frekuensi sewa, dan tingkat retensi pelanggan
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
          <h2 className="ct">Segmentasi &amp; Retensi Pelanggan</h2>
          <span className="b in">Tier Loyalitas</span>
        </div>
        <div className="pad">
          <p className="sub">
            Retensi pelanggan mencapai 84% dengan rata-rata frekuensi sewa 2.4x per tahun.
          </p>
        </div>
      </div>
    </div>
  );
}
