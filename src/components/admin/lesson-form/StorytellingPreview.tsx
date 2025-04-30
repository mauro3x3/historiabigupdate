
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, ImageIcon } from 'lucide-react';

interface StorytellingPreviewProps {
  storyContent: string;
  transitionQuestion: string;
  imageUrls?: string;
}

const StorytellingPreview: React.FC<StorytellingPreviewProps> = ({
  storyContent,
  transitionQuestion,
  imageUrls
}) => {
  // Parse image URLs
  const images = imageUrls ? imageUrls.split('\n').filter(url => url.trim()) : [];
  
  // Get first paragraph for preview
  const firstParagraph = storyContent.split('\n').filter(p => p.trim())[0] || '';
  
  // Truncate if too long
  const previewText = firstParagraph.length > 150 
    ? `${firstParagraph.substring(0, 150)}...` 
    : firstParagraph;

  return (
    <Card className="mt-4 overflow-hidden border shadow-sm">
      <CardHeader className="bg-slate-50 border-b py-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Story Preview</span>
          <Button variant="ghost" size="sm" className="text-timelingo-purple flex items-center">
            <PlayCircle className="h-4 w-4 mr-1" />
            <span>Preview Full Story</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-2/3">
            <p className="text-sm italic mb-4 leading-relaxed">
              {previewText}
            </p>
            <div className="text-xs text-slate-300 space-y-1">
              <div><span className="font-semibold">Story length:</span> {storyContent.length} characters</div>
              <div><span className="font-semibold">Transition:</span> "{transitionQuestion}"</div>
            </div>
          </div>
          
          {images.length > 0 ? (
            <div className="md:w-1/3">
              <div className="aspect-video bg-slate-700 rounded-md overflow-hidden shadow-md">
                <img 
                  src={images[0]} 
                  alt="Story illustration" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                  }}
                />
              </div>
              {images.length > 1 && (
                <p className="text-xs text-center mt-2 text-slate-300">
                  +{images.length - 1} more image{images.length > 2 ? 's' : ''}
                </p>
              )}
            </div>
          ) : (
            <div className="md:w-1/3 flex items-center justify-center">
              <div className="bg-slate-700/50 rounded-md p-6 flex flex-col items-center justify-center">
                <ImageIcon className="h-10 w-10 text-slate-500 mb-2" />
                <p className="text-xs text-slate-400">No images added</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StorytellingPreview;
