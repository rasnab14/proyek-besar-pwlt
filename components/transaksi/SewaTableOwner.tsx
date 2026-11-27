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
              <th>BARANG DI PELANGGAN</th>
              <th>DIAMBIL</th>
              <th>TANGGAL KEMBALI</th>
              <th>PENGEMBALIAN</th>
              <th>SISA TAGIHAN</th>
              <th>BIAYA TAMBAHAN</th>
              <th>STATUS</th>
              <th style={{ textAlign: "right" }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
                  Tidak ada transaksi penyewaan yang ditemukan.
                </td>
              </tr>
            ) : (
              records.map((r) => {
                // Pengembalian Badge
                let pengembalianText = "Belum Dikembalikan";
                let pengembalianDot = "tx-dot-amber";
                if (r.statusPengembalian === "sebagian") {
                  pengembalianText = "Dikembalikan Sebagian";
                  pengembalianDot = "tx-dot-blue";
                } else if (r.statusPengembalian === "seluruhnya") {
                  pengembalianText = "Dikembalikan Seluruhnya";
                  pengembalianDot = "tx-dot-green";
                }

                return (
                  <tr key={r.id}>
                    {/* KODE */}
                    <td>
                      <button
                        type="button"
                        className="tx-code-link"
                        style={{ background: "none", border: "none", padding: 0, textAlign: "left" }}
                        onClick={() => onSelectRecord(r)}
                      >
                        {r.kode}
                      </button>
                    </td>

                    {/* PELANGGAN */}
                    <td>
                      <span className="tx-pelanggan-name">{r.pelanggan.nama}</span>
                    </td>

                    {/* BARANG DI PELANGGAN */}
                    <td style={{ maxWidth: "220px", whiteSpace: "normal" }}>
                      {r.barangDiPelanggan || "-"}
                    </td>

                    {/* DIAMBIL */}
                    <td>{r.tglDiambilDisplay || "-"}</td>

                    {/* TANGGAL KEMBALI */}
                    <td>{r.tglKembaliDisplay || "-"}</td>

                    {/* PENGEMBALIAN */}
                    <td>
                      <span className="tx-dot-badge">
                        <span className={`tx-dot ${pengembalianDot}`} />
                        {pengembalianText}
                      </span>
                    </td>

                    {/* SISA TAGIHAN */}
                    <td style={{ fontWeight: 500 }}>{formatRupiah(r.sisaTagihan)}</td>

                    {/* BIAYA TAMBAHAN */}
                    <td>
                      {r.biayaTambahan && r.biayaTambahan > 0 ? (
                        <div>
                          <span>{formatRupiah(r.biayaTambahan)}</span>
                          <div style={{ fontSize: "11px", color: "#DC2626" }}>
                            {r.biayaTambahanKet || "(denda)"}
                          </div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* STATUS */}
                    <td>
                      <span className="tx-dot-badge">
                        <span className={`tx-dot ${r.status === "lunas" || r.sisaTagihan === 0 ? "tx-dot-green" : "tx-dot-amber"}`} />
                        {r.status === "lunas" || r.sisaTagihan === 0 ? "Lunas" : "Belum Lunas"}
                      </span>
                    </td>

                    {/* AKSI */}
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="tx-btn-secondary"
                        style={{ padding: "4px 10px", fontSize: "12px" }}
                        onClick={() => onSelectRecord(r)}
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
