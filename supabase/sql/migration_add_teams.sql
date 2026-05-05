-- Team invitations: owner invites others by email
create table if not exists team_invitations (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  token uuid not null default gen_random_uuid() unique,
  accepted_at timestamptz,
  accepted_by_user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Team members: accepted invitations linking two user accounts
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  member_user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique(owner_user_id, member_user_id)
);

alter table team_invitations enable row level security;
alter table team_members enable row level security;

-- Owners can manage their own invitations
create policy "owner manages invitations"
  on team_invitations for all
  to authenticated
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

-- Anyone can read an invitation by token (for accept flow)
create policy "read invitation by token"
  on team_invitations for select
  to authenticated
  using (true);

-- Owners and members can see team membership
create policy "view team members"
  on team_members for select
  to authenticated
  using (owner_user_id = auth.uid() or member_user_id = auth.uid());

-- Service role manages everything
create policy "service role manages teams"
  on team_invitations for all
  to service_role
  using (true) with check (true);

create policy "service role manages members"
  on team_members for all
  to service_role
  using (true) with check (true);

create index if not exists team_invitations_owner on team_invitations(owner_user_id);
create index if not exists team_invitations_token on team_invitations(token);
create index if not exists team_members_owner on team_members(owner_user_id);
create index if not exists team_members_member on team_members(member_user_id);
