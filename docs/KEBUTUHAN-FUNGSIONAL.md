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
1.	Sistem menampilkan ringkasan jumlah booking yang perlu diproses.
2.	Sistem menampilkan jadwal pengambilan barang pada hari berjalan.
3.	Sistem menampilkan jadwal pengembalian barang pada hari berjalan.
4.	Sistem menampilkan informasi keterlambatan pengembalian.
5.	Sistem menampilkan ringkasan kondisi stok barang, seperti tersedia, disewa, dicuci, persiapan, rusak, dan perawatan.
6.	Sistem menampilkan informasi transaksi terbaru.
7.	Sistem menampilkan informasi pengeluaran terbaru.
8.	Sistem menampilkan aktivitas operasional yang perlu ditindaklanjuti, seperti booking yang perlu diproses, jadwal pengambilan, pengembalian, dan barang yang belum siap digunakan.

2) Dashboard Owner
1.	Sistem menampilkan ringkasan pendapatan yang telah diterima.
2.	Sistem menampilkan ringkasan pengeluaran yang telah dicatat.
3.	Sistem menampilkan jumlah transaksi penyewaan dan penjualan.
4.	Sistem menampilkan ringkasan booking aktif dan transaksi yang sedang berjalan.
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
14.	Sistem memperhitungkan booking yang telah dikonfirmasi, transaksi penyewaan aktif, kondisi fisik barang, serta periode penyewaan dalam menghitung ketersediaan barang.
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
29.	Sistem memperbarui alokasi stok setiap variasi barang penyusun paket ketika booking dikonfirmasi, transaksi penyewaan diproses, atau booking dibatalkan sesuai dengan kondisi transaksi.
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
1.	Sistem menyediakan menu Booking untuk mencatat dan mengelola pemesanan barang sewa.
2.	Sistem memungkinkan Admin mencatat booking berdasarkan kesepakatan yang telah dilakukan dengan pelanggan melalui WhatsApp atau secara langsung.
3.	Sebelum mencatat booking, Admin dapat memeriksa ketersediaan barang berdasarkan tanggal penyewaan yang diminta pelanggan.
4.	Admin dapat berkoordinasi dengan bagian persiapan untuk memastikan kondisi fisik barang sebelum memberikan informasi kepada pelanggan.
5.	Sistem menyediakan formulir booking yang memuat data pelanggan, barang yang dipesan, jumlah barang, tanggal dan waktu mulai penyewaan, tanggal dan waktu selesai penyewaan, tanggal pengambilan barang, harga sewa, dan informasi lainnya.
6.	Sistem menyediakan kode booking secara otomatis sebagai identitas setiap pemesanan.
7.	Sistem menghitung total biaya penyewaan berdasarkan barang, jumlah, dan durasi penyewaan.
8.	Sistem menghitung kebutuhan DP sebesar 25% dari total biaya penyewaan untuk booking yang dilakukan minimal H-2 sebelum tanggal pengambilan.
9.	Sistem menampilkan informasi bahwa booking H-1 tidak diwajibkan membayar DP sesuai ketentuan perusahaan.
10.	Sistem menyediakan fitur pencatatan pembayaran DP yang telah diterima dari pelanggan, meliputi nominal pembayaran, tanggal pembayaran, dan metode pembayaran.
11.	Sistem menyediakan pilihan metode pembayaran DP, yaitu tunai, QRIS, dan transfer.
12.	Sistem menyediakan status booking, meliputi:
•	Draft: data booking sedang dibuat atau belum selesai dicatat oleh Admin.
•	Dikonfirmasi: pelanggan telah menyetujui kesepakatan dan booking telah dicatat oleh Admin.
•	Selesai: booking telah diproses menjadi transaksi penyewaan.
13.	Sistem menyediakan pencarian booking berdasarkan kode booking, nama pelanggan, dan nomor telepon.
14.	Sistem menyediakan penyaringan booking berdasarkan status booking dan tanggal pengambilan.
15.	Sistem menyediakan detail informasi booking.
16.	Sistem memungkinkan Admin mengubah data booking apabila terjadi kesalahan pencatatan dengan tetap menyimpan riwayat perubahan.
17.	Sistem menyediakan mekanisme penghapusan booking Draft melalui konfirmasi dan pengisian alasan penghapusan.
18.	Sistem menyimpan riwayat penghapusan booking pada Riwayat Aktivitas.
19.	Sistem tidak menyediakan pembatalan booking secara bebas. Apabila terjadi pembatalan booking yang telah dikonfirmasi karena kondisi tertentu, pembatalan hanya dapat dilakukan oleh pengguna yang memiliki kewenangan dengan menyertakan alasan pembatalan. Apabila pelanggan telah membayar DP, sistem mencatat DP tersebut sebagai uang yang tidak dikembalikan (hangus) sesuai ketentuan perusahaan.
20.	Sistem mencatat nominal DP yang telah diterima dan tidak dikembalikan akibat pembatalan booking sebagai penerimaan yang terkait dengan booking tersebut.
21.	Sistem melepaskan alokasi stok dari booking yang telah dibatalkan agar barang dapat diperhitungkan kembali dalam ketersediaan pada periode terkait.
22.	Sistem menyimpan riwayat pembatalan booking beserta alasan, pengguna yang melakukan pembatalan, waktu pembatalan, dan informasi DP yang diterima.
23.	Booking yang telah dikonfirmasi akan diperhitungkan dalam proses pemeriksaan ketersediaan barang untuk periode penyewaan terkait.
24.	Sistem menyediakan tindakan untuk melanjutkan booking yang telah dikonfirmasi ke proses Transaksi Penyewaan tanpa perlu memasukkan ulang data pelanggan, barang, dan periode penyewaan.
25.	Sistem menyediakan pilihan penyewaan barang secara satuan maupun melalui Paket Penyewaan.
26.	Sistem menampilkan daftar Paket Penyewaan beserta informasi harga dan barang penyusunnya ketika Admin mencatat booking.
27.	Sistem memungkinkan Admin memilih Paket Penyewaan dan menentukan jumlah paket yang dipesan pelanggan.
28.	Sistem menampilkan rincian barang penyusun paket beserta jumlah masing-masing barang dalam booking.
29.	Sistem menghitung biaya penyewaan berdasarkan harga paket, jumlah paket, dan durasi penyewaan.
30.	Sistem memeriksa ketersediaan seluruh barang penyusun paket berdasarkan periode penyewaan yang diminta pelanggan.
31.	Sistem menyimpan rincian komposisi dan harga Paket Penyewaan pada booking yang telah dikonfirmasi agar tetap sesuai dengan kesepakatan awal meskipun data paket mengalami perubahan.
32.	Sistem memisahkan katalog pada halaman pencatatan booking ke dalam dua tab, yaitu Barang Satuan dan Paket, sehingga barang sewa satuan dan Paket Penyewaan tidak tercampur dalam satu daftar, dengan keranjang yang tetap digunakan bersama oleh kedua tab.

F. Pengelolaan Transaksi

1) Transaksi Penyewaan
1.	Sistem menyediakan submenu Transaksi Penyewaan untuk mencatat dan mengelola transaksi penyewaan barang.
2.	Sistem mendukung transaksi penyewaan yang berasal dari booking maupun transaksi langsung tanpa booking.
3.	Sistem menyediakan pemilihan data pelanggan dan barang yang akan disewa.
4.	Sistem menampilkan informasi ketersediaan barang berdasarkan periode penyewaan.
5.	Sistem menyediakan pemilihan unit barang untuk barang yang dikelola secara individual.
6.	Sistem menghitung total biaya penyewaan berdasarkan barang, jumlah, harga, dan durasi penyewaan.
7.	Sistem menyediakan informasi tanggal dan waktu mulai penyewaan, tanggal dan waktu selesai penyewaan, tanggal pengambilan, serta tanggal pengembalian barang.
8.	Sistem menyediakan pencatatan jenis jaminan yang diberikan pelanggan, seperti KTP atau SIM.
9.	Sistem menyediakan kode transaksi penyewaan secara otomatis.
10.	Sistem menyediakan informasi status transaksi, status pembayaran, dan status pengambilan barang secara terpisah.
11.	Sistem menyediakan detail transaksi penyewaan beserta informasi jaminan, rincian barang, dan riwayat pembayarannya.
12.	Sistem menyediakan pencarian dan penyaringan transaksi berdasarkan kode transaksi, pelanggan, periode transaksi, dan status transaksi.
13.	Sistem menyediakan tindakan untuk memproses pengambilan barang oleh pelanggan setelah data transaksi penyewaan dicatat.
14.	Sistem menyediakan informasi status pengambilan barang, yaitu Belum Diambil dan Sudah Diambil.
15.	Sistem mencatat tanggal dan waktu pengambilan barang ketika barang benar-benar diserahkan kepada pelanggan.
16.	Sistem memperbarui kondisi fisik unit barang menjadi Disewa setelah proses pengambilan barang dikonfirmasi oleh Admin.
17.	Sistem mengintegrasikan nominal DP yang telah dibayarkan pada saat booking ke dalam Transaksi Penyewaan ketika booking dilanjutkan menjadi transaksi, tanpa mencatat ulang pembayaran tersebut.
18.	Sistem menghitung sisa pembayaran secara otomatis berdasarkan total biaya penyewaan dikurangi seluruh pembayaran yang telah diterima, termasuk DP.
19.	Sistem menyediakan fitur pencatatan pembayaran pelunasan untuk membayar sisa tagihan transaksi penyewaan.
20.	Sistem menyediakan pilihan metode pembayaran pelunasan, yaitu tunai, QRIS, dan transfer.
21.	Sistem menyediakan informasi status pembayaran, yaitu Belum Dibayar, Belum Lunas, dan Lunas.
22.	Sistem memperbarui status pembayaran secara otomatis menjadi Lunas apabila seluruh tagihan telah dibayarkan.
23.	Sistem menyimpan riwayat pembayaran DP dan pelunasan beserta tanggal, nominal, metode pembayaran, dan pengguna yang mencatat.
24.	Sistem menyimpan riwayat perubahan transaksi yang dilakukan oleh pengguna.
25.	Sistem menyediakan pemilihan barang sewa secara satuan maupun melalui Paket Penyewaan dalam transaksi penyewaan.
26.	Sistem menampilkan rincian barang penyusun Paket Penyewaan beserta jumlah masing-masing barang dalam transaksi.
27.	Sistem menghitung total biaya penyewaan berdasarkan harga paket, jumlah paket, dan durasi penyewaan.
28.	Sistem mengintegrasikan rincian Paket Penyewaan dari booking yang dilanjutkan menjadi transaksi penyewaan tanpa perlu memasukkan ulang data paket dan barang penyusunnya.
29.	Sistem mengalokasikan stok setiap barang penyusun paket berdasarkan jumlah paket yang disewa.
30.	Sistem mencatat barang penyusun paket yang benar-benar diserahkan kepada pelanggan sebagai bagian dari transaksi penyewaan.
31.	Sistem memisahkan katalog pada halaman Transaksi Penyewaan ke dalam dua tab, yaitu Barang Satuan dan Paket, dengan keranjang yang digunakan bersama sehingga satu transaksi dapat memuat barang satuan sekaligus paket. Ketersediaan paket dihitung dari ketersediaan barang penyusunnya.
32.	Setelah pembayaran pelunasan dicatat, sistem menampilkan halaman Pelunasan Berhasil yang memuat rincian transaksi, riwayat pembayaran (DP dan pelunasan), dan status pembayaran Lunas, serta menyediakan tindakan untuk mencetak bukti, melihat detail transaksi, dan kembali ke menu Transaksi Penyewaan.
33.	Sistem menyediakan tombol kembali ke menu Transaksi Penyewaan pada halaman transaksi penyewaan langsung yang telah berhasil disimpan.
34.	Sistem menyediakan fitur Cetak Bukti/Struk pada halaman detail transaksi penyewaan dan halaman transaksi berhasil. Fitur ini menampilkan jendela pop-up di tengah layar yang memuat pilihan ukuran kertas (58 mm, 80 mm, atau A4), pilihan informasi yang ditampilkan (nama kasir, rincian pembayaran, serta syarat dan ketentuan), dan jumlah salinan, serta menyediakan tindakan cetak dan unduh PDF. Struk menampilkan status Belum Lunas beserta sisa tagihan apabila transaksi belum dilunasi.

2) Transaksi Penjualan
1.	Sistem menyediakan submenu Transaksi Penjualan untuk mencatat transaksi penjualan barang.
2.	Sistem menampilkan daftar produk berjenis Barang Jual yang dapat dipilih oleh Admin untuk dimasukkan ke dalam keranjang transaksi.
3.	Sistem menyediakan fitur pencarian dan penyaringan produk berdasarkan nama, kode, dan kategori barang.
4.	Sistem menampilkan informasi harga jual dan jumlah stok setiap produk.
5.	Sistem menyediakan fitur penambahan barang ke keranjang transaksi melalui pemilihan produk serta pengaturan jumlah pembelian.
6.	Sistem memungkinkan Admin menambahkan lebih dari satu jenis barang ke dalam satu transaksi.
7.	Sistem menghitung subtotal setiap barang dan total pembayaran secara otomatis berdasarkan jumlah pembelian.
8.	Sistem menyediakan kode transaksi penjualan secara otomatis.
9.	Sistem mencatat informasi transaksi dan pembayaran, termasuk nominal pembayaran serta metode pembayaran.
10.	Sistem memvalidasi ketersediaan stok sebelum transaksi disimpan untuk mencegah penjualan melebihi jumlah stok.
11.	Sistem mengurangi jumlah stok barang berdasarkan jumlah barang yang terjual setelah transaksi berhasil disimpan.
12.	Sistem menyediakan detail transaksi penjualan beserta informasi barang yang dibeli dan riwayat pembayarannya.
13.	Sistem menyediakan pencarian dan penyaringan transaksi berdasarkan kode transaksi dan periode transaksi.
14.	Sistem menyimpan riwayat perubahan transaksi yang dilakukan oleh pengguna.
15.	Sistem menyediakan fitur Cetak Bukti/Struk pada halaman detail transaksi penjualan dan halaman transaksi berhasil, berupa jendela pop-up di tengah layar yang memuat pilihan ukuran kertas (58 mm, 80 mm, atau A4), pilihan informasi yang ditampilkan, dan jumlah salinan, serta menyediakan tindakan cetak dan unduh PDF.
16.	Sistem menyediakan halaman Detail Transaksi Penjualan yang memuat kode transaksi, pelanggan, rincian barang yang dibeli beserta jumlah dan harga, total, nominal pembayaran, dan kembalian.
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
1.	Sistem menyediakan menu Pengembalian untuk mencatat dan mengelola pengembalian barang sewa.
2.	Sistem menampilkan daftar transaksi penyewaan yang memiliki jadwal pengembalian.
3.	Sistem menyediakan pencarian data pengembalian berdasarkan kode transaksi, nama pelanggan, dan tanggal pengembalian.
4.	Sistem menampilkan informasi barang yang harus dikembalikan berdasarkan transaksi penyewaan.
5.	Sistem menyediakan pencatatan tanggal dan waktu pengembalian barang.
6.	Sistem menyediakan pencatatan jumlah barang yang dikembalikan.
7.	Sistem mendukung pencatatan pengembalian barang secara bertahap apabila barang tidak dikembalikan secara bersamaan.
8.	Sistem menyediakan pemeriksaan kondisi barang ketika dikembalikan.
9.	Sistem menyediakan pencatatan barang yang rusak, hilang, atau tidak lengkap.
10.	Sistem menyediakan pencatatan biaya tambahan, seperti denda keterlambatan atau biaya kerusakan dan kehilangan barang, dengan nominal yang dapat diinput secara manual oleh Admin.
11.	Sistem menyediakan kolom keterangan atau alasan untuk setiap biaya tambahan yang dicatat.
12.	Sistem menampilkan informasi keterlambatan pengembalian berdasarkan tanggal pengembalian yang telah ditentukan.
13.	Sistem mengintegrasikan biaya tambahan akibat keterlambatan, kerusakan, atau kehilangan barang ke dalam rincian tagihan transaksi penyewaan terkait.
14.	Sistem menyediakan fitur pencatatan pembayaran biaya tambahan dengan metode pembayaran tunai, QRIS, atau transfer.
15.	Sistem memperbarui status transaksi setelah proses pengembalian dicatat.
16.	Sistem mencatat kondisi barang setelah dikembalikan untuk menentukan apakah barang dapat langsung digunakan kembali atau perlu melalui proses pencucian, persiapan, maupun perawatan.
17.	Sistem tidak langsung mengubah status barang menjadi Tersedia sebelum barang dinyatakan siap digunakan kembali.
18.	Sistem mencatat pengembalian jaminan pelanggan setelah seluruh barang selesai diperiksa dan kewajiban pembayaran terkait telah diselesaikan.
19.	Sistem menyimpan riwayat pengembalian barang pada transaksi terkait.
20.	Sistem menyimpan riwayat pencatatan biaya tambahan beserta nominal, alasan, tanggal, dan pengguna yang mencatat.
21.	Sistem menampilkan rincian barang penyusun Paket Penyewaan yang harus dikembalikan berdasarkan transaksi penyewaan.
22.	Sistem memungkinkan Admin mencatat pengembalian dan pemeriksaan kondisi setiap barang penyusun paket secara terpisah.
23.	Sistem menampilkan informasi barang penyusun paket yang belum dikembalikan, rusak, hilang, atau tidak lengkap.
24.	Sistem memperhitungkan penyelesaian pengembalian berdasarkan seluruh barang penyusun paket yang disewa pelanggan.

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
2.	Sistem secara otomatis menyimpan data pelanggan baru ketika Admin mencatat pelanggan melalui menu Booking, Transaksi Penyewaan, atau Transaksi Penjualan. Data pelanggan yang telah terdaftar dapat digunakan kembali pada pencatatan berikutnya.
3.	Sistem menyediakan kode pelanggan secara otomatis sebagai identitas setiap pelanggan.
4.	Sistem menampilkan informasi pelanggan yang meliputi nama, nomor telepon, alamat, dan informasi lain yang diperlukan. (yg alamat opsional dan lain-lain, yang diutamakan nama dan nomor telepon)
5.	Sistem menyediakan pencarian pelanggan berdasarkan kode pelanggan, nama, dan nomor telepon.
6.	Sistem menampilkan jumlah transaksi yang pernah dilakukan setiap pelanggan dengan menghitung satu rangkaian booking yang dilanjutkan menjadi transaksi penyewaan sebagai satu transaksi penyewaan.
7.	Sistem menampilkan riwayat transaksi penyewaan dan penjualan setiap pelanggan.
8.	Sistem menghubungkan data pelanggan dengan booking dan transaksi terkait.
9.	Sistem mencegah pencatatan pelanggan yang sama secara berulang apabila data pelanggan tersebut telah tersedia.
10.	Sistem memungkinkan Admin memilih data pelanggan yang telah terdaftar ketika mencatat booking atau transaksi tanpa perlu memasukkan ulang informasi pelanggan.
11.	Sistem menyediakan detail informasi pelanggan beserta riwayat transaksinya.

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
