# Aturan Struktur Project — Summit Rental & Store

Stack: **Next.js (App Router, TypeScript) + Supabase (Postgres, Auth, Storage, Realtime)**.
Struktur ini mengikuti desain Figma saat ini (Admin & Owner; Desktop, Tablet, Mobile) dan konvensi `ALUR-NAVIGASI.md`, `ATURAN-STYLING.md`, `ATURAN-WARNA.md`. Bagian 12 menjelaskan cara menyesuaikannya untuk proyek lain.

> Prinsip: **1 folder = 1 tanggung jawab.** Halaman tipis, logika di `features/`, akses data hanya lewat `server/`, UI generik di `components/ui`.

---

## 1. Struktur folder

```
summit/
├─ src/
│  ├─ app/                         # ROUTING saja (page, layout, loading, error)
│  │  ├─ (auth)/
│  │  │  └─ masuk/page.tsx
│  │  ├─ (admin)/admin/
│  │  │  ├─ layout.tsx             # Sidebar role=admin + guard
│  │  │  ├─ dashboard/page.tsx
│  │  │  ├─ booking/…
│  │  │  ├─ transaksi/{sewa,jual}/…
│  │  │  ├─ barang/…  kategori/…  paket/…
│  │  │  ├─ stok/…  pelanggan/…  pengembalian/…
│  │  │  ├─ pengeluaran/…  riwayat/…  profil/…
│  │  ├─ (owner)/owner/
│  │  │  ├─ layout.tsx             # Sidebar role=owner + guard
│  │  │  ├─ dashboard/page.tsx
│  │  │  ├─ monitoring/{booking,sewa,jual}/…
│  │  │  ├─ barang/…  kategori/…  paket/…  stok/…  pelanggan/…
│  │  │  ├─ pengeluaran/…
│  │  │  ├─ laporan/{keuangan,sewa,jual,stok,pelanggan}/page.tsx
│  │  │  ├─ riwayat/…
│  │  │  ├─ pengguna/{daftar,akses}/…
│  │  │  └─ profil/…
│  │  ├─ api/                      # Route handler (webhook, export) — seperlunya
│  │  ├─ layout.tsx                # root: font Inter, global css
│  │  ├─ not-found.tsx  error.tsx
│  │  └─ globals.css               # impor styles/
│  │
│  ├─ features/                    # LOGIKA PER DOMAIN (satu folder per modul)
│  │  ├─ booking/
│  │  │  ├─ components/            # BookingTable, BookingForm, StatusBadge…
│  │  │  ├─ actions.ts             # server actions (create, confirm, cancel)
│  │  │  ├─ queries.ts             # baca data (server)
│  │  │  ├─ schema.ts              # zod: validasi form
│  │  │  ├─ types.ts
│  │  │  └─ index.ts               # satu-satunya pintu keluar modul
│  │  ├─ transaksi-sewa/  transaksi-jual/  pengembalian/
│  │  ├─ barang/  kategori/  paket/  stok/  pelanggan/
│  │  ├─ pengeluaran/  riwayat/  laporan/
│  │  ├─ dashboard/                # OwnerRekap, kartu KPI, hero
│  │  ├─ pengguna/                 # daftar + hak akses
│  │  └─ auth/                     # login, session, role
│  │
│  ├─ components/
│  │  ├─ ui/                       # generik tanpa domain: Button, Input, Card,
│  │  │                            # Badge, Table, Tabs, Seg, Note, Modal, Sheet, Kpi
│  │  ├─ layout/                   # Sidebar, MobileTop, MobileBottom, PageHeader
│  │  └─ charts/                   # Bars, Donut, Sparkline
│  │
│  ├─ server/                      # HANYA dijalankan di server
│  │  ├─ supabase/{server,admin}.ts
│  │  ├─ auth.ts                   # getSession(), requireRole()
│  │  └─ audit.ts                  # tulis Riwayat Aktivitas
│  │
│  ├─ lib/                         # util murni, aman di client & server
│  │  ├─ supabase/browser.ts
│  │  ├─ format.ts                 # rupiah, tanggal (id-ID)
│  │  ├─ date.ts  periode.ts       # PeriodeFilter
│  │  ├─ cn.ts  constants.ts
│  │  └─ nav-config.ts             # menu per role (sumber tunggal)
│  │
│  ├─ hooks/                       # useMediaQuery, usePeriode, …
│  ├─ styles/                      # app.css, t.css, m.css, tokens.css
│  ├─ types/                       # database.types.ts (hasil generate), global.d.ts
│  └─ middleware.ts                # refresh session + redirect per role
│
├─ supabase/
│  ├─ migrations/                  # 0001_init.sql, 0002_rls.sql, …
│  ├─ seed.sql
│  └─ config.toml
├─ tests/                          # unit (vitest) + e2e (playwright)
├─ docs/                           # ALUR-NAVIGASI.md, ATURAN-*.md, SITEMAP.md, DFD
├─ public/                         # logo, foto latar (1920px, .webp)
├─ .env.example  .env.local        # .env.local TIDAK di-commit
├─ next.config.ts  tsconfig.json  eslint.config.mjs  package.json
```

---

## 2. Pemetaan Figma → kode

| Figma | Kode |
|---|---|
| Artboard `Nama.dc.html` (desktop) | `app/(admin|owner)/…/page.tsx` |
| Artboard `T*` (tablet) / `M*` (mobile) | **bukan route terpisah** — satu halaman responsif (`styles/t.css`, `m.css`, atau media query) |
| `Nav.dc.html` | `components/layout/Sidebar.tsx` + `lib/nav-config.ts` |
| `MTop`, `MBot`, `MMenuAdmin/Owner` | `components/layout/Mobile*.tsx` |
| Prefiks `Ow*`, `Mon*`, `Lap*` | folder `owner/…` (tidak ada prefiks pada nama file) |
| Komponen berulang (btn, card, badge, tbl, tabs, note) | `components/ui/*` |
| Modal (FormBayar, dll.) | komponen modal di `features/<modul>/components` |

Nama file Figma (`TrxSewa`, `DetailTrx`, `FormKembali`) → nama komponen **PascalCase** di `features/`; nama route → **kebab-case Indonesia** (`transaksi/sewa`, `pengembalian`).

---

## 3. Aturan penamaan

| Hal | Aturan | Contoh |
|---|---|---|
| Folder & route | kebab-case | `transaksi-sewa`, `/admin/transaksi/sewa` |
| Komponen React | PascalCase, 1 komponen/file | `StatusBadge.tsx` |
| Hook | `useXxx.ts` | `usePeriode.ts` |
| Server action | kata kerja | `createBooking`, `confirmBooking` |
| Query | `get/list` | `listBooking`, `getTransaksi` |
| Skema zod | `xxxSchema` | `bookingSchema` |
| Tipe | PascalCase, tanpa awalan `I` | `Booking`, `StatusBayar` |
| Konstanta | UPPER_SNAKE | `STATUS_BOOKING` |
| Tabel DB | snake_case, jamak | `booking`, `transaksi_sewa`, `item_sewa` |
| Kolom | snake_case | `tanggal_ambil`, `total_bayar` |
| Kelas CSS | pertahankan dari desain | `.btn`, `.card`, `.b.ok` |

Bahasa: **UI dan nama domain Indonesia**; istilah teknis/framework tetap Inggris (`layout`, `hooks`, `middleware`).

---

## 4. Aturan lapisan (siapa boleh impor siapa)

```
app  →  features  →  components/ui, lib, server
components/ui  →  lib saja
server  →  lib saja
```
1. `app/` hanya merakit: ambil data dari `features/*/queries`, render komponen. **Tanpa logika bisnis.**
2. `features/A` tidak boleh impor dalam `features/B`; hanya lewat `index.ts`. Butuh bersama → naikkan ke `lib/` atau `components/`.
3. `components/ui` tidak tahu domain (tidak ada kata "booking" di dalamnya).
4. Kode `server/` diberi `import 'server-only'`; tidak pernah diimpor komponen client.
5. Tidak ada query Supabase langsung di komponen; semua lewat `queries.ts` / `actions.ts`.
6. Tidak ada impor sirkular (cek dengan ESLint `import/no-cycle`).

---

## 5. Server vs Client component

- Default **Server Component**. Tambahkan `'use client'` hanya untuk interaksi (filter, modal, tab, grafik interaktif, `PeriodeFilter`).
- Data dibaca di Server Component, dikirim sebagai props ke komponen client yang kecil.
- Mutasi lewat **Server Action** (`actions.ts`) + `revalidatePath`. Validasi ulang dengan zod di server, jangan percaya validasi client.
- Satu halaman = satu `page.tsx` + `loading.tsx` (skeleton) + `error.tsx`.

---

## 6. Peran, rute, dan keamanan

- Grup rute `(admin)` dan `(owner)`; prefiks URL `/admin` dan `/owner`.
- Pengecekan berlapis: `middleware.ts` (redirect cepat) → `requireRole()` di `layout.tsx` → **RLS di database** (penentu utama).
- Role disimpan di tabel `profil` (`role: 'admin' | 'owner'`), bukan di input klien.
- `SUPABASE_SERVICE_ROLE_KEY` hanya di `server/supabase/admin.ts`; tidak pernah di `NEXT_PUBLIC_*`.
- Operasi uang/stok (pelunasan, pengembalian, pengurangan stok) dikerjakan lewat **fungsi RPC atomik** di Postgres, bukan beberapa panggilan terpisah dari klien.
- Cegah booking ganda dengan *exclusion constraint* pada rentang tanggal per unit.
- Setiap mutasi menulis ke `riwayat_aktivitas` lewat `server/audit.ts`.

---

## 6b. Variabel lingkungan

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server saja
```
`.env.example` di-commit (tanpa nilai); `.env.local` masuk `.gitignore`.

---

## 7. Database & migrasi

- Semua perubahan skema lewat `supabase/migrations/NNNN_nama.sql` (berurutan, tidak diedit setelah dirilis).
- Aktifkan RLS di **setiap** tabel; kebijakan di `*_rls.sql`.
- Tipe TypeScript dibuat otomatis: `supabase gen types typescript > src/types/database.types.ts`.
- Penamaan tabel mengikuti data store DFD (D1–D11) bila memakai dokumen DFD.
- `seed.sql` hanya data contoh (kategori, paket, akun uji), bukan data produksi.

---

## 8. Styling di struktur ini

- `styles/tokens.css` (`:root` dari `ATURAN-STYLING.md` §1) → `app.css` (komponen) → `t.css`/`m.css` (override per ukuran).
- Impor sekali di `app/layout.tsx`. CSS khusus modul diletakkan di ssebelah komponen (`rekap.css`) dan diimpor oleh komponennya.
- Jika memakai Tailwind, token dipetakan di `tailwind.config.ts` (lihat `ATURAN-STYLING.md` §9); jangan campur dua cara pada komponen yang sama.

---

## 9. Pengujian & kualitas

| Alat | Fungsi |
|---|---|
| ESLint + Prettier | gaya & aturan impor |
| `tsc --noEmit` | tipe harus bersih |
| Vitest | unit: `format.ts`, `periode.ts`, hitung denda/pelunasan |
| Playwright | e2e alur utama: login → booking → proses sewa → pengembalian → laporan |
| `next build` | wajib lulus sebelum merge |

Skrip `package.json`: `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`, `db:types`, `db:migrate`.

---

## 10. Git & alur kerja

- Cabang: `main` (rilis) ← `develop` ← `fitur/<modul>-<ringkas>` (mis. `fitur/booking-form`).
- Commit: `feat(booking): tambah form booking`, `fix(stok): …`, `chore: …`.
- PR kecil per modul; wajib lulus lint, typecheck, test, build.
- Jangan commit `.env*`, `node_modules`, `.next`, kunci apa pun.

---

## 11. Urutan membangun (disarankan)

1. Fondasi: `styles`, `components/ui`, `Sidebar`, `nav-config`, layout Admin/Owner.
2. Auth + `middleware` + `requireRole` + tabel `profil`.
3. Master data: kategori → barang → paket → pelanggan → stok.
4. Booking → Transaksi Sewa → Pengembalian → Transaksi Jual → Pengeluaran.
5. Dashboard & Laporan (Owner), Riwayat Aktivitas.
6. Kelola Pengguna & Hak Akses.
7. Hardening: RLS audit, e2e, performa.

---

## 12. Menyesuaikan untuk proyek lain (versi umum)

Pola inti yang bisa dipakai ulang:
- `app/` = routing, `features/` = domain, `components/ui` = UI generik, `server/` = akses data, `lib/` = util, `supabase/migrations` = skema.
- Ganti daftar modul di `features/` dan grup rute (`(admin)`, `(owner)`) sesuai peran proyek baru.
- Proyek kecil (<10 halaman): boleh hapus `features/` dan taruh `actions.ts`/`queries.ts` di samping `page.tsx`.
- Proyek besar/banyak tim: pertimbangkan monorepo (`apps/web`, `packages/ui`, `packages/db`) dengan pola lapisan yang sama.

---

## 13. Celah yang masih terbuka

- Komponen `CekSedia` (Cek Ketersediaan) belum ada di desain; folder `features/stok` menyiapkan tempatnya.
- Keputusan produk yang belum final memengaruhi skema: pelunasan saat ambil vs setelah ambil (status Belum Lunas), pemisahan pengeluaran lunas/belum di Laporan Keuangan, dan opsi Hak Akses "Kategori pengeluaran".

