import Link from "next/link";

export default function OwnerStokPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · STOK &amp; KETERSEDIAAN</span>
          <h1 className="hero-title">Stok dan Ketersediaan</h1>
          <p className="hero-sub">
            Pantau kondisi fisik 202 unit inventaris dan ketersediaan sewa
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
          <h2 className="ct">Status Fisik Seluruh Unit</h2>
          <span className="b in">Total 202 Unit</span>
        </div>
        <div className="pad">
          <div className="g4">
            <div className="kpi">
              <span className="kl">Tersedia</span>
              <div className="kv" style={{ color: "var(--st-ok-t)" }}>142</div>
              <span className="kn">Siap disewa</span>
            </div>
            <div className="kpi">
              <span className="kl">Disewa</span>
              <div className="kv" style={{ color: "var(--acc-t)" }}>38</div>
              <span className="kn">Unit aktif</span>
            </div>
            <div className="kpi">
              <span className="kl">Persiapan &amp; Cuci</span>
              <div className="kv" style={{ color: "var(--st-wn-t)" }}>15</div>
              <span className="kn">Inspeksi fisik</span>
            </div>
            <div className="kpi">
              <span className="kl">Rusak / Perawatan</span>
              <div className="kv" style={{ color: "var(--st-er-t)" }}>7</div>
              <span className="kn">Pemeliharaan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
