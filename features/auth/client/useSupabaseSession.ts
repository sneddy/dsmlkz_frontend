"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase-client"
import { DEBUG } from "@/features/auth/constants"

interface UseSupabaseSessionReturn {
  session: Session | null
  user: User | null
  initialized: boolean
  loading: boolean
}

export function useSupabaseSession(): UseSupabaseSessionReturn {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Use ref to track previous session for comparison
  const prevSessionTokenRef = useRef<string | null>(null)
  const authSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)

  const supabase = useMemo(() => getSupabaseClient(), [])

  const isAuthSessionMissingError = (error: any) =>
    typeof error?.message === "string" && error.message.toLowerCase().includes("auth session missing")

  const withTimeout = useCallback(
    async <T>(promise: Promise<T>, label: string, fallback: () => T): Promise<T> => {
      const timeoutMs = 6000
      let timeoutId: ReturnType<typeof setTimeout> | null = null

      return Promise.race([
        promise.finally(() => {
          if (timeoutId) clearTimeout(timeoutId)
        }),
        new Promise<T>((resolve) => {
          timeoutId = setTimeout(() => {
            console.warn(`[auth] ${label} timed out after ${timeoutMs}ms — falling back to null session`)
            resolve(fallback())
          }, timeoutMs)
        }),
      ])
    },
    [],
  )

  useEffect(() => {
    let isMounted = true

    // Clean up existing subscription
    if (authSubscriptionRef.current) {
      authSubscriptionRef.current.unsubscribe()
      authSubscriptionRef.current = null
    }

    const initializeSession = async () => {
      try {
        setLoading(true)

        // Get initial session
        const {
          data: { session },
          error,
        } = await withTimeout(
          supabase.auth.getSession(),
          "getSession",
          () => ({ data: { session: null } } as any),
        )

        if (error) {
          if (!isAuthSessionMissingError(error)) {
            console.error("[auth] useSupabaseSession: error getting session", error)
          } else if (DEBUG) {
            console.info("[auth] Session missing during getSession (expected after sign out)")
          }
        }

        // Validate user to avoid using unauthenticated local state
        const { data: userData, error: userError } = await withTimeout(
          supabase.auth.getUser(),
          "getUser initial validation",
          () => ({ data: { user: null, session: null } } as any),
        )
        if (userError) {
          if (!isAuthSessionMissingError(userError)) {
            console.error("[auth] useSupabaseSession: error getting user", userError)
          } else if (DEBUG) {
            console.info("[auth] Session missing during getUser (expected after sign out)")
          }
        }

        const finalSession = userData.session || session

        if (isMounted) {
          prevSessionTokenRef.current = finalSession?.access_token || null
          setSession(finalSession || null)
          setInitialized(true)
          setLoading(false)
        }
      } catch (error) {
        console.error("[auth] useSupabaseSession: error initializing", error)
        if (isMounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    // Initialize session
    initializeSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.info("[auth] Auth state changed", { event, userId: session?.user?.id })

      try {
        const { data: userData, error: userError } = await withTimeout(
          supabase.auth.getUser(),
          "getUser onAuthStateChange",
          () => ({ data: { user: null, session: null } } as any),
        )
        const finalSession = userData.session || session

        if (userError && !isAuthSessionMissingError(userError)) {
          console.warn("[auth] getUser validation failed", userError)
        } else if (userError && DEBUG) {
          console.info("[auth] getUser session missing (expected after sign out)")
        }

        prevSessionTokenRef.current = finalSession?.access_token || null

        if (isMounted) {
          setSession(finalSession || null)
          setInitialized(true)
          setLoading(false)
        }
      } catch (e: any) {
        if (!isAuthSessionMissingError(e)) {
          console.warn("[auth] getUser threw", e)
        } else if (DEBUG) {
          console.info("[auth] getUser session missing (caught), proceeding with provided session")
        }
        prevSessionTokenRef.current = session?.access_token || null
        if (isMounted) {
          setSession(session)
          setInitialized(true)
          setLoading(false)
        }
      }
    })

    authSubscriptionRef.current = subscription

    return () => {
      isMounted = false
      if (authSubscriptionRef.current) {
        authSubscriptionRef.current.unsubscribe()
        authSubscriptionRef.current = null
      }
    }
  }, [supabase, withTimeout])

  const user = session?.user || null

  return {
    session,
    user,
    initialized,
    loading,
  }
}
