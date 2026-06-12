# Savanna Luxe Safaris

A premium, mobile-first Kenya safari travel website for showcasing destinations, itineraries,
routes, authentication flows, and an admin management dashboard.

## Local development

```bash
npm install
cp .env.example .env.local   # then add your Supabase keys
npm run dev
```

## Supabase database

See **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)** for full setup. You need:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Run the SQL files in `supabase/migrations/` and `supabase/seed.sql` in the Supabase SQL Editor.

## Production build

```bash
npm run build
```
