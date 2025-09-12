-- SQL to set up the userdots table for the globe functionality
-- Run this in your Supabase SQL Editor

-- First, let's add all the necessary columns to your existing userdots table
ALTER TABLE userdots 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS title text NOT NULL,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS category text NOT NULL,
ADD COLUMN IF NOT EXISTS coordinates jsonb NOT NULL, -- [longitude, latitude] array
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS author text NOT NULL,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT true, -- For content moderation
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true, -- For privacy controls
ADD COLUMN IF NOT EXISTS date_happened text, -- When the historical event occurred
ADD COLUMN IF NOT EXISTS source text; -- Where the information came from

-- Create indexes for better performance
-- Note: Using regular indexes instead of spatial indexes since PostGIS is not enabled
CREATE INDEX IF NOT EXISTS idx_userdots_user_id ON userdots(user_id);
CREATE INDEX IF NOT EXISTS idx_userdots_category ON userdots(category);
CREATE INDEX IF NOT EXISTS idx_userdots_created_at ON userdots(created_at);
CREATE INDEX IF NOT EXISTS idx_userdots_approved ON userdots(is_approved);
CREATE INDEX IF NOT EXISTS idx_userdots_public ON userdots(is_public);

-- Create a functional index on coordinates for better query performance
CREATE INDEX IF NOT EXISTS idx_userdots_coordinates_lng ON userdots USING btree (((coordinates->>0)::float));
CREATE INDEX IF NOT EXISTS idx_userdots_coordinates_lat ON userdots USING btree (((coordinates->>1)::float));

-- Enable Row Level Security
ALTER TABLE userdots ENABLE ROW LEVEL SECURITY;

-- Create policies for user content
-- Users can read all public, approved content
CREATE POLICY "Anyone can read approved public content" ON userdots
  FOR SELECT USING (is_public = true AND is_approved = true);

-- Users can insert their own content
CREATE POLICY "Users can insert their own content" ON userdots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own content
CREATE POLICY "Users can update their own content" ON userdots
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own content
CREATE POLICY "Users can delete their own content" ON userdots
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_userdots_updated_at
  BEFORE UPDATE ON userdots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data to test (optional)
INSERT INTO userdots (user_id, title, description, category, coordinates, author, date_happened, source) VALUES
(
  (SELECT id FROM user_profiles LIMIT 1), -- Use first available user
  'Sample Historical Event',
  'This is a test event to verify the globe functionality works',
  'Historical Event',
  '[2.3522, 48.8566]', -- Paris coordinates
  'Test User',
  '1789',
  'Historical records'
),
(
  (SELECT id FROM user_profiles LIMIT 1),
  'Ancient Battle Site',
  'Location of a famous ancient battle',
  'Battle',
  '[12.4964, 41.9028]', -- Rome coordinates
  'Test User',
  '44 BC',
  'Historical texts'
);

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'userdots' 
ORDER BY ordinal_position;
