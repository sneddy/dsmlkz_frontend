import type { User, Session } from "@supabase/supabase-js"

export type Profile = {
  id: string
  nickname: string
  first_name: string
  last_name: string
  current_city?: string
  university?: string
  relevant_company?: string
  relevant_position?: string
  about_you?: string
  motivation?: string
  linkedin?: string
  other_links?: string
  avatar_url?: string
}

export type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
}
