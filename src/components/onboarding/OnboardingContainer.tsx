
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import ProgressBar from '@/components/ProgressBar';
import { HistoryEra, HistoryInterest, LearningStyle, LearningTime, UserPreferences, ReminderMethod } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

interface OnboardingContainerProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  children,
  step,
  totalSteps,
  onNext,
  onBack,
  isLastStep,
}) => {
  const navigate = useNavigate();
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  
  const handleNext = () => {
    setAnimationDirection('forward');
    onNext();
  };

  const handleBack = () => {
    setAnimationDirection('backward');
    onBack();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
      <div className="container max-w-3xl mx-auto pt-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <Logo />
          <div className="text-sm">
            <span className="text-gray-500">Already completed? </span>
            <Button variant="link" className="text-timelingo-purple p-0" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 transition-all duration-500 animate-fade-in">
          <ProgressBar current={step} total={totalSteps} className="mb-8" />
          
          <div className="min-h-[400px] flex flex-col justify-between">
            <div key={step} className={`animate-${animationDirection === 'forward' ? 'fade-in' : 'fade-in'}`}>
              {children}
            </div>
            
            <div className="flex justify-between mt-10">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={step === 1}
                className="transition-all duration-300 hover:shadow-md"
              >
                Back
              </Button>
              
              <Button 
                className="bg-timelingo-purple hover:bg-purple-700 transition-all duration-300 hover:shadow-md transform hover:scale-[1.02]"
                onClick={handleNext}
              >
                {isLastStep ? 'Start Learning' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingContainer;
