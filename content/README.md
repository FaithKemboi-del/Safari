# Safiri launch content pack

CSV source files for destinations, category cards, and budget itineraries.

## Files

| File | Rows |
|------|------|
| `hiking.csv` | 15 destinations |
| `waterfalls.csv` | 10 |
| `camping.csv` | 10 |
| `wildlife.csv` | 10 |
| `hidden-gems.csv` | 15 |
| `coast.csv` | 10 |
| `staycations.csv` | 10 |
| `events.csv` | 10 |
| `category-cards.csv` | 93 cards (90 destinations + 3 road trips) |
| `itineraries.csv` | 20 budget itineraries |
| `itinerary-days.csv` | Day-by-day details |

## Regenerate

```bash
python3 scripts/generate_content_pack.py
```

This updates the CSVs and `src/content/generatedCategorySpots.ts` / `generatedKenyaEvents.ts`, which power the category browse pages locally.

## Import

Upload CSVs to Supabase via the admin dashboard or a future bulk-import script. Until then, the app uses the generated TypeScript fallback when Supabase is empty.
