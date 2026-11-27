// components/mobile/MobileMenuPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { NAV, type Role } from "@/components/sidebar/nav-config";
import "./mobile-menu.css";

interface Props {
  role: Role;
}

export default function MobileMenuPage({ role }: Props) {
  const router = useRouter();
  const navItems = NAV[role] || [];
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error("Gagal keluar:", err);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <div className="mob-menu-page">
      <div className="mob-menu-brand-header">
        <div className="mob-menu-logo-circle">
          <img
            src="/logo-19summit.jpg"
            alt="19 Summit"
            className="mob-menu-logo-img"
            width={40}
            height={40}
          />
        </div>
        <div>
          <div className="mob-menu-brand-name">19 SUMMIT</div>
          <div className="mob-menu-brand-sub">Rental &amp; Store Outdoor</div>
        </div>
      </div>
      <nav className="mob-menu-list" aria-label="Daftar Menu Lengkap">
        {navItems.map((item) => {
          if (item.type === "link") {
            return (
              <Link
                key={item.key}
                href={item.href}
                className="mob-menu-item"
              >
                <span>{item.label}</span>
              </Link>
            );
          }

          // Parent Category with Submenu List
          return (
            <div key={item.key} className="mob-menu-group">
              <div className="mob-menu-category">
                {item.label.toUpperCase()}
              </div>
              {item.children.map((sub, sIdx) => (
                <Link
                  key={sIdx}
                  href={sub.href}
                  className="mob-menu-subitem"
                >
                  <span>{sub.label}</span>
                </Link>
              ))}
            </div>
          );
        })}

        {/* Tombol Keluar (Merah di bagian paling bawah) */}
        <button
          type="button"
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="mob-menu-logout"
          aria-label="Keluar dari akun"
        >
          Keluar
        </button>
      </nav>

      {/* Modal Konfirmasi Logout Mobile */}
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
              padding: "20px",
              maxWidth: "340px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>Konfirmasi Keluar</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
              Apakah Anda yakin ingin keluar dari akun?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E1",
                  background: "#F8FAFC",
                  color: "#334155",
                  fontSize: "12.5px",
                  fontWeight: 600,
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#DC2626",
                  color: "#FFFFFF",
                  fontSize: "12.5px",
                  fontWeight: 600,
                }}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
