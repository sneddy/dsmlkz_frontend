"use client"

import type React from "react"
import { createContext, useContext, useCallback, useMemo } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"

// Import types from separate module
import type { AuthContextType } from "@/features/auth/types"

// Import constants from separate module
import { DEBUG } from "@/features/auth/constants"

import { useSupabaseSession } from "@/features/auth/client/useSupabaseSession"

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

// Create the AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, user: sessionUser, initialized, loading: sessionLoading } = useSupabaseSession()

  const supabase = useMemo(() => getSupabaseClient(), [])

  // Sign in function
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        if (DEBUG) console.log("Signing in with email:", email)

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          console.error("Sign in error:", error)
          return { error }
        }

        if (DEBUG) console.log("Sign in successful")

        // Добавляем небольшую задержку и refresh для корректной инициализации ProfileProvider
        if (typeof window !== "undefined") {
          setTimeout(() => {
            if (DEBUG) console.log("Refreshing page after successful sign in")
            window.location.reload()
          }, 500) // 500ms задержка для стабилизации auth состояния
        }

        return { error: null }
      } catch (error) {
        console.error("Exception during sign in:", error)
        return { error }
      }
    },
    [supabase],
  )

  // Sign up function
  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          return { data, error }
        }

        if (DEBUG) console.log("Sign up successful")

        // Добавляем небольшую задержку и refresh для корректной инициализации ProfileProvider
        if (typeof window !== "undefined") {
          setTimeout(() => {
            if (DEBUG) console.log("Refreshing page after successful sign up")
            window.location.reload()
          }, 500) // 500ms задержка для стабилизации auth состояния
        }

        return { data, error: null }
      } catch (error) {
        console.error("Error signing up:", error)
        return { error, data: null }
      }
    },
    [supabase],
  )

  const signOut = useCallback(async () => {
    try {
      if (DEBUG) console.log("Starting sign out process")

      const logoutTimeout = setTimeout(() => {
        console.warn("Forced redirect fallback after logout timeout")
        if (typeof window !== "undefined") {
          window.location.replace("/")
        }
      }, 2000)

      if (DEBUG) console.log("Signing out from Supabase")
      const { error } = await supabase.auth.signOut()

      clearTimeout(logoutTimeout)

      if (error) {
        console.error("Error signing out from Supabase:", error)
        throw error
      }

      if (DEBUG) console.log("Successfully signed out from Supabase")

      if (typeof window !== "undefined") {
        try {
          if (DEBUG) console.log("Clearing auth-related storage")

          const allKeys = Object.keys(localStorage)
          const keysToRemove = allKeys.filter(
            (key) =>
              key.startsWith("sb-") || key.includes("supabase") || key.includes("auth") || key.startsWith("profile_"),
          )

          for (const key of keysToRemove) {
            localStorage.removeItem(key)
            if (DEBUG) console.log(`Removed localStorage key: ${key}`)
          }

          // Only clear specific auth-related keys to avoid side effects

          if (DEBUG) console.log("Auth-related storage cleared")
        } catch (e) {
          console.error("Error clearing storage:", e)
        }
      }

      // Reset Supabase client
      try {
        if (typeof window !== "undefined") {
          import("@/lib/supabase-client")
            .then(({ resetSupabaseClient }) => {
              if (typeof resetSupabaseClient === "function") {
                resetSupabaseClient()
                if (DEBUG) console.log("Supabase client reset successfully")
              }
            })
            .catch((e) => {
              console.error("Error importing resetSupabaseClient:", e)
            })
        }
      } catch (e) {
        console.error("Error resetting Supabase client:", e)
      }

      if (DEBUG) console.log("Redirecting to home page with replace")

      if (typeof window !== "undefined") {
        window.location.replace("/")
      }
    } catch (error) {
      console.error("Error during sign out process:", error)

      if (typeof window !== "undefined") {
        const allKeys = Object.keys(localStorage)
        const keysToRemove = allKeys.filter(
          (key) =>
            key.startsWith("sb-") || key.includes("supabase") || key.includes("auth") || key.startsWith("profile_"),
        )

        for (const key of keysToRemove) {
          localStorage.removeItem(key)
        }

        window.location.replace("/")
      }
    }
  }, [supabase])

  const contextValue = useMemo(
    () => ({
      user: sessionUser,
      session,
      loading: sessionLoading,
      initialized,
      signIn,
      signUp,
      signOut,
    }),
    [sessionUser, session, sessionLoading, initialized, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
