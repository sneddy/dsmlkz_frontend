"use client"

import { useState, useEffect, useRef, useMemo } from "react"
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
        } = await supabase.auth.getSession()

        if (error) {
          console.error("[auth] useSupabaseSession: error getting session", error)
          if (isMounted) {
            setLoading(false)
            setInitialized(true)
          }
          return
        }

        if (session && isMounted) {
          prevSessionTokenRef.current = session.access_token
          setSession(session)
          setInitialized(true)
          setLoading(false)
        } else if (isMounted) {
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

      // Update token ref
      prevSessionTokenRef.current = session?.access_token || null

      if (isMounted) {
        setSession(session)
        setInitialized(true)
        setLoading(false)
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
  }, [supabase])

  const user = session?.user || null

  return {
    session,
    user,
    initialized,
    loading,
  }
}
