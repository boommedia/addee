-- Keyword ranking snapshots — one row per (client, keyword, check run)
create table if not exists keyword_rankings (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  client_id     uuid        not null,
  keyword       text        not null,
  position      integer,
  url           text,
  search_volume integer,
  checked_at    timestamptz not null default now()
);

create index if not exists keyword_rankings_lookup
  on keyword_rankings (user_id, client_id, keyword, checked_at desc);

create index if not exists keyword_rankings_recent
  on keyword_rankings (checked_at desc);

alter table keyword_rankings enable row level security;

create policy "Users see their own keyword rankings"
  on keyword_rankings for select
  using (user_id = auth.uid());

create policy "Users insert their own keyword rankings"
  on keyword_rankings for insert
  with check (user_id = auth.uid());

-- Service role (cron) bypass handled by service key — no policy needed
