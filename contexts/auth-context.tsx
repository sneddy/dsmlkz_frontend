"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase-client"
import isEqual from "lodash/isEqual"

// Define the Profile type
type Profile = {
  id: string
  nickname: string
  first_name: string
  last_name: string
  current_city?: string
  university?: string
  relevant_company?: string
  relevant_position?: string
  about_you?: string
  motivation?: string
  linkedin?: string
  other_links?: string
  avatar_url?: string
}

// Define the AuthContext type
type AuthContextType = {
  user: User | null
  profile: Profile | null
  profileError: Error | null
  session: Session | null
  loading: boolean
  loadingProfile: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
  updateProfile: (profile: Partial<Profile>) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Maximum number of retries for fetch operations
const MAX_RETRIES = 3
// Delay between retries in milliseconds
const RETRY_DELAY = 1000
// Delay after profile update before fetching again
const PROFILE_UPDATE_DELAY = 1000
// Debug mode flag
const DEBUG = process.env.NODE_ENV === "development"

// Создаем резервный профиль на основе данных пользователя - вынесено за пределы компонента
const createFallbackProfile = (userId: string, email?: string): Profile => {
  const emailToUse = email || `${userId}@fallback.com`
  const nameParts = emailToUse.split("@")[0].split(".") || ["User"]
  return {
    id: userId,
    nickname: emailToUse.split("@")[0] || "user",
    first_name: nameParts[0] || "User",
    last_name: nameParts.length > 1 ? nameParts[1] : "",
    avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${nameParts.join(" ")}`,
  }
}

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

  // Используем useMemo для создания стабильного клиента Supabase
  const supabase = useMemo(() => getSupabaseClient(), [])

  // Use refs to track fetch operations
  const fetchingProfileRef = useRef(false)
  const lastFetchedUserIdRef = useRef<string | null>(null)
  const profileFetchQueueRef = useRef<string[]>([])
  const authSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)
  const isSigningOutRef = useRef(false)
  const prevSessionRef = useRef<Session | null>(null)
  const currentUserEmailRef = useRef<string | null>(null)

  // Функция для получения профиля с обработкой ошибок и резервным механизмом
  // Стабильно мемоизирована с минимальными зависимостями
  const fetchProfile = useCallback(
    async (userId: string, userEmail?: string, retryCount = 0) => {
      // Если выполняется выход из системы, не выполняем запрос профиля
      if (isSigningOutRef.current) {
        if (DEBUG) console.log("Skipping fetchProfile: signing out in progress")
        return
      }

      // Проверяем наличие userId
      if (!userId) {
        if (DEBUG) console.log("Skipping fetchProfile: no user ID provided")
        return
      }

      // Если уже выполняется запрос для этого пользователя, добавим в очередь
      if (fetchingProfileRef.current && userId !== lastFetchedUserIdRef.current) {
        if (!profileFetchQueueRef.current.includes(userId)) {
          profileFetchQueueRef.current.push(userId)
          if (DEBUG) console.log("Added to profile fetch queue:", userId)
        }
        return
      }

      // Если это тот же пользователь, для которого мы уже получили профиль, пропускаем
      if (userId === lastFetchedUserIdRef.current && profile) {
        if (DEBUG) console.log("Profile already fetched for user:", userId)
        return
      }

      try {
        // Сбрасываем ошибку при новом запросе
        setProfileError(null)
        setLoadingProfile(true)

        // Устанавливаем флаг выполнения запроса
        fetchingProfileRef.current = true
        lastFetchedUserIdRef.current = userId

        // Сохраняем email пользователя, если он предоставлен
        if (userEmail) {
          currentUserEmailRef.current = userEmail
        }

        if (DEBUG) console.log("Fetching profile for user:", userId)

        // Попытка получить профиль из локального хранилища
        let localProfile: Profile | null = null
        try {
          if (typeof window !== "undefined") {
            const storedProfile = localStorage.getItem(`profile_${userId}`)
            if (storedProfile) {
              localProfile = JSON.parse(storedProfile)
              if (DEBUG) console.log("Found profile in local storage:", localProfile)
            }
          }
        } catch (e) {
          console.error("Error reading from localStorage:", e)
        }

        // Попытка получить профиль из Supabase
        let supabaseProfile: Profile | null = null
        try {
          const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

          if (error) {
            console.error("Error fetching profile from Supabase:", error)
            throw error
          }

          if (data) {
            // Получаем аватар отдельно
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

            // Сохраняем в локальное хранилище
            try {
              if (typeof window !== "undefined") {
                localStorage.setItem(`profile_${userId}`, JSON.stringify(supabaseProfile))
              }
            } catch (e) {
              console.error("Error saving to localStorage:", e)
            }
          }
        } catch (supabaseError) {
          console.error("Error fetching from Supabase:", supabaseError)

          // Если это не последняя попытка, пробуем снова
          if (retryCount < MAX_RETRIES) {
            if (DEBUG) console.log(`Retrying fetch (${retryCount + 1}/${MAX_RETRIES})...`)
            setTimeout(() => {
              fetchingProfileRef.current = false
              fetchProfile(userId, userEmail, retryCount + 1)
            }, RETRY_DELAY * Math.pow(2, retryCount))
            return
          }
        }

        // Определяем, какой профиль использовать
        let finalProfile: Profile | null = null

        if (supabaseProfile) {
          if (DEBUG) console.log("Using profile from Supabase")
          finalProfile = supabaseProfile
        } else if (localProfile) {
          if (DEBUG) console.log("Using profile from local storage")
          finalProfile = localProfile
        } else {
          // Создаем резервный профиль на основе данных пользователя
          if (DEBUG) console.log("Creating fallback profile from user ID")

          // Используем email из аргумента, из ref или создаем фиктивный
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

        // Если у нас нет профиля, создаем резервный профиль
        if (!profile) {
          try {
            // Используем email из аргумента, из ref или создаем фиктивный
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
        // Сбрасываем флаг выполнения запроса и загрузки профиля
        fetchingProfileRef.current = false
        setLoadingProfile(false)

        // Проверяем, есть ли запросы в очереди
        if (profileFetchQueueRef.current.length > 0) {
          const nextUserId = profileFetchQueueRef.current.shift()
          if (nextUserId) {
            // Небольшая задержка перед следующим запросом
            setTimeout(() => {
              fetchProfile(nextUserId)
            }, 100)
          }
        }
      }
    },
    // Минимальные зависимости для стабильности - убираем user
    [supabase],
  )

  // Function to refresh the profile - стабильно мемоизирована
  const refreshProfile = useCallback(async () => {
    if (user) {
      // Reset the lastFetchedUserIdRef to allow a new fetch
      lastFetchedUserIdRef.current = null
      await fetchProfile(user.id, user.email)
    }
  }, [user, fetchProfile])

  // Initialize auth state
  useEffect(() => {
    let isMounted = true

    // Очистим существующую подписку, если она есть
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
            setInitialized(true) // Важно: отметить как инициализированное даже при ошибке
          }
          return
        }

        if (session && isMounted) {
          // Устанавливаем сессию и сохраняем в prevSessionRef
          prevSessionRef.current = session
          setSession(session)
          setUser(session.user)

          // Сохраняем email пользователя для использования в fallback
          if (session.user?.email) {
            currentUserEmailRef.current = session.user.email
          }

          // НЕ вызываем fetchProfile здесь, так как onAuthStateChange сделает это

          // Отмечаем как инициализированное после установки пользователя
          setInitialized(true)
          setLoading(false)
        } else {
          // Если нет сессии, отмечаем как инициализированное
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

      // Пропускаем обработку изменений состояния аутентификации во время выхода
      if (isSigningOutRef.current) {
        if (DEBUG) console.log("Skipping auth state change during sign out")
        return
      }

      // Дедупликация onAuthStateChange - проверяем токен и полное равенство сессий
      if (session?.access_token === prevSessionRef.current?.access_token) {
        if (DEBUG) console.log("Session token unchanged, checking deep equality")

        // Дополнительная проверка на полное равенство объектов сессии
        if (isEqual(session, prevSessionRef.current)) {
          if (DEBUG) console.log("Session objects are deeply equal, skipping update")
          return
        }
      }

      // Обновляем prevSessionRef
      prevSessionRef.current = session

      if (isMounted) {
        // Проверяем, изменилась ли сессия, чтобы избежать ненужных обновлений
        const sessionChanged =
          (!session && !!user) || (session && !user) || (session && user && session.user.id !== user.id)

        if (sessionChanged) {
          if (DEBUG) console.log("Session changed, updating state")
          setSession(session)
          setUser(session?.user || null)

          if (session?.user) {
            // Сохраняем email пользователя для использования в fallback
            if (session.user.email) {
              currentUserEmailRef.current = session.user.email
            }

            // Вызываем fetchProfile с email пользователя
            fetchProfile(session.user.id, session.user.email)
          } else {
            setProfile(null)
            currentUserEmailRef.current = null
          }
        } else {
          if (DEBUG) console.log("Session unchanged, skipping update")
        }

        // Важно: устанавливаем initialized и loading после обработки изменения состояния
        setInitialized(true)
        setLoading(false)
      }
    })

    // Сохраняем подписку в ref
    authSubscriptionRef.current = subscription

    // Clean up subscription on unmount
    return () => {
      isMounted = false
      if (authSubscriptionRef.current) {
        authSubscriptionRef.current.unsubscribe()
        authSubscriptionRef.current = null
      }
    }
  }, [supabase, fetchProfile]) // Убираем user из зависимостей

  // Отладочный эффект для логирования изменений состояния
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

  // Sign in function - стабильно мемоизирована
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

        // Сохраняем email пользователя для использования в fallback
        currentUserEmailRef.current = email

        // Не вызываем fetchProfile здесь, так как onAuthStateChange сделает это
        // Не делаем редирект здесь, а ждем пока onAuthStateChange обновит состояние

        return { error: null }
      } catch (error) {
        console.error("Exception during sign in:", error)
        setLoading(false)
        return { error }
      }
    },
    [supabase],
  )

  // Sign up function - стабильно мемоизирована
  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        // Сохраняем email пользователя для использования в fallback
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

  // Sign out function - стабильно мемоизирована
  const signOut = useCallback(async () => {
    try {
      if (isSigningOutRef.current) {
        if (DEBUG) console.log("Sign out already in progress, skipping")
        return
      }

      isSigningOutRef.current = true
      setLoading(true)

      if (DEBUG) console.log("Starting sign out process")

      // Отписываемся от onAuthStateChange перед очисткой состояния
      if (authSubscriptionRef.current) {
        if (DEBUG) console.log("Unsubscribing from auth state changes")
        authSubscriptionRef.current.unsubscribe()
        authSubscriptionRef.current = null
      }

      // Очищаем локальное состояние рано
      setUser(null)
      setProfile(null)
      setSession(null)
      prevSessionRef.current = null
      currentUserEmailRef.current = null

      // Добавляем таймаут безопасности для принудительного перенаправления
      const logoutTimeout = setTimeout(() => {
        console.warn("Forced redirect fallback after logout timeout")
        if (typeof window !== "undefined") {
          window.location.replace("/")
        }
      }, 2000)

      // Выполняем выход из Supabase
      if (DEBUG) console.log("Signing out from Supabase")
      const { error } = await supabase.auth.signOut()

      // Очищаем таймаут, так как выход выполнен успешно
      clearTimeout(logoutTimeout)

      if (error) {
        console.error("Error signing out from Supabase:", error)
        throw error
      }

      if (DEBUG) console.log("Successfully signed out from Supabase")

      // Полная очистка localStorage и sessionStorage
      if (typeof window !== "undefined") {
        try {
          if (DEBUG) console.log("Clearing all storage")

          // Сначала удаляем конкретные ключи Supabase и профиля
          const allKeys = Object.keys(localStorage)
          const keysToRemove = allKeys.filter(
            (key) =>
              key.startsWith("sb-") || key.includes("supabase") || key.includes("auth") || key.startsWith("profile_"),
          )

          for (const key of keysToRemove) {
            localStorage.removeItem(key)
            if (DEBUG) console.log(`Removed localStorage key: ${key}`)
          }

          // Затем очищаем все остальное
          localStorage.clear()
          sessionStorage.clear()

          if (DEBUG) console.log("All storage cleared")
        } catch (e) {
          console.error("Error clearing storage:", e)
        }
      }

      // Сбрасываем клиент Supabase
      try {
        if (typeof window !== "undefined") {
          // Импортируем функцию динамически в браузере
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

      // Используем replace вместо href для полной очистки истории
      if (typeof window !== "undefined") {
        window.location.replace("/")
      }
    } catch (error) {
      console.error("Error during sign out process:", error)
      // Сбрасываем состояние загрузки в случае ошибки
      setLoading(false)
      isSigningOutRef.current = false

      // Пытаемся использовать запасной метод выхода, если основной метод не сработал
      try {
        if (DEBUG) console.log("Attempting fallback sign out")

        // Полная очистка localStorage и sessionStorage в любом случае
        if (typeof window !== "undefined") {
          localStorage.clear()
          sessionStorage.clear()
        }

        // Принудительное перенаправление
        if (typeof window !== "undefined") {
          window.location.replace("/")
        }
      } catch (fallbackError) {
        console.error("Fallback sign out also failed:", fallbackError)
        isSigningOutRef.current = false
      }
    }
  }, [supabase])

  // Update profile function - стабильно мемоизирована
  const updateProfile = useCallback(
    async (profileData: Partial<Profile>) => {
      if (!user) {
        return { error: new Error("User not authenticated") }
      }

      try {
        if (DEBUG) console.log("Updating profile with data:", profileData)

        // Add timestamp to the profile data
        const dataWithTimestamp = {
          ...profileData,
          updated_at: new Date().toISOString(),
        }

        // Ensure we're not trying to update the email field
        const { email, avatar_url, ...dataToUpdate } = dataWithTimestamp as any

        // Try direct Supabase update first
        const { data, error } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            ...dataToUpdate,
          })
          .select()

        if (error) {
          console.error("Error updating profile directly:", error)

          // Fall back to API route if direct update fails
          try {
            if (DEBUG) console.log("Falling back to API route for profile update")
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
        } else {
          if (DEBUG) console.log("Profile updated successfully via direct Supabase update")
        }

        // Обновляем локальное хранилище
        try {
          if (typeof window !== "undefined") {
            // Получаем текущий профиль из локального хранилища
            const storedProfileStr = localStorage.getItem(`profile_${user.id}`)
            if (storedProfileStr) {
              const storedProfile = JSON.parse(storedProfileStr)
              // Обновляем профиль
              const updatedProfile = {
                ...storedProfile,
                ...dataToUpdate,
                updated_at: new Date().toISOString(),
              }
              // Сохраняем обновленный профиль
              localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile))
              if (DEBUG) console.log("Updated profile in localStorage")
            }
          }
        } catch (e) {
          console.error("Error updating localStorage:", e)
        }

        // Reset the lastFetchedUserIdRef to allow a new fetch
        lastFetchedUserIdRef.current = null

        // Увеличиваем задержку перед обновлением профиля
        if (DEBUG) console.log(`Waiting ${PROFILE_UPDATE_DELAY}ms before refreshing profile`)
        await new Promise((resolve) => setTimeout(resolve, PROFILE_UPDATE_DELAY))

        // Refresh the profile data after update
        await fetchProfile(user.id, user.email)

        // Если обновление прошло успешно, обновляем локальное состояние профиля
        if (data && data.length > 0) {
          setProfile(data[0] as Profile)
        }

        return { error: null }
      } catch (error) {
        console.error("Error updating profile:", error)
        return { error }
      }
    },
    [supabase, fetchProfile, user],
  )

  // Обновим возвращаемый контекст
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
