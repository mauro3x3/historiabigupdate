import { supabase } from '@/integrations/supabase/client';

// Safe typed table queries
export const dbService = {
  modules: {
    getAll: () => supabase.from('modules').select('*'),
    getById: (id: number) => supabase.from('modules').select('*').eq('id', id).single(),
    getByJourneyId: (journeyId: number) => supabase.from('modules').select('*').eq('journey_id', journeyId).order('position'),
    countByJourneyId: (journeyId: number) => supabase.from('modules').select('*', { count: 'exact', head: true }).eq('journey_id', journeyId),
    create: (data: any) => supabase.from('modules').insert(data).select(),
    update: (id: number, data: any) => supabase.from('modules').update(data).eq('id', id),
    delete: (id: number) => supabase.from('modules').delete().eq('id', id),
    getByChapterId: (chapterId: number) => supabase.from('modules').select('*').eq('chapter_id', chapterId).order('position'),
  },
  
  moduleContent: {
    getByModuleId: (moduleId: number) => supabase.from('module_content').select('*').eq('module_id', moduleId).maybeSingle(),
    create: (data: any) => supabase.from('module_content').insert(data).select(),
    update: (id: number, data: any) => supabase.from('module_content').update(data).eq('id', id),
  },
  
  questions: {
    getByModuleId: (moduleId: number) => supabase.from('questions').select('*').eq('module_id', moduleId),
    create: (data: any) => supabase.from('questions').insert(data).select(),
    delete: (id: string) => supabase.from('questions').delete().eq('id', id),
  },
  
  learningTracks: {
    getAll: () => supabase.from('learning_tracks').select('*'),
    getById: (id: number) => supabase.from('learning_tracks').select('*').eq('id', id).single(),
    create: (data: any) => supabase.from('learning_tracks').insert(data).select(),
    update: (id: number, data: any) => supabase.from('learning_tracks').update(data).eq('id', id),
    delete: (id: number) => supabase.from('learning_tracks').delete().eq('id', id),
  },
  
  chapters: {
    getByJourneyId: (journeyId: number) => supabase.from('chapters').select('*').eq('journey_id', journeyId).order('position'),
    getById: (id: number) => supabase.from('chapters').select('*').eq('id', id).single(),
    create: (data: any) => supabase.from('chapters').insert(data).select(),
    update: (id: number, data: any) => supabase.from('chapters').update(data).eq('id', id),
    delete: (id: number) => supabase.from('chapters').delete().eq('id', id),
  },
  
  userJourneyProgress: {
    getByUserAndModule: (userId: string, moduleId: number) =>
      supabase.from('user_journey_progress').select('*').eq('user_id', userId).eq('module_id', moduleId).single(),
    markCompleted: (userId: string, moduleId: number) =>
      supabase.from('user_journey_progress').update({ is_completed: true, completed_at: new Date().toISOString() }).eq('user_id', userId).eq('module_id', moduleId),
    unlockNextModule: async (userId: string, journeyId: number, currentModuleId: number) => {
      // Get the position of the current module
      const { data: currentModule, error: currentModuleError } = await supabase
        .from('modules')
        .select('position')
        .eq('id', currentModuleId)
        .single();
      if (currentModuleError || !currentModule) return { error: currentModuleError || 'Current module not found' };
      // Get the next module in the journey
      const { data: nextModule, error: nextModuleError } = await supabase
        .from('modules')
        .select('id, journey_id')
        .eq('journey_id', journeyId)
        .gt('position', currentModule.position)
        .order('position', { ascending: true })
        .limit(1)
        .single();
      if (nextModuleError || !nextModule) return { error: nextModuleError || 'No next module' };
      // Insert unlock for the next module if not already unlocked
      const { data: existing, error: existingError } = await supabase
        .from('user_journey_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('module_id', nextModule.id)
        .maybeSingle();
      if (existingError) return { error: existingError };
      if (!existing) {
        return await supabase.from('user_journey_progress').insert({
          user_id: userId,
          journey_id: journeyId,
          module_id: nextModule.id,
          is_completed: false,
          unlocked_at: new Date().toISOString(),
        });
      }
      return { data: 'Already unlocked' };
    },
  },
};
