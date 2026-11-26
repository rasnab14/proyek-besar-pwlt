import Link from "next/link";

export default function AdminBookingPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · BOOKING</span>
          <h1 className="hero-title">Booking</h1>
          <p className="hero-sub">
            Daftar reservasi dan jadwal penyewaan mendatang
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/admin/transaksi/sewa" className="btn sm">
            Pelunasan (Transaksi Sewa)
          </Link>
          <Link href="/admin/booking/baru" className="btn pri sm">
            + Catat booking
          </Link>
        </div>
      </section>

      <div className="card">
        <div className="ch">
          <h2 className="ct">Daftar Booking Aktif</h2>
          <Link href="/admin/dashboard" className="pill-link">
            ← Dashboard
          </Link>
        </div>
        <div className="pad">
          <p className="sub">
            Terdapat 5 booking yang perlu ditindaklanjuti (3 status Draft, 2 menunggu DP 25%).
          </p>
        </div>
      </div>
    </div>
  );
}
