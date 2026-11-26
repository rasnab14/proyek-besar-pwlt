import Link from "next/link";

export default function AdminPengembalianPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · PENGEMBALIAN</span>
          <h1 className="hero-title">Pengembalian Unit</h1>
          <p className="hero-sub">
            Pemeriksaan fisik unit kembali, denda keterlambatan, dan pencatatan kondisi
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
          <h2 className="ct">Antrean Pengembalian Hari Ini</h2>
          <span className="b wn">4 Menunggu Pengecekan</span>
        </div>
        <div className="pad">
          <p className="sub">
            6 transaksi dijadwalkan kembali hari ini (2 sudah selesai, 4 menunggu pengecekan fisik).
          </p>
        </div>
      </div>
    </div>
  );
}
