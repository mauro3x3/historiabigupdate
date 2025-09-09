import React, { useState } from 'react';
import { Flag, Trash2, User, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface ContentModerationProps {
  userContent: Array<{
    id: string;
    title: string;
    description: string;
    author: string;
    category: string;
    coordinates: [number, number];
    dateHappened: string;
    source: string;
    imageUrl?: string;
    createdAt: string;
    flags?: number;
    isApproved?: boolean;
  }>;
  onRemoveContent: (contentId: string) => void;
  onApproveContent: (contentId: string) => void;
  onFlagContent: (contentId: string) => void;
}

export default function ContentModeration({ 
  userContent, 
  onRemoveContent, 
  onApproveContent, 
  onFlagContent 
}: ContentModerationProps) {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'pending' | 'approved'>('all');
  const [selectedContent, setSelectedContent] = useState<string[]>([]);

  const filteredContent = userContent.filter(content => {
    switch (filter) {
      case 'flagged':
        return (content.flags || 0) > 0;
      case 'pending':
        return !content.isApproved;
      case 'approved':
        return content.isApproved;
      default:
        return true;
    }
  });

  const handleBulkAction = (action: 'approve' | 'remove') => {
    selectedContent.forEach(contentId => {
      if (action === 'approve') {
        onApproveContent(contentId);
      } else {
        onRemoveContent(contentId);
      }
    });
    setSelectedContent([]);
  };

  const getContentStatus = (content: any) => {
    if (content.isApproved) return { status: 'approved', color: 'green', icon: CheckCircle };
    if ((content.flags || 0) > 0) return { status: 'flagged', color: 'red', icon: AlertTriangle };
    return { status: 'pending', color: 'yellow', icon: Shield };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Content Moderation</h2>
        <div className="text-sm text-gray-500">
          {filteredContent.length} of {userContent.length} items
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all', label: 'All Content' },
          { key: 'flagged', label: 'Flagged' },
          { key: 'pending', label: 'Pending' },
          { key: 'approved', label: 'Approved' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedContent.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedContent.length} item{selectedContent.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
              >
                Approve All
              </button>
              <button
                onClick={() => handleBulkAction('remove')}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Remove All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="space-y-3">
        {filteredContent.map((content) => {
          const { status, color, icon: StatusIcon } = getContentStatus(content);
          const isSelected = selectedContent.includes(content.id);

          return (
            <div
              key={content.id}
              className={`border rounded-lg p-4 transition-colors ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedContent(prev => [...prev, content.id]);
                    } else {
                      setSelectedContent(prev => prev.filter(id => id !== content.id));
                    }
                  }}
                  className="mt-1"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {content.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {content.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{content.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Source: {content.source}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Date: {content.dateHappened}</span>
                        </div>
                        {(content.flags || 0) > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <Flag className="w-3 h-3" />
                            <span>{content.flags} flag{(content.flags || 0) !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="capitalize">{status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => onFlagContent(content.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600 hover:bg-orange-100 rounded transition-colors"
                    >
                      <Flag className="w-3 h-3" />
                      Flag
                    </button>
                    
                    {!content.isApproved && (
                      <button
                        onClick={() => onApproveContent(content.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:bg-green-100 rounded transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Approve
                      </button>
                    )}
                    
                    <button
                      onClick={() => onRemoveContent(content.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No content found for the selected filter.</p>
        </div>
      )}
    </div>
  );
}
