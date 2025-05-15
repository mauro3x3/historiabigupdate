import { HistoryEra, LearningTrackLevel, HistoryLesson } from '@/types';
import { getEraContent } from './eraContent';
import { supabase } from '@/integrations/supabase/client';

export interface LearningTrack {
  era: HistoryEra;
  levels: LearningTrackLevel[];
}

export const generateTrackForEra = async (era: HistoryEra): Promise<LearningTrack> => {
  try {
    // window.alert('generateTrackForEra called with era: ' + era);
    // Fetch all published modules for the era
    const { data: moduleData, error: moduleError } = await supabase
      .from('modules')
      .select('id, title, description, era, xp_reward, duration, level, position, content_type, story_content, image_urls, transition_question, prompt, character, year')
      .eq('era', era)
      .eq('status', 'published')
      .order('position');

    // window.alert('Raw moduleData: ' + JSON.stringify(moduleData));

    if (moduleError) {
      console.error('Error fetching modules:', moduleError);
      return { era, levels: [] };
    }

    let lessons: any[] = [];
    if (Array.isArray(moduleData)) {
      lessons = moduleData.map(module => ({
        id: String(module.id),
        title: module.title || '',
        description: module.description || '',
        era: module.era as HistoryEra,
        xp_reward: module.xp_reward || 50,
        duration: module.duration || 5,
        level: module.level,
        position: module.position,
        lesson_type: module.content_type || 'standard',
        story_content: module.story_content,
        image_urls: module.image_urls,
        transition_question: module.transition_question,
        prompt: module.prompt,
        character: module.character,
        year: module.year
      }));
    }

    return {
      era,
      levels: [
        {
          level: 1,
          title: 'All Modules',
          description: 'All available modules for this journey.',
          lessons,
          isUnlocked: true
        }
      ]
    };
  } catch (error) {
    console.error('Error generating track:', error);
    return { era, levels: [] };
  }
};
