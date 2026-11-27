import Link from "next/link";

export default function AdminPelangganPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · PELANGGAN</span>
          <h1 className="hero-title">Data Pelanggan</h1>
          <p className="hero-sub">
            Direktori pelanggan rental, data kontak, dan riwayat transaksi
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
          <h2 className="ct">Daftar Pelanggan Terdaftar</h2>
          <span className="b in">Database Pelanggan</span>
        </div>
        <div className="pad">
          <p className="sub">
            Pencarian data pelanggan berdasarkan nama atau nomor WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
