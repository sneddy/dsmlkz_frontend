"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react"

// Import types from separate module
import type { Profile } from "@/features/auth/types"

// Import constants from separate module
import { AUTH_CONSTANTS } from "@/features/auth/constants"

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
  const lastUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Отслеживаем изменения пользователя
  useEffect(() => {
    const currentUserId = user?.id
    const lastUserId = lastUserIdRef.current
    
    if (AUTH_CONSTANTS.DEBUG) {
      console.log("ProfileProvider: user ID changed:", { lastUserId, currentUserId })
    }
    
    // Если пользователь изменился, обновляем ref
    if (currentUserId !== lastUserId) {
      if (AUTH_CONSTANTS.DEBUG) console.log("ProfileProvider: user ID changed, updating ref")
      lastUserIdRef.current = currentUserId || null
    }
  }, [user?.id])

  const fetchProfile = useCallback(async (userId: string, userEmail?: string) => {
    if (!userId) {
      if (AUTH_CONSTANTS.DEBUG) console.log("Skipping fetchProfile: no user ID provided")
      return
    }

    if (fetchingProfileRef.current.has(userId)) {
      if (AUTH_CONSTANTS.DEBUG) console.log("Profile fetch already in progress for user:", userId)
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

        if (AUTH_CONSTANTS.DEBUG) console.log("Fetching profile for user:", userId)

        // Сначала показываем кэшированный профиль для мгновенного отображения
        const cachedProfile = readProfileCache(userId)
        if (cachedProfile) {
          if (AUTH_CONSTANTS.DEBUG) console.log("Showing cached profile immediately:", cachedProfile)
          setProfile(cachedProfile)
          setLoadingProfile(false)
        }

        // Затем загружаем свежий профиль
        const fetchedProfile = await fetchProfileOnce(userId)

        if (!isMountedRef.current) return

        // Определяем финальный профиль
        let finalProfile: Profile | null = null

        if (fetchedProfile) {
          if (AUTH_CONSTANTS.DEBUG) console.log("Using fetched profile")
          finalProfile = fetchedProfile
          writeProfileCache(userId, fetchedProfile)
        } else if (cachedProfile) {
          if (AUTH_CONSTANTS.DEBUG) console.log("Using cached profile")
          finalProfile = cachedProfile
        } else {
          if (AUTH_CONSTANTS.DEBUG) console.log("No profile found, setting to null")
          finalProfile = null
        }

        if (AUTH_CONSTANTS.DEBUG) console.log("Final profile:", finalProfile)
        if (isMountedRef.current) {
          setProfile(finalProfile)
          setLoadingProfile(false)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        if (isMountedRef.current) {
          setProfileError(error as Error)
          setLoadingProfile(false)
          
          // В случае ошибки показываем кэшированный профиль если есть
          const cachedProfile = readProfileCache(userId)
          if (cachedProfile) {
            if (AUTH_CONSTANTS.DEBUG) console.log("Error occurred, falling back to cached profile")
            setProfile(cachedProfile)
          }
        }
      } finally {
        fetchingProfileRef.current.delete(userId)
      }
    })()

    fetchingProfileRef.current.set(userId, fetchPromise)
    return fetchPromise
  }, [])

  // Инициализация профиля при изменении пользователя
  useEffect(() => {
    if (AUTH_CONSTANTS.DEBUG) console.log("ProfileProvider: user changed:", user?.id, user?.email)
    
    if (user) {
      if (user.email) {
        currentUserEmailRef.current = user.email
      }
      
      // Сразу показываем кэшированный профиль если есть
      const cachedProfile = readProfileCache(user.id)
      if (cachedProfile) {
        if (AUTH_CONSTANTS.DEBUG) console.log("Initializing with cached profile:", cachedProfile)
        setProfile(cachedProfile)
        setLoadingProfile(false)
      } else {
        setLoadingProfile(true)
        setProfile(null)
      }
      
      // Загружаем профиль сразу
      fetchProfile(user.id, user.email)
    } else {
      if (AUTH_CONSTANTS.DEBUG) console.log("ProfileProvider: user is null, clearing profile")
      setProfile(null)
      setLoadingProfile(false)
      currentUserEmailRef.current = null
    }
  }, [user?.id, user?.email])

  // Дополнительная проверка для случаев когда auth контекст обновляется
  useEffect(() => {
    if (user && !profile && !loadingProfile) {
      if (AUTH_CONSTANTS.DEBUG) console.log("ProfileProvider: user exists but no profile, triggering fetch")
      setLoadingProfile(true)
      fetchProfile(user.id, user.email)
    }
  }, [user?.id, profile, loadingProfile])

  // Function to refresh the profile
  const refreshProfile = useCallback(async () => {
    if (user) {
      // Clear any in-flight requests
      fetchingProfileRef.current.delete(user.id)
      await fetchProfile(user.id, user.email)
    }
  }, [user?.id, user?.email]) // Убираем fetchProfile из зависимостей

  // Current: optimistic merge in cache → POST /api/profile/update → refreshProfile
  // Future: Server Action with Zod validation to simplify client and offload provider
  const updateProfile = useCallback(
    async (profileData: Partial<Profile>) => {
      if (!user) {
        return { error: new Error("User not authenticated") }
      }

      try {
        if (AUTH_CONSTANTS.DEBUG) console.log("Updating profile with data:", profileData)

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

          if (AUTH_CONSTANTS.DEBUG) console.log("Profile updated successfully via API route")
        } catch (apiError) {
          console.error("Error calling profile update API:", apiError)
          return { error: apiError }
        }

        mergeProfileCache(user.id, dataToUpdate)
        if (AUTH_CONSTANTS.DEBUG) console.log("Updated profile in localStorage")

        // Немедленно обновляем профиль без задержки
        await fetchProfile(user.id, user.email)

        return { error: null }
      } catch (error) {
        console.error("Error updating profile:", error)
        return { error }
      }
    },
    [user?.id, user?.email], // Убираем fetchProfile из зависимостей
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
