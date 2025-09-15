-- Add policy to allow system-generated news content
-- This allows content with user_id = null, 'api', or specific system users

-- First, let's add a policy for system content (user_id is null)
CREATE POLICY "Allow system content insertion" ON userdots
  FOR INSERT WITH CHECK (user_id IS NULL);

-- Allow content with user_id = 'api' for news articles
CREATE POLICY "Allow api content insertion" ON userdots
  FOR INSERT WITH CHECK (user_id = 'api');

-- Also allow content from the system user if it exists
CREATE POLICY "Allow system user content insertion" ON userdots
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM user_profiles 
      WHERE email = 'system@newsapi.com' 
      OR username = 'NewsAPI System'
    )
  );

-- Update the existing policy to be more specific
-- Drop the old policy first
DROP POLICY IF EXISTS "Users can insert their own content" ON userdots;

-- Create a new policy that allows users to insert their own content
CREATE POLICY "Users can insert their own content" ON userdots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update the SELECT policy to allow reading API content
DROP POLICY IF EXISTS "Anyone can read approved public content" ON userdots;

-- Create a new SELECT policy that includes API content
CREATE POLICY "Anyone can read approved public content" ON userdots
  FOR SELECT USING (
    (is_public = true AND is_approved = true) OR 
    (user_id = 'api' AND category = 'News Event')
  );

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'userdots';
