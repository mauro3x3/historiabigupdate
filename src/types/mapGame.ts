import { Json } from "@/integrations/supabase/types";

export interface MapGame {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  created_by: string | null;
  is_public: boolean;
  play_count: number;
  slug: string;
}

export interface MapGameEntry {
  id: string;
  game_id: string;
  image_url: string;
  correct_year: number;
  hint: string | null;
  created_at: string;
}

export interface MapGameGuess {
  id: string;
  entry_id: string;
  user_id: string;
  guessed_year: number;
  score: number;
  created_at: string;
}

export interface GameScore {
  totalScore: number;
  totalGuesses: number;
  averageAccuracy: number;
}

// Utility functions for type assertion
export function asMapGame(data: any): MapGame {
  return data as MapGame;
}

export function asMapGameArray(data: any[]): MapGame[] {
  return data as MapGame[];
}

export function asMapGameEntry(data: any): MapGameEntry {
  return data as MapGameEntry;
}

export function asMapGameEntryArray(data: any[]): MapGameEntry[] {
  return data as MapGameEntry[];
}

export function asMapGameGuess(data: any): MapGameGuess {
  return data as MapGameGuess;
}

export function asMapGameGuessArray(data: any[]): MapGameGuess[] {
  return data as MapGameGuess[];
}
