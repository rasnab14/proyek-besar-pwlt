# PERTAMA install package yang diperlukan:

## install dependecy
npm install

## install supabase
npm install @supabase/supabase-js @supabase/ssr

## buat .env.local
buat file .env.local dengan format sebagai berikut:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxx
```

## start server
npm run dev