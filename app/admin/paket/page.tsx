import Link from "next/link";

export default function AdminPaketPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · PAKET SEWA</span>
          <h1 className="hero-title">Paket Penyewaan</h1>
          <p className="hero-sub">
            Paket bundling hemat sewa alat pendakian dan camping
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
          <h2 className="ct">Daftar Paket Bundling</h2>
          <span className="b ok">Paket Tersedia</span>
        </div>
        <div className="pad">
          <p className="sub">
            Paket Pendakian 2 Orang, Paket Camping Keluarga, dan Paket Solo Hiker.
          </p>
        </div>
      </div>
    </div>
  );
}
