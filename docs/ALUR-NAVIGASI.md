# Peta Alur Navigasi dan Interaksi — Summit Rental & Store

Dokumen ini diturunkan langsung dari file desain Figma/Design (artifact *Summit Rental & Store*, tampilan **Desktop** sebagai acuan). Tujuannya agar AI atau developer tahu **tombol/tautan mana membuka layar apa**, tanpa menebak.

## 0. Cara membaca

- **Layar** ditulis `Judul layar` dengan nama file desain (mis. `DashAdmin`) dan **route Next.js usulan** (mis. `/admin/dashboard`). Route adalah usulan; struktur desain yang mengikat adalah *siapa membuka siapa*.
- **Tombol/tautan → Tujuan**: kolom *Elemen* memakai label persis seperti di desain. Jika elemen berulang di tiap baris tabel, ditulis sekali dengan contoh baris.
- **Modal** = layar yang tampil sebagai popup di atas layar induknya. Tombol **Tutup**, **Batal**, dan simpan di modal kembali ke layar induk. Di Next.js sebaiknya dibuat sebagai modal (state atau intercepting route), bukan halaman terpisah.
- **Komponen** (`*Isi`, `Kasir`, `UnitList`, dll.) bukan layar sendiri; dipakai di dalam layar lain. Perilakunya dijelaskan di §5.
- Dua peran: **Admin** (operasional) dan **Owner** (pemantauan, laporan, pengguna). Menu dan layar Owner memakai awalan `Ow*`/`Mon*`/`Lap*` di desain.
- Breadcrumb di atas judul halaman (mis. *Data Barang / Semua Barang*) umumnya hanya teks, bukan tautan (pengecualian: Cek Ketersediaan).

## 1. Login dan sidebar

### 1.1 Login (`Main` → `/login`)

| Elemen | Tujuan |
|---|---|
| Tombol **Masuk sebagai Admin** | Dashboard Admin → `/admin/dashboard` |
| Tombol **Masuk sebagai Owner** | Dashboard Owner → `/owner/dashboard` |
| Tautan *Lupa password?* | Teks saja (hubungi Owner), tidak membuka halaman |

Catatan: di desain kedua tombol hanya navigasi (tanpa validasi). Pesan *Username atau password tidak sesuai* adalah contoh status galat. Tersisa keputusan: satu tombol **Masuk** dengan peran dikenali dari akun.

### 1.2 Sidebar (komponen `Nav`)

Muncul di semua layar penuh. Item aktif ditandai sesuai layar. Grup (*Transaksi*, *Data Barang*, *Monitoring Transaksi*, *Laporan*, *Kelola Pengguna*) hanya judul, tidak bisa diklik; yang bisa diklik adalah submenunya.

| Menu | Admin → | Owner → |
|---|---|---|
| Dashboard | `/admin/dashboard` | `/owner/dashboard` |
| Booking / Monitoring Booking | `/admin/booking` | `/owner/booking` |
| Transaksi Penyewaan | `/admin/transaksi/sewa` | `/owner/transaksi/sewa` |
| Transaksi Penjualan | `/admin/transaksi/jual` | `/owner/transaksi/jual` |
| Semua Barang | `/admin/barang` | `/owner/barang` |
| Kategori Barang | `/admin/kategori` | `/owner/kategori` |
| Paket Penyewaan | `/admin/paket` | `/owner/paket` |
| Stok dan Ketersediaan | `/admin/stok` | `/owner/stok` |
| Data Pelanggan | `/admin/pelanggan` | `/owner/pelanggan` |
| Pengembalian | `/admin/pengembalian` | — |
| Pengeluaran | `/admin/pengeluaran` | `/owner/pengeluaran` |
| Laporan Keuangan | — | `/owner/laporan/keuangan` |
| Laporan Penyewaan | — | `/owner/laporan/penyewaan` |
| Laporan Penjualan | — | `/owner/laporan/penjualan` |
| Laporan Stok | — | `/owner/laporan/stok` |
| Laporan Pelanggan | — | `/owner/laporan/pelanggan` |
| Riwayat Aktivitas | `/admin/riwayat` | `/owner/riwayat` |
| Daftar Pengguna | — | `/owner/pengguna` |
| Hak Akses | — | `/owner/hak-akses` |
| Profil Akun | `/admin/profil` | `/owner/profil` |
| Kartu pengguna → **Keluar** | `/login` | `/login` |

## 2. Daftar semua layar

| Layar | File desain | Route usulan | Peran | Jenis | Dibuka dari |
|---|---|---|---|---|---|
| Dashboard Admin | `DashAdmin` | `/admin/dashboard` | Admin | Halaman | Login |
| Booking | `Booking` | `/admin/booking` | Admin | Halaman | Cek Ketersediaan, Dashboard Admin, Transaksi Penyewaan |
| Booking Baru | `BookingBaru` | `/admin/booking/baru` | Admin | Halaman | Booking, Cek Ketersediaan, Dashboard Admin, Detail Booking |
| Cek Ketersediaan | `CekKetersediaan` | `/admin/booking/cek-ketersediaan` | Admin | Halaman | (sidebar) |
| Detail Booking | `DetailBooking` | `/admin/booking/[id]` | Admin | Halaman | Booking, Detail Riwayat Aktivitas |
| Transaksi Penyewaan | `TrxSewa` | `/admin/transaksi/sewa` | Admin | Halaman | Booking, Dashboard Admin, Pelunasan Berhasil, Transaksi Penyewaan Langsung |
| Transaksi Penyewaan Langsung | `SewaBaru` | `/admin/transaksi/sewa/baru` | Admin | Halaman | Booking, Cek Ketersediaan, Detail Booking, Transaksi Penyewaan |
| Detail Transaksi | `DetailTrx` | `/admin/transaksi/sewa/[id]` | Admin | Halaman | Detail Pelanggan, Form Pembayaran, Pelunasan Berhasil, Pengembalian, Transaksi Penyewaan |
| Form Pembayaran | `FormBayar` | `/admin/transaksi/sewa/[id]/bayar` | Admin | Modal di atas Detail Transaksi | Detail Transaksi, Form Pengembalian, Transaksi Penjualan |
| Pelunasan Berhasil | `PelunasanBerhasil` | `/admin/transaksi/sewa/[id]/lunas` | Admin | Halaman | Form Pembayaran |
| Transaksi Penjualan | `TrxJual` | `/admin/transaksi/jual` | Admin | Halaman | Detail Penjualan |
| Transaksi Penjualan | `JualBaru` | `/admin/transaksi/jual/baru` | Admin | Halaman | Transaksi Penjualan |
| Detail Penjualan | `DetailJual` | `/admin/transaksi/jual/[id]` | Admin | Halaman | Transaksi Penjualan |
| Semua Barang | `Barang` | `/admin/barang` | Admin | Halaman | Form Barang, Form Barang Jual |
| Detail Barang | `DetailBarang` | `/admin/barang/[kode]` | Admin | Halaman | Semua Barang |
| Detail Unit | `DetailUnit` | `/admin/barang/[kode]/unit/[unit]` | Admin | Halaman | Detail Barang, Stok dan Ketersediaan |
| Form Barang | `FormBarang` | `/admin/barang/form` | Admin | Halaman | Semua Barang, Detail Barang, Stok dan Ketersediaan |
| Form Barang Jual | `FormBarangJual` | `/admin/barang/form-jual` | Admin | Halaman | Stok Barang Jual |
| Kategori Barang | `Kategori` | `/admin/kategori` | Admin | Halaman | Form Kategori |
| Form Kategori | `FormKategori` | `/admin/kategori/form` | Admin | Modal di atas Kategori Barang | Kategori Barang |
| Paket Penyewaan | `Paket` | `/admin/paket` | Admin | Halaman | Form Paket Penyewaan |
| Form Paket Penyewaan | `FormPaket` | `/admin/paket/form` | Admin | Halaman | Paket Penyewaan |
| Stok dan Ketersediaan | `Stok` | `/admin/stok` | Admin | Halaman | Dashboard Admin, Detail Unit, Stok Barang Jual |
| Stok Barang Jual | `StokJual` | `/admin/stok/jual` | Admin | Halaman | Stok dan Ketersediaan |
| Data Pelanggan | `Pelanggan` | `/admin/pelanggan` | Admin | Halaman | (sidebar) |
| Detail Pelanggan | `DetailPelanggan` | `/admin/pelanggan/[id]` | Admin | Halaman | Data Pelanggan |
| Pengembalian | `Pengembalian` | `/admin/pengembalian` | Admin | Halaman | Dashboard Admin, Form Pengembalian |
| Form Pengembalian | `FormKembali` | `/admin/pengembalian/[trx]` | Admin | Halaman | Dashboard Admin, Detail Transaksi, Form Biaya Tambahan, Pengembalian, Transaksi Penyewaan |
| Form Biaya Tambahan | `FormBiaya` | `/admin/pengembalian/[trx]/biaya` | Admin | Modal di atas Form Pengembalian | Form Pengembalian |
| Pengeluaran | `Pengeluaran` | `/admin/pengeluaran` | Admin | Halaman | Dashboard Admin, Admin · Kelola Kategori Pengeluaran, Form Pengeluaran |
| Form Pengeluaran | `FormPengeluaran` | `/admin/pengeluaran/form` | Admin | Halaman | Pengeluaran |
| Admin · Kelola Kategori Pengeluaran | `FormKategoriBiaya` | `/admin/pengeluaran/kategori` | Admin | Modal di atas Pengeluaran | Pengeluaran |
| Riwayat Aktivitas | `Riwayat` | `/admin/riwayat` | Admin | Halaman | Detail Riwayat Aktivitas |
| Detail Riwayat Aktivitas | `DetailRiwayat` | `/admin/riwayat/[id]` | Admin | Halaman | Riwayat Aktivitas |
| Profil Akun | `Profil` | `/admin/profil` | Admin | Halaman | (sidebar) |
| Dashboard Owner | `DashOwner` | `/owner/dashboard` | Owner | Halaman | Login |
| Monitoring Booking | `MonBooking` | `/owner/booking` | Owner | Halaman | Owner · Detail Booking |
| Owner · Detail Booking | `OwDetailBooking` | `/owner/booking/[id]` | Owner | Halaman | Monitoring Booking, Owner · Detail Riwayat Aktivitas |
| Monitoring Penyewaan | `MonSewa` | `/owner/transaksi/sewa` | Owner | Halaman | Monitoring Penjualan, Owner · Detail Transaksi |
| Owner · Detail Transaksi | `OwDetailTrx` | `/owner/transaksi/sewa/[id]` | Owner | Halaman | Monitoring Penyewaan, Owner · Detail Pelanggan |
| Monitoring Penjualan | `MonJual` | `/owner/transaksi/jual` | Owner | Halaman | Monitoring Penyewaan, Owner · Detail Penjualan |
| Owner · Detail Penjualan | `OwDetailJual` | `/owner/transaksi/jual/[id]` | Owner | Halaman | Monitoring Penjualan |
| Owner · Semua Barang | `OwBarang` | `/owner/barang` | Owner | Halaman | Owner · Form Barang |
| Owner · Detail Barang | `OwDetailBarang` | `/owner/barang/[kode]` | Owner | Halaman | Owner · Semua Barang |
| Owner · Detail Unit | `OwDetailUnit` | `/owner/barang/[kode]/unit/[unit]` | Owner | Halaman | Owner · Detail Barang, Owner · Stok dan Ketersediaan |
| Owner · Form Barang | `OwFormBarang` | `/owner/barang/form` | Owner | Halaman | Owner · Semua Barang, Owner · Detail Barang, Owner · Stok dan Ketersediaan, Owner · Stok Barang Jual |
| Owner · Kategori Barang | `OwKategori` | `/owner/kategori` | Owner | Halaman | Owner · Form Kategori |
| Owner · Form Kategori | `OwFormKategori` | `/owner/kategori/form` | Owner | Modal di atas Owner · Kategori Barang | Owner · Kategori Barang |
| Owner · Paket Penyewaan | `OwPaket` | `/owner/paket` | Owner | Halaman | Owner · Form Paket Penyewaan |
| Owner · Form Paket Penyewaan | `OwFormPaket` | `/owner/paket/form` | Owner | Halaman | Owner · Paket Penyewaan |
| Owner · Stok dan Ketersediaan | `OwStok` | `/owner/stok` | Owner | Halaman | Owner · Detail Unit, Owner · Stok Barang Jual |
| Owner · Stok Barang Jual | `OwStokJual` | `/owner/stok/jual` | Owner | Halaman | Owner · Stok dan Ketersediaan |
| Owner · Data Pelanggan | `OwPelanggan` | `/owner/pelanggan` | Owner | Halaman | (sidebar) |
| Owner · Detail Pelanggan | `OwDetailPelanggan` | `/owner/pelanggan/[id]` | Owner | Halaman | Laporan Pelanggan, Owner · Data Pelanggan |
| Owner · Pengeluaran | `OwPengeluaran` | `/owner/pengeluaran` | Owner | Halaman | Owner · Kelola Kategori Pengeluaran, Owner · Form Pengeluaran |
| Owner · Form Pengeluaran | `OwFormPengeluaran` | `/owner/pengeluaran/form` | Owner | Halaman | Owner · Pengeluaran |
| Owner · Kelola Kategori Pengeluaran | `OwFormKategoriBiaya` | `/owner/pengeluaran/kategori` | Owner | Modal di atas Owner · Pengeluaran | Owner · Pengeluaran |
| Laporan Keuangan | `LapKeuangan` | `/owner/laporan/keuangan` | Owner | Halaman | Dashboard Owner, Detail Laporan |
| Laporan Penyewaan | `LapSewa` | `/owner/laporan/penyewaan` | Owner | Halaman | (sidebar) |
| Laporan Penjualan | `LapJual` | `/owner/laporan/penjualan` | Owner | Halaman | (sidebar) |
| Laporan Stok | `LapStok` | `/owner/laporan/stok` | Owner | Halaman | (sidebar) |
| Laporan Pelanggan | `LapPelanggan` | `/owner/laporan/pelanggan` | Owner | Halaman | (sidebar) |
| Detail Laporan | `DetailLaporan` | `/owner/laporan/detail` | Owner | Halaman | Laporan Penjualan, Laporan Keuangan, Laporan Penyewaan, Laporan Stok |
| Owner · Riwayat Aktivitas | `OwRiwayat` | `/owner/riwayat` | Owner | Halaman | Dashboard Owner, Owner · Detail Riwayat Aktivitas |
| Owner · Detail Riwayat Aktivitas | `OwDetailRiwayat` | `/owner/riwayat/[id]` | Owner | Halaman | Owner · Riwayat Aktivitas |
| Daftar Pengguna | `Pengguna` | `/owner/pengguna` | Owner | Halaman | Form Pengguna |
| Form Pengguna | `FormPengguna` | `/owner/pengguna/form` | Owner | Halaman | Daftar Pengguna |
| Hak Akses | `HakAkses` | `/owner/hak-akses` | Owner | Halaman | Form Hak Akses |
| Form Hak Akses | `FormAkses` | `/owner/hak-akses/form` | Owner | Modal di atas Hak Akses | Hak Akses, Daftar Pengguna |
| Owner · Profil Akun | `OwProfil` | `/owner/profil` | Owner | Halaman | (sidebar) |

## 3. Alur Admin per layar

#### Dashboard Admin  `DashAdmin` → `/admin/dashboard`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Cek ketersediaan** | Stok dan Ketersediaan → `/admin/stok` |
| Header halaman / isi | **+ Booking baru** | Booking Baru → `/admin/booking/baru` |
| Kondisi stok unit | **Lihat stok** | Stok dan Ketersediaan → `/admin/stok` |
| Jadwal pengambilan hari ini | **Semua** | Transaksi Penyewaan → `/admin/transaksi/sewa` |
| Jadwal pengembalian hari ini | **Semua** | Pengembalian → `/admin/pengembalian` |
| Keterlambatan pengembalian | **Proses** (×2) | Form Pengembalian → `/admin/pengembalian/[trx]` |
| Perlu ditindaklanjuti | **Buka** (×2) | Booking → `/admin/booking` |
| Perlu ditindaklanjuti | **Buka** | Stok dan Ketersediaan → `/admin/stok` |
| Transaksi terbaru | **Semua** | Transaksi Penyewaan → `/admin/transaksi/sewa` |
| Pengeluaran terbaru | **Semua** | Pengeluaran → `/admin/pengeluaran` |

- **Contoh yang ditanyakan:** kartu *Kondisi stok unit* → tautan pojok kanan atas **Lihat stok** membuka **Stok dan Ketersediaan** (`/admin/stok`). Tombol **Cek ketersediaan** di header juga membuka `/admin/stok` (bukan halaman Cek Ketersediaan).
- Tidak ada tombol yang mengubah data di halaman ini; semua hanya navigasi. Kartu KPI dan donat tidak bisa diklik.

Dibuka dari: Login (“Masuk sebagai Admin”).

#### Booking  `Booking` → `/admin/booking`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Pelunasan (Transaksi Sewa)** | Transaksi Penyewaan → `/admin/transaksi/sewa` |
| Header halaman / isi | **+ Catat booking** | Booking Baru → `/admin/booking/baru` |
| Baris tabel | **BK-0243** (baris BK-0243) | Detail Booking → `/admin/booking/[id]` |
| Baris tabel | **Detail** (per baris, mis. BK-0243, BK-0244, BK-0238) | Detail Booking → `/admin/booking/[id]` |
| Baris tabel | **BK-0242** (baris BK-0242) | Detail Booking → `/admin/booking/[id]` |
| Baris tabel | **Proses sewa** (baris BK-0242) | Transaksi Penyewaan Langsung → `/admin/transaksi/sewa/baru` |
| Baris tabel | **BK-0245** (baris BK-0245) | Detail Booking → `/admin/booking/[id]` |
| Baris tabel | **Lanjutkan** (baris BK-0245) | Booking Baru → `/admin/booking/baru` |
| Baris tabel | **BK-0244** (baris BK-0244) | Detail Booking → `/admin/booking/[id]` |
| Baris tabel | **BK-0238** (baris BK-0238) | Detail Booking → `/admin/booking/[id]` |

- Tautan kode booking (BK-xxxx) dan tombol **Detail** sama-sama membuka Detail Booking.
- Aksi per baris bergantung pada status booking: **Proses sewa** untuk booking *Dikonfirmasi* yang jadwal pengambilannya hari ini (→ Sewa Baru), **Lanjutkan** untuk booking *Draft* (→ Booking Baru, melengkapi data), dan **Detail** untuk booking lain (Dikonfirmasi lain, Selesai).
- Tombol **Pelunasan (Transaksi Sewa)** di header membuka daftar Transaksi Penyewaan, karena pelunasan dikerjakan di sana.

Dibuka dari: Cek Ketersediaan (“Booking”); Dashboard Admin (“Buka”); Transaksi Penyewaan (“Dari booking”).

#### Booking Baru  `BookingBaru` → `/admin/booking/baru`

*Komponen di dalamnya: `Kasir` (§5).*

Tidak ada tautan keluar di isi halaman selain sidebar.

- Seluruh isi halaman adalah komponen **Kasir** mode `booking` (lihat §5.1). Setelah booking dibuat muncul struk dengan tombol **Booking baru** (reset form) dan **Kembali ke menu booking** (`/admin/booking`).

Dibuka dari: Booking (“+ Catat booking”); Cek Ketersediaan (“booking-href”); Dashboard Admin (“+ Booking baru”); Detail Booking (“Ubah data”).

#### Cek Ketersediaan  `CekKetersediaan` → `/admin/booking/cek-ketersediaan`

*Komponen di dalamnya: `CekSedia` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Booking** | Booking → `/admin/booking` |
| Header halaman / isi | **← Kembali ke Booking** | Booking → `/admin/booking` |
| Komponen `CekSedia` | Aksi lanjut "Sewa" | Transaksi Penyewaan Langsung → `/admin/transaksi/sewa/baru` |
| Komponen `CekSedia` | Aksi lanjut "Booking" | Booking Baru → `/admin/booking/baru` |

- Isi utama adalah komponen **CekSedia** dengan dua tujuan lanjutan: `sewa-href` → Sewa Baru dan `booking-href` → Booking Baru.
- **Catatan penting:** file komponen `CekSedia.dc.html` **tidak ada** di desain yang dipublikasikan (hanya pemanggilnya), jadi isi dan perilaku pencarian ketersediaannya belum terdefinisi di Figma. Perilaku yang tertulis di subjudul halaman: periksa stok pada tanggal sewa, lalu lanjut ke transaksi penyewaan dan pelunasan.

Dibuka dari: sidebar.

#### Detail Booking  `DetailBooking` → `/admin/booking/[id]`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Ubah data** | Booking Baru → `/admin/booking/baru` |
| Header halaman / isi | **Lanjutkan ke transaksi sewa** | Transaksi Penyewaan Langsung → `/admin/transaksi/sewa/baru` |

- **Ubah data** membuka Booking Baru (form yang sama dengan data terisi). **Lanjutkan ke transaksi sewa** membuka Sewa Baru dengan data booking terisi.

Dibuka dari: Booking (“BK-0243”); Detail Riwayat Aktivitas (“BK-0239”).

#### Transaksi Penyewaan  `TrxSewa` → `/admin/transaksi/sewa`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Dari booking** | Booking → `/admin/booking` |
| Header halaman / isi | **+ Transaksi langsung** | Transaksi Penyewaan Langsung → `/admin/transaksi/sewa/baru` |
| Baris tabel | **TS-0413** (baris TS-0413) | Detail Transaksi → `/admin/transaksi/sewa/[id]` |
| Baris tabel | **Pelunasan & serahkan** (per baris, mis. TS-0413, TS-0414) | Detail Transaksi → `/admin/transaksi/sewa/[id]` |
| Baris tabel | **TS-0414** (baris TS-0414) | Detail Transaksi → `/admin/transaksi/sewa/[id]` |
| Baris tabel | **TS-0412** (baris TS-0412) | Detail Transaksi → `/admin/transaksi/sewa/[id]` |
| Baris tabel | **Detail** (per baris, mis. TS-0412, TS-0411, TS-0390) | Detail Transaksi → `/admin/transaksi/sewa/[id]` |
| Baris tabel | **TS-0411** (baris TS-0411) | Detail Transaksi → `/admin/transaksi/sewa/[id]` |
| Baris tabel | **TS-0398** (baris TS-0398) | Detail Transaksi → `/admin/transaksi/sewa/[id]` |
| Baris tabel | **Kembalikan** (baris TS-0398) | Form Pengembalian → `/admin/pengembalian/[trx]` |
| Baris tabel | **TS-0390** (baris TS-0390) | Detail Transaksi → `/admin/transaksi/sewa/[id]` |

- Aksi per baris bergantung pada status transaksi: **Pelunasan & serahkan** untuk transaksi *Belum diambil* (→ Detail Transaksi, tempat pelunasan dicatat), **Kembalikan** hanya untuk transaksi *Terlambat* (→ Form Pengembalian), dan **Detail** untuk transaksi *Menunggu pengembalian*, *Sedang disewa*, dan *Selesai*.
- **Dari booking** membuka daftar Booking untuk memilih booking yang akan diproses; **+ Transaksi langsung** membuka Sewa Baru tanpa booking.

Dibuka dari: Booking (“Pelunasan (Transaksi Sewa)”); Dashboard Admin (“Semua”); Pelunasan Berhasil (“back-href”); Transaksi Penyewaan Langsung (“back-href”).

#### Transaksi Penyewaan Langsung  `SewaBaru` → `/admin/transaksi/sewa/baru`

*Komponen di dalamnya: `Kasir` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Komponen `Kasir` | Tombol kembali/Batal | Transaksi Penyewaan → `/admin/transaksi/sewa` |

- Isi halaman adalah komponen **Kasir** mode `sewa` (lihat §5.1). Tombol kembali: **Kembali ke menu transaksi penyewaan** → `/admin/transaksi/sewa`.

Dibuka dari: Booking (“Proses sewa”); Cek Ketersediaan (“sewa-href”); Detail Booking (“Lanjutkan ke transaksi sewa”); Transaksi Penyewaan (“+ Transaksi langsung”).

#### Detail Transaksi  `DetailTrx` → `/admin/transaksi/sewa/[id]`

*Komponen di dalamnya: `StrukModal` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Catat pembayaran** | Form Pembayaran → `/admin/transaksi/sewa/[id]/bayar` |
| Header halaman / isi | **Catat pengembalian** | Form Pengembalian → `/admin/pengembalian/[trx]` |

- **Catat pembayaran** membuka modal Form Bayar di atas halaman ini. **Catat pengembalian** membuka Form Pengembalian.
- Tombol **Cetak bukti** (komponen StrukModal) membuka popup pengaturan struk, bukan halaman baru (lihat §5.3).

Dibuka dari: Detail Pelanggan (“TS-0413”); Form Pembayaran (“Tutup”); Pelunasan Berhasil (“detail-href”); Pengembalian (“Detail”); Transaksi Penyewaan (“TS-0413”).

#### Form Pembayaran  `FormBayar` → `/admin/transaksi/sewa/[id]/bayar`

*Modal di atas **Detail Transaksi** (`/admin/transaksi/sewa/[id]`).*  

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Tutup** | Detail Transaksi → `/admin/transaksi/sewa/[id]` |
| Header halaman / isi | **Batal** | Detail Transaksi → `/admin/transaksi/sewa/[id]` |
| Header halaman / isi | **Simpan pembayaran** | Pelunasan Berhasil → `/admin/transaksi/sewa/[id]/lunas` |

- Tampil sebagai **modal di atas Detail Transaksi**. **Simpan pembayaran** → Pelunasan Berhasil. **Tutup** atau **Batal** menutup modal dan kembali ke Detail Transaksi.

Dibuka dari: Detail Transaksi (“Catat pembayaran”); Form Pengembalian (“Catat bayar biaya tambahan”); Transaksi Penjualan (“Catat bayar”).

#### Pelunasan Berhasil  `PelunasanBerhasil` → `/admin/transaksi/sewa/[id]/lunas`

*Komponen di dalamnya: `PelunasanIsi` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Komponen `PelunasanIsi` | Tombol kembali/Batal | Transaksi Penyewaan → `/admin/transaksi/sewa` |
| Komponen `PelunasanIsi` | Tombol buka detail | Detail Transaksi → `/admin/transaksi/sewa/[id]` |

- Layar konfirmasi setelah pelunasan: tombol **Cetak bukti** (popup), kembali ke daftar Transaksi Penyewaan (`back-href`), atau buka Detail Transaksi (`detail-href`).

Dibuka dari: Form Pembayaran (“Simpan pembayaran”).

#### Transaksi Penjualan  `TrxJual` → `/admin/transaksi/jual`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **+ Transaksi penjualan** | Transaksi Penjualan → `/admin/transaksi/jual/baru` |
| Baris tabel | **TJ-0127** (baris TJ-0127) | Detail Penjualan → `/admin/transaksi/jual/[id]` |
| Baris tabel | **Detail** (per baris, mis. TJ-0127, TJ-0126, TJ-0124) | Detail Penjualan → `/admin/transaksi/jual/[id]` |
| Baris tabel | **TJ-0126** (baris TJ-0126) | Detail Penjualan → `/admin/transaksi/jual/[id]` |
| Baris tabel | **TJ-0125** (baris TJ-0125) | Detail Penjualan → `/admin/transaksi/jual/[id]` |
| Baris tabel | **Catat bayar** (baris TJ-0125) | Form Pembayaran → `/admin/transaksi/sewa/[id]/bayar` |
| Baris tabel | **TJ-0124** (baris TJ-0124) | Detail Penjualan → `/admin/transaksi/jual/[id]` |

- **Catat bayar** hanya muncul pada penjualan yang belum lunas dan membuka modal Form Bayar.

Dibuka dari: Detail Penjualan (“back-href”).

#### Transaksi Penjualan  `JualBaru` → `/admin/transaksi/jual/baru`

*Komponen di dalamnya: `Kasir` (§5).*

Tidak ada tautan keluar di isi halaman selain sidebar.

- Isi halaman adalah komponen **Kasir** mode `jual` (§5.1). Tidak ada tombol "kembali" khusus (`hasBack` hanya untuk mode booking dan sewa); pengguna kembali lewat sidebar.

Dibuka dari: Transaksi Penjualan (“+ Transaksi penjualan”).

#### Detail Penjualan  `DetailJual` → `/admin/transaksi/jual/[id]`

*Komponen di dalamnya: `DetailJualIsi` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Komponen `DetailJualIsi` | Tombol kembali/Batal | Transaksi Penjualan → `/admin/transaksi/jual` |

- Isi halaman komponen **DetailJualIsi**; tombol kembali → `/admin/transaksi/jual`. Tombol **Cetak bukti** membuka popup StrukModal.

Dibuka dari: Transaksi Penjualan (“TJ-0127”).

#### Semua Barang  `Barang` → `/admin/barang`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **+ Tambah barang** | Form Barang → `/admin/barang/form` |
| Baris tabel | **Detail** (per baris, mis. JKT, SPT, CRR, GAS) | Detail Barang → `/admin/barang/[kode]` |
| Baris tabel | **Ubah** (per baris, mis. JKT, SPT, CRR, GAS) | Form Barang → `/admin/barang/form` |

- **Detail** → Detail Barang. **Ubah** dan **+ Tambah barang** → Form Barang. Form Barang Jual dibuka dengan pilihan jenis *Barang Jual* di dalam form (toggle Barang Sewa / Barang Jual).

Dibuka dari: Form Barang (“back-href”); Form Barang Jual (“back-href”).

#### Detail Barang  `DetailBarang` → `/admin/barang/[kode]`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Ubah** | Form Barang → `/admin/barang/form` |
| Header halaman / isi | **+ Tambah unit** | Modal Tambah Unit (tambah unit langsung ke variasi pilihan) |
| Baris tabel | **Detail Unit** (baris {{r.merek}}) | Detail Unit → `/admin/barang/[kode]/unit/[unit]` |

- Menampilkan kartu *Informasi produk* yang bersih (tombol "Ganti foto" dihilangkan; penggantian foto dipusatkan di formulir Ubah), informasi agregat "Rentang Unit Terdaftar" produk, 4 kartu KPI stok (Variasi, Total unit, Tersedia, Tidak siap), tabel *Variasi & ringkasan stok* dengan tombol **Detail Unit**, serta tabel riwayat pergerakan stok. Tombol **+ Tambah unit** membuka modal cepat untuk menambah stok unit fisik langsung ke variasi tanpa harus berpindah ke formulir panjang.

Dibuka dari: Semua Barang (“Detail”).

#### Detail Unit  `DetailUnit` → `/admin/barang/[kode]/unit/[unit]`

*Komponen di dalamnya: `UnitList` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **← Kembali ke Detail Produk** | Detail Barang → `/admin/barang/[kode]` |
| Header halaman / isi | **← Ringkasan per Variasi** | Detail Barang → `/admin/barang/[kode]` |
| Header halaman / isi | **← Kembali ke Stok dan Ketersediaan** | Stok dan Ketersediaan → `/admin/stok` |
| Header halaman / isi | **+ Tambah unit** | Modal Tambah Unit (otomatis generate kode unit fisik berurutan) |
| Baris tabel unit | **Detail** (per unit, mis. JKT009) | Modal Detail Unit (informasi & alokasi unit) |
| Baris tabel unit | **Ubah kondisi** (per unit, mis. JKT012) | Modal Ubah Kondisi Unit (tersimpan ke riwayat variasi) |

- Isi halaman adalah profil spesifikasi variasi lengkap, 7 KPI kondisi fisik (Total unit, Tersedia, Disewa, Dicuci, Persiapan, Rusak, Perawatan), filter pills kondisi, kotak pencarian kode unit fisik, tabel unit fisik lengkap, dan tabel Riwayat Variasi.

Dibuka dari: Detail Barang (“Detail Unit”); Stok dan Ketersediaan (“Detail Unit”).

#### Form Barang  `FormBarang` → `/admin/barang/form`

*Komponen di dalamnya: `FormBarangIsi` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Komponen `FormBarangIsi` | Tombol kembali/Batal | Semua Barang → `/admin/barang` |

- Isi halaman komponen **FormBarangIsi** (§5.6). **Batal** dan setelah simpan **kembali ke daftar** → `/admin/barang`.

Dibuka dari: Semua Barang (“+ Tambah barang”); Detail Barang (“Ubah”); Stok dan Ketersediaan (“+ Tambah stok”).

#### Form Barang Jual  `FormBarangJual` → `/admin/barang/form-jual`

*Komponen di dalamnya: `FormBarangIsi` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Komponen `FormBarangIsi` | Tombol kembali/Batal | Semua Barang → `/admin/barang` |

- Sama dengan Form Barang tetapi dibuka langsung pada tab *Barang Jual* (`start-jenis="jual"`).

Dibuka dari: Stok Barang Jual (“+ Tambah barang jual”).

#### Kategori Barang  `Kategori` → `/admin/kategori`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **+ Tambah kategori** | Form Kategori → `/admin/kategori/form` |
| Baris tabel | **Ubah** (per baris, mis. Tenda, Tas, Tidur, Alat, Penerangan) | Form Kategori → `/admin/kategori/form` |

- **Ubah** dan **+ Tambah kategori** membuka modal Form Kategori di atas halaman ini.

Dibuka dari: Form Kategori (“Tutup”).

#### Form Kategori  `FormKategori` → `/admin/kategori/form`

*Modal di atas **Kategori Barang** (`/admin/kategori`).*  

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Tutup** | Kategori Barang → `/admin/kategori` |
| Header halaman / isi | **Batal** | Kategori Barang → `/admin/kategori` |
| Header halaman / isi | **Simpan kategori** | Kategori Barang → `/admin/kategori` |

- Modal di atas Kategori Barang. **Simpan kategori**, **Batal**, dan **Tutup** semuanya kembali ke daftar Kategori.

Dibuka dari: Kategori Barang (“+ Tambah kategori”).

#### Paket Penyewaan  `Paket` → `/admin/paket`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **+ Tambah paket** | Form Paket Penyewaan → `/admin/paket/form` |
| Header halaman / isi | **Detail / ubah** (×3) | Form Paket Penyewaan → `/admin/paket/form` |

- **Detail / ubah** dan **+ Tambah paket** membuka Form Paket (halaman penuh).

Dibuka dari: Form Paket Penyewaan (“Batal”).

#### Form Paket Penyewaan  `FormPaket` → `/admin/paket/form`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Barang penyusun | **Batal** | Paket Penyewaan → `/admin/paket` |
| Barang penyusun | **Simpan paket** | Paket Penyewaan → `/admin/paket` |

Dibuka dari: Paket Penyewaan (“+ Tambah paket”).

#### Stok dan Ketersediaan  `Stok` → `/admin/stok`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **+ Tambah stok** | Form Barang → `/admin/barang/form` |
| Header halaman / isi | **Barang Jual** | Stok Barang Jual → `/admin/stok/jual` |
| Baris tabel | **Detail Unit** (per baris, mis. Jaket, Tenda, Carrier …) | Detail Unit → `/admin/barang/[kode]/unit/[unit]` |
| Baris tabel | **Riwayat** (per baris, mis. SPT001, SPT002) | Detail Unit → `/admin/barang/[kode]/unit/[unit]` |
| Baris tabel | **Tandai siap** (baris SPT003) | Detail Unit → `/admin/barang/[kode]/unit/[unit]` |
| Baris tabel | **Ubah kondisi** (baris JKT012) | Detail Unit → `/admin/barang/[kode]/unit/[unit]` |

- Tab **Barang Jual** membuka Stok Barang Jual (`/admin/stok/jual`). **+ Tambah stok** membuka Form Barang. Semua tombol pada tabel unit (**Riwayat**, **Tandai siap**, **Ubah kondisi**) membuka Detail Unit (di desain statis, tombolnya hanya berbeda label sesuai kondisi unit).

Dibuka dari: Dashboard Admin (“Cek ketersediaan”); Detail Unit (“Stok dan Ketersediaan”); Stok Barang Jual (“Barang Sewa”).

#### Stok Barang Jual  `StokJual` → `/admin/stok/jual`

*Komponen di dalamnya: `StokJualList` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **+ Tambah barang jual** | Form Barang Jual → `/admin/barang/form-jual` |
| Header halaman / isi | **Barang Sewa** | Stok dan Ketersediaan → `/admin/stok` |
| Header halaman / isi | **Barang Jual** | Stok Barang Jual → `/admin/stok/jual` |

- Isi halaman komponen **StokJualList** (§5.5): pencarian, filter status stok, dan dialog **Penyesuaian stok**.

Dibuka dari: Stok dan Ketersediaan (“Barang Jual”).

#### Data Pelanggan  `Pelanggan` → `/admin/pelanggan`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Baris tabel | **Detail** (per baris, mis. PLG-0001, PLG-0002, PLG-0003, PLG-0004) | Detail Pelanggan → `/admin/pelanggan/[id]` |

- Tombol **Detail** per baris → Detail Pelanggan.

Dibuka dari: sidebar.

#### Detail Pelanggan  `DetailPelanggan` → `/admin/pelanggan/[id]`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Baris tabel | **TS-0413** (baris TS-0413) | Detail Transaksi → `/admin/transaksi/sewa/[id]` |
| Baris tabel | **TJ-0119** (baris TJ-0119) | Detail Transaksi → `/admin/transaksi/sewa/[id]` |
| Baris tabel | **TS-0377** (baris TS-0377) | Detail Transaksi → `/admin/transaksi/sewa/[id]` |

- Daftar transaksi pelanggan; kode transaksi → Detail Transaksi.

Dibuka dari: Data Pelanggan (“Detail”).

#### Pengembalian  `Pengembalian` → `/admin/pengembalian`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Baris tabel | **Catat pengembalian** (per baris, mis. TS-0398, TS-0412) | Form Pengembalian → `/admin/pengembalian/[trx]` |
| Baris tabel | **Lanjutkan** (baris TS-0409) | Form Pengembalian → `/admin/pengembalian/[trx]` |
| Baris tabel | **Detail** (baris TS-0405) | Detail Transaksi → `/admin/transaksi/sewa/[id]` |

- Aksi per baris sesuai status: **Catat pengembalian** (belum kembali/terlambat), **Lanjutkan** (pengembalian sebagian), **Detail** (sudah dikembalikan).

Dibuka dari: Dashboard Admin (“Semua”); Form Pengembalian (“Simpan pengembalian”).

#### Form Pengembalian  `FormKembali` → `/admin/pengembalian/[trx]`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Biaya tambahan | **+ Tambah biaya** | Form Biaya Tambahan → `/admin/pengembalian/[trx]/biaya` |
| Ringkasan | **Simpan pengembalian** | Pengembalian → `/admin/pengembalian` |
| Ringkasan | **Catat bayar biaya tambahan** | Form Pembayaran → `/admin/transaksi/sewa/[id]/bayar` |

- **+ Tambah biaya** membuka modal Form Biaya di atas halaman ini. Biaya yang sudah ditambahkan punya tombol **Hapus** (menghapus baris biaya tanpa pindah halaman). **Simpan pengembalian** → daftar Pengembalian. **Catat bayar biaya tambahan** → modal Form Bayar (di desain modal ini berinduk pada Detail Transaksi).

Dibuka dari: Dashboard Admin (“Proses”); Detail Transaksi (“Catat pengembalian”); Form Biaya Tambahan (“Tutup”); Pengembalian (“Catat pengembalian”); Transaksi Penyewaan (“Kembalikan”).

#### Form Biaya Tambahan  `FormBiaya` → `/admin/pengembalian/[trx]/biaya`

*Modal di atas **Form Pengembalian** (`/admin/pengembalian/[trx]`).*  

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Tutup** | Form Pengembalian → `/admin/pengembalian/[trx]` |
| Header halaman / isi | **Batal** | Form Pengembalian → `/admin/pengembalian/[trx]` |
| Header halaman / isi | **Simpan biaya** | Form Pengembalian → `/admin/pengembalian/[trx]` |

- Modal di atas Form Pengembalian. **Simpan biaya**, **Batal**, dan **Tutup** kembali ke Form Pengembalian; biaya muncul pada daftar *Biaya tambahan*.

Dibuka dari: Form Pengembalian (“+ Tambah biaya”).

#### Pengeluaran  `Pengeluaran` → `/admin/pengeluaran`

*Komponen di dalamnya: `PengeluaranList` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Kelola kategori** | Admin · Kelola Kategori Pengeluaran → `/admin/pengeluaran/kategori` |
| Header halaman / isi | **+ Catat pengeluaran** | Form Pengeluaran → `/admin/pengeluaran/form` |
| Komponen `PengeluaranList` | Tombol tambah/ubah | Form Pengeluaran → `/admin/pengeluaran/form` |

- Isi halaman komponen **PengeluaranList** (§5.7). **Tambah** → Form Pengeluaran (`form-href`). **Kelola kategori** membuka modal Form Kategori Biaya.

Dibuka dari: Dashboard Admin (“Semua”); Admin · Kelola Kategori Pengeluaran (“Tutup”); Form Pengeluaran (“back-href”).

#### Form Pengeluaran  `FormPengeluaran` → `/admin/pengeluaran/form`

*Komponen di dalamnya: `FormPengeluaranIsi` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Komponen `FormPengeluaranIsi` | Tombol kembali/Batal | Pengeluaran → `/admin/pengeluaran` |

- Isi halaman komponen **FormPengeluaranIsi** (§5.8). Batal, simpan, dan hapus kembali ke daftar Pengeluaran.

Dibuka dari: Pengeluaran (“+ Catat pengeluaran”).

#### Admin · Kelola Kategori Pengeluaran  `FormKategoriBiaya` → `/admin/pengeluaran/kategori`

*Modal di atas **Pengeluaran** (`/admin/pengeluaran`).*  
*Komponen di dalamnya: `KategoriBiayaIsi` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Tutup** | Pengeluaran → `/admin/pengeluaran` |
| Komponen `KategoriBiayaIsi` | Tombol kembali/Batal | Pengeluaran → `/admin/pengeluaran` |

- Modal di atas daftar Pengeluaran berisi komponen **KategoriBiayaIsi** (§5.9). **Tutup** dan **Selesai** → Pengeluaran.

Dibuka dari: Pengeluaran (“Kelola kategori”).

#### Riwayat Aktivitas  `Riwayat` → `/admin/riwayat`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Baris tabel | **Detail** (per baris, mis. 2, 1) | Detail Riwayat Aktivitas → `/admin/riwayat/[id]` |

- **Detail** per baris → Detail Riwayat.

Dibuka dari: Detail Riwayat Aktivitas (“Kembali”).

#### Detail Riwayat Aktivitas  `DetailRiwayat` → `/admin/riwayat/[id]`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Kembali** | Riwayat Aktivitas → `/admin/riwayat` |
| Informasi aktivitas | **BK-0239** | Detail Booking → `/admin/booking/[id]` |

- Tautan ke Detail Booking atau Riwayat Aktivitas.

Dibuka dari: Riwayat Aktivitas (“Detail”).

#### Profil Akun  `Profil` → `/admin/profil`


Tidak ada tautan keluar di isi halaman selain sidebar.

- Tidak ada tautan keluar selain sidebar. **Keluar** ada di kartu pengguna sidebar.

Dibuka dari: sidebar.

## 4. Alur Owner per layar

#### Dashboard Owner  `DashOwner` → `/owner/dashboard`

*Komponen di dalamnya: `OwnerRekap` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Lihat laporan** | Laporan Keuangan → `/owner/laporan/keuangan` |
| Aktivitas pengguna terbaru | **Semua** | Owner · Riwayat Aktivitas → `/owner/riwayat` |

- Rekap interaktif (§5.10) tidak berpindah halaman. **Lihat laporan** → Laporan Keuangan; **Semua** pada Aktivitas pengguna → Riwayat Aktivitas.

Dibuka dari: Login (“Masuk sebagai Owner”).

#### Monitoring Booking  `MonBooking` → `/owner/booking`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Baris tabel | **Lihat** (per baris, mis. BK-0245, BK-0244, BK-0243, BK-0239) | Owner · Detail Booking → `/owner/booking/[id]` |

- Halaman hanya lihat; tombol **Lihat** pada setiap baris membuka Detail Booking Owner. Tidak ada tombol input atau ubah.

Dibuka dari: Owner · Detail Booking (“Kembali ke monitoring”).

#### Owner · Detail Booking  `OwDetailBooking` → `/owner/booking/[id]`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Kembali ke monitoring** | Monitoring Booking → `/owner/booking` |

Dibuka dari: Monitoring Booking (“Lihat”); Owner · Detail Riwayat Aktivitas (“BK-0239”).

#### Monitoring Penyewaan  `MonSewa` → `/owner/transaksi/sewa`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Penyewaan** | Monitoring Penyewaan → `/owner/transaksi/sewa` |
| Header halaman / isi | **Penjualan** | Monitoring Penjualan → `/owner/transaksi/jual` |
| Baris tabel | **TS-0398** (baris TS-0398) | Owner · Detail Transaksi → `/owner/transaksi/sewa/[id]` |
| Baris tabel | **TS-0412** (baris TS-0412) | Owner · Detail Transaksi → `/owner/transaksi/sewa/[id]` |
| Baris tabel | **TS-0409** (baris TS-0409) | Owner · Detail Transaksi → `/owner/transaksi/sewa/[id]` |
| Baris tabel | **TS-0390** (baris TS-0390) | Owner · Detail Transaksi → `/owner/transaksi/sewa/[id]` |

- Tab **Penyewaan / Penjualan** berpindah antara dua layar monitoring. Baris membuka Detail Transaksi (hanya lihat).

Dibuka dari: Monitoring Penjualan (“Penyewaan”); Owner · Detail Transaksi (“Kembali ke monitoring”).

#### Owner · Detail Transaksi  `OwDetailTrx` → `/owner/transaksi/sewa/[id]`

*Komponen di dalamnya: `StrukModal` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Kembali ke monitoring** | Monitoring Penyewaan → `/owner/transaksi/sewa` |

Dibuka dari: Monitoring Penyewaan (“TS-0398”); Owner · Detail Pelanggan (“TS-0413”).

#### Monitoring Penjualan  `MonJual` → `/owner/transaksi/jual`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Penyewaan** | Monitoring Penyewaan → `/owner/transaksi/sewa` |
| Header halaman / isi | **Penjualan** | Monitoring Penjualan → `/owner/transaksi/jual` |
| Baris tabel | **TJ-0127** (baris TJ-0127) | Owner · Detail Penjualan → `/owner/transaksi/jual/[id]` |
| Baris tabel | **TJ-0126** (baris TJ-0126) | Owner · Detail Penjualan → `/owner/transaksi/jual/[id]` |
| Baris tabel | **TJ-0125** (baris TJ-0125) | Owner · Detail Penjualan → `/owner/transaksi/jual/[id]` |

- Tab **Penyewaan / Penjualan** berpindah antara dua layar monitoring. Baris membuka Detail Penjualan (hanya lihat).

Dibuka dari: Monitoring Penyewaan (“Penjualan”); Owner · Detail Penjualan (“back-href”).

#### Owner · Detail Penjualan  `OwDetailJual` → `/owner/transaksi/jual/[id]`

*Komponen di dalamnya: `DetailJualIsi` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Komponen `DetailJualIsi` | Tombol kembali/Batal | Monitoring Penjualan → `/owner/transaksi/jual` |

Dibuka dari: Monitoring Penjualan (“TJ-0127”).

#### Owner · Semua Barang  `OwBarang` → `/owner/barang`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **+ Tambah barang** | Owner · Form Barang → `/owner/barang/form` |
| Baris tabel | **Detail** (per baris, mis. JKT, SPT, CRR, GAS) | Owner · Detail Barang → `/owner/barang/[kode]` |
| Baris tabel | **Ubah** (per baris, mis. JKT, SPT, CRR, GAS) | Owner · Form Barang → `/owner/barang/form` |
| Baris tabel | **Hapus** (per baris, mis. JKT, SPT, CRR, GAS) | Owner · Semua Barang → `/owner/barang` |
| Header halaman / isi | **Sebelumnya** | Owner · Semua Barang → `/owner/barang` |
| Header halaman / isi | **Berikutnya** | Owner · Semua Barang → `/owner/barang` |

- Berbeda dari Admin, baris Owner punya tombol **Hapus** (tetap di daftar ini, tidak membuka layar baru); Admin hanya punya **Detail** dan **Ubah**. **Sebelumnya/Berikutnya** adalah paginasi daftar.

Dibuka dari: Owner · Form Barang (“back-href”).

#### Owner · Detail Barang  `OwDetailBarang` → `/owner/barang/[kode]`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Ubah** | Owner · Form Barang → `/owner/barang/form` |
| Header halaman / isi | **+ Tambah unit** | Modal Tambah Unit (tambah unit langsung ke variasi pilihan) |
| Baris tabel | **Detail Unit** (per baris, mis. Rimba, Kelana) | Owner · Detail Unit → `/owner/barang/[kode]/unit/[unit]` |

- Menampilkan kartu *Informasi produk* tanpa tombol ganti foto (penggantian foto dipusatkan di formulir Ubah), informasi "Rentang Unit Terdaftar", 4 kartu KPI stok, tabel *Variasi & ringkasan stok* dengan tombol **Detail Unit**, serta tabel riwayat mutasi stok. Tombol **+ Tambah unit** membuka modal cepat untuk menambah stok unit fisik langsung ke variasi tanpa harus berpindah ke formulir panjang.

Dibuka dari: Owner · Semua Barang (“Detail”).

#### Owner · Detail Unit  `OwDetailUnit` → `/owner/barang/[kode]/unit/[unit]`

*Komponen di dalamnya: `UnitList` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **← Kembali ke Detail Produk** | Owner · Detail Barang → `/owner/barang/[kode]` |
| Header halaman / isi | **← Ringkasan per Variasi** | Owner · Detail Barang → `/owner/barang/[kode]` |
| Header halaman / isi | **← Kembali ke Stok dan Ketersediaan** | Owner · Stok dan Ketersediaan → `/owner/stok` |
| Header halaman / isi | **+ Tambah unit** | Modal Tambah Unit (otomatis generate kode unit fisik berurutan) |
| Baris tabel unit | **Detail** (per unit, mis. JKT009) | Modal Detail Unit (informasi & alokasi unit) |
| Baris tabel unit | **Ubah kondisi** (per unit, mis. JKT012) | Modal Ubah Kondisi Unit (tersimpan ke riwayat variasi) |

- Isi halaman adalah profil spesifikasi variasi lengkap, 7 KPI kondisi fisik, filter pills kondisi, kotak pencarian kode unit fisik, tabel unit fisik lengkap, dan tabel Riwayat Variasi.

Dibuka dari: Owner · Detail Barang (“Detail Unit”); Owner · Stok dan Ketersediaan (“Detail Unit”).

#### Owner · Form Barang  `OwFormBarang` → `/owner/barang/form`

*Komponen di dalamnya: `FormBarangIsi` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Komponen `FormBarangIsi` | Tombol kembali/Batal | Owner · Semua Barang → `/owner/barang` |

Dibuka dari: Owner · Semua Barang (“+ Tambah barang”); Owner · Detail Barang (“Ubah”); Owner · Stok dan Ketersediaan (“+ Tambah stok”); Owner · Stok Barang Jual (“+ Tambah barang jual”).

#### Owner · Kategori Barang  `OwKategori` → `/owner/kategori`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **+ Tambah kategori** | Owner · Form Kategori → `/owner/kategori/form` |
| Baris tabel | **Ubah** (per baris, mis. Tenda, Tas, Tidur, Alat, Penerangan) | Owner · Form Kategori → `/owner/kategori/form` |
| Baris tabel | **Hapus** (per baris, mis. Tenda, Tas, Tidur, Alat, Penerangan) | Owner · Kategori Barang → `/owner/kategori` |

Dibuka dari: Owner · Form Kategori (“Tutup”).

#### Owner · Form Kategori  `OwFormKategori` → `/owner/kategori/form`

*Modal di atas **Owner · Kategori Barang** (`/owner/kategori`).*  

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Tutup** | Owner · Kategori Barang → `/owner/kategori` |
| Header halaman / isi | **Batal** | Owner · Kategori Barang → `/owner/kategori` |
| Header halaman / isi | **Simpan kategori** | Owner · Kategori Barang → `/owner/kategori` |

Dibuka dari: Owner · Kategori Barang (“+ Tambah kategori”).

#### Owner · Paket Penyewaan  `OwPaket` → `/owner/paket`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **+ Tambah paket** | Owner · Form Paket Penyewaan → `/owner/paket/form` |
| Header halaman / isi | **Detail / ubah** (×3) | Owner · Form Paket Penyewaan → `/owner/paket/form` |
| Header halaman / isi | **Nonaktifkan** (×2) | Owner · Paket Penyewaan → `/owner/paket` |
| Header halaman / isi | **Aktifkan** | Owner · Paket Penyewaan → `/owner/paket` |

Dibuka dari: Owner · Form Paket Penyewaan (“Batal”).

#### Owner · Form Paket Penyewaan  `OwFormPaket` → `/owner/paket/form`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Barang penyusun | **+ Tambah barang sewa** | Owner · Form Paket Penyewaan → `/owner/paket/form` |
| Baris tabel | **Hapus** (per baris, mis. Tenda, Carrier, Sleeping) | Owner · Form Paket Penyewaan → `/owner/paket/form` |
| Barang penyusun | **Batal** | Owner · Paket Penyewaan → `/owner/paket` |
| Barang penyusun | **Simpan paket** | Owner · Paket Penyewaan → `/owner/paket` |

Dibuka dari: Owner · Paket Penyewaan (“+ Tambah paket”).

#### Owner · Stok dan Ketersediaan  `OwStok` → `/owner/stok`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Penyesuaian stok** | Owner · Stok dan Ketersediaan → `/owner/stok` |
| Header halaman / isi | **+ Tambah stok** | Owner · Form Barang → `/owner/barang/form` |
| Header halaman / isi | **Barang Sewa** | Owner · Stok dan Ketersediaan → `/owner/stok` |
| Header halaman / isi | **Barang Jual** | Owner · Stok Barang Jual → `/owner/stok/jual` |
| Baris tabel | **Detail Unit** (per baris, mis. Jaket, Tenda, Carrier …) | Owner · Detail Unit → `/owner/barang/[kode]/unit/[unit]` |
| Baris tabel | **Riwayat** (per baris, mis. SPT001, SPT002) | Owner · Detail Unit → `/owner/barang/[kode]/unit/[unit]` |
| Baris tabel | **Tandai siap** (baris SPT003) | Owner · Detail Unit → `/owner/barang/[kode]/unit/[unit]` |
| Baris tabel | **Ubah kondisi** (baris JKT012) | Owner · Detail Unit → `/owner/barang/[kode]/unit/[unit]` |

Dibuka dari: Owner · Detail Unit (“Stok dan Ketersediaan”); Owner · Stok Barang Jual (“Barang Sewa”).

#### Owner · Stok Barang Jual  `OwStokJual` → `/owner/stok/jual`

*Komponen di dalamnya: `StokJualList` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **+ Tambah barang jual** | Owner · Form Barang → `/owner/barang/form` |
| Header halaman / isi | **Barang Sewa** | Owner · Stok dan Ketersediaan → `/owner/stok` |
| Header halaman / isi | **Barang Jual** | Owner · Stok Barang Jual → `/owner/stok/jual` |

Dibuka dari: Owner · Stok dan Ketersediaan (“Barang Jual”).

#### Owner · Data Pelanggan  `OwPelanggan` → `/owner/pelanggan`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Baris tabel | **Detail** (per baris, mis. PLG-0001, PLG-0002, PLG-0003, PLG-0004) | Owner · Detail Pelanggan → `/owner/pelanggan/[id]` |
| Header halaman / isi | **Sebelumnya** | Owner · Data Pelanggan → `/owner/pelanggan` |
| Header halaman / isi | **Berikutnya** | Owner · Data Pelanggan → `/owner/pelanggan` |

Dibuka dari: sidebar.

#### Owner · Detail Pelanggan  `OwDetailPelanggan` → `/owner/pelanggan/[id]`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Baris tabel | **TS-0413** (baris TS-0413) | Owner · Detail Transaksi → `/owner/transaksi/sewa/[id]` |
| Baris tabel | **TJ-0119** (baris TJ-0119) | Owner · Detail Transaksi → `/owner/transaksi/sewa/[id]` |
| Baris tabel | **TS-0377** (baris TS-0377) | Owner · Detail Transaksi → `/owner/transaksi/sewa/[id]` |

Dibuka dari: Laporan Pelanggan (“Detail”); Owner · Data Pelanggan (“Detail”).

#### Owner · Pengeluaran  `OwPengeluaran` → `/owner/pengeluaran`

*Komponen di dalamnya: `PengeluaranList` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Kelola kategori** | Owner · Kelola Kategori Pengeluaran → `/owner/pengeluaran/kategori` |
| Header halaman / isi | **+ Catat pengeluaran** | Owner · Form Pengeluaran → `/owner/pengeluaran/form` |
| Komponen `PengeluaranList` | Tombol tambah/ubah | Owner · Form Pengeluaran → `/owner/pengeluaran/form` |

Dibuka dari: Owner · Kelola Kategori Pengeluaran (“Tutup”); Owner · Form Pengeluaran (“back-href”).

#### Owner · Form Pengeluaran  `OwFormPengeluaran` → `/owner/pengeluaran/form`

*Komponen di dalamnya: `FormPengeluaranIsi` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Komponen `FormPengeluaranIsi` | Tombol kembali/Batal | Owner · Pengeluaran → `/owner/pengeluaran` |

Dibuka dari: Owner · Pengeluaran (“+ Catat pengeluaran”).

#### Owner · Kelola Kategori Pengeluaran  `OwFormKategoriBiaya` → `/owner/pengeluaran/kategori`

*Modal di atas **Owner · Pengeluaran** (`/owner/pengeluaran`).*  
*Komponen di dalamnya: `KategoriBiayaIsi` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Tutup** | Owner · Pengeluaran → `/owner/pengeluaran` |
| Komponen `KategoriBiayaIsi` | Tombol kembali/Batal | Owner · Pengeluaran → `/owner/pengeluaran` |

Dibuka dari: Owner · Pengeluaran (“Kelola kategori”).

#### Laporan Keuangan  `LapKeuangan` → `/owner/laporan/keuangan`

*Komponen di dalamnya: `PeriodeFilter`, `LaporanAksi` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Detail laporan** | Detail Laporan → `/owner/laporan/detail` |

- Memakai komponen **PeriodeFilter** (§5.11) dan **LaporanAksi** (tombol **Cetak** dan **Unduh**, §5.12). Baris laporan → Detail Laporan.

Dibuka dari: Dashboard Owner (“Lihat laporan”); Detail Laporan (“Kembali”).

#### Laporan Penyewaan  `LapSewa` → `/owner/laporan/penyewaan`

*Komponen di dalamnya: `LaporanAksi`, `PeriodeFilter` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Detail laporan** | Detail Laporan → `/owner/laporan/detail` |

Dibuka dari: sidebar.

#### Laporan Penjualan  `LapJual` → `/owner/laporan/penjualan`

*Komponen di dalamnya: `LaporanAksi`, `PeriodeFilter` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Detail laporan** | Detail Laporan → `/owner/laporan/detail` |

Dibuka dari: sidebar.

#### Laporan Stok  `LapStok` → `/owner/laporan/stok`

*Komponen di dalamnya: `LaporanAksi`, `PeriodeFilter` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Detail laporan** | Detail Laporan → `/owner/laporan/detail` |

Dibuka dari: sidebar.

#### Laporan Pelanggan  `LapPelanggan` → `/owner/laporan/pelanggan`

*Komponen di dalamnya: `LaporanAksi`, `PeriodeFilter` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Baris tabel | **Detail** (per baris, mis. 1, 2, 3, 4) | Owner · Detail Pelanggan → `/owner/pelanggan/[id]` |

Dibuka dari: sidebar.

#### Detail Laporan  `DetailLaporan` → `/owner/laporan/detail`

*Komponen di dalamnya: `LaporanAksi`, `PeriodeFilter` (§5).*

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Kembali** | Laporan Keuangan → `/owner/laporan/keuangan` |
| Header halaman / isi | **Sebelumnya** | Detail Laporan → `/owner/laporan/detail` |
| Header halaman / isi | **Berikutnya** | Detail Laporan → `/owner/laporan/detail` |

- Memakai PeriodeFilter dan LaporanAksi. **Kembali** → Laporan Keuangan.

Dibuka dari: Laporan Penjualan (“Detail laporan”); Laporan Keuangan (“Detail laporan”); Laporan Penyewaan (“Detail laporan”); Laporan Stok (“Detail laporan”).

#### Owner · Riwayat Aktivitas  `OwRiwayat` → `/owner/riwayat`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Baris tabel | **Detail** (per baris, mis. 2, 1) | Owner · Detail Riwayat Aktivitas → `/owner/riwayat/[id]` |
| Header halaman / isi | **Sebelumnya** | Owner · Riwayat Aktivitas → `/owner/riwayat` |
| Header halaman / isi | **Berikutnya** | Owner · Riwayat Aktivitas → `/owner/riwayat` |

Dibuka dari: Dashboard Owner (“Semua”); Owner · Detail Riwayat Aktivitas (“Kembali”).

#### Owner · Detail Riwayat Aktivitas  `OwDetailRiwayat` → `/owner/riwayat/[id]`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Kembali** | Owner · Riwayat Aktivitas → `/owner/riwayat` |
| Informasi aktivitas | **BK-0239** | Owner · Detail Booking → `/owner/booking/[id]` |

Dibuka dari: Owner · Riwayat Aktivitas (“Detail”).

#### Daftar Pengguna  `Pengguna` → `/owner/pengguna`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **+ Tambah akun Admin** | Form Pengguna → `/owner/pengguna/form` |
| Baris tabel | **Ubah** (per baris, mis. Pemilik, Admin, Sinta, Doni) | Form Pengguna → `/owner/pengguna/form` |
| Baris tabel | **Hak akses** (per baris, mis. Admin, Sinta) | Form Hak Akses → `/owner/hak-akses/form` |

- **+ Tambah akun Admin** dan **Ubah** → Form Pengguna. **Hak akses** → modal Form Akses (akses khusus).

Dibuka dari: Form Pengguna (“Batal”).

#### Form Pengguna  `FormPengguna` → `/owner/pengguna/form`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Batal** | Daftar Pengguna → `/owner/pengguna` |
| Header halaman / isi | **Simpan akun** | Daftar Pengguna → `/owner/pengguna` |

Dibuka dari: Daftar Pengguna (“+ Tambah akun Admin”).

#### Hak Akses  `HakAkses` → `/owner/hak-akses`


| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **+ Akses khusus pengguna** | Form Hak Akses → `/owner/hak-akses/form` |
| Akses khusus pengguna | **Ubah** | Form Hak Akses → `/owner/hak-akses/form` |

- Tabel hak akses per peran dan daftar akses khusus. **+ Akses khusus pengguna** dan **Ubah** → modal Form Akses.

Dibuka dari: Form Hak Akses (“Tutup”).

#### Form Hak Akses  `FormAkses` → `/owner/hak-akses/form`

*Modal di atas **Hak Akses** (`/owner/hak-akses`).*  

| Lokasi | Elemen | Tujuan |
|---|---|---|
| Header halaman / isi | **Tutup** | Hak Akses → `/owner/hak-akses` |
| Header halaman / isi | **Batal** | Hak Akses → `/owner/hak-akses` |
| Header halaman / isi | **Simpan akses** | Hak Akses → `/owner/hak-akses` |

- Modal di atas Hak Akses. **Simpan akses**, **Batal**, dan **Tutup** kembali ke Hak Akses. Opsi "Kelola Pengguna dan Hak Akses" tidak dapat diberikan (catatan di modal).

Dibuka dari: Hak Akses (“+ Akses khusus pengguna”); Daftar Pengguna (“Hak akses”).

#### Owner · Profil Akun  `OwProfil` → `/owner/profil`


Tidak ada tautan keluar di isi halaman selain sidebar.

Dibuka dari: sidebar.

## 5. Komponen interaktif (perilaku tanpa pindah halaman)

Komponen berikut dipakai di dalam beberapa layar. Hampir semua interaksinya terjadi **di tempat** (mengubah state di layar yang sama); hanya tombol berlabel *Kembali/Batal/Selesai* yang membuka layar lain.

### 5.1 Kasir (`Kasir`) — Booking Baru, Sewa Baru, Penjualan Baru
Satu komponen dengan tiga mode (`mode` = `booking` | `sewa` | `jual`):

| Mode | Dipakai di | Judul keranjang | Tombol utama | Konfirmasi |
|---|---|---|---|---|
| booking | Booking Baru (`/admin/booking/baru`) | Keranjang booking | **Buat booking** | "Konfirmasi booking ini?" → **Ya, buat booking** |
| sewa | Sewa Baru (`/admin/transaksi/sewa/baru`) | Keranjang penyewaan | **Proses transaksi** | "Proses transaksi penyewaan?" → **Ya, proses** |
| jual | Penjualan Baru (`/admin/transaksi/jual/baru`) | Keranjang penjualan | **Proses pembayaran** | "Proses pembayaran?" → **Ya, proses** |

Alur interaksi di dalam Kasir:
1. **Pelanggan** (opsional; kosong = pelanggan umum): cari nama/WhatsApp → klik hasil untuk memilih; **Ganti** untuk mengganti; **+ Pelanggan baru** membuka isian nama + nomor WhatsApp → **Simpan & pilih** (ada validasi). Jika tidak ketemu: "Pelanggan tidak ditemukan. Tambahkan sebagai pelanggan baru."
2. **Tanggal** (mode booking/sewa): tanggal booking/transaksi (hari ini), tanggal pengambilan/mulai, tanggal pengembalian, lalu durasi dihitung otomatis. Mengubah tanggal membuang barang dari keranjang yang stoknya tidak cukup pada periode baru (muncul toast).
3. **Katalog**: kotak cari, chip kategori, urutkan, paginasi (‹ 1 2 3 ›). Ada status *memuat* (skeleton), *gagal* ("Katalog gagal dimuat" → **Coba lagi**), dan *kosong* (→ **Reset pencarian**). Klik kartu barang/paket menambah ke keranjang; stok habis menampilkan toast galat. Mode jual tidak boleh melebihi stok.
4. **Keranjang**: tombol **−** / **+** jumlah, hapus baris; pada mode sewa tiap barang punya pemilihan **kode unit** (tombol "Pilih unit" / "Tambahkan N unit"). Paket mengurangi stok barang penyusunnya.
5. **Pembayaran**: subtotal, diskon, total; aturan **DP 25%** untuk booking/sewa dengan pengambilan **H-2 atau lebih**, **tanpa DP** untuk **H-1**; nominal dibayar, metode **Tunai / QRIS / Transfer**, sisa pembayaran (jual: uang kembalian), status pembayaran (*Belum dibayar*, *DP diterima*, *Dibayar sebagian*, *Lunas*).
6. **Validasi** saat menekan tombol utama (daftar galat tampil di atas tombol), misalnya: tanggal pengambilan booking minimal H-1, DP minimal 25%, DP yang diterima kurang.
7. Tombol utama → dialog **konfirmasi** (*Periksa lagi* menutup, *Ya, …* memproses) → layar **struk/rangkuman** dengan status (booking menjadi *Dikonfirmasi*), tombol **Booking baru / Transaksi baru / Penjualan baru** (mengosongkan form) dan **Kembali ke menu booking / transaksi penyewaan** (hanya mode booking dan sewa).
8. Mobile: tombol melayang **Keranjang · N item** menggulir ke keranjang.

### 5.2 FotoUpload (`FotoUpload`) — di Form Barang
Memilih berkas foto produk (pratinjau) dan **Hapus foto**. Barang jual dimulai tanpa foto.

### 5.3 StrukModal (`StrukModal`) — Cetak bukti
Tombol **Cetak bukti** (label dari komponen) membuka popup. Pengaturan: **ukuran kertas**, **Tampilkan nama kasir**, **Tampilkan riwayat pembayaran**, **Sertakan ketentuan**, **jumlah salinan** (batas dengan pesan galat); pratinjau struk SUMMIT RENTAL & STORE di sisi popup. Tombol: **Batal**, **Unduh PDF**, **Cetak**. Klik latar atau **×** menutup. Dipakai di Detail Transaksi, Detail Penjualan, Pelunasan Berhasil, dan struk Kasir.

### 5.4 UnitList (`UnitList`) — Detail Unit
- Ringkasan variasi (merek, ukuran, kapasitas, jenis, karakteristik, kategori, jumlah unit dialokasikan booking, total unit).
- Daftar unit: pencarian kode unit, **chip filter kondisi** (Tersedia, Disewa, Dicuci, Persiapan, Rusak, Perawatan) dengan jumlah, **Atur ulang filter** saat kosong.
- **Detail** per unit membuka dialog riwayat unit; **Ubah kondisi** membuka dialog pemilihan kondisi baru (enam kondisi dengan deskripsi, peringatan perubahan, catatan pemeriksaan opsional) → **Simpan perubahan** / **Batal**. Toast konfirmasi.
- Aturan desain: unit yang dikembalikan **tidak otomatis Tersedia**; harus diperiksa lalu diubah kondisinya. Setiap perubahan mencatat kondisi lama, baru, waktu, dan pengguna.
- Tombol **← Ringkasan per Variasi** → Stok (Admin) atau Stok Owner.

### 5.5 StokJualList (`StokJualList`) — Stok Barang Jual
Ringkasan (produk jual, total stok, stok menipis/habis, terjual bulan ini); pencarian; chip filter status stok; tombol **Penyesuaian stok** per baris membuka dialog: pilih tipe **Tambah stok / Kurangi stok / Koreksi**, isi jumlah (validasi), **Alasan** (daftar alasan sesuai tipe, mis. *Barang masuk dari supplier*, *Rusak / kadaluarsa*, *Hasil stok opname*), catatan opsional, tampilan "stok saat ini → setelah disimpan" → **Simpan penyesuaian** / **Batal**. Hasil masuk ke *Riwayat penyesuaian stok*. Barang jual yang habis tetap tampil tetapi tidak bisa dipilih di Penjualan Baru.

### 5.6 FormBarangIsi (`FormBarangIsi`) — Form Barang
- Toggle jenis **Barang Sewa / Barang Jual** (halaman Barang Jual langsung memulai di tab jual).
- *Sewa*: kode produk, nama, deskripsi, **spesifikasi** (chip yang bisa dicentang atau dihapus, tambah spesifikasi baru dengan validasi), tabel **variasi** (**+ Tambah variasi**, harga sewa per hari, jumlah unit/kode, **Hapus** baris), foto.
- *Jual*: daftar variasi (**+ Tambah variasi**, **Hapus**), harga jual, stok, **peringatan stok menipis**, satuan (pcs, dll.).
- **Simpan barang** → pesan sukses "tersimpan dengan N variasi dan M unit" + tautan ke daftar; **Batal** → daftar Barang (`back-href`).

### 5.7 PengeluaranList (`PengeluaranList`) — Pengeluaran
Total pengeluaran periode, total *Belum dibayar*, ringkasan per kategori; filter **periode** (tanggal mulai–sampai, pesan galat jika akhir < mulai), pencarian, chip kategori, chip status; tabel dengan tombol per baris **Tandai Sudah dibayar / Belum dibayar** (status bisa diubah kapan saja, dua arah), **Ubah** (→ Form Pengeluaran via `form-href`), **Hapus** (dengan toast **Urungkan**). Kosong → **Reset filter**.

### 5.8 FormPengeluaranIsi (`FormPengeluaranIsi`) — Form Pengeluaran
Nama/keterangan, **Kategori** (hanya kategori aktif), tanggal, nominal, **Status pembayaran** (Sudah dibayar / Belum dibayar), metode, tanggal bayar, **jatuh tempo** (opsional, muncul untuk belum dibayar), lampiran nota (opsional). Tombol **Simpan perubahan**, **Batal**, **Hapus pengeluaran** (dengan **Urungkan**); setelah simpan ada tautan **Kembali ke daftar**. Ada panel *Riwayat perubahan* (siapa mengubah apa).

### 5.9 KategoriBiayaIsi (`KategoriBiayaIsi`) — modal Kelola kategori
**Tambah** kategori baru; per baris **Ubah** (edit di tempat, **Simpan**/**Batal**), **Aktifkan/Nonaktifkan**, **Hapus** (dengan **Urungkan**). Kategori yang sudah dipakai tidak bisa dihapus, hanya dinonaktifkan; pengeluaran lama tetap menyimpan nama kategorinya. Tombol **Selesai** menutup modal (→ Pengeluaran).

### 5.10 OwnerRekap (`OwnerRekap`) — Dashboard Owner
Tab periode **Harian / Bulan ini / 3 bulan terakhir / Tahun ini**. Di mode Harian: tombol ‹ ›, pilih tanggal, **Hari ini** (tidak bisa melewati hari ini). Mengganti periode memperbarui: kartu KPI (pendapatan, pengeluaran, transaksi sewa/jual, booking aktif), grafik batang (per jam / minggu / bulan), daftar *Transaksi pada tanggal ini* (hanya Harian), dan tiga peringkat (*Paling sering disewa*, *Produk terlaris*, *Pelanggan teraktif*). Tidak ada perpindahan layar.

### 5.11 PeriodeFilter (`PeriodeFilter`) — Laporan
Pilihan **Harian / Bulanan**, tombol ‹ ›, pilih tanggal (harian) atau bulan (bulanan, 12 bulan terakhir); tombol › nonaktif pada periode berjalan. Catatan terbuka: filter ini belum menggerakkan data, judul, dan nama file laporan.

### 5.12 LaporanAksi (`LaporanAksi`) — Laporan
Tombol **Cetak** membuka dialog: ukuran kertas, orientasi, isi cetakan (*Ringkasan angka*, *Rincian tabel*, *Kop toko dan kolom tanda tangan*; minimal satu), jumlah salinan. Tombol **Unduh** membuka dialog: **format file**, isi file, nama file. Keduanya punya **Batal** dan tombol aksi (label mengikuti pilihan).

### 5.13 Pencarian variasi (`DetailBarang`, `VariasiCari`)
Kotak cari pada kartu *Variasi & ringkasan stok* menyaring baris berdasarkan merek, ukuran, kode unit, atau harga; teks "N dari M variasi"; tombol **Reset**; baris kosong "Variasi tidak ditemukan".

## 6. Skenario alur dari awal sampai akhir

**S1 — Booking sampai pengembalian (Admin)**
1. `Dashboard` → **+ Booking baru** → `Booking Baru` (Kasir mode booking): pilih pelanggan, tanggal, barang → **Buat booking** → konfirmasi → struk (*Dikonfirmasi*).
2. `Booking` → pada booking siap ambil klik **Proses sewa** → `Sewa Baru` (Kasir mode sewa): pilih kode unit → **Proses transaksi**.
3. `Transaksi Penyewaan` → baris *Belum diambil* → **Pelunasan & serahkan** → `Detail Transaksi` → **Catat pembayaran** → modal `Form Bayar` → **Simpan pembayaran** → `Pelunasan Berhasil` → **Cetak bukti**.
4. `Pengembalian` (atau **Kembalikan** di Transaksi Penyewaan untuk yang terlambat) → **Catat pengembalian** → `Form Pengembalian`: periksa kondisi per unit, **+ Tambah biaya** (modal `Form Biaya`) bila ada denda/kerusakan, **Catat bayar biaya tambahan** (modal Form Bayar) → **Simpan pengembalian** → kembali ke `Pengembalian`.
5. `Stok dan Ketersediaan` / `Detail Unit` → **Ubah kondisi** unit yang dicuci/perawatan menjadi *Tersedia*.

**S2 — Cek ketersediaan**: `Dashboard` → **Cek ketersediaan** → `Stok dan Ketersediaan`. Atau menu Booking → `Cek Ketersediaan` (halaman tersendiri; lanjut ke Sewa Baru atau Booking Baru).

**S3 — Penjualan langsung**: `Transaksi Penjualan` → **+ Transaksi penjualan** → `Penjualan Baru` (Kasir mode jual) → **Proses pembayaran** → struk. Bila belum lunas, di daftar muncul **Catat bayar** → modal Form Bayar.

**S4 — Kelola barang**: `Semua Barang` → **+ Tambah barang** (atau **Ubah**) → `Form Barang` → **Simpan barang** → daftar. **Detail** → `Detail Barang` (cari variasi) → **Detail Unit**. Stok jual: `Stok dan Ketersediaan` → tab **Barang Jual** → **Penyesuaian stok**.

**S5 — Pengeluaran**: `Pengeluaran` → **Tambah** → `Form Pengeluaran` → simpan → daftar; **Kelola kategori** → modal Kelola Kategori.

**S6 — Owner melihat laporan**: `Dashboard Owner` (rekap) → **Lihat laporan** → `Laporan Keuangan` → pilih periode → baris → `Detail Laporan` → **Cetak/Unduh**. Laporan lain lewat sidebar.

**S7 — Owner mengelola pengguna**: `Daftar Pengguna` → **+ Tambah akun Admin** → `Form Pengguna` → simpan. `Hak Akses` → **+ Akses khusus pengguna** / **Ubah** → modal `Form Akses` → **Simpan akses**.

**S8 — Owner memantau**: `Monitoring Booking` / `Transaksi Penyewaan` / `Transaksi Penjualan` → klik baris → detail (hanya lihat). Tindakan (pelunasan, pengembalian) dilakukan Admin.

## 7. Tablet dan Mobile

Desktop adalah acuan di dokumen ini. Layar tablet (`T*`) dan mobile (`M*`) mengikuti tujuan layar yang sama tetapi dengan navigasi berbeda:
- **Mobile** memakai bilah atas (`MTop`), bilah bawah (`MBot`), dan lembar menu (`MMenuAdmin`, `MMenuOwner`) sebagai pengganti sidebar; Laporan memiliki layar daftar sendiri (`MLaporan`).
- Beberapa pintasan desktop belum ada di tablet/mobile, mis. Dashboard tablet tanpa tautan ke Form Kembali/Pengeluaran/Pengembalian/Transaksi Sewa, daftar Transaksi Penyewaan tanpa **Dari booking**, **+ Transaksi langsung**, dan **Kembalikan**, dan beberapa daftar (Pelanggan, Riwayat, Laporan Stok di mobile) tanpa tautan ke layar detail.
- Tablet memakai tab untuk berpindah antar layar yang sejenis (mis. Barang / Kategori / Paket; Transaksi Penyewaan / Penjualan; Hak Akses / Pengguna).
- Saat membangun, samakan tujuan tombol dengan desktop kecuali ada keputusan desain lain.

## 8. Temuan yang perlu diputuskan

1. **`CekSedia` hilang.** Layar Cek Ketersediaan (desktop, tablet, mobile) memanggil komponen `CekSedia` yang tidak ada di file desain, sehingga area utamanya kosong dan perilaku pengecekan belum terdefinisi.
2. **Form Bayar selalu berinduk Detail Transaksi.** Padahal juga dibuka dari Transaksi Penjualan (**Catat bayar**) dan Form Pengembalian (**Catat bayar biaya tambahan**); **Batal/Tutup** di desain selalu kembali ke Detail Transaksi. Saat implementasi, kembalikan ke layar asal.
3. **Pelunasan Berhasil** hanya mencontohkan transaksi TS-0412 (data contoh tetap).
4. **Hapus** di daftar Barang Owner dan di beberapa daftar tidak punya dialog konfirmasi di desain.
5. **Aturan pelunasan:** PRD aturan 3 (pelunasan saat pengambilan) belum sejalan dengan status *Belum Lunas* setelah pengambilan; alur di dokumen ini mengikuti desain (pelunasan dari Detail Transaksi).
6. Masih terbuka: opsi *Kategori pengeluaran* di Hak Akses, satu atau dua tombol login, TS-0412 menjadi *Lunas* setelah pelunasan, pemisahan pengeluaran dibayar/belum di Laporan Keuangan, dan keterkaitan filter periode laporan.
7. **Keamanan peran:** Admin tidak boleh membuka route `/owner/*` (cek di server), walaupun menu sudah dipisah.
