// components/sidebar/Sidebar.tsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ICONS, NAV, ROLE_INFO, type Role, type NavItem } from "./nav-config";
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

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`side-chevron ${isOpen ? "open" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
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
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isExpanded = isHovered || isPinned;

  // Cek apakah item parent sedang memuat route aktif
  const isParentActive = (item: NavItem) => {
    if (item.type !== "parent") return false;
    return item.children.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + "/")
    );
  };

  // State menu parent yang sedang terbuka (accordion: hanya 1 yang terbuka)
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    const items = NAV[role] || [];
    const active = items.find((it) => isParentActive(it));
    return active ? active.key : null;
  });

  // Sinkronkan menu terbuka dengan halaman aktif saat navigasi rute berubah
  useEffect(() => {
    const items = NAV[role] || [];
    const active = items.find((it) => isParentActive(it));
    if (active) {
      setOpenMenu(active.key);
    }
  }, [pathname, role]);

  // 1. Hover Detection Delay (350ms): kursor harus menetap 350ms sebelum membuka
  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    if (!isExpanded && !hoverTimerRef.current) {
      hoverTimerRef.current = setTimeout(() => {
        setIsHovered(true);
        hoverTimerRef.current = null;
      }, 350);
    }
  };

  // 2. Mouse Leave Delay (600ms): jeda sebelum menguncup agar tidak sensitif/flicker
  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

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

  // Handler klik pada Parent Menu (Accordion)
  const handleParentClick = (key: string) => {
    // Jika sidebar sedang dalam keadaan kuncup (collapsed), otomatis buka & pin agar submenu terlihat
    if (!isExpanded) {
      setIsPinned(true);
      setOpenMenu(key);
      return;
    }

    // Toggle accordion
    setOpenMenu((prev) => (prev === key ? null : key));
  };

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
  const isLinkActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Spacer layout untuk fixed sidebar agar tidak menimpa konten utama secara dinamis */}
      <div
        className={`side-spacer ${isExpanded ? "expanded" : "collapsed"}`}
        aria-hidden="true"
      />
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
            <img
              src="/logo-19summit.jpg"
              alt="19 Summit Logo"
              className="side-logo-img"
              width={42}
              height={42}
            />
          </div>
          <div className="side-brand-info">
            <div className="side-brand-name">19 SUMMIT</div>
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

        {/* ── 2. Middle Scrollable Navigation List (Hierarchical Parent & Child) ── */}
        <nav className="side-nav">
          {NAV[role].map((item) => {
            // Direct Link (mis. Dashboard, Booking, dll.)
            if (item.type === "link") {
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`side-nav-link ${active ? "is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  title={item.label}
                >
                  <div className="side-item-icon-box" aria-hidden="true">
                    <Icon name={item.icon} />
                  </div>
                  <span className="side-label side-nav-title">{item.label}</span>
                </Link>
              );
            }

            // Parent Menu with Submenu (mis. Transaksi, Data Barang, Laporan, dll.)
            const isChildOpen = openMenu === item.key;
            const parentActive = isParentActive(item);

            return (
              <div className="side-parent-group" key={item.key}>
                <button
                  type="button"
                  className={`side-parent-btn ${parentActive ? "is-active-parent" : ""} ${
                    isChildOpen ? "is-open" : ""
                  }`}
                  onClick={() => handleParentClick(item.key)}
                  aria-expanded={isChildOpen}
                  title={item.label}
                >
                  <div className="side-item-icon-box" aria-hidden="true">
                    <Icon name={item.icon} />
                  </div>
                  <span className="side-label side-nav-title">{item.label}</span>
                  <div className="side-chevron-box" aria-hidden="true">
                    <ChevronIcon isOpen={isChildOpen} />
                  </div>
                </button>

                {/* Submenu List with subtle vertical guide line */}
                <div
                  className={`side-submenu-wrap ${isChildOpen && isExpanded ? "open" : ""}`}
                  aria-hidden={!isChildOpen}
                >
                  <div className="side-submenu-list">
                    {item.children.map((sub, sIdx) => {
                      const subActive = isLinkActive(sub.href);
                      return (
                        <Link
                          key={sIdx}
                          href={sub.href}
                          className={`side-sub-link ${subActive ? "is-active" : ""}`}
                          aria-current={subActive ? "page" : undefined}
                          title={sub.label}
                        >
                          <span className="side-sub-bullet" />
                          <span className="side-sub-label">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* ── 3. Bottom User Profile & Collapsed Logout Section ── */}
        <div className="side-bottom-section">
          {/* Collapsed Mode Logout (Divider + Red Logout Icon matching reference) */}
          <div className="side-collapsed-logout-wrap">
            <div className="side-collapsed-divider" />
            <button
              type="button"
              className="side-collapsed-logout-btn"
              onClick={() => setIsLogoutConfirmOpen(true)}
              title="Keluar dari akun"
              aria-label="Keluar dari akun"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>

          {/* Expanded Mode Profile Card */}
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
              onClick={() => setIsLogoutConfirmOpen(true)}
              aria-label="Keluar dari akun"
              title="Keluar dari akun"
            >
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Modal Konfirmasi Logout */}
      {isLogoutConfirmOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "16px",
          }}
          onClick={() => setIsLogoutConfirmOpen(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#FEE2E2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>Keluar dari Akun?</h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#64748B" }}>Sesi akun akan diakhiri.</p>
              </div>
            </div>
            <p style={{ margin: "0 0 20px 0", fontSize: "13.5px", color: "#334155" }}>
              Apakah Anda yakin ingin keluar dari sistem?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E1",
                  background: "#F8FAFC",
                  color: "#334155",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#DC2626",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
