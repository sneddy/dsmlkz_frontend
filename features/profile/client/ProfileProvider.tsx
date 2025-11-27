"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react"

// Import types from separate module
import type { Profile } from "@/features/auth/types"

// Import constants from separate module
import { PROFILE_UPDATE_DELAY } from "@/features/auth/constants"

// Import utility for creating fallback profile
import { createFallbackProfile } from "@/features/auth/utils/createFallbackProfile"

// Import functions for working with localStorage
import { readProfileCache, writeProfileCache, mergeProfileCache } from "@/features/profile/client/profileStorage"

import { fetchProfileOnce } from "@/features/profile/client/fetchProfile"
import { useAuth } from "@/contexts/auth-context"
import { createLogger } from "@/lib/logger"

const PROFILE_SLOW_FETCH_THRESHOLD = 2000

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
  const logger = useMemo(() => createLogger("profile"), [])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const fetchProfile = useCallback(async (userId: string, userEmail?: string) => {
    if (!userId) {
      return
    }

    if (fetchingProfileRef.current.has(userId)) {
      return fetchingProfileRef.current.get(userId)
    }

    const fetchPromise = (async () => {
      const fetchStart = Date.now()

      try {
        if (!isMountedRef.current) return

        setProfileError(null)
        setLoadingProfile(true)

        if (userEmail) {
          currentUserEmailRef.current = userEmail
        }

        // Check cache first
        const cachedProfile = readProfileCache(userId)
        if (cachedProfile && isMountedRef.current) {
          setProfile((currentProfile) => currentProfile ?? cachedProfile)
        }

        logger.info("Starting profile fetch", { userId })
        const fetchedProfile = await fetchProfileOnce(userId)

        if (!isMountedRef.current) return

        // Determine final profile
        let finalProfile: Profile | null = null

        if (fetchedProfile) {
          finalProfile = fetchedProfile
          writeProfileCache(userId, fetchedProfile)
        } else if (cachedProfile) {
          finalProfile = cachedProfile
          logger.warn("Using cached profile because fetch returned null", { userId })
        } else {
          const emailForFallback = userEmail || currentUserEmailRef.current || `${userId}@fallback.com`
          finalProfile = createFallbackProfile(userId, emailForFallback)
          logger.warn("Profile not found, created fallback profile", { userId })
        }

        if (isMountedRef.current) {
          setProfile(finalProfile)
        }

        if (!finalProfile) {
          throw new Error("Could not retrieve or create profile")
        } else {
          logger.info("Profile fetched", { userId })
        }
      } catch (error) {
        logger.error("Error in fetchProfile", error, { userId })

        if (!isMountedRef.current) return

        setProfile((currentProfile) => {
          if (!currentProfile) {
            try {
              const emailForFallback = userEmail || currentUserEmailRef.current || `${userId}@fallback.com`
              const fallbackProfile = createFallbackProfile(userId, emailForFallback)
              logger.warn("Using fallback profile after error", { userId })
              return fallbackProfile
            } catch (fallbackError) {
              logger.error("Error creating fallback profile", fallbackError, { userId })
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

        const duration = Date.now() - fetchStart
        if (duration > PROFILE_SLOW_FETCH_THRESHOLD) {
          logger.warn("Profile fetch took longer than expected", { userId, durationMs: duration })
        }
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
            logger.error("Profile update API error", errorData)
            return { error: new Error(errorData.error || "Failed to update profile") }
          }

        } catch (apiError) {
          logger.error("Error calling profile update API", apiError)
          return { error: apiError }
        }

        mergeProfileCache(user.id, dataToUpdate)

        await new Promise((resolve) => setTimeout(resolve, PROFILE_UPDATE_DELAY))

        await fetchProfile(user.id, user.email)

        return { error: null }
      } catch (error) {
        logger.error("Error updating profile", error)
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
