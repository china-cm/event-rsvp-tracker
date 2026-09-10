# Release Log

All notable feature waves for the Event RSVP Tracker are recorded here, most recent first.

## v0.1.0 — 2026-09-10 — Core RSVP flow (first wave)

**Stack:** Next.js 14+ (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth)

### Added
- Event creation form (`/events/new`) — title, date/time, location, description.
- Public RSVP page (`/events/[id]`) — name, email, attending status (yes/no/maybe), guest count.
- Organizer dashboard (`/events/[id]/dashboard`) — attending/maybe counts, total headcount,
  and full RSVP list per event.
- Event list / home page (`/`) listing all events with links to the RSVP page and dashboard.
- REST API layer under `/api/events` and `/api/events/[id]/rsvps` backed by Supabase.
- Database schema: `events` and `rsvps` tables with RLS policies (`backend/supabase/migrations/0001_init.sql`).

### Automation added
- **Visual regression testing:** Storybook stories for `EventCard`, `RsvpForm`, `RsvpList`,
  published to Chromatic on every PR via GitHub Actions.
- **API contract testing:** Pact consumer test (frontend) + provider verification (backend),
  covering "create event" and "submit RSVP" interactions, wired into CI as a two-job pipeline.
- **CI:** GitHub Actions workflow for lint + type-check + build on every PR.

### Known limitations
- No authentication — event creation and RSVP submission are open to anyone with the link.
- No edit/delete flows for events or RSVPs.
- No email confirmations or reminders.

---

## Template for future entries

```
## vX.Y.Z — YYYY-MM-DD — <short title>

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Automation added
- ...
```
