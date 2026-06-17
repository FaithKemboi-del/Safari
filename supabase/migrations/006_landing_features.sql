-- Landing page featured content flags

alter table public.destinations
  add column if not exists featured_on_home boolean not null default false,
  add column if not exists featured_sort_order int not null default 0,
  add column if not exists trending_on_home boolean not null default false,
  add column if not exists trending_tag text,
  add column if not exists trending_searches text,
  add column if not exists trending_sort_order int not null default 0;

alter table public.itineraries
  add column if not exists featured_on_home boolean not null default false,
  add column if not exists featured_sort_order int not null default 0;

create index if not exists destinations_featured_on_home_idx
  on public.destinations (featured_on_home, featured_sort_order);

create index if not exists destinations_trending_on_home_idx
  on public.destinations (trending_on_home, trending_sort_order);

create index if not exists itineraries_featured_on_home_idx
  on public.itineraries (featured_on_home, featured_sort_order);
