# Deploy Savanna Luxe

This project splits into:

| Part | Host | What it runs |
|------|------|--------------|
| **Frontend** | [Vercel](https://vercel.com) | React + Vite static site |
| **API** | [Render](https://render.com) | Lightweight Express health/API service |
| **Database & auth** | [Supabase](https://supabase.com) | PostgreSQL, auth, trails, hike tracks |

The website talks to **Supabase directly** from the browser. Render hosts a small API you can extend later.

---

## 1. Supabase (do this first)

1. Create a project at [supabase.com](https://supabase.com)
2. In **SQL Editor**, run in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_savanna_trails.sql`
   - `supabase/migrations/003_trails_community.sql`
   - `supabase/seed.sql` (optional starter data)
3. In **Authentication → Providers**, enable **Email**
4. Copy from **Project Settings → API**:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`

---

## 2. Deploy frontend on Vercel

### Option A — GitHub import (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the **Safari** repository
4. Vercel should detect Vite automatically (`vercel.json` is included)
5. Add **Environment Variables**:

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | your anon key |

6. Click **Deploy**

Your site will be live at something like `https://safari-xyz.vercel.app`

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Set the same env vars in the Vercel dashboard under **Settings → Environment Variables**.

---

## 3. Deploy API on Render

1. Go to [render.com](https://render.com) → **New → Blueprint**
2. Connect the same GitHub repo
3. Render reads `render.yaml` and creates **savanna-luxe-api**
4. Set environment variables on the service:

| Name | Example |
|------|---------|
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `SUPABASE_ANON_KEY` | your anon key |

5. Deploy and note the URL, e.g. `https://savanna-luxe-api.onrender.com`

Test: open `https://savanna-luxe-api.onrender.com/health` — should return `{"status":"ok"}`

### Manual Render setup (without Blueprint)

- **New Web Service** → connect repo
- **Root directory:** `server`
- **Build command:** `npm install`
- **Start command:** `npm start`
- **Health check path:** `/health`

---

## 4. What you need to do (checklist)

- [ ] Run all Supabase SQL migrations
- [ ] Enable Email auth in Supabase
- [ ] Deploy to **Vercel** with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Deploy **server/** to **Render** with `FRONTEND_URL` set to your Vercel URL
- [ ] Visit your Vercel URL and test sign-in, hiking page, and trail recording
- [ ] (Optional) Add a custom domain in Vercel → **Settings → Domains**

---

## Local development

```bash
# Frontend
cp .env.example .env.local   # add Supabase keys
npm install
npm run dev

# API (separate terminal)
cd server
npm install
FRONTEND_URL=http://localhost:5173 npm run dev
```

---

## Notes

- **Hash routing** (`#home`, `#category/hiking`) works on Vercel without extra config.
- **No paid AllTrails** — trail maps use OpenStreetMap (free).
- If Supabase env vars are missing on Vercel, the site still loads with local demo data.

---

## Troubleshooting: blank page on Vercel

A blank page almost always means the **production build did not run** and Vercel is serving the dev `index.html` (which points at `/src/main.tsx` — that only works with `npm run dev`).

### Quick check

1. Open your live site → **View Page Source** (not Inspect).
2. If you see `<script type="module" src="/src/main.tsx">`, the build was skipped.
3. You should instead see `<script type="module" src="/assets/index-….js">`.

### Fix in Vercel dashboard

Go to **Project → Settings → Build & Development Settings** and confirm:

| Setting | Value |
|---------|--------|
| Framework Preset | **Vite** |
| Root Directory | `.` (repo root, not `server/`) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

Then open **Deployments → … → Redeploy** (use “Redeploy with existing Build Cache” **unchecked**).

### Check deploy logs

In the deployment log you should see `vite v… building` and `dist/index.html` created. If the build step is missing or failed, fix that before debugging anything else.

### Browser DevTools

- **Console**: errors like “Failed to load module script” or 404 on `/assets/*.js`
- **Network**: `/assets/index-*.js` should return JavaScript (200), not HTML
