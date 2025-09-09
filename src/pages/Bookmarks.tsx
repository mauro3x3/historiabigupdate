import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Bookmark, Star, Clock, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BookmarkedModule {
  id: string;
  title: string;
  description: string;
  era: string;
  module_type: string;
  bookmarked_at: string;
  progress?: {
    completed: boolean;
    xp_earned: number;
  };
}

const Bookmarks = () => {
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState<BookmarkedModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select(`
          id,
          module_id,
          bookmarked_at,
          modules (
            id,
            title,
            description,
            era,
            module_type
          )
        `)
        .eq('user_id', user?.id)
        .order('bookmarked_at', { ascending: false });

      if (error) throw error;

      const formattedBookmarks = data?.map(bookmark => ({
        id: bookmark.id,
        title: bookmark.modules?.title || 'Unknown Module',
        description: bookmark.modules?.description || '',
        era: bookmark.modules?.era || 'unknown',
        module_type: bookmark.modules?.module_type || 'lesson',
        bookmarked_at: bookmark.bookmarked_at,
      })) || [];

      setBookmarks(formattedBookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const getEraColor = (era: string) => {
    const colors = {
      'christian': 'from-purple-500 to-blue-500',
      'jewish': 'from-yellow-500 to-orange-500',
      'islamic': 'from-green-500 to-teal-500',
      'ancient-greece': 'from-blue-500 to-indigo-500',
      'ancient-rome': 'from-red-500 to-pink-500',
      'chinese': 'from-emerald-500 to-green-500',
      'medieval': 'from-gray-500 to-slate-500',
      'default': 'from-gray-500 to-gray-600'
    };
    return colors[era as keyof typeof colors] || colors.default;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Sign in to view bookmarks</h2>
          <p className="text-gray-500">Please sign in to access your bookmarked modules.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <Bookmark className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-800">Your Bookmarks</h1>
            </div>
            <p className="text-gray-600 text-lg">
              {bookmarks.length === 0 
                ? "No bookmarks yet. Start bookmarking modules you love!"
                : `You have ${bookmarks.length} bookmarked module${bookmarks.length === 1 ? '' : 's'}`
              }
            </p>
          </div>

          {/* Bookmarks Grid */}
          {bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookmarks yet</h3>
                <p className="text-gray-500 mb-6">
                  Bookmark modules you love by clicking the bookmark icon on any module.
                </p>
                <a 
                  href="/home" 
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Explore Modules
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
                  {/* Era Badge */}
                  <div className={`h-2 bg-gradient-to-r ${getEraColor(bookmark.era)}`}></div>
                  
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                          {bookmark.title}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {bookmark.era.replace('-', ' ')} • {bookmark.module_type}
                        </p>
                      </div>
                      <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove bookmark"
                      >
                        <Bookmark className="w-5 h-5 fill-current" />
                      </button>
                    </div>

                    {/* Description */}
                    {bookmark.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {bookmark.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(bookmark.bookmarked_at).toLocaleDateString()}
                        </span>
                      </div>
                      <a
                        href={`/lesson/${bookmark.id}`}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        View Module →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
