import React, { useState, useEffect } from 'react';
import { LearningSection, VideosSection, AchievementsSection } from './sections';
import DailyChallengesTab from './sections/DailyChallengesTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, CalendarCheck, Trophy } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useLocation } from 'react-router-dom';
import UserStats from './UserStats';
import FeatureCards from './FeatureCards';

const DashboardContent: React.FC = () => {
  const { currentEra, learningTrack, isLoading } = useDashboardData();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const hash = window.location.hash.replace('#', '');
  const initialTab = hash || params.get('tab') || 'learning';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [forceRefresh, setForceRefresh] = useState(false);

  // Listen for content-saved event to refresh the dashboard
  useEffect(() => {
    const handleContentSaved = () => {
      console.log("Content saved event detected, refreshing dashboard");
      setForceRefresh(prev => !prev);
    };
    window.addEventListener('content-saved', handleContentSaved);
    return () => {
      window.removeEventListener('content-saved', handleContentSaved);
    };
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash) {
        setActiveTab(newHash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Helper function to filter journey content
  const filterJourneyContent = (modules: any[]) => {
    return modules.map(level => ({
      ...level,
      lessons: level.lessons.filter((lesson: any) => lesson.is_journey_content === true)
    })).filter(level => level.lessons.length > 0);
  };

  // Helper function to filter side content
  const filterSideContent = (modules: any[]) => {
    return modules.map(level => ({
      ...level,
      lessons: level.lessons.filter((lesson: any) => lesson.is_journey_content !== true)
    })).filter(level => level.lessons.length > 0);
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mt-8 mb-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            window.location.hash = value;
          }}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Your Learning Journey</span>
              <span className="sm:hidden">Journey</span>
            </TabsTrigger>
            <TabsTrigger value="side-content" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Side Learning</span>
              <span className="sm:hidden">Side</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Videos</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Daily Challenges</span>
              <span className="sm:hidden">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Achievements</span>
              <span className="sm:hidden">Badges</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning" key={`learning-${forceRefresh}`}>
            <UserStats learningTrack={learningTrack} />
            <FeatureCards />
            {/* <LearningSection
              currentEra={currentEra}
              learningTrack={filterJourneyContent(learningTrack)}
              isLoading={isLoading}
            /> */}
          </TabsContent>

          <TabsContent value="side-content" key={`side-${forceRefresh}`}>
            {/* <LearningSection
              currentEra={currentEra}
              learningTrack={filterSideContent(learningTrack)}
              isLoading={isLoading}
              title="Side Learning Content"
              description="Explore additional lessons, games, and quizzes to enhance your knowledge."
            /> */}
          </TabsContent>

          <TabsContent value="videos">
            <VideosSection />
          </TabsContent>

          <TabsContent value="challenges">
            <DailyChallengesTab />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsSection />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default DashboardContent;
