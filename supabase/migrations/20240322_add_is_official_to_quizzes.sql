ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS is_official boolean DEFAULT false;
-- Optionally, mark existing official quizzes (by admin or seed) as official here
-- UPDATE quizzes SET is_official = true WHERE creator_id = 'ADMIN_UUID_OR_CRITERIA'; 