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
      books: {
        Row: {
          created_at: string | null
          description: string
          id: string
          mission_type: string | null
          name: string
          points: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          mission_type?: string | null
          name: string
          points: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          mission_type?: string | null
          name?: string
          points?: number
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string | null
          description: string
          id: string
          mission_type: string | null
          name: string
          points: number
          school: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          mission_type?: string | null
          name: string
          points: number
          school?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          mission_type?: string | null
          name?: string
          points?: number
          school?: string | null
        }
        Relationships: []
      }
      missions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          mission_type: string | null
          name: string
          period: string | null
          points: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          mission_type?: string | null
          name: string
          period?: string | null
          points: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          mission_type?: string | null
          name?: string
          period?: string | null
          points?: number
        }
        Relationships: []
      }
      missions_completed: {
        Row: {
          completed_at: string
          id: string
          mission_id: string
          mission_name: string
          mission_type: string
          period: string | null
          points: number
          school: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          mission_id: string
          mission_name: string
          mission_type: string
          period?: string | null
          points?: number
          school?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          mission_id?: string
          mission_name?: string
          mission_type?: string
          period?: string | null
          points?: number
          school?: string | null
          user_id?: string
        }
        Relationships: []
      }
      phase_changes: {
        Row: {
          changed_at: string | null
          id: string
          new_phase: string
          phase_icon: string | null
          previous_phase: string
          total_points: number
          user_id: string
        }
        Insert: {
          changed_at?: string | null
          id?: string
          new_phase: string
          phase_icon?: string | null
          previous_phase: string
          total_points: number
          user_id: string
        }
        Update: {
          changed_at?: string | null
          id?: string
          new_phase?: string
          phase_icon?: string | null
          previous_phase?: string
          total_points?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_date: string | null
          consecutive_days: number | null
          created_at: string | null
          email: string
          gender: string | null
          id: string
          is_admin: boolean | null
          name: string
          participates_flow_up: boolean | null
          participates_irmandade: boolean | null
          pgm_number: string | null
          pgm_role: string | null
          phase: string | null
          points: number | null
          profile_photo_url: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          birth_date?: string | null
          consecutive_days?: number | null
          created_at?: string | null
          email: string
          gender?: string | null
          id: string
          is_admin?: boolean | null
          name: string
          participates_flow_up?: boolean | null
          participates_irmandade?: boolean | null
          pgm_number?: string | null
          pgm_role?: string | null
          phase?: string | null
          points?: number | null
          profile_photo_url?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          birth_date?: string | null
          consecutive_days?: number | null
          created_at?: string | null
          email?: string
          gender?: string | null
          id?: string
          is_admin?: boolean | null
          name?: string
          participates_flow_up?: boolean | null
          participates_irmandade?: boolean | null
          pgm_number?: string | null
          pgm_role?: string | null
          phase?: string | null
          points?: number | null
          profile_photo_url?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_icon: string | null
          badge_name: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_icon?: string | null
          badge_name: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_icon?: string | null
          badge_name?: string
          earned_at?: string | null
          id?: string
          user_id?: string
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
