-- Setup automatic news updates every 6 hours
-- This creates a cron job that calls the auto-news-update function

-- First, enable the pg_cron extension if not already enabled
-- (This needs to be done by a superuser in the Supabase dashboard)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to call the Edge Function
CREATE OR REPLACE FUNCTION trigger_auto_news_update()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call the Edge Function using http extension
  -- Note: This requires the http extension to be enabled
  PERFORM
    net.http_post(
      url := 'https://your-project-ref.supabase.co/functions/v1/auto-news-update',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
      body := '{}'::jsonb
    );
  
  -- Log the execution
  INSERT INTO cron_logs (function_name, executed_at, status)
  VALUES ('auto-news-update', now(), 'triggered');
  
EXCEPTION WHEN OTHERS THEN
  -- Log errors
  INSERT INTO cron_logs (function_name, executed_at, status, error_message)
  VALUES ('auto-news-update', now(), 'error', SQLERRM);
END;
$$;

-- Create a table to log cron executions
CREATE TABLE IF NOT EXISTS cron_logs (
  id SERIAL PRIMARY KEY,
  function_name TEXT NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cron_logs_function_name ON cron_logs(function_name);
CREATE INDEX IF NOT EXISTS idx_cron_logs_executed_at ON cron_logs(executed_at);

-- Schedule the cron job to run every 6 hours
-- Note: This needs to be run by a superuser
-- SELECT cron.schedule('auto-news-update', '0 */6 * * *', 'SELECT trigger_auto_news_update();');

-- Alternative: Schedule to run every 4 hours (more frequent updates)
-- SELECT cron.schedule('auto-news-update', '0 */4 * * *', 'SELECT trigger_auto_news_update();');

-- Alternative: Schedule to run every 12 hours (less frequent updates)
-- SELECT cron.schedule('auto-news-update', '0 */12 * * *', 'SELECT trigger_auto_news_update();');

-- View current cron jobs
-- SELECT * FROM cron.job;

-- View cron job history
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- To remove the cron job (if needed):
-- SELECT cron.unschedule('auto-news-update');

-- Manual trigger for testing
-- SELECT trigger_auto_news_update();

-- View recent logs
-- SELECT * FROM cron_logs ORDER BY executed_at DESC LIMIT 10;
