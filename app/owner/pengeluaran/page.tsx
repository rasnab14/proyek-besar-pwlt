import Link from "next/link";

export default function OwnerPengeluaranPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · PENGELUARAN</span>
          <h1 className="hero-title">Pengeluaran Toko</h1>
          <p className="hero-sub">
            Audit dan persetujuan pengeluaran operasional toko
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
          <h2 className="ct">Rekapitulasi Biaya Operasional</h2>
          <span className="b wn">Total Rp 4.860.000</span>
        </div>
        <div className="pad">
          <p className="sub">
            Perawatan unit sewa, deterjen &amp; jasa cuci, perbaikan resleting tenda, dan tagihan listrik toko.
          </p>
        </div>
      </div>
    </div>
  );
}
