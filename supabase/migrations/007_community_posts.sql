-- Global Safiri community feed (questions, trip reports, tips)

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  author_name text not null,
  message text not null,
  kind text not null default 'question' check (kind in ('question', 'trip-report', 'tip')),
  destination_slug text references public.destinations (slug) on delete set null,
  itinerary_id text references public.itineraries (id) on delete set null,
  is_pinned boolean not null default false,
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_posts_created_at_idx
  on public.community_posts (created_at desc);

create index if not exists community_posts_status_idx
  on public.community_posts (status, is_pinned desc, created_at desc);

drop trigger if exists community_posts_updated_at on public.community_posts;
create trigger community_posts_updated_at
  before update on public.community_posts
  for each row execute function public.set_updated_at();

alter table public.community_posts enable row level security;

create policy "Published community posts are public"
  on public.community_posts for select
  using (status = 'published' or auth.role() = 'authenticated');

create policy "Signed-in users can post to community"
  on public.community_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own community posts"
  on public.community_posts for update
  using (auth.uid() = user_id);

create policy "Authenticated users can moderate community posts"
  on public.community_posts for all
  using (auth.role() = 'authenticated');
