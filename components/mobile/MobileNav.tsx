// components/mobile/MobileNav.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROLE_INFO, type Role } from "@/components/sidebar/nav-config";
import "./mobile-nav.css";

function getPageTitle(pathname: string, role: Role): string {
  if (pathname.includes("/menu")) return "Menu";
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
};

export default function MobileNav({ role, userName }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const info = ROLE_INFO[role];

  const isMenuPage = pathname.includes("/menu");
  const currentTitle = getPageTitle(pathname, role);

  // Navigasi ke halaman Menu dengan menyimpan halaman sebelumnya
  const handleOpenMenu = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("fluxa_prev_page", pathname);
    }
    router.push(role === "admin" ? "/admin/menu" : "/owner/menu");
  };

  // Navigasi kembali dari halaman Menu ke halaman sebelumnya (atau Beranda)
  const handleBack = () => {
    if (typeof window !== "undefined") {
      const prev = sessionStorage.getItem("fluxa_prev_page");
      if (prev && prev !== pathname && !prev.includes("/menu")) {
        sessionStorage.removeItem("fluxa_prev_page");
        router.push(prev);
        return;
      }
      if (window.history.length > 2) {
        router.back();
        return;
      }
    }
    router.push(role === "admin" ? "/admin/dashboard" : "/owner/dashboard");
  };

  // Definisi 5 Tab Bottom Navigation
  const adminTabs = [
    { key: "beranda", label: "Beranda", href: "/admin/dashboard", iconType: "grid" },
    { key: "booking", label: "Booking", href: "/admin/booking", iconType: "calendar" },
    { key: "transaksi", label: "Transaksi", href: "/admin/transaksi/sewa", iconType: "receipt" },
    { key: "stok", label: "Stok", href: "/admin/stok", iconType: "layers" },
    { key: "menu", label: "Menu", href: "/admin/menu", iconType: "menu" },
  ];

  const ownerTabs = [
    { key: "beranda", label: "Beranda", href: "/owner/dashboard", iconType: "grid" },
    { key: "booking", label: "Booking", href: "/owner/booking", iconType: "calendar" },
    { key: "transaksi", label: "Transaksi", href: "/owner/transaksi/sewa", iconType: "receipt" },
    { key: "laporan", label: "Laporan", href: "/owner/laporan/keuangan", iconType: "chart" },
    { key: "menu", label: "Menu", href: "/owner/menu", iconType: "menu" },
  ];

  const tabs = role === "admin" ? adminTabs : ownerTabs;

  const isTabActive = (tabKey: string) => {
    if (tabKey === "menu") return isMenuPage;
    if (tabKey === "beranda") return pathname.includes("/dashboard");
    if (tabKey === "booking") return pathname.includes("/booking");
    if (tabKey === "transaksi") return pathname.includes("/transaksi");
    if (tabKey === "stok") return pathname.includes("/stok");
    if (tabKey === "laporan") return pathname.includes("/laporan");
    return false;
  };

  return (
    <>
      {/* ─── 1. Mobile Top Sticky Header ─── */}
      <header className="mob-header">
        <div className="mob-header-left">
          {isMenuPage ? (
            <button
              type="button"
              className="mob-back-btn"
              onClick={handleBack}
              aria-label="Kembali ke halaman sebelumnya"
              title="Kembali"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : (
            <div className="mob-brand-logo-wrap" aria-hidden="true">
              <img
                src="/logo-19summit.jpg"
                alt="19 Summit"
                className="mob-brand-logo"
                width={30}
                height={30}
              />
            </div>
          )}

          <h1 className="mob-header-title">{currentTitle}</h1>
        </div>

        <Link
          href={`/${role}/profil`}
          className="mob-header-avatar"
          aria-label={`Profil ${info.label}`}
          title={userName ?? info.name}
        >
          {info.initial}
        </Link>
      </header>

      {/* ─── 2. Fixed Bottom Navigation Bar (5 Items) ─── */}
      <nav className="mob-bottom-bar" aria-label="Navigasi bawah mobile">
        {tabs.map((tab) => {
          const active = isTabActive(tab.key);
          const isMenuTab = tab.key === "menu";

          return (
            <button
              key={tab.key}
              type="button"
              className={`mob-tab-btn ${active ? "is-active" : ""}`}
              onClick={() => {
                if (isMenuTab) {
                  handleOpenMenu();
                } else {
                  router.push(tab.href);
                }
              }}
              aria-current={active ? "page" : undefined}
            >
              <div className="mob-tab-icon-wrap">
                {tab.iconType === "grid" && (
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                )}
                {tab.iconType === "calendar" && (
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                )}
                {tab.iconType === "receipt" && (
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
                    <line x1="8" y1="8" x2="16" y2="8" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="8" y1="16" x2="12" y2="16" />
                  </svg>
                )}
                {tab.iconType === "layers" && (
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                )}
                {tab.iconType === "chart" && (
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                )}
                {tab.iconType === "menu" && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </div>
              <span className="mob-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
