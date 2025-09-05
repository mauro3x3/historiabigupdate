import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
// UserGeneratedContent interface removed - AddContentModal deleted
import { userContentService } from '../../services/userContentService';

export default function ContentReviewPanel() {
  const [pendingContent, setPendingContent] = useState<UserGeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<UserGeneratedContent | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadPendingContent();
    }
  }, [isAuthenticated]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'kookoo123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
      setPassword('');
    }
  };

  const loadPendingContent = async () => {
    try {
      setLoading(true);
      const content = await userContentService.getPendingContent();
      setPendingContent(content);
    } catch (error) {
      console.error('Error loading pending content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (contentId: string, status: 'approved' | 'rejected') => {
    try {
      setReviewing(true);
      const success = await userContentService.reviewContent(contentId, status, reviewNotes);
      
      if (success) {
        // Remove the reviewed content from the list
        setPendingContent(prev => prev.filter(content => (content as any).id !== contentId));
        setSelectedContent(null);
        setReviewNotes('');
        alert(`Content ${status} successfully!`);
      } else {
        alert(`Failed to ${status} content. Please try again.`);
      }
    } catch (error) {
      console.error('Error reviewing content:', error);
      alert('Error reviewing content. Please try again.');
    } finally {
      setReviewing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter password to access the review panel</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {authError && (
              <div className="text-red-600 text-sm text-center">
                {authError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Access Review Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading pending content...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-lg">
          <h1 className="text-2xl font-bold">Content Review Panel</h1>
          <p className="text-blue-100 mt-1">
            Review and approve user-generated historical content
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {pendingContent.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pending Content</h3>
              <p className="text-gray-600">All user-submitted content has been reviewed!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Pending Review ({pendingContent.length})
                </h2>
                <button
                  onClick={loadPendingContent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
              </div>

              {pendingContent.map((content, index) => (
                <div
                  key={(content as any).id || index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {content.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                          {content.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{content.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Topic: {content.topic}</span>
                        <span>Location: {content.coordinates.lat.toFixed(4)}, {content.coordinates.lng.toFixed(4)}</span>
                        <span>Quiz Questions: {content.quiz.filter(q => q.question.trim()).length}</span>
                        {content.image && <span>Has Image: Yes</span>}
                      </div>

                      {(content as any).submittedAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          Submitted: {new Date((content as any).submittedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setSelectedContent(content)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleReview((content as any).id, 'approved')}
                      disabled={reviewing}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    
                    <button
                      onClick={() => handleReview((content as any).id, 'rejected')}
                      disabled={reviewing}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Content Details</h2>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div><span className="font-medium">Title:</span> {selectedContent.title}</div>
                    <div><span className="font-medium">Topic:</span> {selectedContent.topic}</div>
                    <div><span className="font-medium">Description:</span> {selectedContent.description}</div>
                    <div><span className="font-medium">Location:</span> {selectedContent.coordinates.lat.toFixed(4)}, {selectedContent.coordinates.lng.toFixed(4)}</div>
                  </div>
                </div>

                {/* Image */}
                {selectedContent.image && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Image</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <img
                        src={URL.createObjectURL(selectedContent.image)}
                        alt="Content"
                        className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Quiz Questions */}
                {selectedContent.quiz.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Quiz Questions</h3>
                    <div className="space-y-4">
                      {selectedContent.quiz.map((question, qIndex) => (
                        <div key={qIndex} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-800 mb-2">Question {qIndex + 1}</h4>
                          <p className="text-gray-700 mb-3">{question.question}</p>
                          
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <div
                                key={oIndex}
                                className={`px-3 py-2 rounded ${
                                  oIndex === question.correctAnswer
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {option}
                                {oIndex === question.correctAnswer && (
                                  <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {question.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                              <span className="font-medium text-blue-800">Explanation:</span>
                              <p className="text-blue-700 mt-1">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Notes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Review Notes (Optional)</h3>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add notes about why you're approving or rejecting this content..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedContent(null)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              
              <button
                onClick={() => handleReview((selectedContent as any).id, 'approved')}
                disabled={reviewing}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
              
              <button
                onClick={() => handleReview((selectedContent as any).id, 'rejected')}
                disabled={reviewing}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
