"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react"

// Import types from separate module
import type { Profile } from "@/features/auth/types"

// Import constants from separate module
import { PROFILE_UPDATE_DELAY, DEBUG } from "@/features/auth/constants"

// Import utility for creating fallback profile
import { createFallbackProfile } from "@/features/auth/utils/createFallbackProfile"

// Import functions for working with localStorage
import { readProfileCache, writeProfileCache, mergeProfileCache } from "@/features/profile/client/profileStorage"

import { fetchProfileOnce } from "@/features/profile/client/fetchProfile"
import { useAuth } from "@/contexts/auth-context"

// Profile context type
interface ProfileContextType {
  profile: Profile | null
  loadingProfile: boolean
  profileError: Error | null
  updateProfile: (profileData: Partial<Profile>) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

// Create the context and export it
export const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

// Create the ProfileProvider component
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Profile-specific state
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileError, setProfileError] = useState<Error | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const isMountedRef = useRef(true)
  const fetchingProfileRef = useRef<Map<string, Promise<void>>>(new Map())
  const currentUserEmailRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const fetchProfile = useCallback(async (userId: string, userEmail?: string) => {
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
        if (!isMountedRef.current) return

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

        if (!isMountedRef.current) return

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
        if (isMountedRef.current) {
          setProfile(finalProfile)
        }

        if (!finalProfile) {
          throw new Error("Could not retrieve or create profile")
        }
      } catch (error) {
        console.error("Error in fetchProfile:", error)

        if (!isMountedRef.current) return

        setProfile((currentProfile) => {
          if (!currentProfile) {
            try {
              const emailForFallback = userEmail || currentUserEmailRef.current || `${userId}@fallback.com`
              const fallbackProfile = createFallbackProfile(userId, emailForFallback)
              if (DEBUG) console.log("Setting fallback profile:", fallbackProfile)
              return fallbackProfile
            } catch (fallbackError) {
              console.error("Error creating fallback profile:", fallbackError)
              const normalizedError = error instanceof Error ? error : new Error(String(error))
              if (isMountedRef.current) {
                setProfileError(normalizedError)
              }
              return null
            }
          } else {
            const normalizedError = error instanceof Error ? error : new Error(String(error))
            if (isMountedRef.current) {
              setProfileError(normalizedError)
            }
            return currentProfile
          }
        })
      } finally {
        if (isMountedRef.current) {
          setLoadingProfile(false)
        }
        fetchingProfileRef.current.delete(userId)
      }
    })()

    fetchingProfileRef.current.set(userId, fetchPromise)
    return fetchPromise
  }, [])

  useEffect(() => {
    if (user) {
      if (user.email) {
        currentUserEmailRef.current = user.email
      }
      fetchProfile(user.id, user.email)
    } else {
      setProfile(null)
      currentUserEmailRef.current = null
    }
  }, [user, fetchProfile])

  // Function to refresh the profile
  const refreshProfile = useCallback(async () => {
    if (user) {
      // Clear any in-flight requests
      fetchingProfileRef.current.delete(user.id)
      await fetchProfile(user.id, user.email)
    }
  }, [user, fetchProfile])

  // Current: optimistic merge in cache → POST /api/profile/update → refreshProfile
  // Future: Server Action with Zod validation to simplify client and offload provider
  const updateProfile = useCallback(
    async (profileData: Partial<Profile>) => {
      if (!user) {
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

        mergeProfileCache(user.id, dataToUpdate)
        if (DEBUG) console.log("Updated profile in localStorage")

        if (DEBUG) console.log(`Waiting ${PROFILE_UPDATE_DELAY}ms before refreshing profile`)
        await new Promise((resolve) => setTimeout(resolve, PROFILE_UPDATE_DELAY))

        await fetchProfile(user.id, user.email)

        return { error: null }
      } catch (error) {
        console.error("Error updating profile:", error)
        return { error }
      }
    },
    [fetchProfile, user],
  )

  const contextValue = useMemo(
    () => ({
      profile,
      loadingProfile,
      profileError,
      updateProfile,
      refreshProfile,
    }),
    [profile, loadingProfile, profileError, updateProfile, refreshProfile],
  )

  return <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>
}

// Hook to use the profile context
export function useProfile() {
  const context = useContext(ProfileContext)

  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }

  return context
}
