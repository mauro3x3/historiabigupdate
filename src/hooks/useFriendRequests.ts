import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender?: {
    id: string;
    username: string;
    email: string;
    avatar_base?: string;
  };
  receiver?: {
    id: string;
    username: string;
    email: string;
    avatar_base?: string;
  };
}

export function useFriendRequests(userId: string | undefined) {
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFriendRequests() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch sent requests
        const { data: sentData, error: sentError } = await supabase
          .from('friend_requests')
          .select(`
            id,
            sender_id,
            receiver_id,
            status,
            created_at,
            receiver:user_profiles!friend_requests_receiver_id_fkey(id, username, email, avatar_base)
          `)
          .eq('sender_id', userId);

        if (sentError) throw sentError;

        // Fetch received requests
        const { data: receivedData, error: receivedError } = await supabase
          .from('friend_requests')
          .select(`
            id,
            sender_id,
            receiver_id,
            status,
            created_at,
            sender:user_profiles!friend_requests_sender_id_fkey(id, username, email, avatar_base)
          `)
          .eq('receiver_id', userId)
          .eq('status', 'pending');

        if (receivedError) throw receivedError;

        setSentRequests(sentData || []);
        setReceivedRequests(receivedData || []);
      } catch (err) {
        console.error('Error fetching friend requests:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch friend requests');
      } finally {
        setLoading(false);
      }
    }

    fetchFriendRequests();
  }, [userId]);

  const sendFriendRequest = async (receiverUsername: string) => {
    if (!userId) throw new Error('User not authenticated');

    // Find receiver by username
    const { data: users, error: userError } = await supabase
      .from('user_profiles')
      .select('id, username, email')
      .eq('username', receiverUsername)
      .single();

    if (userError || !users) {
      throw new Error('User not found');
    }

    if (users.id === userId) {
      throw new Error('You cannot add yourself as a friend');
    }

    // Check if already friends
    const { data: existingFriend } = await supabase
      .from('friends')
      .select('id')
      .eq('user_id', userId)
      .eq('friend_id', users.id)
      .single();

    if (existingFriend) {
      throw new Error('Already friends with this user');
    }

    // Check if request already exists
    const { data: existingRequest } = await supabase
      .from('friend_requests')
      .select('id')
      .eq('sender_id', userId)
      .eq('receiver_id', users.id)
      .single();

    if (existingRequest) {
      throw new Error('Friend request already sent');
    }

    // Send friend request
    const { error: requestError } = await supabase
      .from('friend_requests')
      .insert({
        sender_id: userId,
        receiver_id: users.id,
        status: 'pending'
      });

    if (requestError) throw requestError;

    // Refresh sent requests
    const { data: updatedSentData } = await supabase
      .from('friend_requests')
      .select(`
        id,
        sender_id,
        receiver_id,
        status,
        created_at,
        receiver:user_profiles!friend_requests_receiver_id_fkey(id, username, email, avatar_base)
      `)
      .eq('sender_id', userId);

    setSentRequests(updatedSentData || []);
  };

  const acceptFriendRequest = async (requestId: string, senderId: string) => {
    if (!userId) throw new Error('User not authenticated');

    // Update request status
    const { error: updateError } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (updateError) throw updateError;

    // Add both users as friends
    const { error: friendError } = await supabase
      .from('friends')
      .insert([
        { user_id: userId, friend_id: senderId },
        { user_id: senderId, friend_id: userId }
      ]);

    if (friendError) throw friendError;

    // Remove from received requests
    setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const rejectFriendRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) throw error;

    // Remove from received requests
    setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const cancelFriendRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('friend_requests')
      .delete()
      .eq('id', requestId);

    if (error) throw error;

    // Remove from sent requests
    setSentRequests(prev => prev.filter(req => req.id !== requestId));
  };

  return {
    sentRequests,
    receivedRequests,
    loading,
    error,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest
  };
}

