-- Add autoblogging schedule settings to clients
alter table clients
  add column if not exists schedule_enabled boolean default false,
  add column if not exists schedule_cadence text default 'weekly',
  add column if not exists schedule_time text default '09:00',
  add column if not exists schedule_tone text default 'professional',
  add column if not exists schedule_length text default 'medium',
  add column if not exists next_run_at timestamptz;

-- Topic queue table
create table if not exists topic_queue (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  topic text not null,
  status text not null default 'pending',
  scheduled_for timestamptz,
  post_id uuid references posts(id),
  error_message text,
  created_at timestamptz not null default now()
);

alter table topic_queue enable row level security;

create policy "authenticated users manage topic_queue"
  on topic_queue for all
  to authenticated
  using (true)
  with check (true);

create index if not exists topic_queue_client_status on topic_queue(client_id, status);
create index if not exists topic_queue_scheduled on topic_queue(scheduled_for, status);
