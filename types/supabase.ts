export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nickname: string
          first_name: string
          last_name: string
          email: string
          birthday: string | null
          current_city: string | null
          university: string | null
          relevant_company: string | null
          relevant_position: string | null
          about_you: string | null
          motivation: string | null
          linkedin: string | null
          other_links: string | null
          verification_code: string | null
          secret_number: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nickname: string
          first_name: string
          last_name: string
          email: string
          birthday?: string | null
          current_city?: string | null
          university?: string | null
          relevant_company?: string | null
          relevant_position?: string | null
          about_you?: string | null
          motivation?: string | null
          linkedin?: string | null
          other_links?: string | null
          verification_code?: string | null
          secret_number?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nickname?: string
          first_name?: string
          last_name?: string
          email?: string
          birthday?: string | null
          current_city?: string | null
          university?: string | null
          relevant_company?: string | null
          relevant_position?: string | null
          about_you?: string | null
          motivation?: string | null
          linkedin?: string | null
          other_links?: string | null
          verification_code?: string | null
          secret_number?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      channels_content: {
        Row: {
          post_id: string
          channel_id: number
          channel_name: string | null
          message_id: number | null
          image_url: string | null
          created_at: string | null
          html_text: string | null
          post_link: string | null
          is_public: boolean | null
          sender_id: number | null
          sender_name: string | null
          inserted_at: string | null
        }
        Insert: {
          post_id?: string
          channel_id: number
          channel_name?: string | null
          message_id?: number | null
          image_url?: string | null
          created_at?: string | null
          html_text?: string | null
          post_link?: string | null
          is_public?: boolean | null
          sender_id?: number | null
          sender_name?: string | null
          inserted_at?: string | null
        }
        Update: {
          post_id?: string
          channel_id?: number
          channel_name?: string | null
          message_id?: number | null
          image_url?: string | null
          created_at?: string | null
          html_text?: string | null
          post_link?: string | null
          is_public?: boolean | null
          sender_id?: number | null
          sender_name?: string | null
          inserted_at?: string | null
        }
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
