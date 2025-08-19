"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase-client"

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
      console.log("[v0] useSupabaseSession: cleaning up previous subscription")
      authSubscriptionRef.current.unsubscribe()
      authSubscriptionRef.current = null
    }

    const initializeSession = async () => {
      try {
        setLoading(true)
        console.log("[v0] useSupabaseSession: initializing session...")

        // Get initial session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        console.log("[v0] useSupabaseSession: initial session:", session?.user?.id || "null")

        if (error) {
          console.error("[v0] useSupabaseSession: error getting session:", error)
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
          console.log("[v0] useSupabaseSession: session set successfully")
        } else if (isMounted) {
          setInitialized(true)
          setLoading(false)
          console.log("[v0] useSupabaseSession: no session found")
        }
      } catch (error) {
        console.error("[v0] useSupabaseSession: error initializing:", error)
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
      console.log("[v0] useSupabaseSession: auth state changed:", event, "user:", session?.user?.id || "null")

      if (session?.access_token === prevSessionTokenRef.current) {
        console.log("[v0] useSupabaseSession: session token unchanged, skipping update")
        return
      }

      // Update token ref
      prevSessionTokenRef.current = session?.access_token || null

      if (isMounted) {
        setSession(session)
        setInitialized(true)
        setLoading(false)
        console.log("[v0] useSupabaseSession: session updated in state")
      }
    })

    authSubscriptionRef.current = subscription
    console.log("[v0] useSupabaseSession: auth listener set up")

    return () => {
      isMounted = false
      if (authSubscriptionRef.current) {
        console.log("[v0] useSupabaseSession: cleaning up subscription")
        authSubscriptionRef.current.unsubscribe()
        authSubscriptionRef.current = null
      }
    }
  }, [supabase])

  const user = session?.user || null

  useEffect(() => {
    console.log("[v0] useSupabaseSession: user state changed:", user?.id || "null")
  }, [user])

  return {
    session,
    user,
    initialized,
    loading,
  }
}
