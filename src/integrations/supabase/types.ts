export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
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
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "badge_id_badge_id_fk"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badge"
            referencedColumns: ["id"]
          },
        ]
      },
      badges: {
        id: number,
        created_at: string | null,
        name: string | null,
        description: string | null,
        icon: string | null,
        requiredment_field: string,
        requirement_value: string,
        badge_id: number
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
