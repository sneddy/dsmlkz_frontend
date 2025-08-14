"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase-client"
import isEqual from "lodash/isEqual"

// Import types from separate module
import type { Profile, AuthContextType } from "@/features/auth/types"

// Import constants from separate module
import { MAX_RETRIES, RETRY_DELAY, PROFILE_UPDATE_DELAY, DEBUG } from "@/features/auth/constants"

// Import utility for creating fallback profile
import { createFallbackProfile } from "@/features/auth/utils/createFallbackProfile"

// Import functions for working with localStorage
import { readProfileCache, writeProfileCache, clearProfileCache } from "@/features/profile/client/profileStorage"

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create the AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize state
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileError, setProfileError] = useState<Error | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const router = useRouter()
  const [initialized, setInitialized] = useState(false)

  // Use useMemo for creating a stable Supabase client
  const supabase = useMemo(() => getSupabaseClient(), [])

  // Use refs to track fetch operations
  const fetchingProfileRef = useRef(false)
  const lastFetchedUserIdRef = useRef<string | null>(null)
  const profileFetchQueueRef = useRef<string[]>([])
  const authSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)
  const isSigningOutRef = useRef(false)
  const prevSessionRef = useRef<Session | null>(null)
  const currentUserEmailRef = useRef<string | null>(null)

  // Function for fetching profile with error handling and fallback mechanism
  // Stably memoized with minimal dependencies
  const fetchProfile = useCallback(
    async (userId: string, userEmail?: string, retryCount = 0) => {
      // If sign out is in progress, skip fetching profile
      if (isSigningOutRef.current) {
        if (DEBUG) console.log("Skipping fetchProfile: signing out in progress")
        return
      }

      // Check for presence of userId
      if (!userId) {
        if (DEBUG) console.log("Skipping fetchProfile: no user ID provided")
        return
      }

      // If a fetch for this user is already in progress, add to queue
      if (fetchingProfileRef.current && userId !== lastFetchedUserIdRef.current) {
        if (!profileFetchQueueRef.current.includes(userId)) {
          profileFetchQueueRef.current.push(userId)
          if (DEBUG) console.log("Added to profile fetch queue:", userId)
        }
        return
      }

      // If it's the same user for whom we already fetched the profile, skip
      if (userId === lastFetchedUserIdRef.current && profile) {
        if (DEBUG) console.log("Profile already fetched for user:", userId)
        return
      }

      try {
        // Reset error on new request
        setProfileError(null)
        setLoadingProfile(true)

        // Set flag for fetch operation in progress
        fetchingProfileRef.current = true
        lastFetchedUserIdRef.current = userId

        // Save user email if provided
        if (userEmail) {
          currentUserEmailRef.current = userEmail
        }

        if (DEBUG) console.log("Fetching profile for user:", userId)

        // Use readProfileCache function instead of direct localStorage access
        const localProfile = readProfileCache(userId)
        if (localProfile && DEBUG) {
          console.log("Found profile in local storage:", localProfile)
        }

        // Attempt to fetch profile from Supabase
        let supabaseProfile: Profile | null = null
        try {
          const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

          if (error) {
            console.error("Error fetching profile from Supabase:", error)
            throw error
          }

          if (data) {
            // Fetch avatar separately
            let avatarUrl = null
            try {
              const { data: avatarData } = await supabase
                .from("avatars")
                .select("url")
                .eq("user_id", userId)
                .eq("is_current", true)
                .maybeSingle()

              avatarUrl = avatarData?.url
            } catch (avatarError) {
              console.error("Error fetching avatar:", avatarError)
            }

            supabaseProfile = {
              ...data,
              avatar_url: avatarUrl,
            } as Profile

            // Use writeProfileCache function instead of direct localStorage access
            writeProfileCache(userId, supabaseProfile)
          }
        } catch (supabaseError) {
          console.error("Error fetching from Supabase:", supabaseError)

          // If it's not the last retry, try again
          if (retryCount < MAX_RETRIES) {
            if (DEBUG) console.log(`Retrying fetch (${retryCount + 1}/${MAX_RETRIES})...`)
            setTimeout(() => {
              fetchingProfileRef.current = false
              fetchProfile(userId, userEmail, retryCount + 1)
            }, RETRY_DELAY * Math.pow(2, retryCount))
            return
          }
        }

        // Determine which profile to use
        let finalProfile: Profile | null = null

        if (supabaseProfile) {
          if (DEBUG) console.log("Using profile from Supabase")
          finalProfile = supabaseProfile
        } else if (localProfile) {
          if (DEBUG) console.log("Using profile from local storage")
          finalProfile = localProfile
        } else {
          // Use imported createFallbackProfile function
          if (DEBUG) console.log("Creating fallback profile from user ID")

          // Use email from argument, ref, or create a dummy one
          const emailForFallback = userEmail || currentUserEmailRef.current || `${userId}@fallback.com`
          finalProfile = createFallbackProfile(userId, emailForFallback)
        }

        if (DEBUG) console.log("Final profile:", finalProfile)
        setProfile(finalProfile)

        if (!finalProfile) {
          throw new Error("Could not retrieve or create profile")
        }

        if (DEBUG) console.log("Profile data fetched successfully")
      } catch (error) {
        console.error("Error in fetchProfile:", error)

        // If we don't have a profile, create a fallback profile
        if (!profile) {
          try {
            // Use imported createFallbackProfile function
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
        // Reset fetch operation flag and profile loading flag
        fetchingProfileRef.current = false
        setLoadingProfile(false)

        // Check if there are any fetch requests in the queue
        if (profileFetchQueueRef.current.length > 0) {
          const nextUserId = profileFetchQueueRef.current.shift()
          if (nextUserId) {
            // Small delay before the next fetch request
            setTimeout(() => {
              fetchProfile(nextUserId)
            }, 100)
          }
        }
      }
    },
    // Minimal dependencies for stability - remove user
    [supabase],
  )

  // Initialize auth state
  useEffect(() => {
    let isMounted = true

    // Clean up existing subscription if it exists
    if (authSubscriptionRef.current) {
      if (DEBUG) console.log("Cleaning up previous auth subscription")
      authSubscriptionRef.current.unsubscribe()
      authSubscriptionRef.current = null
    }

    // Function to get the initial session
    const initializeAuth = async () => {
      try {
        setLoading(true)

        // Get the current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          if (isMounted) {
            setLoading(false)
            setInitialized(true) // Important: mark as initialized even on error
          }
          return
        }

        if (session && isMounted) {
          // Set session and save to prevSessionRef
          prevSessionRef.current = session
          setSession(session)
          setUser(session.user)

          // Save user email for use in fallback
          if (session.user?.email) {
            currentUserEmailRef.current = session.user.email
          }

          // Do not call fetchProfile here, as onAuthStateChange will do it

          // Mark as initialized after setting user
          setInitialized(true)
          setLoading(false)
        } else {
          // If no session, mark as initialized
          if (isMounted) {
            setInitialized(true)
            setLoading(false)
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        if (isMounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    // Initialize auth
    initializeAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (DEBUG) console.log("Auth state changed:", event, session?.user?.id)

      // Skip processing auth state changes during sign out
      if (isSigningOutRef.current) {
        if (DEBUG) console.log("Skipping auth state change during sign out")
        return
      }

      // Deduplicate onAuthStateChange - check token and deep equality of sessions
      if (session?.access_token === prevSessionRef.current?.access_token) {
        if (DEBUG) console.log("Session token unchanged, checking deep equality")

        // Additional check for deep equality of session objects
        if (isEqual(session, prevSessionRef.current)) {
          if (DEBUG) console.log("Session objects are deeply equal, skipping update")
          return
        }
      }

      // Update prevSessionRef
      prevSessionRef.current = session

      if (isMounted) {
        // Check if session has changed to avoid unnecessary updates
        const sessionChanged =
          (!session && !!user) || (session && !user) || (session && user && session.user.id !== user.id)

        if (sessionChanged) {
          if (DEBUG) console.log("Session changed, updating state")
          setSession(session)
          setUser(session?.user || null)

          if (session?.user) {
            // Save user email for use in fallback
            if (session.user.email) {
              currentUserEmailRef.current = session.user.email
            }

            // Call fetchProfile with user email
            fetchProfile(session.user.id, session.user.email)
          } else {
            setProfile(null)
            currentUserEmailRef.current = null
          }
        } else {
          if (DEBUG) console.log("Session unchanged, skipping update")
        }

        // Important: set initialized and loading after processing state change
        setInitialized(true)
        setLoading(false)
      }
    })

    // Save subscription to ref
    authSubscriptionRef.current = subscription

    // Clean up subscription on unmount
    return () => {
      isMounted = false
      if (authSubscriptionRef.current) {
        authSubscriptionRef.current.unsubscribe()
        authSubscriptionRef.current = null
      }
    }
  }, [supabase, fetchProfile]) // Remove user from dependencies

  // Function to refresh the profile - stably memoized
  const refreshProfile = useCallback(async () => {
    if (user) {
      // Reset lastFetchedUserIdRef to allow a new fetch
      lastFetchedUserIdRef.current = null
      await fetchProfile(user.id, user.email)
    }
  }, [user, fetchProfile])

  // Sign in function - stably memoized
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        if (DEBUG) console.log("Signing in with email:", email)
        setLoading(true)

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          console.error("Sign in error:", error)
          setLoading(false)
          return { error }
        }

        if (DEBUG) console.log("Sign in successful")

        // Save user email for use in fallback
        currentUserEmailRef.current = email

        // Do not call fetchProfile here, as onAuthStateChange will do it
        // Do not redirect here, wait for onAuthStateChange to update state

        return { error: null }
      } catch (error) {
        console.error("Exception during sign in:", error)
        setLoading(false)
        return { error }
      }
    },
    [supabase],
  )

  // Sign up function - stably memoized
  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        // Save user email for use in fallback
        if (!error) {
          currentUserEmailRef.current = email
        }

        setLoading(false)
        return { data, error }
      } catch (error) {
        console.error("Error signing up:", error)
        setLoading(false)
        return { error, data: null }
      }
    },
    [supabase],
  )

  // Sign out function - stably memoized
  const signOut = useCallback(async () => {
    try {
      if (isSigningOutRef.current) {
        if (DEBUG) console.log("Sign out already in progress, skipping")
        return
      }

      isSigningOutRef.current = true
      setLoading(true)

      if (DEBUG) console.log("Starting sign out process")

      // Unsubscribe from onAuthStateChange before clearing state
      if (authSubscriptionRef.current) {
        if (DEBUG) console.log("Unsubscribing from auth state changes")
        authSubscriptionRef.current.unsubscribe()
        authSubscriptionRef.current = null
      }

      // Clear local state early
      setUser(null)
      setProfile(null)
      setSession(null)
      prevSessionRef.current = null
      currentUserEmailRef.current = null

      // Add safety timeout for forced redirect fallback
      const logoutTimeout = setTimeout(() => {
        console.warn("Forced redirect fallback after logout timeout")
        if (typeof window !== "undefined") {
          window.location.replace("/")
        }
      }, 2000)

      // Sign out from Supabase
      if (DEBUG) console.log("Signing out from Supabase")
      const { error } = await supabase.auth.signOut()

      // Clear timeout as sign out was successful
      clearTimeout(logoutTimeout)

      if (error) {
        console.error("Error signing out from Supabase:", error)
        throw error
      }

      if (DEBUG) console.log("Successfully signed out from Supabase")

      // Use clearProfileCache function for clearing profile cache
      if (user?.id) {
        clearProfileCache(user.id)
      }

      // Full clear of localStorage and sessionStorage
      if (typeof window !== "undefined") {
        try {
          if (DEBUG) console.log("Clearing all storage")

          // First remove specific Supabase and profile keys
          const allKeys = Object.keys(localStorage)
          const keysToRemove = allKeys.filter(
            (key) =>
              key.startsWith("sb-") || key.includes("supabase") || key.includes("auth") || key.startsWith("profile_"),
          )

          for (const key of keysToRemove) {
            localStorage.removeItem(key)
            if (DEBUG) console.log(`Removed localStorage key: ${key}`)
          }

          // Then clear everything else
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
          // Import resetSupabaseClient function dynamically in the browser
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

      // Use replace instead of href for full history cleanup
      if (typeof window !== "undefined") {
        window.location.replace("/")
      }
    } catch (error) {
      console.error("Error during sign out process:", error)
      // Reset loading state in case of error
      setLoading(false)
      isSigningOutRef.current = false

      // Try fallback sign out method if primary method fails
      try {
        if (DEBUG) console.log("Attempting fallback sign out")

        // Full clear of localStorage and sessionStorage in any case
        if (typeof window !== "undefined") {
          localStorage.clear()
          sessionStorage.clear()
        }

        // Forced redirect
        if (typeof window !== "undefined") {
          window.location.replace("/")
        }
      } catch (fallbackError) {
        console.error("Fallback sign out also failed:", fallbackError)
        isSigningOutRef.current = false
      }
    }
  }, [supabase, user])

  // Update profile function - stably memoized
  const updateProfile = useCallback(
    async (profileData: Partial<Profile>) => {
      if (!user) {
        return { error: new Error("User not authenticated") }
      }

      try {
        if (DEBUG) console.log("Updating profile with data:", profileData)

        // Add timestamp to profile data
        const dataWithTimestamp = {
          ...profileData,
          updated_at: new Date().toISOString(),
        }

        // Ensure we're not trying to update the email field
        const { email, avatar_url, secret_number, ...dataToUpdate } = dataWithTimestamp as any

        if (secret_number !== undefined) {
          dataToUpdate.secret_number = secret_number
        }

        // Always use API route for updating profile
        try {
          const response = await fetch("/api/profile/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...dataToUpdate,
              id: user.id,
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

        // Use profileStorage functions for updating cache
        const currentProfile = readProfileCache(user.id)
        if (currentProfile) {
          const updatedProfile = {
            ...currentProfile,
            ...dataToUpdate,
            updated_at: new Date().toISOString(),
          }
          writeProfileCache(user.id, updatedProfile)
          if (DEBUG) console.log("Updated profile in localStorage")
        }

        // Reset lastFetchedUserIdRef to allow a new fetch
        lastFetchedUserIdRef.current = null

        // Increase delay before refreshing profile
        if (DEBUG) console.log(`Waiting ${PROFILE_UPDATE_DELAY}ms before refreshing profile`)
        await new Promise((resolve) => setTimeout(resolve, PROFILE_UPDATE_DELAY))

        // Refresh profile data after update
        await fetchProfile(user.id, user.email)

        return { error: null }
      } catch (error) {
        console.error("Error updating profile:", error)
        return { error }
      }
    },
    [fetchProfile, user],
  )

  // Debug effect for logging state changes
  useEffect(() => {
    if (DEBUG) {
      console.log("Auth state updated:", {
        user: user?.id,
        profile: profile?.id,
        loading,
        loadingProfile,
        initialized,
        session: session?.user?.id,
        profileError: profileError?.message,
      })
    }
  }, [user, profile, loading, loadingProfile, initialized, session, profileError])

  // Update returned context
  const contextValue = useMemo(
    () => ({
      user,
      profile,
      profileError,
      session,
      loading,
      loadingProfile,
      initialized,
      signIn,
      signUp,
      signOut,
      updateProfile,
      refreshProfile,
    }),
    [
      user,
      profile,
      profileError,
      session,
      loading,
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
