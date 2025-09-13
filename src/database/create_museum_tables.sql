-- Create table for user museum artifacts
CREATE TABLE IF NOT EXISTS user_museum_artifacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artifact_id TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, artifact_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_museum_artifacts_user_id ON user_museum_artifacts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_museum_artifacts_artifact_id ON user_museum_artifacts(artifact_id);

-- Enable RLS (Row Level Security)
ALTER TABLE user_museum_artifacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own artifacts
CREATE POLICY "Users can view their own artifacts" ON user_museum_artifacts
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own artifacts
CREATE POLICY "Users can insert their own artifacts" ON user_museum_artifacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own artifacts (if needed)
CREATE POLICY "Users can delete their own artifacts" ON user_museum_artifacts
  FOR DELETE USING (auth.uid() = user_id);
