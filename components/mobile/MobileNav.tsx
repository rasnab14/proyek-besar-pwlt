// components/mobile/MobileNav.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ICONS, NAV, ROLE_INFO, type Role, type NavItem } from "@/components/sidebar/nav-config";
import "./mobile-nav.css";

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
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

function getPageTitle(pathname: string, role: Role): string {
  if (pathname.includes("/dashboard")) return "Beranda";
  if (pathname.includes("/booking/baru")) return "Booking Baru";
  if (pathname.includes("/booking")) return role === "owner" ? "Monitoring Booking" : "Booking";
  if (pathname.includes("/transaksi/sewa")) return "Transaksi Sewa";
  if (pathname.includes("/transaksi/jual")) return "Transaksi Jual";
  if (pathname.includes("/transaksi")) return role === "owner" ? "Monitoring Transaksi" : "Transaksi";
  if (pathname.includes("/barang")) return "Data Barang";
  if (pathname.includes("/kategori")) return "Kategori Barang";
  if (pathname.includes("/paket")) return "Paket Penyewaan";
  if (pathname.includes("/stok")) return "Stok Unit";
  if (pathname.includes("/pelanggan")) return "Data Pelanggan";
  if (pathname.includes("/pengembalian")) return "Pengembalian";
  if (pathname.includes("/pengeluaran")) return "Pengeluaran";
  if (pathname.includes("/laporan/keuangan")) return "Laporan Keuangan";
  if (pathname.includes("/laporan/penyewaan")) return "Laporan Penyewaan";
  if (pathname.includes("/laporan/penjualan")) return "Laporan Penjualan";
  if (pathname.includes("/laporan/stok")) return "Laporan Stok";
  if (pathname.includes("/laporan/pelanggan")) return "Laporan Pelanggan";
  if (pathname.includes("/laporan")) return "Laporan";
  if (pathname.includes("/pengguna")) return "Kelola Pengguna";
  if (pathname.includes("/hak-akses")) return "Hak Akses";
  if (pathname.includes("/riwayat")) return "Riwayat Aktivitas";
  if (pathname.includes("/profil")) return "Profil Akun";
  return "Beranda";
}

type Props = {
  role: Role;
  userName?: string;
  onLogout?: () => void;
};

export default function MobileNav({ role, userName, onLogout }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const info = ROLE_INFO[role];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Cek apakah item parent sedang memuat route aktif
  const isParentActive = (item: NavItem) => {
    if (item.type !== "parent") return false;
    return item.children.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + "/")
    );
  };

  // State menu parent yang sedang terbuka di drawer
  const [openDrawerMenu, setOpenDrawerMenu] = useState<string | null>(() => {
    const items = NAV[role] || [];
    const active = items.find((it) => isParentActive(it));
    return active ? active.key : null;
  });

  // Tutup drawer secara otomatis saat pindah rute
  useEffect(() => {
    setIsDrawerOpen(false);
    const items = NAV[role] || [];
    const active = items.find((it) => isParentActive(it));
    if (active) {
      setOpenDrawerMenu(active.key);
    }
  }, [pathname, role]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error("Gagal keluar:", err);
    } finally {
      if (onLogout) onLogout();
      router.push("/login");
      router.refresh();
    }
  };

  const currentTitle = getPageTitle(pathname, role);

  // Definisi 5 Bottom Navigation Items
  const adminTabs = [
    { key: "beranda", label: "Beranda", href: "/admin/dashboard", iconType: "grid" },
    { key: "booking", label: "Booking", href: "/admin/booking", iconType: "calendar" },
    { key: "transaksi", label: "Transaksi", href: "/admin/transaksi/sewa", iconType: "receipt" },
    { key: "stok", label: "Stok", href: "/admin/stok", iconType: "layers" },
    { key: "menu", label: "Menu", href: "#", iconType: "menu" },
  ];

  const ownerTabs = [
    { key: "beranda", label: "Beranda", href: "/owner/dashboard", iconType: "grid" },
    { key: "booking", label: "Booking", href: "/owner/booking", iconType: "calendar" },
    { key: "transaksi", label: "Transaksi", href: "/owner/transaksi/sewa", iconType: "receipt" },
    { key: "laporan", label: "Laporan", href: "/owner/laporan/keuangan", iconType: "chart" },
    { key: "menu", label: "Menu", href: "#", iconType: "menu" },
  ];

  const tabs = role === "admin" ? adminTabs : ownerTabs;

  const isTabActive = (tab: typeof tabs[0]) => {
    if (tab.key === "menu") return false;
    if (tab.key === "beranda") return pathname.includes("/dashboard");
    if (tab.key === "booking") return pathname.includes("/booking");
    if (tab.key === "transaksi") return pathname.includes("/transaksi");
    if (tab.key === "stok") return pathname.includes("/stok");
    if (tab.key === "laporan") return pathname.includes("/laporan");
    return false;
  };

  return (
    <>
      {/* ─── 1. Mobile Top Sticky Header ─── */}
      <header className="mob-header">
        <div className="mob-header-left">
          <button
            type="button"
            className="mob-hamburger-btn"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Buka menu navigasi"
            title="Buka menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="mob-header-title">{currentTitle}</h1>
        </div>

        <button
          type="button"
          className="mob-header-avatar"
          onClick={() => setIsDrawerOpen(true)}
          aria-label={`Akun ${info.label}`}
          title={userName ?? info.name}
        >
          {info.initial}
        </button>
      </header>

      {/* ─── 2. Fixed Bottom Navigation Bar (5 Items) ─── */}
      <nav className="mob-bottom-bar" aria-label="Navigasi bawah mobile">
        {tabs.map((tab) => {
          const active = isTabActive(tab);
          const isMenuBtn = tab.key === "menu";

          if (isMenuBtn) {
            return (
              <button
                key={tab.key}
                type="button"
                className="mob-tab-btn"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Buka semua menu"
              >
                <div className="mob-tab-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </div>
                <span className="mob-tab-label">{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`mob-tab-btn ${active ? "is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <div className="mob-tab-icon-wrap">
                {tab.iconType === "grid" && (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                )}
                {tab.iconType === "calendar" && (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                )}
                {tab.iconType === "receipt" && (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
                    <line x1="8" y1="8" x2="16" y2="8" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="8" y1="16" x2="12" y2="16" />
                  </svg>
                )}
                {tab.iconType === "layers" && (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                )}
                {tab.iconType === "chart" && (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                )}
              </div>
              <span className="mob-tab-label">{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ─── 3. Full Mobile Navigation Drawer ─── */}
      {isDrawerOpen && (
        <div
          className="mob-drawer-backdrop"
          onClick={() => setIsDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`mob-drawer ${isDrawerOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Daftar Menu Navigasi"
      >
        {/* Drawer Brand Header */}
        <div className="mob-drawer-header">
          <div className="mob-drawer-brand">
            <div className="mob-drawer-logo">S</div>
            <div>
              <div className="mob-drawer-brand-name">19 SUMMIT</div>
              <div className="mob-drawer-brand-sub">Rental &amp; Store</div>
            </div>
          </div>
          <button
            type="button"
            className="mob-drawer-close-btn"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Tutup menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer Scrollable Nav List */}
        <nav className="mob-drawer-nav">
          {NAV[role].map((item) => {
            if (item.type === "link") {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`mob-drawer-link ${active ? "is-active" : ""}`}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            }

            // Parent Menu with Submenu Accordion
            const isChildOpen = openDrawerMenu === item.key;
            const parentActive = isParentActive(item);

            return (
              <div key={item.key} className="mob-drawer-group">
                <button
                  type="button"
                  className={`mob-drawer-parent-btn ${parentActive ? "is-active-parent" : ""}`}
                  onClick={() => setOpenDrawerMenu(isChildOpen ? null : item.key)}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`mob-drawer-chevron ${isChildOpen ? "open" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                <div className={`mob-drawer-sub-wrap ${isChildOpen ? "open" : ""}`}>
                  <div className="mob-drawer-sub-list">
                    {item.children.map((sub, sIdx) => {
                      const subActive = pathname === sub.href;
                      return (
                        <Link
                          key={sIdx}
                          href={sub.href}
                          className={`mob-drawer-sub-link ${subActive ? "is-active" : ""}`}
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          <span className="mob-drawer-sub-dot" />
                          <span>{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Drawer Bottom Profile & Logout */}
        <div className="mob-drawer-profile">
          <div className="mob-drawer-profile-info">
            <div className="mob-header-avatar">{info.initial}</div>
            <div>
              <div className="mob-drawer-profile-name">{userName ?? info.name}</div>
              <div className="mob-drawer-profile-role">{info.label}</div>
            </div>
          </div>
          <button
            type="button"
            className="mob-drawer-logout-btn"
            onClick={handleLogout}
          >
            Keluar
          </button>
        </div>
      </div>
    </>
  );
}
