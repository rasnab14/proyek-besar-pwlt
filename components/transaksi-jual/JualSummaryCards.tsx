// components/transaksi-jual/JualSummaryCards.tsx
"use client";

import React from "react";
import { TransaksiJualRecord } from "./types";
import { formatRupiah } from "@/lib/format";

interface JualSummaryCardsProps {
  records: TransaksiJualRecord[];
}

export function JualSummaryCards({ records }: JualSummaryCardsProps) {
  const totalTransaksi = records.length;
  const totalNominal = records.reduce((acc, r) => acc + (r.status === "selesai" ? r.total : 0), 0);
  const selesaiCount = records.filter((r) => r.status === "selesai").length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "16px",
        width: "100%",
      }}
    >
      {/* Card 1: Transaksi bulan ini */}
      <div
        className="tx-card"
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          padding: "16px 20px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 500 }}>
          Transaksi bulan ini
        </span>
        <div style={{ fontSize: "30px", fontWeight: 700, color: "#0F172A", marginTop: "6px" }}>
          {totalTransaksi}
        </div>
        {/* Soft Sparkline Blue */}
        <svg
          viewBox="0 0 100 24"
          style={{ width: "90px", height: "26px", position: "absolute", right: "16px", bottom: "14px" }}
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M0 18 Q 25 22, 50 12 T 100 6" />
        </svg>
      </div>

      {/* Card 2: Total penjualan */}
      <div
        className="tx-card"
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          padding: "16px 20px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 500 }}>
          Total penjualan
        </span>
        <div style={{ fontSize: "28px", fontWeight: 700, color: "#0F172A", marginTop: "6px" }}>
          {formatRupiah(totalNominal)}
        </div>
        {/* Soft Sparkline Green */}
        <svg
          viewBox="0 0 100 24"
          style={{ width: "90px", height: "26px", position: "absolute", right: "16px", bottom: "14px" }}
          fill="none"
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M0 16 Q 30 20, 60 10 T 100 4" />
        </svg>
      </div>

      {/* Card 3: Transaksi Selesai (Menggantikan Belum Lunas) */}
      <div
        className="tx-card"
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          padding: "16px 20px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 500 }}>
          Transaksi Selesai
        </span>
        <div style={{ fontSize: "30px", fontWeight: 700, color: "#16A34A", marginTop: "6px" }}>
          {selesaiCount}
        </div>
        <div style={{ fontSize: "11.5px", color: "#166534", marginTop: "2px", fontWeight: 600 }}>
          100% Lunas di Kasir
        </div>
        {/* Soft Sparkline Emerald */}
        <svg
          viewBox="0 0 100 24"
          style={{ width: "90px", height: "26px", position: "absolute", right: "16px", bottom: "14px" }}
          fill="none"
          stroke="#16A34A"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M0 19 Q 35 15, 65 8 T 100 5" />
        </svg>
      </div>
    </div>
  );
}
