import Link from "next/link";

export default function OwnerTransaksiSewaPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · MONITORING SEWA</span>
          <h1 className="hero-title">Monitoring Penyewaan</h1>
          <p className="hero-sub">
            Pemantauan transaksi penyewaan aktif, unit disewa, dan pengembalian
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
          <h2 className="ct">Transaksi Sewa Berjalan</h2>
          <span className="b in">96 Transaksi Bulan Ini</span>
        </div>
        <div className="pad">
          <p className="sub">
            Ringkasan status transaksi penyewaan barang dan pembayaran sewa oleh pelanggan.
          </p>
        </div>
      </div>
    </div>
  );
}
