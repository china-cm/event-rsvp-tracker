-- Event RSVP Tracker: initial schema

create extension if not exists "pgcrypto";

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  name text not null,
  email text not null,
  status text not null check (status in ('yes', 'no', 'maybe')),
  guest_count integer not null default 0 check (guest_count >= 0),
  created_at timestamptz not null default now(),
  unique (event_id, email)
);

create index if not exists rsvps_event_id_idx on rsvps (event_id);

alter table events enable row level security;
alter table rsvps enable row level security;

-- Public can read events (RSVP pages are public links) and create RSVPs.
create policy "Events are publicly readable" on events
  for select using (true);

create policy "Anyone can create an event" on events
  for insert with check (true);

create policy "RSVPs are publicly readable" on rsvps
  for select using (true);

create policy "Anyone can submit an RSVP" on rsvps
  for insert with check (true);
