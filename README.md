# Event RSVP Tracker

A small full-stack app for creating events and collecting RSVPs, built as a stack-stretch
exercise: every piece of this repo — framework, backend, and automation — was chosen to be
new territory rather than a repeat of tools already in daily use.

## Why this stack

| Layer | Choice | Why it's new |
|---|---|---|
| Frontend | [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS | React was familiar; the App Router, server components, and route handlers were not. |
| Backend / DB | [Supabase](https://supabase.com) (Postgres + Auth + REST API) | Replaces a hand-rolled AdonisJS backend with a managed Postgres + auto-generated API. |
| Visual regression | [Storybook](https://storybook.js.org) + [Chromatic](https://www.chromatic.com) | A new *category* of automation (UI screenshot diffing) rather than another E2E runner. |
| Contract testing | [Pact](https://pact.io) | Verifies the frontend's expectations of the API match what the API actually returns — new for both dev and QA sides. |
| CI/CD | GitHub Actions | Reused tool, new workflows (lint/build, Chromatic publish, Pact consumer + provider verification). |

## Repo structure

```
event-rsvp-tracker/
├── frontend/                        # Next.js app
│   ├── src/
│   │   ├── app/                     # Pages + API route handlers
│   │   │   ├── page.tsx             # Event list
│   │   │   ├── events/new/          # Create event form
│   │   │   ├── events/[id]/         # Public RSVP page
│   │   │   ├── events/[id]/dashboard/ # Organizer dashboard
│   │   │   └── api/events/...       # REST API (backed by Supabase)
│   │   ├── components/              # EventCard, RsvpForm, RsvpList (+ Storybook stories)
│   │   ├── contracts/                # Pact consumer contract test
│   │   ├── lib/                     # Supabase client, API client
│   │   └── types/                   # Shared TypeScript types
│   └── .storybook/                  # Storybook config (Chromatic addon included)
├── backend/
│   ├── supabase/
│   │   ├── migrations/0001_init.sql # events + rsvps schema
│   │   └── config.toml              # Supabase local dev config
│   └── contracts/
│       ├── verify-provider.ts       # Pact provider verification script
│       └── pacts/                   # Generated contract files (consumer -> provider)
├── .github/workflows/
│   ├── ci.yml                       # Lint + build
│   ├── chromatic.yml                # Visual regression publish
│   └── pact.yml                     # Contract test: consumer job -> provider job
└── docs/
    └── RELEASE_LOG.md
```

## Features (first wave)

- Create an event (title, date/time, location, description)
- Public RSVP page per event (name, email, attending yes/no/maybe, guest count)
- Organizer dashboard: event list + per-event RSVP counts and full guest list

## Getting started

### 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`backend/supabase/migrations/0001_init.sql`](backend/supabase/migrations/0001_init.sql).
3. Copy your project URL and anon key from **Project Settings > API**.

### 2. Configure environment variables

```bash
cp frontend/.env.example frontend/.env.local
# then fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Install and run

```bash
npm install --prefix frontend
npm run dev
```

Visit http://localhost:3000.

## Testing

| Command | What it does |
|---|---|
| `npm run lint` | ESLint across the frontend |
| `npm run build` | Type-checks and builds the Next.js app |
| `npm run storybook` | Local Storybook for component development |
| `npm run build-storybook` | Static Storybook build (what Chromatic snapshots) |
| `npm run chromatic` | Publishes a Chromatic build for visual review (needs `CHROMATIC_PROJECT_TOKEN`) |
| `npm run test:contract:consumer` | Runs the Pact consumer test, writes the contract to `backend/contracts/pacts/` |
| `npm run test:contract:provider` | Verifies a running API instance against the generated contract |

### Visual regression testing (Chromatic)

Every component (`EventCard`, `RsvpForm`, `RsvpList`) has Storybook stories under
`frontend/src/components/*.stories.tsx`. On every PR, `chromatic.yml` publishes a Storybook
build to Chromatic, which diffs each story's rendered screenshot against the baseline and
flags visual changes for review. Requires a `CHROMATIC_PROJECT_TOKEN` repo secret from
[chromatic.com](https://www.chromatic.com).

### API contract testing (Pact)

`frontend/src/contracts/events-api.consumer.test.ts` defines the requests the frontend's API
client (`frontend/src/lib/api-client.ts`) expects to make and the responses it expects back
(create event, submit RSVP), then runs them against a Pact mock server. That produces a pact
file consumed by `backend/contracts/verify-provider.ts`, which replays the same requests
against a real running instance of the Next.js API routes and checks the responses match.

In CI (`pact.yml`), this runs as two jobs: `consumer` generates and uploads the pact file,
`provider` downloads it, boots the app against a **test** Supabase project, and verifies.
Requires `SUPABASE_TEST_URL` / `SUPABASE_TEST_ANON_KEY` repo secrets, and the fixture event
referenced in the RSVP interaction (see the state handler warning in
`verify-provider.ts`) seeded in that test project.

## Known limitations (first wave)

- No authentication yet — anyone with an event link can view/RSVP, and the create-event form
  is unauthenticated. Row Level Security policies are intentionally permissive for this wave.
- No edit/delete for events or RSVPs.
- No email notifications/confirmations.

See [`docs/RELEASE_LOG.md`](docs/RELEASE_LOG.md) for what's shipped so far.
