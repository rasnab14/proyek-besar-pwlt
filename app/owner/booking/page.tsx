import Link from "next/link";

export default function OwnerBookingPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · MONITORING</span>
          <h1 className="hero-title">Monitoring Booking</h1>
          <p className="hero-sub">
            Pemantauan reservasi sewa dan jadwal pengambilan (hanya lihat)
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
          <h2 className="ct">Daftar Reservasi Sewa</h2>
          <span className="b in">Hanya Lihat</span>
        </div>
        <div className="pad">
          <p className="sub">
            Memantau 5 booking aktif yang sedang diproses oleh staf admin toko.
          </p>
        </div>
      </div>
    </div>
  );
}
