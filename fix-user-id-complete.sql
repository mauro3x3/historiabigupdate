-- Complete fix for user_id column type change
-- This will drop ALL policies first, then change the column type

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'userdots';

-- Drop ALL existing policies on userdots table
-- We need to be comprehensive to avoid the "column used in policy" error
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

-- Now change the user_id column from UUID to TEXT
ALTER TABLE userdots
ALTER COLUMN user_id TYPE TEXT;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'userdots' 
AND column_name = 'user_id';

-- Recreate the essential policies for TEXT user_id
CREATE POLICY "Allow api content insertion" ON userdots
  FOR INSERT WITH CHECK (user_id = 'api');

CREATE POLICY "Allow system content insertion" ON userdots
  FOR INSERT WITH CHECK (user_id IS NULL);

CREATE POLICY "Users can insert their own content" ON userdots
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own content" ON userdots
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own content" ON userdots
  FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Anyone can read approved public content" ON userdots
  FOR SELECT USING (
    (is_public = true AND is_approved = true) OR 
    (user_id = 'api' AND category = 'News Event')
  );

-- Verify all policies were recreated
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'userdots';
