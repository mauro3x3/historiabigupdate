
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoryEra } from '@/types';
import { Save, Info, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Update the import path to use the new location
import TrackLevelsTab from '@/components/admin/lesson-track/TrackLevelsTab';
import { useTrackLessonsManagement } from '@/hooks/useTrackLessonsManagement';

interface AdminLessonTrackAssociationProps {
  era: HistoryEra;
}

const AdminLessonTrackAssociation = ({ era }: AdminLessonTrackAssociationProps) => {
  const {
    lessons,
    setLessons,
    isLoading,
    selectedLevel,
    availableLevels,
    activeTab,
    searchTerm,
    isSaving,
    handleTabChange,
    setSearchTerm,
    saveTrackConfiguration,
    getLessonCountByLevel,
  } = useTrackLessonsManagement(era);

  const lessonCounts = getLessonCountByLevel();

  // Show a help toast when component mounts
  React.useEffect(() => {
    toast.info(
      "Select a level from the tabs below, then use the content creation buttons to add Learning Journey or Side Learning content.", 
      { duration: 5000 }
    );
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">Configure Learning Journey: {era}</CardTitle>
          <Button
            onClick={saveTrackConfiguration}
            disabled={isSaving}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              <strong>How to add content:</strong> First select a level from the tabs below, then use the "Create Main Learning Journey" or "Create Side Learning" buttons to add content.
            </AlertDescription>
          </Alert>
          
          <TrackLevelsTab 
            availableLevels={availableLevels}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            lessonCounts={lessonCounts}
            lessons={lessons}
            setLessons={setLessons}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            era={era}
          />
          
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLessonTrackAssociation;
