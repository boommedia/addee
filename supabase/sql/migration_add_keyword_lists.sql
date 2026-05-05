-- Keyword search history: every AI research run
create table if not exists keyword_searches (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  niche       text not null,
  location    text,
  client_id   uuid references clients(id) on delete set null,
  keywords    jsonb not null default '[]',
  created_at  timestamptz default now()
);

-- Keyword lists: named collections saved by the user
create table if not exists keyword_lists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  description text,
  client_id   uuid references clients(id) on delete set null,
  keywords    jsonb not null default '[]',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table keyword_searches enable row level security;
alter table keyword_lists enable row level security;

create policy "users manage own keyword_searches"
  on keyword_searches for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "users manage own keyword_lists"
  on keyword_lists for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
