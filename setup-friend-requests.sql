-- SQL to set up friend requests functionality
-- Run this in your Supabase SQL Editor

-- Create friend_requests table
CREATE TABLE IF NOT EXISTS friend_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(sender_id, receiver_id) -- Prevent duplicate requests
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_status ON friend_requests(status);

-- Enable Row Level Security
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for friend_requests
-- Users can see requests they sent or received
CREATE POLICY "Users can view their own friend requests" ON friend_requests
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

-- Users can send friend requests
CREATE POLICY "Users can send friend requests" ON friend_requests
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
  );

-- Users can update requests they received (accept/reject)
CREATE POLICY "Users can respond to received requests" ON friend_requests
  FOR UPDATE USING (
    auth.uid() = receiver_id
  );

-- Users can delete requests they sent (cancel)
CREATE POLICY "Users can cancel their own requests" ON friend_requests
  FOR DELETE USING (
    auth.uid() = sender_id
  );

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_friend_requests_updated_at ON friend_requests;
CREATE TRIGGER update_friend_requests_updated_at
  BEFORE UPDATE ON friend_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

