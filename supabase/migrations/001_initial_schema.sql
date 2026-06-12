-- Savanna Luxe Safaris — initial Supabase schema
-- Run this in Supabase Dashboard → SQL Editor

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_initials text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Destinations
-- ---------------------------------------------------------------------------
create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  location text not null,
  region text not null,
  experience_type text not null check (experience_type in ('hike', 'standard')),
  description text not null,
  pricing text,
  safety_and_conditions text,
  transport_and_logistics text,
  additional_info text,
  hike_difficulty text,
  image text not null,
  gallery text[] not null default '{}',
  highlights text[] not null default '{}',
  map_query text not null,
  status text not null default 'published' check (status in ('published', 'draft', 'review')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Itineraries
-- ---------------------------------------------------------------------------
create table if not exists public.itineraries (
  id text primary key,
  title text not null,
  duration text not null,
  route text not null,
  price text not null,
  style text not null,
  image text not null,
  status text not null default 'live' check (status in ('live', 'review', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.itinerary_days (
  id uuid primary key default gen_random_uuid(),
  itinerary_id text not null references public.itineraries (id) on delete cascade,
  day_order int not null,
  day_label text not null,
  title text not null,
  details text not null,
  unique (itinerary_id, day_order)
);

-- ---------------------------------------------------------------------------
-- Routes (admin)
-- ---------------------------------------------------------------------------
create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  route_type text not null,
  distance text not null,
  status text not null default 'active' check (status in ('active', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Community updates
-- ---------------------------------------------------------------------------
create table if not exists public.community_updates (
  id uuid primary key default gen_random_uuid(),
  destination_slug text not null references public.destinations (slug) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  author_name text not null,
  comment text not null,
  is_on_ground boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists community_updates_destination_slug_idx
  on public.community_updates (destination_slug, created_at desc);

-- ---------------------------------------------------------------------------
-- Updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists destinations_updated_at on public.destinations;
create trigger destinations_updated_at
  before update on public.destinations
  for each row execute function public.set_updated_at();

drop trigger if exists itineraries_updated_at on public.itineraries;
create trigger itineraries_updated_at
  before update on public.itineraries
  for each row execute function public.set_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_initials)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    upper(left(coalesce(new.raw_user_meta_data->>'full_name', new.email), 2))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.itineraries enable row level security;
alter table public.itinerary_days enable row level security;
alter table public.routes enable row level security;
alter table public.community_updates enable row level security;

-- Profiles
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Destinations & itineraries — public read
create policy "Published destinations are public"
  on public.destinations for select using (status = 'published');

create policy "Live itineraries are public"
  on public.itineraries for select using (status = 'live');

create policy "Itinerary days are public"
  on public.itinerary_days for select using (
    exists (
      select 1 from public.itineraries i
      where i.id = itinerary_id and i.status = 'live'
    )
  );

create policy "Active routes are public"
  on public.routes for select using (status = 'active');

-- Community — public read, authenticated write own posts
create policy "Community updates are public"
  on public.community_updates for select using (true);

create policy "Signed-in users can post updates"
  on public.community_updates for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own updates"
  on public.community_updates for delete using (auth.uid() = user_id);

-- Admin writes (optional): authenticated users for now; tighten with admin role later
create policy "Authenticated users can manage destinations"
  on public.destinations for all using (auth.role() = 'authenticated');

create policy "Authenticated users can manage itineraries"
  on public.itineraries for all using (auth.role() = 'authenticated');

create policy "Authenticated users can manage itinerary days"
  on public.itinerary_days for all using (auth.role() = 'authenticated');

create policy "Authenticated users can manage routes"
  on public.routes for all using (auth.role() = 'authenticated');
