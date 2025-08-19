import type React from "react"
import { ProfileProvider } from "@/features/profile/client/ProfileProvider"
import { SupabaseProvider } from "@/contexts/supabase-context"
import { AuthProvider } from "@/contexts/auth-context"
import { ClientLanguageProvider } from "@/contexts/client-language-provider"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <ClientLanguageProvider>
          <ProfileProvider>{children}</ProfileProvider>
        </ClientLanguageProvider>
      </AuthProvider>
    </SupabaseProvider>
  )
}
