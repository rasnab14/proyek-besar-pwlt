import Link from "next/link";

export default function OwnerProfilPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · PROFIL AKUN</span>
          <h1 className="hero-title">Profil Akun Pemilik</h1>
          <p className="hero-sub">
            Informasi akun dan kepemilikan toko Summit Rental &amp; Store
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
          <h2 className="ct">Data Akun Owner</h2>
          <span className="b ok">Akses Penuh</span>
        </div>
        <div className="pad">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "400px" }}>
            <div>
              <span className="kl">Nama Pemilik</span>
              <div style={{ fontWeight: 600, fontSize: "15px", marginTop: "2px" }}>Pemilik Toko</div>
            </div>
            <div>
              <span className="kl">Peran / Otoritas</span>
              <div style={{ fontWeight: 600, fontSize: "15px", marginTop: "2px" }}>Owner (Administrator Utama)</div>
            </div>
            <div>
              <span className="kl">Cabang Usaha</span>
              <div style={{ fontWeight: 600, fontSize: "15px", marginTop: "2px" }}>19 Summit Adventure — Pusat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
