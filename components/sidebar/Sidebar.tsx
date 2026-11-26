// components/sidebar/Sidebar.tsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ICONS, NAV, ROLE_INFO, type Role } from "./nav-config";
import "./sidebar.css";

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="side-svg-icon"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

type Props = {
  role: Role;
  /** Nama pengguna dari sesi (opsional, default sesuai peran) */
  userName?: string;
  /** Dipanggil saat klik Keluar (mis. server action signOut) */
  onLogout?: () => void;
};

export default function Sidebar({ role, userName, onLogout }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const info = ROLE_INFO[role];

  // State ekspansi: hover di desktop atau pin manual (tablet/desktop)
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isExpanded = isHovered || isPinned;

  // 1. Hover Detection Delay (350ms): kursor harus menetap 350ms sebelum membuka
  const handleMouseEnter = () => {
    // Batalkan timer keluar jika kursor kembali
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    // Jika belum terbuka dan belum ada antrean timer, mulai hitung 350ms
    if (!isExpanded && !hoverTimerRef.current) {
      hoverTimerRef.current = setTimeout(() => {
        setIsHovered(true);
        hoverTimerRef.current = null;
      }, 350);
    }
  };

  // 2. Mouse Leave Delay (600ms): jeda sebelum menguncup agar tidak sensitif/flicker
  const handleMouseLeave = () => {
    // Batalkan timer hover jika kursor hanya numpang lewat
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    // Tunggu 600ms sebelum menguncup
    if (!leaveTimerRef.current && isHovered) {
      leaveTimerRef.current = setTimeout(() => {
        setIsHovered(false);
        leaveTimerRef.current = null;
      }, 600);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error("Gagal keluar dari sesi:", err);
    } finally {
      if (onLogout) {
        onLogout();
      }
      router.push("/login");
      router.refresh();
    }
  };

  // Rute aktif jika path sama persis atau berada di sub-pathnya
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={`side ${isExpanded ? "expanded" : "collapsed"}`}
      aria-label="Menu navigasi utama"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── 1. Top Brand Logo & Title ── */}
      <div
        className="side-brand"
        onClick={() => setIsPinned(!isPinned)}
        role="button"
        tabIndex={0}
        title={isPinned ? "Sidebar disematkan (klik untuk lepas)" : "Klik untuk sematkan sidebar"}
      >
        <div className="side-logo-circle" aria-hidden="true">
          S
        </div>
        <div className="side-brand-info">
          <div className="side-brand-name">SUMMIT</div>
          <div className="side-brand-sub">Rental &amp; Store</div>
        </div>

        {/* Pin toggle control for Tablet & Desktop */}
        <button
          type="button"
          className="side-pin-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsPinned(!isPinned);
          }}
          title={isPinned ? "Lepaskan sematan sidebar" : "Sematkan sidebar agar tetap terbuka"}
          aria-label={isPinned ? "Lepaskan sematan sidebar" : "Sematkan sidebar"}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isPinned ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            )}
          </svg>
        </button>
      </div>

      {/* ── 2. Middle Scrollable Navigation List (All items visible & aligned) ── */}
      <nav className="side-nav">
        {NAV[role].map((it, i) => {
          if (it.type === "group") {
            return (
              <div className="side-group-heading" key={i} title={it.label}>
                <div className="side-item-icon-box" aria-hidden="true">
                  <Icon name={it.icon} />
                </div>
                <span className="side-label side-group-title">{it.label}</span>
              </div>
            );
          }

          const on = isActive(it.href);
          const isSub = it.type === "sub";
          const linkCls = `side-nav-link ${isSub ? "is-sub" : ""} ${on ? "is-active" : ""}`;

          return (
            <Link
              key={i}
              href={it.href}
              className={linkCls}
              aria-current={on ? "page" : undefined}
              title={it.label}
            >
              <div className="side-item-icon-box" aria-hidden="true">
                {it.type === "link" ? (
                  <Icon name={it.icon} />
                ) : (
                  <span className="side-sub-bullet" />
                )}
              </div>
              <span className="side-label side-nav-title">{it.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── 3. Bottom User Profile Card (Pinned at bottom) ── */}
      <div className="side-profile">
        <div className="side-profile-avatar" aria-hidden="true">
          {info.initial}
        </div>
        <div className="side-profile-meta">
          <b className="side-profile-name">{userName ?? info.name}</b>
          <span className="side-profile-role">{info.label}</span>
        </div>
        <button
          type="button"
          className="side-logout-btn"
          onClick={handleLogout}
          aria-label="Keluar dari akun"
          title="Keluar dari akun"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}
