// components/booking/BookingStatusBadge.tsx
import React from "react";
import { BookingStatus, DPStatus } from "./types";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function BookingStatusBadge({ status, className = "" }: BookingStatusBadgeProps) {
  switch (status) {
    case "dikonfirmasi":
      return (
        <span className={`b ok ${className}`} title="Booking disetujui & dialokasikan">
          Dikonfirmasi
        </span>
      );
    case "draft":
      return (
        <span className={`b in ${className}`} title="Draft booking belum tuntas">
          Draft
        </span>
      );
    case "selesai":
      return (
        <span className={`b nu ${className}`} title="Sudah diproses menjadi transaksi sewa">
          Selesai
        </span>
      );
    case "dibatalkan":
      return (
        <span className={`b er ${className}`} title="Booking dibatalkan (DP hangus)">
          Dibatalkan
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
