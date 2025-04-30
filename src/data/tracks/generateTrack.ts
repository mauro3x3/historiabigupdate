import { HistoryEra, LearningTrackLevel, HistoryLesson } from '@/types';
import { getEraContent } from './eraContent';
import { supabase } from '@/integrations/supabase/client';

export interface LearningTrack {
  era: HistoryEra;
  levels: LearningTrackLevel[];
}

export const generateTrackForEra = async (era: HistoryEra): Promise<LearningTrack> => {
  try {
    // First try to get track configuration from the database
    const { data: trackConfig, error } = await supabase
      .from('learning_tracks')
      .select('*')
      .eq('era', era)
      .maybeSingle();
    
    // Get content for fallback
    const eraContent = getEraContent(era);
    
    let levels: LearningTrackLevel[] = [];
    
    if (trackConfig && !error) {
      // Build levels from the track configuration
      const levelConfigs = [];
      
      // First three levels from schema fields
      if (trackConfig.level_one_name) {
        levelConfigs.push({
          level: 1,
          title: trackConfig.level_one_name,
          isUnlocked: true
        });
      }
      
      if (trackConfig.level_two_name) {
        levelConfigs.push({
          level: 2,
          title: trackConfig.level_two_name,
          isUnlocked: false
        });
      }
      
      if (trackConfig.level_three_name) {
        levelConfigs.push({
          level: 3,
          title: trackConfig.level_three_name,
          isUnlocked: false
        });
      }
      
      // Additional levels from JSON array if it exists in trackConfig
      // We're converting the string value to JSON if it exists
      const additionalLevelsData = trackConfig.levels ? 
        (typeof trackConfig.levels === 'string' ? 
          JSON.parse(trackConfig.levels) : trackConfig.levels) : [];
      
      if (Array.isArray(additionalLevelsData)) {
        // Skip levels already included from schema fields
        const additionalLevels = additionalLevelsData.slice(levelConfigs.length);
        additionalLevels.forEach((level, index) => {
          const levelNumber = levelConfigs.length + 1;
          levelConfigs.push({
            level: levelNumber,
            title: level.name || `Level ${levelNumber}`,
            isUnlocked: false
          });
        });
      }
      
      // Now fetch modules for each level
      for (const levelConfig of levelConfigs) {
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('*')
          .eq('era', era)
          .eq('level', levelConfig.level)
          .eq('status', 'published')
          .order('position');
        
        if (moduleError) {
          console.error("Error fetching modules for level", levelConfig.level, moduleError);
          continue;
        }
        
        levels.push({
          level: levelConfig.level,
          title: levelConfig.title,
          description: `Complete ${moduleData.length} modules to master ${levelConfig.title}.`,
          lessons: moduleData.map(module => ({
            id: String(module.id),
            title: module.title || '',
            description: module.description || '',
            content: module.content || '',
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
            character: module.character
          })),
          isUnlocked: levelConfig.isUnlocked
        });
      }
    }
    
    // If no levels found or there was an error, use defaults
    if (levels.length === 0) {
      levels = [
        {
          level: 1,
          title: eraContent.levelOneName,
          description: `Learn the basics of ${eraContent.eraName}.`,
          lessons: [],
          isUnlocked: true
        },
        {
          level: 2,
          title: eraContent.levelTwoName,
          description: `Expand your knowledge of ${eraContent.eraName}.`,
          lessons: [],
          isUnlocked: false
        },
        {
          level: 3,
          title: eraContent.levelThreeName,
          description: `Become an expert in ${eraContent.eraName}.`,
          lessons: [],
          isUnlocked: false
        }
      ];
    }
    
    return {
      era,
      levels
    };
  } catch (error) {
    console.error("Error generating track:", error);
    
    // Fallback to default content
    const eraContent = getEraContent(era);
    
    return {
      era,
      levels: [
        {
          level: 1,
          title: eraContent.levelOneName,
          description: `Learn the basics of ${eraContent.eraName}.`,
          lessons: [],
          isUnlocked: true
        },
        {
          level: 2,
          title: eraContent.levelTwoName,
          description: `Expand your knowledge of ${eraContent.eraName}.`,
          lessons: [],
          isUnlocked: false
        },
        {
          level: 3,
          title: eraContent.levelThreeName,
          description: `Become an expert in ${eraContent.eraName}.`,
          lessons: [],
          isUnlocked: false
        }
      ]
    };
  }
};
