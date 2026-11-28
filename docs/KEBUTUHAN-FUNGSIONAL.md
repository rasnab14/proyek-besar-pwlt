2. Kebutuhan Fungsional Sistem

A. Login dan Logout
1.	Sistem menyediakan halaman login bagi pengguna yang telah memiliki akun.
2.	Sistem menyediakan mekanisme autentikasi menggunakan username/email dan password.
3.	Sistem membedakan hak akses pengguna berdasarkan peran, yaitu Admin dan Owner.
4.	Sistem menampilkan menu dan fitur sesuai dengan hak akses masing-masing pengguna.
5.	Sistem menyediakan fitur logout untuk mengakhiri sesi penggunaan.
6.	Sistem menyediakan fitur perubahan password melalui menu Profil Akun.
7.	Sistem menyediakan mekanisme pembuatan akun Owner pertama oleh pengembang pada saat konfigurasi awal sistem sebelum digunakan oleh perusahaan.

B. Dashboard
1) Dashboard Admin
1.	Sistem menampilkan ringkasan jumlah booking yang perlu diproses (booking berstatus Selesai yang siap dilanjutkan ke Transaksi Penyewaan saat pengambilan barang), serta menampilkan jumlah booking Dibatalkan (termasuk yang dibatalkan karena tidak hadir/mengambil barang) sebagai metrik pemantauan operasional.
2.	Sistem menampilkan jadwal pengambilan barang pada hari berjalan berdasarkan booking yang berstatus Selesai.
3.	Sistem menampilkan jadwal pengembalian barang pada hari berjalan yang bersumber dari menu Pengembalian.
4.	Sistem menampilkan informasi keterlambatan pengembalian dan sisa masa sewa secara real-time yang terintegrasi dengan fitur tracking masa sewa pada menu Pengembalian.
5.	Sistem menampilkan ringkasan kondisi stok barang, seperti tersedia, disewa, dicuci, persiapan, rusak, dan perawatan.
6.	Sistem menampilkan informasi transaksi terbaru.
7.	Sistem menampilkan informasi pengeluaran terbaru.
8.	Sistem menampilkan aktivitas operasional yang perlu ditindaklanjuti, seperti booking yang perlu diproses menjadi transaksi, jadwal pengambilan, pengembalian barang hari ini, dan barang yang belum siap digunakan.

2) Dashboard Owner
1.	Sistem menampilkan ringkasan pendapatan yang telah diterima dari transaksi yang terealisasi dan pembayaran DP.
2.	Sistem menampilkan ringkasan pengeluaran yang telah dicatat.
3.	Sistem menampilkan jumlah transaksi penyewaan dan penjualan yang sedang berjalan maupun selesai.
4.	Sistem menampilkan ringkasan booking aktif (berstatus Selesai) dan transaksi yang sedang berjalan, serta memantau statistik booking Dibatalkan secara terpisah tanpa memperhitungkannya sebagai transaksi penyewaan aktif atau pendapatan sewa yang terealisasi.
5.	Sistem menampilkan informasi barang yang sedang disewa, dikembalikan, rusak, atau dalam proses persiapan.
6.	Sistem menampilkan grafik perbandingan pendapatan dan pengeluaran berdasarkan periode tertentu.
7.	Sistem menampilkan informasi barang yang paling sering disewa.
8.	Sistem menampilkan informasi produk yang paling banyak terjual.
9.	Sistem menampilkan informasi pelanggan berdasarkan jumlah transaksi.
10.	Sistem menampilkan aktivitas terbaru yang dilakukan oleh pengguna sistem.

C. Pengelolaan Data Barang
1.	Sistem menyediakan menu Data Barang untuk mengelola informasi barang yang dimiliki toko.
2.	Sistem menyediakan submenu Semua Barang untuk menampilkan seluruh data barang.
3.	Sistem menyediakan submenu Kategori Barang untuk mengelola kategori barang.
4.	Sistem menyediakan fitur tambah, lihat, ubah, dan hapus data barang sesuai hak akses pengguna.
5.	Sistem menyediakan satu formulir penambahan barang dengan pilihan jenis barang, yaitu Barang Sewa atau Barang Jual.
6.	Sistem menyesuaikan isian formulir berdasarkan jenis barang yang dipilih.
7.	Sistem menyediakan informasi umum barang yang meliputi nama barang, kode barang, kategori, deskripsi, jenis barang, dan informasi spesifikasi barang.
8.	Sistem menyediakan pengelolaan variasi atau spesifikasi barang sesuai karakteristik masing-masing produk, seperti merek, ukuran, kapasitas, jenis, dan karakteristik lainnya.
9.	Sistem memungkinkan satu jenis produk memiliki beberapa variasi berdasarkan spesifikasi yang berbeda. Contohnya, produk Jaket dapat memiliki variasi ukuran S, M, L, XL, dan XXL serta merek yang berbeda.
10.	Sistem menyediakan informasi harga sewa untuk setiap variasi Barang Sewa sehingga perbedaan harga berdasarkan merek, ukuran, kapasitas, atau jenis barang dapat dikelola secara terpisah apabila diperlukan.
11.	Untuk Barang Sewa, sistem menyediakan pengelolaan stok berdasarkan variasi barang dan unit fisik secara individual. Setiap unit barang memiliki kode unik yang dapat digunakan untuk mengidentifikasi barang tersebut.
12.	Sistem menyediakan fitur penambahan jumlah unit Barang Sewa berdasarkan variasi barang yang dipilih. Setiap unit yang ditambahkan akan dibuat sebagai data unit tersendiri dengan kode unik secara otomatis.
13.	Sistem menyediakan informasi harga jual dan jumlah stok untuk Barang Jual. Pengelolaan stok Barang Jual dilakukan berdasarkan kuantitas dan tidak memerlukan pencatatan unit fisik secara individual.
14.	Sistem menyediakan fitur pencarian dan penyaringan data barang berdasarkan nama, kode, kategori, dan jenis barang.
15.	Sistem menampilkan detail informasi barang yang dipilih.
16.	Sistem memberikan konfirmasi sebelum pengguna menghapus data barang.
17.	Sistem mencegah penghapusan data barang yang masih memiliki keterkaitan dengan transaksi atau riwayat penting tanpa melalui mekanisme yang sesuai.
18.	Sistem menyediakan pengelolaan Paket Penyewaan untuk mengelola kumpulan beberapa barang sewa yang ditawarkan dalam satu paket.
19.	Sistem menyediakan submenu Paket Penyewaan untuk menampilkan dan mengelola data paket.
20.	Sistem menyediakan fitur tambah, lihat, ubah, dan nonaktifkan data paket sesuai hak akses pengguna (bisa admin dan owner).
21.	Sistem menyediakan informasi paket yang meliputi kode paket, nama paket, deskripsi, harga sewa paket, dan daftar barang penyusun paket.
22.	Sistem memungkinkan Admin menentukan barang dan jumlah masing-masing barang yang termasuk dalam satu paket.
23.	Sistem hanya memungkinkan barang dengan jenis Barang Sewa untuk dimasukkan ke dalam Paket Penyewaan.
24.	Sistem menyediakan fitur pencarian dan penyaringan paket berdasarkan kode paket dan nama paket.
25.	Sistem menampilkan detail paket beserta daftar barang dan jumlah masing-masing barang di dalamnya.
26.	Sistem menghubungkan data Paket Penyewaan dengan data barang penyusunnya sehingga perubahan data barang dapat diperhitungkan dalam pengelolaan stok dan ketersediaan.
27.	Sistem mempertahankan informasi komposisi dan harga paket yang telah digunakan dalam booking atau transaksi agar perubahan paket tidak mengubah catatan transaksi sebelumnya.
28.	Sistem menyediakan fitur unggah foto atau gambar produk pada formulir tambah dan ubah data barang untuk memberikan gambaran visual terhadap barang yang dikelola.
29.	Sistem menampilkan foto produk pada halaman Semua Barang dan Detail Barang sehingga Admin dan Pemilik dapat mengenali produk dengan lebih mudah.
30.	Sistem menyediakan pilihan spesifikasi Barang Sewa dalam bentuk kotak centang (misalnya merek, ukuran, kapasitas, dan jenis) yang menentukan kolom isian pada tabel variasi; kolom spesifikasi yang tidak dipilih tidak ditampilkan.
31.	Sistem menyediakan fitur penambahan baris variasi pada formulir Barang Sewa, yang setiap barisnya memuat nilai spesifikasi, harga sewa, jumlah unit, dan rentang kode unit yang dibuat otomatis.
32.	Sistem menyediakan fitur penambahan spesifikasi lain di luar spesifikasi bawaan dengan jumlah maksimal tiga spesifikasi tambahan per barang, dilengkapi validasi nama spesifikasi dan fitur penghapusan spesifikasi tambahan.
33.	Sistem menampilkan daftar Paket Penyewaan dalam bentuk kartu yang memuat kode paket, nama paket, harga sewa, daftar barang penyusun, dan status paket, sehingga paket lebih mudah dikenali.

D. Pengelolaan Stok dan Ketersediaan (Revisi)
1.	Sistem menyediakan menu Stok dan Ketersediaan untuk mengelola serta memantau jumlah stok dan kondisi barang.
2.	Sistem menampilkan ringkasan stok barang berdasarkan jenis produk, variasi barang, jumlah keseluruhan, jumlah tersedia, jumlah disewa, dan jumlah barang yang tidak siap digunakan.
3.	Sistem menyediakan pengelolaan stok untuk Barang Sewa dan Barang Jual.
4.	Sistem menyediakan fitur penambahan stok barang berdasarkan jenis produk dan variasi barang yang telah terdaftar.
5.	Sistem mencatat riwayat perubahan stok, termasuk penambahan, pengurangan, dan penyesuaian stok berdasarkan variasi barang.
6.	Sistem menyediakan pengelolaan unit barang secara individual untuk Barang Sewa yang membutuhkan identifikasi per unit.
7.	Sistem menyediakan kode unik untuk setiap unit Barang Sewa yang dibuat secara otomatis berdasarkan kode produk dan urutan unit.
8.	Sistem melanjutkan penomoran kode unit ketika dilakukan penambahan stok berikutnya serta mencegah penggunaan kode yang sama.
9.	Sistem menyediakan informasi spesifikasi setiap variasi barang, meliputi merek, ukuran, kapasitas, jenis, dan karakteristik lainnya sesuai dengan produk yang dikelola.
10.	Sistem memungkinkan Admin mengelompokkan stok berdasarkan variasi produk, seperti:
•	Jaket berdasarkan ukuran dan merek.
•	Sepatu berdasarkan ukuran dan merek.
•	Sleeping Bag berdasarkan jenis dan merek.
•	Carrier berdasarkan kapasitas dan merek.
•	Headlamp berdasarkan jenis dan merek.
•	Hydropack berdasarkan kapasitas atau spesifikasi dan merek.
•	Daypack berdasarkan kapasitas dan merek.
•	Flysheet berdasarkan ukuran dan merek.
•	Hammock berdasarkan jenis dan merek.
•	Tenda berdasarkan kapasitas dan merek.
•	Kompor berdasarkan jenis dan merek.
•	Cooking Set berdasarkan ukuran dan merek.
•	Meja Lipat berdasarkan jenis dan merek.
•	Kursi Lipat berdasarkan ukuran dan merek.
•	Produk lainnya berdasarkan spesifikasi yang relevan.
11.	Sistem menyediakan informasi kondisi fisik atau operasional setiap unit Barang Sewa, meliputi:
•	Tersedia
•	Disewa
•	Dicuci
•	Persiapan
•	Rusak
•	Perawatan
12.	Sistem membedakan kondisi fisik barang dengan status alokasi atau pemesanan berdasarkan periode penyewaan.
13.	Sistem menyediakan informasi alokasi barang, seperti Belum Dialokasikan dan Dibooking.
14.	Sistem memperhitungkan booking yang berstatus Selesai, transaksi penyewaan aktif, kondisi fisik barang, serta periode penyewaan dalam menghitung ketersediaan barang.
15.	Sistem mencegah satu unit barang dialokasikan pada dua penyewaan yang memiliki periode waktu bertumpang tindih.
16.	Sistem menampilkan informasi ketersediaan barang berdasarkan tanggal mulai dan tanggal selesai penyewaan serta variasi barang yang dipilih.
17.	Sistem mencatat perubahan kondisi dan status unit barang beserta waktu perubahan dan pengguna yang melakukan perubahan.
18.	Sistem memperbarui status unit menjadi Disewa ketika barang benar-benar diambil oleh pelanggan dan transaksi penyewaan telah diproses.
19.	Setelah barang dikembalikan, sistem mencatat pengembalian dan memungkinkan Admin memperbarui kondisi barang berdasarkan hasil pemeriksaan serta informasi dari bagian persiapan atau pencucian.
20.	Sistem tidak otomatis mengubah barang menjadi Tersedia hanya karena barang telah dikembalikan atau telah melewati waktu tertentu.
21.	Sistem menyediakan perubahan status menjadi Tersedia setelah barang selesai diperiksa dan dinyatakan siap digunakan kembali.
22.	Sistem menyediakan fitur pencarian dan penyaringan data stok berdasarkan nama barang, kode unit, kategori, merek, ukuran, kapasitas, jenis, dan kondisi barang sesuai spesifikasi yang tersedia.
23.	Sistem menyediakan detail informasi stok dan riwayat pergerakan setiap variasi serta unit barang.
24.	Sistem menyediakan pengelolaan stok Barang Jual berdasarkan jumlah kuantitas barang yang tersedia, jumlah barang terjual, dan penyesuaian stok.
25.	Sistem memperhitungkan kebutuhan stok setiap variasi barang penyusun paket ketika melakukan pemeriksaan ketersediaan Paket Penyewaan.
26.	Sistem menghitung ketersediaan Paket Penyewaan berdasarkan jumlah dan kondisi unit barang penyusunnya serta alokasi penyewaan pada periode terkait.
27.	Sistem memperhitungkan penggunaan variasi barang yang sama apabila barang tersebut disewakan secara satuan maupun melalui Paket Penyewaan agar tidak terjadi pengalokasian stok secara berlebihan.
28.	Sistem menampilkan rincian kebutuhan dan ketersediaan setiap variasi barang penyusun Paket Penyewaan ketika dilakukan pemeriksaan ketersediaan paket.
29.	Sistem memperbarui alokasi stok setiap variasi barang penyusun paket ketika booking berstatus Selesai, transaksi penyewaan diproses, atau booking dibatalkan sesuai dengan kondisi transaksi.
30.	Sistem menyediakan fitur Detail Unit pada setiap variasi Barang Sewa yang ditampilkan dalam Ringkasan per Variasi.
31.	Sistem menampilkan halaman Detail Unit berdasarkan variasi barang yang dipilih, meliputi nama produk, merek, ukuran, kapasitas, jenis, dan spesifikasi lainnya sesuai karakteristik produk.
32.	Sistem menampilkan seluruh unit fisik dari variasi barang yang dipilih dalam bentuk daftar atau tabel, dengan setiap unit ditampilkan pada baris tersendiri berdasarkan kode uniknya.
33.	Sistem menampilkan informasi kondisi terkini setiap unit Barang Sewa, meliputi Tersedia, Disewa, Dicuci, Persiapan, Rusak, dan Perawatan.
34.	Sistem menyediakan fitur untuk melihat detail setiap unit barang berdasarkan kode unit yang dipilih.
35.	Sistem menyediakan fitur perubahan kondisi setiap unit Barang Sewa secara individual oleh Admin sesuai dengan hasil pemeriksaan atau kondisi fisik barang.
36.	Sistem menyediakan pilihan perubahan kondisi unit barang sesuai dengan status operasional yang telah ditentukan, yaitu Tersedia, Disewa, Dicuci, Persiapan, Rusak, dan Perawatan.
37.	Sistem mencatat setiap perubahan kondisi unit barang secara terpisah, termasuk kondisi sebelumnya, kondisi terbaru, waktu perubahan, dan pengguna yang melakukan perubahan.
38.	Sistem memperbarui ringkasan jumlah stok berdasarkan perubahan kondisi setiap unit barang sehingga jumlah unit dalam setiap kategori kondisi selalu sesuai dengan data unit individual.
39.	Sistem menyediakan fitur pencarian dan penyaringan unit barang berdasarkan kode unit dan kondisi barang pada halaman Detail Unit.
40.	Sistem menyediakan navigasi kembali dari halaman Detail Unit ke halaman Stok dan Ketersediaan atau Ringkasan per Variasi.

E. Pengelolaan Booking
1.	Sistem menyediakan menu Booking bagi Admin dan Owner untuk mencatat dan mengelola pemesanan barang sewa bagi periode sewa yang direncanakan melalui operasi CRUD (Create: membuat booking baru, Read: melihat daftar dan detail booking, Update: mengubah data booking, Delete: menghapus atau membatalkan booking sesuai ketentuan sistem).
Sistem menampilkan 4 (empat) kartu ringkasan metrik pemantauan booking pada bagian atas halaman Booking, meliputi:
•	Selesai (Siap Transaksi): Jumlah booking berstatus Selesai yang mengamankan stok dan siap dilanjutkan ke Transaksi Penyewaan saat pengambilan barang fisik.
•	Draft: Jumlah data booking yang sedang dibuat atau belum selesai dicatat oleh Admin.
•	Dibatalkan: Jumlah booking yang tidak terealisasi menjadi transaksi sewa (baik karena pembatalan pelanggan maupun karena tidak hadir mengambil barang/no-show).
•	Pengambilan Hari Ini: Jumlah booking berstatus Selesai yang memiliki jadwal pengambilan atau mulai sewa pada hari berjalan (Hari-H), guna memastikan kesiapan operasional serah terima barang fisik dan pelunasan sisa tagihan sewa di toko oleh Admin kasir.
2.	Sistem memungkinkan Admin mencatat booking berdasarkan kesepakatan yang telah dilakukan dengan pelanggan melalui WhatsApp atau secara langsung.
3.	Sebelum mencatat booking, Admin dapat memeriksa ketersediaan barang berdasarkan tanggal penyewaan yang diminta pelanggan.
4.	Admin dapat berkoordinasi dengan bagian persiapan untuk memastikan kondisi fisik barang sebelum memberikan informasi kepada pelanggan.
5.	Sistem menyediakan formulir booking yang memuat data pelanggan, barang atau paket yang dipesan, jumlah barang, Tanggal Booking, Tanggal Mulai Sewa, Durasi Sewa, Tanggal Selesai Sewa (dihitung otomatis), total harga sewa, dan informasi pembayaran DP. Tanggal pengambilan fisik aktual barang tidak diinput pada formulir booking, melainkan dicatat pada saat serah terima barang di Transaksi Penyewaan.
6.	Sistem menyediakan kode booking secara otomatis sebagai identitas setiap pemesanan.
7.	Sistem menghitung total biaya penyewaan berdasarkan barang, jumlah, dan durasi penyewaan.
8.	Sistem menghitung kebutuhan DP sebesar 25% dari total biaya penyewaan untuk booking yang disepakati minimal H-2 sebelum Tanggal Mulai Sewa (selisih hari antara Tanggal Mulai Sewa dan Tanggal Booking minimal 2 hari kalender).
9.	Sistem menampilkan informasi bahwa booking H-1 (selisih 1 hari kalender) dan booking Hari-H (selisih 0 hari kalender, Tanggal Booking sama dengan Tanggal Mulai Sewa) tidak diwajibkan membayar DP sesuai ketentuan perusahaan, di mana pembayaran penuh dapat diselesaikan saat pengambilan barang.
10.	Sistem menyediakan fitur pencatatan pembayaran DP yang telah diterima dari pelanggan, meliputi nominal pembayaran, tanggal pembayaran, dan metode pembayaran.
11.	Sistem menyediakan pilihan metode pembayaran DP, yaitu tunai, QRIS, dan transfer.
12.	Sistem menyediakan status booking yang terdiri dari 3 status resmi, meliputi:
•	Draft: Data booking sedang dibuat atau belum selesai dicatat oleh Admin.
•	Selesai: Admin dan Customer telah menyepakati pemesanan, pembayaran DP telah diterima sesuai ketentuan yang berlaku, dan booking telah tercatat secara resmi. Booking dengan status Selesai dapat diproses lebih lanjut melalui menu Transaksi.
•	Dibatalkan: Booking yang tidak terealisasi menjadi transaksi sewa, baik atas permohonan pembatalan dari pelanggan, pembatalan oleh pihak berwenang karena alasan tertentu, maupun akibat pelanggan tidak datang mengambil barang fisik hingga batas waktu pengambilan yang disepakati (no-show). Setiap pembatalan wajib menyertakan alasan pembatalan yang tercatat secara jelas dalam sistem.

Booking yang telah memenuhi kesepakatan dan pembayaran DP tidak perlu melalui status Dikonfirmasi. Status booking langsung berubah dari Draft menjadi Selesai.

Status Selesai pada Booking menunjukkan bahwa proses pemesanan telah selesai, bukan berarti proses penyewaan atau transaksi telah selesai. Proses pengambilan barang, pencatatan jaminan, pelunasan, dan serah terima tetap dilakukan melalui menu Transaksi.

Ketentuan Khusus Booking Dibatalkan:
•	Booking yang berstatus Dibatalkan TIDAK BOLEH dilanjutkan ke menu Transaksi Penyewaan.
•	Booking yang Dibatalkan harus tetap tersimpan dalam sistem sebagai riwayat (audit trail) dan arsip historis, bukan dihapus dari database maupun laporan.
•	Booking Dibatalkan tersinkronisasi dengan Dashboard Admin, Dashboard Owner, Laporan Booking, Laporan Keuangan/Pendapatan, serta laporan lain yang berkaitan.
•	Booking Dibatalkan TIDAK BOLEH dihitung sebagai transaksi penyewaan aktif atau pendapatan sewa yang terealisasi.
•	Apabila booking tersebut memiliki pembayaran DP, sistem harus tetap menyimpan riwayat pembayaran dan menampilkan status pembayaran sesuai ketentuan yang berlaku; nominal DP tersebut dicatat sebagai dana hangus (penerimaan terkait booking yang tidak dikembalikan) sesuai regulasi perusahaan, tanpa mengubah aturan DP atau kebijakan refund yang berlaku.
•	Booking yang Dibatalkan tidak boleh lagi mengalokasikan stok untuk periode sewa yang direncanakan, sehingga alokasi stok langsung dilepaskan dan unit fisik barang dapat tersedia kembali apabila tidak sedang digunakan oleh booking atau transaksi lain.
13.	Sistem membatasi kewenangan aksi pada menu Booking hanya untuk pengelolaan data booking (CRUD):
•	Struktur Kolom AKSI Tabel Booking: Menyediakan 3 tombol aksi utama pada setiap baris data booking, yaitu Detail, Ubah, dan Hapus.
•	Detail: Menampilkan jendela pop-up Detail Booking yang memuat rincian lengkap pemesanan. Tindakan 'Ubah Data' tidak diletakkan di dalam pop-up Detail, melainkan diposisikan langsung di luar pada kolom AKSI tabel utama agar alur kerja operasional lebih cepat dan efisien.
•	Ubah (Booking Diubah): Mengarahkan Admin kembali ke formulir Catat Booking (`/admin/booking/baru?id=[id]`) dengan seluruh data reservasi dan item keranjang belanja terisi kembali (pre-filled). Sistem menyesuaikan data booking, tanggal penyewaan, durasi, produk, jumlah produk, total harga, serta ketersediaan stok sesuai perubahan terbaru. Sistem menerapkan rekonsiliasi stok di mana alokasi lama booking yang sedang disunting dikecualikan dari perhitungan base stock agar tidak terhitung ganda (double-counting), sehingga penambahan atau pengurangan item pada keranjang merefleksikan ketersediaan stok fisik secara presisi tanpa bertambah atau berkurang secara tidak semestinya.
•	Hapus (Booking Dihapus): Menyediakan aksi penghapusan data booking dengan dialog konfirmasi terlebih dahulu. Jika salah satu booking dihapus, booking tersebut TIDAK BOLEH otomatis dialihkan atau dibuat menjadi transaksi penyewaan. Stok produk yang sebelumnya telah dialokasikan untuk booking tersebut harus dikembalikan secara otomatis dan langsung tersedia bagi pelanggan lain pada periode tersebut.
•	Pembatalan Booking (Booking Dibatalkan): Jika booking dibatalkan (melalui aksi Batalkan Booking dengan alasan wajib), booking tersebut TIDAK BOLEH masuk ke menu Transaksi Penyewaan dan TIDAK BOLEH dianggap sebagai transaksi penyewaan aktif maupun omzet sewa yang terealisasi. Seluruh stok yang sebelumnya dialokasikan langsung dilepaskan kembali ke inventaris. Data pembatalan tetap tersimpan utuh dan ditampilkan pada Laporan Owner (`/owner/laporan/penyewaan`) sebagai riwayat audit trail booking yang dibatalkan beserta alasan, pelaku pembatalan, dan nominal DP hangus.
•	Konversi Menjadi Transaksi Penyewaan: Booking HANYA BOLEH dikonversi menjadi transaksi penyewaan apabila proses penyewaan benar-benar dilanjutkan secara sadar oleh Admin di menu Transaksi Penyewaan (melalui tombol 'Dari booking' / modal pemilihan booking berstatus Selesai, pencatatan jaminan fisik, dan pelunasan sisa tagihan di kasir). Sistem mencegah konversi otomatis pada booking yang dihapus atau dibatalkan, serta mencegah konversi ganda atas booking yang telah diproses menjadi transaksi sewa.
•	Konfirmasi Penyelesaian Pesanan Booking: Saat tombol 'Selesaikan Booking' ditekan pada formulir pencatatan booking, sistem menampilkan dialog konfirmasi ringkasan pemesanan (nama pelanggan, periode sewa, jumlah item, total biaya, dan DP diterima) sebelum data resmi disimpan ke sistem.
•	Menu Booking TIDAK menyediakan tombol aksi langsung "Proses Sewa". Seluruh inisiasi transaksi penyewaan, pengambilan barang, pencatatan jaminan fisik, dan pelunasan sisa tagihan sewa dilakukan secara eksklusif melalui menu Transaksi Penyewaan.
•	Pelunasan pembayaran sisa tagihan sewa tidak diproses pada menu Booking, melainkan dilakukan secara eksklusif melalui menu Transaksi Penyewaan saat pengambilan barang.
•	Proses pengambilan barang, pencatatan jaminan fisik (di mana Jenis Identitas Jaminan ditulis secara manual tanpa memerlukan nomor identitas jaminan), dan serah terima fisik barang tidak dilakukan pada menu Booking, melainkan ditangani secara eksklusif pada menu Transaksi Penyewaan.
•	Tanggal Mulai Sewa yang direncanakan dan Tanggal Selesai Sewa digunakan untuk mengunci dan mengamankan alokasi stok barang sewa (satuan maupun paket) pada rentang periode yang direncanakan agar tidak terjadi bentrok pemesanan (double booking) dengan booking pelanggan lain.
14.	Sistem menyediakan pencarian booking berdasarkan kode booking, nama pelanggan, dan nomor telepon.
15.	Sistem menyediakan penyaringan booking berdasarkan status booking dan periode sewa (Tanggal Mulai Sewa).
16.	Sistem menyediakan detail informasi booking.
17.	Sistem memungkinkan Admin mengubah data booking apabila terjadi kesalahan pencatatan dengan tetap menyimpan riwayat perubahan.
18.	Sistem menyediakan mekanisme penghapusan booking Draft melalui konfirmasi dan pengisian alasan penghapusan.
19.	Sistem menyimpan riwayat penghapusan booking pada Riwayat Aktivitas.
20.	Sistem tidak menyediakan pembatalan booking secara bebas. Apabila terjadi pembatalan booking berstatus Selesai karena kondisi tertentu, pembatalan hanya dapat dilakukan oleh pengguna yang memiliki kewenangan dengan menyertakan alasan pembatalan. Apabila pelanggan telah membayar DP, sistem mencatat DP tersebut sebagai uang yang tidak dikembalikan (hangus) sesuai ketentuan perusahaan.
21.	Sistem mencatat nominal DP yang telah diterima dan tidak dikembalikan akibat pembatalan booking sebagai penerimaan yang terkait dengan booking tersebut.
22.	Sistem melepaskan alokasi stok dari booking yang telah dibatalkan agar barang dapat diperhitungkan kembali dalam ketersediaan pada periode terkait.
23.	Sistem menyimpan riwayat pembatalan booking beserta alasan, pengguna yang melakukan pembatalan, waktu pembatalan, dan informasi DP yang diterima.
24.	Booking yang berstatus Selesai akan diperhitungkan dalam proses pemeriksaan ketersediaan barang untuk periode penyewaan terkait.
25.	Menu Booking TIDAK menyediakan tombol aksi "Proses Sewa". Transaksi Penyewaan diinisiasi dan diproses secara terpisah melalui menu Transaksi Penyewaan, di mana Admin memilih booking yang telah berstatus Selesai (atau transaksi langsung di toko). Booking yang berstatus Draft atau Dibatalkan TIDAK DAPAT dipilih atau diproses menjadi Transaksi Penyewaan. Ketika booking berstatus Selesai dipilih di menu Transaksi Penyewaan, seluruh data booking (pelanggan, barang atau paket, Tanggal Booking, Tanggal Mulai Sewa, Durasi Sewa, Tanggal Selesai Sewa, dan pembayaran DP yang telah diterima) otomatis terhubung ke transaksi tanpa perlu memasukkan ulang data. Pada menu Transaksi Penyewaan tersebut, Admin mencatat tanggal dan waktu pengambilan aktual saat serah terima fisik, menuliskan Jenis Identitas Jaminan secara manual (tanpa nomor jaminan), dan memproses pelunasan sisa tagihan sewa.
26.	Sistem menyediakan pilihan penyewaan barang secara satuan maupun melalui Paket Penyewaan.
27.	Sistem menampilkan daftar Paket Penyewaan beserta informasi harga dan barang penyusunnya ketika Admin mencatat booking.
28.	Sistem memungkinkan Admin memilih Paket Penyewaan dan menentukan jumlah paket yang dipesan pelanggan.
29.	Sistem menampilkan rincian barang penyusun paket beserta jumlah masing-masing barang dalam booking.
30.	Sistem menghitung biaya penyewaan berdasarkan harga paket, jumlah paket, dan durasi penyewaan.
31.	Sistem memeriksa ketersediaan seluruh barang penyusun paket berdasarkan periode penyewaan yang diminta pelanggan.
32.	Sistem menyimpan rincian komposisi dan harga Paket Penyewaan pada booking berstatus Selesai agar tetap sesuai dengan kesepakatan awal meskipun data paket mengalami perubahan.
33.	Sistem memisahkan katalog pada halaman pencatatan booking ke dalam dua tab, yaitu Barang Satuan dan Paket, sehingga barang sewa satuan dan Paket Penyewaan tidak tercampur dalam satu daftar, dengan keranjang yang tetap digunakan bersama oleh kedua tab.
34.	Sistem menyediakan formulir pencatatan booking dengan integrasi tanggal sewa, durasi, dan kewajiban DP:
•	Admin mengatur tiga isian utama: Tanggal Booking, Tanggal Mulai Sewa, dan Durasi Sewa.
•	Tanggal Booking diatur melalui date picker dengan nilai awal default tanggal saat ini dan dapat diubah secara manual oleh Admin sesuai tanggal kesepakatan pemesanan (misalnya via WhatsApp atau di toko). Tanggal Booking dibedakan dari waktu pencatatan sistem (created_at).
•	Tanggal Mulai Sewa diatur melalui date picker sebagai tanggal rencana penyewaan dimulai. Tanggal Mulai Sewa menjadi acuan utama perhitungan durasi sewa, tanggal selesai sewa, dan jarak hari untuk aturan DP (bukan tanggal pengambilan aktual).
•	Durasi Sewa diatur melalui input angka berupa bilangan bulat positif (minimal 1 hari) yang digunakan langsung dalam menghitung total biaya penyewaan.
•	Tanggal Selesai Sewa dihitung secara otomatis oleh sistem dengan rumus: Tanggal Selesai Sewa = Tanggal Mulai Sewa + Durasi Sewa, bersifat tidak dapat diedit manual (read-only), dan diperbarui otomatis secara real-time saat Tanggal Mulai Sewa atau Durasi Sewa berubah.
•	Formulir booking tidak memuat input manual tanggal pengambilan fisik aktual; tanggal pengambilan fisik dicatat pada saat serah terima barang di Transaksi Penyewaan.
•	Sistem menentukan kewajiban DP berdasarkan selisih hari kalender antara Tanggal Mulai Sewa dan Tanggal Booking (Selisih Hari = Tanggal Mulai Sewa - Tanggal Booking):
	- Selisih 2 hari atau lebih (H-2 atau lebih awal): DP wajib sebesar 25% dari total biaya penyewaan.
	- Selisih 1 hari (H-1): DP tidak wajib (nominal DP wajib Rp 0).
	- Selisih 0 hari (Hari-H): DP tidak wajib (nominal DP wajib Rp 0).
•	Sistem menampilkan validasi apabila Tanggal Mulai Sewa diatur lebih awal daripada Tanggal Booking.
•	Nominal DP yang disepakati secara default mengikuti nominal DP wajib (25% jika H-2+, atau Rp 0 jika H-1/Hari-H), dapat disesuaikan oleh Admin jika ada kesepakatan khusus, dan memunculkan indikasi validasi apabila nominal disepakati lebih rendah dari ketentuan DP wajib.
•	Nominal DP yang diterima sekarang memiliki nilai awal Rp 0 dan tidak secara otomatis dianggap lunas hanya karena DP telah disepakati.
•	Sisa pembayaran dihitung: Sisa Pembayaran = Total Biaya Penyewaan - Pembayaran Diterima Aktual.
•	Status pembayaran (Belum dibayar, DP Sebagian, DP Lunas, atau Lunas) dihitung secara otomatis berdasarkan total biaya penyewaan dan pembayaran aktual yang diterima.
•	Setiap perubahan barang, kuantitas, durasi sewa, tanggal booking, atau tanggal mulai sewa secara responsif memperbarui perhitungan total sewa, kewajiban DP, dan sisa pembayaran.
•	Tanggal Booking, Tanggal Mulai Sewa, Durasi Sewa, dan Tanggal Selesai Sewa ditampilkan secara konsisten pada formulir, ringkasan, konfirmasi, detail booking, modul Owner, dan diteruskan secara utuh ke Transaksi Penyewaan.
35.	Sistem menjamin sinkronisasi data booking antara Admin dan Owner:
•	Data booking yang dicatat atau diperbarui oleh Admin tersimpan pada basis data yang sama dan dapat dipantau oleh Owner secara real-time (single source of truth).
•	Informasi booking yang ditampilkan pada Admin dan Owner mengacu pada data yang sama (kode booking, pelanggan, barang/paket, Tanggal Booking, Tanggal Mulai Sewa, Durasi Sewa, Tanggal Selesai Sewa, total biaya, status booking, dan pembayaran DP).
•	Perubahan data booking yang dilakukan oleh pihak yang memiliki kewenangan (seperti pembatalan booking atau perubahan rincian) langsung tercermin pada tampilan pihak lainnya sesuai hak akses masing-masing.
•	Admin dan Owner menggunakan aturan perhitungan ketersediaan stok yang sama berdasarkan periode booking yang telah dialokasikan, sehingga booking yang telah mengamankan stok pada periode tertentu mencegah barang tersebut dipesan melebihi sisa unit yang tersedia di kedua belah pihak.
•	Status booking (Draft, Selesai, Dibatalkan) konsisten antara Admin dan Owner.
•	Booking Dibatalkan tercermin dalam Dashboard dan laporan Owner tanpa dihitung sebagai transaksi penyewaan aktif atau pendapatan sewa yang terealisasi.
36.	Sistem menyediakan sinkronisasi ketersediaan stok dinamis dan keranjang pemesanan pada katalog booking:
•	Pengurangan Stok Dinamis Saat Dipilih: Saat Admin memilih atau menambahkan barang atau paket ke dalam keranjang booking, jumlah ketersediaan unit pada kartu barang di katalog langsung berkurang secara responsif tanpa perlu memuat ulang halaman (refresh) sesuai dengan jumlah unit yang masuk ke dalam keranjang.
•	Pemulihan Stok Saat Item Dikurangi atau Dihapus: Ketika Admin mengurangi kuantitas atau menghapus item dari keranjang booking, jumlah ketersediaan barang pada kartu katalog terkait langsung bertambah kembali secara akurat.
•	Indikasi Kondisi Stok Habis:
	- Apabila ketersediaan barang mencapai 0 unit, kartu barang menampilkan informasi '0 dari N unit tersedia', indikator titik dan teks berubah warna menjadi merah, serta menampilkan label 'Stok Habis'.
	- Kartu barang dan tombol penambahan barang dengan ketersediaan 0 unit otomatis dinonaktifkan (disabled) sehingga Admin tidak dapat menambahkan barang melebihi ketersediaan unit yang ada.
	- Apabila barang masih tersedia (> 0 unit), kartu menggunakan indikator warna hijau ('N dari M unit tersedia').
•	Sinkronisasi Dua Arah Antara Kartu Barang dan Keranjang: Jumlah barang yang dipilih pada keranjang selalu sinkron dengan kartu barang, baik saat menambah kuantitas, mengurangi kuantitas, menghapus item, mengubah jumlah paket, maupun berpindah antar-tab Barang Satuan dan Paket (ketersediaan tidak boleh bernilai negatif, tidak boleh desinkronisasi, dan tidak boleh bertambah/reset secara tidak sengaja saat berpindah tab).
•	Ketergantungan Stok Barang Satuan dan Paket (Shared Inventory):
	- Ketersediaan Barang Satuan berkurang secara proporsional sesuai jumlah unit satuan yang dipilih.
	- Ketersediaan Paket Penyewaan bergantung langsung pada ketersediaan barang-barang satuan penyusunnya. Penambahan paket ke keranjang akan mengurangi stok komponen barang satuan penyusunnya, dan sebaliknya penambahan barang satuan ke keranjang akan mengurangi batas kapasitas paket yang dapat dibooking.
	- Kapasitas paket tidak boleh melebihi sisa unit terkecil dari seluruh komponen barang penyusunnya.
•	Perhitungan Ketersediaan Berbasis Rentang Tanggal: Ketersediaan dihitung berdasarkan rencana Tanggal Mulai Sewa dan Tanggal Selesai Sewa, di mana sistem memperhitungkan unit fisik total dikurangi unit non-aktif (rusak/perawatan), dikurangi booking lain yang telah berstatus Selesai pada rentang tanggal sewa yang bertumpang tindih (overlap).
37.	Sistem menyediakan fitur Lanjutkan Booking Draft dengan integrasi penuh pada formulir Catat Booking yang sama:
•	Konsistensi Formulir: Ketika Admin menekan tombol Lanjutkan pada booking yang berstatus Draft, sistem membuka kembali formulir Catat Booking yang sama persis (menggunakan komponen, layout, validasi, katalog barang, keranjang pemesanan, perhitungan harga, dan aturan DP yang identik dengan formulir Catat Booking baru). Sistem TIDAK BOLEH membuat formulir tersendiri dengan struktur, layout, atau field yang berbeda dari Catat Booking. Setiap pembaruan atau perbaikan pada formulir Catat Booking otomatis berlaku untuk fitur Lanjutkan Draft.
•	Pemuatan Data Otomatis: Data booking Draft yang sebelumnya telah diisi otomatis dimuat (pre-filled) secara utuh ke dalam formulir Catat Booking, meliputi data pelanggan, barang satuan atau paket yang dipilih beserta jumlahnya, Tanggal Booking, Tanggal Mulai Sewa, Durasi Sewa, Tanggal Selesai Sewa (otomatis terhitung), total biaya, dan data pembayaran DP yang telah dicatat (nominal DP dan metode pembayaran).
•	Pembaruan Tanpa Duplikasi: Perubahan yang dilakukan Admin pada formulir Lanjutkan Draft memperbarui data pada booking yang sama, mempertahankan kode booking yang sama, dan TIDAK BOLEH membuat duplikasi data booking baru di sistem.
•	Konsistensi Field Formulir: Formulir Catat Booking dan Lanjutkan Draft tidak memuat field yang tidak relevan dengan kebutuhan fungsional booking, seperti Tanggal Pengambilan Aktual, Waktu Pengambilan Aktual, Tanggal Serah Terima Barang, maupun Jaminan Fisik (KTP/SIM). Field-field tersebut hanya dicatat pada saat serah terima barang di menu Transaksi Penyewaan.
•	Pemisahan Tombol Aksi Simpan Draft dan Selesaikan Booking: Formulir menyediakan dua tombol aksi yang berbeda:
	- Simpan Perubahan Draft / Simpan sebagai Draft: Menyimpan perubahan data pemesanan dengan mempertahankan status tetap 'Draft', sehingga dapat dibuka kembali kapan saja untuk disunting lebih lanjut. Booking berstatus Draft tidak mengikat transaksi dan tidak dapat diproses ke Transaksi Penyewaan.
	- Selesaikan Booking: Mengubah status booking dari Draft menjadi 'Selesai' setelah kesepakatan pemesanan dan ketentuan pembayaran DP terpenuhi. Booking berstatus Selesai resmi dapat dipilih dan diproses ke menu Transaksi Penyewaan.

F. Pengelolaan Transaksi

1) Transaksi Penyewaan
1.	Sistem menyediakan submenu Transaksi Penyewaan untuk mencatat dan mengelola transaksi penyewaan barang.
2.	Sistem mendukung transaksi penyewaan yang berasal dari booking maupun transaksi langsung tanpa booking:
•	Transaksi Penyewaan yang berasal dari pemesanan hanya dapat dibuat dari booking yang berstatus Selesai.
•	Booking yang berstatus Draft atau Dibatalkan TIDAK BOLEH dipilih atau diproses menjadi Transaksi Penyewaan.
•	Pada menu Transaksi Penyewaan, tombol aksi "Dari booking" mengarahkan pengguna secara langsung ke menu Booking (`/admin/booking`) untuk meninjau dan mengelola data reservasi booking.
•	Data booking otomatis terisi secara lengkap ke dalam transaksi, termasuk data Customer, produk atau paket, jumlah unit, periode sewa, nominal DP yang telah dibayar, dan rincian biaya, sehingga Admin tidak perlu memasukkan ulang data yang sudah tersedia.
3.	Sistem menyediakan pemilihan data pelanggan dan barang yang akan disewa.
4.	Sistem menampilkan informasi ketersediaan barang berdasarkan periode penyewaan.
5.	Sistem menyediakan pemilihan unit barang untuk barang yang dikelola secara individual.
6.	Sistem menghitung total biaya penyewaan berdasarkan barang, jumlah, harga, dan durasi penyewaan.
7.	Sistem menyediakan informasi tanggal dan waktu mulai penyewaan, tanggal dan waktu selesai penyewaan, tanggal pengambilan, serta tanggal pengembalian barang.
8.	Sistem menyediakan pencatatan jenis identitas jaminan fisik (seperti KTP, SIM, atau KTM) yang ditulis secara manual oleh Admin tanpa memerlukan pencatatan nomor identitas jaminan, pada saat proses serah terima atau pengambilan fisik barang sewa di menu Transaksi Penyewaan (jaminan tidak dicatat pada formulir tambah pelanggan dan tidak dicatat pada menu Booking).
9.	Sistem menyediakan kode transaksi penyewaan secara otomatis dan memastikan transaksi penyewaan tetap memiliki relasi (linking/foreign key) dengan booking asal agar riwayat pemesanan hingga transaksi dapat ditelusuri secara utuh.
10.	Sistem menampilkan ringkasan informasi operasional pada menu Transaksi Penyewaan yang terfokus:
•	4 Kartu Ringkasan (KPI): Sedang Disewa (transaksi aktif di pelanggan), Belum Diambil (transaksi yang menunggu serah terima barang), Belum Lunas (transaksi dengan sisa tagihan beserta total nominalnya), dan Sudah Lunas (transaksi yang seluruh tagihan sewanya telah lunas Rp 0 sisa). Status keterlambatan dan perhitungan denda dikelola secara eksklusif pada menu Pengembalian.
•	Status Pengambilan: Belum Diambil (barang fisik masih di toko) dan Sudah Diambil (barang fisik telah diserahterimakan ke pelanggan).
•	Status Transaksi: Menggunakan indikator status yang tegas, yaitu Belum Lunas (masih terdapat sisa tagihan yang harus dilunasi saat serah terima) dan Lunas (seluruh biaya sewa telah tuntas Rp 0 sisa), tanpa kolom pembayaran terpisah yang redundan pada tabel transaksi. Pemantauan keterlambatan, denda, dan kondisi fisik pengembalian unit dikelola khusus pada menu Pengembalian.
•	Struktur Kolom AKSI Tabel Transaksi Penyewaan secara Dinamis:
	Sistem menampilkan susunan tombol aksi secara dinamis pada setiap baris data tabel transaksi penyewaan berdasarkan sumber transaksi (asal pemesanan) dan status serah terima barang:
	a. Transaksi Langsung (Walk-In) tanpa Booking, Belum Serah Terima (Status: Belum Diambil):
		Menyediakan 3 tombol aksi berurutan: Detail, Ubah, dan Hapus.
		- Detail: Membuka modal ringkasan lengkap data transaksi penyewaan. Tombol 'Cetak Struk' dipindahkan dan disediakan secara eksklusif di dalam modal Detail (bukan sebagai tombol terpisah pada baris tabel) agar tabel utama tetap ringkas dan bersih.
		- Ubah: Mengarahkan Admin kembali ke formulir transaksi langsung (`/admin/transaksi/sewa/baru?id=[id]`) dengan seluruh data transaksi dan keranjang belanja terisi kembali (pre-filled) untuk disunting sebelum serah terima. Ketersediaan stok disesuaikan secara real-time.
		- Hapus: Memungkinkan penghapusan transaksi langsung sebelum serah terima melalui dialog konfirmasi ringkas. Seluruh stok produk yang sebelumnya dialokasikan otomatis dikembalikan secara utuh ke ketersediaan toko tanpa risiko penambahan stok ganda.
	b. Transaksi yang Berasal dari Booking, Belum Serah Terima (Status: Belum Diambil):
		Menyediakan 3 tombol aksi berurutan: Serah Terima, Ubah, dan Detail.
		- Serah Terima: Membuka formulir serah terima untuk mencatat jenis identitas jaminan fisik dan memproses pelunasan sisa tagihan di kasir toko.
		- Ubah: Mengarahkan Admin ke formulir untuk mengubah data transaksi yang belum diserahterimakan. Setiap perubahan produk, kuantitas, tanggal sewa, durasi, dan total harga secara otomatis disinkronkan dua arah dengan data booking asal di sistem, serta memperbarui alokasi stok pada periode sewa terbaru.
		- Detail: Menampilkan rincian transaksi, informasi relasi booking asal (kode booking), dan tombol Cetak Struk.
	c. Setelah Serah Terima (Status: Sudah Diambil):
		Sistem secara otomatis mengubah daftar aksi menjadi HANYA 1 tombol aksi: Detail.
		- Aksi Serah Terima tidak boleh muncul kembali.
		- Aksi Ubah dan Hapus tidak tersedia melalui aksi biasa guna menjamin keamanan dan integritas transaksi aktif.
		- Detail tetap dapat dibuka untuk melihat informasi transaksi dan mencetak struk.
		- Status serah terima tersimpan secara permanen dan konsisten saat halaman dimuat ulang.
		- Stok produk TIDAK otomatis dikembalikan saat serah terima, melainkan tetap dialokasikan hingga proses pengembalian fisik dilakukan melalui menu Pengembalian.
•	Integritas dan Sinkronisasi Booking, Transaksi, dan Stok:
	- Booking yang telah dikonversi menjadi transaksi penyewaan dicegah dari menduplikasi alokasi stok dengan transaksi aktifnya (single source allocation).
	- Booking yang dibatalkan atau dihapus sebelum menjadi transaksi dilarang keras masuk ke menu Transaksi Penyewaan.
	- Seluruh validasi status (pencegahan ubah/hapus setelah serah terima) diterapkan pada tingkat data/store logic, bukan hanya menyembunyikan tombol antarmuka (frontend).
11.	Sistem menyediakan detail transaksi penyewaan beserta informasi jaminan, rincian barang, dan riwayat pembayarannya.
12.	Sistem menyediakan pencarian dan penyaringan transaksi berdasarkan kode transaksi, pelanggan, periode transaksi, dan status transaksi.
13.	Sistem menyediakan Formulir Serah Terima Barang pada menu Transaksi Penyewaan yang dapat diakses melalui tombol 'Serah Terima' pada tabel transaksi maupun modal detail transaksi ketika status pengambilan masih 'Belum Diambil':
•	Rincian Serah Terima: Formulir menampilkan informasi pelanggan, jadwal sewa, batas pengembalian, dan daftar barang atau paket yang diserahkan kepada pelanggan.
•	Pencatatan Jaminan Fisik Wajib: Menyediakan input jenis identitas jaminan fisik (misal: KTP Asli atas nama penyewa atau SIM A) yang ditulis manual tanpa pencatatan nomor identitas.
•	Pelunasan Sisa Tagihan di Kasir: Menghitung sisa tagihan sewa secara otomatis (Total Biaya Sewa dikurangi DP yang telah dibayar pada booking asal). Jika terdapat sisa tagihan, formulir menyediakan input nominal uang diterima, kalkulasi kembalian, dan pilihan metode pelunasan (Tunai, QRIS, Transfer).
•	Dialog Konfirmasi Ringkas & Jelas: Saat tombol konfirmasi ditekan, sistem menampilkan dialog konfirmasi ringkas ('Serahkan Barang [Kode]?') yang memuat jaminan fisik dan nominal pelunasan secara padat dan jelas sebelum data diperbarui.
•	Pembaruan Status Otomatis: Setelah serah terima dikonfirmasi, status pengambilan otomatis berubah menjadi 'Sudah Diambil', status pembayaran menjadi 'Lunas', sisa tagihan menjadi Rp 0, dan kondisi unit fisik barang diperbarui menjadi 'Disewa'.
14.	Sistem menyediakan informasi status pengambilan barang, yaitu Belum Diambil dan Sudah Diambil.
15.	Sistem mencatat tanggal dan waktu pengambilan barang ketika barang benar-benar diserahkan kepada pelanggan.
16.	Sistem memperbarui kondisi fisik unit barang menjadi Disewa setelah proses pengambilan barang dikonfirmasi oleh Admin.
17.	Sistem mengintegrasikan nominal DP yang telah dibayarkan pada saat booking ke dalam Transaksi Penyewaan ketika booking dilanjutkan menjadi transaksi, tanpa mencatat ulang pembayaran tersebut.
18.	Sistem menghitung sisa pembayaran secara otomatis berdasarkan total biaya penyewaan dikurangi seluruh pembayaran yang telah diterima, termasuk DP.
19.	Sistem menyediakan fitur pencatatan pembayaran pelunasan untuk membayar sisa tagihan transaksi penyewaan (pelunasan sisa tagihan dilakukan secara eksklusif melalui menu Transaksi Penyewaan saat pengambilan barang, bukan pada menu Booking):
•	Di menu Transaksi Penyewaan, proses pembayaran HANYA digunakan untuk pelunasan sisa pembayaran sewa.
•	Sistem tidak menambahkan proses pembayaran DP baru apabila DP sudah dicatat pada menu Booking.
•	Sistem menghitung sisa pembayaran secara otomatis: Sisa Pembayaran = Total Biaya Sewa dikurangi seluruh pembayaran yang sudah diterima, termasuk DP yang sudah tercatat pada booking asal.
20.	Sistem menyediakan pilihan metode pembayaran pelunasan, yaitu tunai, QRIS, dan transfer.
21.	Sistem menyediakan informasi status pembayaran yang tegas, yaitu Belum Lunas dan Lunas:
•	Belum Lunas: Diterapkan apabila masih terdapat sisa tagihan sewa yang belum dilunasi oleh pelanggan (termasuk booking yang baru membayar DP atau booking tanpa DP yang belum melunasi saat serah terima).
•	Lunas: Diterapkan secara otomatis apabila seluruh tagihan sewa telah dibayar penuh saat serah terima barang atau pada transaksi langsung.
22.	Sistem memperbarui status pembayaran secara otomatis menjadi Lunas apabila seluruh tagihan telah dibayarkan.
23.	Sistem menyimpan riwayat pembayaran DP dan pelunasan beserta tanggal, nominal, metode pembayaran, dan pengguna yang mencatat.
24.	Sistem menyimpan riwayat perubahan transaksi yang dilakukan oleh pengguna.
25.	Sistem menyediakan pemilihan barang sewa secara satuan maupun melalui Paket Penyewaan dalam transaksi penyewaan.
26.	Sistem menampilkan rincian barang penyusun Paket Penyewaan beserta jumlah masing-masing barang dalam transaksi.
27.	Sistem menghitung total biaya penyewaan berdasarkan harga paket, jumlah paket, dan durasi penyewaan.
28.	Sistem mengintegrasikan rincian Paket Penyewaan dari booking yang dilanjutkan menjadi transaksi penyewaan tanpa perlu memasukkan ulang data paket dan barang penyusunnya.
29.	Sistem mengalokasikan stok setiap barang penyusun paket berdasarkan jumlah paket yang disewa.
30.	Sistem mencatat barang penyusun paket yang benar-benar diserahkan kepada pelanggan sebagai bagian dari transaksi penyewaan.
31.	Sistem menyediakan formulir tersendiri untuk Transaksi Penyewaan Langsung (Walk-In) pada halaman khusus (`/admin/transaksi/sewa/baru`) dengan konsep layout 2-kolom terintegrasi (serupa dengan konsep formulir Catat Booking):
•	Ketentuan Operasional Transaksi Langsung (Walk-In di Toko):
	1. Pelanggan datang langsung ke toko hari itu juga (walk-in) dan langsung membawa barang sewa pulang.
	2. Wajib dicatat: Tersedia input manual jenis identitas jaminan fisik (misal: KTP Asli atas nama penyewa atau SIM A) tanpa pencatatan nomor identitas.
	3. Tanpa DP: Karena langsung disewa hari itu (Hari-H), transaksi wajib langsung bayar LUNAS 100% di kasir saat serah terima barang.
	4. Metode pembayaran untuk Pelunasan Total Sewa di kasir diselesaikan saat itu juga (pilihan: Tunai, QRIS, Transfer).
	5. Transaksi yang berhasil disimpan langsung menghasilkan transaksi sewa dengan status: Sudah Diambil dan Lunas.
•	Struktur Layout Formulir:
	- Kolom Kiri (65%): Memuat Kartu Informasi Pelanggan & Jadwal Sewa (pilihan pelanggan terdaftar atau tambah baru, tanggal sewa Hari-H, durasi sewa, serta tanggal selesai sewa otomatis s.d. 21.00 WIB) dan Kartu Katalog Barang & Paket (dipisahkan ke dalam dua tab: Barang Satuan dan Paket Penyewaan, dilengkapi pencarian dan filter kategori).
	- Kolom Kanan (35% - Sticky Panel): Memuat Keranjang Transaksi Sewa (dengan stepper kuantitas dan kalkulasi subtotal dinamis terhadap durasi sewa) serta Kartu Pembayaran Kasir Walk-In (input manual Jenis Identitas Jaminan Fisik saat serah terima barang diletakkan tepat di atas pilihan metode pembayaran tunai/QRIS/transfer, input uang diterima, kalkulasi kembalian, indikator status Lunas dan Sudah Diambil, serta tombol Selesaikan & Serahkan Barang tanpa tombol simpan draft).
	- Konfirmasi Transaksi Sewa Langsung: Saat tombol Selesaikan & Serahkan Barang ditekan, sistem memunculkan dialog konfirmasi untuk memastikan jaminan fisik telah diterima dan pembayaran lunas 100% di kasir sebelum transaksi disimpan dan unit fisik diserahkan.
32.	Setelah pembayaran pelunasan dicatat, sistem menampilkan konfirmasi Transaksi Berhasil yang memuat rincian transaksi, status pembayaran Lunas, status pengambilan Sudah Diambil, serta menyediakan tindakan untuk mencetak bukti (pop-up struk 58mm/80mm/A4), membuat transaksi baru, dan kembali ke menu Transaksi Penyewaan.
33.	Sistem menyediakan tombol kembali ke menu Transaksi Penyewaan pada halaman formulir Transaksi Langsung dan konfirmasi transaksi berhasil.
34.	Sistem menyediakan fitur Cetak Bukti/Struk pada halaman detail transaksi penyewaan dan halaman transaksi berhasil. Fitur ini menampilkan jendela pop-up di tengah layar yang memuat pilihan ukuran kertas (58 mm, 80 mm, atau A4), pilihan informasi yang ditampilkan (nama kasir, rincian pembayaran, serta syarat dan ketentuan), dan jumlah salinan, serta menyediakan tindakan cetak dan unduh PDF. Struk menampilkan status Belum Lunas beserta sisa tagihan apabila transaksi belum dilunasi.
35.	Sistem menjamin sinkronisasi data transaksi penyewaan antara Admin dan Owner:
•	Booking yang dilanjutkan menjadi Transaksi Penyewaan tetap terhubung secara utuh dengan booking asal tanpa perlu memasukkan ulang data pelanggan, barang atau paket, periode sewa, total harga, dan pembayaran DP yang telah diterima.
•	Data transaksi penyewaan, status pengambilan barang, pencatatan jaminan, dan pembayaran pelunasan tercatat pada satu sumber data yang sama dan dapat dipantau oleh Owner melalui menu Monitoring Transaksi dan Laporan sesuai hak aksesnya tanpa mengubah data operasional secara langsung.
•	Perubahan informasi pembayaran yang dilakukan melalui menu Transaksi Penyewaan langsung tercermin pada pemantauan dan laporan keuangan Owner secara konsisten.
36.	Menu Transaksi Penyewaan TIDAK BOLEH digunakan untuk menyelesaikan proses pengembalian barang. Proses pengembalian barang, pencatatan kondisi fisik barang setelah sewa, dan penentuan keterlambatan hanya dan wajib dilakukan melalui menu Pengembalian.
37.	Perbedaan Kebutuhan Fungsional antara Formulir Catat Booking dan Formulir Transaksi Langsung:
•	Tujuan & Waktu Transaksi: Catat Booking digunakan untuk pemesanan/reservasi barang di masa depan (H-2 atau lebih awal); Transaksi Langsung digunakan untuk pelanggan datang langsung ke toko (walk-in) pada hari H.
•	Status Pengambilan Awal: Catat Booking menghasilkan status 'Belum Diambil' (barang masih tersimpan di gudang toko hingga pelanggan datang mengambil); Transaksi Langsung menghasilkan status 'Sudah Diambil' secara instan karena serah terima fisik unit barang dilakukan langsung saat transaksi disimpan di kasir.
•	Pencatatan Jaminan Fisik: Formulir Catat Booking TIDAK memuat field jaminan fisik karena barang belum diambil; Formulir Transaksi Langsung WAJIB mencatat Jenis Identitas Jaminan Fisik (KTP, SIM, KTM ditulis manual tanpa nomor jaminan) karena serah terima unit barang dilakukan saat itu juga di kasir toko.
•	Ketentuan Pembayaran & DP: Catat Booking menerapkan aturan uang muka (DP minimal 25% untuk pemesanan H-2 atau lebih) dengan status Belum Lunas; Transaksi Langsung mewajibkan pembayaran penuh 100% di kasir saat serah terima sehingga status transaksi langsung menjadi 'Lunas' tanpa sisa tagihan.
•	Dukungan Status Draft: Catat Booking mendukung penyimpanan sebagai 'Draft' yang dapat disunting kembali kapan saja melalui fitur 'Lanjutkan Booking Draft'; Transaksi Langsung TIDAK memiliki status Draft, melainkan langsung tersimpan secara definitif dan langsung mengalokasikan stok unit menjadi 'Disewa'.
•	Bukti Transaksi yang Diterbitkan: Catat Booking mencetak 'Bukti Booking / Reservasi' yang memuat info nominal DP dan sisa tagihan yang harus dilunasi nanti saat serah terima barang; Transaksi Langsung mencetak 'Struk Bukti Sewa & Serah Terima' dengan status Lunas penuh.

2) Transaksi Penjualan
1.	Sistem menyediakan submenu Transaksi Penjualan untuk mencatat transaksi penjualan barang retail perlengkapan outdoor dan bahan habis pakai.
2.	Sistem menetapkan bahwa setiap transaksi penjualan barang di kasir wajib diselesaikan pembayarannya saat itu juga (cash-and-carry), sehingga setiap transaksi yang berhasil diproses secara otomatis berstatus 'Selesai' (Lunas 100%) tanpa menyisakan status belum lunas.
3.	Sistem menampilkan 3 Kartu Ringkasan (KPI) pada menu Transaksi Penjualan:
•	Transaksi Bulan Ini: Jumlah seluruh transaksi penjualan pada bulan berjalan.
•	Total Penjualan: Akumulasi nominal pendapatan kotor dari transaksi penjualan retail.
•	Transaksi Selesai: Jumlah transaksi penjualan yang telah lunas dan tuntas diserahkan kepada pembeli (menggantikan kartu 'Belum Lunas').
4.	Sistem menyediakan tabel daftar transaksi penjualan dengan struktur kolom yang terfokus: KODE, TANGGAL, PELANGGAN, BARANG, TOTAL, STATUS (menampilkan status Selesai dengan dot hijau beserta metode bayar Tunai/QRIS/Transfer), dan AKSI (memuat aksi Detail, Ubah, dan Hapus).
5.	Sistem menyediakan pengelolaan tindakan transaksi yang fleksibel pada setiap baris transaksi penjualan:
•	Read (Lihat Detail & Cetak Struk): Menampilkan jendela pop-up Detail Transaksi Penjualan yang memuat kode transaksi, waktu, kasir, pelanggan, rincian barang yang dibeli (nama, SKU, kategori, jumlah, harga satuan, dan subtotal), subtotal, diskon manual, total pembayaran, uang diterima, kembalian, serta tombol terintegrasi untuk mencetak struk (58 mm, 80 mm, atau A4). Fitur cetak struk disediakan langsung di dalam modal detail transaksi agar kolom AKSI pada tabel utama tetap ringkas, bersih, dan rapi.
•	Update (Ubah Pesanan): Apabila terjadi kesalahan input pesanan (barang belanjaan, kuantitas, pelanggan, atau pembayaran), kasir dapat menekan tombol 'Ubah' pada tabel. Sistem secara otomatis mengarahkan kasir kembali ke halaman formulir Transaksi Penjualan (`/admin/transaksi/jual/baru?edit=[id/kode]`) dengan data keranjang belanja dan rincian transaksi sebelumnya terisi kembali (pre-filled). Saat disimpan, sistem secara otomatis menghitung selisih stok barang (memulihkan stok lama dan memotong stok baru) secara akurat.
•	Delete (Hapus Transaksi): Memungkinkan Admin menghapus transaksi penjualan yang salah input dengan dialog konfirmasi, di mana sistem secara otomatis memulihkan (mengembalikan) jumlah stok seluruh barang yang bersangkutan ke inventaris retail toko.
6.	Ketika tombol "+ Transaksi penjualan" diklik, sistem membuka formulir Transaksi Penjualan pada halaman khusus (`/admin/transaksi/jual/baru`) dengan layout 2-kolom terintegrasi:
•	Kolom Kiri (65%):
	- Kartu Informasi Penjualan: Memuat kode transaksi otomatis (misal: TJ-0129), pemilihan pelanggan (pencarian pelanggan terdaftar atau opsi Pelanggan Umum untuk walk-in tanpa identitas), tanggal transaksi, dan nama kasir.
	- Kartu Katalog Barang Jual: Memuat pencarian nama barang atau SKU, filter pil kategori (Semua, Gas, Aksesoris, Pakaian, Perlengkapan, Alas Kaki), filter ketersediaan stok (Semua stok dan Stok ada), pengurutan (Nama A-Z, Nama Z-A, Harga Terendah/Tertinggi), kartu produk berlatar pastel dengan indikator ketersediaan stok real-time, serta navigasi paginasi.
•	Kolom Kanan (35% - Sticky Panel):
	- Kartu Keranjang Penjualan: Memuat daftar produk yang dipilih beserta stepper kuantitas (+/-), tombol hapus, kalkulasi subtotal per barang, dan total tagihan belanja.
	- Kartu Pembayaran: Memuat input diskon manual (Rp), input nominal uang diterima di kasir, pilihan metode pembayaran (Tunai, QRIS, Transfer), kalkulasi uang kembalian secara otomatis, indikator status Selesai (Lunas), serta tombol aksi "Proses pembayaran".
	- Konfirmasi Pembayaran Kasir: Saat tombol "Proses pembayaran" atau "Simpan Perubahan Transaksi" ditekan, sistem menampilkan dialog konfirmasi ringkasan penjualan (total tagihan, metode pembayaran, uang diterima, dan kembalian) sebelum stok fisik dipotong dan transaksi disimpan.
7.	Sistem memvalidasi ketersediaan stok sebelum transaksi disimpan untuk mencegah penjualan melebihi jumlah stok fisik yang ada di toko.
8.	Sistem mengurangi jumlah stok barang secara otomatis dan real-time berdasarkan jumlah barang yang terjual setelah pembayaran berhasil diproses.
9.	Setelah proses pembayaran berhasil, sistem menampilkan jendela pop-up konfirmasi Transaksi Berhasil yang memuat rincian transaksi, tombol Cetak Struk (pilihan ukuran kertas 58 mm, 80 mm, atau A4), tombol kembali ke tabel penjualan, serta tombol transaksi baru.
10.	Sistem menyediakan pencarian dan penyaringan transaksi penjualan berdasarkan kode transaksi, nama pelanggan, status transaksi, metode pembayaran, dan rentang tanggal transaksi.
11.	Sistem menjamin sinkronisasi data transaksi penjualan antara Admin dan Owner: Owner dapat memantau seluruh daftar transaksi penjualan retail, detail barang, dan pendapatan penjualan pada menu Monitoring Transaksi dan Laporan Penjualan secara konsisten tanpa izin untuk mengubah atau menghapus data transaksi.
G. Pengelolaan Pembayaran
1.	Sistem menyediakan fitur pencatatan pembayaran pada detail Transaksi Penyewaan dan Transaksi Penjualan.
2.	Sistem menghubungkan setiap pembayaran dengan transaksi terkait.
3.	Sistem menyediakan informasi total tagihan, jumlah pembayaran yang telah diterima, dan sisa pembayaran.
4.	Sistem menyediakan pencatatan pembayaran dengan metode tunai, QRIS, dan transfer.
5.	Sistem menyediakan informasi jenis pembayaran, seperti DP dan pelunasan.
6.	Sistem memungkinkan Admin mencatat pembayaran secara bertahap sesuai kebutuhan transaksi.
7.	Sistem menghitung sisa pembayaran secara otomatis setelah pembayaran dicatat.
8.	Sistem menampilkan status pembayaran, seperti Belum Dibayar, Belum Lunas, dan Lunas.
9.	Sistem menyimpan riwayat pembayaran yang meliputi tanggal, nominal, metode pembayaran, jenis pembayaran, dan pengguna yang mencatat.
10.	Sistem menyediakan informasi pembayaran pada detail transaksi sehingga tidak diperlukan menu pembayaran terpisah.
11.	Sistem menyediakan informasi pembayaran yang dapat digunakan Owner dalam pemantauan dan penyusunan laporan keuangan.

H. Pengelolaan Pengembalian
1.	Sistem menyediakan menu Pengembalian untuk mencatat dan mengelola pengembalian barang sewa, serta memantau masa sewa secara terpusat.
2.	Sistem menampilkan daftar transaksi penyewaan yang sedang berlangsung dan belum selesai dikembalikan (sewa aktif).
3.	Sistem menyediakan fitur Tracking Masa Sewa secara real-time pada setiap transaksi aktif di menu Pengembalian, meliputi:
•	Nama Customer.
•	Produk atau Paket yang disewa beserta jumlah unitnya.
•	Tanggal mulai sewa.
•	Tanggal jatuh tempo pengembalian.
•	Sisa waktu sewa yang dihitung secara otomatis berdasarkan tanggal jatuh tempo pengembalian dan tanggal saat ini (contoh: apabila Customer menyewa barang dan masa sewanya masih tersisa 3 hari kalender, sistem menampilkan keterangan masa sewa tersisa 3 hari).
•	Status masa sewa real-time:
	- Sedang Disewa: tanggal jatuh tempo pengembalian belum tiba.
	- Mendekati Jatuh Tempo: tanggal pengembalian mendekati batas waktu (misalnya H-1 atau hari-H jadwal pengembalian).
	- Terlambat: tanggal jatuh tempo pengembalian telah terlewati dan barang belum dikembalikan, dengan sistem menghitung dan menampilkan jumlah hari keterlambatan secara otomatis.
4.	Apabila barang telah selesai dikembalikan seluruhnya, status transaksi diperbarui menjadi Sudah Dikembalikan (atau Selesai) dan transaksi tersebut tidak lagi dihitung sebagai penyewaan aktif.
5.	Sistem menyediakan pencarian data pengembalian berdasarkan kode transaksi, nama pelanggan, dan tanggal pengembalian.
6.	Sistem menampilkan informasi barang yang harus dikembalikan berdasarkan transaksi penyewaan.
7.	Sistem menyediakan pencatatan tanggal dan waktu aktual pengembalian barang ketika barang fisik diserahkan oleh pelanggan di toko.
8.	Sistem menyediakan pencatatan jumlah barang yang dikembalikan.
9.	Sistem mendukung pencatatan pengembalian barang secara bertahap apabila barang tidak dikembalikan secara bersamaan.
10.	Sistem menyediakan pemeriksaan kondisi fisik barang ketika dikembalikan.
11.	Sistem menyediakan pencatatan barang yang rusak, hilang, atau tidak lengkap.
12.	Sistem menyediakan pencatatan biaya tambahan, seperti denda keterlambatan atau biaya kerusakan dan kehilangan barang, dengan nominal yang dapat diinput secara manual oleh Admin sesuai aturan perusahaan yang berlaku tanpa mengarang rumus denda baru.
13.	Sistem menyediakan kolom keterangan atau alasan untuk setiap biaya tambahan yang dicatat.
14.	Sistem menampilkan informasi keterlambatan pengembalian berdasarkan tanggal pengembalian yang telah ditentukan (pukul 21.00 WIB pada hari jatuh tempo).
15.	Sistem mengintegrasikan biaya tambahan akibat keterlambatan, kerusakan, atau kehilangan barang ke dalam rincian tagihan transaksi penyewaan terkait.
16.	Sistem menyediakan fitur pencatatan pembayaran biaya tambahan dengan metode pembayaran tunai, QRIS, atau transfer.
17.	Setelah pengembalian selesai, status transaksi, status stok barang, dan laporan terkait diperbarui secara otomatis.
18.	Sistem mencatat kondisi barang setelah dikembalikan untuk menentukan alur penanganan: Dicuci, Persiapan, Perawatan, atau Rusak.
19.	Sistem tidak langsung mengubah status barang menjadi Tersedia sebelum barang selesai diperiksa, dibersihkan, dan divalidasi kesiapannya untuk dapat disewakan kembali.
20.	Sistem mencatat pengembalian jaminan pelanggan setelah seluruh barang selesai diperiksa dan kewajiban pembayaran terkait telah diselesaikan.
21.	Sistem menyimpan riwayat pengembalian barang pada transaksi terkait.
22.	Sistem menyimpan riwayat pencatatan biaya tambahan beserta nominal, alasan, tanggal, dan pengguna yang mencatat.
23.	Sistem menampilkan rincian barang penyusun Paket Penyewaan yang harus dikembalikan berdasarkan transaksi penyewaan.
24.	Sistem memungkinkan Admin mencatat pengembalian dan pemeriksaan kondisi setiap barang penyusun paket secara terpisah.
25.	Sistem menampilkan informasi barang penyusun paket yang belum dikembalikan, rusak, hilang, atau tidak lengkap.
26.	Sistem memperhitungkan penyelesaian pengembalian berdasarkan seluruh barang penyusun paket yang disewa pelanggan.

Aturan Bisnis Tambahan
Batas waktu pengembalian: Pengembalian barang mengikuti tanggal pengembalian yang telah ditentukan. Pelanggan dapat mengembalikan barang kapan saja pada tanggal tersebut selama masih dalam jam operasional toko, yaitu pukul 08.00–21.00 WIB. Pengembalian setelah pukul 21.00 WIB atau melewati tanggal pengembalian dianggap terlambat dan mengikuti ketentuan biaya keterlambatan yang berlaku.

I. Monitoring Transaksi dan Aktivitas Penyewaan
1.	Sistem menyediakan fitur pemantauan transaksi penyewaan yang sedang berlangsung.
2.	Sistem menampilkan daftar barang yang masih berada pada pelanggan.
3.	Sistem menampilkan informasi pelanggan, barang yang disewa, tanggal pengambilan, dan jadwal pengembalian.
4.	Sistem menampilkan status penyewaan, seperti Sedang Disewa, Menunggu Pengembalian, Terlambat, dan Selesai.
5.	Sistem menampilkan informasi transaksi penyewaan yang telah melewati batas waktu pengembalian beserta lama keterlambatannya.
6.	Sistem menyediakan informasi status pengembalian barang, yaitu Belum Dikembalikan, Dikembalikan Sebagian, dan Dikembalikan Seluruhnya.
7.	Sistem menampilkan informasi status pembayaran transaksi penyewaan beserta sisa tagihan yang belum dibayarkan.
8.	Sistem menampilkan informasi biaya tambahan apabila terdapat denda keterlambatan, kerusakan, atau kehilangan barang.
9.	Sistem menyediakan pencarian dan penyaringan transaksi berdasarkan kode transaksi, nama pelanggan, status penyewaan, dan periode penyewaan.
10.	Sistem menyediakan informasi riwayat penyewaan yang telah selesai.
11.	Sistem menampilkan riwayat aktivitas transaksi penyewaan, mulai dari pengambilan barang hingga pengembalian barang.
12.	Sistem memungkinkan Admin memantau aktivitas penyewaan melalui data transaksi dan pengembalian.
13.	Sistem memungkinkan Owner memantau transaksi penyewaan dan penjualan melalui submenu Monitoring Transaksi tanpa mengubah data operasional secara langsung.

J. Pengelolaan Data Pelanggan
1.	Sistem menyediakan menu Data Pelanggan untuk menyimpan dan menampilkan informasi pelanggan.
2.	Sistem secara otomatis menyimpan data pelanggan baru ketika Admin mencatat pelanggan melalui menu Booking, Transaksi Penyewaan, atau Transaksi Penjualan, maupun melalui formulir tambah pelanggan. Data pelanggan yang telah terdaftar dapat digunakan kembali pada pencatatan berikutnya.
3.	Sistem menyediakan kode pelanggan secara otomatis sebagai identitas setiap pelanggan.
4.	Sistem menyediakan formulir tambah pelanggan baru yang sederhana dan efisien:
•	Formulir tambah pelanggan hanya memerlukan dua isian wajib: Nama Pelanggan (wajib) dan Nomor WhatsApp / Telepon (wajib).
•	Nomor identitas seperti KTP atau SIM tidak diperlukan dan tidak dicatat pada data maupun formulir pelanggan.
•	Informasi tambahan lainnya seperti alamat domisili atau asal kampus/instansi bersifat opsional dan tidak diwajibkan pada formulir tambah pelanggan.
•	Jaminan penyewaan tidak dicatat pada formulir tambah pelanggan dan tidak menjadi bagian dari data identitas pelanggan. Pencatatan jaminan fisik dilakukan secara eksklusif pada menu Transaksi saat serah terima barang sewa dengan menuliskan Jenis Identitas Jaminan secara manual tanpa memerlukan nomor identitas jaminan.
5.	Sistem menampilkan informasi pelanggan yang meliputi kode pelanggan, nama, dan nomor telepon, serta informasi opsional lainnya jika tersedia.
6.	Sistem menyediakan pencarian pelanggan berdasarkan kode pelanggan, nama, dan nomor telepon.
7.	Sistem menampilkan jumlah transaksi yang pernah dilakukan setiap pelanggan dengan menghitung satu rangkaian booking yang dilanjutkan menjadi transaksi penyewaan sebagai satu transaksi penyewaan.
8.	Sistem menampilkan riwayat transaksi penyewaan dan penjualan setiap pelanggan.
9.	Sistem menghubungkan data pelanggan dengan booking dan transaksi terkait.
10.	Sistem mencegah pencatatan pelanggan yang sama secara berulang apabila data pelanggan tersebut telah tersedia.
11.	Sistem memungkinkan Admin memilih data pelanggan yang telah terdaftar ketika mencatat booking atau transaksi tanpa perlu memasukkan ulang informasi pelanggan.
12.	Sistem menyediakan detail informasi pelanggan beserta riwayat transaksinya.
13.	Sistem menjamin sinkronisasi data pelanggan antara Admin dan Owner:
•	Data pelanggan yang digunakan pada modul Booking, Transaksi, dan Laporan mengacu pada sumber data yang sama (single source of truth).
•	Nama dan nomor WhatsApp / telepon pelanggan ditampilkan secara konsisten pada seluruh antarmuka operasional Admin serta antarmuka pemantauan dan laporan Owner.
•	Sistem tidak membuat data pelanggan terpisah antara Admin dan Owner.

K. Pengelolaan Pengeluaran
1.	Sistem menyediakan menu Pengeluaran untuk mencatat dan mengelola biaya operasional perusahaan.
2.	Sistem menyediakan pencatatan pengeluaran yang meliputi nama atau keterangan pengeluaran, kategori, tanggal, nominal, metode pembayaran, dan informasi pendukung lainnya.
3.	Sistem menyediakan fitur tambah, lihat, dan ubah data pengeluaran sesuai hak akses pengguna.
4.	Sistem menyediakan pengelompokan pengeluaran berdasarkan kategori.
5.	Sistem menyediakan pengelolaan kategori pengeluaran yang memungkinkan Owner menambah, mengubah, dan menonaktifkan kategori.
6.	Sistem memungkinkan Admin memilih kategori yang telah tersedia ketika mencatat pengeluaran.
7.	Sistem menyediakan pencarian dan penyaringan data pengeluaran berdasarkan kategori dan periode.
8.	Sistem menampilkan total pengeluaran berdasarkan periode tertentu.
9.	Sistem menampilkan rincian pengeluaran berdasarkan masing-masing kategori.
10.	Sistem menyediakan informasi status pembayaran pengeluaran untuk membedakan pengeluaran yang sudah dibayar dan belum dibayar.
11.	Sistem menyimpan riwayat perubahan data pengeluaran, termasuk informasi perubahan dan pengguna yang melakukan perubahan.
12.	Sistem menyediakan informasi pengeluaran yang dapat digunakan dalam pemantauan Owner dan penyusunan Laporan Keuangan.
13.	Sistem menyediakan detail data pengeluaran yang telah dicatat agar dapat ditinjau kembali oleh pengguna sesuai hak aksesnya.
14.	Sistem menyediakan pengelolaan kategori pengeluaran (Kelola Kategori) yang dapat diakses oleh Admin maupun Owner untuk menambah, mengubah nama, mengaktifkan atau menonaktifkan, dan menghapus kategori, dengan fitur pembatalan penghapusan sesaat setelah kategori dihapus.
15.	Sistem menyamakan hak akses Admin dan Owner pada menu Pengeluaran, termasuk formulir pencatatan pengeluaran dan tampilan daftar pengeluaran.

L. Pengelolaan Laporan
1.	Sistem menyediakan menu Laporan yang hanya dapat diakses oleh Owner.
2.	Sistem menyediakan penyaringan laporan berdasarkan periode tertentu.
3.	Sistem menyediakan fitur melihat dan mencetak atau mengekspor laporan sesuai kebutuhan perusahaan.
4.	Sistem menyediakan pilihan jenis periode laporan Harian dan Bulanan. Pada periode Harian pengguna memilih tanggal tertentu, sedangkan pada periode Bulanan pengguna memilih bulan tertentu, dengan navigasi ke periode sebelumnya atau berikutnya. Periode tidak dapat melebihi hari atau bulan berjalan.
5.	Sistem membedakan fitur Cetak dan Unduh pada setiap laporan. Cetak menghasilkan keluaran berupa kertas melalui printer, sedangkan Unduh menyimpan laporan sebagai berkas di perangkat pengguna.
6.	Pada fitur Cetak, sistem menampilkan jendela pop-up pengaturan cetak yang memuat pilihan ukuran kertas (A4 atau Letter), orientasi (potret atau lanskap), isi cetakan (ringkasan angka, rincian tabel, serta kop toko dan kolom tanda tangan), jumlah salinan, dan pratinjau halaman.
7.	Pada fitur Unduh, sistem menampilkan jendela pop-up pengaturan unduhan yang memuat pilihan format berkas (PDF, Excel, atau CSV), pilihan isi berkas (ringkasan dan rincian, atau rincian saja, kecuali CSV yang hanya memuat rincian), serta pratinjau nama berkas yang dibuat otomatis berdasarkan jenis laporan dan periode.

1) Laporan Keuangan
1.	Sistem menampilkan rekapitulasi pendapatan dari transaksi penyewaan dan penjualan.
2.	Sistem menampilkan rekapitulasi pembayaran yang telah diterima.
3.	Sistem menampilkan rekapitulasi pengeluaran perusahaan.
4.	Sistem menampilkan ringkasan selisih antara pendapatan yang diterima dan pengeluaran yang dicatat.
5.	Sistem menampilkan rincian pendapatan dan pengeluaran berdasarkan periode tertentu.
6.	Sistem membedakan jumlah tagihan transaksi dengan jumlah pembayaran yang benar-benar telah diterima.
7.	Sistem menampilkan rincian pendapatan berdasarkan jenis transaksi, yaitu penyewaan dan penjualan.
8.	Sistem menampilkan rincian pengeluaran berdasarkan kategori yang telah ditentukan.
9.	Sistem menampilkan rekapitulasi penerimaan tambahan, seperti denda keterlambatan, biaya kerusakan, dan biaya kehilangan barang secara terpisah dari pendapatan penyewaan.
10.	Sistem menampilkan jumlah pembayaran yang masih belum diterima atau belum dilunasi.
11.	Sistem menyediakan penyaringan laporan berdasarkan rentang tanggal atau periode tertentu.
12.	Sistem menyediakan fitur pencetakan dan pengunduhan laporan keuangan.
13.	Sistem membatasi akses Laporan Keuangan hanya kepada Owner sesuai dengan hak akses yang ditetapkan.
14.	Sistem tidak memperhitungkan booking yang Dibatalkan sebagai pendapatan sewa yang terealisasi; apabila terdapat penerimaan DP pada booking yang Dibatalkan, penerimaan tersebut dicatat secara terpisah sebagai penerimaan dana hangus (pendapatan lain-lain non-sewa) dan tidak dihitung ke dalam omzet sewa aktif.

2) Laporan Penyewaan
1.	Sistem menampilkan rekapitulasi transaksi penyewaan berdasarkan periode tertentu.
2.	Sistem menampilkan jumlah transaksi penyewaan.
3.	Sistem menampilkan barang yang paling sering disewa.
4.	Sistem menampilkan pendapatan dari transaksi penyewaan.
5.	Sistem menampilkan riwayat penyewaan berdasarkan pelanggan dan barang.
6.	Sistem menampilkan rincian jumlah barang yang disewa berdasarkan periode tertentu.
7.	Sistem menampilkan frekuensi penyewaan setiap barang.
8.	Sistem menampilkan rincian nilai transaksi penyewaan berdasarkan periode tertentu.
9.	Sistem menampilkan status pembayaran transaksi penyewaan, meliputi belum dibayar, belum lunas, dan lunas.
10.	Sistem menampilkan informasi keterlambatan pengembalian barang berdasarkan transaksi penyewaan.
11.	Sistem menampilkan rekapitulasi penerimaan tambahan dari denda keterlambatan, kerusakan, dan kehilangan barang secara terpisah dari pendapatan penyewaan.
12.	Sistem menyediakan pencarian dan penyaringan laporan berdasarkan periode, pelanggan, barang, dan status transaksi.
13.	Sistem menyediakan fitur pencetakan dan pengunduhan laporan penyewaan.
14.	Sistem membatasi akses Laporan Penyewaan sesuai dengan hak akses pengguna yang ditetapkan.
15.	Sistem menampilkan daftar Paket Penyewaan yang pernah disewa berdasarkan periode tertentu.
16.	Sistem menampilkan Paket Penyewaan yang paling sering disewa.
17.	Sistem menampilkan jumlah penyewaan dan pendapatan berdasarkan masing-masing Paket Penyewaan.
18.	Sistem tidak memperhitungkan booking yang Dibatalkan sebagai transaksi penyewaan aktif maupun pendapatan sewa yang terealisasi, namun menyajikan tab dan bagian khusus 'Riwayat Booking Dibatalkan' pada Laporan Penyewaan Owner (`/owner/laporan/penyewaan`) yang memuat data kode booking, nama dan kontak pelanggan, tanggal pembatalan, alasan pembatalan wajib, pelaku pembatalan, serta rekapitulasi dana DP hangus untuk keperluan audit trail, analisis konversi, dan pemantauan performa operasional.

3) Laporan Penjualan
1.	Sistem menampilkan rekapitulasi transaksi penjualan berdasarkan periode tertentu.
2.	Sistem menampilkan jumlah produk yang terjual.
3.	Sistem menampilkan produk yang paling banyak terjual.
4.	Sistem menampilkan pendapatan dari transaksi penjualan.
5.	Sistem menampilkan riwayat penjualan berdasarkan pelanggan dan produk.
6.	Sistem menampilkan rincian jumlah transaksi penjualan berdasarkan periode tertentu.
7.	Sistem menampilkan total pendapatan penjualan berdasarkan periode tertentu.
8.	Sistem menampilkan rincian produk yang terjual beserta jumlah dan nilai penjualannya.
9.	Sistem menyediakan pengurutan produk berdasarkan jumlah produk yang terjual.
10.	Sistem menyediakan pencarian dan penyaringan laporan penjualan berdasarkan periode, pelanggan, dan produk.
11.	Sistem menyediakan fitur pencetakan dan pengunduhan laporan penjualan.
12.	Sistem membatasi akses Laporan Penjualan sesuai dengan hak akses pengguna yang ditetapkan.

4) Laporan Stok
1.	Sistem menampilkan jumlah keseluruhan stok barang.
2.	Sistem menampilkan jumlah barang berdasarkan kondisi fisik atau status operasional.
3.	Sistem menampilkan informasi barang yang tersedia, disewa, dicuci, dalam persiapan, rusak, dan perawatan.
4.	Sistem menampilkan riwayat penambahan, pengurangan, dan penyesuaian stok.
5.	Sistem menampilkan informasi pergerakan stok berdasarkan periode tertentu.
6.	Sistem menampilkan rincian jumlah stok berdasarkan kategori dan jenis barang.
7.	Sistem menampilkan informasi barang yang sedang dialokasikan untuk booking pada periode tertentu.
8.	Sistem menampilkan informasi barang yang sedang disewa dan belum dikembalikan.
9.	Sistem menyediakan pencarian dan penyaringan laporan stok berdasarkan nama barang, kategori, status operasional, dan periode.
10.	Sistem menampilkan riwayat perubahan kondisi atau status operasional barang.
11.	Sistem menyediakan fitur pencetakan dan pengunduhan laporan stok.
12.	Sistem membatasi akses Laporan Stok sesuai dengan hak akses pengguna yang ditetapkan.

5) Laporan Pelanggan
1.	Sistem menampilkan daftar pelanggan yang pernah melakukan transaksi.
2.	Sistem menampilkan jumlah transaksi setiap pelanggan.
3.	Sistem menampilkan pelanggan berdasarkan frekuensi transaksi.
4.	Sistem menampilkan riwayat transaksi penyewaan dan penjualan setiap pelanggan.
5.	Sistem menyediakan penyaringan data pelanggan berdasarkan periode transaksi.
6.	Sistem menampilkan rincian jumlah transaksi penyewaan dan penjualan setiap pelanggan secara terpisah.
7.	Sistem menampilkan total nilai transaksi setiap pelanggan berdasarkan transaksi penyewaan dan penjualan.
8.	Sistem menyediakan pengurutan daftar pelanggan berdasarkan jumlah transaksi atau total nilai transaksi.
9.	Sistem menampilkan informasi pelanggan yang paling sering melakukan transaksi dalam periode tertentu.
10.	Sistem menyediakan detail laporan pelanggan yang mencakup informasi pelanggan dan riwayat transaksinya.
11.	Sistem menyediakan fitur pencetakan dan pengunduhan laporan pelanggan.
12.	Sistem membatasi akses Laporan Pelanggan hanya kepada Owner sesuai dengan hak akses yang ditetapkan.

M. Pengelolaan Riwayat Aktivitas
1.	Sistem menyediakan menu Riwayat Aktivitas untuk mencatat aktivitas pengguna selama menggunakan sistem.
2.	Sistem mencatat aktivitas penambahan, perubahan, dan penghapusan data.
3.	Sistem menyimpan informasi jenis aktivitas, pengguna yang melakukan aktivitas, waktu aktivitas, dan data yang terkait.
4.	Sistem menyimpan informasi perubahan data sebelum dan sesudah dilakukan perubahan.
5.	Sistem mewajibkan pengguna mengisi alasan ketika melakukan penghapusan data tertentu.
6.	Sistem menyimpan riwayat penghapusan beserta alasan yang diberikan pengguna.
7.	Sistem menyediakan pencarian dan penyaringan riwayat aktivitas berdasarkan pengguna, jenis aktivitas, dan periode.
8.	Sistem menyediakan akses riwayat aktivitas bagi Admin dan Owner sesuai hak aksesnya.
9.	Sistem mempertahankan riwayat aktivitas meskipun data tertentu telah dihapus dari tampilan operasional.
10.	Sistem menerapkan mekanisme penghapusan yang tidak langsung menghilangkan riwayat data penting, khususnya pada booking dan transaksi.
11.	Sistem mencatat aktivitas pembatalan booking dan transaksi beserta alasan serta pengguna yang melakukan tindakan tersebut.
12.	Sistem mencatat aktivitas perubahan status penting, seperti perubahan status booking, penyewaan, pengembalian, dan kondisi barang.
13.	Sistem menyediakan detail riwayat aktivitas agar pengguna yang memiliki hak akses dapat melihat informasi aktivitas secara lebih lengkap.
14.	Sistem melindungi riwayat aktivitas agar tidak dapat diubah atau dihapus secara sembarangan oleh pengguna.
15.	Sistem mencatat aktivitas login dan logout pengguna sebagai bagian dari pemantauan penggunaan sistem.

N. Pengelolaan Pengguna dan Hak Akses
1.	Sistem menyediakan menu Kelola Pengguna yang hanya dapat diakses oleh Owner.
2.	Sistem menyediakan submenu Daftar Pengguna untuk melihat dan mengelola akun pengguna.
3.	Sistem menyediakan fitur pembuatan akun Admin oleh Owner.
4.	Sistem menyediakan fitur melihat, mengubah, menonaktifkan, dan mengelola akun pengguna sesuai kewenangan Owner.
5.	Sistem menyediakan submenu Hak Akses untuk mengatur hak akses pengguna berdasarkan peran.
6.	Sistem membedakan hak akses Admin dan Owner terhadap menu dan fitur sistem.
7.	Sistem membatasi akses terhadap Laporan dan pengelolaan pengguna sesuai kewenangan Owner.
8.	Sistem menyediakan pengaturan hak akses khusus apabila diperlukan untuk pengguna tertentu, misalnya akses laporan keuangan bagi pegawai yang dipercaya perusahaan.
9.	Sistem tidak menyediakan akun khusus bagi staf persiapan dan staf pencucian karena perubahan kondisi barang dikoordinasikan kepada Admin untuk diperbarui di dalam sistem.
10.	Sistem menyediakan informasi akun pengguna yang meliputi nama, nama pengguna, peran, dan status akun.
11.	Sistem menyediakan fitur pencarian dan penyaringan akun pengguna berdasarkan nama, peran, dan status akun.
12.	Sistem menyediakan fitur pengaturan ulang kata sandi akun pengguna oleh Owner apabila diperlukan.
13.	Sistem membatasi pengguna agar hanya dapat mengakses menu dan fitur sesuai hak akses yang diberikan.
14.	Sistem mencatat riwayat perubahan akun dan hak akses pengguna, termasuk pengguna yang melakukan perubahan dan waktu perubahan.
15.	Sistem menyediakan mekanisme penonaktifan akun agar pengguna yang sudah tidak memiliki kewenangan tidak dapat masuk ke dalam sistem.
16.	Sistem menyediakan akun Owner awal yang dibuat melalui proses konfigurasi awal sistem dan dapat digunakan untuk mengelola akun pengguna lainnya.
17.	Sistem menyediakan dialog konfirmasi keluar akun (logout) saat pengguna menekan tombol Keluar baik pada kartu profil desktop sidebar yang diperluas, tombol ikon logout di bagian bawah sidebar mode kuncup/collapsed (lebar kompak 62px dengan pembatas garis), maupun navigasi mobile, untuk mencegah sesi berakhir secara tidak sengaja di tengah operasional kasir.

O. Profil Akun
1.	Sistem menyediakan menu Profil Akun bagi setiap pengguna yang telah login.
2.	Sistem menampilkan informasi akun pengguna yang sedang login.
3.	Sistem menyediakan fitur mengubah informasi profil sesuai kebutuhan.
4.	Sistem menyediakan fitur mengubah password akun.
5.	Sistem memastikan setiap pengguna hanya dapat mengelola profil akunnya sendiri.
6.	Sistem menampilkan informasi akun yang meliputi nama pengguna, nama lengkap, dan peran pengguna.
7.	Sistem menyediakan fitur melihat password baru yang sedang dimasukkan untuk membantu pengguna memastikan ketepatan pengetikan.
8.	Sistem mewajibkan pengguna memasukkan password lama sebelum melakukan perubahan password.
9.	Sistem menyediakan fitur konfirmasi password baru untuk memastikan kesesuaian password yang dimasukkan.
10.	Sistem menampilkan informasi perubahan profil setelah berhasil disimpan.

P. Audit Hubungan Antar-Menu dan Matriks Sinkronisasi Admin-Owner

1. Hubungan Antar-Menu Sistem
Setiap menu dalam sistem saling terintegrasi berdasarkan alur data bisnis operasional penyewaan dan penjualan outdoor. Hubungan, aliran data, dan dampak perubahan antar-menu diatur sebagai berikut:

1) Menu Data Pelanggan
• Data yang Digunakan: Nama, nomor telepon (WhatsApp), serta data opsional (alamat domisili, catatan).
• Data yang Dibuat / Diubah: Profil data pelanggan dan kode unik pelanggan (CUST-xxxx).
• Menu Sumber Data: Formulir Tambah Pelanggan di menu Data Pelanggan, atau pencatatan pelanggan baru saat transaksi di menu Booking, Transaksi Penyewaan, dan Transaksi Penjualan.
• Menu Tujuan / Penerima Pembaruan: Menu Booking, Transaksi Penyewaan, Transaksi Penjualan, Pengembalian, dan Laporan Pelanggan (Owner).
• Dampak Status & Sinkronisasi: Perubahan nama atau kontak pelanggan secara terpusat langsung merefleksikan seluruh histori pemesanan dan transaksi aktif tanpa membuat duplikasi data pelanggan (single source of truth).
• Hak Akses: Admin (CRUD operasional), Owner (Read, Monitoring, dan Laporan).

2) Menu Data Barang & Stok
• Data yang Digunakan: Data barang, variasi/spesifikasi (merek, ukuran, kapasitas, jenis), unit fisik barang sewa dengan kode unik, komposisi Paket Penyewaan, harga sewa per hari, dan harga jual produk.
• Data yang Dibuat / Diubah: Penambahan unit barang baru, pembaruan kuantitas barang jual, serta perubahan kondisi operasional unit fisik (Tersedia, Disewa, Dicuci, Persiapan, Perawatan, Rusak).
• Menu Sumber Data: Submenu Semua Barang, Submenu Kategori Barang, dan halaman Detail Unit.
• Menu Tujuan / Penerima Pembaruan: Menu Booking (pemeriksaan ketersediaan stok periode sewa), Transaksi Penyewaan (alokasi unit fisik saat serah terima), Pengembalian (pemeriksaan kondisi pasca-sewa), Dashboard Admin & Owner, serta Laporan Stok.
• Dampak Status & Sinkronisasi:
  - Booking berstatus Selesai mengunci alokasi ketersediaan stok pada rentang Tanggal Mulai Sewa hingga Tanggal Selesai Sewa.
  - Booking yang Dibatalkan langsung melepaskan alokasi stok untuk periode tersebut sehingga unit fisik kembali tersedia bagi pemesanan lain.
  - Serah terima barang di Transaksi Penyewaan mengubah kondisi fisik unit menjadi Disewa.
  - Pengembalian barang di menu Pengembalian mengubah kondisi fisik unit menjadi Dicuci, Persiapan, atau Perawatan; sistem melarang unit otomatis berubah menjadi Tersedia sebelum pemeriksaan fisik tuntas.
• Hak Akses: Admin (kelola operasional stok, penambahan unit, dan pembaruan kondisi), Owner (monitoring stok, kelola paket sewa, dan laporan stok).

3) Menu Booking
• Data yang Digunakan: Data Pelanggan, Katalog Barang & Paket, Tanggal Booking, Tanggal Mulai Sewa, dan Durasi Sewa.
• Data yang Dibuat / Diubah: Kode booking otomatis (BK-xxxx), Tanggal Selesai Sewa (otomatis = Tanggal Mulai Sewa + Durasi Sewa), total biaya sewa, DP wajib (25% jika selisih hari >= 2 hari, 0% jika <= 1 hari), nominal DP disepakati, pembayaran DP diterima riil, status booking (Draft, Selesai, Dibatalkan), serta ringkasan metrik pemantauan operasional (Selesai, Draft, Dibatalkan, dan Pengambilan Hari Ini).
• Menu Sumber Data: Formulir Catat Booking di menu Booking.
• Menu Tujuan / Penerima Pembaruan: Menu Transaksi Penyewaan (khusus booking berstatus Selesai), Dashboard Admin, Dashboard Owner, Laporan Keuangan (pencatatan DP / dana hangus), dan Riwayat Aktivitas.
• Dampak Status & Sinkronisasi:
  - Draft: Booking belum final, tidak mengalokasikan stok dan tidak dapat diproses ke transaksi.
  - Selesai: Kesepakatan dan DP telah diterima; alokasi stok diamankan pada periode sewa; data siap diteruskan ke Transaksi Penyewaan.
  - Dibatalkan: DILARANG diproses ke Transaksi Penyewaan; alokasi stok periode sewa langsung dilepaskan; riwayat pembayaran DP dicatat sebagai dana yang tidak dikembalikan (penerimaan terkait booking); tetap tersimpan sebagai riwayat dan tidak dihitung sebagai transaksi sewa aktif atau pendapatan sewa terealisasi.
• Hak Akses: Admin (CRUD operasional booking), Owner (monitoring data booking real-time, laporan, dan pembatalan berwenang).

4) Menu Transaksi Penyewaan
• Data yang Digunakan: Booking berstatus Selesai (atau input transaksi langsung di toko), data fisik barang/paket, dan jenis identitas fisik jaminan yang ditulis secara manual tanpa nomor jaminan.
• Data yang Dibuat / Diubah: Kode transaksi penyewaan (TRX-xxxx), tanggal dan waktu aktual pengambilan barang, pencatatan jaminan fisik (jenis jaminan ditulis manual), status pengambilan (Sudah Diambil), kondisi unit menjadi Disewa, pembayaran pelunasan sisa tagihan sewa, dan status pembayaran (Lunas / Belum Lunas).
• Menu Sumber Data: Pemilihan booking berstatus Selesai yang dilakukan di dalam menu Transaksi Penyewaan (atau transaksi langsung di toko), bukan melalui tombol aksi di menu Booking.
• Menu Tujuan / Penerima Pembaruan: Menu Pengembalian (antrean tracking masa sewa), Monitoring Transaksi, Dashboard Admin & Owner, Laporan Penyewaan, dan Laporan Keuangan.
• Dampak Status & Sinkronisasi:
  - Menghubungkan transaksi dengan booking asal secara utuh tanpa input ulang data.
  - Pembayaran pada menu ini hanya melayani pelunasan sisa tagihan sewa (tidak ada input DP baru).
  - Melarang penyelesaian proses pengembalian barang pada menu ini.
• Hak Akses: Admin (pencatatan serah terima fisik barang, pencatatan jaminan, pelunasan), Owner (monitoring transaksi real-time dan laporan).

5) Menu Pengembalian & Tracking Masa Sewa
• Data yang Digunakan: Data transaksi penyewaan aktif (sedang disewa) yang bersumber dari menu Transaksi Penyewaan.
• Data yang Dibuat / Diubah: Sisa hari masa sewa (otomatis), status masa sewa (Sedang Disewa, Mendekati Jatuh Tempo, Terlambat beserta jumlah hari keterlambatan), tanggal dan waktu aktual pengembalian, kondisi fisik barang pasca-sewa, pencatatan denda/biaya tambahan, pengembalian jaminan pelanggan, dan status transaksi menjadi Sudah Dikembalikan / Selesai.
• Menu Sumber Data: Transaksi Penyewaan aktif.
• Menu Tujuan / Penerima Pembaruan: Menu Data Barang & Stok (unit fisik masuk status Dicuci/Persiapan/Perawatan), Menu Pembayaran (biaya denda/kerusakan), Dashboard Admin & Owner (keterlambatan & pengembalian hari ini), Laporan Penyewaan, dan Laporan Keuangan.
• Dampak Status & Sinkronisasi:
  - Mengakhiri status penyewaan aktif pada transaksi terkait.
  - Melepaskan status Disewa pada unit fisik barang.
  - Mengembalikan jaminan pelanggan setelah seluruh unit diperiksa dan kewajiban biaya diselesaikan.
• Hak Akses: Admin (pemeriksaan fisik barang, input biaya tambahan/denda, pengembalian jaminan), Owner (monitoring pengembalian dan laporan).

6) Menu Pembayaran (Terintegrasi)
• Data yang Digunakan: Tagihan dari Booking (DP), Transaksi Penyewaan (Pelunasan), Transaksi Penjualan, dan Pengembalian (Biaya Tambahan / Denda).
• Data yang Dibuat / Diubah: Nominal pembayaran aktual yang diterima, metode pembayaran (Tunai, QRIS, Transfer), jenis pembayaran, dan status pembayaran transaksi.
• Menu Sumber Data: Terintegrasi pada modul Booking, Transaksi Penyewaan, Transaksi Penjualan, dan Pengembalian (tanpa menu terpisah).
• Menu Tujuan / Penerima Pembaruan: Dashboard Admin & Owner (arus kas riil masuk), Laporan Keuangan (Owner).
• Dampak Status & Sinkronisasi: Memastikan pemisahan tegas antara nilai kontrak/tagihan dengan kas riil yang benar-benar telah diterima toko.
• Hak Akses: Admin (pencatatan penerimaan uang), Owner (monitoring penerimaan dan audit laporan keuangan).

7) Menu Pengeluaran
• Data yang Digunakan: Kategori pengeluaran, nominal biaya, tanggal pengeluaran, keterangan operasional, dan metode pembayaran.
• Data yang Dibuat / Diubah: Catatan transaksi pengeluaran operasional dan kategori pengeluaran (Kelola Kategori).
• Menu Sumber Data: Formulir pencatatan pengeluaran di menu Pengeluaran.
• Menu Tujuan / Penerima Pembaruan: Dashboard Admin, Dashboard Owner, dan Laporan Keuangan (Owner).
• Dampak Status & Sinkronisasi: Mengurangi laba bersih operasional pada laporan keuangan dan grafik arus kas Dashboard Owner.
• Hak Akses: Admin dan Owner memiliki hak yang sama untuk mencatat pengeluaran dan mengelola kategori pengeluaran.

8) Dashboard (Admin & Owner)
• Data yang Digunakan: Ringkasan operasional real-time dari seluruh modul (Booking, Transaksi, Pengembalian, Stok, Pembayaran, Pengeluaran).
• Menu Sumber Data: Seluruh basis data operasional sistem.
• Menu Tujuan / Penerima Pembaruan: Navigasi cepat dan penanganan operasional (Admin) serta evaluasi performa bisnis (Owner).
• Dampak Status & Sinkronisasi:
  - Dashboard Admin menampilkan antrean tugas operasional (booking perlu diproses, jadwal pengambilan, jadwal pengembalian hari ini, keterlambatan sewa, stok belum siap).
  - Dashboard Owner menampilkan indikator keuangan (pendapatan kas riil, pengeluaran, laba bersih, transaksi aktif, perbandingan pendapatan, produk terlaris).
  - Booking Dibatalkan ditampilkan sebagai metrik pemantauan terpisah dan tidak masuk ke dalam pendapatan terealisasi.
• Hak Akses: Admin (Dashboard Admin), Owner (Dashboard Owner).

9) Menu Laporan (Owner)
• Data yang Digunakan: Data historis terintegrasi (Keuangan, Penyewaan, Penjualan, Stok, dan Pelanggan).
• Menu Sumber Data: Basis data terpusat seluruh transaksi.
• Menu Tujuan / Penerima Pembaruan: Layar tinjauan laporan, dokumen Cetak fisik, dan berkas Unduh (PDF, Excel, CSV) eksklusif bagi Owner.
• Dampak Status & Sinkronisasi: Menyediakan informasi akurat tanpa manipulasi data untuk analisis performa perusahaan.
• Hak Akses: Eksklusif Owner.

2. Matriks Sinkronisasi Admin dan Owner
Untuk menjamin integritas data dan mencegah ketidakkonsistenan antar-peran, sistem menetapkan prinsip sinkronisasi berikut:
1. Satu Sumber Kebenaran Data (Single Source of Truth): Seluruh modul operasional Admin dan modul pemantauan/laporan Owner membaca dan menulis pada basis data terpusat yang sama.
2. Konsistensi Status Real-Time: Perubahan status data (misalnya booking berubah menjadi Selesai atau Dibatalkan; transaksi menjadi Sudah Diambil; atau pengembalian menjadi Terlambat) secara langsung tercermin pada tampilan Admin maupun Owner tanpa jeda (zero inconsistency).
3. Pencegahan Duplikasi Data: Sistem melarang pembuatan data ganda atau rekaman bayangan (shadow records) untuk keperluan User (Admin) maupun Owner. Data pelanggan, produk, transaksi, dan pembayaran bersifat tunggal.
4. Pemisahan Hak Akses yang Tegas: Sinkronisasi data tidak menyamakan wewenang aksi. Admin berfokus penuh pada alur eksekusi operasional harian, sedangkan Owner berfokus pada pengawasan kinerja, penetapan kebijakan, pengelolaan akun pengguna, dan audit laporan bisnis.
