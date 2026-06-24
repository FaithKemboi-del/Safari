# Destination redesign — schema summary

Run `supabase/migrations/009_destinations_redesign.sql` in the Supabase SQL Editor after prior migrations.

## New columns on `public.destinations`

| Column | Type | Purpose |
|--------|------|---------|
| `category` | `text` | hiking, waterfalls, camping, wildlife, hidden-gems, coast, staycations, events |
| `county` | `text` | County label for filters and quick facts |
| `nearest_town` | `text` | Nearest town |
| `distance_from_nairobi_km` | `numeric` | Distance filter |
| `travel_time_from_nairobi` | `text` | Human-readable travel time |
| `best_time_to_visit` | `text` | Seasonality |
| `budget_transport` | `numeric` | Budget line item (KES) |
| `budget_accommodation` | `numeric` | Budget line item (KES) |
| `budget_entry_fee` | `numeric` | Budget line item (KES) |
| `budget_guide_fee` | `numeric` | Budget line item (KES) |
| `budget_food` | `numeric` | Budget line item (KES) |
| `budget_activity` | `numeric` | Budget line item (KES) |
| `directions` | `text` | How to get there |
| `road_conditions` | `text` | Road notes |
| `public_transport` | `text` | Matatu / bus / SGR info |
| `what_to_carry` | `text` | Packing guidance |
| `travel_tips` | `text` | Extra advice |
| `family_friendly` | `boolean` | Filter flag |
| `category_fields` | `jsonb` | Category-specific admin fields |

## Legacy columns retained (not dropped)

- `experience_type`
- `pricing`
- `safety_and_conditions`
- `transport_and_logistics`
- `additional_info`
- `hike_difficulty`

Existing rows are backfilled into the new columns where possible. Legacy fields continue to populate the UI when new budget fields are empty.

## Indexes added

- `destinations_category_idx`
- `destinations_county_idx`
- `destinations_distance_idx`
- `destinations_family_friendly_idx`

## Budget estimates (computed in app)

- **Day trip** = transport + entry + guide + food + activity
- **Weekend** = day trip × 2 + accommodation × 2
- **Total** = sum of all six budget lines
