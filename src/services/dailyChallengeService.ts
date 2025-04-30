
import { supabase } from '@/integrations/supabase/client';
import { addDays, format } from 'date-fns';

export const generateDailyChallenges = async (numberOfDays: number = 7) => {
  try {
    const challenges = [];
    const today = new Date();
    
    for (let i = 0; i < numberOfDays; i++) {
      const challengeDate = addDays(today, i);
      
      challenges.push({
        challenge_date: format(challengeDate, 'yyyy-MM-dd'),
        topic: "Historical Events Chronology",
        question: "Order these historical events from earliest to latest:",
        explanation: "Understanding the chronological order of historical events helps us grasp how civilizations and cultures developed over time.",
        options: [
          {
            id: "1",
            description: "Building of the Great Pyramid of Giza",
            year: -2560,
            explanation: "The Great Pyramid was built around 2560 BCE during the Fourth Dynasty of ancient Egypt."
          },
          {
            id: "2",
            description: "Founding of Rome",
            year: -753,
            explanation: "According to tradition, Rome was founded in 753 BCE by Romulus."
          },
          {
            id: "3",
            description: "First Olympic Games",
            year: -776,
            explanation: "The first recorded Olympic Games were held in 776 BCE in Olympia, Greece."
          }
        ],
        xp_reward: 25
      });
    }
    
    const { error } = await supabase
      .from('daily_challenges')
      .insert(challenges);
      
    if (error) throw error;
    
    return { success: true, count: challenges.length };
  } catch (error) {
    console.error('Error generating daily challenges:', error);
    return { success: false, error };
  }
};
