-- Create client_images table for storing uploaded images
CREATE TABLE IF NOT EXISTS client_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_client_image UNIQUE (client_id, file_name)
);

-- Enable RLS
ALTER TABLE client_images ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only view/edit their own client images
CREATE POLICY "client_images_user_isolation"
  ON client_images
  FOR ALL
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_images.client_id
      AND clients.created_by = auth.uid()
    )
  );

-- Create indexes for faster queries
CREATE INDEX idx_client_images_user_id ON client_images(user_id);
CREATE INDEX idx_client_images_client_id ON client_images(client_id);
