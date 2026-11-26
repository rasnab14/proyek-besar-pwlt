import Link from "next/link";

export default function AdminPengeluaranPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · PENGELUARAN</span>
          <h1 className="hero-title">Pengeluaran</h1>
          <p className="hero-sub">
            Pencatatan biaya operasional, perawatan alat, dan tagihan listrik toko
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
          <h2 className="ct">Daftar Pengeluaran Operasional</h2>
          <span className="b wn">Bulan November 2026</span>
        </div>
        <div className="pad">
          <p className="sub">
            Total biaya tercatat bulan ini: <strong>Rp 4.860.000</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
