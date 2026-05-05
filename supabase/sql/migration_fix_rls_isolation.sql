-- Fix data isolation: scope clients, posts, and topic_queue to their owner.
-- Clients already have created_by; posts have created_by; topic_queue scopes via client_id.
-- Team members can view (but not create) their owner's data.

-- ── CLIENTS ───────────────────────────────────────────────────────────────────

-- Drop old permissive policy
DROP POLICY IF EXISTS "authenticated users can manage clients" ON clients;

-- Ensure created_by is set on any rows that somehow ended up NULL
-- (set to the first/oldest user, who is the account owner)
UPDATE clients
SET created_by = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
WHERE created_by IS NULL;

-- Owner + team members can read; only owner can write
CREATE POLICY "owners and members read clients"
  ON clients FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid()
    OR created_by IN (
      SELECT owner_user_id FROM team_members WHERE member_user_id = auth.uid()
    )
  );

CREATE POLICY "owners insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "owners update clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "owners delete clients"
  ON clients FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- ── POSTS ─────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "authenticated users can manage posts" ON posts;

-- Set created_by on any posts missing it (via client owner lookup)
UPDATE posts p
SET created_by = (
  SELECT created_by FROM clients c WHERE c.id = p.client_id LIMIT 1
)
WHERE p.created_by IS NULL AND p.client_id IS NOT NULL;

-- Fallback: any still-null rows → oldest user
UPDATE posts
SET created_by = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
WHERE created_by IS NULL;

CREATE POLICY "owners and members read posts"
  ON posts FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid()
    OR created_by IN (
      SELECT owner_user_id FROM team_members WHERE member_user_id = auth.uid()
    )
  );

CREATE POLICY "owners insert posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "owners update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "owners delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- ── TOPIC QUEUE ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "authenticated users manage topic_queue" ON topic_queue;

CREATE POLICY "owners and members read topic_queue"
  ON topic_queue FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients
      WHERE created_by = auth.uid()
         OR created_by IN (
           SELECT owner_user_id FROM team_members WHERE member_user_id = auth.uid()
         )
    )
  );

CREATE POLICY "owners write topic_queue"
  ON topic_queue FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IN (SELECT id FROM clients WHERE created_by = auth.uid())
  );

CREATE POLICY "owners update topic_queue"
  ON topic_queue FOR UPDATE
  TO authenticated
  USING (
    client_id IN (SELECT id FROM clients WHERE created_by = auth.uid())
  );

CREATE POLICY "owners delete topic_queue"
  ON topic_queue FOR DELETE
  TO authenticated
  USING (
    client_id IN (SELECT id FROM clients WHERE created_by = auth.uid())
  );

-- Service role bypass (needed for cron jobs)
CREATE POLICY "service role manages topic_queue"
  ON topic_queue FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service role manages clients"
  ON clients FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service role manages posts"
  ON posts FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
