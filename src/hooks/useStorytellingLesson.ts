
import { useState, useEffect, RefObject } from 'react';
import { HistoryLesson } from '@/types';

export interface StorytellingControls {
  isScrollComplete: boolean;
  isTransitionVisible: boolean;
  handleContinueToQuiz: () => void;
}

export const useStorytellingLesson = (
  lesson: HistoryLesson | null,
  bottomRef: RefObject<HTMLDivElement>,
  onComplete: () => void
): StorytellingControls => {
  const [isScrollComplete, setIsScrollComplete] = useState(false);
  const [isTransitionVisible, setIsTransitionVisible] = useState(false);
  
  // Check if the user has scrolled to the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsScrollComplete(true);
          setTimeout(() => {
            setIsTransitionVisible(true);
          }, 1000);
        }
      },
      { threshold: 0.5 }
    );
    
    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }
    
    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [bottomRef]);
  
  const handleContinueToQuiz = () => {
    onComplete();
  };
  
  return {
    isScrollComplete,
    isTransitionVisible,
    handleContinueToQuiz
  };
};
