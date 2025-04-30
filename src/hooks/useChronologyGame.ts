
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { playCorrectSound, playWrongSound } from '@/utils/audioUtils';
import { toast } from 'sonner';
import { HistoricalEvent } from '@/types';

interface UseChronologyGameProps {
  events: HistoricalEvent[];
  challengeId: string;
  onComplete: () => void;
}

export const useChronologyGame = ({ events, challengeId, onComplete }: UseChronologyGameProps) => {
  // Ensure events is an array even if somehow passed as null
  const safeEvents = Array.isArray(events) ? events : [];
  
  const [orderedEvents, setOrderedEvents] = useState<HistoricalEvent[]>([...safeEvents]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [animateItems, setAnimateItems] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { addXp, user } = useUser();

  // Sort events by year to get correct chronological order
  const correctOrder = [...safeEvents].sort((a, b) => {
    // Handle missing year values safely
    const yearA = a.year !== undefined ? a.year : 0;
    const yearB = b.year !== undefined ? b.year : 0;
    return yearA - yearB;
  });

  // Animate items after a small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateItems(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Update ordered events when events prop changes
  useEffect(() => {
    setOrderedEvents([...safeEvents]);
  }, [safeEvents]);

  const handleDragEnd = (result: any) => {
    if (!result.destination || isSubmitted) return;
    const items = Array.from(orderedEvents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOrderedEvents(items);
  };

  const checkOrder = async () => {
    if (safeEvents.length === 0) {
      toast.error("No events to check");
      return;
    }
    
    let correctPositions = 0;
    orderedEvents.forEach((event, index) => {
      if (index < correctOrder.length && event.id === correctOrder[index].id) {
        correctPositions++;
      }
    });
    
    setScore(correctPositions);
    setIsSubmitted(true);

    try {
      if (correctPositions >= Math.ceil(safeEvents.length / 2)) {
        playCorrectSound();
      } else {
        playWrongSound();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }

    const xpEarned = correctPositions * 5;
    if (xpEarned > 0) {
      addXp(xpEarned);
      toast.success(`You earned ${xpEarned} XP!`);
    }

    try {
      if (user && challengeId?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        const { error } = await supabase.from('user_challenge_progress')
          .insert({
            user_id: user.id,
            challenge_id: challengeId,
            completed: true,
            correct: correctPositions === safeEvents.length,
            xp_earned: xpEarned
          });
        if (error) {
          console.error("Error saving challenge progress:", error);
        }
      }
    } catch (error) {
      console.error("Error saving challenge progress:", error);
    }
  };

  return {
    orderedEvents,
    isSubmitted,
    score,
    animateItems,
    showHint,
    shareModalOpen,
    correctOrder,
    setShowHint,
    setShareModalOpen,
    handleDragEnd,
    checkOrder
  };
};
