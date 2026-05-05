-- Monthly SEO reports for agencies to share with clients
create table if not exists monthly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text, -- cached for cron job email sending
  client_id uuid not null references clients(id) on delete cascade,
  year_month date not null, -- first day of month (e.g., 2026-04-01)
  posts_count integer not null default 0,
  posts_word_count integer not null default 0,
  gsc_impressions integer not null default 0,
  gsc_clicks integer not null default 0,
  gsc_ctr numeric(5,4) not null default 0,
  gsc_avg_position numeric(6,2) not null default 0,
  -- month-over-month deltas (vs prior month)
  impressions_delta integer,
  clicks_delta integer,
  ctr_delta numeric(5,4),
  position_delta numeric(6,2),
  pdf_url text, -- S3/storage URL if generated
  email_sent_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, client_id, year_month)
);

create index if not exists monthly_reports_user_client
  on monthly_reports(user_id, client_id, year_month desc);

create index if not exists monthly_reports_user_date
  on monthly_reports(user_id, year_month desc);

alter table monthly_reports enable row level security;

create policy "Users see their own reports"
  on monthly_reports for select
  using (user_id = auth.uid());

create policy "Users insert their own reports"
  on monthly_reports for insert
  with check (user_id = auth.uid());

create policy "Users update their own reports"
  on monthly_reports for update
  using (user_id = auth.uid());
