-- Brands table: brand profiles with voice guidelines
create table if not exists brands (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  industry    text,
  brand_voice text,
  tone_examples text,
  visual_style text,
  logo_url    text,
  colors      jsonb,
  user_id     uuid references auth.users(id) on delete cascade,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Campaigns table: ad/social campaign configurations
create table if not exists campaigns (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid references brands(id) on delete cascade,
  name        text not null,
  description text,
  product_name text,
  target_audience text,
  goals       text,
  platforms   jsonb,
  status      text default 'draft',
  created_by  uuid references auth.users(id),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Ad drafts table: generated ad variations
create table if not exists ad_drafts (
  id          uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  brand_id    uuid references brands(id) on delete cascade,
  format      text not null,
  platform    text not null,
  headline    text,
  body_text   text,
  cta_text    text,
  image_url   text,
  video_url   text,
  status      text default 'draft',
  performance jsonb,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Enable RLS
alter table brands enable row level security;
alter table campaigns enable row level security;
alter table ad_drafts enable row level security;

-- RLS policies for brands
create policy "users can manage their own brands"
  on brands for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- RLS policies for campaigns
create policy "users can manage campaigns for their brands"
  on campaigns for all
  to authenticated
  using (
    brand_id in (
      select id from brands where user_id = auth.uid()
    )
  )
  with check (
    brand_id in (
      select id from brands where user_id = auth.uid()
    )
  );

-- RLS policies for ad_drafts
create policy "users can manage ads for their brands"
  on ad_drafts for all
  to authenticated
  using (
    brand_id in (
      select id from brands where user_id = auth.uid()
    )
  )
  with check (
    brand_id in (
      select id from brands where user_id = auth.uid()
    )
  );
