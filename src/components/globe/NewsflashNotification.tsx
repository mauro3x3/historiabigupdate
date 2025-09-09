import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, User } from 'lucide-react';

interface NewsflashNotificationProps {
  content: {
    id: string;
    title: string;
    author: string;
    category: string;
    coordinates: [number, number];
    createdAt: string;
  } | null;
  onClose: () => void;
}

export default function NewsflashNotification({ content, onClose }: NewsflashNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (content) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [content]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible || !content) return null;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Historical Event': 'bg-red-500',
      'Historical Figure': 'bg-blue-500',
      'Archaeological Site': 'bg-yellow-500',
      'Battle': 'bg-red-600',
      'Monument': 'bg-purple-500',
      'Cultural Site': 'bg-green-500',
      'Discovery': 'bg-orange-500',
      'Other': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`bg-white rounded-lg shadow-2xl border-l-4 border-blue-500 transform transition-all duration-300 ${
          isAnimating 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
        }`}
        style={{
          animation: isAnimating ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.3s ease-in'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-800">NEW CONTENT</span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full mt-1 ${getCategoryColor(content.category)}`}></div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                {content.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{content.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(content.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>
                  {content.coordinates[1].toFixed(2)}°, {content.coordinates[0].toFixed(2)}°
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 pb-3">
          <div className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1">
            Click on the globe to view details
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
