"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"

// Import types from separate module
import type { Profile, AuthContextType } from "@/features/auth/types"

// Import constants from separate module
import { PROFILE_UPDATE_DELAY, DEBUG } from "@/features/auth/constants"

// Import utility for creating fallback profile
import { createFallbackProfile } from "@/features/auth/utils/createFallbackProfile"

// Import functions for working with localStorage
import {
  readProfileCache,
  writeProfileCache,
  clearProfileCache,
  mergeProfileCache,
} from "@/features/profile/client/profileStorage"

import { fetchProfileOnce } from "@/features/profile/client/fetchProfile"
import { useSupabaseSession } from "@/features/auth/client/useSupabaseSession"

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create the AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, user: sessionUser, initialized, loading: sessionLoading } = useSupabaseSession()

  // Profile-specific state
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileError, setProfileError] = useState<Error | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const supabase = useMemo(() => getSupabaseClient(), [])

  const fetchingProfileRef = useRef<Map<string, Promise<void>>>(new Map())
  const isSigningOutRef = useRef(false)
  const currentUserEmailRef = useRef<string | null>(null)

  const fetchProfile = useCallback(
    async (userId: string, userEmail?: string) => {
      if (isSigningOutRef.current) {
        if (DEBUG) console.log("Skipping fetchProfile: signing out in progress")
        return
      }

      if (!userId) {
        if (DEBUG) console.log("Skipping fetchProfile: no user ID provided")
        return
      }

      if (fetchingProfileRef.current.has(userId)) {
        if (DEBUG) console.log("Profile fetch already in progress for user:", userId)
        return fetchingProfileRef.current.get(userId)
      }

      const fetchPromise = (async () => {
        try {
          setProfileError(null)
          setLoadingProfile(true)

          if (userEmail) {
            currentUserEmailRef.current = userEmail
          }

          if (DEBUG) console.log("Fetching profile for user:", userId)

          // Check cache first
          const cachedProfile = readProfileCache(userId)
          if (cachedProfile && DEBUG) {
            console.log("Found profile in cache:", cachedProfile)
          }

          const fetchedProfile = await fetchProfileOnce(userId)

          // Determine final profile
          let finalProfile: Profile | null = null

          if (fetchedProfile) {
            if (DEBUG) console.log("Using fetched profile")
            finalProfile = fetchedProfile
            writeProfileCache(userId, fetchedProfile)
          } else if (cachedProfile) {
            if (DEBUG) console.log("Using cached profile")
            finalProfile = cachedProfile
          } else {
            if (DEBUG) console.log("Creating fallback profile")
            const emailForFallback = userEmail || currentUserEmailRef.current || `${userId}@fallback.com`
            finalProfile = createFallbackProfile(userId, emailForFallback)
          }

          if (DEBUG) console.log("Final profile:", finalProfile)
          setProfile(finalProfile)

          if (!finalProfile) {
            throw new Error("Could not retrieve or create profile")
          }
        } catch (error) {
          console.error("Error in fetchProfile:", error)

          if (!profile) {
            try {
              const emailForFallback = userEmail || currentUserEmailRef.current || `${userId}@fallback.com`
              const fallbackProfile = createFallbackProfile(userId, emailForFallback)
              if (DEBUG) console.log("Setting fallback profile:", fallbackProfile)
              setProfile(fallbackProfile)
            } catch (fallbackError) {
              console.error("Error creating fallback profile:", fallbackError)
              setProfileError(error instanceof Error ? error : new Error(String(error)))
            }
          } else {
            setProfileError(error instanceof Error ? error : new Error(String(error)))
          }
        } finally {
          setLoadingProfile(false)
          fetchingProfileRef.current.delete(userId)
        }
      })()

      fetchingProfileRef.current.set(userId, fetchPromise)
      return fetchPromise
    },
    [supabase, profile],
  )

  useEffect(() => {
    if (sessionUser) {
      if (sessionUser.email) {
        currentUserEmailRef.current = sessionUser.email
      }
      fetchProfile(sessionUser.id, sessionUser.email)
    } else {
      setProfile(null)
      currentUserEmailRef.current = null
    }
  }, [sessionUser, fetchProfile])

  // Function to refresh the profile
  const refreshProfile = useCallback(async () => {
    if (sessionUser) {
      // Clear any in-flight requests
      fetchingProfileRef.current.delete(sessionUser.id)
      await fetchProfile(sessionUser.id, sessionUser.email)
    }
  }, [sessionUser, fetchProfile])

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
        currentUserEmailRef.current = email

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

        if (!error) {
          currentUserEmailRef.current = email
        }

        return { data, error }
      } catch (error) {
        console.error("Error signing up:", error)
        return { error, data: null }
      }
    },
    [supabase],
  )

  const signOut = useCallback(async () => {
    try {
      if (isSigningOutRef.current) {
        if (DEBUG) console.log("Sign out already in progress, skipping")
        return
      }

      isSigningOutRef.current = true

      if (DEBUG) console.log("Starting sign out process")

      // Clear local state early
      setProfile(null)
      currentUserEmailRef.current = null

      // Clear in-flight requests
      fetchingProfileRef.current.clear()

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

      if (sessionUser?.id) {
        clearProfileCache(sessionUser.id)
      }

      // Clear storage
      if (typeof window !== "undefined") {
        try {
          if (DEBUG) console.log("Clearing all storage")

          const allKeys = Object.keys(localStorage)
          const keysToRemove = allKeys.filter(
            (key) =>
              key.startsWith("sb-") || key.includes("supabase") || key.includes("auth") || key.startsWith("profile_"),
          )

          for (const key of keysToRemove) {
            localStorage.removeItem(key)
            if (DEBUG) console.log(`Removed localStorage key: ${key}`)
          }

          localStorage.clear()
          sessionStorage.clear()

          if (DEBUG) console.log("All storage cleared")
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
      isSigningOutRef.current = false

      if (typeof window !== "undefined") {
        localStorage.clear()
        sessionStorage.clear()
        window.location.replace("/")
      }
    }
  }, [supabase, sessionUser])

  // Update profile function
  const updateProfile = useCallback(
    async (profileData: Partial<Profile>) => {
      if (!sessionUser) {
        return { error: new Error("User not authenticated") }
      }

      try {
        if (DEBUG) console.log("Updating profile with data:", profileData)

        const dataWithTimestamp = {
          ...profileData,
          updated_at: new Date().toISOString(),
        }

        const { email, avatar_url, secret_number, ...dataToUpdate } = dataWithTimestamp as any

        if (secret_number !== undefined) {
          dataToUpdate.secret_number = secret_number
        }

        try {
          const response = await fetch("/api/profile/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...dataToUpdate,
              id: sessionUser.id,
            }),
            cache: "no-cache",
            credentials: "same-origin",
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }))
            console.error("Profile update API error:", errorData)
            return { error: new Error(errorData.error || "Failed to update profile") }
          }

          if (DEBUG) console.log("Profile updated successfully via API route")
        } catch (apiError) {
          console.error("Error calling profile update API:", apiError)
          return { error: apiError }
        }

        mergeProfileCache(sessionUser.id, dataToUpdate)
        if (DEBUG) console.log("Updated profile in localStorage")

        if (DEBUG) console.log(`Waiting ${PROFILE_UPDATE_DELAY}ms before refreshing profile`)
        await new Promise((resolve) => setTimeout(resolve, PROFILE_UPDATE_DELAY))

        await fetchProfile(sessionUser.id, sessionUser.email)

        return { error: null }
      } catch (error) {
        console.error("Error updating profile:", error)
        return { error }
      }
    },
    [fetchProfile, sessionUser],
  )

  useEffect(() => {
    if (DEBUG) {
      console.log("Auth state updated:", {
        user: sessionUser?.id,
        profile: profile?.id,
        loading: sessionLoading,
        loadingProfile,
        initialized,
        session: session?.user?.id,
        profileError: profileError?.message,
      })
    }
  }, [sessionUser, profile, sessionLoading, loadingProfile, initialized, session, profileError])

  const contextValue = useMemo(
    () => ({
      user: sessionUser,
      profile,
      profileError,
      session,
      loading: sessionLoading,
      loadingProfile,
      initialized,
      signIn,
      signUp,
      signOut,
      updateProfile,
      refreshProfile,
    }),
    [
      sessionUser,
      profile,
      profileError,
      session,
      sessionLoading,
      loadingProfile,
      initialized,
      signIn,
      signUp,
      signOut,
      updateProfile,
      refreshProfile,
    ],
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
