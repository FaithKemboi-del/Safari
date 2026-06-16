-- Category page cards (spots + events)

create table if not exists public.category_spots (
  id text primary key,
  category_id text not null,
  title text not null,
  location text not null,
  budget text not null,
  description text not null,
  image text not null,
  slug text,
  trail_id text,
  map_query text,
  date_label text,
  event_status text check (
    event_status is null
    or event_status in ('happening-now', 'upcoming', 'past')
  ),
  status text not null default 'published' check (status in ('published', 'draft', 'review')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists category_spots_category_id_idx
  on public.category_spots (category_id, sort_order, title);

drop trigger if exists category_spots_updated_at on public.category_spots;
create trigger category_spots_updated_at
  before update on public.category_spots
  for each row execute function public.set_updated_at();

alter table public.category_spots enable row level security;

create policy "Published category spots are public"
  on public.category_spots for select
  using (status = 'published');

create policy "Admins can manage category spots"
  on public.category_spots for all
  using (public.is_admin_user())
  with check (public.is_admin_user());
