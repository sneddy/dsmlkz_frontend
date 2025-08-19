import type React from "react"
import { ProfileProvider } from "@/features/profile/client/ProfileProvider"
import { SupabaseProvider } from "@/contexts/supabase-context"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SupabaseProvider>
      <ProfileProvider>{children}</ProfileProvider>
    </SupabaseProvider>
  )
}
