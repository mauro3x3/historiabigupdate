import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoryEra, HistoryLesson } from '@/types';
import { Save, Plus, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import refactored components
import LevelSelector from './lesson-track/LevelSelector';
import AvailableLessonsList from './lesson-track/AvailableLessonsList';
import TrackLessonsList from './lesson-track/TrackLessonsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminLessonTrackAssociationProps {
  era: HistoryEra;
}

interface DbLesson {
  id: number;
  title: string;
  description: string | null;
  era: string | null;
  xp_reward: number | null;
  duration: number | null;
  level: number | null;
  position: number | null;
}

const AdminLessonTrackAssociation = ({ era }: AdminLessonTrackAssociationProps) => {
  const [lessons, setLessons] = useState<HistoryLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [trackLessons, setTrackLessons] = useState<HistoryLesson[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [availableLevels, setAvailableLevels] = useState<{id: string, name: string}[]>([
    {id: '1', name: 'Level 1'},
    {id: '2', name: 'Level 2'},
    {id: '3', name: 'Level 3'}
  ]);
  
  const [activeTab, setActiveTab] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchLevelsAndLessons();
  }, [era]);
  
  useEffect(() => {
    updateTrackLessons();
  }, [selectedLevel, lessons]);
  
  const fetchLevelsAndLessons = async () => {
    setIsLoading(true);
    try {
      const { data: trackConfig, error: trackError } = await supabase
        .from('learning_tracks')
        .select('*')
        .eq('era', era)
        .maybeSingle();
        
      if (trackConfig && !trackError) {
        const levels = [];
        
        if (trackConfig.level_one_name) {
          levels.push({id: '1', name: trackConfig.level_one_name});
        }
        if (trackConfig.level_two_name) {
          levels.push({id: '2', name: trackConfig.level_two_name});
        }
        if (trackConfig.level_three_name) {
          levels.push({id: '3', name: trackConfig.level_three_name});
        }
        
        const additionalLevelsData = trackConfig.levels ? 
          (typeof trackConfig.levels === 'string' ? 
            JSON.parse(trackConfig.levels) : trackConfig.levels) : [];
        
        if (Array.isArray(additionalLevelsData)) {
          const additionalLevels = additionalLevelsData.slice(levels.length);
          additionalLevels.forEach((level, index) => {
            const levelId = String(levels.length + 1);
            levels.push({
              id: levelId,
              name: level.name || `Level ${levelId}`
            });
          });
        }
        
        if (levels.length > 0) {
          setAvailableLevels(levels);
          setActiveTab(levels[0].id);
        } else {
          setAvailableLevels([
            {id: '1', name: 'Level 1'},
            {id: '2', name: 'Level 2'},
            {id: '3', name: 'Level 3'}
          ]);
          setActiveTab('1');
        }
      }
      
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('era', era)
        .order('title');
        
      if (lessonError) throw lessonError;
      
      if (lessonData) {
        const typedLessons = lessonData.map((lesson: DbLesson) => ({
          id: String(lesson.id),
          title: lesson.title || '',
          description: lesson.description || '',
          era: lesson.era as HistoryEra || era,
          xp_reward: lesson.xp_reward || 50,
          duration: lesson.duration || 5,
          level: lesson.level,
          position: lesson.position,
          content: '' // Add the required content property
        }));
        
        setLessons(typedLessons);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("Failed to load lessons");
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateTrackLessons = () => {
    const filtered = lessons.filter(lesson => lesson.level === selectedLevel);
    const sorted = [...filtered].sort((a, b) => {
      const posA = a.position || 999;
      const posB = b.position || 999;
      return posA - posB;
    });
    setTrackLessons(sorted);
  };
  
  const refreshLessons = async () => {
    await fetchLevelsAndLessons();
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(trackLessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index + 1
    }));
    
    setTrackLessons(updatedItems);
  };
  
  const addLessonToTrack = (lesson: HistoryLesson) => {
    if (trackLessons.some(l => l.id === lesson.id)) {
      toast.error("This lesson is already in this level");
      return;
    }
    
    const updatedLesson = {
      ...lesson,
      level: selectedLevel,
      position: trackLessons.length + 1
    };
    
    setLessons(lessons.map(l => l.id === lesson.id ? updatedLesson : l));
    toast.success(`Added "${lesson.title}" to ${getCurrentLevelName()}`);
  };
  
  const removeLessonFromTrack = (lessonId: string) => {
    const lessonToRemove = trackLessons.find(l => l.id === lessonId);
    
    setLessons(lessons.map(l => l.id === lessonId 
      ? { ...l, level: undefined, position: undefined } 
      : l
    ));
    
    if (lessonToRemove) {
      toast.success(`Removed "${lessonToRemove.title}" from ${getCurrentLevelName()}`);
    }
  };
  
  const saveTrackConfiguration = async () => {
    setIsSaving(true);
    try {
      const updatedLessons = lessons.filter(lesson => 
        lesson.level !== undefined || lesson.position !== undefined
      ).map(lesson => ({
        id: Number(lesson.id),
        level: lesson.level || null,
        position: lesson.position || null,
      }));
      
      if (updatedLessons.length === 0) {
        toast.info("No changes to save");
        setIsSaving(false);
        return;
      }
      
      for (let i = 0; i < updatedLessons.length; i += 100) {
        const batch = updatedLessons.slice(i, i + 100);
        const { error } = await supabase
          .from('lessons')
          .upsert(batch, { onConflict: 'id' });
          
        if (error) throw error;
      }
      
      toast.success("Track configuration saved successfully");
    } catch (error) {
      console.error("Error saving track configuration:", error);
      toast.error("Failed to save track configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedLevel(Number(value));
  };

  const getCurrentLevelName = () => {
    return availableLevels.find(level => level.id === String(selectedLevel))?.name || `Level ${selectedLevel}`;
  };

  const getLessonCountByLevel = () => {
    const counts: Record<string, number> = {};
    
    availableLevels.forEach(level => {
      const levelNum = Number(level.id);
      counts[level.id] = lessons.filter(lesson => lesson.level === levelNum).length;
    });
    
    return counts;
  };
  
  const lessonCounts = getLessonCountByLevel();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Assign Lessons to Learning Track: {era}</span>
            <Button
              onClick={saveTrackConfiguration}
              disabled={isSaving}
              size="sm"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Select a level below and add lessons to it. You can create new lessons individually, in bulk, or assign existing ones. After making changes, click "Save Configuration" to update the learning track.
            </AlertDescription>
          </Alert>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${availableLevels.length}, 1fr)` }}>
              {availableLevels.map(level => (
                <TabsTrigger key={level.id} value={level.id} className="relative">
                  {level.name}
                  <span className="absolute top-0 right-1 translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                    {lessonCounts[level.id] || 0}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {availableLevels.map(level => (
              <TabsContent key={level.id} value={level.id} className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <AvailableLessonsList 
                      lessons={lessons}
                      isLoading={isLoading}
                      onAddLesson={addLessonToTrack}
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                    />
                  </div>
                  
                  <div>
                    <TrackLessonsList 
                      trackLessons={trackLessons}
                      levelName={level.name}
                      levelNumber={Number(level.id)}
                      era={era}
                      onDragEnd={handleDragEnd}
                      onRemoveLesson={removeLessonFromTrack}
                      onLessonAdded={refreshLessons}
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <Button
            className="w-full mt-4"
            onClick={saveTrackConfiguration}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Track Configuration'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLessonTrackAssociation;
