import Link from "next/link";

export default function AdminRiwayatPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · LOG AKTIVITAS</span>
          <h1 className="hero-title">Riwayat Aktivitas</h1>
          <p className="hero-sub">
            Catatan log perubahan data, transaksi kasir, dan penyerahan barang toko
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
          <h2 className="ct">Log Aktivitas Admin</h2>
          <span className="b in">Audit Log</span>
        </div>
        <div className="pad">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="note ok">
              <span><strong>Admin Toko</strong> mencatat transaksi penjualan TJ-0127 (2 Nov, 09.14)</span>
            </div>
            <div className="note">
              <span><strong>Admin Toko</strong> mengubah kondisi unit SPT003 menjadi Dicuci (1 Nov, 13.02)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
