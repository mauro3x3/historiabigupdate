import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { playCorrectSound, playWrongSound, preloadSounds } from '@/utils/audioUtils';
import { DailyChallenge } from '@/types';
import { unlockAchievement } from '@/integrations/supabase/achievements';

interface DailyChallengeQuizProps {
  challenge: DailyChallenge;
  onComplete: () => void;
}

const DailyChallengeQuiz = ({ challenge, onComplete }: DailyChallengeQuizProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { addXp, user } = useUser();

  // Preload sounds when component mounts
  useEffect(() => {
    try {
      preloadSounds();
    } catch (error) {
      console.error("Error preloading sounds:", error);
    }
  }, []);

  // Play sound effect when answer is checked
  useEffect(() => {
    try {
      if (isAnswerCorrect === true) {
        playCorrectSound();
      } else if (isAnswerCorrect === false) {
        playWrongSound();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, [isAnswerCorrect]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswerCorrect !== null) return;
    setSelectedAnswer(answerIndex);
  };

  const checkAnswer = async () => {
    if (selectedAnswer === null || challenge.correct_answer === undefined || challenge.correct_answer === null) {
      toast.error("Cannot check answer - missing data");
      return;
    }
    
    const isCorrect = selectedAnswer === challenge.correct_answer;
    setIsAnswerCorrect(isCorrect);
    
    // Award XP if correct
    if (isCorrect && challenge.xp_reward) {
      addXp(challenge.xp_reward);
      toast.success(`Correct! You earned ${challenge.xp_reward} XP!`);
    } else {
      toast.error("That wasn't quite right. Try again tomorrow!");
    }
    
    // Save challenge completion to database
    try {
      if (user && challenge.id) {
        const { error } = await supabase.from('user_challenge_progress')
          .insert({
            user_id: user.id,
            challenge_id: challenge.id,
            completed: true,
            correct: isCorrect,
            xp_earned: isCorrect ? (challenge.xp_reward || 0) : 0
          });
        if (error) throw error;
        // Unlock achievements
        await unlockAchievement(user.id, 'daily_challenge_1');
        // Count user's completed daily challenges
        const { count } = await supabase
          .from('user_challenge_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('completed', true);
        if ((count || 0) >= 10) {
          await unlockAchievement(user.id, 'daily_challenge_10');
        }
      }
    } catch (error) {
      console.error("Error saving challenge progress:", error);
    }
    
    setIsCompleted(true);
  };

  // Ensure we have valid question and options
  const question = challenge.question || "No question available";
  const options = Array.isArray(challenge.options) && challenge.options.length > 0 
    ? challenge.options 
    : ["Option not available"];

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Today's challenge about</h3>
          <h2 className="text-xl font-semibold">{challenge.topic || "General Knowledge"}</h2>
        </div>
        
        <div className="mb-6">
          <p className="text-lg mb-4">{question}</p>
          
          <div className="space-y-3">
            {options.map((option, index) => (
              <div 
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnswer === index 
                    ? isAnswerCorrect === null
                      ? 'border-timelingo-purple bg-purple-50' 
                      : isAnswerCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    : challenge.correct_answer === index && isAnswerCorrect !== null
                      ? 'border-green-500 bg-green-50'
                      : 'hover:border-gray-400'
                }`}
              >
                <p>{option || "Option not available"}</p>
              </div>
            ))}
          </div>
          
          {isAnswerCorrect !== null && challenge.explanation && (
            <Alert className={`mt-4 ${isAnswerCorrect ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <AlertDescription>
                <p className="font-semibold">{isAnswerCorrect ? 'Correct!' : 'Explanation:'}</p>
                <p>{challenge.explanation}</p>
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="flex justify-end">
          {isCompleted ? (
            <Button 
              className="bg-timelingo-purple hover:bg-timelingo-purple/90"
              onClick={onComplete}
            >
              Return to Dashboard
            </Button>
          ) : (
            <Button 
              className="bg-timelingo-purple hover:bg-timelingo-purple/90"
              onClick={checkAnswer}
              disabled={selectedAnswer === null || isAnswerCorrect !== null}
            >
              Submit Answer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyChallengeQuiz;
