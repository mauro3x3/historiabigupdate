import React, { useState, useEffect } from 'react';
import { Bookmark, Flag, Check } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface UserContent {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  coordinates: [number, number];
  category: string;
  imageUrl?: string;
  source?: string;
}

interface UserContentModalProps {
  content: UserContent | null;
  onClose: () => void;
}

export default function UserContentModal({ content, onClose }: UserContentModalProps) {
  const { formatDate } = useSettings();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [showFullImage, setShowFullImage] = useState(false);

  // Check if content is bookmarked on load
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const { isBookmarked: checkBookmark } = await import('@/services/bookmarkService');
        const bookmarked = await checkBookmark(content.id, 'user_content');
        setIsBookmarked(bookmarked);
      } catch (error) {
        console.error('Failed to check bookmark status:', error);
      }
    };

    if (content) {
      checkBookmarkStatus();
    }
  }, [content]);

  // Handle ESC key to close full screen image
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showFullImage) {
        setShowFullImage(false);
      }
    };

    if (showFullImage) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showFullImage]);

  // Handle click outside modal to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      const { addBookmark, removeBookmark } = await import('@/services/bookmarkService');
      
      if (isBookmarked) {
        await removeBookmark(content.id, 'user_content');
        setIsBookmarked(false);
      } else {
        await addBookmark(content.id, 'user_content');
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;

    try {
      const { reportContent } = await import('@/services/bookmarkService');
      await reportContent(content.id, 'user_content', reportReason, reportDescription);
      
      setIsReporting(false);
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
      
      // Show success message
      alert('Content reported successfully. Thank you for helping keep the community safe!');
    } catch (error) {
      console.error('Failed to report content:', error);
      alert('Failed to report content. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      // Create a shareable URL for this specific content
      const shareUrl = `${window.location.origin}/globe?content=${content.id}`;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: content.title,
          text: content.description,
          url: shareUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard! Share this URL with your friends.');
      }
    } catch (error) {
      console.error('Failed to share content:', error);
      // Fallback: show the URL in a prompt
      const shareUrl = `${window.location.origin}/globe?content=${content.id}`;
      prompt('Copy this link to share:', shareUrl);
    }
  };

  if (!content) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header with gradient background */}
        <div className="bg-blue-600 rounded-t-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Community Story
                </span>
                <span className="text-blue-100 text-sm">
                  Added {formatDate(content.createdAt)}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
              <p className="text-blue-100 text-lg">{content.category}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8">
          {/* Hero Image Section */}
          {content.imageUrl && (
            <div className="mb-8">
              <div className="relative group cursor-pointer" onClick={() => setShowFullImage(true)}>
                <img 
                  src={content.imageUrl} 
                  alt={content.title}
                  className="w-full h-80 object-cover rounded-xl shadow-lg transition-transform duration-200 group-hover:scale-105"
                />
                {/* Overlay with click hint */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-90 rounded-lg px-4 py-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Click to expand</span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.5l3.883-2.794a1 1 0 011.617.794zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Read Out Loud
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Story Content */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">The Story</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">{content.description}</p>
              </div>
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Location Card */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Location
              </h3>
              <p className="font-mono text-gray-700 bg-white p-3 rounded-lg border">
                {content.coordinates[1].toFixed(4)}, {content.coordinates[0].toFixed(4)}
              </p>
            </div>

            {/* Contributor Card */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contributor</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {content.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{content.author}</p>
                  <p className="text-sm text-gray-500">Community Contributor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Source Information */}
          <div className="mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Source
              </h3>
              <p className="text-gray-700">
                {content.source && content.source.trim() ? content.source : "No source provided"}
              </p>
            </div>
          </div>
          

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex gap-3">
              <button 
                onClick={handleShare}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share
              </button>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                More Stories
              </button>
              
              {/* Bookmark Button */}
              <button
                onClick={handleBookmarkToggle}
                className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
                  isBookmarked 
                    ? 'bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200' 
                    : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
              
              {/* Report Button */}
              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      </div>
      
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="bg-red-600 rounded-t-xl p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Report Content</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-white hover:text-red-100 text-2xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Help us keep the community safe by reporting inappropriate content.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for reporting *
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="inappropriate">Inappropriate content</option>
                    <option value="spam">Spam or misleading</option>
                    <option value="harassment">Harassment or bullying</option>
                    <option value="false_info">False information</option>
                    <option value="offensive">Offensive language</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional details (optional)
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Please provide more details about why you're reporting this content..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReport}
                  disabled={!reportReason.trim() || isReporting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isReporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Reporting...
                    </>
                  ) : (
                    <>
                      <Flag className="w-4 h-4" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Full Screen Image Modal */}
      {showFullImage && content.imageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60">
          <div className="relative max-w-7xl max-h-[95vh] w-full mx-4">
            {/* Close button */}
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image */}
            <img
              src={content.imageUrl}
              alt={content.title}
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
            
            {/* Image info overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-1">{content.title}</h3>
              <p className="text-sm text-gray-300">{content.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
