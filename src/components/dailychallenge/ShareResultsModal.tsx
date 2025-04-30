
import React, { useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Clipboard, Share2, Calendar, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface ShareResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: number;
  totalEvents: number;
}

const ShareResultsModal = ({ open, onOpenChange, score, totalEvents }: ShareResultsModalProps) => {
  const shareText = `I got ${score}/${totalEvents} on Historia's daily history challenge! Can you beat my score? #Historia`;
  const shareUrl = window.location.href;

  useEffect(() => {
    // Update meta tags when modal opens
    if (open) {
      // Create or update Open Graph meta tags for better social sharing
      updateMetaTags();
    }
    
    return () => {
      // We no longer remove meta tags on unmount to ensure they remain for social sharing
      // Even after modal is closed
    };
  }, [open, score, totalEvents]);
  
  const updateMetaTags = () => {
    // Generate a more descriptive title with the score
    updateOrCreateMetaTag('og:title', `Historia - Daily Challenge Results: ${score}/${totalEvents}`);
    updateOrCreateMetaTag('og:description', shareText);
    updateOrCreateMetaTag('og:type', 'website');
    
    // Make sure Twitter card is set to summary_large_image for better display
    updateOrCreateMetaTag('twitter:card', 'summary_large_image');
    updateOrCreateMetaTag('twitter:title', `Historia - Daily Challenge Results: ${score}/${totalEvents}`);
    updateOrCreateMetaTag('twitter:description', shareText);
    
    // Generate a dynamic preview image URL or use a pregenerated one
    // This is crucial - social platforms often cache the first image they see
    const challengeImageUrl = `${window.location.origin}/api/challenge-image?score=${score}&total=${totalEvents}&timestamp=${Date.now()}`;
    updateOrCreateMetaTag('og:image', challengeImageUrl);
    updateOrCreateMetaTag('twitter:image', challengeImageUrl);
  };
  
  const updateOrCreateMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) || 
               document.querySelector(`meta[name="${property}"]`);
               
    if (!meta) {
      meta = document.createElement('meta');
      // Use the appropriate attribute based on the type of meta tag
      if (property.startsWith('og:')) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText + ' ' + shareUrl).then(() => {
      toast.success('Results copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error('Could not copy to clipboard');
    });
  };
  
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Results</DialogTitle>
          <DialogDescription>
            Let your friends know how well you did on today's challenge!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-4">
          {/* Challenge Result Card - This is what will be shown in previews */}
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-lg w-full text-center border border-purple-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-timelingo-purple" />
                <h3 className="text-lg font-semibold text-timelingo-navy">Daily Challenge</h3>
              </div>
              <div className="bg-timelingo-purple/10 p-1 rounded-full">
                <Trophy className="h-4 w-4 text-timelingo-purple" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md mb-3 shadow-inner">
              <p className="text-xl font-bold text-timelingo-navy mb-1">Your Score</p>
              <div className="flex items-center justify-center gap-1 mb-3">
                {Array.from({ length: totalEvents }).map((_, i) => (
                  <span 
                    key={i} 
                    className={`h-2 w-6 rounded-full ${i < score ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-3xl font-bold text-timelingo-purple">{score}/{totalEvents}</p>
            </div>
            
            <p className="text-sm text-gray-600">
              {score === totalEvents 
                ? "Perfect! You've mastered historical chronology!" 
                : score >= totalEvents / 2 
                  ? "Good job! You're getting the hang of historical timelines." 
                  : "Keep practicing to improve your historical knowledge!"}
            </p>
          </div>
          
          <p className="text-sm text-gray-500 italic">
            This card will appear as a preview when shared on social media
          </p>
          
          <div className="grid grid-cols-3 gap-4 w-full">
            <Button 
              onClick={shareToFacebook}
              variant="outline" 
              className="flex flex-col items-center justify-center h-20 p-2"
            >
              <Facebook className="h-8 w-8 text-blue-600 mb-1" />
              <span className="text-xs">Facebook</span>
            </Button>
            
            <Button 
              onClick={shareToTwitter}
              variant="outline" 
              className="flex flex-col items-center justify-center h-20 p-2"
            >
              <Twitter className="h-8 w-8 text-blue-400 mb-1" />
              <span className="text-xs">Twitter</span>
            </Button>
            
            <Button 
              onClick={copyToClipboard}
              variant="outline" 
              className="flex flex-col items-center justify-center h-20 p-2"
            >
              <Clipboard className="h-8 w-8 text-gray-600 mb-1" />
              <span className="text-xs">Copy</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareResultsModal;
