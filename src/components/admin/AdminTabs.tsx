
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  currentLessonId: string | null;
  currentScenarioId: string | null;
}

const AdminTabs = ({ activeTab, onTabChange, currentLessonId, currentScenarioId }: AdminTabsProps) => {
  return (
    <Tabs 
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-1">
        <TabsTrigger value="lessons">Lessons</TabsTrigger>
        <TabsTrigger value="questions" disabled={!currentLessonId}>
          Quiz Questions
        </TabsTrigger>
        <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        <TabsTrigger value="choices" disabled={!currentScenarioId}>
          Scenario Choices
        </TabsTrigger>
        <TabsTrigger value="learning-tracks">Learning Journeys</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AdminTabs;
