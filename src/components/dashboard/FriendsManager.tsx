import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useUserFriends } from '@/hooks/useUserFriends';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { toast } from 'sonner';
import { 
  UserPlus, 
  UserMinus, 
  Check, 
  X, 
  Clock, 
  Users,
  Search,
  Mail,
  AlertCircle
} from 'lucide-react';

const FriendsManager: React.FC = () => {
  const { user } = useUser();
  const { friends, loading: friendsLoading } = useUserFriends(user?.id);
  const { 
    sentRequests, 
    receivedRequests, 
    loading: requestsLoading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest
  } = useFriendRequests(user?.id);

  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'add'>('friends');
  const [addFriendInput, setAddFriendInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendFriendRequest = async () => {
    if (!addFriendInput.trim()) {
      toast.error('Please enter a username');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendFriendRequest(addFriendInput.trim());
      toast.success('Friend request sent!');
      setAddFriendInput('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send friend request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    try {
      await acceptFriendRequest(requestId, senderId);
      toast.success('Friend request accepted!');
    } catch (error) {
      toast.error('Failed to accept friend request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId);
      toast.success('Friend request rejected');
    } catch (error) {
      toast.error('Failed to reject friend request');
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await cancelFriendRequest(requestId);
      toast.success('Friend request cancelled');
    } catch (error) {
      toast.error('Failed to cancel friend request');
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;
    
    try {
      // Remove friend relationship (both directions)
      const { error } = await import('@/integrations/supabase/client').then(({ supabase }) => 
        supabase
          .from('friends')
          .delete()
          .or(`and(user_id.eq.${user?.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user?.id})`)
      );
      
      if (error) throw error;
      toast.success('Friend removed');
    } catch (error) {
      toast.error('Failed to remove friend');
    }
  };

  const pendingRequestsCount = receivedRequests.length;

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Friends
        </h4>
        {pendingRequestsCount > 0 && (
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {pendingRequestsCount}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-3">
        <button
          onClick={() => setActiveTab('friends')}
          className={`px-2 py-1 rounded-full text-xs transition-colors ${
            activeTab === 'friends'
              ? 'bg-blue-600 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-2 py-1 rounded-full text-xs transition-colors relative ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Requests
          {pendingRequestsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {pendingRequestsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-2 py-1 rounded-full text-xs transition-colors ${
            activeTab === 'add'
              ? 'bg-blue-600 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Add Friend
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {activeTab === 'friends' && (
          <>
            {friendsLoading ? (
              <div className="text-center text-white/60 py-4">Loading friends...</div>
            ) : friends.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-white/50 text-sm mb-2">No friends yet</div>
                <button
                  onClick={() => setActiveTab('add')}
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Add your first friend
                </button>
              </div>
            ) : (
              friends.map((friend) => (
                <div key={friend.friend_id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {friend.friend?.username?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium text-sm block truncate">
                      {friend.friend?.username || 'Unknown User'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveFriend(friend.friend_id)}
                    className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                    title="Remove friend"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <>
            {requestsLoading ? (
              <div className="text-center text-white/60 py-4">Loading requests...</div>
            ) : (
              <>
                {/* Received Requests */}
                {receivedRequests.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-white/80 text-sm font-medium mb-2">Received Requests</h5>
                    {receivedRequests.map((request) => (
                      <div key={request.id} className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 mb-2">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {request.sender?.username?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-white font-medium text-sm block truncate">
                            {request.sender?.username || 'Unknown User'}
                          </span>
                          <span className="text-green-300 text-xs">wants to be friends</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleAcceptRequest(request.id, request.sender_id)}
                            className="text-green-400 hover:text-green-300 p-1 rounded transition-colors"
                            title="Accept"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sent Requests */}
                {sentRequests.length > 0 && (
                  <div>
                    <h5 className="text-white/80 text-sm font-medium mb-2">Sent Requests</h5>
                    {sentRequests.map((request) => (
                      <div key={request.id} className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-2">
                        <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-white font-medium text-sm block truncate">
                            {request.receiver?.username || 'Unknown User'}
                          </span>
                          <span className="text-yellow-300 text-xs">
                            {request.status === 'pending' ? 'Request pending' : request.status}
                          </span>
                        </div>
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleCancelRequest(request.id)}
                            className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                            title="Cancel request"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {receivedRequests.length === 0 && sentRequests.length === 0 && (
                  <div className="text-center py-4">
                    <div className="text-white/50 text-sm">No pending requests</div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'add' && (
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="mb-3">
                <h5 className="text-white font-medium text-sm mb-1">Add Friend by Username</h5>
                <p className="text-white/60 text-xs">Enter their exact username to send a friend request</p>
              </div>
              
              <div className="space-y-2">
                <input
                  type="text"
                  value={addFriendInput}
                  onChange={(e) => setAddFriendInput(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-3 py-2.5 bg-white/15 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendFriendRequest()}
                />
                <button
                  onClick={handleSendFriendRequest}
                  disabled={isSubmitting || !addFriendInput.trim()}
                  className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-yellow-300 text-xs">
                    Make sure you enter the exact username. The other person will need to accept your request before you become friends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsManager;
