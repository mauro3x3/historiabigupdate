-- Fix invalid coordinates in userdots table
-- This script will clean up any existing invalid coordinates and add constraints

-- First, let's see what invalid coordinates exist
SELECT 
  id, 
  title, 
  coordinates,
  (coordinates->>0)::float as lng,
  (coordinates->>1)::float as lat
FROM userdots 
WHERE 
  (coordinates->>0)::float < -180 OR (coordinates->>0)::float > 180 OR
  (coordinates->>1)::float < -90 OR (coordinates->>1)::float > 90 OR
  (coordinates->>0)::float IS NULL OR (coordinates->>1)::float IS NULL;

-- Delete records with invalid coordinates
DELETE FROM userdots 
WHERE 
  (coordinates->>0)::float < -180 OR (coordinates->>0)::float > 180 OR
  (coordinates->>1)::float < -90 OR (coordinates->>1)::float > 90 OR
  (coordinates->>0)::float IS NULL OR (coordinates->>1)::float IS NULL;

-- Add a check constraint to prevent invalid coordinates in the future
ALTER TABLE userdots 
ADD CONSTRAINT check_valid_coordinates 
CHECK (
  (coordinates->>0)::float >= -180 AND (coordinates->>0)::float <= 180 AND
  (coordinates->>1)::float >= -90 AND (coordinates->>1)::float <= 90 AND
  (coordinates->>0)::float IS NOT NULL AND (coordinates->>1)::float IS NOT NULL
);

-- Also add the same constraint to user_generated_content table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_generated_content') THEN
    ALTER TABLE user_generated_content 
    ADD CONSTRAINT check_valid_coordinates_user_content 
    CHECK (
      (coordinates->>0)::float >= -180 AND (coordinates->>0)::float <= 180 AND
      (coordinates->>1)::float >= -90 AND (coordinates->>1)::float <= 90 AND
      (coordinates->>0)::float IS NOT NULL AND (coordinates->>1)::float IS NOT NULL
    );
  END IF;
END $$;



