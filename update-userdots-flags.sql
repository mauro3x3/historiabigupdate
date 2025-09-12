-- SQL to add flags column to userdots table for moderation
-- Run this in your Supabase SQL Editor

-- Add flags column to track how many times content has been flagged
ALTER TABLE userdots 
ADD COLUMN IF NOT EXISTS flags integer DEFAULT 0;

-- Create index for better performance on flags
CREATE INDEX IF NOT EXISTS idx_userdots_flags ON userdots(flags);

-- Update the policy to allow moderators to update flags
-- Note: You may need to adjust this based on your moderator role system
CREATE POLICY "Moderators can update flags" ON userdots
  FOR UPDATE USING (true); -- This allows any authenticated user to update flags
  -- In production, you might want to restrict this to specific moderator roles

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'userdots' 
AND column_name = 'flags';
