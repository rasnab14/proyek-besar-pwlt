import Link from "next/link";

export default function OwnerLaporanKeuanganPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · LAPORAN KEUANGAN</span>
          <h1 className="hero-title">Laporan Keuangan</h1>
          <p className="hero-sub">
            Ringkasan pendapatan, pengeluaran operasional, laba bersih, dan arus kas
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
          <h2 className="ct">Ringkasan Arus Kas November 2026</h2>
          <span className="b ok">Laba Bersih 75.7%</span>
        </div>
        <div className="pad">
          <div className="g3">
            <div className="kpi">
              <span className="kl">Total Pendapatan</span>
              <div className="kv" style={{ color: "var(--st-ok-t)" }}>Rp 19.180.000</div>
              <span className="kn">Akumulasi penerimaan kas</span>
            </div>
            <div className="kpi">
              <span className="kl">Total Pengeluaran</span>
              <div className="kv" style={{ color: "var(--st-er-t)" }}>Rp 4.860.000</div>
              <span className="kn">Biaya operasional &amp; perawatan</span>
            </div>
            <div className="kpi">
              <span className="kl">Estimasi Laba Bersih</span>
              <div className="kv" style={{ color: "var(--acc-t)" }}>Rp 14.320.000</div>
              <span className="kn">Pertumbuhan stabil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
