-- Seed data for Savanna Luxe Safaris
-- Run AFTER 001_initial_schema.sql in Supabase SQL Editor

insert into public.destinations (
  slug, title, location, region, experience_type, description,
  pricing, safety_and_conditions, transport_and_logistics, additional_info,
  hike_difficulty, image, gallery, highlights, map_query
) values
(
  'maasai-mara', 'Maasai Mara National Reserve', 'Narok County', 'Savanna', 'standard',
  'Kenya''s most iconic safari landscape with rolling golden plains, big cats, dramatic river crossings, and luxury tented camps that bring guests close to the action.',
  'From $620 per person per day for premium conservancy stays. Balloon safaris from $450 pp extra.',
  'Dry-season tracks are well maintained. Early mornings are cool; pack layers. Follow guide instructions near river crossings and predator sightings.',
  'Fly from Wilson Airport to Mara airstrips (45 min) or drive via Narok in 5–6 hours. Most camps include airstrip transfers and twice-daily game drives.',
  'Peak migration window is July–October. January–March is excellent for big cats with fewer crowds.',
  null,
  'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1600&q=80',
  array['https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1200&q=80'],
  array['Great Migration','Big cats','Hot-air balloon safaris','Private conservancies'],
  'Maasai Mara National Reserve Kenya'
),
(
  'amboseli', 'Amboseli National Park', 'Kajiado County', 'Mountain views', 'standard',
  'A cinematic safari setting known for immense elephant herds, open wetlands, and unforgettable views of Mount Kilimanjaro rising beyond the plains.',
  'From $480 per person per day including lodge, meals, and shared game drives. Private vehicle from $180 per day.',
  'Open plains mean strong sun — bring SPF and a hat. Wetlands can be dusty in dry season. Wildlife always has right of way on tracks.',
  '4-hour drive from Nairobi or 30-minute charter to Amboseli airstrip. Road transfers from $120 pp one way.',
  'Best Kilimanjaro views at dawn, June–October and January–February. Cultural visits to Maasai communities available nearby.',
  null,
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
  array['https://images.unsplash.com/photo-1504432842672-1a79f78e4084?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'],
  array['Elephant herds','Kilimanjaro views','Wetland birding','Luxury lodges'],
  'Amboseli National Park Kenya'
),
(
  'hells-gate', 'Hell''s Gate National Park', 'Naivasha, Nakuru County', 'Rift Valley', 'hike',
  'A dramatic Rift Valley park of cliffs, geothermal steam vents, and cycling trails — one of Kenya''s best day-hike and adventure landscapes.',
  null, null,
  '2-hour drive from Nairobi. Bikes available at the gate (~$15). Most visitors combine with Lake Naivasha boat lunch.',
  'Arrive before 9am to avoid heat. Buffalo and baboons present — keep distance. Fischer''s Tower and Central Tower are photo highlights.',
  'Moderate — 3–4 hour canyon loop with some rocky sections and sun exposure. Suitable for fit beginners with water and a guide.',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
  array['https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1521651201144-634f700b36ef?auto=format&fit=crop&w=1200&q=80'],
  array['Canyon hikes','Cycling trails','Geothermal vents','Day-trip from Nairobi'],
  'Hell''s Gate National Park Kenya'
)
on conflict (slug) do nothing;

insert into public.itineraries (id, title, duration, route, price, style, image) values
(
  'migration-luxe', 'Great Migration Luxe Escape', '5 days',
  'Nairobi -> Maasai Mara -> Nairobi', 'From $3,850 pp', 'Fly-in luxury camp',
  'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1400&q=80'
)
on conflict (id) do nothing;

insert into public.itinerary_days (itinerary_id, day_order, day_label, title, details) values
('migration-luxe', 1, 'Day 1', 'Arrive in Nairobi', 'VIP meet-and-assist, private transfer, and a relaxed evening at a leafy boutique hotel.'),
('migration-luxe', 2, 'Day 2', 'Fly to the Mara', 'Scenic light-aircraft flight into the reserve, afternoon game drive, and sundowners over the plains.'),
('migration-luxe', 3, 'Day 3', 'Big cat country', 'Full-day safari across predator territories with an optional hot-air balloon experience at dawn.')
on conflict do nothing;

insert into public.routes (name, route_type, distance, status) values
('Nairobi -> Maasai Mara', 'Fly-in', '290 km', 'active'),
('Amboseli -> Tsavo -> Diani', 'Road + SGR', '690 km', 'active')
on conflict do nothing;

insert into public.community_updates (destination_slug, author_name, comment, is_on_ground, created_at) values
(
  'maasai-mara', 'Wanjiku M.',
  'Just watched a crossing at Mara River — absolutely electric this morning. Conservancy roads are dry and guides are spacing vehicles well.',
  true, now() - interval '12 minutes'
),
(
  'hells-gate', 'Tom R.',
  'Did the gorge hike this morning — moderate is accurate. Started at 7am and finished before the heat.',
  true, now() - interval '45 minutes'
);
