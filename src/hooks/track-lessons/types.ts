
import { HistoryEra, HistoryLesson } from '@/types';

export interface DbLesson {
  id: number;
  title: string;
  description: string | null;
  era: string | null;
  xp_reward: number | null;
  duration: number | null;
  level: number | null;
  position: number | null;
  content?: string;
  lesson_type?: string;
  story_content?: string;
  image_urls?: string;
  transition_question?: string;
  prompt?: string;
  character?: string;
}

export interface LevelInfo {
  id: string;
  name: string;
}

export interface UseTrackLessonsResult {
  lessons: HistoryLesson[];
  setLessons: React.Dispatch<React.SetStateAction<HistoryLesson[]>>;
  isLoading: boolean;
  selectedLevel: number;
  availableLevels: LevelInfo[];
  activeTab: string;
  searchTerm: string;
  isSaving: boolean;
  fetchLevelsAndLessons: () => Promise<void>;
  handleTabChange: (value: string) => void;
  setSearchTerm: (value: string) => void;
  getLessonCountByLevel: () => Record<string, number>;
  saveTrackConfiguration: () => Promise<void>;
}

export interface UseTrackTabContentResult {
  trackLessons: HistoryLesson[];
  handleDragEnd: (result: any) => void;
  addLessonToTrack: (lesson: HistoryLesson) => HistoryLesson[];
  removeLessonFromTrack: (lessonId: string) => HistoryLesson[];
  refreshLessons: () => void;
}
