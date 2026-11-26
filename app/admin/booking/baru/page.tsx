import Link from "next/link";

export default function AdminBookingBaruPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · KASIR BOOKING</span>
          <h1 className="hero-title">Booking Baru</h1>
          <p className="hero-sub">
            Form pencatatan reservasi sewa dan pembayaran DP pelanggan
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/admin/booking" className="btn sm">
            ← Menu Booking
          </Link>
          <Link href="/admin/dashboard" className="btn sm">
            Dashboard
          </Link>
        </div>
      </section>

      <div className="card">
        <div className="ch">
          <h2 className="ct">Form Reservasi &amp; Kasir Booking</h2>
          <span className="b wn">Mode: Booking</span>
        </div>
        <div className="pad">
          <p className="sub">
            Pilih pelanggan, rentang tanggal sewa, dan barang yang akan dibooking.
          </p>
        </div>
      </div>
    </div>
  );
}
