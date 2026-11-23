# Activity Diagram – Summit Rental & Store

Diagram aktivitas dalam teks (Mermaid, otomatis tampil di GitHub, GitLab, dan VS Code).
Notasi: `([ ])` awal/akhir · `[ ]` aktivitas · `{ }` keputusan · `[/ /]` input/keluaran.

Daftar diagram:
1. Login, Logout, dan Hak Akses
2. Booking
3. Transaksi Penyewaan (dari booking atau langsung)
4. Pelunasan dan Cetak Bukti/Struk
5. Pengembalian Barang
6. Transaksi Penjualan
7. Tambah Barang Sewa (variasi dan unit)
8. Pengelolaan Kondisi Unit dan Stok
9. Pengeluaran dan Kelola Kategori
10. Laporan (periode, cetak, unduh)

---

## 1. Login, Logout, dan Hak Akses

```mermaid
flowchart TD
    A([Mulai]) --> B[/Buka halaman login/]
    B --> C[/Input username atau email dan password/]
    C --> D{Akun ditemukan, password benar, dan akun aktif?}
    D -- Tidak --> E[Tampilkan pesan gagal login]
    E --> C
    D -- Ya --> F{Peran pengguna}
    F -- Admin --> G[Tampilkan Dashboard Admin dan menu operasional]
    F -- Owner --> H[Tampilkan Dashboard Owner dan menu lengkap termasuk Laporan dan Kelola Pengguna]
    G --> I[Catat aktivitas login]
    H --> I
    I --> J[Pengguna menggunakan sistem sesuai hak akses]
    J --> K{Pilih Logout?}
    K -- Tidak --> J
    K -- Ya --> L[Akhiri sesi dan catat aktivitas logout]
    L --> M([Selesai])
```

---

## 2. Booking

```mermaid
flowchart TD
    A([Mulai]) --> B[Admin menerima permintaan pelanggan lewat WhatsApp atau langsung]
    B --> C[Cek ketersediaan berdasarkan tanggal sewa dan variasi barang]
    C --> D{Barang tersedia?}
    D -- Tidak --> E[Informasikan ke pelanggan, tawarkan tanggal atau barang lain]
    E --> Z([Selesai])
    D -- Ya --> F[Buka Booking Baru]
    F --> G[Pilih atau tambah data pelanggan]
    G --> H[Pilih barang di tab Barang Satuan atau tab Paket, keranjang dipakai bersama]
    H --> I[Isi jumlah, tanggal dan waktu mulai, selesai, serta tanggal pengambilan]
    I --> J[Sistem menghitung total sewa berdasarkan barang, jumlah, dan durasi]
    J --> K{Pengambilan kapan?}
    K -- Minimal H-2 --> L[Sistem menghitung DP 25 persen dari total]
    K -- H-1 --> M[Tampilkan info: tanpa DP sesuai ketentuan]
    L --> N{DP sudah diterima?}
    N -- Ya --> O[/Catat nominal, tanggal, dan metode: tunai, QRIS, transfer/]
    N -- Belum --> P[Simpan sebagai Draft]
    O --> Q[Status Dikonfirmasi]
    M --> Q
    P --> R{Pelanggan sepakat?}
    R -- Ya --> N
    R -- Tidak --> S[Hapus Draft dengan konfirmasi dan alasan]
    S --> T[Catat di Riwayat Aktivitas]
    T --> Z
    Q --> U[Alokasikan stok pada periode sewa dan generate kode booking]
    U --> V{Ada perubahan atau pembatalan?}
    V -- Ubah data --> W[Ubah booking dan simpan riwayat perubahan]
    W --> V
    V -- Batal oleh pengguna berwenang --> X[Isi alasan pembatalan]
    X --> Y[Lepas alokasi stok, catat DP sebagai hangus jika ada, simpan riwayat]
    Y --> Z
    V -- Tidak, lanjut ke hari pengambilan --> AA[Lanjutkan ke Transaksi Penyewaan]
    AA --> AB([Selesai: status booking menjadi Selesai])
```

---

## 3. Transaksi Penyewaan (dari booking atau langsung)

```mermaid
flowchart TD
    A([Mulai]) --> B{Sumber transaksi}
    B -- Dari booking --> C[Pilih booking Dikonfirmasi lalu Lanjutkan ke Transaksi]
    C --> D[Data pelanggan, barang, dan periode terisi otomatis]
    D --> E[Nominal DP otomatis masuk, tidak dicatat ulang]
    B -- Langsung tanpa booking --> F[Buka Transaksi Penyewaan Langsung]
    F --> G[Pilih atau tambah pelanggan]
    G --> H[Pilih barang di tab Barang Satuan atau tab Paket, keranjang dipakai bersama]
    H --> I[Isi jumlah, tanggal dan waktu mulai dan selesai]
    I --> J[Sistem cek ketersediaan periode]
    J --> K{Stok cukup?}
    K -- Tidak --> L[Tampilkan peringatan, ubah jumlah atau periode]
    L --> I
    K -- Ya --> M[Hitung total biaya]
    E --> N[Pilih unit fisik untuk barang yang dikelola per unit]
    M --> N
    N --> O[/Catat jenis jaminan: KTP atau SIM/]
    O --> P{Pembayaran saat ini}
    P -- Langsung: bayar penuh --> Q[/Catat nominal dan metode pembayaran/]
    P -- Dari booking: sisa tagihan --> R[Sistem menghitung sisa = total dikurangi DP]
    R --> S{Dilunasi sekarang?}
    S -- Ya --> Q
    S -- Belum --> T[Status pembayaran Belum Lunas]
    Q --> U[Status pembayaran Lunas]
    T --> V[Simpan transaksi dan buat kode transaksi]
    U --> V
    V --> W[Konfirmasi pengambilan barang oleh pelanggan]
    W --> X[Catat waktu pengambilan, status Sudah Diambil, unit menjadi Disewa]
    X --> Y[Tampilkan halaman Transaksi Berhasil]
    Y --> Z{Aksi lanjutan}
    Z -- Cetak bukti/struk --> AA[Buka popup Cetak Bukti/Struk, lihat diagram 4]
    Z -- Kembali ke menu transaksi penyewaan --> AB([Selesai])
    AA --> AB
```

---

## 4. Pelunasan dan Cetak Bukti/Struk

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka Detail Transaksi Penyewaan]
    B --> C{Status pembayaran}
    C -- Lunas --> D[Tampilkan rincian dan riwayat pembayaran]
    C -- Belum Lunas atau Belum Dibayar --> E[Klik Catat pembayaran]
    E --> F[/Input nominal, metode, dan tanggal/]
    F --> G{Nominal valid dan tidak melebihi sisa?}
    G -- Tidak --> H[Tampilkan pesan validasi]
    H --> F
    G -- Ya --> I[Simpan pembayaran dan hitung ulang sisa]
    I --> J{Sisa sama dengan nol?}
    J -- Tidak --> K[Status tetap Belum Lunas, kembali ke detail]
    K --> D
    J -- Ya --> L[Status otomatis menjadi Lunas]
    L --> M[Tampilkan halaman Pelunasan Berhasil]
    M --> N{Pilih aksi}
    N -- Lihat detail transaksi --> D
    N -- Kembali ke menu transaksi penyewaan --> Z([Selesai])
    N -- Cetak bukti/struk --> O
    D --> P{Cetak bukti/struk?}
    P -- Tidak --> Z
    P -- Ya --> O[Buka popup Cetak Bukti/Struk di tengah layar]
    O --> Q[Pilih ukuran kertas: 58 mm, 80 mm, atau A4]
    Q --> R[Pilih isi: nama kasir, rincian pembayaran, syarat dan ketentuan]
    R --> S[Atur jumlah salinan dan lihat pratinjau]
    S --> T{Aksi}
    T -- Cetak --> U[Kirim ke printer]
    T -- Unduh PDF --> V[Simpan struk sebagai PDF]
    T -- Batal --> Z
    U --> Z
    V --> Z
```

---

## 5. Pengembalian Barang

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka menu Pengembalian, cari transaksi]
    B --> C[Tampilkan barang yang harus dikembalikan, paket dirinci per barang penyusun]
    C --> D[/Catat tanggal, waktu, dan jumlah barang yang dikembalikan/]
    D --> E{Dikembalikan sekaligus?}
    E -- Sebagian --> F[Simpan sebagai pengembalian bertahap]
    F --> G[Status: Dikembalikan Sebagian]
    G --> D
    E -- Seluruhnya --> H[Periksa kondisi tiap barang]
    H --> I{Ada masalah?}
    I -- Rusak, hilang, atau tidak lengkap --> J[Catat barang bermasalah]
    I -- Baik --> K{Terlambat? lewat tanggal kembali atau lewat 21.00 WIB}
    J --> K
    K -- Ya --> L[Tampilkan lama keterlambatan]
    K -- Tidak --> M{Ada biaya tambahan?}
    L --> M
    M -- Ya --> N[/Input nominal manual dan alasan: denda, kerusakan, atau kehilangan/]
    N --> O[Masuk ke rincian tagihan transaksi]
    O --> P[/Catat pembayaran biaya tambahan: tunai, QRIS, transfer/]
    M -- Tidak --> Q[Tentukan kondisi tiap unit setelah pemeriksaan]
    P --> Q
    Q --> R{Hasil pemeriksaan}
    R -- Perlu dicuci --> S[Unit menjadi Dicuci]
    R -- Perlu disiapkan --> T[Unit menjadi Persiapan]
    R -- Rusak --> U[Unit menjadi Rusak atau Perawatan]
    R -- Siap pakai --> V[Unit menjadi Tersedia setelah dinyatakan siap]
    S --> W[Status: Dikembalikan Seluruhnya]
    T --> W
    U --> W
    V --> W
    W --> X{Semua kewajiban pembayaran selesai?}
    X -- Tidak --> Y[Tagihan tersisa, jaminan belum dikembalikan]
    Y --> P
    X -- Ya --> AA[Kembalikan jaminan pelanggan dan catat]
    AA --> AB[Status transaksi Selesai, simpan riwayat pengembalian]
    AB --> Z([Selesai])
```

---

## 6. Transaksi Penjualan

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka Transaksi Penjualan]
    B --> C[Cari atau filter produk Barang Jual berdasarkan nama, kode, kategori]
    C --> D[Tambah produk ke keranjang dan atur jumlah]
    D --> E{Jumlah melebihi stok?}
    E -- Ya --> F[Tampilkan peringatan stok, sesuaikan jumlah]
    F --> D
    E -- Tidak --> G{Tambah produk lain?}
    G -- Ya --> C
    G -- Tidak --> H[Hitung subtotal dan total otomatis]
    H --> I[Pelanggan opsional dipilih atau dicatat]
    I --> J[/Input nominal bayar dan metode: tunai, QRIS, transfer/]
    J --> K{Bayar cukup?}
    K -- Tidak --> L[Tampilkan pesan kurang bayar]
    L --> J
    K -- Ya --> M[Hitung kembalian]
    M --> N[Simpan transaksi dan buat kode transaksi]
    N --> O[Kurangi stok sesuai jumlah terjual]
    O --> P[Tampilkan halaman Transaksi Berhasil]
    P --> Q{Cetak bukti/struk?}
    Q -- Ya --> R[Popup Cetak Bukti/Struk, lihat diagram 4]
    Q -- Tidak --> S[Buka Detail Penjualan atau kembali ke daftar]
    R --> S
    S --> Z([Selesai])
```

---

## 7. Tambah Barang Sewa (variasi dan unit)

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka Data Barang lalu Tambah Barang]
    B --> C[Pilih jenis barang]
    C --> D{Jenis barang}
    D -- Barang Jual --> E[/Isi nama, kode, kategori, harga jual, stok, foto/]
    E --> Z1[Simpan, stok dikelola per kuantitas]
    Z1 --> Z([Selesai])
    D -- Barang Sewa --> F[/Isi nama, kode, kategori, deskripsi, foto/]
    F --> G[Centang spesifikasi yang dipakai: merek, ukuran, kapasitas, jenis]
    G --> H{Butuh spesifikasi lain?}
    H -- Ya --> I{Sudah 3 spesifikasi lain?}
    I -- Ya --> J[Tombol tambah ditolak]
    I -- Tidak --> K[/Isi nama spesifikasi, validasi nama/]
    K --> L[Kolom baru muncul pada tabel variasi]
    J --> M
    L --> H
    H -- Tidak --> M[Tabel variasi hanya menampilkan kolom yang dicentang]
    M --> N[/Isi baris variasi: nilai spesifikasi, harga sewa, jumlah unit/]
    N --> O{Tambah variasi lagi?}
    O -- Ya --> P[Tambah baris variasi]
    P --> N
    O -- Tidak --> Q{Data valid? tidak ada duplikat dan kolom wajib terisi}
    Q -- Tidak --> R[Tampilkan pesan kesalahan pada baris terkait]
    R --> N
    Q -- Ya --> S[Sistem membuat kode unit otomatis berurutan tanpa kode ganda]
    S --> T[Simpan barang, variasi, dan unit berkondisi Tersedia]
    T --> U[Catat riwayat stok]
    U --> Z
```

---

## 8. Pengelolaan Kondisi Unit dan Stok

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka Stok dan Ketersediaan]
    B --> C[Lihat Ringkasan per Variasi]
    C --> D{Aksi}
    D -- Detail Unit --> E[Buka daftar unit variasi, cari atau filter kode dan kondisi]
    E --> F[Pilih unit untuk melihat detail dan riwayat]
    F --> G{Ubah kondisi?}
    G -- Ya --> H[/Pilih kondisi baru: Tersedia, Disewa, Dicuci, Persiapan, Rusak, Perawatan/]
    H --> I[Simpan, catat kondisi lama, baru, waktu, dan pengguna]
    I --> J[Ringkasan stok diperbarui sesuai data unit]
    G -- Tidak --> K[Kembali ke Stok atau Ringkasan per Variasi]
    J --> K
    D -- Tambah stok --> L[Pilih produk dan variasi, isi jumlah]
    L --> M[Buat unit baru, kode melanjutkan urutan sebelumnya]
    M --> N[Catat riwayat penambahan]
    N --> K
    D -- Sesuaikan stok Barang Jual --> O[/Input penyesuaian dan alasan/]
    O --> P[Simpan, catat riwayat penyesuaian]
    P --> K
    D -- Cek ketersediaan --> Q[/Pilih tanggal mulai, selesai, dan variasi atau paket/]
    Q --> R[Sistem hitung dari booking, transaksi aktif, kondisi fisik, dan komposisi paket]
    R --> S[Tampilkan jumlah tersedia dan rincian kebutuhan barang penyusun]
    S --> K
    K --> Z([Selesai])
```

---

## 9. Pengeluaran dan Kelola Kategori

Menu Pengeluaran sama untuk Admin dan Owner.

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka menu Pengeluaran]
    B --> C{Aksi}
    C -- Catat pengeluaran --> D[/Isi keterangan, tanggal, nominal, metode, dan status bayar/]
    D --> E[Pilih kategori aktif]
    E --> F{Kategori belum ada?}
    F -- Ya --> G[Klik Kelola kategori]
    F -- Tidak --> H{Data valid?}
    H -- Tidak --> I[Tampilkan pesan validasi]
    I --> D
    H -- Ya --> J[Simpan pengeluaran dan riwayat perubahan]
    J --> K[Tampil di daftar dan total periode]
    C -- Ubah atau lihat detail --> L[Pilih pengeluaran, ubah data, simpan riwayat]
    L --> K
    C -- Kelola kategori --> G
    G --> M{Aksi kategori}
    M -- Tambah --> N[/Isi nama kategori, validasi tidak kosong dan tidak ganda/]
    M -- Ubah nama --> N
    M -- Aktif atau nonaktif --> O[Ubah status kategori]
    M -- Hapus --> P[Hapus langsung dan tampilkan Batalkan sesaat]
    P --> Q{Batalkan?}
    Q -- Ya --> R[Kategori dipulihkan]
    Q -- Tidak --> S[Penghapusan final]
    N --> T[Simpan kategori]
    O --> T
    R --> T
    S --> T
    T --> U{Selesai mengelola?}
    U -- Belum --> M
    U -- Ya --> V[Kembali ke daftar Pengeluaran]
    K --> W([Selesai])
    V --> W
```

---

## 10. Laporan (periode, cetak, unduh)

```mermaid
flowchart TD
    A([Mulai]) --> B{Pengguna adalah Owner atau punya akses khusus?}
    B -- Tidak --> C[Akses ditolak]
    C --> Z([Selesai])
    B -- Ya --> D[Pilih jenis laporan: Keuangan, Penyewaan, Penjualan, Stok, Pelanggan]
    D --> E{Jenis periode}
    E -- Harian --> F[/Pilih tanggal, tidak boleh melewati hari ini/]
    E -- Bulanan --> G[/Pilih bulan, tidak boleh melewati bulan ini/]
    F --> H[Tampilkan laporan sesuai periode, bisa pindah periode sebelumnya atau berikutnya]
    G --> H
    H --> I{Aksi}
    I -- Detail laporan --> J[Buka rincian transaksi pembentuk angka, kembali ke laporan]
    J --> H
    I -- Ubah periode atau filter --> E
    I -- Cetak --> K[Popup Cetak: hasil berupa kertas]
    K --> L[Pilih kertas A4 atau Letter dan orientasi potret atau lanskap]
    L --> M[Pilih isi: ringkasan, rincian tabel, kop dan tanda tangan]
    M --> N{Minimal satu isi dipilih?}
    N -- Tidak --> O[Tampilkan pesan pilih minimal satu isi]
    O --> M
    N -- Ya --> P[Atur salinan lalu kirim ke printer]
    I -- Unduh --> Q[Popup Unduh: hasil berupa berkas]
    Q --> R[Pilih format: PDF, Excel, atau CSV]
    R --> S{Format CSV?}
    S -- Tidak --> T[Pilih isi: ringkasan dan rincian, atau rincian saja]
    S -- Ya --> U[CSV hanya memuat rincian]
    T --> V[Nama berkas dibuat otomatis dari jenis laporan dan periode]
    U --> V
    V --> W[Simpan berkas ke perangkat]
    P --> X{Aksi lain?}
    W --> X
    X -- Ya --> H
    X -- Tidak --> Z
    I -- Selesai --> Z
```
