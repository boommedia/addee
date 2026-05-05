-- User signup approval system
create table public.user_approvals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users on delete cascade,
  email text not null,
  status text not null default 'pending',  -- pending | approved | rejected
  created_at timestamptz default now(),
  approved_at timestamptz,
  rejected_at timestamptz
);

-- Allow users to read their own approval record (needed by middleware)
alter table public.user_approvals enable row level security;
create policy "users read own approval" on public.user_approvals
  for select using (auth.uid() = user_id);

-- Trigger: auto-insert record on new signup
create or replace function handle_new_user_approval()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email = 'eric@boommedia.us' then
    insert into public.user_approvals (user_id, email, status, approved_at)
    values (new.id, coalesce(new.email,''), 'approved', now());
  else
    insert into public.user_approvals (user_id, email, status)
    values (new.id, coalesce(new.email,''), 'pending');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user_approval();

-- Approve all existing users (backward compatibility)
insert into public.user_approvals (user_id, email, status, approved_at)
select id, coalesce(email,''), 'approved', now()
from auth.users
on conflict (user_id) do nothing;
