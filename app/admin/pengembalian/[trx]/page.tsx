import Link from "next/link";

export default async function AdminPengembalianTrxPage({
  params,
}: {
  params: Promise<{ trx: string }>;
}) {
  const { trx } = await params;

  return (
    <div className="main">
      <section className="head-hero">
        <div className="hero-left">
          <span className="hero-badge">FORM PENGEMBALIAN · {trx}</span>
          <h1 className="hero-title">Pengembalian — {trx}</h1>
          <p className="hero-sub">
            Pemeriksaan kondisi unit, denda keterlambatan, dan penyelesaian sewa
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/admin/pengembalian" className="btn sm">
            Daftar Pengembalian
          </Link>
          <Link href="/admin/dashboard" className="btn pri sm">
            ← Dashboard
          </Link>
        </div>
      </section>

      <div className="card">
        <div className="ch">
          <h2 className="ct">Detail Transaksi {trx}</h2>
          <span className="b er">Terlambat</span>
        </div>
        <div className="pad">
          <p className="sub">
            Keterlambatan terdeteksi. Silakan periksa kondisi fisik seluruh unit dan hitung biaya tambahan bila ada.
          </p>
        </div>
      </div>
    </div>
  );
}
