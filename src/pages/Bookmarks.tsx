import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Bookmark, Star, Clock, ExternalLink, MapPin, User, Calendar, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getUserBookmarks, removeBookmark } from '@/services/bookmarkService';
import { getUserContent } from '@/services/userContentService';
import { useSettings } from '@/contexts/SettingsContext';

interface BookmarkedItem {
  id: string;
  content_id: string;
  content_type: 'module' | 'user_content';
  created_at: string;
  // Content details
  title: string;
  description: string;
  author?: string;
  coordinates?: [number, number];
  category?: string;
  imageUrl?: string;
  dateHappened?: string;
  era?: string;
  module_type?: string;
}

const Bookmarks = () => {
  const { user } = useUser();
  const { formatDate } = useSettings();
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const bookmarkData = await getUserBookmarks();
      
      // Fetch content details for each bookmark
      const enrichedBookmarks = await Promise.all(
        bookmarkData.map(async (bookmark) => {
          if (bookmark.content_type === 'user_content') {
            // For user content, fetch from user content service
            const allUserContent = await getUserContent();
            const content = allUserContent.find(c => c.id === bookmark.content_id);
            
            return {
              ...bookmark,
              title: content?.title || 'Unknown Content',
              description: content?.description || '',
              author: content?.author || 'Unknown',
              coordinates: content?.coordinates || [0, 0],
              category: content?.category || 'Unknown',
              imageUrl: content?.imageUrl,
              dateHappened: content?.dateHappened || ''
            };
          } else {
            // For modules, fetch from modules table
            const { data: moduleData, error } = await supabase
              .from('modules')
              .select('id, title, description, era, content_type')
              .eq('id', Number(bookmark.content_id))
              .single();

            if (error) {
              console.error('Error fetching module:', error);
              return {
                ...bookmark,
                title: 'Unknown Module',
                description: '',
                era: 'unknown',
                module_type: 'lesson'
              };
            }

            return {
              ...bookmark,
              title: moduleData?.title || 'Unknown Module',
              description: moduleData?.description || '',
              era: moduleData?.era || 'unknown',
              module_type: moduleData?.content_type || 'lesson'
            };
          }
        })
      );
      
      setBookmarks(enrichedBookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string, contentId: string, contentType: 'module' | 'user_content') => {
    try {
      await removeBookmark(contentId, contentType);
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
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
              <Bookmark className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">Your Bookmarks</h1>
            </div>
            <p className="text-gray-600 text-lg">
              {bookmarks.length === 0 
                ? "No bookmarks yet. Start bookmarking content you love!"
                : `You have ${bookmarks.length} bookmarked item${bookmarks.length === 1 ? '' : 's'}`
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
                  Bookmark content you love by clicking the bookmark icon on any module or community story.
                </p>
                <div className="flex gap-3 justify-center">
                  <a 
                    href="/home" 
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Explore Modules
                  </a>
                  <a 
                    href="/globe" 
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Explore Globe
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <a 
                  key={bookmark.id} 
                  href={bookmark.content_type === 'user_content' ? '/globe' : `/lesson/${bookmark.content_id}`}
                  className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden hover:scale-[1.02] cursor-pointer"
                >
                  {/* Content Type Badge */}
                  <div className={`h-2 bg-gradient-to-r ${
                    bookmark.content_type === 'user_content' 
                      ? 'from-green-500 to-teal-500' 
                      : getEraColor(bookmark.era || 'default')
                  }`}></div>
                  
                  {/* Image */}
                  {bookmark.imageUrl && (
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={bookmark.imageUrl}
                        alt={bookmark.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                          {bookmark.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            bookmark.content_type === 'user_content'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {bookmark.content_type === 'user_content' ? 'Community' : 'Official'}
                          </span>
                          {bookmark.category && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {bookmark.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveBookmark(bookmark.id, bookmark.content_id, bookmark.content_type);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Description */}
                    {bookmark.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {bookmark.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      {bookmark.author && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{bookmark.author}</span>
                        </div>
                      )}
                      
                      {bookmark.coordinates && bookmark.coordinates[0] !== 0 && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {bookmark.coordinates[1].toFixed(4)}, {bookmark.coordinates[0].toFixed(4)}
                          </span>
                        </div>
                      )}
                      
                      {bookmark.dateHappened && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{bookmark.dateHappened}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDate(bookmark.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
