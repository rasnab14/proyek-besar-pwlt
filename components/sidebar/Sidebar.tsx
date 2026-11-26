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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="side-icon">
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

  // State untuk hover-to-expand dan pin/click toggle pada tablet/desktop
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isExpanded = isHovered || isPinned;

  // Mouse enter dengan pembatalan timer keluar
  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsHovered(true);
  };

  // Mouse leave dengan toleransi jeda 120ms agar tidak terjadi flicker saat gerak kursor
  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
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

  // aktif jika path sama atau berada di bawahnya (mis. /admin/stok/detail)
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      className={`side ${isExpanded ? "expanded" : "collapsed"}`}
      aria-label="Menu utama"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="side-header">
        {/* Brand Header */}
        <div
          className="brand"
          onClick={() => setIsPinned(!isPinned)}
          role="button"
          tabIndex={0}
          title={isPinned ? "Sidebar disematkan (klik untuk lepas)" : "Klik untuk sematkan sidebar"}
        >
          <div className="logo" aria-hidden="true">S</div>
          <div className="brand-text">
            <div className="bn">SUMMIT</div>
            <div className="bs">Rental &amp; Store</div>
          </div>
          {/* Tablet & Desktop Pin Toggle Button */}
          <button
            type="button"
            className="pin-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsPinned(!isPinned);
            }}
            title={isPinned ? "Lepaskan sematan sidebar" : "Sematkan sidebar agar tetap terbuka"}
            aria-label={isPinned ? "Lepaskan sematan sidebar" : "Sematkan sidebar"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isPinned ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              )}
            </svg>
          </button>
        </div>

        {/* User Profile Card */}
        <div className="me">
          <div className="a">{info.initial}</div>
          <div className="me-info">
            <b>{userName ?? info.name}</b>
            <span>{info.label}</span>
          </div>
          <button type="button" className="out" onClick={handleLogout} aria-label="Keluar" title="Keluar dari akun">
            Keluar
          </button>
        </div>
      </div>

      {/* Scrollable Navigation Menu List (.nvs per §4.12) */}
      <div className="nvs">
        {NAV[role].map((it, i) => {
          if (it.type === "group") {
            return (
              <div className="gh" key={i} title={it.label}>
                <Icon name={it.icon} />
                <span className="nav-label">{it.label}</span>
              </div>
            );
          }
          const on = isActive(it.href);
          const cls = "nv" + (it.type === "sub" ? " sub" : "") + (on ? " on" : "");
          return (
            <Link
              key={i}
              href={it.href}
              className={cls}
              aria-current={on ? "page" : undefined}
              title={it.label}
            >
              {it.type === "link" && <Icon name={it.icon} />}
              <span className="nav-label">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
