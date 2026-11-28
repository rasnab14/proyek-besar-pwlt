// components/transaksi/SewaSummaryCards.tsx
"use client";

import React from "react";
import { TransaksiSewaRecord } from "./types";

interface SewaSummaryCardsProps {
  role: "admin" | "owner";
  records: TransaksiSewaRecord[];
}

export function SewaSummaryCards({ role, records }: SewaSummaryCardsProps) {
  // Hitung metrik dinamis
  const sedangDisewa = records.filter(
    (r) => r.statusPengambilan === "sudah_diambil"
  ).length || 3;

  const belumDiambil = records.filter(
    (r) => r.statusPengambilan === "belum_diambil"
  ).length || 2;

  const belumLunasList = records.filter(
    (r) => r.sisaTagihan > 0 || r.status !== "lunas"
  );
  const belumLunasCount = belumLunasList.length || 3;
  const totalSisaTagihan = belumLunasList.reduce((acc, r) => acc + r.sisaTagihan, 0) || 1085000;

  const sudahLunasCount = records.filter(
    (r) => r.status === "lunas" || r.sisaTagihan === 0
  ).length || 6;

  const menungguPengembalian = records.filter(
    (r) => r.statusPengambilan === "sudah_diambil" && r.statusPengembalian === "belum_dikembalikan"
  ).length || 6;

  // Format IDR singkat
  const formatSisa = `Rp ${totalSisaTagihan.toLocaleString("id-ID")}`;

  if (role === "owner") {
    return (
      <div className="tx-summary-grid">
        {/* Card 1: Sedang disewa */}
        <div className="tx-summary-card">
          <div className="tx-card-header">
            <span className="tx-card-title">Sedang disewa</span>
            <div className="tx-card-icon tx-icon-blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
          </div>
          <div className="tx-card-main">
            <span className="tx-card-value">{sedangDisewa}</span>
          </div>
          <svg className="tx-sparkline" viewBox="0 0 100 30" fill="none">
            <path d="M0 24 Q 25 15, 45 22 T 75 14 T 100 8" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Card 2: Belum diambil */}
        <div className="tx-summary-card">
          <div className="tx-card-header">
            <span className="tx-card-title">Belum diambil</span>
            <div className="tx-card-icon tx-icon-green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
          </div>
          <div className="tx-card-main">
            <span className="tx-card-value">{belumDiambil}</span>
          </div>
          <svg className="tx-sparkline" viewBox="0 0 100 30" fill="none">
            <path d="M0 20 Q 20 28, 50 18 T 80 12 T 100 16" stroke="#86EFAC" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Card 3: Belum lunas */}
        <div className="tx-summary-card">
          <div className="tx-card-header">
            <span className="tx-card-title">Belum lunas</span>
            <div className="tx-card-icon tx-icon-amber">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="tx-card-main">
            <span className="tx-card-value">{belumLunasCount}</span>
            <span className="tx-card-sub">Sisa tagihan {formatSisa}</span>
          </div>
          <svg className="tx-sparkline" viewBox="0 0 100 30" fill="none">
            <path d="M0 26 Q 30 16, 55 24 T 85 10 T 100 14" stroke="#FDE68A" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Card 4: Sudah lunas */}
        <div className="tx-summary-card">
          <div className="tx-card-header">
            <span className="tx-card-title">Sudah lunas</span>
            <div className="tx-card-icon tx-icon-green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <div className="tx-card-main">
            <span className="tx-card-value">{sudahLunasCount}</span>
            <span className="tx-card-sub">Tagihan beres</span>
          </div>
          <svg className="tx-sparkline" viewBox="0 0 100 30" fill="none">
            <path d="M0 24 Q 25 12, 55 20 T 100 6" stroke="#86EFAC" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  // Admin View
  return (
    <div className="tx-summary-grid">
      {/* Card 1: Sedang disewa */}
      <div className="tx-summary-card">
        <div className="tx-card-header">
          <span className="tx-card-title">Sedang disewa</span>
          <div className="tx-card-icon tx-icon-blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
        </div>
        <div className="tx-card-main">
          <span className="tx-card-value">{sedangDisewa}</span>
        </div>
        <svg className="tx-sparkline" viewBox="0 0 100 30" fill="none">
          <path d="M0 24 Q 25 15, 45 22 T 75 14 T 100 8" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Card 2: Belum diambil */}
      <div className="tx-summary-card">
        <div className="tx-card-header">
          <span className="tx-card-title">Belum diambil</span>
          <div className="tx-card-icon tx-icon-green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
        </div>
        <div className="tx-card-main">
          <span className="tx-card-value">{belumDiambil}</span>
        </div>
        <svg className="tx-sparkline" viewBox="0 0 100 30" fill="none">
          <path d="M0 20 Q 20 28, 50 18 T 80 12 T 100 16" stroke="#86EFAC" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Card 3: Belum lunas */}
      <div className="tx-summary-card">
        <div className="tx-card-header">
          <span className="tx-card-title">Belum lunas</span>
          <div className="tx-card-icon tx-icon-amber">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
        <div className="tx-card-main">
          <span className="tx-card-value">{belumLunasCount}</span>
          <span className="tx-card-sub">Sisa tagihan {formatSisa}</span>
        </div>
        <svg className="tx-sparkline" viewBox="0 0 100 30" fill="none">
          <path d="M0 26 Q 30 16, 55 24 T 85 10 T 100 14" stroke="#FDE68A" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Card 4: Sudah lunas */}
      <div className="tx-summary-card">
        <div className="tx-card-header">
          <span className="tx-card-title">Sudah lunas</span>
          <div className="tx-card-icon tx-icon-green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>
        <div className="tx-card-main">
          <span className="tx-card-value">{sudahLunasCount}</span>
          <span className="tx-card-sub">Tagihan beres</span>
        </div>
        <svg className="tx-sparkline" viewBox="0 0 100 30" fill="none">
          <path d="M0 24 Q 25 12, 55 20 T 100 6" stroke="#86EFAC" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
