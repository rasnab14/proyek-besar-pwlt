import Link from "next/link";

export default function OwnerLaporanPenyewaanPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · LAPORAN PENYEWAAN</span>
          <h1 className="hero-title">Laporan Penyewaan</h1>
          <p className="hero-sub">
            Statistik dan analitik utilisasi unit penyewaan alat outdoor
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
          <h2 className="ct">Statistik Penyewaan Periode Berjalan</h2>
          <span className="b ok">Utilisasi 82%</span>
        </div>
        <div className="pad">
          <p className="sub">
            Analisis unit paling laris: Tenda Dome 4P (34x), Carrier 60L (29x), Sleeping Bag (27x).
          </p>
        </div>
      </div>
    </div>
  );
}
