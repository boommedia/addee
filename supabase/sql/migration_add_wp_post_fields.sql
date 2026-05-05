-- Add WordPress publish tracking fields to posts table
alter table posts
  add column if not exists wp_post_id int,
  add column if not exists wp_post_url text,
  add column if not exists wp_status text,
  add column if not exists published_at timestamptz;
