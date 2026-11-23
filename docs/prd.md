# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Sistem Informasi Penyewaan Perlengkapan Kemah Berbasis Web
### 19 Summit Adventure

- Nama Produk : Sistem Informasi Penyewaan Perlengkapan Kemah Berbasis Web 
- Nama Usaha : 19 Summit Adventure
- Jenis Produk : Sistem Informasi Berbasis Web 
- Pengguna Utama : Admin dan Owner

# 1. Pendahuluan

## 1.1 Latar Belakang
19 Summit Adventure merupakan usaha yang bergerak di bidang penyewaan perlengkapan kemah dan kegiatan luar ruangan. Usaha ini menyediakan berbagai perlengkapan yang dapat disewa secara satuan maupun paket, serta beberapa produk yang dijual kepada pelanggan.

Dalam kegiatan operasionalnya, 19 Summit Adventure telah menggunakan beberapa media pencatatan, seperti WhatsApp, nota, buku besar, kertas, sticky notes, dan spreadsheet. Media tersebut digunakan untuk mendukung pengelolaan stok barang, pemesanan atau booking, transaksi penyewaan, pembayaran, pengembalian barang, serta rekapitulasi laporan.

Berdasarkan hasil wawancara dan identifikasi proses bisnis, terdapat beberapa aktivitas yang masih membutuhkan pencatatan dan pengolahan data secara berulang. Informasi booking perlu dipindahkan dari WhatsApp ke catatan lain, transaksi dicatat melalui nota dan buku besar sebelum direkap ke spreadsheet, serta pembaruan data stok belum dilakukan secara optimal. Selain itu, proses pencarian riwayat penyewaan pelanggan dan pemantauan barang yang sedang disewa belum dikelola melalui satu sistem terintegrasi.

Kondisi tersebut menjadi dasar pengembangan Sistem Informasi Penyewaan Perlengkapan Kemah Berbasis Web. Sistem ini diharapkan dapat membantu pengelolaan data operasional secara terpusat, mempermudah pencatatan transaksi, meningkatkan keteraturan informasi stok, serta menyediakan laporan yang dapat digunakan pemilik untuk memantau kegiatan usaha dan mendukung pengambilan keputusan.

## 1.2 Tujuan Dokumen
Dokumen PRD ini dibuat sebagai acuan dalam proses perencanaan dan pengembangan Sistem Informasi Penyewaan Perlengkapan Kemah Berbasis Web pada 19 Summit Adventure.

Dokumen ini menjelaskan kebutuhan produk secara umum, meliputi permasalahan yang ingin diselesaikan, tujuan pengembangan, ruang lingkup, pengguna, fitur utama, serta gambaran kebutuhan sistem.

Dokumen ini juga menjadi dasar bagi penyusunan dokumen teknis dan implementasi sistem agar pengembangan tetap sesuai dengan kebutuhan operasional 19 Summit Adventure.


# 2. Deskripsi Produk

## 2.1 Gambaran Umum Produk
Sistem Informasi Penyewaan Perlengkapan Kemah Berbasis Web merupakan aplikasi internal yang digunakan untuk membantu 19 Summit Adventure dalam mengelola kegiatan operasional penyewaan dan penjualan perlengkapan kemah.

Sistem menyediakan pengelolaan data barang, kategori, paket penyewaan, booking, transaksi penyewaan, transaksi penjualan, pembayaran, pengembalian barang, pengeluaran, data pelanggan, serta laporan usaha.

Sistem memiliki dua jenis pengguna utama, yaitu Admin dan Owner. Admin bertanggung jawab terhadap aktivitas operasional dan pencatatan data, sedangkan Owner memiliki akses untuk memantau kegiatan usaha, melihat laporan, serta mengelola pengguna dan hak akses.

Sistem dikembangkan berbasis web sehingga dapat diakses melalui perangkat yang memiliki browser dan koneksi internet. Sistem tidak ditujukan sebagai platform pemesanan mandiri bagi pelanggan. Proses pemesanan tetap dilakukan melalui WhatsApp atau secara langsung di toko, sedangkan pencatatan dan pengelolaannya dilakukan melalui sistem.

## 2.2 Permasalahan yang Ingin Diselesaikan
Berdasarkan hasil identifikasi proses bisnis, permasalahan yang menjadi dasar pengembangan sistem meliputi:
1. Pengelolaan data stok dan kondisi barang belum diperbarui secara optimal.
2. Pencatatan booking masih menggunakan beberapa media, seperti WhatsApp, kertas, dan sticky notes.
3. Pencatatan transaksi dan pembayaran masih melibatkan pemindahan data secara berulang dari nota ke buku besar dan spreadsheet.
4. Pencarian data transaksi dan riwayat penyewaan pelanggan masih bergantung pada catatan yang tersedia.
5. Pemantauan barang yang sedang disewa dan jadwal pengembaliannya belum tersedia dalam satu tampilan digital.
6. Informasi kondisi barang setelah pengembalian perlu dikelola agar barang yang belum siap tidak dianggap tersedia untuk disewakan.
7. Proses rekapitulasi dan pencocokan laporan keuangan membutuhkan waktu.
8. Informasi usaha, seperti barang yang sering disewa, riwayat pelanggan, dan kondisi stok, belum tersaji secara terpusat untuk mendukung pengambilan keputusan.

## 2.3 Tujuan Produk
Pengembangan sistem memiliki tujuan sebagai berikut:
1. Memusatkan pengelolaan data barang, pelanggan, booking, transaksi, dan pengembalian dalam satu sistem.
2. Mempermudah Admin dalam melakukan pencatatan dan pengelolaan aktivitas operasional.
3. Membantu pemantauan ketersediaan barang berdasarkan jadwal penyewaan.
4. Mengelola informasi kondisi dan status operasional barang secara lebih terstruktur.
5. Mempermudah pencatatan pembayaran, termasuk DP, pelunasan, dan biaya tambahan.
6. Menyediakan riwayat transaksi dan penyewaan pelanggan yang dapat ditelusuri.
7. Membantu Owner memantau aktivitas usaha melalui dashboard dan laporan.
8. Mengurangi pekerjaan pencatatan serta rekapitulasi data yang dilakukan secara berulang.

## 2.4 Platform dan Basis Data
Sistem dikembangkan sebagai aplikasi web yang responsif, sehingga dapat digunakan pada layar desktop, tablet, dan ponsel. Basis data yang digunakan adalah PostgreSQL 16.

PostgreSQL dipilih karena mendukung transaksi yang konsisten untuk data pembayaran dan stok, pencegahan alokasi satu unit barang pada dua penyewaan dengan periode yang bertumpang tindih langsung di tingkat basis data, penyimpanan spesifikasi variasi barang yang beragam, serta pengolahan data laporan berdasarkan periode harian dan bulanan. Rancangan tabel dan relasi dijelaskan pada `DATABASE-DESIGN.md`.

# 3. Target Pengguna

## 3.1 Admin
Admin merupakan pengguna yang bertanggung jawab terhadap pengelolaan kegiatan operasional melalui sistem.

Kebutuhan Admin meliputi:
- Mengelola data barang, kategori, dan paket penyewaan.
- Memeriksa stok dan ketersediaan barang.
- Mencatat serta mengelola booking pelanggan.
- Mengelola transaksi penyewaan dan penjualan.
- Mencatat pembayaran pelanggan.
- Mengelola proses pengembalian barang.
- Mencatat pengeluaran usaha.
- Mengelola kategori pengeluaran.
- Mengelola data pelanggan.
- Melihat riwayat aktivitas dan transaksi.

## 3.2 Owner
Owner merupakan pemilik usaha yang menggunakan sistem untuk memantau kegiatan operasional dan memperoleh informasi usaha.

Kebutuhan Owner meliputi:
- Melihat ringkasan aktivitas usaha melalui dashboard.
- Memantau booking dan transaksi.
- Melihat data barang, kategori, paket, stok, dan ketersediaan.
- Melihat data pelanggan dan riwayat penyewaan.
- Memantau pengeluaran usaha.
- Melihat laporan keuangan, penyewaan, penjualan, stok, dan pelanggan.
- Melihat riwayat aktivitas pengguna.
- Mengelola akun pengguna dan hak akses.
- Mencatat dan mengelola pengeluaran beserta kategori pengeluaran, sama seperti Admin.
- Mengelola Paket Penyewaan, sama seperti Admin.

## 3.3 Pengguna di Luar Sistem
Pelanggan merupakan pihak yang melakukan pemesanan, pembayaran, pengambilan, dan pengembalian perlengkapan. Pelanggan tidak menggunakan aplikasi secara langsung. Seluruh informasi pelanggan dan aktivitas penyewaannya dicatat serta dikelola oleh Admin melalui sistem.

Staf persiapan dan staf cuci terlibat dalam proses operasional barang, tetapi tidak menjadi pengguna utama sistem berdasarkan ruang lingkup pengembangan saat ini.


# 4. Ruang Lingkup Produk

## 4.1 Fitur yang Termasuk dalam Pengembangan
Sistem mencakup beberapa fitur utama berikut:

### A. Autentikasi dan Manajemen Pengguna
- Login dan logout.
- Pengelolaan akun pengguna.
- Pembagian hak akses berdasarkan peran Admin dan Owner.
- Pengelolaan pengguna oleh Owner.
- Pengaturan hak akses khusus bagi pengguna tertentu apabila diperlukan, misalnya akses laporan.
- Profil Akun untuk mengubah informasi profil dan password.

### B. Dashboard
- Menampilkan ringkasan informasi usaha.
- Menampilkan informasi transaksi, pendapatan, dan pengeluaran.
- Menampilkan informasi booking dan penyewaan aktif.
- Menampilkan ringkasan stok dan kondisi barang.
- Menyediakan informasi pendukung pemantauan usaha.

### C. Pengelolaan Data Barang
- Menambah, mengubah, dan menghapus data barang.
- Mengelola kategori barang.
- Mengelola informasi harga sewa dan harga jual sesuai jenis barang.
- Mengelola jumlah stok dan kondisi barang.
- Mengelola data paket penyewaan beserta komponen barangnya.
- Menyediakan riwayat perubahan data dan stok.
- Mengelola variasi barang berdasarkan spesifikasi (merek, ukuran, kapasitas, jenis), termasuk spesifikasi lain yang dapat ditambahkan (maksimal tiga) dan harga sewa untuk setiap variasi.
- Mengelola unit fisik Barang Sewa dengan kode unik yang dibuat otomatis.
- Mengunggah dan menampilkan foto produk.
- Menampilkan Paket Penyewaan dalam bentuk kartu, yang dapat dikelola oleh Admin maupun Owner.

### D. Pengelolaan Booking
- Mencatat booking pelanggan yang dilakukan melalui WhatsApp atau secara langsung.
- Mengelola informasi pelanggan dan barang yang dipesan.
- Memeriksa ketersediaan barang berdasarkan tanggal penyewaan.
- Mengelola status booking.
- Mengelola informasi DP dan pengambilan barang.
- Menyediakan pencarian dan detail booking.
- Memisahkan pilihan barang satuan dan Paket Penyewaan dalam tab katalog dengan keranjang yang digunakan bersama.
- Mencatat pembatalan booking beserta alasan, dan mencatat DP yang hangus apabila ada.

### E. Transaksi Penyewaan
- Membuat transaksi berdasarkan booking yang telah dikonfirmasi atau penyewaan langsung.
- Mengelola data pelanggan dan barang yang disewa.
- Mendukung penyewaan barang satuan maupun paket.
- Menghitung total biaya berdasarkan harga, jumlah, dan durasi penyewaan.
- Mencatat informasi tanggal penyewaan dan pengembalian.
- Mengelola informasi pembayaran dan jaminan.
- Menyediakan kode dan detail transaksi.
- Menyimpan riwayat transaksi.
- Memisahkan pilihan barang satuan dan Paket Penyewaan dalam tab katalog dengan keranjang yang digunakan bersama.
- Menampilkan halaman Pelunasan Berhasil setelah pembayaran sisa tagihan dicatat.
- Menyediakan fitur Cetak Bukti/Struk pada detail transaksi dan halaman transaksi berhasil.

### F. Transaksi Penjualan
- Mencatat transaksi penjualan barang.
- Mengelola informasi barang yang dijual dan jumlah pembelian.
- Menghitung total transaksi penjualan.
- Mencatat pembayaran pelanggan.
- Memperbarui stok barang setelah transaksi penjualan.
- Menampilkan detail transaksi penjualan.
- Menyediakan fitur Cetak Bukti/Struk pada detail transaksi dan halaman transaksi berhasil.

### G. Pencatatan Pembayaran
- Mencatat pembayaran DP dan pelunasan.
- Mencatat pembayaran secara bertahap.
- Mendukung metode pembayaran tunai, QRIS, dan transfer.
- Menghitung sisa tagihan secara otomatis.
- Menampilkan status pembayaran.
- Menyimpan riwayat pembayaran pada transaksi terkait.

Pencatatan pembayaran dilakukan berdasarkan uang yang benar-benar diterima oleh pihak toko. Sistem berfungsi sebagai media pencatatan dan tidak memproses atau mengirimkan uang secara langsung.

### H. Pengelolaan Pengembalian
- Menampilkan transaksi yang memiliki jadwal pengembalian.
- Mencatat tanggal dan waktu pengembalian aktual.
- Mencatat jumlah serta kondisi barang yang dikembalikan.
- Mendukung pengembalian barang secara bertahap.
- Mencatat barang rusak, hilang, atau tidak lengkap.
- Mencatat denda keterlambatan dan biaya tambahan apabila berlaku.
- Memperbarui status barang setelah pengembalian.
- Mengelola barang yang perlu melalui proses pencucian, persiapan, atau perawatan.
- Mencatat pengembalian jaminan pelanggan setelah pemeriksaan barang dan kewajiban pembayaran selesai.

### I. Pengelolaan Stok dan Ketersediaan
- Menampilkan jumlah stok barang.
- Menampilkan kondisi dan status operasional barang.
- Memantau ketersediaan barang berdasarkan jadwal penyewaan.
- Mengelola alokasi barang untuk booking dan transaksi penyewaan.
- Menampilkan informasi barang yang sedang disewa, dibooking, dicuci, dipersiapkan, rusak, atau dalam perawatan.
- Menyimpan riwayat perubahan stok.
- Menyediakan Detail Unit untuk melihat, mencari, dan mengubah kondisi setiap unit Barang Sewa beserta riwayat perubahannya.

### J. Data Pelanggan
- Menambah dan mengelola data pelanggan.
- Menyimpan informasi identitas dan kontak pelanggan.
- Menampilkan detail pelanggan.
- Menampilkan riwayat booking dan transaksi penyewaan pelanggan.

### K. Pengeluaran
- Mencatat pengeluaran usaha.
- Mengelola informasi nominal, tanggal, dan keterangan pengeluaran.
- Menampilkan riwayat pengeluaran.
- Mengelompokkan pengeluaran berdasarkan kategori dan mencatat status sudah atau belum dibayar.
- Mengelola kategori pengeluaran (tambah, ubah, aktifkan atau nonaktifkan, dan hapus dengan fitur pembatalan) oleh Admin maupun Owner.

### L. Laporan
Sistem menyediakan laporan untuk membantu Owner memantau kondisi dan aktivitas usaha, meliputi:
- Laporan keuangan.
- Laporan penyewaan.
- Laporan penjualan.
- Laporan stok.
- Laporan pelanggan.
- Penyaringan laporan berdasarkan periode Harian dan Bulanan.
- Cetak laporan (keluaran kertas) dan unduh laporan (berkas PDF, Excel, atau CSV).

Laporan dapat digunakan untuk melihat informasi transaksi, pembayaran, pengeluaran, aktivitas penyewaan, kondisi stok, dan riwayat pelanggan sesuai data yang tercatat di sistem.

### M. Riwayat Aktivitas
- Menyimpan riwayat aktivitas pengguna.
- Menampilkan informasi aktivitas yang dilakukan.
- Menyediakan informasi waktu dan pengguna yang melakukan aktivitas.
- Membantu penelusuran perubahan data dalam sistem.

## 4.2 Batasan Produk
Untuk menjaga ruang lingkup pengembangan, sistem memiliki batasan sebagai berikut:
1. Sistem digunakan secara internal oleh Admin dan Owner 19 Summit Adventure.
2. Pelanggan tidak melakukan pemesanan secara mandiri melalui sistem.
3. Pemesanan tetap dilakukan melalui WhatsApp atau secara langsung di toko.
4. Sistem berfungsi sebagai media pencatatan dan pengelolaan pembayaran, bukan sebagai penyedia layanan pembayaran atau payment gateway.
5. Sistem tidak menggantikan proses fisik seperti pencucian, pengeringan, pemeriksaan, dan persiapan barang.
6. Informasi kondisi barang perlu diperbarui oleh pengguna berdasarkan kondisi aktual di toko.
7. Laporan yang dihasilkan bergantung pada kelengkapan dan ketepatan data yang dimasukkan ke sistem.


# 5. Alur Utama Produk

## 5.1 Alur Booking hingga Penyewaan
1. Pelanggan menghubungi 19 Summit Adventure melalui WhatsApp atau datang langsung ke toko.
2. Admin menerima informasi kebutuhan penyewaan pelanggan.
3. Admin memeriksa ketersediaan barang berdasarkan tanggal penyewaan.
4. Admin mencatat booking ke dalam sistem.
5. Sistem menyimpan informasi booking dan statusnya.
6. Admin mengelola persiapan barang sesuai jadwal pengambilan.
7. Ketika pelanggan datang, Admin memproses pengambilan barang dan membuat transaksi penyewaan berdasarkan booking.
8. Sistem menghubungkan data booking dengan transaksi sehingga informasi yang sudah dicatat tidak perlu dimasukkan kembali.
9. Admin mencatat pembayaran yang diterima.
10. Barang diserahkan kepada pelanggan dan status penyewaan diperbarui.

Untuk pelanggan yang datang langsung tanpa booking, Admin dapat membuat transaksi penyewaan secara langsung melalui sistem.

Untuk booking yang memerlukan DP, Admin mencatat penerimaan DP pada booking. DP tersebut otomatis diperhitungkan pada transaksi penyewaan tanpa dicatat ulang.

## 5.2 Alur Pengembalian Barang
1. Pelanggan datang untuk mengembalikan barang.
2. Admin mencari transaksi penyewaan pelanggan.
3. Admin mencocokkan barang yang dikembalikan dengan data transaksi.
4. Admin mencatat jumlah dan kondisi barang.
5. Jika terdapat keterlambatan, kerusakan, kehilangan, atau kekurangan barang, Admin dapat mencatat biaya tambahan sesuai ketentuan usaha.
6. Sistem memperbarui informasi pengembalian dan status transaksi.
7. Barang yang dikembalikan diarahkan ke proses pencucian, persiapan, atau perawatan sesuai kondisinya.
8. Barang baru dapat dianggap tersedia kembali setelah status operasionalnya diperbarui sesuai kondisi aktual.

## 5.3 Alur Pemantauan oleh Owner
1. Owner login ke sistem menggunakan akun yang memiliki hak akses Owner.
2. Sistem menampilkan dashboard berisi ringkasan informasi usaha.
3. Owner dapat memantau booking, transaksi, data barang, stok, pelanggan, dan pengeluaran.
4. Owner dapat membuka laporan sesuai kategori yang tersedia.
5. Owner dapat menggunakan informasi tersebut untuk mengevaluasi kegiatan operasional dan kondisi usaha.

## 5.4 Alur Pelunasan dan Cetak Bukti/Struk
1. Admin membuka detail transaksi penyewaan yang belum lunas.
2. Admin mencatat pembayaran yang diterima beserta nominal dan metode pembayaran.
3. Sistem menghitung ulang sisa tagihan. Apabila sisa tagihan menjadi nol, status pembayaran berubah menjadi Lunas dan sistem menampilkan halaman Pelunasan Berhasil.
4. Dari halaman tersebut, Admin dapat mencetak bukti/struk, melihat detail transaksi, atau kembali ke menu Transaksi Penyewaan.
5. Pada popup Cetak Bukti/Struk, Admin memilih ukuran kertas (58 mm, 80 mm, atau A4), informasi yang ditampilkan, dan jumlah salinan, lalu mencetak atau mengunduhnya sebagai PDF.

# 6. Aturan Bisnis Utama
Aturan bisnis berikut menjadi acuan dalam pengembangan sistem:
1. Booking H-2 atau lebih awal mewajibkan pembayaran DP sebesar 25% dari total biaya penyewaan.
2. Booking H-1 tidak diwajibkan membayar DP.
3. Pelunasan dilakukan ketika pelanggan mengambil barang.
4. Berdasarkan ketentuan usaha yang tercatat, booking tidak dapat dibatalkan; apabila dibatalkan, DP yang telah dibayarkan hangus.
5. Pembayaran yang dicatat sistem harus sesuai dengan uang yang benar-benar diterima oleh pihak toko.
6. Metode pembayaran yang digunakan meliputi tunai, QRIS, dan transfer.
7. Transaksi penyewaan dapat berasal dari booking atau penyewaan langsung.
8. Penyewaan dapat dilakukan berdasarkan barang satuan maupun paket.
9. Barang yang sedang dibooking atau disewa harus diperhitungkan dalam pemeriksaan ketersediaan berdasarkan periode penyewaan.
10. Barang yang sedang dicuci, dipersiapkan, rusak, atau dalam perawatan tidak boleh dianggap siap disewakan.
11. Barang yang telah dikembalikan tidak otomatis tersedia kembali sebelum kondisi dan status operasionalnya diperbarui.
12. Informasi pembayaran, pengembalian, dan perubahan data harus terhubung dengan transaksi yang bersangkutan.
13. Hak akses Admin dan Owner dibedakan sesuai tanggung jawab masing-masing.
14. DP yang dibayarkan pada booking otomatis diperhitungkan pada transaksi penyewaan tanpa dicatat ulang.
15. DP yang hangus akibat pembatalan booking dicatat sebagai penerimaan terkait booking dan ditampilkan terpisah dari pendapatan penyewaan.
16. Denda keterlambatan, biaya kerusakan, dan biaya kehilangan diinput manual oleh Admin beserta alasannya, dan dilaporkan terpisah dari pendapatan penyewaan.
17. Jam operasional toko adalah pukul 08.00–21.00 WIB. Pengembalian setelah pukul 21.00 WIB atau melewati tanggal pengembalian dianggap terlambat.
18. Satu unit barang tidak boleh dialokasikan pada dua penyewaan yang periodenya bertumpang tindih.
19. Komposisi dan harga Paket Penyewaan pada booking atau transaksi disimpan sehingga perubahan paket tidak mengubah catatan sebelumnya.
20. Penjualan tidak boleh melebihi jumlah stok yang tersedia.


# 7. Struktur Menu Sistem

## 7.1 Menu Admin
| No. | Menu | Submenu/Keterangan |
|---|---|---|
| 1 | Dashboard | Ringkasan aktivitas operasional |
| 2 | Booking | Pengelolaan booking pelanggan |
| 3 | Transaksi | Transaksi Penyewaan dan Transaksi Penjualan |
| 4 | Data Barang | Semua Barang, Kategori Barang, Paket Penyewaan |
| 5 | Stok dan Ketersediaan | Pemantauan stok dan ketersediaan barang |
| 6 | Data Pelanggan | Pengelolaan data pelanggan |
| 7 | Pengembalian | Pengelolaan pengembalian barang |
| 8 | Pengeluaran | Pencatatan pengeluaran usaha dan Kelola Kategori |
| 9 | Riwayat Aktivitas | Riwayat aktivitas pengguna |
| 10 | Profil Akun | Informasi akun pengguna |

## 7.2 Menu Owner
| No. | Menu | Submenu/Keterangan |
|---|---|---|
| 1 | Dashboard | Ringkasan informasi usaha |
| 2 | Monitoring Booking | Pemantauan booking |
| 3 | Monitoring Transaksi | Transaksi Penyewaan dan Transaksi Penjualan |
| 4 | Data Barang | Semua Barang, Kategori Barang, Paket Penyewaan |
| 5 | Stok dan Ketersediaan | Pemantauan stok dan kondisi barang |
| 6 | Data Pelanggan | Informasi dan riwayat pelanggan |
| 7 | Pengeluaran | Pencatatan, pemantauan, dan Kelola Kategori pengeluaran |
| 8 | Laporan | Keuangan, Penyewaan, Penjualan, Stok, Pelanggan (periode harian atau bulanan, cetak, dan unduh) |
| 9 | Riwayat Aktivitas | Riwayat aktivitas pengguna |
| 10 | Kelola Pengguna | Daftar Pengguna dan Hak Akses |
| 11 | Profil Akun | Informasi akun Owner |


# 8. Indikator Keberhasilan Produk

Keberhasilan pengembangan sistem dapat dinilai melalui beberapa indikator berikut:
1. Admin dapat mengelola data barang, booking, transaksi, pembayaran, dan pengembalian melalui satu sistem.
2. Informasi ketersediaan barang dapat diperiksa berdasarkan tanggal penyewaan.
3. Data booking dapat digunakan untuk membuat transaksi tanpa menginput ulang seluruh informasi.
4. Riwayat pembayaran dan pengembalian dapat ditelusuri berdasarkan transaksi.
5. Owner dapat memantau aktivitas usaha melalui dashboard dan laporan.
6. Informasi stok dan kondisi barang dapat diperbarui secara terstruktur.
7. Pencatatan dan rekapitulasi data operasional menjadi lebih terpusat dibandingkan proses sebelumnya.


# 9. Dokumen Pendukung Pengembangan
PRD ini menjadi dokumen utama yang terhubung dengan dokumen pengembangan lainnya. Setiap dokumen memiliki fungsi yang berbeda agar kebutuhan produk dan kebutuhan teknis dapat dikelola secara lebih terstruktur.

| Nama Dokumen | Fungsi |
|---|---|
| `KEBUTUHAN-FUNGSIONAL.md` | Menjelaskan kebutuhan dan perilaku setiap fitur sistem secara terperinci. |
| `KEBUTUHAN-NON-FUNGSIONAL.md` | Menjelaskan persyaratan keamanan, kinerja, kemudahan penggunaan, responsivitas, dan keandalan sistem. |
| `SRS.md` | Menjelaskan spesifikasi kebutuhan perangkat lunak secara terstruktur. |
| `DATABASE-DESIGN.md` | Menjelaskan rancangan tabel, atribut, relasi, dan struktur basis data. |
| `schema.sql` | Skrip pembuatan tabel, relasi, dan aturan basis data PostgreSQL sesuai `DATABASE-DESIGN.md`. |
| `ACTIVITY-DIAGRAM.md` | Menjelaskan alur aktivitas setiap proses bisnis dalam sistem. |

Dokumen-dokumen tersebut harus saling konsisten dan mengacu pada ruang lingkup produk yang telah ditentukan dalam PRD ini.


# 10. Penutup
Sistem Informasi Penyewaan Perlengkapan Kemah Berbasis Web dikembangkan untuk membantu 19 Summit Adventure dalam mengelola kegiatan operasional secara lebih terpusat dan terstruktur.

Melalui sistem ini, pengelolaan barang, booking, transaksi penyewaan, transaksi penjualan, pembayaran, pengembalian, pelanggan, pengeluaran, dan laporan diharapkan dapat dilakukan dengan lebih praktis. Selain itu, sistem diharapkan dapat membantu Owner memperoleh informasi yang dibutuhkan untuk memantau kegiatan usaha dan mendukung pengambilan keputusan.

Dokumen PRD ini menjadi acuan utama dalam pengembangan produk, sedangkan rincian kebutuhan setiap fitur dan aspek teknis dijelaskan lebih lanjut pada dokumen pendukung.