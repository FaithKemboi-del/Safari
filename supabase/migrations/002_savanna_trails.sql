-- Savanna Trails — open trail maps, reviews, and GPS recordings
-- Run after 001_initial_schema.sql

create table if not exists public.trails (
  id text primary key,
  slug text unique not null,
  title text not null,
  location text not null,
  difficulty text not null check (difficulty in ('easy', 'moderate', 'hard', 'expert')),
  difficulty_label text not null,
  duration text not null,
  distance_km numeric not null,
  elevation_gain_m integer not null,
  budget text not null,
  description text not null,
  image text not null,
  map_query text not null,
  google_maps_url text not null,
  destination_slug text references public.destinations (slug) on delete set null,
  route_type text not null check (route_type in ('loop', 'out-and-back', 'point-to-point')),
  coordinates jsonb not null default '[]',
  waypoints jsonb not null default '[]',
  elevation_profile jsonb not null default '[]',
  tips text[] not null default '{}',
  status text not null default 'published' check (status in ('published', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trail_reviews (
  id uuid primary key default gen_random_uuid(),
  trail_id text not null references public.trails (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.hike_tracks (
  id uuid primary key default gen_random_uuid(),
  trail_id text references public.trails (id) on delete set null,
  user_id uuid references auth.users (id) on delete set null,
  trail_name text not null,
  track_points jsonb not null default '[]',
  distance_km numeric not null default 0,
  started_at timestamptz not null,
  ended_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists trail_reviews_trail_id_idx on public.trail_reviews (trail_id, created_at desc);
create index if not exists hike_tracks_user_id_idx on public.hike_tracks (user_id, created_at desc);

drop trigger if exists trails_updated_at on public.trails;
create trigger trails_updated_at
  before update on public.trails
  for each row execute function public.set_updated_at();

alter table public.trails enable row level security;
alter table public.trail_reviews enable row level security;
alter table public.hike_tracks enable row level security;

create policy "Published trails are public"
  on public.trails for select using (status = 'published');

create policy "Trail reviews are public"
  on public.trail_reviews for select using (true);

create policy "Signed-in users can post trail reviews"
  on public.trail_reviews for insert
  with check (auth.role() = 'authenticated');

create policy "Users can read own hike tracks"
  on public.hike_tracks for select
  using (auth.uid() = user_id);

create policy "Users can insert own hike tracks"
  on public.hike_tracks for insert
  with check (auth.uid() = user_id);

create policy "Authenticated users can manage trails"
  on public.trails for all using (auth.role() = 'authenticated');
