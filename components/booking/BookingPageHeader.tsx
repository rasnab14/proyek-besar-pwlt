// components/booking/BookingPageHeader.tsx
"use client";

import React from "react";
import Link from "next/link";

interface BookingPageHeaderProps {
  role: "admin" | "owner";
  onCreateBooking?: () => void;
}

export function BookingPageHeader({
  role,
  onCreateBooking,
}: BookingPageHeaderProps) {
  if (role === "admin") {
    return (
      <section className="booking-hero">
        <div className="booking-hero-left">
          <span className="booking-breadcrumb">ADMIN · BOOKING</span>
          <h1 className="booking-title">Booking</h1>
          <p className="booking-desc">
            Catat pemesanan hasil kesepakatan via WhatsApp atau langsung di toko.
          </p>
        </div>
        <div className="booking-hero-actions">
          <Link
            href="/admin/transaksi/sewa"
            className="btn sm"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.22)",
            }}
          >
            Pelunasan (Transaksi Sewa)
          </Link>
          <button
            type="button"
            onClick={onCreateBooking}
            className="btn pri sm"
          >
            + Catat Booking
          </button>
        </div>

        {/* Mountain Contour Graphic */}
        <svg
          className="hero-ridge"
          viewBox="0 0 520 170"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <circle cx="440" cy="42" r="15" fill="#0EA5E9" fillOpacity="0.9" />
          <path
            d="M0 170L70 100l40 40 80-100 70 80 60-50 90 100V170Z"
            fill="white"
            fillOpacity="0.06"
          />
          <path
            d="M130 170l60-70 40 45 70-85 90 110z"
            fill="white"
            fillOpacity="0.08"
          />
          <path
            d="M0 160L70 100l40 40 80-100 70 80 60-50 90 100"
            stroke="#0EA5E9"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </section>
    );
  }

  // Owner View
  return (
    <section className="booking-hero">
      <div className="booking-hero-left">
        <span className="booking-breadcrumb">OWNER · MONITORING BOOKING</span>
        <h1 className="booking-title">Monitoring Booking</h1>
        <p className="booking-desc">
          Hanya dilihat. Pembatalan booking terkonfirmasi dilakukan pengguna berwenang dengan alasan.
        </p>
      </div>
      <div className="booking-hero-actions">
        <Link
          href="/owner/dashboard"
          className="btn sm"
          style={{
            background: "rgba(255, 255, 255, 0.12)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.22)",
          }}
        >
          ← Dashboard Owner
        </Link>
      </div>

      <svg
        className="hero-ridge"
        viewBox="0 0 520 170"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <circle cx="440" cy="42" r="15" fill="#0EA5E9" fillOpacity="0.9" />
        <path
          d="M0 170L70 100l40 40 80-100 70 80 60-50 90 100V170Z"
          fill="white"
          fillOpacity="0.06"
        />
        <path
          d="M130 170l60-70 40 45 70-85 90 110z"
          fill="white"
          fillOpacity="0.08"
        />
        <path
          d="M0 160L70 100l40 40 80-100 70 80 60-50 90 100"
          stroke="#0EA5E9"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </section>
  );
}
