import { getSupabaseClient } from "@/lib/supabase-client"
import type { Profile } from "@/features/auth/types"
import { MAX_RETRIES, RETRY_DELAY } from "@/features/auth/constants"

export async function fetchProfileOnce(userId: string, retryCount = 0): Promise<Profile | null> {
  if (!userId) {
    console.log("[v0] fetchProfileOnce: no user ID provided")
    return null
  }

  const supabase = getSupabaseClient()

  try {
    console.log("[v0] fetchProfileOnce: fetching profile for user:", userId, "retry:", retryCount)

    const { data: connectionTest, error: connectionError } = await supabase.from("profiles").select("id").limit(1)

    if (connectionError) {
      console.error("[v0] fetchProfileOnce: connection test failed:", connectionError)
      throw new Error(`Database connection failed: ${connectionError.message}`)
    }

    console.log("[v0] fetchProfileOnce: database connection OK, found", connectionTest?.length || 0, "profiles")

    // Fetch profile from Supabase
    console.log("[v0] fetchProfileOnce: executing profile query...")
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    console.log("[v0] fetchProfileOnce: profile query result:", { profileData, profileError })

    if (profileError) {
      console.error("[v0] fetchProfileOnce: error fetching profile:", profileError)
      throw profileError
    }

    if (!profileData) {
      console.log("[v0] fetchProfileOnce: no profile found for user:", userId)
      return null
    }

    console.log("[v0] fetchProfileOnce: fetching avatar for user:", userId)
    let avatarUrl = null
    try {
      const { data: avatarData, error: avatarError } = await supabase
        .from("avatars")
        .select("url")
        .eq("user_id", userId)
        .eq("is_current", true)
        .maybeSingle()

      console.log("[v0] fetchProfileOnce: avatar query result:", { avatarData, avatarError })
      avatarUrl = avatarData?.url
    } catch (avatarError) {
      console.error("[v0] fetchProfileOnce: error fetching avatar:", avatarError)
    }

    const profile: Profile = {
      ...profileData,
      avatar_url: avatarUrl,
    } as Profile

    console.log("[v0] fetchProfileOnce: profile fetched successfully:", profile.nickname || "no nickname")
    return profile
  } catch (error) {
    console.error("[v0] fetchProfileOnce: unexpected error:", error)

    if (retryCount < MAX_RETRIES) {
      console.log("[v0] fetchProfileOnce: retrying", retryCount + 1, "of", MAX_RETRIES)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount)))
      return fetchProfileOnce(userId, retryCount + 1)
    }

    console.error("[v0] fetchProfileOnce: max retries exceeded, returning null")
    return null
  }
}

export const fetchProfile = fetchProfileOnce
