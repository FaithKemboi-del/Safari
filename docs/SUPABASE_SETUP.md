# Supabase setup for Savanna Luxe Safaris

This app uses **Supabase** for PostgreSQL database, authentication, and live community comments.

Without `.env.local`, the site still works using built-in local demo data.

---

## What I need from you

Create a free project at [supabase.com](https://supabase.com), then send or add these two values to `.env.local`:

| Variable | Where to find it |
|----------|------------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → **Project Settings** → **API** → **Project URL** |
| `VITE_SUPABASE_ANON_KEY` | Same page → **Project API keys** → **anon public** |

Example `.env.local`:

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Restart the dev server after creating `.env.local`:

```bash
npm run dev
```

---

## One-time database setup

In Supabase Dashboard → **SQL Editor**, run these files **in order**:

1. `supabase/migrations/001_initial_schema.sql` — tables, RLS, auth profile trigger  
2. `supabase/migrations/002_savanna_trails.sql` — Savanna Trails maps, reviews, GPS tracks  
3. `supabase/seed.sql` — starter destinations, itineraries, community posts  

---

## Enable email auth

1. Dashboard → **Authentication** → **Providers**  
2. Enable **Email**  
3. For local testing, you can disable **Confirm email** under Email settings  

Optional later: enable **Google** / **Apple** OAuth in the same Providers screen.

---

## What connects to Supabase

| Feature | Table(s) | Auth required |
|---------|----------|---------------|
| Destinations list & detail | `destinations` | No (read) |
| Itineraries | `itineraries`, `itinerary_days` | No (read) |
| Community comments | `community_updates` | Yes (write) |
| Sign up / Sign in | `auth.users`, `profiles` | — |
| Admin CRUD (UI ready) | `destinations`, `itineraries`, `routes` | Yes (authenticated) |

---

## Security notes

- The **anon key** is safe to use in the browser (it is public).
- Never put the **service_role** key in the frontend or commit it to git.
- Row Level Security (RLS) is enabled on all tables.
- Admin write policies currently allow any signed-in user — tighten with an `admin` role before production.

---

## Troubleshooting

**App still shows local demo data**  
- Check `.env.local` exists and variable names start with `VITE_`  
- Restart `npm run dev`  
- Confirm `seed.sql` ran and `destinations` has rows  

**Cannot post community comments**  
- Sign in with a real Supabase account  
- Ensure the destination `slug` exists in `destinations`  
- Check browser console for RLS errors  

**Email sign-up not working**  
- Confirm email provider is enabled  
- Check spam folder for confirmation email  
- Or disable email confirmation for dev testing  

---

## Optional: Supabase CLI (later)

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```
