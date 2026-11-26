import Link from "next/link";

export default function AdminProfilPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">ADMIN · PENGATURAN</span>
          <h1 className="hero-title">Profil Akun</h1>
          <p className="hero-sub">
            Informasi akun petugas kasir dan admin Summit Rental &amp; Store
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
          <h2 className="ct">Data Akun Admin Toko</h2>
          <span className="b ok">Aktif</span>
        </div>
        <div className="pad">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "400px" }}>
            <div>
              <span className="kl">Nama Lengkap</span>
              <div style={{ fontWeight: 600, fontSize: "15px", marginTop: "2px" }}>Admin Toko</div>
            </div>
            <div>
              <span className="kl">Peran / Hak Akses</span>
              <div style={{ fontWeight: 600, fontSize: "15px", marginTop: "2px" }}>Admin Operasional Kasir</div>
            </div>
            <div>
              <span className="kl">Jam Operasional</span>
              <div style={{ fontWeight: 600, fontSize: "15px", marginTop: "2px" }}>08.00 – 21.00 WIB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
