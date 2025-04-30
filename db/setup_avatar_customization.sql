-- Add avatar_base and avatar_accessories columns to user_profiles for customizable avatars
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS avatar_base TEXT,
ADD COLUMN IF NOT EXISTS avatar_accessories JSONB;

-- Set the default mascot as the avatar_base for all users who do not have one set yet
UPDATE user_profiles
SET avatar_base = 'mascot_default'
WHERE avatar_base IS NULL; 