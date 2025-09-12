
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { addBookmark, removeBookmark, isBookmarked } from '@/services/bookmarkService';
import { toast } from 'sonner';

interface LessonHeaderProps {
  title: string;
}

const LessonHeader = ({ title }: LessonHeaderProps) => {
  const { lessonId } = useParams();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (lessonId) {
        const isBooked = await isBookmarked(lessonId, 'module');
        setBookmarked(isBooked);
      }
    };
    checkBookmarkStatus();
  }, [lessonId]);

  const handleBookmarkToggle = async () => {
    if (!lessonId) return;
    
    setLoading(true);
    try {
      if (bookmarked) {
        await removeBookmark(lessonId, 'module');
        setBookmarked(false);
        toast.success('Removed from bookmarks');
      } else {
        await addBookmark(lessonId, 'module');
        setBookmarked(true);
        toast.success('Added to bookmarks');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-timelingo-navy">{title}</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleBookmarkToggle}
          disabled={loading}
          className={`flex items-center gap-2 ${
            bookmarked 
              ? 'bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </Button>
      </div>
    </header>
  );
};

export default LessonHeader;
