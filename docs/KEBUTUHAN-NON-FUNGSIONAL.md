# Kebutuhan Non-Fungsional Sistem
## Sistem Informasi Penyewaan Perlengkapan Kemah Berbasis Web – 19 Summit Adventure

| Atribut | Keterangan |
|---|---|
| Versi | 1.0 |
| Tanggal | 23 November 2026 |
| Acuan | `PRD.md`, `SRS.md` (bab 7), `KEBUTUHAN-FUNGSIONAL.md`, `DATABASE-DESIGN.md` |

Dokumen ini menjelaskan persyaratan mutu sistem: keamanan, kinerja, kemudahan penggunaan, responsivitas, keandalan, integritas data, dan lainnya. ID kebutuhan (NFR-xxx) sama dengan yang dipakai pada `SRS.md` bab 7. Dokumen ini memperinci dan menambahkannya.

**Prioritas:** T = Tinggi (wajib sebelum sistem dipakai), S = Sedang, R = Rendah.
**Cara verifikasi:** U = uji fungsional atau otomatis, I = inspeksi desain atau kode, D = demonstrasi, A = analisis atau pengukuran, K = konfigurasi dan pemeriksaan lingkungan.

> **Catatan:** angka target pada dokumen ini (waktu, jumlah pengguna, durasi sesi, retensi cadangan, dan sejenisnya) adalah usulan awal yang disusun dari skala usaha toko penyewaan. Angka tersebut perlu disahkan pemilik usaha, dan dapat disesuaikan setelah sistem diuji di lingkungan toko.

---

## 1. Keamanan

### 1.1 Autentikasi dan Sesi
| ID | Kebutuhan | Prior. | Verif. |
|---|---|---|---|
| NFR-SEC-01 | Password disimpan sebagai hash dengan algoritme yang kuat dan berkonfigurasi biaya (Argon2id atau bcrypt) beserta salt. Password asli tidak pernah disimpan, dicatat di log, atau dikirim ulang. | T | I |
| NFR-SEC-02 | Seluruh lalu lintas antara peramban dan server memakai HTTPS (TLS 1.2 atau lebih baru). Permintaan HTTP dialihkan ke HTTPS. | T | K |
| NFR-SEC-03 | Hak akses diperiksa di server pada setiap permintaan (halaman, aksi, dan pengunduhan berkas), tidak cukup dengan menyembunyikan menu. | T | U |
| NFR-SEC-04 | Sesi berakhir otomatis setelah tidak aktif 30 menit dan dibatalkan saat logout. Token sesi disimpan pada cookie `HttpOnly`, `Secure`, dan `SameSite`. | T | U, I |
| NFR-SEC-05 | Sistem terlindungi dari injeksi SQL (kueri berparameter atau ORM), XSS (keluaran di-escape), dan CSRF (token atau SameSite). | T | I, U |
| NFR-SEC-06 | Percobaan login gagal berulang dibatasi (usulan: 5 kali dalam 15 menit, lalu ditunda sementara). | T | U |
| NFR-SEC-07 | Riwayat aktivitas tidak dapat diubah atau dihapus, dijaga sampai tingkat basis data (trigger penolak `UPDATE` dan `DELETE`). | T | U |
| NFR-SEC-08 | Akun yang dinonaktifkan tidak dapat masuk, dan sesi aktifnya dihentikan. | T | U |
| NFR-SEC-09 | Password baru minimal 8 karakter. Perubahan password mewajibkan password lama. Reset oleh Owner menghasilkan password sementara yang wajib diganti pada login berikutnya. | T | U |
| NFR-SEC-10 | Pesan gagal login tidak menyebutkan apakah username atau password yang salah. | S | U |
| NFR-SEC-11 | Rahasia konfigurasi (kata sandi basis data, kunci sesi) disimpan pada variabel lingkungan, bukan di kode atau repositori. | T | I |

### 1.2 Otorisasi
| ID | Kebutuhan | Prior. | Verif. |
|---|---|---|---|
| NFR-SEC-12 | Peran Admin dan Owner dibedakan sesuai PRD bab 7 dan SRS lampiran 10.1. Laporan dan Kelola Pengguna hanya untuk Owner, atau pengguna dengan izin khusus yang diberikan Owner. | T | U |
| NFR-SEC-13 | Owner memantau transaksi tanpa dapat mengubah data operasional lewat menu Monitoring. | T | U |
| NFR-SEC-14 | Penghapusan data penting (booking Draft, data dengan transaksi terkait) mewajibkan alasan dan dicatat pada Riwayat Aktivitas. | T | U |
| NFR-SEC-15 | Pengguna hanya dapat mengelola profil akunnya sendiri. | T | U |

### 1.3 Perlindungan Data Pribadi
| ID | Kebutuhan | Prior. | Verif. |
|---|---|---|---|
| NFR-SEC-16 | Data pelanggan (nama, telepon, alamat) dan jenis jaminan hanya diakses pengguna berhak dan digunakan untuk keperluan operasional toko. Pengelolaannya mengacu pada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi. | T | I |
| NFR-SEC-17 | Sistem hanya menyimpan jenis dan nomor jaminan yang diperlukan. Foto atau salinan identitas tidak disimpan kecuali diputuskan lain. | S | I |
| NFR-SEC-18 | Hasil ekspor (CSV, Excel, PDF) tidak memuat data yang tidak diperlukan laporan tersebut. | S | I |
| NFR-SEC-19 | Log aplikasi tidak memuat password, token sesi, atau data pribadi lengkap. | T | I |

---

## 2. Kinerja

Ukuran: koneksi internet toko normal, data hingga ±50.000 baris transaksi dan ±5.000 unit barang, beban normal pada satu server kecil.

| ID | Kebutuhan | Prior. | Verif. |
|---|---|---|---|
| NFR-PRF-01 | Halaman utama dan halaman daftar termuat dalam 3 detik. | T | A |
| NFR-PRF-02 | Pencarian, penyaringan, dan pengecekan ketersediaan menampilkan hasil dalam 2 detik. | T | A |
| NFR-PRF-03 | Laporan periode bulanan tampil dalam 5 detik, dan laporan harian dalam 3 detik. | T | A |
| NFR-PRF-04 | Sistem melayani minimal 10 pengguna bersamaan tanpa penurunan kinerja yang berarti. | T | A |
| NFR-PRF-05 | Daftar besar memakai penomoran halaman. Tidak ada halaman yang memuat seluruh data sekaligus. | T | I |
| NFR-PRF-06 | Kolom yang sering dicari dan difilter diberi indeks (kode, nama, tanggal, status, kategori) sebagaimana pada `schema.sql`. | T | I |
| NFR-PRF-07 | Penyimpanan transaksi (booking, sewa, penjualan, pembayaran) selesai dalam 2 detik. | T | A |
| NFR-PRF-08 | Pembuatan berkas unduhan (PDF, Excel, CSV) laporan bulanan selesai dalam 10 detik. Untuk data lebih besar, sistem menampilkan indikator proses. | S | A |
| NFR-PRF-09 | Foto produk dikompresi atau diubah ukurannya saat diunggah (usulan maksimal 2 MB per foto, tampilan daftar memakai versi kecil). | S | I |

---

## 3. Kemudahan Penggunaan

| ID | Kebutuhan | Prior. | Verif. |
|---|---|---|---|
| NFR-USA-01 | Antarmuka berbahasa Indonesia dengan istilah yang sama dengan operasional toko (booking, DP, pelunasan, jaminan, unit). | T | D |
| NFR-USA-02 | Alur utama (booking, transaksi sewa, pembayaran, pengembalian, penjualan) dapat diselesaikan Admin baru setelah pelatihan singkat (usulan maksimal 1 jam) tanpa bantuan terus-menerus. | T | D |
| NFR-USA-03 | Pesan kesalahan menjelaskan penyebab dan cara memperbaikinya, ditampilkan di dekat isian yang salah. | T | U |
| NFR-USA-04 | Tindakan penting (hapus, batal, ubah kondisi) meminta konfirmasi atau alasan. Tindakan yang ringan dan mudah dipulihkan menyediakan pembatalan (undo), misalnya hapus kategori pengeluaran. | T | D |
| NFR-USA-05 | Status ditampilkan dengan teks di samping warna. Tabel status mudah dibaca tanpa bergantung pada warna. | T | I |
| NFR-USA-06 | Formulir popup (kategori, pembayaran, biaya, hak akses, cetak, unduh) tampil di tengah layar dengan latar diredupkan. Dapat ditutup dengan tombol Batal, tombol tutup, atau klik di luar popup. | S | D |
| NFR-USA-07 | Isian yang bisa dihitung otomatis (total, sisa tagihan, DP, kembalian, kode) terisi sistem dan tidak diketik ulang. | T | D |
| NFR-USA-08 | Pada operasi berantai (booking menjadi transaksi, DP menjadi pembayaran transaksi), data tidak diminta ulang. | T | D |
| NFR-USA-09 | Setiap halaman daftar punya pencarian dan filter yang relevan. Hasil kosong menampilkan keterangan, bukan halaman kosong. | S | D |
| NFR-USA-10 | Tombol aksi utama dan sekunder konsisten antarhalaman (misalnya Simpan di kanan, Batal di kiri, Cetak dan Unduh berbeda jelas fungsinya dan dilengkapi keterangan singkat). | S | I |

---

## 4. Responsivitas dan Kompatibilitas

| ID | Kebutuhan | Prior. | Verif. |
|---|---|---|---|
| NFR-RSP-01 | Seluruh halaman dapat dipakai pada tiga kelas layar: desktop (lebar sekitar 1440 px), tablet (sekitar 834 px), dan ponsel (sekitar 390 px) tanpa terpotong atau perlu menggulir ke samping untuk fungsi utama. | T | U, D |
| NFR-RSP-02 | Kompatibel dengan versi terbaru Chrome, Edge, Firefox, dan Safari (termasuk iOS Safari dan Chrome Android). | T | U |
| NFR-RSP-03 | Popup tidak terpotong pada layar kecil, dapat digulir, dan tombol aksinya tetap terjangkau. | T | U |
| NFR-RSP-04 | Pada ponsel, tombol aksi utama berukuran nyaman disentuh (tinggi minimal sekitar 44 px). | S | I |
| NFR-RSP-05 | Tabel lebar pada layar kecil dapat digulir mendatar atau ditampilkan sebagai daftar kartu. | S | D |
| NFR-RSP-06 | Cetak bukti dan laporan menghasilkan tata letak yang sesuai ukuran kertas terpilih (58 mm, 80 mm, A4, Letter) dan orientasinya. | T | U |

---

## 5. Keandalan dan Ketersediaan

| ID | Kebutuhan | Prior. | Verif. |
|---|---|---|---|
| NFR-REL-01 | Operasi yang mengubah beberapa data sekaligus (pembayaran dan status, stok dan riwayat, kondisi unit dan riwayatnya) dijalankan dalam satu transaksi basis data, berhasil seluruhnya atau dibatalkan seluruhnya. | T | U |
| NFR-REL-02 | Basis data mencegah satu unit dialokasikan pada dua penyewaan yang periodenya bertumpang tindih, termasuk saat dua pengguna menyimpan bersamaan. | T | U |
| NFR-REL-03 | Basis data dicadangkan otomatis minimal harian dan disimpan di lokasi terpisah dari server (usulan retensi 30 hari). | T | K |
| NFR-REL-04 | Ketersediaan sistem pada jam operasional toko (08.00–21.00 WIB) mencapai 99%. Pemeliharaan terencana dilakukan di luar jam operasional. | S | A |
| NFR-REL-05 | Nilai uang disimpan sebagai bilangan bulat Rupiah, tanpa bilangan pecahan (hindari kesalahan pembulatan). | T | I |
| NFR-REL-06 | Saat terjadi kesalahan, sistem menampilkan pesan yang ramah dan tidak memperlihatkan detail teknis kepada pengguna. Detail dicatat di log server. | T | I |
| NFR-REL-07 | Penyimpanan ganda akibat klik berulang atau koneksi lambat dicegah (misalnya tombol Simpan dinonaktifkan selama proses dan pemeriksaan duplikat). | T | U |
| NFR-REL-08 | Kode otomatis (booking, transaksi, pelanggan, paket, unit) bersifat unik dan tidak digunakan ulang, walaupun ada penyimpanan yang dibatalkan. | T | U |
| NFR-REL-09 | Prosedur pemulihan dari cadangan terdokumentasi dan diuji minimal sekali sebelum sistem dipakai (usulan target pemulihan di bawah 4 jam, kehilangan data maksimal 24 jam). | T | D |

---

## 6. Integritas dan Kualitas Data

| ID | Kebutuhan | Prior. | Verif. |
|---|---|---|---|
| NFR-DAT-01 | Aturan bisnis kritis dijaga di basis data selain di aplikasi: kunci asing, nilai tidak negatif, keunikan kode, status dan jenis yang valid (enum atau `CHECK`), dan batas 3 spesifikasi lain. | T | I, U |
| NFR-DAT-02 | Data pelanggan tidak ganda (nomor telepon unik). | T | U |
| NFR-DAT-03 | Total dibayar dan status pembayaran selalu sesuai jumlah pembayaran tercatat (dihitung ulang otomatis). | T | U |
| NFR-DAT-04 | Ringkasan stok per kondisi selalu sama dengan data unit individual (dihitung dari unit, bukan angka terpisah yang bisa selisih). | T | U |
| NFR-DAT-05 | Komposisi dan harga paket serta nama barang pada booking dan transaksi disimpan sebagai snapshot. Perubahan master data tidak mengubah catatan lama. | T | U |
| NFR-DAT-06 | Data transaksi dan riwayat tidak dihapus permanen dari basis data. Penghapusan di tampilan memakai penghapusan lunak. | T | I |
| NFR-DAT-07 | Waktu disimpan dengan zona waktu (timestamptz) dan ditampilkan dalam WIB. Tanggal periode laporan mengikuti WIB. | T | U |
| NFR-DAT-08 | Angka laporan konsisten dengan data sumber. Total pada ringkasan sama dengan jumlah baris rincian yang sama periodenya. | T | U |
| NFR-DAT-09 | Laporan membedakan tagihan dan uang yang benar-benar diterima, serta memisahkan penerimaan tambahan dari pendapatan penyewaan. | T | U |

---

## 7. Audit dan Keterlacakan

| ID | Kebutuhan | Prior. | Verif. |
|---|---|---|---|
| NFR-AUD-01 | Sistem mencatat login, logout, tambah, ubah, hapus, pembatalan, dan perubahan status penting. | T | U |
| NFR-AUD-02 | Setiap catatan memuat pengguna, waktu, jenis aktivitas, objek terkait, serta data sebelum dan sesudah perubahan. | T | U |
| NFR-AUD-03 | Riwayat pembayaran, pengembalian, biaya tambahan, kondisi unit, dan stok tersimpan beserta pengguna pencatatnya. | T | U |
| NFR-AUD-04 | Riwayat tetap tersedia meskipun data operasional dihapus dari tampilan. | T | U |
| NFR-AUD-05 | Pencatatan aktivitas tidak boleh menggagalkan operasi utama tanpa terdeteksi. Kegagalan pencatatan ditangani sebagai kesalahan dan dibatalkan bersama operasinya bila terkait perubahan data. | S | I |

---

## 8. Pemeliharaan dan Pengembangan

| ID | Kebutuhan | Prior. | Verif. |
|---|---|---|---|
| NFR-MNT-01 | Skema basis data dikelola melalui migrasi berversi, dengan `schema.sql` sebagai migrasi awal. | T | I |
| NFR-MNT-02 | Parameter bisnis (persentase DP, batas hari DP, jam operasional) disimpan pada tabel `pengaturan`, sehingga dapat diubah tanpa mengubah kode. | S | I |
| NFR-MNT-03 | Dokumentasi PRD, SRS, kebutuhan fungsional dan non-fungsional, desain basis data, dan diagram aktivitas dijaga konsisten. Perubahan fitur memperbarui dokumen terkait. | S | I |
| NFR-MNT-04 | Kode disusun modular per domain (barang, booking, transaksi, pembayaran, pengembalian, laporan) dengan komponen antarmuka yang dapat dipakai ulang (misalnya popup struk, filter periode, popup cetak dan unduh). | S | I |
| NFR-MNT-05 | Logika bisnis kritis (hitung DP, status pembayaran, ketersediaan, status penyewaan) memiliki pengujian otomatis. | S | U |
| NFR-MNT-06 | Log aplikasi dan kesalahan tersedia bagi pengembang untuk penelusuran masalah. | S | K |
| NFR-MNT-07 | Dependensi dijaga mutakhir untuk perbaikan keamanan. | S | K |

---

## 9. Skalabilitas dan Lingkungan

| ID | Kebutuhan | Prior. | Verif. |
|---|---|---|---|
| NFR-SCL-01 | Rancangan mendukung pertumbuhan data hingga beberapa tahun transaksi (±100.000 baris) tanpa perubahan arsitektur, cukup dengan indeks dan penataan kueri. | S | A |
| NFR-SCL-02 | Aplikasi dapat dijalankan pada satu server kecil (aplikasi dan PostgreSQL 16), dan dapat dipindah ke layanan terkelola tanpa mengubah kode. | S | K |
| NFR-SCL-03 | Berkas foto produk disimpan di luar basis data (berkas atau penyimpanan objek) dan hanya alamatnya yang disimpan di basis data. | S | I |
| NFR-SCL-04 | Konfigurasi lingkungan (pengembangan, uji, produksi) dipisahkan. | S | K |

---

## 10. Aksesibilitas dan Lokalisasi

| ID | Kebutuhan | Prior. | Verif. |
|---|---|---|---|
| NFR-ACC-01 | Isian formulir memiliki label yang terhubung, urutan tab yang logis, dan dapat dioperasikan dengan papan ketik. | S | I |
| NFR-ACC-02 | Kontras teks dan latar memenuhi keterbacaan yang baik (usulan mengacu pada WCAG 2.1 AA). | S | A |
| NFR-ACC-03 | Ukuran huruf dasar nyaman dibaca (usulan minimal 14 px) dan tampilan tetap utuh saat dibesarkan hingga 200%. | R | I |
| NFR-LOK-01 | Format angka dan uang memakai gaya Indonesia (Rp 1.250.000), tanggal memakai bahasa Indonesia (misalnya 22 Nov 2026), dan zona waktu WIB. | T | U |

---

## 11. Rangkuman Prioritas

| Kelompok | Jumlah kebutuhan | Prioritas Tinggi |
|---|---|---|
| Keamanan (SEC) | 19 | 16 |
| Kinerja (PRF) | 9 | 7 |
| Kemudahan penggunaan (USA) | 10 | 7 |
| Responsivitas (RSP) | 6 | 4 |
| Keandalan (REL) | 9 | 8 |
| Integritas data (DAT) | 9 | 9 |
| Audit (AUD) | 5 | 4 |
| Pemeliharaan (MNT) | 7 | 1 |
| Skalabilitas (SCL) | 4 | 0 |
| Aksesibilitas dan lokalisasi (ACC, LOK) | 4 | 1 |

## 12. Keterlacakan ke Kebutuhan Fungsional

| Kebutuhan non-fungsional | Terkait fitur |
|---|---|
| NFR-SEC-03, 12, 13 | Login dan hak akses (KF A, N), monitoring Owner (KF I) |
| NFR-SEC-07, NFR-AUD | Riwayat aktivitas (KF M) |
| NFR-SEC-14 | Penghapusan booking Draft, pembatalan booking (KF E.17–22) |
| NFR-SEC-16, 17 | Data pelanggan dan jaminan (KF J, F.1) |
| NFR-DAT-03 | Pembayaran dan status pembayaran (KF G) |
| NFR-DAT-05 | Snapshot paket (KF C.27, E.31) |
| NFR-REL-02 | Pencegahan alokasi ganda (KF D.15) |
| NFR-DAT-08, 09 | Laporan keuangan dan lainnya (KF L) |
| NFR-RSP-06, NFR-USA-06, 10 | Cetak bukti/struk, cetak dan unduh laporan (KF F, L) |
| NFR-LOK-01 | Seluruh tampilan uang dan tanggal |

## 13. Hal yang Perlu Disahkan
1. Seluruh angka target pada bab 1, 2, 5, dan 9 (durasi sesi, batas percobaan login, waktu respons, jumlah pengguna bersamaan, retensi cadangan, target pemulihan, ketersediaan).
2. Apakah foto atau salinan identitas jaminan perlu disimpan (saat ini tidak).
3. Lokasi dan metode hosting serta cadangan (server sendiri atau layanan awan).
4. Kebijakan password lanjutan (kedaluwarsa atau autentikasi dua langkah) bila Owner menginginkannya.
