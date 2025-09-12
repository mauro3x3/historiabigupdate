-- Create user_generated_content table for storing dots/markers on the globe
CREATE TABLE IF NOT EXISTS user_generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  coordinates jsonb NOT NULL, -- [longitude, latitude] array
  image_url text,
  author text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  is_approved boolean DEFAULT true, -- For content moderation
  is_public boolean DEFAULT true -- For privacy controls
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_content_coordinates ON user_generated_content USING GIST (
  ST_Point((coordinates->>0)::float, (coordinates->>1)::float)
);

CREATE INDEX IF NOT EXISTS idx_user_content_user_id ON user_generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_category ON user_generated_content(category);
CREATE INDEX IF NOT EXISTS idx_user_content_created_at ON user_generated_content(created_at);
CREATE INDEX IF NOT EXISTS idx_user_content_approved ON user_generated_content(is_approved);

-- Enable Row Level Security
ALTER TABLE user_generated_content ENABLE ROW LEVEL SECURITY;

-- Create policies for user content
-- Users can read all public, approved content
CREATE POLICY "Anyone can read approved public content" ON user_generated_content
  FOR SELECT USING (is_public = true AND is_approved = true);

-- Users can insert their own content
CREATE POLICY "Users can insert their own content" ON user_generated_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own content
CREATE POLICY "Users can update their own content" ON user_generated_content
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own content
CREATE POLICY "Users can delete their own content" ON user_generated_content
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
CREATE TRIGGER update_user_content_updated_at
  BEFORE UPDATE ON user_generated_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
