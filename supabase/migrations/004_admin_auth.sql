-- Admin authentication — restrict dashboard writes to admin users only

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_admin = true
  );
$$;

-- Destinations, itineraries, routes — admin only for writes
drop policy if exists "Authenticated users can manage destinations" on public.destinations;
drop policy if exists "Authenticated users can manage itineraries" on public.itineraries;
drop policy if exists "Authenticated users can manage itinerary days" on public.itinerary_days;
drop policy if exists "Authenticated users can manage routes" on public.routes;

create policy "Admins can manage destinations"
  on public.destinations for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Admins can manage itineraries"
  on public.itineraries for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Admins can manage itinerary days"
  on public.itinerary_days for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Admins can manage routes"
  on public.routes for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

-- Users can read profiles (includes is_admin for client-side admin gate)
drop policy if exists "Profiles are viewable by everyone" on public.profiles;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);
