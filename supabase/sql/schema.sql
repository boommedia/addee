-- Clients table: one row per Boom Media client
create table if not exists clients (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  brand_voice text,
  industry    text,
  website     text,
  created_at  timestamptz default now()
);

-- Posts table: every generated blog post
create table if not exists posts (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references clients(id) on delete cascade,
  title       text,
  content     text not null,
  prompt      text not null,
  tone        text,
  length      text,
  word_count  int,
  created_by  uuid references auth.users(id),
  created_at  timestamptz default now()
);

-- RLS: only authenticated users can read/write
alter table clients enable row level security;
alter table posts enable row level security;

create policy "authenticated users can manage clients"
  on clients for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated users can manage posts"
  on posts for all
  to authenticated
  using (true)
  with check (true);
