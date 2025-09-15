-- Complete fix for user_id column type change with foreign key handling
-- This will drop the foreign key constraint, change the column type, then recreate it

-- First, let's see what foreign key constraints exist
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='userdots';

-- Drop the foreign key constraint
ALTER TABLE userdots DROP CONSTRAINT IF EXISTS userdots_user_id_fkey;

-- Drop ALL existing policies on userdots table
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

-- Note: We're NOT recreating the foreign key constraint because:
-- 1. We want to allow 'api' as a user_id which won't exist in user_profiles
-- 2. The foreign key would prevent us from inserting news articles with user_id = 'api'
-- 3. We can handle user validation in the application layer instead

-- Verify all policies were recreated
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'userdots';
