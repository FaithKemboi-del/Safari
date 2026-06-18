-- Spot inquiries and replies (questions from category spot / trail detail pages)
-- Run in Supabase SQL Editor after migrations 001, 004, and 005.

create table if not exists public.spot_inquiries (
  id uuid primary key default gen_random_uuid(),
  spot_id text not null,
  spot_title text not null,
  category_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  author_name text not null,
  message text not null,
  status text not null default 'published' check (status in ('published', 'hidden')),
  admin_seen boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spot_inquiry_replies (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.spot_inquiries (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  author_name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists spot_inquiries_spot_id_idx
  on public.spot_inquiries (spot_id, created_at desc);

create index if not exists spot_inquiries_admin_seen_idx
  on public.spot_inquiries (admin_seen, created_at desc);

create index if not exists spot_inquiry_replies_inquiry_id_idx
  on public.spot_inquiry_replies (inquiry_id, created_at asc);

drop trigger if exists spot_inquiries_updated_at on public.spot_inquiries;
create trigger spot_inquiries_updated_at
  before update on public.spot_inquiries
  for each row execute function public.set_updated_at();

alter table public.spot_inquiries enable row level security;
alter table public.spot_inquiry_replies enable row level security;

drop policy if exists "Published spot inquiries are public" on public.spot_inquiries;
drop policy if exists "Signed-in users can post spot inquiries" on public.spot_inquiries;
drop policy if exists "Admins can manage spot inquiries" on public.spot_inquiries;
drop policy if exists "Spot inquiry replies are public" on public.spot_inquiry_replies;
drop policy if exists "Signed-in users can reply to spot inquiries" on public.spot_inquiry_replies;
drop policy if exists "Admins can manage spot inquiry replies" on public.spot_inquiry_replies;

create policy "Published spot inquiries are public"
  on public.spot_inquiries for select
  using (status = 'published' or public.is_admin_user());

create policy "Signed-in users can post spot inquiries"
  on public.spot_inquiries for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage spot inquiries"
  on public.spot_inquiries for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Spot inquiry replies are public"
  on public.spot_inquiry_replies for select
  using (
    exists (
      select 1
      from public.spot_inquiries inquiry
      where inquiry.id = inquiry_id
        and (inquiry.status = 'published' or public.is_admin_user())
    )
  );

create policy "Signed-in users can reply to spot inquiries"
  on public.spot_inquiry_replies for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage spot inquiry replies"
  on public.spot_inquiry_replies for all
  using (public.is_admin_user())
  with check (public.is_admin_user());
