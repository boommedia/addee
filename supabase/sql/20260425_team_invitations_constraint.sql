-- Add unique constraint on (owner_user_id, email) to team_invitations
-- This allows upsert to work correctly when re-inviting the same email
alter table team_invitations add constraint team_invitations_owner_email_unique unique(owner_user_id, email);
