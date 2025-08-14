"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type SupabaseContextType = {
  supabase: SupabaseClient<Database>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

const isDevelopment = typeof window !== "undefined" && window.location.hostname === "localhost"

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // Get the Supabase client (this will use the singleton)
  const supabase = getSupabaseClient()

  // Add error handling for missing environment variables
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Supabase environment variables are missing. Some features may not work correctly.")
      console.error("Missing Supabase environment variables in SupabaseProvider")
    }
  }, [])

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {error && isDevelopment && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#FFF32A",
            color: "black",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)

  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }

  return context
}
