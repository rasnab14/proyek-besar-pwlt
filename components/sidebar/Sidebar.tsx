// components/sidebar/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ICONS, NAV, ROLE_INFO, type Role } from "./nav-config";
import "./sidebar.css";

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    <nav className="side" aria-label="Menu utama">
      {/* Brand Header */}
      <div className="brand">
        <div className="logo">S</div>
        <div>
          <div className="bn">SUMMIT</div>
          <div className="bs">Rental &amp; Store</div>
        </div>
      </div>

      {/* Scrollable Navigation Menu List (.nvs per §4.12) */}
      <div className="nvs">
        {NAV[role].map((it, i) => {
          if (it.type === "group") {
            return (
              <div className="gh" key={i}>
                <Icon name={it.icon} />
                {it.label}
              </div>
            );
          }
          const on = isActive(it.href);
          const cls = "nv" + (it.type === "sub" ? " sub" : "") + (on ? " on" : "");
          return (
            <Link key={i} href={it.href} className={cls} aria-current={on ? "page" : undefined}>
              {it.type === "link" && <Icon name={it.icon} />}
              {it.label}
            </Link>
          );
        })}
      </div>

      {/* User Profile Card */}
      <div className="me">
        <div className="a">{info.initial}</div>
        <div>
          <b>{userName ?? info.name}</b>
          <span>{info.label}</span>
        </div>
        <button type="button" className="out" onClick={handleLogout}>Keluar</button>
      </div>
    </nav>
  );
}
