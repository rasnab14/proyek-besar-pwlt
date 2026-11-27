// components/booking/BookingStatusBadge.tsx
import React from "react";
import { BookingStatus, DPStatus } from "./types";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function BookingStatusBadge({ status, className = "" }: BookingStatusBadgeProps) {
  switch (status) {
    case "selesai":
    case "dikonfirmasi": // alias kompatibilitas lama
      return (
        <span className={`b ok ${className}`} title="Booking resmi selesai dicatat & siap diproses ke Transaksi Sewa">
          Selesai
        </span>
      );
    case "draft":
      return (
        <span className={`b in ${className}`} title="Draft booking belum tuntas">
          Draft
        </span>
      );
    case "dibatalkan":
      return (
        <span className={`b er ${className}`} title="Booking dibatalkan (DP hangus, stok dilepaskan)">
          Dibatalkan
        </span>
      );
    case "hangus":
      return (
        <span
          className={`b er ${className}`}
          style={{ background: "#FEF2F2", color: "#991B1B", borderColor: "#FCA5A5" }}
          title="Booking hangus karena tidak diambil lewat batas waktu (DP hangus, stok dilepaskan)"
        >
          Hangus
        </span>
      );
    default:
      return <span className={`b nu ${className}`}>{status}</span>;
  }
}

interface DPStatusBadgeProps {
  status: DPStatus;
  nominal?: number;
}

export function DPStatusBadge({ status }: DPStatusBadgeProps) {
  switch (status) {
    case "lunas":
      return (
        <span className="dp-status-tag lunas">
          ● DP Diterima
        </span>
      );
    case "belum":
      return (
        <span className="dp-status-tag belum">
          ○ Menunggu DP
        </span>
      );
    case "hangus":
      return (
        <span className="dp-status-tag hangus">
          × DP Hangus
        </span>
      );
    case "tidak_perlu":
      return (
        <span className="dp-status-tag" style={{ background: "#F1F5F9", color: "#475569" }}>
          – Tanpa DP (H-1)
        </span>
      );
    default:
      return null;
  }
}
