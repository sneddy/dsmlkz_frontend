import { createBrowserClient, createServerClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Global variable to store the singleton instance
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

// Global variable to track if we've already logged the warning
let warningLogged = false
let serverLogShown = false

// Update the getSupabaseClient function to properly check for environment variables
export function getSupabaseClient() {
  // Check if required environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validate environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    // For server-side rendering, just log the error
    if (typeof window === "undefined") {
      console.error("[SERVER] Missing Supabase environment variables")
      // Return a dummy client that won't crash but won't work either
      return {
        from: () => ({ select: () => ({ eq: () => ({ data: null, error: { message: "Supabase not configured" } }) }) }),
        auth: { getSession: () => ({ data: { session: null }, error: null }) },
        // Add other methods as needed with safe fallbacks
      } as any
    }

    // For client-side, check if we already have a client before showing error
    if (supabaseInstance) {
      console.warn("Using existing Supabase client despite missing environment variables")
      return supabaseInstance
    }

    console.error(
      "Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    )
    // Return a dummy client that won't crash but won't work either
    return {
      from: () => ({ select: () => ({ eq: () => ({ data: null, error: { message: "Supabase not configured" } }) }) }),
      auth: { getSession: () => ({ data: { session: null }, error: null }) },
      // Add other methods as needed with safe fallbacks
    } as any
  }

  // For server-side rendering, create a new instance but don't store it globally
  if (typeof window === "undefined") {
    if (!serverLogShown) {
      console.log("[SERVER] Creating new Supabase client for server-side rendering")
      serverLogShown = true
    }
    return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get() {
          return undefined
        },
        set() {},
        remove() {},
      },
    })
  }

  // For client-side, use the singleton pattern - ensure we only create one instance
  if (!supabaseInstance) {
    console.log("Creating new Supabase client singleton")
    supabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  } else if (!warningLogged) {
    console.log("Reusing existing Supabase client singleton")
    warningLogged = true
  }

  return supabaseInstance
}

// Add a function to clear the instance (useful for testing and debugging)
export function clearSupabaseInstance() {
  if (typeof window !== "undefined") {
    supabaseInstance = null
    warningLogged = false
    console.log("Cleared Supabase client singleton")
  }
}

// Add a function to reset the Supabase client on logout
export function resetSupabaseClient() {
  if (typeof window !== "undefined") {
    // Полностью сбрасываем экземпляр
    supabaseInstance = null
    warningLogged = false

    // Очищаем кэш Supabase в localStorage
    try {
      const allKeys = Object.keys(localStorage)
      const supabaseKeys = allKeys.filter(
        (key) => key.startsWith("sb-") || key.includes("supabase") || key.includes("auth"),
      )

      for (const key of supabaseKeys) {
        localStorage.removeItem(key)
      }

      console.log("Reset Supabase client and cleared Supabase cache")
    } catch (e) {
      console.error("Error clearing Supabase cache:", e)
    }
  }
}
