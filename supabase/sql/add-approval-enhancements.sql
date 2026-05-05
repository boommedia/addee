-- Create approval_generations table to track AI-assisted content/image updates during approval
CREATE TABLE IF NOT EXISTS approval_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'content')),
  is_free BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_credits table to track credits for paid generations
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE approval_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- RLS policies for approval_generations: users can only see their own
CREATE POLICY "Users can view their own approval generations"
  ON approval_generations
  FOR SELECT
  USING (user_id = auth.uid());

-- RLS policies for user_credits: users can only see their own
CREATE POLICY "Users can view their own credits"
  ON user_credits
  FOR SELECT
  USING (user_id = auth.uid());

-- Service role can update credits
CREATE POLICY "Service role can update user credits"
  ON user_credits
  FOR UPDATE
  USING (TRUE)
  WITH CHECK (TRUE);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_approval_generations_user_id ON approval_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_approval_generations_post_id ON approval_generations(post_id);
CREATE INDEX IF NOT EXISTS idx_approval_generations_type ON approval_generations(type);
