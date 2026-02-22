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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      avatars: {
        Row: {
          content_type: string
          created_at: string | null
          file_name: string
          file_size: number
          id: string
          is_current: boolean | null
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          content_type: string
          created_at?: string | null
          file_name: string
          file_size: number
          id?: string
          is_current?: boolean | null
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          content_type?: string
          created_at?: string | null
          file_name?: string
          file_size?: number
          id?: string
          is_current?: boolean | null
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avatars_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avatars_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      channels_content_legacy: {
        Row: {
          channel_id: number | null
          channel_name: string | null
          created_at: string | null
          html_text: string | null
          image_url: string | null
          inserted_at: string | null
          is_public: boolean | null
          message_id: number | null
          post_id: string
          post_link: string | null
          sender_id: number | null
          sender_name: string | null
        }
        Insert: {
          channel_id?: number | null
          channel_name?: string | null
          created_at?: string | null
          html_text?: string | null
          image_url?: string | null
          inserted_at?: string | null
          is_public?: boolean | null
          message_id?: number | null
          post_id?: string
          post_link?: string | null
          sender_id?: number | null
          sender_name?: string | null
        }
        Update: {
          channel_id?: number | null
          channel_name?: string | null
          created_at?: string | null
          html_text?: string | null
          image_url?: string | null
          inserted_at?: string | null
          is_public?: boolean | null
          message_id?: number | null
          post_id?: string
          post_link?: string | null
          sender_id?: number | null
          sender_name?: string | null
        }
        Relationships: []
      }
      cities_index: {
        Row: {
          city: string | null
          city_ascii: string | null
          city_ru: string | null
          country: string | null
          country_ru: string | null
          iso2: string | null
          iso3: string | null
          lat: number | null
          lng: number | null
          population: number | null
          priority: number
        }
        Insert: {
          city?: string | null
          city_ascii?: string | null
          city_ru?: string | null
          country?: string | null
          country_ru?: string | null
          iso2?: string | null
          iso3?: string | null
          lat?: number | null
          lng?: number | null
          population?: number | null
          priority: number
        }
        Update: {
          city?: string | null
          city_ascii?: string | null
          city_ru?: string | null
          country?: string | null
          country_ru?: string | null
          iso2?: string | null
          iso3?: string | null
          lat?: number | null
          lng?: number | null
          population?: number | null
          priority?: number
        }
        Relationships: []
      }
      community_faces: {
        Row: {
          description: string | null
          description_ru: string | null
          display_order: number | null
          id: number
          image_path: string | null
          kaggle: string | null
          linkedin: string | null
          location: string | null
          name: string
          profile_id: string | null
          telegram: string | null
          title: string | null
          title_ru: string | null
          user_id: number | null
          website: string | null
        }
        Insert: {
          description?: string | null
          description_ru?: string | null
          display_order?: number | null
          id?: never
          image_path?: string | null
          kaggle?: string | null
          linkedin?: string | null
          location?: string | null
          name: string
          profile_id?: string | null
          telegram?: string | null
          title?: string | null
          title_ru?: string | null
          user_id?: number | null
          website?: string | null
        }
        Update: {
          description?: string | null
          description_ru?: string | null
          display_order?: number | null
          id?: never
          image_path?: string | null
          kaggle?: string | null
          linkedin?: string | null
          location?: string | null
          name?: string
          profile_id?: string | null
          telegram?: string | null
          title?: string | null
          title_ru?: string | null
          user_id?: number | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_faces_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_faces_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_details_legacy: {
        Row: {
          company_description: string | null
          company_name: string | null
          contacts: Json | null
          created_at: string | null
          location: string | null
          position: string | null
          post_id: string
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
        }
        Insert: {
          company_description?: string | null
          company_name?: string | null
          contacts?: Json | null
          created_at?: string | null
          location?: string | null
          position?: string | null
          post_id?: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
        }
        Update: {
          company_description?: string | null
          company_name?: string | null
          contacts?: Json | null
          created_at?: string | null
          location?: string | null
          position?: string | null
          post_id?: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
        }
        Relationships: []
      }
      job_post_contacts: {
        Row: {
          contact_kind: string
          contact_value: string
          created_at: string
          id: number
          post_id: string
          sort_order: number
        }
        Insert: {
          contact_kind: string
          contact_value: string
          created_at?: string
          id?: never
          post_id: string
          sort_order?: number
        }
        Update: {
          contact_kind?: string
          contact_value?: string
          created_at?: string
          id?: never
          post_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_post_contacts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "job_details"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "job_post_contacts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["post_id"]
          },
        ]
      }
      job_posts: {
        Row: {
          company_description: string | null
          company_name: string | null
          created_at: string
          location: string | null
          position: string | null
          post_id: string
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
        }
        Insert: {
          company_description?: string | null
          company_name?: string | null
          created_at?: string
          location?: string | null
          position?: string | null
          post_id: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
        }
        Update: {
          company_description?: string | null
          company_name?: string | null
          created_at?: string
          location?: string | null
          position?: string | null
          post_id?: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "channels_content"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "job_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "telegram_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_telegram_links: {
        Row: {
          linked_at: string
          profile_id: string
          telegram_id: number
          telegram_login: string | null
          updated_at: string
        }
        Insert: {
          linked_at?: string
          profile_id: string
          telegram_id: number
          telegram_login?: string | null
          updated_at?: string
        }
        Update: {
          linked_at?: string
          profile_id?: string
          telegram_id?: number
          telegram_login?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_telegram_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_telegram_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_verifications: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          telegram_avatar_url: string | null
          telegram_id: number
          telegram_login: string | null
          updated_at: string
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          telegram_avatar_url?: string | null
          telegram_id: number
          telegram_login?: string | null
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          telegram_avatar_url?: string | null
          telegram_id?: number
          telegram_login?: string | null
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_verifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_verifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          about_you: string | null
          birthday: string | null
          created_at: string | null
          current_city: string | null
          first_name: string | null
          id: string
          last_name: string | null
          linkedin: string | null
          motivation: string | null
          nickname: string
          other_links: string | null
          relevant_company: string | null
          relevant_position: string | null
          secret_number: number | null
          university: string | null
          updated_at: string | null
        }
        Insert: {
          about_you?: string | null
          birthday?: string | null
          created_at?: string | null
          current_city?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          linkedin?: string | null
          motivation?: string | null
          nickname: string
          other_links?: string | null
          relevant_company?: string | null
          relevant_position?: string | null
          secret_number?: number | null
          university?: string | null
          updated_at?: string | null
        }
        Update: {
          about_you?: string | null
          birthday?: string | null
          created_at?: string | null
          current_city?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin?: string | null
          motivation?: string | null
          nickname?: string
          other_links?: string | null
          relevant_company?: string | null
          relevant_position?: string | null
          secret_number?: number | null
          university?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      schema_normalization_conflicts: {
        Row: {
          created_at: string
          entity_type: string
          id: number
          legacy_key: string
          payload: Json
          reason: string
        }
        Insert: {
          created_at?: string
          entity_type: string
          id?: never
          legacy_key: string
          payload: Json
          reason: string
        }
        Update: {
          created_at?: string
          entity_type?: string
          id?: never
          legacy_key?: string
          payload?: Json
          reason?: string
        }
        Relationships: []
      }
      telegram_channels: {
        Row: {
          created_at: string
          id: string
          is_public: boolean
          telegram_chat_id: number
          title: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_public?: boolean
          telegram_chat_id: number
          title?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_public?: boolean
          telegram_chat_id?: number
          title?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      telegram_links_legacy: {
        Row: {
          created_at: string | null
          decision_at: string | null
          decision_status: string | null
          id: number
          nickname: string
          telegram_account: string | null
          telegram_id: number
        }
        Insert: {
          created_at?: string | null
          decision_at?: string | null
          decision_status?: string | null
          id?: number
          nickname: string
          telegram_account?: string | null
          telegram_id: number
        }
        Update: {
          created_at?: string | null
          decision_at?: string | null
          decision_status?: string | null
          id?: number
          nickname?: string
          telegram_account?: string | null
          telegram_id?: number
        }
        Relationships: []
      }
      telegram_posts: {
        Row: {
          channel_id: string | null
          content_kind: string
          created_at: string | null
          html_text: string
          id: string
          image_url: string | null
          inserted_at: string
          message_id: number | null
          post_link: string | null
          sender_id: number | null
          sender_name: string | null
        }
        Insert: {
          channel_id?: string | null
          content_kind?: string
          created_at?: string | null
          html_text?: string
          id?: string
          image_url?: string | null
          inserted_at?: string
          message_id?: number | null
          post_link?: string | null
          sender_id?: number | null
          sender_name?: string | null
        }
        Update: {
          channel_id?: string | null
          content_kind?: string
          created_at?: string | null
          html_text?: string
          id?: string
          image_url?: string | null
          inserted_at?: string
          message_id?: number | null
          post_link?: string | null
          sender_id?: number | null
          sender_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telegram_posts_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "telegram_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      verified_profiles_legacy: {
        Row: {
          about_you: string | null
          avatar_url: string | null
          current_city: string | null
          first_name: string | null
          id: string
          inserted_at: string | null
          last_name: string | null
          linkedin: string | null
          motivation: string | null
          nickname: string
          other_links: string | null
          profile_id: string
          relevant_company: string | null
          relevant_position: string | null
          telegram_avatar_url: string | null
          telegram_id: number | null
          telegram_login: string | null
          university: string | null
        }
        Insert: {
          about_you?: string | null
          avatar_url?: string | null
          current_city?: string | null
          first_name?: string | null
          id?: string
          inserted_at?: string | null
          last_name?: string | null
          linkedin?: string | null
          motivation?: string | null
          nickname: string
          other_links?: string | null
          profile_id: string
          relevant_company?: string | null
          relevant_position?: string | null
          telegram_avatar_url?: string | null
          telegram_id?: number | null
          telegram_login?: string | null
          university?: string | null
        }
        Update: {
          about_you?: string | null
          avatar_url?: string | null
          current_city?: string | null
          first_name?: string | null
          id?: string
          inserted_at?: string | null
          last_name?: string | null
          linkedin?: string | null
          motivation?: string | null
          nickname?: string
          other_links?: string | null
          profile_id?: string
          relevant_company?: string | null
          relevant_position?: string | null
          telegram_avatar_url?: string | null
          telegram_id?: number | null
          telegram_login?: string | null
          university?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verified_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verified_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      channels_content: {
        Row: {
          channel_id: number | null
          channel_name: string | null
          created_at: string | null
          html_text: string | null
          image_url: string | null
          inserted_at: string | null
          is_public: boolean | null
          message_id: number | null
          post_id: string | null
          post_link: string | null
          sender_id: number | null
          sender_name: string | null
        }
        Relationships: []
      }
      job_details: {
        Row: {
          company_description: string | null
          company_name: string | null
          contacts: Json | null
          created_at: string | null
          location: string | null
          position: string | null
          post_id: string | null
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
        }
        Insert: {
          company_description?: string | null
          company_name?: string | null
          contacts?: never
          created_at?: never
          location?: string | null
          position?: string | null
          post_id?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
        }
        Update: {
          company_description?: string | null
          company_name?: string | null
          contacts?: never
          created_at?: never
          location?: string | null
          position?: string | null
          post_id?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "channels_content"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "job_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "telegram_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      public_profiles: {
        Row: {
          about_you: string | null
          avatar_url: string | null
          current_city: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          linkedin: string | null
          motivation: string | null
          nickname: string | null
          other_links: string | null
          relevant_company: string | null
          relevant_position: string | null
          university: string | null
        }
        Relationships: []
      }
      telegram_links: {
        Row: {
          created_at: string | null
          id: number | null
          nickname: string | null
          telegram_account: string | null
          telegram_id: number | null
        }
        Relationships: []
      }
      verified_profiles: {
        Row: {
          about_you: string | null
          avatar_url: string | null
          current_city: string | null
          first_name: string | null
          id: string | null
          inserted_at: string | null
          last_name: string | null
          linkedin: string | null
          motivation: string | null
          nickname: string | null
          other_links: string | null
          profile_id: string | null
          relevant_company: string | null
          relevant_position: string | null
          telegram_avatar_url: string | null
          telegram_id: number | null
          telegram_login: string | null
          university: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_verifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_verifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      direct_insert_profile: {
        Args: {
          p_about_you: string
          p_birthday: string
          p_current_city: string
          p_first_name: string
          p_id: string
          p_last_name: string
          p_linkedin: string
          p_motivation: string
          p_nickname: string
          p_other_links: string
          p_relevant_company: string
          p_relevant_position: string
          p_secret_number: number
          p_university: string
        }
        Returns: Json
      }
      direct_insert_profile_with_avatar_upload: {
        Args: {
          p_about_you: string
          p_avatar_content_type?: string
          p_avatar_file_name?: string
          p_avatar_file_size?: number
          p_avatar_url: string
          p_birthday: string
          p_current_city: string
          p_first_name: string
          p_id: string
          p_last_name: string
          p_linkedin: string
          p_motivation: string
          p_nickname: string
          p_other_links: string
          p_relevant_company: string
          p_relevant_position: string
          p_secret_number: number
          p_university: string
        }
        Returns: Json
      }
      get_current_avatar: {
        Args: { user_id: string }
        Returns: {
          created_at: string
          file_name: string
          id: string
          url: string
        }[]
      }
      manage_avatar_upload: {
        Args: {
          p_content_type: string
          p_file_name: string
          p_file_size: number
          p_url: string
          p_user_id: string
        }
        Returns: Json
      }
      set_current_avatar: { Args: { avatar_id: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      update_profile: {
        Args: { profile_data: Json; user_id: string }
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
