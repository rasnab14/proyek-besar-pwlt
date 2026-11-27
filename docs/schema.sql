-- =====================================================================
-- Summit Rental & Store - Skema Database (PostgreSQL 16 / Supabase)
-- Uang disimpan dalam Rupiah utuh (bigint). Waktu memakai timestamptz.
-- Diselaraskan dengan PRD, SRS, KEBUTUHAN-FUNGSIONAL (A-P),
-- KEBUTUHAN-NON-FUNGSIONAL, ALUR-NAVIGASI, dan ATURAN-STRUKTUR-PROJECT.
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS btree_gist;   -- untuk EXCLUDE (cegah bentrok alokasi unit)
CREATE EXTENSION IF NOT EXISTS citext;       -- username/email tanpa beda huruf besar-kecil

-- ---------- TIPE ENUM ----------
CREATE TYPE peran_pengguna            AS ENUM ('admin','owner');
CREATE TYPE status_akun               AS ENUM ('aktif','nonaktif');
CREATE TYPE jenis_barang              AS ENUM ('sewa','jual');
CREATE TYPE kondisi_unit              AS ENUM ('tersedia','disewa','dicuci','persiapan','rusak','perawatan');
CREATE TYPE jenis_mutasi_stok         AS ENUM ('tambah','kurang','penyesuaian','terjual');
CREATE TYPE status_booking            AS ENUM ('draft','selesai','dibatalkan','hangus');
CREATE TYPE status_pembayaran_booking AS ENUM ('belum_dibayar','dp_sebagian','dp_lunas','lunas');
CREATE TYPE tipe_item                 AS ENUM ('barang','paket');
CREATE TYPE status_sewa               AS ENUM ('aktif','selesai','batal');
CREATE TYPE status_pengambilan        AS ENUM ('belum_diambil','sudah_diambil');
CREATE TYPE status_pengembalian       AS ENUM ('belum_dikembalikan','sebagian','seluruhnya');
CREATE TYPE status_pembayaran         AS ENUM ('belum_dibayar','belum_lunas','lunas');
CREATE TYPE metode_bayar              AS ENUM ('tunai','qris','transfer');
CREATE TYPE jenis_pembayaran          AS ENUM ('dp','pelunasan','biaya_tambahan','penjualan');
CREATE TYPE jenis_biaya_tambahan      AS ENUM ('denda_keterlambatan','kerusakan','kehilangan');
CREATE TYPE kondisi_kembali           AS ENUM ('baik','perlu_cuci','perlu_persiapan','rusak','hilang','tidak_lengkap');
CREATE TYPE status_bayar_biaya        AS ENUM ('sudah_dibayar','belum_dibayar');

-- ---------- PENOMORAN KODE OTOMATIS ----------
CREATE SEQUENCE seq_pelanggan START 1;
CREATE SEQUENCE seq_booking   START 1;
CREATE SEQUENCE seq_sewa      START 1;
CREATE SEQUENCE seq_jual      START 1;
CREATE SEQUENCE seq_paket     START 1;

-- ---------- PENGATURAN ----------
CREATE TABLE pengaturan (
  kunci   text PRIMARY KEY,
  nilai   jsonb NOT NULL,
  catatan text
);
INSERT INTO pengaturan(kunci,nilai,catatan) VALUES
 ('dp_persen','25','DP booking, persen dari total sewa'),
 ('dp_minimal_hari','2','DP wajib jika booking minimal H-2 sebelum tanggal mulai sewa'),
 ('jam_buka','"08:00"','Jam operasional toko (WIB)'),
 ('jam_tutup','"21:00"','Batas pengembalian harian (WIB); lewat jam ini dianggap terlambat / hangus');

-- ---------- PENGGUNA & HAK AKSES ----------
CREATE TABLE pengguna (
  id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  auth_user_id         uuid UNIQUE,                        -- opsional: tautan ke auth.users Supabase
  nama_lengkap         text    NOT NULL,
  username             citext  NOT NULL UNIQUE,
  email                citext  UNIQUE,
  password_hash        text,                               -- diisi bila memakai autentikasi lokal
  peran                peran_pengguna NOT NULL,
  status               status_akun    NOT NULL DEFAULT 'aktif',
  perlu_ganti_password boolean NOT NULL DEFAULT false,     -- NFR-SEC-09: wajib ganti setelah reset Owner
  terakhir_login       timestamptz,
  dibuat_pada          timestamptz NOT NULL DEFAULT now(),
  diubah_pada          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE izin (                         -- daftar izin khusus yang dapat diberikan oleh Owner
  kode text PRIMARY KEY,                    -- mis. laporan_keuangan
  nama text NOT NULL
);
INSERT INTO izin(kode,nama) VALUES
 ('laporan_keuangan','Laporan Keuangan'),
 ('laporan_penyewaan','Laporan Penyewaan'),
 ('laporan_penjualan','Laporan Penjualan'),
 ('laporan_stok','Laporan Stok'),
 ('laporan_pelanggan','Laporan Pelanggan'),
 ('pembatalan_booking','Pembatalan Booking');

CREATE TABLE pengguna_izin (
  pengguna_id    bigint NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
  izin_kode      text   NOT NULL REFERENCES izin(kode),
  diberikan_oleh bigint REFERENCES pengguna(id),
  diberikan_pada timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (pengguna_id, izin_kode)
);

-- ---------- RIWAYAT AKTIVITAS (audit, tidak boleh diubah/dihapus) ----------
CREATE TABLE riwayat_aktivitas (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pengguna_id  bigint REFERENCES pengguna(id),
  jenis        text NOT NULL,       -- login, logout, tambah, ubah, hapus, batal, hangus, ubah_status, ubah_kondisi
  entitas      text NOT NULL,       -- nama tabel/objek, mis. booking, transaksi_sewa, unit_barang
  entitas_id   text,
  data_sebelum jsonb,
  data_sesudah jsonb,
  alasan       text,
  waktu        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_alasan_hapus CHECK (jenis NOT IN ('hapus','batal') OR alasan IS NOT NULL)
);
CREATE INDEX ix_aktivitas_waktu    ON riwayat_aktivitas(waktu DESC);
CREATE INDEX ix_aktivitas_entitas  ON riwayat_aktivitas(entitas, entitas_id);
CREATE INDEX ix_aktivitas_pengguna ON riwayat_aktivitas(pengguna_id, waktu DESC);

CREATE FUNCTION tolak_ubah_riwayat() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'riwayat_aktivitas tidak boleh diubah atau dihapus'; END $$;
CREATE TRIGGER trg_riwayat_aktivitas_kunci
  BEFORE UPDATE OR DELETE ON riwayat_aktivitas
  FOR EACH ROW EXECUTE FUNCTION tolak_ubah_riwayat();

-- ---------- PELANGGAN ----------
-- KF J.4: hanya Nama & Nomor WhatsApp/Telepon yang wajib; nomor identitas KTP/SIM tidak dicatat.
CREATE TABLE pelanggan (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kode        text NOT NULL UNIQUE DEFAULT ('PL-' || lpad(nextval('seq_pelanggan')::text,4,'0')),
  nama        text NOT NULL,
  telepon     text NOT NULL,
  alamat      text,
  instansi    text,                                   -- opsional: asal kampus/instansi
  catatan     text,
  dibuat_pada timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_pelanggan_telepon UNIQUE (telepon)    -- cegah pelanggan ganda
);
CREATE INDEX ix_pelanggan_nama ON pelanggan (lower(nama));

-- ---------- BARANG ----------
CREATE TABLE kategori_barang (
  id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama  text NOT NULL UNIQUE,
  aktif boolean NOT NULL DEFAULT true
);

CREATE TABLE barang (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kode         text NOT NULL UNIQUE,
  nama         text NOT NULL,
  kategori_id  bigint NOT NULL REFERENCES kategori_barang(id),
  jenis        jenis_barang NOT NULL,
  deskripsi    text,
  foto_url     text,
  aktif        boolean NOT NULL DEFAULT true,
  dihapus_pada timestamptz,                         -- penghapusan lunak
  dibuat_pada  timestamptz NOT NULL DEFAULT now(),
  diubah_pada  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_barang_cari ON barang (jenis, kategori_id) WHERE dihapus_pada IS NULL;
CREATE INDEX ix_barang_nama ON barang (lower(nama));

-- Spesifikasi yang dipakai suatu barang (kotak centang + maksimal 3 spesifikasi lain)
CREATE TABLE barang_spesifikasi (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  barang_id bigint NOT NULL REFERENCES barang(id) ON DELETE CASCADE,
  kunci     text   NOT NULL,                        -- merek, ukuran, kapasitas, jenis, atau nama kustom
  bawaan    boolean NOT NULL,                       -- true = spesifikasi bawaan, false = "Spesifikasi lain"
  urutan    int    NOT NULL DEFAULT 0,
  UNIQUE (barang_id, kunci)
);
CREATE FUNCTION batasi_spesifikasi_lain() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NOT NEW.bawaan AND (SELECT count(*) FROM barang_spesifikasi
        WHERE barang_id = NEW.barang_id AND NOT bawaan AND id IS DISTINCT FROM NEW.id) >= 3 THEN
    RAISE EXCEPTION 'Spesifikasi lain maksimal 3 per barang';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_batasi_spesifikasi_lain
  BEFORE INSERT OR UPDATE ON barang_spesifikasi
  FOR EACH ROW EXECUTE FUNCTION batasi_spesifikasi_lain();

-- Variasi barang (baris pada tabel variasi). Untuk barang jual, stok dikelola per kuantitas.
CREATE TABLE variasi_barang (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  barang_id        bigint NOT NULL REFERENCES barang(id) ON DELETE CASCADE,
  spesifikasi      jsonb  NOT NULL DEFAULT '{}'::jsonb,  -- {"merek":"Eiger","ukuran":"L","kapasitas":"60L"}
  harga_sewa       bigint CHECK (harga_sewa >= 0),       -- per hari, barang sewa
  harga_jual       bigint CHECK (harga_jual >= 0),       -- barang jual
  stok_jual        int    CHECK (stok_jual >= 0),        -- barang jual (kuantitas)
  stok_minimum     int    NOT NULL DEFAULT 0 CHECK (stok_minimum >= 0), -- ambang stok menipis barang jual
  satuan           text   NOT NULL DEFAULT 'pcs',        -- satuan barang jual (pcs, pack, dll.)
  awalan_kode_unit text,                                 -- mis. SPT, TND
  unit_terakhir    int    NOT NULL DEFAULT 0,            -- penomoran kode unit berlanjut
  aktif            boolean NOT NULL DEFAULT true,
  UNIQUE (barang_id, spesifikasi)                        -- tidak boleh variasi ganda
);
CREATE INDEX ix_variasi_barang      ON variasi_barang(barang_id);
CREATE INDEX ix_variasi_spesifikasi ON variasi_barang USING gin (spesifikasi);

-- Unit fisik Barang Sewa
CREATE TABLE unit_barang (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  variasi_id  bigint NOT NULL REFERENCES variasi_barang(id),
  kode_unit   text   NOT NULL UNIQUE,                  -- mis. SPT003
  kondisi     kondisi_unit NOT NULL DEFAULT 'tersedia',
  catatan     text,
  dibuat_pada timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_unit_variasi_kondisi ON unit_barang(variasi_id, kondisi);

CREATE TABLE riwayat_kondisi_unit (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  unit_id      bigint NOT NULL REFERENCES unit_barang(id),
  kondisi_lama kondisi_unit,
  kondisi_baru kondisi_unit NOT NULL,
  pengguna_id  bigint REFERENCES pengguna(id),
  catatan      text,
  waktu        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_riwayat_kondisi_unit ON riwayat_kondisi_unit(unit_id, waktu DESC);

CREATE TABLE riwayat_stok (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  variasi_id   bigint NOT NULL REFERENCES variasi_barang(id),
  jenis        jenis_mutasi_stok NOT NULL,
  jumlah       int NOT NULL,
  stok_sebelum int,
  stok_sesudah int,
  alasan       text,                                   -- mis. Barang masuk dari supplier, Hasil stok opname
  keterangan   text,
  pengguna_id  bigint REFERENCES pengguna(id),
  waktu        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_riwayat_stok ON riwayat_stok(variasi_id, waktu DESC);

-- ---------- PAKET PENYEWAAN ----------
CREATE TABLE paket (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kode        text NOT NULL UNIQUE DEFAULT ('PK-' || lpad(nextval('seq_paket')::text,3,'0')),
  nama        text NOT NULL,
  deskripsi   text,
  harga_sewa  bigint NOT NULL CHECK (harga_sewa >= 0),  -- per hari
  aktif       boolean NOT NULL DEFAULT true,
  dibuat_pada timestamptz NOT NULL DEFAULT now(),
  diubah_pada timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE paket_isi (
  paket_id   bigint NOT NULL REFERENCES paket(id) ON DELETE CASCADE,
  variasi_id bigint NOT NULL REFERENCES variasi_barang(id),
  jumlah     int    NOT NULL CHECK (jumlah > 0),
  PRIMARY KEY (paket_id, variasi_id)
);
CREATE FUNCTION hanya_barang_sewa() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM variasi_barang v JOIN barang b ON b.id = v.barang_id
                 WHERE v.id = NEW.variasi_id AND b.jenis = 'sewa') THEN
    RAISE EXCEPTION 'Hanya Barang Sewa yang boleh masuk Paket Penyewaan';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_paket_isi_sewa BEFORE INSERT OR UPDATE ON paket_isi
  FOR EACH ROW EXECUTE FUNCTION hanya_barang_sewa();

-- ---------- BOOKING ----------
-- KF E.12 & E.34: status langsung Draft -> Selesai (atau Dibatalkan / Hangus);
-- tgl_booking adalah tanggal kesepakatan; tidak ada input tgl_pengambilan aktual di booking.
CREATE TABLE booking (
  id                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kode                  text NOT NULL UNIQUE DEFAULT ('BK-' || lpad(nextval('seq_booking')::text,4,'0')),
  pelanggan_id          bigint NOT NULL REFERENCES pelanggan(id),
  status                status_booking NOT NULL DEFAULT 'draft',
  tgl_booking           date NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Jakarta')::date,
  tgl_mulai             timestamptz NOT NULL,
  durasi_hari           int NOT NULL CHECK (durasi_hari >= 1),
  tgl_selesai           timestamptz NOT NULL,
  diskon                bigint NOT NULL DEFAULT 0 CHECK (diskon >= 0),
  total_sewa            bigint NOT NULL DEFAULT 0 CHECK (total_sewa >= 0),
  dp_diwajibkan         boolean NOT NULL DEFAULT false,       -- true jika selisih hari >= 2 (H-2+)
  dp_wajib_nominal      bigint NOT NULL DEFAULT 0 CHECK (dp_wajib_nominal >= 0),
  dp_disepakati_nominal bigint NOT NULL DEFAULT 0 CHECK (dp_disepakati_nominal >= 0),
  dp_dibayar            bigint NOT NULL DEFAULT 0 CHECK (dp_dibayar >= 0),
  status_pembayaran     status_pembayaran_booking NOT NULL DEFAULT 'belum_dibayar',
  catatan               text,
  dp_hangus             boolean NOT NULL DEFAULT false,       -- true jika dibatalkan/hangus dan ada DP masuk
  dp_hangus_nominal     bigint NOT NULL DEFAULT 0 CHECK (dp_hangus_nominal >= 0),
  dibatalkan_pada       timestamptz,
  dibatalkan_oleh       bigint REFERENCES pengguna(id),
  alasan_batal          text,
  hangus_pada           timestamptz,
  dihapus_pada          timestamptz,                          -- hapus lunak (hanya Draft)
  alasan_hapus          text,
  dibuat_oleh           bigint REFERENCES pengguna(id),
  dibuat_pada           timestamptz NOT NULL DEFAULT now(),
  diubah_pada           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_booking_periode   CHECK (tgl_selesai > tgl_mulai),
  CONSTRAINT ck_booking_tgl_mulai CHECK ((tgl_mulai AT TIME ZONE 'Asia/Jakarta')::date >= tgl_booking),
  CONSTRAINT ck_booking_batal     CHECK (status <> 'dibatalkan' OR (alasan_batal IS NOT NULL AND dibatalkan_oleh IS NOT NULL AND dibatalkan_pada IS NOT NULL)),
  CONSTRAINT ck_booking_hangus    CHECK (status <> 'hangus' OR hangus_pada IS NOT NULL),
  CONSTRAINT ck_booking_hapus     CHECK (dihapus_pada IS NULL OR (status = 'draft' AND alasan_hapus IS NOT NULL))
);
CREATE INDEX ix_booking_pelanggan ON booking(pelanggan_id);
CREATE INDEX ix_booking_mulai     ON booking(tgl_mulai, status) WHERE dihapus_pada IS NULL;
CREATE INDEX ix_booking_periode   ON booking USING gist (tstzrange(tgl_mulai, tgl_selesai, '[)'))
  WHERE status = 'selesai' AND dihapus_pada IS NULL;

-- Item booking: barang satuan ATAU paket; snapshot menjaga komposisi dan harga saat sepakat
CREATE TABLE booking_item (
  id                 bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id         bigint NOT NULL REFERENCES booking(id) ON DELETE CASCADE,
  tipe               tipe_item NOT NULL,
  variasi_id         bigint REFERENCES variasi_barang(id),
  paket_id           bigint REFERENCES paket(id),
  nama_snapshot      text NOT NULL,
  jumlah             int    NOT NULL CHECK (jumlah > 0),
  harga_satuan       bigint NOT NULL CHECK (harga_satuan >= 0),   -- per hari
  durasi_hari        int    NOT NULL CHECK (durasi_hari > 0),
  subtotal           bigint NOT NULL CHECK (subtotal >= 0),
  isi_paket_snapshot jsonb,                                       -- [{variasi_id,nama,jumlah}]
  CONSTRAINT ck_booking_item_tipe CHECK (
    (tipe = 'barang' AND variasi_id IS NOT NULL AND paket_id IS NULL AND isi_paket_snapshot IS NULL) OR
    (tipe = 'paket'  AND paket_id IS NOT NULL AND variasi_id IS NULL AND isi_paket_snapshot IS NOT NULL))
);
CREATE INDEX ix_booking_item_booking ON booking_item(booking_id);

-- ---------- TRANSAKSI PENYEWAAN ----------
-- KF F.1.8: jenis identitas jaminan ditulis manual (KTP, SIM, KTM, dll.) tanpa nomor identitas.
CREATE TABLE transaksi_sewa (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kode                      text NOT NULL UNIQUE DEFAULT ('TS-' || lpad(nextval('seq_sewa')::text,4,'0')),
  booking_id                bigint UNIQUE REFERENCES booking(id),      -- NULL = transaksi langsung
  pelanggan_id              bigint NOT NULL REFERENCES pelanggan(id),
  status                    status_sewa NOT NULL DEFAULT 'aktif',
  status_pengambilan        status_pengambilan  NOT NULL DEFAULT 'belum_diambil',
  status_pengembalian       status_pengembalian NOT NULL DEFAULT 'belum_dikembalikan',
  status_pembayaran         status_pembayaran   NOT NULL DEFAULT 'belum_dibayar',
  tgl_booking               date,
  tgl_mulai                 timestamptz NOT NULL,
  durasi_hari               int NOT NULL CHECK (durasi_hari >= 1),
  tgl_selesai               timestamptz NOT NULL,                      -- batas pengembalian
  waktu_pengambilan         timestamptz,
  diskon                    bigint NOT NULL DEFAULT 0 CHECK (diskon >= 0),
  total_sewa                bigint NOT NULL DEFAULT 0 CHECK (total_sewa >= 0),
  total_biaya_tambahan      bigint NOT NULL DEFAULT 0 CHECK (total_biaya_tambahan >= 0),
  total_dibayar             bigint NOT NULL DEFAULT 0 CHECK (total_dibayar >= 0),
  jaminan_jenis             text,                                      -- ditulis manual (KTP, SIM, KTM, dll.)
  jaminan_dikembalikan_pada timestamptz,
  catatan                   text,
  dibuat_oleh               bigint REFERENCES pengguna(id),
  dibuat_pada               timestamptz NOT NULL DEFAULT now(),
  diubah_pada               timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_sewa_periode CHECK (tgl_selesai > tgl_mulai),
  CONSTRAINT ck_sewa_ambil   CHECK (status_pengambilan = 'belum_diambil' OR waktu_pengambilan IS NOT NULL)
);
CREATE INDEX ix_sewa_pelanggan ON transaksi_sewa(pelanggan_id);
CREATE INDEX ix_sewa_berjalan  ON transaksi_sewa(tgl_selesai) WHERE status = 'aktif';
CREATE INDEX ix_sewa_bayar     ON transaksi_sewa(status_pembayaran) WHERE status <> 'batal';

-- KF F.1.2: Hanya booking berstatus 'selesai' yang boleh dilanjutkan ke Transaksi Penyewaan.
CREATE FUNCTION cek_booking_untuk_sewa() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_status status_booking; v_hapus timestamptz;
BEGIN
  IF NEW.booking_id IS NOT NULL THEN
    SELECT status, dihapus_pada INTO v_status, v_hapus FROM booking WHERE id = NEW.booking_id;
    IF NOT FOUND OR v_hapus IS NOT NULL OR v_status <> 'selesai' THEN
      RAISE EXCEPTION 'Hanya booking berstatus selesai yang dapat diproses menjadi transaksi penyewaan';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_cek_booking_untuk_sewa
  BEFORE INSERT OR UPDATE OF booking_id ON transaksi_sewa
  FOR EACH ROW EXECUTE FUNCTION cek_booking_untuk_sewa();

CREATE TABLE transaksi_sewa_item (
  id                 bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sewa_id            bigint NOT NULL REFERENCES transaksi_sewa(id) ON DELETE CASCADE,
  tipe               tipe_item NOT NULL,
  variasi_id         bigint REFERENCES variasi_barang(id),
  paket_id           bigint REFERENCES paket(id),
  nama_snapshot      text NOT NULL,
  jumlah             int    NOT NULL CHECK (jumlah > 0),
  harga_satuan       bigint NOT NULL CHECK (harga_satuan >= 0),
  durasi_hari        int    NOT NULL CHECK (durasi_hari > 0),
  subtotal           bigint NOT NULL CHECK (subtotal >= 0),
  isi_paket_snapshot jsonb,
  CONSTRAINT ck_sewa_item_tipe CHECK (
    (tipe = 'barang' AND variasi_id IS NOT NULL AND paket_id IS NULL AND isi_paket_snapshot IS NULL) OR
    (tipe = 'paket'  AND paket_id IS NOT NULL AND variasi_id IS NULL AND isi_paket_snapshot IS NOT NULL))
);
CREATE INDEX ix_sewa_item_sewa ON transaksi_sewa_item(sewa_id);

-- Unit fisik yang diserahkan. Untuk paket: satu baris per unit barang penyusun.
-- EXCLUDE menjamin satu unit tidak dialokasikan ke dua sewa yang periodenya bertumpang tindih.
CREATE TABLE transaksi_sewa_unit (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sewa_item_id    bigint NOT NULL REFERENCES transaksi_sewa_item(id) ON DELETE CASCADE,
  unit_id         bigint NOT NULL REFERENCES unit_barang(id),
  mulai           timestamptz NOT NULL,
  selesai         timestamptz NOT NULL,
  batal           boolean NOT NULL DEFAULT false,
  waktu_kembali   timestamptz,
  kondisi_kembali kondisi_kembali,
  periode         tstzrange GENERATED ALWAYS AS (tstzrange(mulai, selesai, '[)')) STORED,
  CONSTRAINT ck_unit_periode CHECK (selesai > mulai),
  CONSTRAINT ex_unit_tidak_bentrok EXCLUDE USING gist (unit_id WITH =, periode WITH &&) WHERE (NOT batal)
);
CREATE INDEX ix_sewa_unit_item ON transaksi_sewa_unit(sewa_item_id);

-- ---------- PENGEMBALIAN ----------
CREATE TABLE pengembalian (                              -- satu transaksi dapat punya beberapa (bertahap)
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sewa_id         bigint NOT NULL REFERENCES transaksi_sewa(id),
  waktu           timestamptz NOT NULL DEFAULT now(),
  terlambat_menit int NOT NULL DEFAULT 0 CHECK (terlambat_menit >= 0),
  catatan         text,
  dicatat_oleh    bigint REFERENCES pengguna(id)
);
CREATE INDEX ix_pengembalian_sewa ON pengembalian(sewa_id);

CREATE TABLE pengembalian_detail (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pengembalian_id bigint NOT NULL REFERENCES pengembalian(id) ON DELETE CASCADE,
  sewa_unit_id    bigint NOT NULL UNIQUE REFERENCES transaksi_sewa_unit(id),
  kondisi         kondisi_kembali NOT NULL,
  kondisi_setelah kondisi_unit,                          -- kondisi unit pasca pemeriksaan (dicuci/persiapan/rusak/perawatan/tersedia)
  keterangan      text
);

CREATE TABLE biaya_tambahan (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sewa_id         bigint NOT NULL REFERENCES transaksi_sewa(id),
  pengembalian_id bigint REFERENCES pengembalian(id),
  jenis           jenis_biaya_tambahan NOT NULL,
  nominal         bigint NOT NULL CHECK (nominal > 0),   -- diinput manual oleh Admin
  alasan          text   NOT NULL,
  dicatat_oleh    bigint REFERENCES pengguna(id),
  waktu           timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_biaya_tambahan_sewa ON biaya_tambahan(sewa_id);

-- ---------- TRANSAKSI PENJUALAN ----------
CREATE TABLE transaksi_jual (
  id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kode              text NOT NULL UNIQUE DEFAULT ('TJ-' || lpad(nextval('seq_jual')::text,4,'0')),
  pelanggan_id      bigint REFERENCES pelanggan(id),
  waktu             timestamptz NOT NULL DEFAULT now(),
  diskon            bigint NOT NULL DEFAULT 0 CHECK (diskon >= 0),
  total             bigint NOT NULL DEFAULT 0 CHECK (total >= 0),
  nominal_bayar     bigint NOT NULL DEFAULT 0 CHECK (nominal_bayar >= 0), -- uang tunai/transfer yang diserahkan
  total_dibayar     bigint NOT NULL DEFAULT 0 CHECK (total_dibayar >= 0), -- netto masuk ke tagihan penjualan
  kembalian         bigint NOT NULL DEFAULT 0 CHECK (kembalian >= 0),
  status_pembayaran status_pembayaran NOT NULL DEFAULT 'belum_dibayar',
  catatan           text,
  dibuat_oleh       bigint REFERENCES pengguna(id),
  diubah_pada       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_jual_waktu ON transaksi_jual(waktu DESC);

CREATE TABLE transaksi_jual_item (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  jual_id       bigint NOT NULL REFERENCES transaksi_jual(id) ON DELETE CASCADE,
  variasi_id    bigint NOT NULL REFERENCES variasi_barang(id),
  nama_snapshot text NOT NULL,
  jumlah        int    NOT NULL CHECK (jumlah > 0),
  harga_satuan  bigint NOT NULL CHECK (harga_satuan >= 0),
  subtotal      bigint NOT NULL CHECK (subtotal >= 0)
);
CREATE INDEX ix_jual_item_jual ON transaksi_jual_item(jual_id);

-- ---------- PEMBAYARAN (satu tabel untuk semua transaksi) ----------
-- Untuk penjualan tunai dengan uang lebih, pembayaran.nominal menyimpan nilai netto terbayar (<= total),
-- sedangkan nominal_bayar dan kembalian dicatat di transaksi_jual agar arus kas v_penerimaan akurat.
CREATE TABLE pembayaran (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  jenis        jenis_pembayaran NOT NULL,
  metode       metode_bayar NOT NULL,
  nominal      bigint NOT NULL CHECK (nominal > 0),
  waktu        timestamptz NOT NULL DEFAULT now(),
  booking_id   bigint REFERENCES booking(id),
  sewa_id      bigint REFERENCES transaksi_sewa(id),      -- DP booking ikut tertaut saat dilanjutkan ke transaksi
  jual_id      bigint REFERENCES transaksi_jual(id),
  keterangan   text,
  dicatat_oleh bigint REFERENCES pengguna(id),
  CONSTRAINT ck_pembayaran_induk CHECK (
    (jual_id IS NOT NULL AND booking_id IS NULL AND sewa_id IS NULL) OR
    (jual_id IS NULL AND (booking_id IS NOT NULL OR sewa_id IS NOT NULL))),
  CONSTRAINT ck_pembayaran_jenis CHECK (
    (jenis = 'penjualan' AND jual_id IS NOT NULL) OR
    (jenis = 'dp' AND (booking_id IS NOT NULL OR sewa_id IS NOT NULL)) OR
    (jenis IN ('pelunasan','biaya_tambahan') AND sewa_id IS NOT NULL))
);
CREATE INDEX ix_pembayaran_waktu   ON pembayaran(waktu);
CREATE INDEX ix_pembayaran_sewa    ON pembayaran(sewa_id);
CREATE INDEX ix_pembayaran_booking ON pembayaran(booking_id);
CREATE INDEX ix_pembayaran_jual    ON pembayaran(jual_id);

-- Hitung ulang pembayaran & status pada booking, transaksi_sewa, dan transaksi_jual
CREATE FUNCTION hitung_ulang_pembayaran_booking(p_booking bigint) RETURNS void LANGUAGE plpgsql AS $$
DECLARE v_bayar bigint;
BEGIN
  SELECT COALESCE(sum(nominal),0) INTO v_bayar FROM pembayaran WHERE booking_id = p_booking;
  UPDATE booking SET
      dp_dibayar = v_bayar,
      status_pembayaran = CASE
        WHEN v_bayar <= 0 THEN 'belum_dibayar'::status_pembayaran_booking
        WHEN v_bayar >= total_sewa THEN 'lunas'::status_pembayaran_booking
        WHEN dp_disepakati_nominal > 0 AND v_bayar >= dp_disepakati_nominal THEN 'dp_lunas'::status_pembayaran_booking
        WHEN dp_wajib_nominal > 0 AND v_bayar >= dp_wajib_nominal THEN 'dp_lunas'::status_pembayaran_booking
        ELSE 'dp_sebagian'::status_pembayaran_booking END,
      diubah_pada = now()
  WHERE id = p_booking;
END $$;

CREATE FUNCTION hitung_ulang_pembayaran_sewa(p_sewa bigint) RETURNS void LANGUAGE plpgsql AS $$
DECLARE v_bayar bigint;
BEGIN
  SELECT COALESCE(sum(nominal),0) INTO v_bayar FROM pembayaran WHERE sewa_id = p_sewa;
  UPDATE transaksi_sewa SET
      total_dibayar = v_bayar,
      status_pembayaran = CASE
         WHEN v_bayar <= 0 THEN 'belum_dibayar'::status_pembayaran
         WHEN v_bayar >= total_sewa + total_biaya_tambahan THEN 'lunas'::status_pembayaran
         ELSE 'belum_lunas'::status_pembayaran END,
      diubah_pada = now()
  WHERE id = p_sewa;
END $$;

CREATE FUNCTION hitung_ulang_pembayaran_jual(p_jual bigint) RETURNS void LANGUAGE plpgsql AS $$
DECLARE v_bayar bigint;
BEGIN
  SELECT COALESCE(sum(nominal),0) INTO v_bayar FROM pembayaran WHERE jual_id = p_jual;
  UPDATE transaksi_jual SET
      total_dibayar = v_bayar,
      status_pembayaran = CASE
         WHEN v_bayar <= 0 THEN 'belum_dibayar'::status_pembayaran
         WHEN v_bayar >= total THEN 'lunas'::status_pembayaran
         ELSE 'belum_lunas'::status_pembayaran END,
      diubah_pada = now()
  WHERE id = p_jual;
END $$;

CREATE FUNCTION trg_pembayaran_sync() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP IN ('INSERT','UPDATE') THEN
    IF NEW.booking_id IS NOT NULL THEN PERFORM hitung_ulang_pembayaran_booking(NEW.booking_id); END IF;
    IF NEW.sewa_id    IS NOT NULL THEN PERFORM hitung_ulang_pembayaran_sewa(NEW.sewa_id);       END IF;
    IF NEW.jual_id    IS NOT NULL THEN PERFORM hitung_ulang_pembayaran_jual(NEW.jual_id);       END IF;
  END IF;
  IF TG_OP IN ('UPDATE','DELETE') THEN
    IF OLD.booking_id IS NOT NULL AND (TG_OP = 'DELETE' OR OLD.booking_id IS DISTINCT FROM NEW.booking_id) THEN
      PERFORM hitung_ulang_pembayaran_booking(OLD.booking_id);
    END IF;
    IF OLD.sewa_id IS NOT NULL AND (TG_OP = 'DELETE' OR OLD.sewa_id IS DISTINCT FROM NEW.sewa_id) THEN
      PERFORM hitung_ulang_pembayaran_sewa(OLD.sewa_id);
    END IF;
    IF OLD.jual_id IS NOT NULL AND (TG_OP = 'DELETE' OR OLD.jual_id IS DISTINCT FROM NEW.jual_id) THEN
      PERFORM hitung_ulang_pembayaran_jual(OLD.jual_id);
    END IF;
  END IF;
  RETURN NULL;
END $$;
CREATE TRIGGER trg_pembayaran_sync_aiud AFTER INSERT OR UPDATE OR DELETE ON pembayaran
  FOR EACH ROW EXECUTE FUNCTION trg_pembayaran_sync();

-- Tautkan DP booking ke transaksi_sewa secara otomatis tanpa mencatat ulang pembayaran (KF F.1.17)
CREATE FUNCTION trg_tautkan_dp_booking() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.booking_id IS NOT NULL THEN
    UPDATE pembayaran SET sewa_id = NEW.id
    WHERE booking_id = NEW.booking_id AND sewa_id IS NULL;
    PERFORM hitung_ulang_pembayaran_sewa(NEW.id);
  END IF;
  RETURN NULL;
END $$;
CREATE TRIGGER trg_sewa_tautkan_dp AFTER INSERT ON transaksi_sewa
  FOR EACH ROW EXECUTE FUNCTION trg_tautkan_dp_booking();

CREATE FUNCTION trg_biaya_tambahan_total() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_sewa bigint;
BEGIN
  v_sewa := COALESCE(NEW.sewa_id, OLD.sewa_id);
  UPDATE transaksi_sewa SET total_biaya_tambahan =
     (SELECT COALESCE(sum(nominal),0) FROM biaya_tambahan WHERE sewa_id = v_sewa)
   WHERE id = v_sewa;
  PERFORM hitung_ulang_pembayaran_sewa(v_sewa);
  RETURN NULL;
END $$;
CREATE TRIGGER trg_biaya_tambahan_aiud AFTER INSERT OR UPDATE OR DELETE ON biaya_tambahan
  FOR EACH ROW EXECUTE FUNCTION trg_biaya_tambahan_total();

-- ---------- PENGELUARAN ----------
CREATE TABLE kategori_pengeluaran (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama         text NOT NULL,
  aktif        boolean NOT NULL DEFAULT true,
  dihapus_pada timestamptz                              -- hapus lunak, mendukung "Batalkan"
);
CREATE UNIQUE INDEX uq_kategori_pengeluaran_nama ON kategori_pengeluaran (lower(nama)) WHERE dihapus_pada IS NULL;

CREATE TABLE pengeluaran (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  keterangan   text NOT NULL,
  kategori_id  bigint NOT NULL REFERENCES kategori_pengeluaran(id),
  tanggal      date   NOT NULL,
  nominal      bigint NOT NULL CHECK (nominal > 0),
  metode       metode_bayar,
  status_bayar status_bayar_biaya NOT NULL DEFAULT 'sudah_dibayar',
  tgl_bayar    date,                                    -- tanggal dibayar bila sudah_dibayar
  jatuh_tempo  date,                                    -- opsional bila belum_dibayar
  lampiran_url text,                                    -- opsional lampiran nota
  catatan      text,
  dibuat_oleh  bigint REFERENCES pengguna(id),
  diubah_oleh  bigint REFERENCES pengguna(id),
  dihapus_pada timestamptz,                             -- hapus lunak, mendukung "Urungkan"
  dibuat_pada  timestamptz NOT NULL DEFAULT now(),
  diubah_pada  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_pengeluaran_tanggal  ON pengeluaran(tanggal) WHERE dihapus_pada IS NULL;
CREATE INDEX ix_pengeluaran_kategori ON pengeluaran(kategori_id, tanggal) WHERE dihapus_pada IS NULL;

-- ---------- VIEW BANTU UNTUK LAPORAN & MONITORING ----------
-- Ringkasan stok per variasi (barang sewa aktif)
CREATE VIEW v_stok_variasi AS
SELECT v.id AS variasi_id, b.kode AS kode_barang, b.nama, v.spesifikasi,
       count(u.id)                                     AS total,
       count(*) FILTER (WHERE u.kondisi = 'tersedia')  AS tersedia,
       count(*) FILTER (WHERE u.kondisi = 'disewa')    AS disewa,
       count(*) FILTER (WHERE u.kondisi = 'dicuci')    AS dicuci,
       count(*) FILTER (WHERE u.kondisi = 'persiapan') AS persiapan,
       count(*) FILTER (WHERE u.kondisi = 'rusak')     AS rusak,
       count(*) FILTER (WHERE u.kondisi = 'perawatan') AS perawatan
FROM variasi_barang v
JOIN barang b ON b.id = v.barang_id AND b.jenis = 'sewa' AND b.dihapus_pada IS NULL
LEFT JOIN unit_barang u ON u.variasi_id = v.id
GROUP BY v.id, b.kode, b.nama, v.spesifikasi;

-- Monitoring transaksi sewa & tracking masa sewa real-time (KF H.3 & I)
CREATE VIEW v_monitoring_sewa AS
SELECT t.id, t.kode, p.nama AS pelanggan, t.tgl_booking, t.tgl_mulai, t.durasi_hari, t.tgl_selesai,
       t.status_pengambilan, t.status_pengembalian, t.status_pembayaran,
       (t.total_sewa + t.total_biaya_tambahan - t.total_dibayar) AS sisa_tagihan,
       GREATEST(0, ((t.tgl_selesai AT TIME ZONE 'Asia/Jakarta')::date
                  - (now() AT TIME ZONE 'Asia/Jakarta')::date))::int AS sisa_hari,
       (t.status = 'aktif'
        AND t.status_pengambilan = 'sudah_diambil'
        AND t.status_pengembalian <> 'seluruhnya'
        AND now() <= t.tgl_selesai
        AND ((t.tgl_selesai AT TIME ZONE 'Asia/Jakarta')::date
           - (now() AT TIME ZONE 'Asia/Jakarta')::date) BETWEEN 0 AND 1) AS mendekati_jatuh_tempo,
       CASE
         WHEN t.status = 'selesai' THEN 'Selesai'
         WHEN t.status = 'batal' THEN 'Batal'
         WHEN t.status_pengambilan = 'belum_diambil' THEN 'Belum Diambil'
         WHEN now() > t.tgl_selesai THEN 'Terlambat'
         WHEN t.status_pengembalian <> 'seluruhnya'
          AND ((t.tgl_selesai AT TIME ZONE 'Asia/Jakarta')::date
             - (now() AT TIME ZONE 'Asia/Jakarta')::date) BETWEEN 0 AND 1 THEN 'Menunggu Pengembalian'
         ELSE 'Sedang Disewa' END AS status_penyewaan,
       CASE
         WHEN t.status = 'aktif' AND t.status_pengambilan = 'sudah_diambil' AND now() > t.tgl_selesai
         THEN GREATEST(0, floor(extract(epoch FROM (now() - t.tgl_selesai)) / 86400))::int
         ELSE 0 END AS hari_terlambat
FROM transaksi_sewa t JOIN pelanggan p ON p.id = t.pelanggan_id;

-- Penerimaan uang aktual (untuk Laporan Keuangan): pembayaran diterima, terpisah dari tagihan.
-- DP dari booking yang dibatalkan/hangus tetap tercatat satu kali sebagai sumber 'dp_hangus' (non-sewa).
CREATE VIEW v_penerimaan AS
SELECT (p.waktu AT TIME ZONE 'Asia/Jakarta')::date AS tanggal,
       p.jenis,
       p.metode,
       p.nominal,
       COALESCE(p.sewa_id, p.booking_id, p.jual_id) AS referensi_id,
       CASE
         WHEN p.jual_id IS NOT NULL THEN 'jual'
         WHEN b.id IS NOT NULL AND b.status IN ('dibatalkan','hangus') THEN 'dp_hangus'
         WHEN p.sewa_id IS NOT NULL THEN 'sewa'
         ELSE 'booking'
       END AS sumber
FROM pembayaran p
LEFT JOIN booking b ON b.id = p.booking_id;

-- Ketersediaan variasi pada suatu periode (dipakai Cek Ketersediaan, booking, transaksi):
-- tersedia = unit operasional (bukan rusak/perawatan) - booking selesai bertumpuk (satuan & paket) - unit dialokasikan sewa aktif bertumpuk
CREATE FUNCTION ketersediaan_variasi(p_variasi bigint, p_mulai timestamptz, p_selesai timestamptz,
                                     p_abaikan_booking bigint DEFAULT NULL)
RETURNS int LANGUAGE sql STABLE AS $$
  WITH operasional AS (
    SELECT count(*) AS n
    FROM unit_barang
    WHERE variasi_id = p_variasi AND kondisi NOT IN ('rusak','perawatan')),
  dibooking AS (
    SELECT COALESCE(sum(bi.jumlah),0) AS n
    FROM booking_item bi JOIN booking b ON b.id = bi.booking_id
    WHERE b.status = 'selesai' AND b.dihapus_pada IS NULL AND bi.tipe = 'barang'
      AND bi.variasi_id = p_variasi AND b.id IS DISTINCT FROM p_abaikan_booking
      AND tstzrange(b.tgl_mulai, b.tgl_selesai, '[)') && tstzrange(p_mulai, p_selesai, '[)')
      AND NOT EXISTS (SELECT 1 FROM transaksi_sewa ts WHERE ts.booking_id = b.id AND ts.status <> 'batal')),
  dibooking_paket AS (
    SELECT COALESCE(sum(bi.jumlah * (e->>'jumlah')::int),0) AS n
    FROM booking_item bi JOIN booking b ON b.id = bi.booking_id,
         jsonb_array_elements(bi.isi_paket_snapshot) e
    WHERE b.status = 'selesai' AND b.dihapus_pada IS NULL AND bi.tipe = 'paket'
      AND (e->>'variasi_id')::bigint = p_variasi AND b.id IS DISTINCT FROM p_abaikan_booking
      AND tstzrange(b.tgl_mulai, b.tgl_selesai, '[)') && tstzrange(p_mulai, p_selesai, '[)')
      AND NOT EXISTS (SELECT 1 FROM transaksi_sewa ts WHERE ts.booking_id = b.id AND ts.status <> 'batal')),
  disewa AS (
    SELECT count(*) AS n
    FROM transaksi_sewa_unit tu
    JOIN unit_barang u ON u.id = tu.unit_id
    WHERE u.variasi_id = p_variasi
      AND u.kondisi NOT IN ('rusak','perawatan')
      AND NOT tu.batal
      AND tu.waktu_kembali IS NULL
      AND tu.periode && tstzrange(p_mulai, p_selesai, '[)'))
  SELECT GREATEST(0, (SELECT n FROM operasional) - (SELECT n FROM dibooking)::int
                     - (SELECT n FROM dibooking_paket)::int - (SELECT n FROM disewa)::int);
$$;

-- Ketersediaan paket pada suatu periode: nilai terkecil dari (ketersediaan variasi penyusun / jumlah per paket)
CREATE FUNCTION ketersediaan_paket(p_paket bigint, p_mulai timestamptz, p_selesai timestamptz,
                                   p_abaikan_booking bigint DEFAULT NULL)
RETURNS int LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    min(ketersediaan_variasi(pi.variasi_id, p_mulai, p_selesai, p_abaikan_booking) / pi.jumlah),
    0
  )::int
  FROM paket_isi pi
  WHERE pi.paket_id = p_paket;
$$;
