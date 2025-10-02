import { getSupabaseClient } from "@/lib/supabase-client"
import type { Profile } from "@/features/auth/types"
import { DEBUG, MAX_RETRIES, RETRY_DELAY } from "@/features/auth/constants"

export async function fetchProfileOnce(userId: string, retryCount = 0): Promise<Profile | null> {
  if (!userId) {
    if (DEBUG) console.log("fetchProfileOnce: no user ID provided")
    return null
  }

  const supabase = getSupabaseClient()

  try {
    if (DEBUG) console.log("fetchProfileOnce: fetching profile for user:", userId)

    // Fetch profile from Supabase
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (profileError) {
      console.error("fetchProfileOnce: error fetching profile:", profileError)
      throw profileError
    }

    if (!profileData) {
      if (DEBUG) console.log("fetchProfileOnce: no profile found")
      return null
    }

    // Fetch avatar separately
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
      console.error("fetchProfileOnce: error fetching avatar:", avatarError)
    }

    const profile: Profile = {
      ...profileData,
      avatar_url: avatarUrl,
    } as Profile

    if (DEBUG) console.log("fetchProfileOnce: profile fetched successfully")
    return profile
  } catch (error) {
    console.error("fetchProfileOnce: unexpected error:", error)

    if (retryCount < MAX_RETRIES) {
      if (DEBUG) console.log(`fetchProfileOnce: retrying (${retryCount + 1}/${MAX_RETRIES})...`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount)))
      return fetchProfileOnce(userId, retryCount + 1)
    }

    return null
  }
}
