import Link from "next/link";

export default function AdminTransaksiSewaPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · TRANSAKSI</span>
          <h1 className="hero-title">Transaksi Penyewaan</h1>
          <p className="hero-sub">
            Kelola penyewaan aktif, pelunasan sisa pembayaran, dan penyerahan barang
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/admin/booking" className="btn sm">
            Dari booking
          </Link>
          <Link href="/admin/dashboard" className="btn pri sm">
            ← Dashboard
          </Link>
        </div>
      </section>

      <div className="card">
        <div className="ch">
          <h2 className="ct">Jadwal Pengambilan &amp; Transaksi Berjalan</h2>
          <span className="b in">38 Unit Disewa</span>
        </div>
        <div className="pad">
          <p className="sub">
            Menampilkan daftar transaksi penyewaan aktif, status belum lunas, dan riwayat penyerahan hari ini.
          </p>
        </div>
      </div>
    </div>
  );
}
