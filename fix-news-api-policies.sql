-- Fix news API policies to allow adding dots
-- This script ensures all necessary policies are in place for the news API to work

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'userdots';

-- Drop ALL existing policies on userdots table to start fresh
DROP POLICY IF EXISTS "Allow api content insertion" ON userdots;
DROP POLICY IF EXISTS "Users can insert their own content" ON userdots;
DROP POLICY IF EXISTS "Users can update their own content" ON userdots;
DROP POLICY IF EXISTS "Users can delete their own content" ON userdots;
DROP POLICY IF EXISTS "Anyone can read approved public content" ON userdots;
DROP POLICY IF EXISTS "Allow system content insertion" ON userdots;
DROP POLICY IF EXISTS "Allow system user content insertion" ON userdots;
DROP POLICY IF EXISTS "Users can read their own content" ON userdots;
DROP POLICY IF EXISTS "Users can read all content" ON userdots;
DROP POLICY IF EXISTS "Enable read access for all users" ON userdots;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON userdots;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON userdots;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON userdots;

-- Verify the user_id column is TEXT type
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'userdots' 
AND column_name = 'user_id';

-- If user_id is not TEXT, change it
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'userdots' 
    AND column_name = 'user_id' 
    AND data_type != 'text'
  ) THEN
    ALTER TABLE userdots ALTER COLUMN user_id TYPE TEXT;
    RAISE NOTICE 'Changed user_id column to TEXT type';
  ELSE
    RAISE NOTICE 'user_id column is already TEXT type';
  END IF;
END $$;

-- Recreate all essential policies for TEXT user_id

-- Allow API to insert news articles
CREATE POLICY "Allow api content insertion" ON userdots
  FOR INSERT WITH CHECK (user_id = 'api');

-- Allow system content insertion (user_id is null)
CREATE POLICY "Allow system content insertion" ON userdots
  FOR INSERT WITH CHECK (user_id IS NULL);

-- Allow users to insert their own content
CREATE POLICY "Users can insert their own content" ON userdots
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own content
CREATE POLICY "Users can update their own content" ON userdots
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Allow users to delete their own content
CREATE POLICY "Users can delete their own content" ON userdots
  FOR DELETE USING (auth.uid()::text = user_id);

-- Allow reading approved public content and API news
CREATE POLICY "Anyone can read approved public content" ON userdots
  FOR SELECT USING (
    (is_public = true AND is_approved = true) OR 
    (user_id = 'api' AND category = 'News Event')
  );

-- Verify all policies were recreated
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'userdots';

-- Test that we can insert a test news article
INSERT INTO userdots (
  user_id, 
  title, 
  description, 
  category, 
  coordinates, 
  author, 
  date_happened, 
  source,
  is_approved,
  is_public
) VALUES (
  'api',
  'Test News Article',
  'This is a test to verify the API can insert news articles',
  'News Event',
  '[0, 0]',
  'Test API',
  '2024-01-01',
  'Test Source',
  true,
  true
);

-- Clean up the test article
DELETE FROM userdots WHERE title = 'Test News Article' AND user_id = 'api';

-- Success message
SELECT 'News API policies have been fixed successfully!' as status;
