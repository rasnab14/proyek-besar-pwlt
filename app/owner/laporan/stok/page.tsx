import Link from "next/link";

export default function OwnerLaporanStokPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · LAPORAN STOK</span>
          <h1 className="hero-title">Laporan Stok &amp; Depresiasi</h1>
          <p className="hero-sub">
            Audit kondisi fisik, tingkat keausan alat sewa, dan pengadaan unit baru
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
          <h2 className="ct">Audit Inventaris Unit</h2>
          <span className="b in">Total 202 Unit</span>
        </div>
        <div className="pad">
          <p className="sub">
            142 unit prima siap disewa, 38 unit tersewa, 15 unit proses cuci, 7 unit perbaikan.
          </p>
        </div>
      </div>
    </div>
  );
}
