# Panduan Setup Proyek

Ikuti langkah-langkah berikut untuk menjalankan proyek pertama kali di komputer lokal:

### 1. Install Dependencies
```bash
npm install
```
*(Perintah ini akan otomatis menginstall semua paket yang dibutuhkan, termasuk Next.js, React, Tailwind CSS, dan Supabase).*

### 2. Konfigurasi Environment Variable
Buat file baru bernama `.env.local` di root folder proyek (bisa juga salin dari file `.env.example`), lalu isi dengan kredensial Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxx
```

### 3. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.
