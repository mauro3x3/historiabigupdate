-- Add robust coordinate validation constraints to prevent site crashes
-- This will prevent invalid coordinates from being inserted at the database level

-- First, check if constraints already exist and drop them if they do
DO $$ 
BEGIN
  -- Drop existing constraints if they exist
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
             WHERE constraint_name = 'check_valid_coordinates' 
             AND table_name = 'userdots') THEN
    ALTER TABLE userdots DROP CONSTRAINT check_valid_coordinates;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
             WHERE constraint_name = 'check_valid_coordinates_user_content' 
             AND table_name = 'user_generated_content') THEN
    ALTER TABLE user_generated_content DROP CONSTRAINT check_valid_coordinates_user_content;
  END IF;
END $$;

-- Add comprehensive coordinate validation for userdots table
ALTER TABLE userdots 
ADD CONSTRAINT check_valid_coordinates 
CHECK (
  -- Ensure coordinates is a valid JSON array with exactly 2 elements
  jsonb_typeof(coordinates) = 'array' AND
  jsonb_array_length(coordinates) = 2 AND
  
  -- Ensure both elements are numbers (not null, not NaN)
  (coordinates->>0)::text ~ '^-?\d+(\.\d+)?$' AND
  (coordinates->>1)::text ~ '^-?\d+(\.\d+)?$' AND
  
  -- Ensure coordinates are within valid ranges
  (coordinates->>0)::float >= -180 AND (coordinates->>0)::float <= 180 AND
  (coordinates->>1)::float >= -90 AND (coordinates->>1)::float <= 90 AND
  
  -- Ensure coordinates are not null
  (coordinates->>0) IS NOT NULL AND (coordinates->>1) IS NOT NULL AND
  
  -- Additional safety checks to prevent extremely large numbers
  ABS((coordinates->>0)::float) < 1e10 AND
  ABS((coordinates->>1)::float) < 1e10
);

-- Add the same constraint to user_generated_content table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_generated_content') THEN
    ALTER TABLE user_generated_content 
    ADD CONSTRAINT check_valid_coordinates_user_content 
    CHECK (
      -- Ensure coordinates is a valid JSON array with exactly 2 elements
      jsonb_typeof(coordinates) = 'array' AND
      jsonb_array_length(coordinates) = 2 AND
      
      -- Ensure both elements are numbers (not null, not NaN)
      (coordinates->>0)::text ~ '^-?\d+(\.\d+)?$' AND
      (coordinates->>1)::text ~ '^-?\d+(\.\d+)?$' AND
      
      -- Ensure coordinates are within valid ranges
      (coordinates->>0)::float >= -180 AND (coordinates->>0)::float <= 180 AND
      (coordinates->>1)::float >= -90 AND (coordinates->>1)::float <= 90 AND
      
      -- Ensure coordinates are not null
      (coordinates->>0) IS NOT NULL AND (coordinates->>1) IS NOT NULL AND
      
      -- Additional safety checks to prevent extremely large numbers
      ABS((coordinates->>0)::float) < 1e10 AND
      ABS((coordinates->>1)::float) < 1e10
    );
  END IF;
END $$;

-- Create a function to validate coordinates that can be used in triggers
CREATE OR REPLACE FUNCTION validate_coordinates(coords jsonb)
RETURNS boolean AS $$
BEGIN
  -- Check if coordinates is a valid JSON array
  IF jsonb_typeof(coords) != 'array' OR jsonb_array_length(coords) != 2 THEN
    RETURN false;
  END IF;
  
  -- Check if both elements are valid numbers
  IF NOT ((coords->>0)::text ~ '^-?\d+(\.\d+)?$' AND (coords->>1)::text ~ '^-?\d+(\.\d+)?$') THEN
    RETURN false;
  END IF;
  
  -- Check ranges
  IF (coords->>0)::float < -180 OR (coords->>0)::float > 180 OR
     (coords->>1)::float < -90 OR (coords->>1)::float > 90 THEN
    RETURN false;
  END IF;
  
  -- Check for extremely large numbers
  IF ABS((coords->>0)::float) >= 1e10 OR ABS((coords->>1)::float) >= 1e10 THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Test the function with some examples
SELECT 
  validate_coordinates('[2.3522, 48.8566]'::jsonb) as valid_paris,
  validate_coordinates('[4848488448.097027, 17.36450541468227]'::jsonb) as invalid_large_lng,
  validate_coordinates('[2.3522, 4884844884484849]'::jsonb) as invalid_large_lat,
  validate_coordinates('["invalid", "data"]'::jsonb) as invalid_strings,
  validate_coordinates('[2.3522]'::jsonb) as invalid_array_length;
