import React, { useState, useEffect } from 'react';
import { Bookmark, MapPin, Calendar, User, Trash2, ExternalLink } from 'lucide-react';
import { getUserBookmarks, removeBookmark } from '@/services/bookmarkService';
import { getUserContent } from '@/services/userContentService';
import { useSettings } from '@/contexts/SettingsContext';

interface BookmarkItem {
  id: string;
  content_id: string;
  content_type: 'module' | 'user_content';
  created_at: string;
  // Content details will be populated
  title?: string;
  description?: string;
  author?: string;
  coordinates?: [number, number];
  category?: string;
  imageUrl?: string;
  dateHappened?: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const bookmarkData = await getUserBookmarks();
      
      // Fetch content details for each bookmark
      const enrichedBookmarks = await Promise.all(
        bookmarkData.map(async (bookmark) => {
          if (bookmark.content_type === 'user_content') {
            // For user content, we need to fetch from the user content service
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
            // For modules, we'd need to fetch from modules service
            // For now, return basic info
            return {
              ...bookmark,
              title: 'Module Content',
              description: 'Official module content',
              author: 'Historia Team',
              coordinates: [0, 0],
              category: 'Module',
              dateHappened: ''
            };
          }
        })
      );
      
      setBookmarks(enrichedBookmarks);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      setError('Failed to load bookmarks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string, contentId: string, contentType: 'module' | 'user_content') => {
    try {
      await removeBookmark(contentId, contentType);
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      alert('Failed to remove bookmark. Please try again.');
    }
  };

  const { formatDate: settingsFormatDate } = useSettings();
  
  const formatDate = (dateString: string) => {
    return settingsFormatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Bookmarks</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadBookmarks}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
          </div>
          <p className="text-gray-600">
            Your saved historical content and modules
          </p>
        </div>

        {/* Bookmarks Grid */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookmarks Yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring the globe and bookmark interesting content to see it here!
            </p>
            <a
              href="/globe"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              Explore Globe
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
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

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {bookmark.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {bookmark.category}
                        </span>
                        {bookmark.content_type === 'user_content' && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            Community
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveBookmark(bookmark.id, bookmark.content_id, bookmark.content_type)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {bookmark.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{bookmark.author}</span>
                    </div>
                    
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
                    
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4" />
                      <span>Bookmarked {formatDate(bookmark.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      View on Globe
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
