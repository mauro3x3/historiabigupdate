
import { Json } from '@/integrations/supabase/types';

// Extension of the Supabase Database types with our new tables
export interface CustomDatabase {
  modules: {
    id: number;
    title: string;
    description: string | null;
    journey_id: number;
    position: number;
    content_type: 'story' | 'quiz' | 'video' | 'game';
    is_journey_module: boolean;
    image_url: string | null;
    created_at: string;
    updated_at: string;
  };
  
  module_content: {
    id: number;
    module_id: number;
    story_text: string | null;
    video_url: string | null;
    game_data: any;
    image_urls: string[];
    transition_question: string | null;
    created_at: string;
    updated_at: string;
  };
  
  questions: {
    id: string;
    module_id: number;
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string | null;
    created_at: string;
  };
}
