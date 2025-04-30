
import React, { useState, useEffect } from 'react';
import { HistoryEra, HistoryLesson } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AvailableLessonsList from './AvailableLessonsList';
import TrackLessonsList from './TrackLessonsList';
import { useTrackTabContent } from '@/hooks/useTrackTabContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, AlertCircle, BookText, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TrackLevelsTabProps {
  availableLevels: {id: string, name: string}[];
  activeTab: string;
  onTabChange: (value: string) => void;
  lessonCounts: Record<string, number>;
  lessons: HistoryLesson[];
  setLessons: React.Dispatch<React.SetStateAction<HistoryLesson[]>>;
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  era: HistoryEra;
}

const TrackLevelsTab = ({
  availableLevels,
  activeTab,
  onTabChange,
  lessonCounts,
  lessons,
  setLessons,
  isLoading,
  searchTerm,
  onSearchChange,
  era
}: TrackLevelsTabProps) => {
  const {
    trackLessons,
    handleDragEnd,
    addLessonToTrack,
    removeLessonFromTrack,
    refreshLessons
  } = useTrackTabContent(lessons, Number(activeTab));

  const [selectedTabName, setSelectedTabName] = useState<string>('');

  useEffect(() => {
    // Set the current module name when tab changes
    const currentModule = availableLevels.find(level => level.id === activeTab);
    setSelectedTabName(currentModule?.name || `Module ${activeTab}`);
  }, [activeTab, availableLevels]);

  const handleAddLesson = (lesson: HistoryLesson) => {
    const updatedLessons = addLessonToTrack(lesson);
    setLessons(updatedLessons);
  };

  const handleRemoveLesson = (lessonId: string) => {
    const updatedLessons = removeLessonFromTrack(lessonId);
    setLessons(updatedLessons);
  };

  // Function to show a reminder toast about creating content
  const showContentCreationReminder = () => {
    toast.info(
      "To add content to a module, select the module tab and use the 'Create Learning Journey' or 'Create Side Learning' buttons below.",
      { duration: 5000 }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <BookText className="text-purple-700" />
          Learning Modules
        </h2>
        <Button 
          variant="outline" 
          onClick={showContentCreationReminder}
          className="flex items-center gap-1"
        >
          <PlusCircle size={16} className="mr-1" />
          How to Add Content
        </Button>
      </div>
      
      <div className="bg-white p-4 border border-blue-100 rounded-md mb-4">
        <div className="flex items-center text-sm text-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-500 mr-2" />
          <span className="font-medium">How to add content:</span>
          <ArrowRight className="mx-2 h-4 w-4" />
          <span>First select a module from the tabs below, then use the "Create Main Learning Journey" or "Create Side Learning" buttons to add content.</span>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="bg-white border border-gray-200 rounded-md p-2 mb-4">
          <TabsList className="w-full flex flex-wrap gap-1 h-auto bg-slate-100 p-1">
            {availableLevels.map((level, index) => (
              <TabsTrigger 
                key={level.id} 
                value={level.id} 
                className="relative flex-grow px-4 py-2 text-sm h-10 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
              >
                <span className="truncate max-w-[150px]">{level.name}</span>
                {lessonCounts[level.id] > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {lessonCounts[level.id] || 0}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
      
      <Alert className="bg-purple-50 border-purple-200 text-purple-800 mb-4">
        <AlertCircle className="h-4 w-4 text-purple-500" />
        <AlertDescription>
          <strong>Currently editing:</strong> {selectedTabName}
        </AlertDescription>
      </Alert>
      
      {availableLevels.map(level => (
        <TabsContent key={level.id} value={level.id} className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  {level.name} Content
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <TrackLessonsList 
                  trackLessons={trackLessons}
                  levelName={level.name}
                  levelNumber={Number(level.id)}
                  era={era}
                  onDragEnd={handleDragEnd}
                  onRemoveLesson={handleRemoveLesson}
                  onLessonAdded={refreshLessons}
                />
              </CardContent>
            </Card>
            
            <AvailableLessonsList 
              lessons={lessons}
              isLoading={isLoading}
              onAddLesson={handleAddLesson}
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
            />
          </div>
        </TabsContent>
      ))}
    </div>
  );
};

export default TrackLevelsTab;
