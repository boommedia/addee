-- Create client_integrations table for storing OAuth tokens
CREATE TABLE IF NOT EXISTS client_integrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google_gmb', 'linkedin')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  location_id TEXT, -- For GMB, stores the Business Profile ID
  page_id TEXT,     -- For LinkedIn, stores the Page ID/URN
  page_name TEXT,   -- Display name for the page/location
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (client_id, provider)
);

-- Enable RLS
ALTER TABLE client_integrations ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only view/edit their own client integrations
CREATE POLICY "client_integrations_user_isolation"
  ON client_integrations
  FOR ALL
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_integrations.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Create index for faster queries
CREATE INDEX idx_client_integrations_user_id ON client_integrations(user_id);
CREATE INDEX idx_client_integrations_client_id ON client_integrations(client_id);
CREATE INDEX idx_client_integrations_provider ON client_integrations(provider);
