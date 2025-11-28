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

  const withTimeout = useCallback(
    async <T>(promise: Promise<T>, label: string): Promise<T> => {
      const timeoutMs = 6000

      return Promise.race([
        promise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`[auth] ${label} timed out after ${timeoutMs}ms`)), timeoutMs),
        ),
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
        } = await withTimeout(supabase.auth.getSession(), "getSession")

        if (error) {
          console.error("[auth] useSupabaseSession: error getting session", error)
        }

        // Validate user to avoid using unauthenticated local state
        const { data: userData, error: userError } = await withTimeout(
          supabase.auth.getUser(),
          "getUser initial validation",
        )
        if (userError) {
          console.error("[auth] useSupabaseSession: error getting user", userError)
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
        )
        const finalSession = userData.session || session

        if (userError) {
          console.warn("[auth] getUser validation failed", userError)
        }

        prevSessionTokenRef.current = finalSession?.access_token || null

        if (isMounted) {
          setSession(finalSession || null)
          setInitialized(true)
          setLoading(false)
        }
      } catch (e) {
        console.warn("[auth] getUser threw", e)
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
