-- Community trails and hike-track sync policies
-- Run after 002_savanna_trails.sql

alter table public.trails
  add column if not exists created_by_user_id uuid references auth.users (id) on delete set null;

drop policy if exists "Authenticated users can manage trails" on public.trails;

create policy "Authenticated users can insert trails"
  on public.trails for insert
  with check (
    auth.role() = 'authenticated'
    and (created_by_user_id is null or created_by_user_id = auth.uid())
  );

create policy "Users can update own trails"
  on public.trails for update
  using (created_by_user_id = auth.uid());

create policy "Users can delete own trails"
  on public.trails for delete
  using (created_by_user_id = auth.uid());

create policy "Users can update own hike tracks"
  on public.hike_tracks for update
  using (auth.uid() = user_id);

create policy "Users can delete own hike tracks"
  on public.hike_tracks for delete
  using (auth.uid() = user_id);
