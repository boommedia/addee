create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  agency_name text,
  sites_managed text,
  created_at timestamptz not null default now()
);

alter table waitlist enable row level security;

-- Only service role can read/write waitlist (no public access)
create policy "service role only" on waitlist
  using (false);
