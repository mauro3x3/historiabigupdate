export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      daily_challenges: {
        Row: {
          challenge_date: string
          correct_answer: number
          created_at: string
          explanation: string
          id: string
          options: Json
          question: string
          topic: string
          xp_reward: number
        }
        Insert: {
          challenge_date: string
          correct_answer: number
          created_at?: string
          explanation: string
          id?: string
          options: Json
          question: string
          topic: string
          xp_reward?: number
        }
        Update: {
          challenge_date?: string
          correct_answer?: number
          created_at?: string
          explanation?: string
          id?: string
          options?: Json
          question?: string
          topic?: string
          xp_reward?: number
        }
        Relationships: []
      }
      history_eras: {
        Row: {
          code: string
          created_at: string | null
          emoji: string | null
          id: number
          is_enabled: boolean | null
          name: string
          time_period: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          emoji?: string | null
          id?: number
          is_enabled?: boolean | null
          name: string
          time_period?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          emoji?: string | null
          id?: number
          is_enabled?: boolean | null
          name?: string
          time_period?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      learning_tracks: {
        Row: {
          era: string
          id: number
          level_one_name: string
          level_three_name: string
          level_two_name: string
          levels: Json | null
          updated_at: string | null
        }
        Insert: {
          era: string
          id?: number
          level_one_name?: string
          level_three_name?: string
          level_two_name?: string
          levels?: Json | null
          updated_at?: string | null
        }
        Update: {
          era?: string
          id?: number
          level_one_name?: string
          level_three_name?: string
          level_two_name?: string
          levels?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lesson_questions: {
        Row: {
          correct_answer: number
          created_at: string
          explanation: string | null
          id: string
          lesson_id: string
          options: Json
          question: string
        }
        Insert: {
          correct_answer: number
          created_at?: string
          explanation?: string | null
          id?: string
          lesson_id: string
          options: Json
          question: string
        }
        Update: {
          correct_answer?: number
          created_at?: string
          explanation?: string | null
          id?: string
          lesson_id?: string
          options?: Json
          question?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          character: string | null
          content: string | null
          created_at: string
          description: string | null
          duration: number | null
          era: string | null
          id: number
          image_urls: string | null
          is_journey_content: boolean | null
          lesson_type: string | null
          level: number | null
          position: number | null
          prompt: string | null
          story_content: string | null
          title: string | null
          transition_question: string | null
          xp_reward: number | null
        }
        Insert: {
          character?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          era?: string | null
          id?: number
          image_urls?: string | null
          is_journey_content?: boolean | null
          lesson_type?: string | null
          level?: number | null
          position?: number | null
          prompt?: string | null
          story_content?: string | null
          title?: string | null
          transition_question?: string | null
          xp_reward?: number | null
        }
        Update: {
          character?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          era?: string | null
          id?: number
          image_urls?: string | null
          is_journey_content?: boolean | null
          lesson_type?: string | null
          level?: number | null
          position?: number | null
          prompt?: string | null
          story_content?: string | null
          title?: string | null
          transition_question?: string | null
          xp_reward?: number | null
        }
        Relationships: []
      }
      map_game_entries: {
        Row: {
          correct_year: number
          created_at: string
          game_id: string
          hint: string | null
          id: string
          image_url: string
        }
        Insert: {
          correct_year: number
          created_at?: string
          game_id: string
          hint?: string | null
          id?: string
          image_url: string
        }
        Update: {
          correct_year?: number
          created_at?: string
          game_id?: string
          hint?: string | null
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "map_game_entries_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "map_games"
            referencedColumns: ["id"]
          },
        ]
      }
      map_game_guesses: {
        Row: {
          created_at: string
          entry_id: string
          guessed_year: number
          id: string
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_id: string
          guessed_year: number
          id?: string
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          entry_id?: string
          guessed_year?: number
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "map_game_guesses_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "map_game_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      map_games: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          title?: string
        }
        Relationships: []
      }
      module_content: {
        Row: {
          created_at: string
          game_data: Json | null
          id: number
          image_urls: string[] | null
          module_id: number
          story_text: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          game_data?: Json | null
          id?: number
          image_urls?: string[] | null
          module_id: number
          story_text?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          game_data?: Json | null
          id?: number
          image_urls?: string[] | null
          module_id?: number
          story_text?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_content_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          content_type: string
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          is_journey_module: boolean
          journey_id: number
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          content_type?: string
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          is_journey_module?: boolean
          journey_id: number
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          is_journey_module?: boolean
          journey_id?: number
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "learning_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          anime_genres: string[] | null
          avatar_url: string | null
          bio: string | null
          cosplay: boolean | null
          cosplay_characters: string[] | null
          created_at: string | null
          id: string
          interests: string[] | null
          looking_for: string[] | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          anime_genres?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          cosplay?: boolean | null
          cosplay_characters?: string[] | null
          created_at?: string | null
          id: string
          interests?: string[] | null
          looking_for?: string[] | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          anime_genres?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          cosplay?: boolean | null
          cosplay_characters?: string[] | null
          created_at?: string | null
          id?: string
          interests?: string[] | null
          looking_for?: string[] | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: number
          created_at: string
          explanation: string | null
          id: string
          module_id: number
          options: Json
          question: string
        }
        Insert: {
          correct_answer: number
          created_at?: string
          explanation?: string | null
          id?: string
          module_id: number
          options: Json
          question: string
        }
        Update: {
          correct_answer?: number
          created_at?: string
          explanation?: string | null
          id?: string
          module_id?: number
          options?: Json
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          completed: boolean
          correct: boolean
          created_at: string
          id: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          challenge_id: string
          completed?: boolean
          correct?: boolean
          created_at?: string
          id?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          challenge_id?: string
          completed?: boolean
          correct?: boolean
          created_at?: string
          id?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          lesson_id: string
          stars: number
          updated_at: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          lesson_id: string
          stars?: number
          updated_at?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          lesson_id?: string
          stars?: number
          updated_at?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          completed_eras: string[] | null
          created_at: string
          email: string | null
          id: string
          last_login: string | null
          preferred_era: string | null
          streak: number
          updated_at: string
          username: string | null
          xp: number
          avatar_base?: string | null
          avatar_accessories?: any | null
        }
        Insert: {
          completed_eras?: string[] | null
          created_at?: string
          email?: string | null
          id: string
          last_login?: string | null
          preferred_era?: string | null
          streak?: number
          updated_at?: string
          username?: string | null
          xp?: number
          avatar_base?: string | null
          avatar_accessories?: any | null
        }
        Update: {
          completed_eras?: string[] | null
          created_at?: string
          email?: string | null
          id?: string
          last_login?: string | null
          preferred_era?: string | null
          streak?: number
          updated_at?: string
          username?: string | null
          xp?: number
          avatar_base?: string | null
          avatar_accessories?: any | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string | null
          description: string | null
          duration: number | null
          era: string | null
          id: string
          thumbnail: string | null
          title: string
          upload_date: string | null
          uploader_id: string | null
          video_url: string
          views: number | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          duration?: number | null
          era?: string | null
          id?: string
          thumbnail?: string | null
          title: string
          upload_date?: string | null
          uploader_id?: string | null
          video_url: string
          views?: number | null
        }
        Update: {
          category?: string | null
          description?: string | null
          duration?: number | null
          era?: string | null
          id?: string
          thumbnail?: string | null
          title?: string
          upload_date?: string | null
          uploader_id?: string | null
          video_url?: string
          views?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
