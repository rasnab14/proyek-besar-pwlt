// components/transaksi-jual/JualTable.tsx
"use client";

import React from "react";
import { TransaksiJualRecord } from "./types";
import { formatRupiah } from "@/lib/format";

interface JualTableProps {
  records: TransaksiJualRecord[];
  onDetail: (r: TransaksiJualRecord) => void;
  onEdit: (r: TransaksiJualRecord) => void;
  onPrint?: (r: TransaksiJualRecord) => void;
  onDelete: (r: TransaksiJualRecord) => void;
  role?: "admin" | "owner";
}

export function JualTable({
  records,
  onDetail,
  onEdit,
  onPrint,
  onDelete,
  role = "admin",
}: JualTableProps) {
  if (records.length === 0) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "10px",
          border: "1px solid #E2E8F0",
          padding: "48px 16px",
          textAlign: "center",
          color: "#64748B",
          fontSize: "13.5px",
        }}
      >
        Tidak ada data transaksi penjualan yang sesuai dengan filter.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "10px",
        border: "1px solid #CBD5E1",
        boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: "13.5px", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F1F5F9", borderBottom: "2px solid #CBD5E1", color: "#1E293B", fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              <th style={{ padding: "13px 18px", borderBottom: "2px solid #CBD5E1" }}>KODE</th>
              <th style={{ padding: "13px 18px", borderBottom: "2px solid #CBD5E1" }}>TANGGAL</th>
              <th style={{ padding: "13px 18px", borderBottom: "2px solid #CBD5E1" }}>PELANGGAN</th>
              <th style={{ padding: "13px 18px", borderBottom: "2px solid #CBD5E1" }}>BARANG</th>
              <th style={{ padding: "13px 18px", borderBottom: "2px solid #CBD5E1" }}>TOTAL</th>
              <th style={{ padding: "13px 18px", borderBottom: "2px solid #CBD5E1" }}>STATUS</th>
              <th style={{ padding: "13px 18px", borderBottom: "2px solid #CBD5E1", textAlign: "right" }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, idx) => {
              const isEven = idx % 2 === 0;
              const isSelesai = r.status === "selesai";

              return (
                <tr
                  key={r.id}
                  style={{
                    background: isEven ? "#FFFFFF" : "#F8FAFC",
                    borderBottom: "1px solid #E2E8F0",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F0F9FF")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = isEven ? "#FFFFFF" : "#F8FAFC")}
                >
                  {/* KODE */}
                  <td style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", fontWeight: 700, color: "#0284C7" }}>
                    {r.kode}
                  </td>

                  {/* TANGGAL */}
                  <td style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", color: "#475569" }}>
                    {r.waktu}
                  </td>

                  {/* PELANGGAN */}
                  <td style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", fontWeight: 600, color: "#0F172A" }}>
                    {r.pelanggan.nama || "Pelanggan Umum"}
                  </td>

                  {/* BARANG */}
                  <td style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", color: "#334155", maxWidth: "260px" }}>
                    <span title={r.barangRingkasan} style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {r.barangRingkasan}
                    </span>
                  </td>

                  {/* TOTAL */}
                  <td style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A" }}>
                    {formatRupiah(r.total)}
                  </td>

                  {/* STATUS */}
                  <td style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0" }}>
                    {isSelesai ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          color: "#065F46",
                          padding: "3px 10px 3px 8px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ width: "6.5px", height: "6.5px", borderRadius: "50%", background: "#10B981" }}></span>
                        Selesai · {r.metodeBayar.toUpperCase()}
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "#FEF2F2",
                          border: "1px solid #FECACA",
                          color: "#991B1B",
                          padding: "3px 10px 3px 8px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ width: "6.5px", height: "6.5px", borderRadius: "50%", background: "#EF4444" }}></span>
                        Dibatalkan
                      </span>
                    )}
                  </td>

                  {/* AKSI (Fleksibel: Read, Update, Delete) */}
                  <td style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      {/* Read (Detail) */}
                      <button
                        type="button"
                        onClick={() => onDetail(r)}
                        style={{
                          background: "#F8FAFC",
                          border: "1px solid #CBD5E1",
                          borderRadius: "6px",
                          padding: "5px 9px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#334155",
                          cursor: "pointer",
                        }}
                        title="Lihat Rincian Transaksi (termasuk Cetak Struk)"
                      >
                        Detail
                      </button>

                      {role === "admin" && (
                        <>
                          {/* Update (Ubah) */}
                          <button
                            type="button"
                            onClick={() => onEdit(r)}
                            style={{
                              background: "#FEF3C7",
                              border: "1px solid #FDE68A",
                              borderRadius: "6px",
                              padding: "5px 9px",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#92400E",
                              cursor: "pointer",
                            }}
                            title="Ubah Pesanan di Formulir Penjualan"
                          >
                            Ubah
                          </button>

                          {/* Delete (Hapus) */}
                          <button
                            type="button"
                            onClick={() => onDelete(r)}
                            style={{
                              background: "#FEE2E2",
                              border: "1px solid #FECACA",
                              borderRadius: "6px",
                              padding: "5px 9px",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#DC2626",
                              cursor: "pointer",
                            }}
                            title="Hapus Transaksi (Kembalikan Stok)"
                          >
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderTop: "1px solid #E2E8F0",
          background: "#F8FAFC",
          fontSize: "12px",
          color: "#64748B",
        }}
      >
        <span>Menampilkan 1–{records.length} dari {records.length} transaksi</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            disabled
            style={{
              padding: "5px 12px",
              background: "#FFFFFF",
              border: "1px solid #CBD5E1",
              borderRadius: "6px",
              color: "#94A3B8",
              cursor: "not-allowed",
              fontSize: "12px",
            }}
          >
            Sebelumnya
          </button>
          <button
            type="button"
            disabled
            style={{
              padding: "5px 12px",
              background: "#FFFFFF",
              border: "1px solid #CBD5E1",
              borderRadius: "6px",
              color: "#94A3B8",
              cursor: "not-allowed",
              fontSize: "12px",
            }}
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
