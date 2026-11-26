# Aturan Styling — Summit Rental & Store (19 Summit Adventure)

Panduan styling untuk **semua halaman** Admin & Owner (Desktop, Tablet, Mobile). Nilai diambil langsung dari desain final (`app.css`, `t.css`, `m.css`, `Nav.dc.html`). Untuk daftar warna lengkap lihat `ATURAN-WARNA.md`; dokumen ini tidak mengulanginya, hanya menunjuk token yang dipakai.

> Prinsip: **bersih, netral, padat-informasi.** Hitam/putih/abu untuk struktur, biru langit untuk aksi & identitas, hijau/kuning/merah hanya untuk status. Tidak ada gaya baru di luar daftar ini.

---

## 1. Token dasar (`:root`)

```css
:root{
  /* warna → detail di ATURAN-WARNA.md */
  --k:#0A0A0A; --w:#fff; --night:#0D1117;
  --n50:#FAFAFA; --n100:#F2F2F2; --n200:#E5E5E5; --n400:#A3A3A3; --n600:#525252; --n800:#262626; --n900:#141414;
  --acc:#0EA5E9; --acc-h:#0284C7; --acc-s:#E0F2FE; --acc-t:#0369A1; --sky2:#BAE6FD;
  --bg:#F3F8FB; --line:#E7E7E7; --ctl:#949494;
  --grn-s:#DCFCE7; --amb-s:#FEF3C7;
  /* bayangan */
  --sh:0 1px 2px rgba(10,10,10,.05),0 1px 1px rgba(10,10,10,.03);
}
```

### 1.1 Radius
| Pakai | Nilai |
|---|---|
| Tombol kecil, tab item | `8–9px` |
| Tombol, input, note, segmen, item menu | `10px` |
| Tab bar, `.mbi` pill | `12px` / `15px` |
| Kartu, item daftar mobile | `14px` |
| Modal | `16px` |
| Hero | `20px` |
| Badge, avatar, titik | `999px` / `50%` |

### 1.2 Bayangan
| Nama | Nilai | Dipakai |
|---|---|---|
| `--sh` | `0 1px 2px rgba(10,10,10,.05), 0 1px 1px rgba(10,10,10,.03)` | Kartu, tombol (desktop/tablet) |
| Tab aktif | `0 1px 3px rgba(10,10,10,.12)` | `.tab.on` |
| Bottom bar | `0 -4px 16px rgba(10,10,10,.05)` | `.mbot` (mobile) |
| Modal | `0 24px 60px rgba(10,10,10,.35)` | `.modal` |
| Fokus input | `0 0 0 3px var(--acc-s)` | `.i:focus` |

Mobile: tombol **tanpa** bayangan (`.ph .btn{box-shadow:none}`).

### 1.3 Spasi
Skala yang dipakai: **4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 28 · 32 · 40 · 56** px. Jangan pakai angka di luar skala.

| Konteks | Desktop | Tablet | Mobile |
|---|---|---|---|
| Padding halaman (`.main`) | `32 40 56` | `28 28 44` | `18 16` (`.mc`) |
| Jarak antar blok | `24` | `20` | `14` |
| Padding kartu (`.pad`) | `22` | `16–22` | `16` |
| Header kartu (`.ch`) | `18 22` | sama | sama |
| Jarak kartu grid | `g2/g3: 24`, `g4: 20`, `g6: 12` | `g4: 12`, `g3: 14`, `g2: 16` | 1 kolom |

---

## 2. Tipografi

Font: **Inter** (400/500/600/700), fallback `system-ui, sans-serif`. Dimuat dari Google Fonts, `-webkit-font-smoothing: antialiased`. Angka selalu `font-variant-numeric: tabular-nums` (KPI, tabel).

| Peran | Ukuran / berat | Catatan |
|---|---|---|
| Body | `14px / 1.5`, 400 | Default `body` |
| `h1` judul halaman | `26px`, 700, `line-height 1.15`, `letter-spacing -.025em` | Tablet `24px` |
| Judul kartu `.ct` | `15px`, 700, `-.01em` | |
| Sub kartu `.cs` / `.sub` | `12px` / `14px`, `--n600` | |
| Crumb | `11px`, 600, UPPERCASE, `.08em`, `--n600` | Di atas `h1` |
| KPI nilai `.kv` | `30px`, 700, `-.03em` | Tablet `24px` |
| KPI label `.kl` | `13px`, 500, `--n600` | |
| Catatan KPI `.kn` | `12px`, `--n600` | |
| Label form `.lb` | `13px`, 600 | |
| Header tabel `th` | `11px`, 600, UPPERCASE, `.06em`, `--n600` | |
| Badge | `12px`, 600 | |
| Tombol | `14px`, 600 (kecil `13px`) | |
| Tab | `13px`, 600 | |
| Menu samping `.nv` | `14px`, 500 (aktif 600); sub `13px` | |
| Mobile judul `.mt` | `17px`, 700 | Input mobile `16px` (cegah zoom iOS) |
| Mobile tab bar `.mbi` | `11px`, 600 | |

Aturan: maksimal 2 berat per area (500/600 atau 600/700). Tidak ada `italic`. Teks panjang dipotong dengan `text-overflow: ellipsis` (judul mobile) atau `white-space: nowrap` hanya untuk badge/header tabel.

---

## 3. Layout & breakpoint

| Mode | Lebar | File | Struktur |
|---|---|---|---|
| Desktop | fluid (artboard 1440) | `app.css` | Sidebar `264px` + `.main` (`flex: 999 1 640px; min-width:0`) |
| Tablet | `834px` (`.tp`, min-h 1194) | `t.css` | Sidebar + `.tmain` `750px` |
| Mobile | `390px` (`.ph`, min-h 844) | `m.css` | `.mtop` 56px + `.mc` + `.mbot` 68px; menu via `MMenuAdmin/Owner` |
| Responsif | `≤ 760px` | `app.css` media | Semua grid (`g2,g3,g4,g32,g6,fg,fg3`) → 1 kolom, `.span2` auto, `.main` padding `20 16 40` |

Grid: selalu `repeat(n, minmax(0,1fr))` (cegah overflow). Kolom utama + samping memakai `g32` (`3fr 2fr`). Latar halaman: `--bg` dengan titik `radial-gradient(rgba(14,165,233,.16) 1px, transparent 1px)` ukuran `22px`.

Header halaman (`.head`): flex, `space-between`, `align-items:flex-end`, `gap:16`, `padding-bottom:22`, garis bawah `1px --line`; aksi (`.acts`) di kanan, `gap:10`, boleh wrap.

Tabel lebar: bungkus dengan scroll horizontal; `.tbl{min-width:720px}`.

---

## 4. Komponen

### 4.1 Tombol `.btn`
Dasar: tinggi `40`, padding `0 18`, radius `10`, border `1px #D4D4D4`, putih, `--sh`, transisi `background/border .15s`.

| Varian | Gaya | Hover | Kapan |
|---|---|---|---|
| default | putih, teks `--k` | `--n50`, border `--ctl` | Aksi sekunder |
| `.pri` | hitam, teks putih | `--n800` | **Satu** aksi utama per area |
| `.acc` | biru `--acc`, teks `--k` | `#38BDF8` | Aksi sorotan/ekspor |
| `.dng` | putih, teks `#991B1B`, border `#FCA5A5` | `#FEF2F2` | Hapus/batalkan |
| `.sm` | tinggi `32`, padding `0 12`, `13px`, radius `8` | — | Aksi di baris tabel |

Tablet: tinggi `44` (sm `36`). Mobile: input `48`. Satu halaman → satu `.pri`.

### 4.2 Input `.i`
Tinggi `42`, radius `10`, border `1px --ctl`, padding `0 14`, `14px`, putih. `textarea.i` tinggi `92`, padding `11 14`. Tablet `44`; mobile `48` (font `16px`, textarea `96`).
Fokus: `outline:0; border-color:--acc-h; box-shadow:0 0 0 3px --acc-s`.
Checkbox/radio: `18×18`, `accent-color:--k`.
Form: `.fg` 2 kolom, `.fg3` 3 kolom, jarak `18px 22px`; label di atas input (`.lb`).

### 4.3 Kartu `.card`
Putih, border `1px --line`, radius `14`, `--sh`, `overflow:hidden`. Struktur: `.ch` (judul + aksi) → isi (`.pad`) → `.pg` (paginasi: `14 22`, border atas, `13px`, `--n600`).

### 4.4 KPI
`.kpi` padding `20 22`, relative. Isi: label (`.kl`) → nilai (`.kv`) → catatan (`.kn`).
- Dekorasi: lingkaran `96px` di pojok kanan atas (`right/top:-22px`) warna lembut per urutan: ke‑1 `--acc-s`, ke‑2 `--grn-s`, ke‑3 `--amb-s`, ke‑4 `--sky2`; ikon garis `1.8px` warna tegas di `::after`.
- `.kpi.dark`: latar `--k` + pola gunung putih `.08–.16` di kanan bawah, garis aksen biru `28×3` di atas kiri.
- Tablet/mobile: lingkaran `60px`, opacity `.6`, ikon `::after` disembunyikan.

### 4.5 Badge status `.b`
Pil `999px`, padding `3 10 3 8`, `12px/600`, ada titik `6px` (`::before`, `currentColor`).

| Kelas | Latar | Teks | Arti |
|---|---|---|---|
| `.ok` | `#E6F6EC` | `#166534` | Lunas, tersedia, selesai |
| `.wn` | `#FEF3D2` | `#92400E` | Belum lunas, menipis, menunggu |
| `.er` | `#FDE7E7` | `#991B1B` | Terlambat, habis, batal |
| `.in` | `--acc-s` | `#075985` | Info, berjalan |
| `.nu` | `--n100` | `#404040` | Netral, draft |

Jangan membuat warna badge baru; satu status = satu kelas di seluruh halaman.

### 4.6 Tabel `.tbl`
`width:100%`, `border-collapse:collapse`. `th`: `11px` UPPERCASE, latar `--n50`, border bawah `--line`, padding `12 16`. `td`: padding `14 16`, border bawah `--n100`, `vertical-align:middle`, `tabular-nums`. Hover baris: `td{background:--n50}`. Tablet padding `13 12`. Angka uang rata kanan.

### 4.7 Tab `.tabs` & segmen `.seg`
`.tabs`: flex, `gap:2`, padding `4`, latar `--n100`, radius `12`, `width:fit-content`. `.tab`: `8 16`, radius `9`, `13px/600`, teks `--n600`; hover `--k`; aktif `.on` → putih + teks `--k` + bayangan tab.
`.seg`: padding `3`, latar `--n100`, radius `10` — untuk pilihan periode/rentang.

### 4.8 Catatan `.note`
Flex, `gap:10`, padding `13 16`, radius `10`, border kiri `3px`, `13px`. Varian: biru (default, `--acc-s` / `#075985`), `.ok` hijau (`#16A34A`), `.wn` kuning (`#F59E0B`), `.er` merah (`#DC2626`).

### 4.9 Modal `.modal`
Lebar `100%`, maks `640`, putih, radius `16`, bayangan modal, `overflow:hidden`; di belakangnya lapisan gelap `.scrim` (`rgba(10,10,10,.55)`, padding `56 24`, `fadein .3s`). Masuk dengan `pop .35–.5s`. Mobile: bentuk **sheet** dari bawah (`sheet`).

### 4.10 Hero (Dashboard)
Padding `30 34`, radius `20`, teks putih; latar `--night` + `radial-gradient(520px 260px at 100% 0, rgba(14,165,233,.38), transparent 65%)` + siluet gunung SVG. Hanya dipakai di dashboard.

### 4.11 Grafik
- Batang `.bars`: `gap:16`, tinggi `200`; batang utama `--acc`, pembanding `--night`, pasif `--n200`. Animasi `growy`.
- Bar horizontal: `growx`.
- Donut `.donut`: `156×156`, `conic-gradient` dengan warna status (hijau `#16A34A`, biru `#0EA5E9`, abu `#A3A3A3`, kuning `#F59E0B`, merah `#DC2626`, abu tua `#525252`), angka di tengah.
- Selalu ada legenda/label teks — warna tidak boleh jadi satu‑satunya pembeda.

### 4.12 Sidebar (`.side`, 264px)
- Latar `--night` + siluet gunung bawah + `radial-gradient(420px 300px at 0 100%, rgba(14,165,233,.22), transparent 70%)`; padding `20 12 24`; `gap:2`; teks `#A3A3A3`.
- `.brand`: logo bulat `40` putih huruf "S" (800/22px), nama `SUMMIT` `15px/700`, `letter-spacing .18em`; garis bawah `1px #1F1F1F`.
- `.nv`: padding `9 12`, radius `10`, `gap:12`, ikon `18px` stroke `1.8`. Hover: `#161616`, teks putih, geser `translateX(3px)`. Aktif `.on`: latar `rgba(14,165,233,.16)`, teks putih 600, ikon `#38BDF8`, penanda kiri `3px` biru `--acc` di `left:-12px`.
- `.gh` (judul grup): `14px/600`, `#E5E5E5`, `margin-top:6px`, ikon sama.
- `.nv.sub`: `margin-left:21`, padding `7 12 7 20`, `13px`, border kiri `1px #262626`, radius `0 10 10 0`; aktif: border kiri biru, latar `rgba(14,165,233,.12)`, tanpa penanda.
- `.me` (kartu pengguna): `margin-top:auto`, padding `12`, latar `#141B25`, border `1px rgba(255,255,255,.08)`, radius `12`; avatar `34` biru huruf `--k`; tombol `Keluar` `12px/600`, hover `#262626`.
- Daftar menu `.nvs` scrollable agar kartu pengguna tetap terlihat.

### 4.13 Mobile
`.mtop` hitam `56`, ikon tap `44×44`, avatar `32`. `.mbot` putih `68`, border atas `--line`; item `.mbi` ikon dalam pil `52×30`; aktif = pil hitam, teks `--k`. Item daftar `.mi`: putih, border `1px #DCE6EE`, radius `14`, padding `16`, `gap:10`.

---

## 5. State interaksi

| State | Aturan |
|---|---|
| Hover tombol | ganti latar/border (lihat 4.1), transisi `.15s` |
| Hover baris tabel | `--n50` |
| Hover menu | `#161616` + geser 3px |
| Aktif (halaman) | menu `.on`, tab `.on`, pil mobile hitam |
| Fokus input | ring biru 3px (`--acc-s`) + border `--acc-h` |
| Fokus tombol/link | pakai `:focus-visible` dengan outline `2px --acc-h`, offset `2px` (tambahkan jika belum ada) |
| Disabled | `opacity:.5`, `cursor:not-allowed`, tanpa hover |
| Error input | border `#DC2626` + pesan `12px` `#991B1B` di bawah |
| Loading | gradasi `--acc` → `#38BDF8`; jangan menahan seluruh halaman |

---

## 6. Animasi

Kurva utama: `cubic-bezier(.2,.7,.2,1)`. Durasi pendek untuk interaksi (`.15s`), sedang untuk masuk elemen (`.35–.6s`), panjang hanya untuk grafik (`.9–1.1s`).

| Keyframes | Dipakai | Durasi |
|---|---|---|
| `rise` | Kartu/blok masuk (naik 14px + fade), di-stagger | `.6s` |
| `fadein` | Overlay, brand, menu | `.3–.6s` |
| `pop` | Modal/popup (naik 18px, skala .97) | `.35–.5s` |
| `sheet` | Sheet mobile dari bawah | — |
| `growy` / `growx` | Batang vertikal / horizontal | `.9s` / `1.1s` |
| `tick` | Garis aksen judul `0→28px` | `.8s` |
| `slidein` | Menu geser dari kiri 10px | `.5s` |
| `ping` | Titik "live" berdenyut | `1.8s` ∞ |
| `drift` | Latar hero bergerak pelan | `10s` alternate |
| `drawl` | Garis grafik tergambar | — |

Delay stagger menu: `.05s` per item sampai item ke‑5, lalu `.25s`.

**Wajib:**
```css
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation:none!important;transition:none!important}
}
```

---

## 7. Aksesibilitas

- Kontras teks minimal **AA**: teks biru di atas latar biru muda memakai `--acc-t` (`#0369A1`) atau `#075985`, bukan `--acc`.
- Border kontrol (`--ctl` `#949494`) dipakai untuk input agar batasnya terlihat.
- Target sentuh min **44×44** di tablet/mobile (`.mic`, `.btn`, input `44–48`).
- Ikon dekoratif `aria-hidden="true"`; ikon tanpa teks wajib `aria-label`.
- `nav` diberi `aria-label="Menu utama"`; halaman aktif dengan `aria-current="page"`.
- Status tidak hanya warna: badge selalu punya teks + titik.
- Hormati `prefers-reduced-motion` (bagian 6).

---

## 8. Do & Don't

**Do**
- Pakai token (`var(--…)`) — tidak ada hex liar di komponen.
- Satu tombol `.pri` per area; aksi destruktif `.dng`.
- Kartu putih di atas latar `--bg`; pemisah pakai `1px --line`.
- Angka uang/jumlah `tabular-nums`, rata kanan di tabel.
- Warna hangat (oranye tenda) **hanya** di splash & login.

**Don't**
- Jangan tambah warna badge/status baru.
- Jangan pakai bayangan tebal selain modal.
- Jangan campur radius di luar tabel 1.1.
- Jangan pakai animasi >1.1s kecuali dekoratif latar hero.
- Jangan pakai warna sebagai satu-satunya penanda.
- Jangan hardcode lebar piksel pada konten desktop; gunakan grid `minmax(0,1fr)`.

---

## 9. Penerapan di Next.js

**Cara A — pakai CSS yang sudah ada (paling cepat, sama persis dengan desain)**
Salin `styles/app.css` ke proyek, impor sekali di `app/layout.tsx`:
```tsx
import '@/styles/app.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], weight: ['400','500','600','700'] });
```
Sidebar: `components/sidebar/sidebar.css`; rekap dashboard: `rekap.css`.

**Cara B — Tailwind**
```ts
// tailwind.config.ts
theme: { extend: {
  colors: { night:'#0D1117', acc:{DEFAULT:'#0EA5E9',h:'#0284C7',s:'#E0F2FE',t:'#0369A1'},
            line:'#E7E7E7', ctl:'#949494', surface:'#F3F8FB' },
  borderRadius: { ctl:'10px', card:'14px', modal:'16px', hero:'20px' },
  boxShadow: { card:'0 1px 2px rgba(10,10,10,.05),0 1px 1px rgba(10,10,10,.03)',
               modal:'0 24px 60px rgba(10,10,10,.35)' },
  fontFamily: { sans:['Inter','system-ui','sans-serif'] },
}}
```
Komponen berulang (`Btn`, `Badge`, `Card`, `Kpi`) dibuat sekali sebagai komponen React yang memetakan varian di 4.1 dan 4.5, bukan menulis kelas berulang di tiap halaman.

**Aturan penamaan:** pertahankan nama kelas desain (`.btn`, `.card`, `.b`, `.ok/.wn/.er/.in/.nu`, `.tbl`, `.tabs`, `.note`) supaya AI/rekan tim bisa memetakan 1‑ke‑1 dengan desain Figma dan `ALUR-NAVIGASI.md`.

---

## 10. Catatan & celah yang diketahui

- `:focus-visible` untuk tombol/link belum terdefinisi eksplisit di desain; tambahkan sesuai bagian 5.
- Status disabled/error input belum digambar di desain; aturan di bagian 5 adalah usulan yang selaras token.
- Halaman *Cek Ketersediaan* belum punya komponen `CekSedia`, jadi belum ada aturan khusus untuknya.
