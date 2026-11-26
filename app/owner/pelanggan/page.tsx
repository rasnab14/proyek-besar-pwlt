import Link from "next/link";

export default function OwnerPelangganPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · PELANGGAN</span>
          <h1 className="hero-title">Data Pelanggan</h1>
          <p className="hero-sub">
            Database profil pelanggan dan metrik loyalitas penyewa toko
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
          <h2 className="ct">Daftar Pelanggan &amp; Analitik Loyalitas</h2>
          <span className="b in">Pelanggan Aktif</span>
        </div>
        <div className="pad">
          <p className="sub">
            Rizky Ananda (11 transaksi), Andi Nugraha (7 transaksi), Maya Sari (5 transaksi).
          </p>
        </div>
      </div>
    </div>
  );
}
