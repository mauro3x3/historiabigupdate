
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useStorytellingLesson } from '@/hooks/useStorytellingLesson';

interface StorytellingLessonProps {
  storyContent: string;
  transitionQuestion?: string;
  imageUrls: string[];
  onComplete: () => void;
}

const StorytellingLesson: React.FC<StorytellingLessonProps> = ({
  storyContent,
  transitionQuestion = 'Are you ready for the test?',
  imageUrls,
  onComplete
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isScrollComplete, isTransitionVisible, handleContinueToQuiz } = useStorytellingLesson(
    null,
    bottomRef,
    onComplete
  );

  // Split content by paragraphs and filter out empty ones
  const paragraphs = storyContent.split('\n').filter(para => para.trim() !== '');
  
  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-y-auto">
      <div className="container mx-auto py-16 px-4 max-w-3xl space-y-20">
        {paragraphs.map((paragraph, index) => {
          // Calculate if we should insert an image after this paragraph
          const shouldInsertImage = imageUrls.length > 0 && 
            index < paragraphs.length - 1 && 
            index % Math.ceil(paragraphs.length / (imageUrls.length + 1)) === 0;
          
          const imageIndex = Math.floor(index / Math.ceil(paragraphs.length / imageUrls.length));
          
          return (
            <React.Fragment key={index}>
              <div className="opacity-90">
                <p className="text-lg md:text-xl leading-relaxed">{paragraph}</p>
              </div>
              
              {shouldInsertImage && imageUrls[imageIndex] && (
                <div className="my-12">
                  <img 
                    src={imageUrls[imageIndex]} 
                    alt={`Story illustration ${imageIndex + 1}`}
                    className="w-full rounded-lg shadow-2xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/800x450?text=Image+Not+Found';
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
        
        {/* This element is used to detect when the user has scrolled to the bottom */}
        <div ref={bottomRef} />
        
        {/* Transition question that appears when the story is complete */}
        {isTransitionVisible && (
          <div className="my-12 py-10 text-center opacity-90 animate-fade-in">
            <p className="text-xl md:text-2xl mb-8">{transitionQuestion}</p>
            <Button 
              onClick={handleContinueToQuiz}
              className="bg-timelingo-purple hover:bg-purple-700 text-white py-2 px-6 rounded-full text-lg"
            >
              Continue to Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorytellingLesson;
