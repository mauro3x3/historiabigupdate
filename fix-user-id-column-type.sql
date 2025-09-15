-- Fix user_id column type to allow 'api' string
-- This changes the user_id column from UUID to TEXT so it can store 'api'

-- First, let's check the current column type
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'userdots' 
AND column_name = 'user_id';

-- IMPORTANT: Drop policies FIRST before changing column type
-- PostgreSQL won't let us alter a column that's used in policies
DROP POLICY IF EXISTS "Allow api content insertion" ON userdots;
DROP POLICY IF EXISTS "Users can insert their own content" ON userdots;
DROP POLICY IF EXISTS "Anyone can read approved public content" ON userdots;
DROP POLICY IF EXISTS "Allow system content insertion" ON userdots;
DROP POLICY IF EXISTS "Allow system user content insertion" ON userdots;

-- Now change the user_id column from UUID to TEXT
ALTER TABLE userdots
ALTER COLUMN user_id TYPE TEXT;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'userdots' 
AND column_name = 'user_id';

-- Recreate policies for TEXT user_id
CREATE POLICY "Allow api content insertion" ON userdots
  FOR INSERT WITH CHECK (user_id = 'api');

CREATE POLICY "Allow system content insertion" ON userdots
  FOR INSERT WITH CHECK (user_id IS NULL);

CREATE POLICY "Users can insert their own content" ON userdots
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Anyone can read approved public content" ON userdots
  FOR SELECT USING (
    (is_public = true AND is_approved = true) OR 
    (user_id = 'api' AND category = 'News Event')
  );

-- Verify all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'userdots';
