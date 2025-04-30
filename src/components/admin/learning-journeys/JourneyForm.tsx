
import React, { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { HistoryEra } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  FormHeader,
  JourneyMetadataFields,
  ChapterFields,
  FormActions
} from './journey-form';

interface JourneyFormProps {
  onJourneyAdded: () => void;
}

const JourneyForm = ({ onJourneyAdded }: JourneyFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newJourney, setNewJourney] = useState({
    title: '',
    description: '',
    type: '',
    era: '' as HistoryEra,
    cover_image_url: '',
    chapter_names: ['', '', '']
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJourney(prev => ({ ...prev, [name]: value }));
  };
  
  const handleChapterChange = (index: number, value: string) => {
    const updatedChapters = [...newJourney.chapter_names];
    updatedChapters[index] = value;
    setNewJourney(prev => ({ ...prev, chapter_names: updatedChapters }));
  };
  
  const handleSelectChange = (value: string) => {
    setNewJourney(prev => ({ ...prev, era: value as HistoryEra, type: value }));
  };
  
  const handleAddJourney = async () => {
    if (!newJourney.title || !newJourney.era) {
      toast.error('Journey title and type are required');
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('learning_tracks')
        .insert([{
          level_one_name: newJourney.chapter_names[0] || newJourney.title,
          level_two_name: newJourney.chapter_names[1] || 'Chapter 2',
          level_three_name: newJourney.chapter_names[2] || 'Chapter 3',
          era: newJourney.era,
          levels: JSON.stringify([
            { id: '1', name: newJourney.chapter_names[0] || newJourney.title },
            { id: '2', name: newJourney.chapter_names[1] || 'Chapter 2' },
            { id: '3', name: newJourney.chapter_names[2] || 'Chapter 3' }
          ]) as unknown as Json,
          updated_at: new Date().toISOString(),
        }]);
      
      if (error) throw error;
      
      toast.success('Learning journey added successfully');
      setNewJourney({
        title: '',
        description: '',
        type: '',
        era: '' as HistoryEra,
        cover_image_url: '',
        chapter_names: ['', '', '']
      });
      
      onJourneyAdded();
    } catch (error) {
      console.error('Error adding journey:', error);
      toast.error('Failed to add learning journey');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <FormHeader />
      <CardContent>
        <div className="space-y-4">
          <JourneyMetadataFields
            title={newJourney.title}
            description={newJourney.description}
            era={newJourney.era}
            coverImageUrl={newJourney.cover_image_url}
            onInputChange={handleInputChange}
            onEraChange={handleSelectChange}
          />
          
          <ChapterFields
            chapterNames={newJourney.chapter_names}
            onChapterChange={handleChapterChange}
          />
        </div>
      </CardContent>
      <FormActions 
        onSubmit={handleAddJourney} 
        isLoading={isLoading} 
      />
    </Card>
  );
};

export default JourneyForm;
