import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface JourneyOption {
  id: number;
  name: string;
  era: string;
}

interface ChapterItem {
  id: number;
  title: string;
  description: string;
  journey_id: number;
  position: number;
}

export const useJourneyChapterSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const journeyIdFromQuery = searchParams.get('journey');
  const chapterIdFromQuery = searchParams.get('chapter');
  
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [journeys, setJourneys] = useState<JourneyOption[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<number | null>(
    journeyIdFromQuery ? parseInt(journeyIdFromQuery) : null
  );
  const [selectedChapter, setSelectedChapter] = useState<number | null>(
    chapterIdFromQuery ? parseInt(chapterIdFromQuery) : null
  );
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchJourneys();
  }, []);
  
  useEffect(() => {
    if (selectedJourney) {
      fetchChapters(selectedJourney);
      
      // Update the URL to include the journey parameter
      const newParams = new URLSearchParams(location.search);
      newParams.set('journey', selectedJourney.toString());
      // Keep the tab parameter
      newParams.set('tab', 'modules');
      // Clear chapter parameter if changing journey
      if (!chapterIdFromQuery) {
        newParams.delete('chapter');
      }
      navigate(`/admin?${newParams.toString()}`, { replace: true });
    }
  }, [selectedJourney]);
  
  useEffect(() => {
    if (selectedChapter) {
      // Update the URL to include the chapter parameter
      const newParams = new URLSearchParams(location.search);
      if (selectedJourney) {
        newParams.set('journey', selectedJourney.toString());
      }
      newParams.set('chapter', selectedChapter.toString());
      // Keep the tab parameter
      newParams.set('tab', 'modules');
      navigate(`/admin?${newParams.toString()}`, { replace: true });
    }
  }, [selectedChapter]);
  
  const fetchJourneys = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_tracks')
        .select('id, level_one_name, era')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const journeyOptions = data.map(track => ({
          id: track.id,
          name: track.level_one_name || 'Unnamed Journey',
          era: track.era
        }));
        
        setJourneys(journeyOptions);
        
        // Auto-select the first journey if none is selected and no journey is specified in the URL
        if (!selectedJourney && !journeyIdFromQuery && journeyOptions.length > 0) {
          setSelectedJourney(journeyOptions[0].id);
        } else if (journeyIdFromQuery && journeyOptions.length > 0) {
          const journeyId = parseInt(journeyIdFromQuery);
          setSelectedJourney(journeyId);
        }
      }
    } catch (error) {
      console.error('Error fetching journeys:', error);
      toast.error('Failed to load learning journeys');
    }
  };
  
  const fetchChapters = async (journeyId: number) => {
    setIsLoading(true);
    try {
      // For now, we'll simulate chapters using the level names from the learning track
      const { data, error } = await supabase
        .from('learning_tracks')
        .select('id, level_one_name, level_two_name, level_three_name')
        .eq('id', journeyId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Create chapters from the level names
        const chaptersData: ChapterItem[] = [];
        
        if (data.level_one_name) {
          chaptersData.push({
            id: journeyId * 100 + 1, // Generate unique IDs
            title: data.level_one_name,
            description: 'First chapter',
            journey_id: journeyId,
            position: 1
          });
        }
        
        if (data.level_two_name) {
          chaptersData.push({
            id: journeyId * 100 + 2,
            title: data.level_two_name,
            description: 'Second chapter',
            journey_id: journeyId,
            position: 2
          });
        }
        
        if (data.level_three_name) {
          chaptersData.push({
            id: journeyId * 100 + 3,
            title: data.level_three_name,
            description: 'Third chapter',
            journey_id: journeyId,
            position: 3
          });
        }
        
        setChapters(chaptersData);
        
        // Auto-select the first chapter if none is selected
        if (!selectedChapter && chaptersData.length > 0) {
          setSelectedChapter(chaptersData[0].id);
        } else if (chapterIdFromQuery) {
          const chapterId = parseInt(chapterIdFromQuery);
          // Verify the chapter belongs to this journey
          if (chaptersData.some(c => c.id === chapterId)) {
            setSelectedChapter(chapterId);
          } else if (chaptersData.length > 0) {
            // If not, select the first chapter
            setSelectedChapter(chaptersData[0].id);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast.error('Failed to load chapters');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleJourneyChange = (journeyId: number) => {
    setSelectedChapter(null);
    setSelectedJourney(journeyId);
  };
  
  const handleChapterChange = (chapterId: number) => {
    setSelectedChapter(chapterId);
  };
  
  const getJourneyNameById = (id: number | null) => {
    if (!id) return 'Selected Journey';
    const journey = journeys.find(j => j.id === id);
    return journey ? journey.name : 'Unknown Journey';
  };
  
  const getChapterNameById = (id: number | null) => {
    if (!id) return 'Selected Chapter';
    const chapter = chapters.find(c => c.id === id);
    return chapter ? chapter.title : 'Unknown Chapter';
  };
  
  return {
    chapters,
    journeys,
    selectedJourney,
    selectedChapter,
    isLoading,
    fetchChapters,
    handleJourneyChange,
    handleChapterChange,
    getJourneyNameById,
    getChapterNameById
  };
};
