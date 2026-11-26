import Link from "next/link";

export default function OwnerRiwayatPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · RIWAYAT AKTIVITAS</span>
          <h1 className="hero-title">Riwayat Aktivitas</h1>
          <p className="hero-sub">
            Audit trail dan log aktivitas seluruh staf dan pemilik toko
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
          <h2 className="ct">Log Seluruh Aktivitas Pengguna</h2>
          <span className="b in">Real-time Log</span>
        </div>
        <div className="pad">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="note ok">
              <span><strong>Admin Toko</strong> mencatat transaksi penjualan TJ-0127 (2 Nov, 09.14)</span>
            </div>
            <div className="note wn">
              <span><strong>Pemilik Toko</strong> membatalkan booking BK-0239 · DP hangus Rp 60.000 (1 Nov, 16.20)</span>
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
