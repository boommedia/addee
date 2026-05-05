-- Referral program
create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  code text not null unique,
  referrals_count integer not null default 0,
  credits_earned integer not null default 0,
  created_at timestamptz default now()
);
alter table referrals enable row level security;
create policy "Users manage own referrals" on referrals for all using (auth.uid() = user_id);

-- GSC OAuth tokens
create table if not exists gsc_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  site_url text not null,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, site_url)
);
alter table gsc_tokens enable row level security;
create policy "Users manage own gsc tokens" on gsc_tokens for all using (auth.uid() = user_id);

-- GSC performance data
create table if not exists gsc_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  site_url text not null,
  query text not null,
  page text not null,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric(5,4) not null default 0,
  position numeric(6,2) not null default 0,
  date_start date not null,
  date_end date not null,
  synced_at timestamptz default now(),
  unique(user_id, site_url, query, page, date_start, date_end)
);
create index if not exists gsc_data_user_idx on gsc_data(user_id);
alter table gsc_data enable row level security;
create policy "Users manage own gsc data" on gsc_data for all using (auth.uid() = user_id);

-- Webhooks table for outbound webhook endpoints
create table if not exists webhooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  events text[] not null default '{post.created}',
  label text,
  last_triggered_at timestamptz,
  last_status integer,
  created_at timestamptz default now()
);
create index if not exists webhooks_user_id_idx on webhooks(user_id);
alter table webhooks enable row level security;
create policy "Users manage own webhooks" on webhooks for all using (auth.uid() = user_id);

-- Post versions for version history
create table if not exists post_versions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  word_count integer not null default 0,
  label text,
  created_at timestamptz default now()
);
create index if not exists post_versions_post_id_idx on post_versions(post_id);
alter table post_versions enable row level security;
create policy "Users manage own post versions" on post_versions for all using (auth.uid() = user_id);
