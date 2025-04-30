
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import LessonCard from '@/components/dashboard/LessonCard';
import { useUser } from '@/contexts/UserContext';
import { lessons } from '@/data/historyData';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getLessonProgress } from '@/services/progressService';
import { HistoryEra, HistoryLesson } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const AllLessons = () => {
  const navigate = useNavigate();
  const { preferences } = useUser();
  const [lessonsWithProgress, setLessonsWithProgress] = useState<HistoryLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEra, setSelectedEra] = useState<HistoryEra | 'all'>(preferences?.era || 'all');
  
  // Fetch user data and lesson progress
  useEffect(() => {
    const fetchUserDataAndProgress = async () => {
      setIsLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch lesson progress
          const progressMap = await getLessonProgress(user.id);
          
          // Add progress to lessons
          const updatedLessons = lessons.map(lesson => ({
            ...lesson,
            progress: progressMap[lesson.id]
          }));
          
          setLessonsWithProgress(updatedLessons);
        } else {
          setLessonsWithProgress(lessons);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLessonsWithProgress(lessons);
      }
      setIsLoading(false);
    };
    
    fetchUserDataAndProgress();
  }, []);
  
  // Filter lessons based on selected era
  const filteredLessons = selectedEra === 'all' 
    ? lessonsWithProgress 
    : lessonsWithProgress.filter(lesson => selectedEra === lesson.era);
  
  // Handle starting a lesson
  const handleStartLesson = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  const eraLabels: Record<string, string> = {
    'ancient-egypt': 'Ancient Egypt',
    'rome-greece': 'Rome & Greece',
    'medieval': 'Medieval',
    'revolutions': 'Revolutions',
    'modern': 'Modern',
    'china': 'Chinese History',
    'islamic': 'Islamic History',
    'russian': 'Russian History',
    'jewish': 'Jewish History',
    'christian': 'Christian History',
    'all': 'All Eras'
  };
  
  // Get unique eras from lessons for the filter
  const availableEras = Array.from(new Set(['all', ...lessons.map(lesson => lesson.era)]));
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading lessons...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-timelingo-purple">
              <span className="sr-only">Settings</span>
              ⚙️
            </button>
            <div className="h-8 w-8 bg-timelingo-purple rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-1" 
            onClick={() => navigate('/dashboard')}
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-timelingo-navy">All Lessons</h1>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Filter by Era:</h2>
          <div className="flex flex-wrap gap-2">
            {availableEras.map((era) => (
              <Button 
                key={era}
                variant={selectedEra === era ? "default" : "outline"}
                onClick={() => setSelectedEra(era as HistoryEra | 'all')}
                className="mb-2"
              >
                {eraLabels[era] || era}
              </Button>
            ))}
          </div>
        </div>
        
        {filteredLessons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredLessons.map(lesson => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onStart={handleStartLesson}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-xl font-medium mb-2">No lessons found</h3>
            <p className="text-gray-600">Try selecting a different era or check back later</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllLessons;
