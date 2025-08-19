"use client"

import { useContext } from "react"
import { AuthContext } from "@/contexts/auth-context"

export function useSafeAuth() {
  const context = useContext(AuthContext)
  try {
    if (!context) {
      // Return safe fallback values when AuthProvider is not available
      return {
        user: null,
        session: null,
        profile: null,
        loading: true,
        profileError: null,
        loadingProfile: false,
        signIn: async () => ({ data: null, error: new Error("Auth not available") }),
        signOut: async () => {},
        updateProfile: async () => ({ data: null, error: new Error("Auth not available") }),
        refreshProfile: async () => {},
      }
    }
    return context
  } catch (error) {
    // Return safe fallback values on any error
    return {
      user: null,
      session: null,
      profile: null,
      loading: true,
      profileError: null,
      loadingProfile: false,
      signIn: async () => ({ data: null, error: new Error("Auth not available") }),
      signOut: async () => {},
      updateProfile: async () => ({ data: null, error: new Error("Auth not available") }),
      refreshProfile: async () => {},
    }
  }
}
