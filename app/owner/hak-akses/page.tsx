import Link from "next/link";

export default function OwnerHakAksesPage() {
  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">OWNER · HAK AKSES</span>
          <h1 className="hero-title">Hak Akses Pengguna</h1>
          <p className="hero-sub">
            Matriks otorisasi peran Admin dan Owner pada fitur aplikasi
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
          <h2 className="ct">Matriks Hak Akses Modul</h2>
          <span className="b in">Role-Based Access</span>
        </div>
        <div className="pad">
          <p className="sub">
            Pengaturan izin tambah, ubah, hapus, dan cetak laporan per modul aplikasi.
          </p>
        </div>
      </div>
    </div>
  );
}
