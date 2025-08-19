"use client"

import type React from "react"

import { SupabaseProvider } from "@/contexts/supabase-context"
import { AuthProvider } from "@/contexts/auth-context"
import { ClientLanguageProvider } from "@/contexts/client-language-provider"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <ClientLanguageProvider>{children}</ClientLanguageProvider>
      </AuthProvider>
    </SupabaseProvider>
  )
}
