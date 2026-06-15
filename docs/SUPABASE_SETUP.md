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
3. `supabase/migrations/003_trails_community.sql` — community trail publishing and sync policies  
4. `supabase/migrations/004_admin_auth.sql` — admin role on profiles + admin-only write policies  
5. `supabase/seed.sql` — starter destinations, itineraries, community posts  

---

## Admin login setup

The admin dashboard (`#admin`) is restricted to **fchepkosgei21@gmail.com** with `profiles.is_admin = true`.

1. Run migration `004_admin_auth.sql` in the SQL Editor  
2. Create the admin user (uses the **service role** key — never put this in the frontend):

```bash
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
node scripts/seed-admin-user.mjs
```

3. If the profile flag did not set automatically, run `supabase/seed_admin.sql`  
4. Sign in at **`#admin-login`** on the live site  

Default admin password is set by the seed script (`Affrdablekenya254`). Change it in Supabase Dashboard → **Authentication** → **Users** when ready for production.

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
| Admin dashboard | `auth.users`, `profiles.is_admin` | Yes (admin only) |
| Admin CRUD (UI ready) | `destinations`, `itineraries`, `routes` | Yes (admin only) |

---

## Security notes

- The **anon key** is safe to use in the browser (it is public).
- Never put the **service_role** key in the frontend or commit it to git.
- Row Level Security (RLS) is enabled on all tables.
- Admin write policies require `profiles.is_admin = true` (see migration `004_admin_auth.sql`).
- Never expose the **service_role** key in the browser or commit it to git.

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
