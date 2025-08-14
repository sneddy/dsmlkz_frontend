"use client"

import { useContext } from "react"
import { AuthContext } from "@/contexts/auth-context"

// Safe version of useAuth that doesn't throw when provider is missing
export function useSafeAuth() {
  const context = useContext(AuthContext)
  return (
    context || {
      user: null,
      profile: null,
      loading: false,
      initialized: true,
      signOut: () => Promise.resolve(),
    }
  )
}
