import { getSupabaseClient } from "./supabase-client"

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    // Try a simple query to check connection
    const { data, error } = await supabase.from("profiles").select("id").limit(1)

    if (error) {
      console.error("Supabase connection check failed:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error checking Supabase connection:", error)
    return false
  }
}
