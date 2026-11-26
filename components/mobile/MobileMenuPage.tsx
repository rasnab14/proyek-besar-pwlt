// components/mobile/MobileMenuPage.tsx
"use client";

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
          onClick={handleLogout}
          className="mob-menu-logout"
          aria-label="Keluar dari akun"
        >
          Keluar
        </button>
      </nav>
    </div>
  );
}
