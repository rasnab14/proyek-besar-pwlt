// components/transaksi/SewaTableOwner.tsx
"use client";

import React from "react";
import { TransaksiSewaRecord } from "./types";

interface SewaTableOwnerProps {
  records: TransaksiSewaRecord[];
  onSelectRecord: (record: TransaksiSewaRecord) => void;
}

export function SewaTableOwner({ records, onSelectRecord }: SewaTableOwnerProps) {
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="tx-table-card">
      <div className="tx-table-responsive">
        <table className="tx-table">
          <thead>
            <tr>
              <th>KODE</th>
              <th>PELANGGAN</th>
              <th>PERIODE SEWA</th>
              <th>TOTAL TAGIHAN</th>
              <th>DP</th>
              <th>SISA</th>
              <th>PENGAMBILAN</th>
              <th>STATUS</th>
              <th style={{ textAlign: "right" }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
                  Tidak ada transaksi penyewaan yang ditemukan.
                </td>
              </tr>
            ) : (
              records.map((r) => {
                // Formatting DP
                let dpDisplay = "-";
                if (r.dpNominal > 0) {
                  dpDisplay = formatRupiah(r.dpNominal);
                } else if (r.tipeAsal === "booking" && r.dpNominal === 0) {
                  dpDisplay = "Tanpa DP";
                }

                // Pengambilan Badge
                const isDiambil = r.statusPengambilan === "sudah_diambil";

                // Status Badge (Lunas vs Belum Lunas)
                const isLunas = r.status === "lunas" || r.sisaTagihan === 0;

                return (
                  <tr key={r.id}>
                    {/* KODE */}
                    <td>
                      <div className="tx-code-wrap">
                        <button
                          type="button"
                          className="tx-code-link"
                          style={{ background: "none", border: "none", padding: 0, textAlign: "left" }}
                          onClick={() => onSelectRecord(r)}
                        >
                          {r.kode}
                        </button>
                        <span className="tx-code-sub">{r.bookingTag}</span>
                      </div>
                    </td>

                    {/* PELANGGAN */}
                    <td>
                      <span className="tx-pelanggan-name">{r.pelanggan.nama}</span>
                    </td>

                    {/* PERIODE SEWA */}
                    <td>{r.periodeDisplay}</td>

                    {/* TOTAL TAGIHAN */}
                    <td style={{ fontWeight: 500 }}>{formatRupiah(r.totalTagihan)}</td>

                    {/* DP */}
                    <td>{dpDisplay}</td>

                    {/* SISA */}
                    <td style={{ fontWeight: 500, color: r.sisaTagihan > 0 ? "#D97706" : "inherit" }}>
                      {formatRupiah(r.sisaTagihan)}
                    </td>

                    {/* PENGAMBILAN */}
                    <td>
                      <span className="tx-dot-badge">
                        <span className={`tx-dot ${isDiambil ? "tx-dot-green" : "tx-dot-amber"}`} />
                        {isDiambil ? "Sudah diambil" : "Belum diambil"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span className="tx-dot-badge">
                        <span className={`tx-dot ${isLunas ? "tx-dot-green" : "tx-dot-amber"}`} />
                        {isLunas ? "Lunas" : "Belum Lunas"}
                      </span>
                    </td>

                    {/* AKSI (Owner hanya Lihat Detail) */}
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="tx-btn-secondary"
                        style={{ padding: "4px 10px", fontSize: "12px" }}
                        onClick={() => onSelectRecord(r)}
                        title="Lihat Detail Transaksi"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="tx-pagination">
        <span>
          Menampilkan 1-{records.length} dari {records.length} transaksi
        </span>
        <div className="tx-pagination-buttons">
          <button type="button" className="tx-page-btn" disabled>
            Sebelumnya
          </button>
          <button type="button" className="tx-page-btn" disabled>
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
