# Seed Data PostgreSQL — Paket Summit Rental & Store

Dokumen ini berisi query **PostgreSQL 16** untuk membuat data awal produk sewa dan 7 paket dari daftar Produk Paketan Summit Adventure.

## Catatan penting sesuai schema

- Mengikuti tabel `kategori_barang`, `barang`, `variasi_barang`, `paket`, dan `paket_isi` pada `schema.sql`.
- Semua produk di bawah dimasukkan sebagai `jenis = 'sewa'`.
- `foto_url` sengaja diisi `NULL`. Data produk tetap bisa tampil tanpa gambar; gambar dapat ditambahkan manual nanti.
- Stok unit fisik tidak dibuat karena jumlah stok belum diberikan. Untuk mengaktifkan ketersediaan penyewaan, tambahkan data `unit_barang` sesuai stok nyata.
- Pada schema, `paket.harga_sewa` adalah **harga per hari**, sedangkan harga yang diberikan adalah harga paket untuk **2 hari 1 malam**. Karena itu query menyimpan setengah dari harga paket sebagai tarif harian. Saat durasi sistem dihitung 2 hari, totalnya kembali menjadi harga paket yang diberikan.
- Nama/jenis beberapa barang disesuaikan dengan katalog produk yang tersedia. Contohnya “kompor anti angin” direpresentasikan sebagai `Kompor Portable Mini` + `Penahan Angin`; “sepatu” pada Tektok menggunakan produk `Sepatu Hiking` generik.
- Query dapat dijalankan ulang: kategori, produk, variasi, paket, dan isi paket tidak dibuat ganda berdasarkan kode/nama dan kunci unik yang digunakan.

## Query seed data

Jalankan setelah schema database berhasil dibuat.

```sql
BEGIN;

-- ------------------------------------------------------------
-- 1. Kategori produk
-- ------------------------------------------------------------
INSERT INTO kategori_barang (nama)
VALUES
  ('Memasak'),
  ('Tenda'),
  ('Penerangan'),
  ('Alas tidur'),
  ('Perabot camping'),
  ('Peralatan air'),
  ('Alas kaki'),
  ('Pakaian'),
  ('Peralatan pendakian'),
  ('Tas'),
  ('Perlindungan')
ON CONFLICT (nama) DO NOTHING;


-- ------------------------------------------------------------
-- 2. Barang sewa
--    Kode dibuat stabil agar seed dapat dijalankan ulang.
--    Foto sengaja NULL; gambar ditambahkan manual.
-- ------------------------------------------------------------
WITH data_barang(kode, nama, kategori) AS (
  VALUES
    ('SEED-GAS-PORTABLE',       'Gas Portable',              'Memasak'),
    ('SEED-COOKING-SET',        'Cooking Set',               'Memasak'),
    ('SEED-KOMPOR-MINI',        'Kompor Portable Mini',      'Memasak'),
    ('SEED-PENAHAN-ANGIN',      'Penahan Angin',             'Perlindungan'),
    ('SEED-TENDA-4',            'Tenda Kapasitas 4 Orang',    'Tenda'),
    ('SEED-TENDA-2',            'Tenda Kapasitas 2 Orang',    'Tenda'),
    ('SEED-LAMPU-TENDA',        'Lampu Tenda',               'Penerangan'),
    ('SEED-MATRAS-SPONS',       'Matras Spons',              'Alas tidur'),
    ('SEED-SLEEPING-BAG',       'Sleeping Bag',              'Alas tidur'),
    ('SEED-MEJA-LIPAT',         'Meja Lipat',                'Perabot camping'),
    ('SEED-KURSI-LIPAT',        'Kursi Lipat',               'Perabot camping'),
    ('SEED-HYDROPACK',          'Hydropack',                 'Peralatan air'),
    ('SEED-SEPATU-HIKING',      'Sepatu Hiking',             'Alas kaki'),
    ('SEED-SARUNG-TANGAN',      'Sarung Tangan',             'Pakaian'),
    ('SEED-TRACKING-POLE',      'Tracking Pole',             'Peralatan pendakian'),
    ('SEED-HEADLAMP',           'Headlamp',                  'Penerangan'),
    ('SEED-CARRIER-60L',        'Carrier 60 L',              'Tas'),
    ('SEED-COVER-BAG-60L',      'Cover Bag 60 L',            'Perlindungan'),
    ('SEED-KOMPOR-GRILL',       'Kompor Grill',              'Memasak'),
    ('SEED-GRILL-PAN',          'Grill Pan',                 'Memasak')
)
INSERT INTO barang (kode, nama, kategori_id, jenis, deskripsi, foto_url, aktif)
SELECT
  d.kode,
  d.nama,
  k.id,
  'sewa'::jenis_barang,
  'Data awal produk paket Summit Adventure. Spesifikasi dan foto dapat dilengkapi manual.',
  NULL,
  true
FROM data_barang d
JOIN kategori_barang k ON k.nama = d.kategori
ON CONFLICT (kode) DO UPDATE
SET nama = EXCLUDED.nama,
    kategori_id = EXCLUDED.kategori_id,
    jenis = EXCLUDED.jenis,
    aktif = true;


-- ------------------------------------------------------------
-- 3. Variasi default untuk tiap produk
--    Harga satuan tidak diketahui, sehingga harga_sewa NULL.
-- ------------------------------------------------------------
INSERT INTO variasi_barang (barang_id, spesifikasi, harga_sewa, awalan_kode_unit)
SELECT b.id, '{}'::jsonb, NULL, NULL
FROM barang b
WHERE b.kode LIKE 'SEED-%'
ON CONFLICT (barang_id, spesifikasi) DO NOTHING;


-- ------------------------------------------------------------
-- 4. Paket
--    Harga di tabel paket adalah tarif per hari:
--    harga paket 2 hari dibagi 2 sesuai schema.
-- ------------------------------------------------------------
INSERT INTO paket (kode, nama, deskripsi, harga_sewa, aktif)
VALUES
  ('PK-101', 'Procamp',
   'Paket camping untuk mendaki bersama 4 teman. Durasi harga katalog: 2 hari 1 malam.',
   67500, true),
  ('PK-102', 'Paket 4 Sekawan',
   'Paket camping untuk 4 teman. Durasi harga katalog: 2 hari 1 malam.',
   37500, true),
  ('PK-103', 'Duo Camper',
   'Paket camping untuk 2 orang. Durasi harga katalog: 2 hari 1 malam.',
   42500, true),
  ('PK-104', 'Senja',
   'Paket perlengkapan memasak dan bersantai. Durasi harga katalog: 2 hari 1 malam.',
   30000, true),
  ('PK-105', 'Tektok',
   'Paket perlengkapan hiking tektok. Durasi harga katalog: 2 hari 1 malam.',
   25000, true),
  ('PK-106', 'Grill Kit',
   'Paket perlengkapan grill. Durasi harga katalog: 2 hari 1 malam.',
   17500, true),
  ('PK-107', 'Solo Hiking',
   'Paket perlengkapan hiking solo. Durasi harga katalog: 2 hari 1 malam.',
   20000, true)
ON CONFLICT (kode) DO UPDATE
SET nama = EXCLUDED.nama,
    deskripsi = EXCLUDED.deskripsi,
    harga_sewa = EXCLUDED.harga_sewa,
    aktif = true;


-- ------------------------------------------------------------
-- 5. Isi paket
--    Kolom jumlah adalah jumlah unit produk dalam satu paket.
-- ------------------------------------------------------------
WITH isi(kode_paket, kode_barang, jumlah) AS (
  VALUES
    -- Procamp
    ('PK-101', 'SEED-GAS-PORTABLE', 1),
    ('PK-101', 'SEED-COOKING-SET', 1),
    ('PK-101', 'SEED-KOMPOR-MINI', 1),
    ('PK-101', 'SEED-PENAHAN-ANGIN', 1),
    ('PK-101', 'SEED-TENDA-4', 1),
    ('PK-101', 'SEED-LAMPU-TENDA', 1),
    ('PK-101', 'SEED-MATRAS-SPONS', 4),
    ('PK-101', 'SEED-SLEEPING-BAG', 4),
    ('PK-101', 'SEED-MEJA-LIPAT', 1),
    ('PK-101', 'SEED-KURSI-LIPAT', 2),

    -- Paket 4 Sekawan
    ('PK-102', 'SEED-TENDA-4', 1),
    ('PK-102', 'SEED-LAMPU-TENDA', 1),
    ('PK-102', 'SEED-MATRAS-SPONS', 4),
    ('PK-102', 'SEED-SLEEPING-BAG', 4),

    -- Duo Camper
    ('PK-103', 'SEED-TENDA-2', 1),
    ('PK-103', 'SEED-MATRAS-SPONS', 2),
    ('PK-103', 'SEED-SLEEPING-BAG', 2),
    ('PK-103', 'SEED-LAMPU-TENDA', 1),
    ('PK-103', 'SEED-KURSI-LIPAT', 2),
    ('PK-103', 'SEED-MEJA-LIPAT', 1),

    -- Senja
    ('PK-104', 'SEED-GAS-PORTABLE', 1),
    ('PK-104', 'SEED-COOKING-SET', 1),
    ('PK-104', 'SEED-KOMPOR-MINI', 1),
    ('PK-104', 'SEED-PENAHAN-ANGIN', 1),
    ('PK-104', 'SEED-MEJA-LIPAT', 1),
    ('PK-104', 'SEED-KURSI-LIPAT', 2),

    -- Tektok
    ('PK-105', 'SEED-HYDROPACK', 1),
    ('PK-105', 'SEED-SEPATU-HIKING', 1),
    ('PK-105', 'SEED-SARUNG-TANGAN', 1),
    ('PK-105', 'SEED-TRACKING-POLE', 1),
    ('PK-105', 'SEED-HEADLAMP', 1),

    -- Grill Kit
    ('PK-106', 'SEED-KOMPOR-GRILL', 1),
    ('PK-106', 'SEED-GAS-PORTABLE', 1),
    ('PK-106', 'SEED-GRILL-PAN', 1),

    -- Solo Hiking
    ('PK-107', 'SEED-CARRIER-60L', 1),
    ('PK-107', 'SEED-COVER-BAG-60L', 1),
    ('PK-107', 'SEED-SLEEPING-BAG', 1),
    ('PK-107', 'SEED-HEADLAMP', 1),
    ('PK-107', 'SEED-MATRAS-SPONS', 1),
    ('PK-107', 'SEED-SARUNG-TANGAN', 1)
)
INSERT INTO paket_isi (paket_id, variasi_id, jumlah)
SELECT p.id, v.id, i.jumlah
FROM isi i
JOIN paket p ON p.kode = i.kode_paket
JOIN barang b ON b.kode = i.kode_barang
JOIN variasi_barang v ON v.barang_id = b.id
WHERE v.spesifikasi = '{}'::jsonb
ON CONFLICT (paket_id, variasi_id) DO UPDATE
SET jumlah = EXCLUDED.jumlah;

COMMIT;
```

## Verifikasi data paket

Query berikut menampilkan nama paket, harga tarif harian, estimasi harga untuk 2 hari, dan daftar isi paket.

```sql
SELECT
  p.kode,
  p.nama AS nama_paket,
  p.harga_sewa AS harga_per_hari,
  p.harga_sewa * 2 AS harga_2_hari,
  string_agg(b.nama || ' (' || pi.jumlah || ')', ', ' ORDER BY b.nama) AS isi_paket
FROM paket p
JOIN paket_isi pi ON pi.paket_id = p.id
JOIN variasi_barang v ON v.id = pi.variasi_id
JOIN barang b ON b.id = v.barang_id
WHERE p.kode BETWEEN 'PK-101' AND 'PK-107'
GROUP BY p.id, p.kode, p.nama, p.harga_sewa
ORDER BY p.kode;
```

## Harga paket sesuai katalog (total 2 hari 1 malam)

| Kode | Nama paket | Harga paket |
|---|---|---:|
| PK-101 | Procamp | Rp135.000 |
| PK-102 | Paket 4 Sekawan | Rp75.000 |
| PK-103 | Duo Camper | Rp85.000 |
| PK-104 | Senja | Rp60.000 |
| PK-105 | Tektok | Rp50.000 |
| PK-106 | Grill Kit | Rp35.000 |
| PK-107 | Solo Hiking | Rp40.000 |

> Catatan: jumlah stok unit belum dimasukkan karena belum ada informasi stok. Seed ini membuat katalog produk dan komposisi paket agar data langsung tersedia di database; stok nyata dapat ditambahkan setelah inventaris dihitung.
