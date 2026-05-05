-- Client blog approval system
alter table posts
  add column if not exists approval_status text not null default 'draft',
  add column if not exists approval_token text unique,
  add column if not exists approval_sent_at timestamptz,
  add column if not exists approved_at timestamptz,
  add column if not exists client_feedback text;

-- Index for fast token lookups on the public approval page
create index if not exists posts_approval_token_idx on posts (approval_token) where approval_token is not null;

-- Make sure clients.contact_email exists (may have been added by prior migration)
alter table clients add column if not exists contact_email text;
