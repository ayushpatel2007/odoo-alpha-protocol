# Team Member 3 — Trip Insights & Export

Adds a reporting layer on top of Team Member 2's itinerary and budget features.

## Added
- `/trips/[id]/insights` trip analytics dashboard
- Budget health and spending percentage
- Daily average spend
- Activity count and estimated activity cost
- Spending by category
- Activity pace by itinerary day
- Destination summary
- Recent expense summary
- `/trips/[id]/print` print-friendly trip report
- Browser Print / Save as PDF

## Data
Reuses existing `getTripById`, `getTripDays`, `getTripActivities`, and `getExpenses` APIs. No new database migration is required.

## Commit
`feat: add trip insights and printable export`
