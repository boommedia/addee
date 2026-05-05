-- Subscription and usage tracking
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free',
  status text not null default 'active',
  posts_limit int not null default 10,
  sites_limit int not null default 2,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

create policy "users read own subscription"
  on subscriptions for select
  to authenticated
  using (user_id = auth.uid());

create policy "service role manages subscriptions"
  on subscriptions for all
  to service_role
  using (true)
  with check (true);

create index if not exists subscriptions_user_id on subscriptions(user_id);
create index if not exists subscriptions_stripe_customer on subscriptions(stripe_customer_id);
