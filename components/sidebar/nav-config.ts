// components/sidebar/nav-config.ts
export type Role = "admin" | "owner";

export type NavSubItem = {
  label: string;
  href: string;
};

export type NavItem =
  | {
      type: "link";
      key: string;
      label: string;
      href: string;
      icon: keyof typeof ICONS;
    }
  | {
      type: "parent";
      key: string;
      label: string;
      icon: keyof typeof ICONS;
      children: NavSubItem[];
    };

// Path ikon 24x24 (stroke) — konsisten dengan desain sistem Fluxa
export const ICONS = {
  dash: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
  cal: "M3 5h18v16H3zM3 10h18M8 3v4M16 3v4",
  rec: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
  box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
  stok: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  usr: "M16 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9.5 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM21 20v-2a4 4 0 00-3-3.9",
  ret: "M9 14L4 9l5-5M4 9h11a5 5 0 010 10h-3",
  wal: "M3 7h18v13H3zM3 7l3-4h12l3 4M16 13h2",
  clk: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  me: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  chart: "M4 20V10M10 20V4M16 20v-8M22 20H2",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z",
  sh: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
} as const;

// Helper pembuat item
const L = (key: string, label: string, href: string, icon: keyof typeof ICONS): NavItem => ({
  type: "link",
  key,
  label,
  href,
  icon,
});

const P = (key: string, label: string, icon: keyof typeof ICONS, children: NavSubItem[]): NavItem => ({
  type: "parent",
  key,
  label,
  icon,
  children,
});

// Struktur Navigasi Berjenjang (Hierarchical Parent-Child Menu)
export const NAV: Record<Role, NavItem[]> = {
  admin: [
    L("dashboard", "Dashboard", "/admin/dashboard", "dash"),
    L("booking", "Booking", "/admin/booking", "cal"),
    P("transaksi", "Transaksi", "rec", [
      { label: "Transaksi Penyewaan", href: "/admin/transaksi/sewa" },
      { label: "Transaksi Penjualan", href: "/admin/transaksi/jual" },
    ]),
    P("barang", "Data Barang", "box", [
      { label: "Semua Barang", href: "/admin/barang" },
      { label: "Kategori Barang", href: "/admin/kategori" },
      { label: "Paket Penyewaan", href: "/admin/paket" },
    ]),
    L("stok", "Stok dan Ketersediaan", "/admin/stok", "stok"),
    L("pelanggan", "Data Pelanggan", "/admin/pelanggan", "usr"),
    L("pengembalian", "Pengembalian", "/admin/pengembalian", "ret"),
    L("pengeluaran", "Pengeluaran", "/admin/pengeluaran", "wal"),
    L("riwayat", "Riwayat Aktivitas", "/admin/riwayat", "clk"),
    L("profil", "Profil Akun", "/admin/profil", "me"),
  ],
  owner: [
    L("dashboard", "Dashboard", "/owner/dashboard", "dash"),
    L("booking", "Monitoring Booking", "/owner/booking", "cal"),
    P("transaksi", "Monitoring Transaksi", "eye", [
      { label: "Transaksi Penyewaan", href: "/owner/transaksi/sewa" },
      { label: "Transaksi Penjualan", href: "/owner/transaksi/jual" },
    ]),
    P("barang", "Data Barang", "box", [
      { label: "Semua Barang", href: "/owner/barang" },
      { label: "Kategori Barang", href: "/owner/kategori" },
      { label: "Paket Penyewaan", href: "/owner/paket" },
    ]),
    L("stok", "Stok dan Ketersediaan", "/owner/stok", "stok"),
    L("pelanggan", "Data Pelanggan", "/owner/pelanggan", "usr"),
    L("pengembalian", "Monitoring Pengembalian", "/owner/pengembalian", "ret"),
    L("pengeluaran", "Pengeluaran", "/owner/pengeluaran", "wal"),
    P("laporan", "Laporan", "chart", [
      { label: "Laporan Keuangan", href: "/owner/laporan/keuangan" },
      { label: "Laporan Penyewaan", href: "/owner/laporan/penyewaan" },
      { label: "Laporan Penjualan", href: "/owner/laporan/penjualan" },
      { label: "Laporan Stok", href: "/owner/laporan/stok" },
      { label: "Laporan Pelanggan", href: "/owner/laporan/pelanggan" },
    ]),
    L("riwayat", "Riwayat Aktivitas", "/owner/riwayat", "clk"),
    P("pengguna", "Kelola Pengguna", "sh", [
      { label: "Daftar Pengguna", href: "/owner/pengguna" },
      { label: "Hak Akses", href: "/owner/hak-akses" },
    ]),
    L("profil", "Profil Akun", "/owner/profil", "me"),
  ],
};

export const ROLE_INFO: Record<Role, { initial: string; name: string; label: string }> = {
  admin: { initial: "AD", name: "Admin Toko", label: "Admin" },
  owner: { initial: "OW", name: "Pemilik Toko", label: "Owner" },
};
