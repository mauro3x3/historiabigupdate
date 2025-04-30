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
};
