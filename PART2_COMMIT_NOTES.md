# GlobeTrotter — Frontend Part 2 Commit

Team: Alpha Protocol
Hackathon: Odoo x LDCE

## What this commit adds

- Trip itinerary day model and itinerary activity model
- Activity catalog and activity discovery
- Trip budget and expense tracking
- Trip calendar/timeline
- Public trip sharing foundation
- Supabase RLS policies for new trip-owned data
- Part 2 API service layer
- Explore destinations/activity pages
- Navigation from trip overview to Part 2 modules

## Supabase

Run these in order:

1. `supabase/migrations/001_initial_globetrotter_schema.sql`
2. `supabase/migrations/002_itinerary_activity_budget_sharing.sql`
3. `supabase/seed.sql`
4. `supabase/seed_part2.sql`

Do not commit `.env` or `.env.local`.

## Suggested commit message

`feat: add itinerary activities budget calendar and trip sharing`

## Integration

This is an overlay commit for the existing GlobeTrotter Part 1 repository. It intentionally does not include `node_modules`, `.next`, or Git history.
