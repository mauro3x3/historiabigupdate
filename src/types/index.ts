// User related types
export type LearningStyle = 'reading' | 'visual' | 'daily' | 'mystery' | 'journey';
export type LearningTime = '5-min' | '15-min' | '30-min' | '60-min' | '10-min';
export type ReminderMethod = 'email' | 'push' | 'none';
export type HistoryInterest = 
  | 'ancient-history' 
  | 'biographies' 
  | 'military-history' 
  | 'cultural-history' 
  | 'political-history'
  | 'religious-history'
  | 'world-map-history';

export type HistoryEra = 
  | 'ancient-egypt' 
  | 'islamic-history' 
  | 'jewish-history' 
  | 'chinese-history' 
  | 'christian-history' 
  | 'russian-history'
  | 'jewish'
  | 'islamic'
  | 'christian'
  | 'rome-greece'
  | 'medieval'
  | 'modern'
  | 'revolutions'
  | 'china'
  | 'russian';

export interface UserPreferences {
  interests: HistoryInterest[];
  era: HistoryEra;
  learningStyle: LearningStyle;
  dailyLearningTime: LearningTime;
  reminderMethod: ReminderMethod;
  reminderTime: string | null;
}

// History content types
export interface HistoryLesson {
  id: string;
  title: string;
  description: string;
  content: string;
  era: HistoryEra | string;
  xp_reward: number;
  duration: number;
  level?: number;
  position?: number;
  progress?: LessonProgress;
  lesson_type?: string;
  content_type?: string; // Added for compatibility with LevelProgress
  story_content?: string;
  image_urls?: string;
  is_journey_content?: boolean;
  transition_question?: string;
  prompt?: string;
  character?: string;
  journey_id?: number;
  isUnlocked?: boolean;
}

export interface LessonProgress {
  completed: boolean;
  stars: number;
  xp_earned: number;
  timestamp?: string;
}

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  answer?: string;
  explanation?: string;
  lesson_id?: string;
}

export interface HistoryEvent {
  id: string;
  title: string;
  year: string | number;
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  significance: string;
  imageUrl?: string;
}

export interface HistoricalEvent {
  id: string;
  description: string;
  year: number;
  explanation: string;
}

export interface DailyChallenge {
  id: string;
  challenge_date: string;
  topic: string;
  question?: string;
  options?: string[] | any; // Making this more flexible
  correct_answer?: number;
  explanation?: string;
  xp_reward: number;
  events?: HistoricalEvent[];
  created_at?: string;
}

export interface HistoryScenario {
  id: string;
  title: string;
  description: string;
  character: string;
  era: HistoryEra | string;
  setting: string;
  situation: string;
  choices: ScenarioChoice[];
}

export interface ScenarioChoice {
  id: string;
  text: string;
  consequence: string;
  xp: number;
}

export interface LearningTrackLevel {
  id?: string;
  level: number;
  title: string;
  description: string;
  isUnlocked: boolean;
  lessons: HistoryLesson[];
}

// Video interfaces
export interface HistoryVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  era: HistoryEra | string;
  category: string;
  uploadDate: string;
  views?: number;
  isWatched?: boolean;
  uploaderId?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

export interface VideoCategory {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
}

// Video upload interfaces
export interface VideoUpload {
  id: string;
  title: string;
  description: string;
  category: string;
  era: HistoryEra | string;
  file: File;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
  thumbnail?: File;
}
