// components/sidebar/nav-config.ts
export type Role = "admin" | "owner";

export type NavItem =
  | { type: "link"; label: string; href: string; icon: keyof typeof ICONS }
  | { type: "group"; label: string; icon: keyof typeof ICONS }
  | { type: "sub"; label: string; href: string };

// Path ikon 24x24 (stroke) — sama persis dengan desain
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

const L = (label: string, href: string, icon: keyof typeof ICONS): NavItem => ({ type: "link", label, href, icon });
const G = (label: string, icon: keyof typeof ICONS): NavItem => ({ type: "group", label, icon });
const S = (label: string, href: string): NavItem => ({ type: "sub", label, href });

// Sesuaikan href dengan struktur folder app/ Anda
export const NAV: Record<Role, NavItem[]> = {
  admin: [
    L("Dashboard", "/admin/dashboard", "dash"),
    L("Booking", "/admin/booking", "cal"),
    G("Transaksi", "rec"),
    S("Transaksi Penyewaan", "/admin/transaksi/sewa"),
    S("Transaksi Penjualan", "/admin/transaksi/jual"),
    G("Data Barang", "box"),
    S("Semua Barang", "/admin/barang"),
    S("Kategori Barang", "/admin/kategori"),
    S("Paket Penyewaan", "/admin/paket"),
    L("Stok dan Ketersediaan", "/admin/stok", "stok"),
    L("Data Pelanggan", "/admin/pelanggan", "usr"),
    L("Pengembalian", "/admin/pengembalian", "ret"),
    L("Pengeluaran", "/admin/pengeluaran", "wal"),
    L("Riwayat Aktivitas", "/admin/riwayat", "clk"),
    L("Profil Akun", "/admin/profil", "me"),
  ],
  owner: [
    L("Dashboard", "/owner/dashboard", "dash"),
    L("Monitoring Booking", "/owner/booking", "cal"),
    G("Monitoring Transaksi", "eye"),
    S("Transaksi Penyewaan", "/owner/transaksi/sewa"),
    S("Transaksi Penjualan", "/owner/transaksi/jual"),
    G("Data Barang", "box"),
    S("Semua Barang", "/owner/barang"),
    S("Kategori Barang", "/owner/kategori"),
    S("Paket Penyewaan", "/owner/paket"),
    L("Stok dan Ketersediaan", "/owner/stok", "stok"),
    L("Data Pelanggan", "/owner/pelanggan", "usr"),
    L("Pengeluaran", "/owner/pengeluaran", "wal"),
    G("Laporan", "chart"),
    S("Laporan Keuangan", "/owner/laporan/keuangan"),
    S("Laporan Penyewaan", "/owner/laporan/penyewaan"),
    S("Laporan Penjualan", "/owner/laporan/penjualan"),
    S("Laporan Stok", "/owner/laporan/stok"),
    S("Laporan Pelanggan", "/owner/laporan/pelanggan"),
    L("Riwayat Aktivitas", "/owner/riwayat", "clk"),
    G("Kelola Pengguna", "sh"),
    S("Daftar Pengguna", "/owner/pengguna"),
    S("Hak Akses", "/owner/hak-akses"),
    L("Profil Akun", "/owner/profil", "me"),
  ],
};

export const ROLE_INFO: Record<Role, { initial: string; name: string; label: string }> = {
  admin: { initial: "AD", name: "Admin Toko", label: "Admin" },
  owner: { initial: "OW", name: "Pemilik Toko", label: "Owner" },
};
