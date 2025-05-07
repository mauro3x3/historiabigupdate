-- Drop the unused profiles table if it exists
DROP TABLE IF EXISTS profiles;

-- Ensure user_profiles table has the correct structure
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  avatar_base text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Fix quizzes table foreign key
ALTER TABLE quizzes
DROP CONSTRAINT IF EXISTS quizzes_creator_id_fkey;

ALTER TABLE quizzes
ADD CONSTRAINT quizzes_creator_id_fkey
FOREIGN KEY (creator_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Create trigger to auto-create user_profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Clean up any orphaned quizzes
DELETE FROM quizzes
WHERE creator_id NOT IN (SELECT id FROM user_profiles); 