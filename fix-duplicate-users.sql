-- Fix duplicate user_profiles records
-- This script will remove duplicate user profiles while keeping the most recent one

-- First, let's see what duplicates we have
SELECT id, COUNT(*) as duplicate_count
FROM user_profiles 
GROUP BY id 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Remove duplicates by keeping only the most recent record for each user
-- (based on updated_at or created_at)
WITH ranked_profiles AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY id 
      ORDER BY updated_at DESC, created_at DESC
    ) as rn
  FROM user_profiles
)
DELETE FROM user_profiles 
WHERE (id, updated_at, created_at) IN (
  SELECT id, updated_at, created_at
  FROM ranked_profiles 
  WHERE rn > 1
);

-- Verify no more duplicates
SELECT id, COUNT(*) as count
FROM user_profiles 
GROUP BY id 
HAVING COUNT(*) > 1;
