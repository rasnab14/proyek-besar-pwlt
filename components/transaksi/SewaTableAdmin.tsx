// components/transaksi/SewaTableAdmin.tsx
"use client";

import React from "react";
import { TransaksiSewaRecord } from "./types";

interface SewaTableAdminProps {
  records: TransaksiSewaRecord[];
  onSelectRecord: (record: TransaksiSewaRecord) => void;
  onPrintReceipt: (record: TransaksiSewaRecord) => void;
  onProcessHandover?: (record: TransaksiSewaRecord) => void;
}

export function SewaTableAdmin({
  records,
  onSelectRecord,
  onPrintReceipt,
  onProcessHandover,
}: SewaTableAdminProps) {
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
                  Tidak ada transaksi penyewaan yang sesuai dengan filter.
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

                    {/* AKSI */}
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
                        {!isDiambil && onProcessHandover && (
                          <button
                            type="button"
                            className="tx-btn-secondary"
                            style={{ padding: "4px 8px", fontSize: "11.5px", background: "#FEF3C7", borderColor: "#FDE68A", color: "#92400E" }}
                            onClick={() => onProcessHandover(r)}
                            title="Proses serah terima & pelunasan di toko"
                          >
                            Serah Terima
                          </button>
                        )}
                        <button
                          type="button"
                          className="tx-btn-secondary"
                          style={{ padding: "4px 8px", fontSize: "11.5px" }}
                          onClick={() => onSelectRecord(r)}
                          title="Lihat Detail"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          className="tx-btn-secondary"
                          style={{ padding: "4px 8px", fontSize: "11.5px" }}
                          onClick={() => onPrintReceipt(r)}
                          title="Cetak Struk"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                          </svg>
                        </button>
                      </div>
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
          Menampilkan 1-{records.length} dari 96 transaksi
        </span>
        <div className="tx-pagination-buttons">
          <button type="button" className="tx-page-btn" disabled>
            Sebelumnya
          </button>
          <button type="button" className="tx-page-btn">
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
