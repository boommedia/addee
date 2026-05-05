-- Add WordPress connection fields to clients table
alter table clients
  add column if not exists wp_url text,
  add column if not exists wp_username text,
  add column if not exists wp_app_password text;
