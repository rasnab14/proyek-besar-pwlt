import Link from "next/link";

export default function OwnerPenggunaPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · KELOLA PENGGUNA</span>
          <h1 className="hero-title">Daftar Pengguna</h1>
          <p className="hero-sub">
            Manajemen akun staf kasir, admin, dan hak akses aplikasi
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
          <h2 className="ct">Daftar Akun Karyawan &amp; Hak Akses</h2>
          <span className="b ok">2 Akun Aktif</span>
        </div>
        <div className="pad">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "14px 18px", borderRadius: "10px", background: "var(--n50)", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--k)" }}>Admin Toko</div>
                <div style={{ fontSize: "12px", color: "var(--n600)" }}>admin@summit.local · Peran: Admin Operasional Kasir</div>
              </div>
              <span className="b in">Staf Aktif</span>
            </div>
            <div style={{ padding: "14px 18px", borderRadius: "10px", background: "var(--n50)", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--k)" }}>Pemilik Toko</div>
                <div style={{ fontSize: "12px", color: "var(--n600)" }}>owner@summit.local · Peran: Owner (Akses Penuh)</div>
              </div>
              <span className="b ok">Owner</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
