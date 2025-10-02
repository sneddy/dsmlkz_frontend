import type React from "react"
import { ProfileProvider } from "@/features/profile/client/ProfileProvider"
import { SupabaseProvider } from "@/contexts/supabase-context"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <LanguageProvider>
          <ProfileProvider>{children}</ProfileProvider>
        </LanguageProvider>
      </AuthProvider>
    </SupabaseProvider>
  )
}
