-- SQL to set up bookmarks and reports functionality
-- Run this in your Supabase SQL Editor

-- Create bookmarks table for users to save interesting content
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id text NOT NULL, -- ID of the bookmarked content
  content_type text NOT NULL CHECK (content_type IN ('module', 'user_content')), -- Type of content
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, content_id, content_type) -- Prevent duplicate bookmarks
);

-- Create reports table for content moderation
CREATE TABLE IF NOT EXISTS content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id text NOT NULL, -- ID of the reported content
  content_type text NOT NULL CHECK (content_type IN ('module', 'user_content')), -- Type of content
  reason text NOT NULL, -- Reason for reporting
  description text, -- Additional details
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  reviewed_at timestamp with time zone,
  reviewed_by uuid REFERENCES user_profiles(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_content ON user_bookmarks(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_content_reports_reporter ON content_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_content ON content_reports(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status);

-- Enable Row Level Security
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks
CREATE POLICY "Users can manage their own bookmarks" ON user_bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for reports
CREATE POLICY "Users can create reports" ON content_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON content_reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Create function to update updated_at timestamp for reports
CREATE OR REPLACE FUNCTION update_reports_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reviewed_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update reviewed_at
CREATE TRIGGER update_content_reports_reviewed_at
  BEFORE UPDATE ON content_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_reports_updated_at_column();
