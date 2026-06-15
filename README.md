# Savanna Luxe Safaris

A premium, mobile-first Kenya safari travel website for showcasing destinations, itineraries,
routes, authentication flows, and an admin management dashboard.

## Local development

```bash
npm install
npm run setup:env   # creates .env.local from .env.example
```

Edit `.env.local` and add the **same** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` you use on Vercel (Supabase → Settings → API). Then:

```bash
npm run dev
```

Restart `npm run dev` after changing `.env.local` — Vite only reads env vars on startup.

## Supabase database

See **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)** for full setup. You need:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Run the SQL files in `supabase/migrations/` and `supabase/seed.sql` in the Supabase SQL Editor.

## Production build

```bash
npm run build
```
