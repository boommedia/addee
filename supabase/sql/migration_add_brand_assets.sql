-- Add brand asset fields to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#6d28d9';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS brand_guidelines TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS target_keywords TEXT;
