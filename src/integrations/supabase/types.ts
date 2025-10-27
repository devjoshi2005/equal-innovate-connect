export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      collaboration_projects: {
        Row: {
          created_by: string | null
          description: string | null
          impact_metrics: Json | null
          project_id: string
          sdg_alignment: Json | null
          team_members: Json | null
          title: string
        }
        Insert: {
          created_by?: string | null
          description?: string | null
          impact_metrics?: Json | null
          project_id?: string
          sdg_alignment?: Json | null
          team_members?: Json | null
          title: string
        }
        Update: {
          created_by?: string | null
          description?: string | null
          impact_metrics?: Json | null
          project_id?: string
          sdg_alignment?: Json | null
          team_members?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_challenges: {
        Row: {
          challenge_id: string
          created_at: string | null
          description: string | null
          participating_organizations: Json | null
          sdg_targets: Json | null
          submission_deadline: string | null
          title: string
        }
        Insert: {
          challenge_id?: string
          created_at?: string | null
          description?: string | null
          participating_organizations?: Json | null
          sdg_targets?: Json | null
          submission_deadline?: string | null
          title: string
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          description?: string | null
          participating_organizations?: Json | null
          sdg_targets?: Json | null
          submission_deadline?: string | null
          title?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          content: string
          created_at: string
          post_id: string
          sdg_badges: Json | null
          skills_criteria: Json | null
          title: string
          updated_at: string
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          post_id?: string
          sdg_badges?: Json | null
          skills_criteria?: Json | null
          title: string
          updated_at?: string
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          post_id?: string
          sdg_badges?: Json | null
          skills_criteria?: Json | null
          title?: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      mentorship_connections: {
        Row: {
          connection_id: string
          last_interaction: string | null
          mentee_id: string | null
          mentor_id: string | null
          sdg_impact_score: number | null
          status: string | null
        }
        Insert: {
          connection_id?: string
          last_interaction?: string | null
          mentee_id?: string | null
          mentor_id?: string | null
          sdg_impact_score?: number | null
          status?: string | null
        }
        Update: {
          connection_id?: string
          last_interaction?: string | null
          mentee_id?: string | null
          mentor_id?: string | null
          sdg_impact_score?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_connections_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mentorship_connections_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      post_comments: {
        Row: {
          comment_id: string
          content: string
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          comment_id?: string
          content: string
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          comment_id?: string
          content?: string
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["post_id"]
          },
        ]
      }
      resources: {
        Row: {
          accessibility: Json | null
          added_by: string | null
          location: string | null
          resource_id: string
          sdg_relevance: Json | null
          title: string
          type: Database["public"]["Enums"]["resource_type"]
        }
        Insert: {
          accessibility?: Json | null
          added_by?: string | null
          location?: string | null
          resource_id?: string
          sdg_relevance?: Json | null
          title: string
          type: Database["public"]["Enums"]["resource_type"]
        }
        Update: {
          accessibility?: Json | null
          added_by?: string | null
          location?: string | null
          resource_id?: string
          sdg_relevance?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["resource_type"]
        }
        Relationships: [
          {
            foreignKeyName: "resources_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          gender_identity: string | null
          location: string | null
          sdg_focus_areas: Json | null
          skills: Json | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          gender_identity?: string | null
          location?: string | null
          sdg_focus_areas?: Json | null
          skills?: Json | null
          user_id?: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          gender_identity?: string | null
          location?: string | null
          sdg_focus_areas?: Json | null
          skills?: Json | null
          user_id?: string
          username?: string
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
      resource_type: "grant" | "training" | "equipment"
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
    Enums: {
      resource_type: ["grant", "training", "equipment"],
    },
  },
} as const
