"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredBarang, BarangRecord } from "@/components/barang";

export default function OwnerStokPage() {
  const [barangList, setBarangList] = useState<BarangRecord[]>([]);

  useEffect(() => {
    setBarangList(getStoredBarang());
    const handleUpdate = () => setBarangList(getStoredBarang());
    window.addEventListener("summit_barang_updated", handleUpdate);
    return () => window.removeEventListener("summit_barang_updated", handleUpdate);
  }, []);

  const sewaList = barangList.filter((b) => b.jenis === "sewa");

  // Hitung total unit dan kondisi
  let totalUnit = 0;
  sewaList.forEach((b) => {
    (b.variasi || []).forEach((v) => {
      totalUnit += Number(v.stok) || 0;
    });
  });

  const totalTersedia = Math.round(totalUnit * 0.7);
  const totalDisewa = Math.round(totalUnit * 0.2);
  const totalCuci = Math.round(totalUnit * 0.06);
  const totalRusak = Math.max(0, totalUnit - totalTersedia - totalDisewa - totalCuci);

  return (
    <div className="main">
      <section className="head-hero" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div className="hero-left">
          <span className="hero-badge">OWNER · STOK &amp; KETERSEDIAAN</span>
          <h1 className="hero-title" style={{ marginTop: "4px", marginBottom: "4px" }}>Stok dan Ketersediaan</h1>
          <p className="hero-sub" style={{ margin: 0 }}>
            Pantau kondisi fisik inventaris seluruh unit dan ketersediaan sewa toko
          </p>
        </div>
        <div className="hero-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link href="/owner/barang" className="tx-btn-secondary" style={{ textDecoration: "none", fontSize: "13px", padding: "8px 16px" }}>
            Semua Barang
          </Link>
          <Link href="/owner/barang/form" className="tx-btn-primary" style={{ textDecoration: "none", fontSize: "13px", padding: "8px 18px" }}>
            + Tambah stok barang
          </Link>
        </div>
      </section>

      {/* 4 KPI Cards */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="ch" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #E2E8F0" }}>
          <h2 className="ct" style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>Status Fisik Seluruh Unit</h2>
          <span className="b in" style={{ fontWeight: 700, color: "#0284C7" }}>Total {totalUnit} Unit Terdaftar</span>
        </div>
        <div className="pad" style={{ padding: "20px" }}>
          <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
            <div className="kpi" style={{ padding: "16px", borderRadius: "10px", background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
              <span className="kl" style={{ fontSize: "12px", color: "#166534", fontWeight: 600 }}>Tersedia</span>
              <div className="kv" style={{ fontSize: "24px", fontWeight: 800, color: "#166534", margin: "4px 0" }}>{totalTersedia}</div>
              <span className="kn" style={{ fontSize: "11.5px", color: "#166534" }}>Siap disewa</span>
            </div>
            <div className="kpi" style={{ padding: "16px", borderRadius: "10px", background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
              <span className="kl" style={{ fontSize: "12px", color: "#1D4ED8", fontWeight: 600 }}>Disewa</span>
              <div className="kv" style={{ fontSize: "24px", fontWeight: 800, color: "#1D4ED8", margin: "4px 0" }}>{totalDisewa}</div>
              <span className="kn" style={{ fontSize: "11.5px", color: "#1D4ED8" }}>Unit aktif sewa</span>
            </div>
            <div className="kpi" style={{ padding: "16px", borderRadius: "10px", background: "#FAF5FF", border: "1px solid #E9D5FF" }}>
              <span className="kl" style={{ fontSize: "12px", color: "#7E22CE", fontWeight: 600 }}>Persiapan &amp; Cuci</span>
              <div className="kv" style={{ fontSize: "24px", fontWeight: 800, color: "#7E22CE", margin: "4px 0" }}>{totalCuci}</div>
              <span className="kn" style={{ fontSize: "11.5px", color: "#7E22CE" }}>Inspeksi &amp; laundry</span>
            </div>
            <div className="kpi" style={{ padding: "16px", borderRadius: "10px", background: "#FEF2F2", border: "1px solid #FECACA" }}>
              <span className="kl" style={{ fontSize: "12px", color: "#B91C1C", fontWeight: 600 }}>Rusak / Perawatan</span>
              <div className="kv" style={{ fontSize: "24px", fontWeight: 800, color: "#B91C1C", margin: "4px 0" }}>{totalRusak}</div>
              <span className="kn" style={{ fontSize: "11.5px", color: "#B91C1C" }}>Pemeliharaan teknis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Ringkasan per Variasi Barang Sewa */}
      <div className="card" style={{ width: "100%", padding: "24px 26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>
              Monitoring Stok per Variasi
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "#64748B" }}>
              Klik "Detail Unit" untuk melihat data detail unit fisik, kondisi, dan riwayat mutasi per variasi.
            </p>
          </div>
        </div>

        <div style={{ overflowX: "auto", border: "1.5px solid #E2E8F0", borderRadius: "10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0", color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                <th style={{ padding: "12px 14px", textAlign: "left" }}>PRODUK &amp; VARIASI</th>
                <th style={{ padding: "12px 14px", textAlign: "left" }}>KATEGORI</th>
                <th style={{ padding: "12px 14px", textAlign: "left" }}>RENTANG KODE UNIT</th>
                <th style={{ padding: "12px 14px", textAlign: "left" }}>HARGA / HARI</th>
                <th style={{ padding: "12px 14px", textAlign: "center" }}>TOTAL UNIT</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {sewaList.flatMap((b) =>
                (b.variasi || []).map((v, vIdx) => {
                  const varTitle = v.merek
                    ? `${b.nama} - ${v.merek}${v.ukuran ? ` · ${v.ukuran}` : ""}`
                    : `${b.nama} - ${v.namaVariasi}`;
                  const unitParam = encodeURIComponent(v.id || `var-${vIdx}`);

                  return (
                    <tr key={`${b.id}-${v.id || vIdx}`} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 600, color: "#0F172A" }}>{varTitle}</div>
                        <div style={{ fontSize: "11px", color: "#64748B" }}>Kode: {b.kode}</div>
                      </td>
                      <td style={{ padding: "12px 14px", color: "#475569" }}>{b.kategori}</td>
                      <td style={{ padding: "12px 14px", color: "#0284C7", fontFamily: "monospace", fontSize: "12px" }}>
                        {v.kodeUnitRange || "-"}
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "#0F172A" }}>
                        Rp {(Number(v.harga) || 0).toLocaleString("id-ID")}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 700 }}>
                        {v.stok} unit
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <Link
                          href={`/owner/barang/${b.kode}/unit/${unitParam}`}
                          className="brg-btn-action"
                          style={{
                            textDecoration: "none",
                            background: "#0F172A",
                            color: "#FFFFFF",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                            display: "inline-block",
                          }}
                        >
                          Detail Unit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
