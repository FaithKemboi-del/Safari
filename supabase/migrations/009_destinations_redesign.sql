-- Destination redesign: shared travel fields + category-specific JSON
-- Migrates existing data; does not drop legacy columns.

alter table public.destinations
  add column if not exists category text,
  add column if not exists county text,
  add column if not exists nearest_town text,
  add column if not exists distance_from_nairobi_km numeric,
  add column if not exists travel_time_from_nairobi text,
  add column if not exists best_time_to_visit text,
  add column if not exists budget_transport numeric not null default 0,
  add column if not exists budget_accommodation numeric not null default 0,
  add column if not exists budget_entry_fee numeric not null default 0,
  add column if not exists budget_guide_fee numeric not null default 0,
  add column if not exists budget_food numeric not null default 0,
  add column if not exists budget_activity numeric not null default 0,
  add column if not exists directions text,
  add column if not exists road_conditions text,
  add column if not exists public_transport text,
  add column if not exists what_to_carry text,
  add column if not exists travel_tips text,
  add column if not exists family_friendly boolean not null default false,
  add column if not exists category_fields jsonb not null default '{}'::jsonb;

-- Backfill category from legacy experience_type
update public.destinations
set category = case
  when experience_type = 'hike' then 'hiking'
  when slug in ('diani') then 'coast'
  when slug in ('maasai-mara', 'amboseli', 'samburu', 'lake-nakuru', 'tsavo', 'laikipia', 'nairobi-national-park') then 'wildlife'
  else 'wildlife'
end
where category is null;

update public.destinations
set
  county = coalesce(county, location, region),
  nearest_town = coalesce(nearest_town, nullif(split_part(location, ',', 1), ''), location),
  directions = coalesce(directions, transport_and_logistics),
  travel_tips = coalesce(travel_tips, additional_info),
  what_to_carry = coalesce(what_to_carry, case when experience_type = 'hike' then additional_info end),
  best_time_to_visit = coalesce(best_time_to_visit, case
    when additional_info ilike '%july%' or additional_info ilike '%january%' then additional_info
    else null
  end)
where county is null
   or directions is null
   or travel_tips is null;

-- Hiking: move hike_difficulty into category_fields
update public.destinations
set category_fields = category_fields || jsonb_build_object(
  'difficulty', coalesce(category_fields->>'difficulty', split_part(hike_difficulty, '—', 1), hike_difficulty),
  'trail_information', coalesce(category_fields->>'trail_information', hike_difficulty)
)
where category = 'hiking'
  and (hike_difficulty is not null or category_fields = '{}'::jsonb);

-- Coast / wildlife highlights already in highlights[]
update public.destinations
set category_fields = category_fields || jsonb_build_object(
  'wildlife_highlights', array_to_string(highlights, ', ')
)
where category = 'wildlife'
  and highlights is not null
  and array_length(highlights, 1) > 0
  and not (category_fields ? 'wildlife_highlights');

create index if not exists destinations_category_idx
  on public.destinations (category, status);

create index if not exists destinations_county_idx
  on public.destinations (county);

create index if not exists destinations_distance_idx
  on public.destinations (distance_from_nairobi_km);

create index if not exists destinations_family_friendly_idx
  on public.destinations (family_friendly);

alter table public.destinations
  drop constraint if exists destinations_category_check;

alter table public.destinations
  add constraint destinations_category_check check (
    category is null or category in (
      'hiking',
      'waterfalls',
      'camping',
      'wildlife',
      'hidden-gems',
      'coast',
      'staycations',
      'events'
    )
  );
