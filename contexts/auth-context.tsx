"use client"

import type React from "react"
import { createContext, useContext, useCallback, useMemo, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { createLogger } from "@/lib/logger"
import { trackGaEvent, trackGaUser } from "@/shared/providers/analytics"

// Import types from separate module
import type { AuthContextType } from "@/features/auth/types"

// Import session hook
import { useSupabaseSession } from "@/features/auth/client/useSupabaseSession"

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

// Create the AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { session, user: sessionUser, initialized, loading: sessionLoading } = useSupabaseSession()

  const supabase = useMemo(() => getSupabaseClient(), [])
  const signOutInFlightRef = useRef(false)
  const logger = useMemo(() => createLogger("auth"), [])

  const isAuthSessionMissingError = (error: any) => {
    return typeof error?.message === "string" && error.message.toLowerCase().includes("auth session missing")
  }

  useEffect(() => {
    if (sessionUser?.id) {
      trackGaUser(sessionUser.id)
    }
  }, [sessionUser?.id])

  const clearAuthCookies = useCallback(() => {
    if (typeof document === "undefined") return
    const cookies = document.cookie.split(";")
    cookies.forEach((cookie) => {
      const [rawName] = cookie.split("=")
      const name = rawName?.trim()
      if (name && (name.startsWith("sb-") || name.includes("supabase") || name.includes("auth"))) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
      }
    })
  }, [])

  // Sign in function
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          logger.error("Sign in error", error)
          return { error }
        }

        // Validate session against auth server to avoid stale cookie issues
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData?.user) {
          logger.error("Auth server validation failed", userError)
          return { error: userError || new Error("Failed to validate session") }
        }

        logger.info("Sign in successful", { email })

        // Ensure session is hydrated and server components pick it up
        await supabase.auth.getSession()
        // Give the auth helper a brief moment to sync cookies before protected fetches
        await new Promise((resolve) => setTimeout(resolve, 150))
        trackGaUser(userData.user.id)
        trackGaEvent("login", { method: "password", user_id: userData.user.id })
        router.refresh()

        return { error: null, user: userData.user }
      } catch (error) {
        logger.error("Exception during sign in", error)
        return { error, user: null }
      }
    },
    [supabase, logger, router],
  )

  // Sign up function
  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (data?.user?.id) {
          trackGaUser(data.user.id)
          trackGaEvent("sign_up", { method: "password", user_id: data.user.id })
        }

        return { data, error }
      } catch (error) {
        logger.error("Error signing up", error)
        return { error, data: null }
      }
    },
    [supabase],
  )

  const signOut = useCallback(async () => {
    if (signOutInFlightRef.current) return
    signOutInFlightRef.current = true
    try {
      // If there's no active session, skip network call to avoid noisy AuthSessionMissingError
      if (!session) {
        logger.info("No active session; performing local sign out cleanup only")
      } else {
        const { error } = await supabase.auth.signOut()

        if (error && !isAuthSessionMissingError(error)) {
          logger.error("Error signing out from Supabase", error)
          throw error
        }

        if (error && isAuthSessionMissingError(error)) {
          logger.info("Sign out attempted without active session; continuing cleanup")
        }
      }

      logger.info("Successfully signed out from Supabase")
    } catch (error) {
      logger.error("Error during sign out process", error)
    } finally {
      if (typeof window !== "undefined") {
        const allKeys = Object.keys(localStorage)
        const keysToRemove = allKeys.filter(
          (key) =>
            key.startsWith("sb-") || key.includes("supabase") || key.includes("auth") || key.startsWith("profile_"),
        )

        for (const key of keysToRemove) {
          localStorage.removeItem(key)
        }

        clearAuthCookies()

        import("@/lib/supabase-client")
          .then(({ resetSupabaseClient }) => {
            if (typeof resetSupabaseClient === "function") {
              resetSupabaseClient()
              logger.info("Supabase client reset after sign out")
            }
          })
          .catch((e) => {
            logger.error("Error importing resetSupabaseClient", e)
          })
          .finally(() => {
            window.location.replace("/")
          })
      }
      signOutInFlightRef.current = false
    }
  }, [clearAuthCookies, supabase])

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
