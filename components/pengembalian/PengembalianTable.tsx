// components/pengembalian/PengembalianTable.tsx
"use client";

import React from "react";
import Link from "next/link";
import { TransaksiSewaRecord } from "@/components/transaksi/types";
import { hitungMasaSewa } from "./pengembalianStore";

interface PengembalianTableProps {
  role: "admin" | "owner";
  records: TransaksiSewaRecord[];
  onOpenDetail?: (record: TransaksiSewaRecord) => void;
  onOpenProsesKembali?: (record: TransaksiSewaRecord) => void;
}

export function PengembalianTable({
  role,
  records,
  onOpenDetail,
  onOpenProsesKembali,
}: PengembalianTableProps) {
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
              <th>JATUH TEMPO</th>
              <th>TRACKING MASA SEWA</th>
              <th>PENGEMBALIAN</th>
              <th>BIAYA TAMBAHAN</th>
              <th style={{ textAlign: "right" }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
                  Tidak ada data penyewaan atau antrean pengembalian aktif.
                </td>
              </tr>
            ) : (
              records.map((r) => {
                const tracking = hitungMasaSewa(r.tglSelesai, r.statusPengembalian);

                // Pengembalian Badge
                let statusKembaliText = "Belum Dikembalikan";
                let statusKembaliDot = "tx-dot-amber";
                if (r.statusPengembalian === "sebagian") {
                  statusKembaliText = "Dikembalikan Sebagian";
                  statusKembaliDot = "tx-dot-blue";
                } else if (r.statusPengembalian === "seluruhnya") {
                  statusKembaliText = "Dikembalikan Seluruhnya";
                  statusKembaliDot = "tx-dot-green";
                }

                return (
                  <tr key={r.id}>
                    {/* KODE */}
                    <td>
                      <div className="tx-code-wrap">
                        {onOpenDetail ? (
                          <button
                            type="button"
                            className="tx-code-link"
                            style={{ background: "none", border: "none", padding: 0, textAlign: "left" }}
                            onClick={() => onOpenDetail(r)}
                          >
                            {r.kode}
                          </button>
                        ) : (
                          <span style={{ fontWeight: 600 }}>{r.kode}</span>
                        )}
                        <span className="tx-code-sub">{r.bookingTag}</span>
                      </div>
                    </td>

                    {/* PELANGGAN */}
                    <td>
                      <div>
                        <span className="tx-pelanggan-name">{r.pelanggan.nama}</span>
                        <div style={{ fontSize: "11px", color: "#64748B" }}>{r.pelanggan.telepon}</div>
                      </div>
                    </td>

                    {/* BARANG DI PELANGGAN */}
                    <td style={{ maxWidth: "230px", whiteSpace: "normal" }}>
                      {r.barangDiPelanggan || r.items?.map((it) => `${it.nama} ×${it.jumlah}`).join(", ") || "-"}
                    </td>

                    {/* JATUH TEMPO */}
                    <td>
                      <div>
                        <span style={{ fontWeight: 500 }}>{r.tglKembaliDisplay || r.tglSelesai}</span>
                        <div style={{ fontSize: "11.5px", color: "#64748B" }}>s.d. 21.00 WIB</div>
                      </div>
                    </td>

                    {/* TRACKING MASA SEWA */}
                    <td>
                      <span className="tx-dot-badge">
                        <span className={`tx-dot ${tracking.badgeClass}`} />
                        {tracking.badgeLabel}
                      </span>
                    </td>

                    {/* STATUS PENGEMBALIAN */}
                    <td>
                      <span className="tx-dot-badge">
                        <span className={`tx-dot ${statusKembaliDot}`} />
                        {statusKembaliText}
                      </span>
                    </td>

                    {/* BIAYA TAMBAHAN */}
                    <td>
                      {r.biayaTambahan && r.biayaTambahan > 0 ? (
                        <div>
                          <span style={{ fontWeight: 600, color: "#DC2626" }}>
                            {formatRupiah(r.biayaTambahan)}
                          </span>
                          <div style={{ fontSize: "11px", color: "#64748B" }}>
                            {r.biayaTambahanKet || "Denda/Kerusakan"}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "#94A3B8" }}>Rp 0</span>
                      )}
                    </td>

                    {/* AKSI */}
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px", alignItems: "center", justifyContent: "flex-end" }}>
                        {role === "admin" ? (
                          <>
                            {r.statusPengembalian !== "seluruhnya" ? (
                              <button
                                type="button"
                                className="tx-btn-primary"
                                style={{ padding: "4px 10px", fontSize: "11.5px" }}
                                onClick={() => onOpenProsesKembali?.(r)}
                              >
                                {r.statusPengembalian === "sebagian" ? "Lanjutkan" : "Catat Kembali"}
                              </button>
                            ) : null}
                            <button
                              type="button"
                              className="tx-btn-secondary"
                              style={{ padding: "4px 8px", fontSize: "11.5px" }}
                              onClick={() => onOpenDetail?.(r)}
                            >
                              Detail
                            </button>
                          </>
                        ) : (
                          /* Role Owner: Read-only monitoring */
                          <button
                            type="button"
                            className="tx-btn-secondary"
                            style={{ padding: "4px 10px", fontSize: "12px" }}
                            onClick={() => onOpenDetail?.(r)}
                          >
                            Detail
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="tx-pagination">
        <span>
          Menampilkan 1-{records.length} dari {records.length} transaksi sewa aktif/pengembalian
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
