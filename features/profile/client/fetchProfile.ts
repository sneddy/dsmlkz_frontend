import { getSupabaseClient } from "@/lib/supabase-client"
import type { Profile } from "@/features/auth/types"
import { MAX_RETRIES, RETRY_DELAY } from "@/features/auth/constants"

export async function fetchProfileOnce(userId: string, retryCount = 0): Promise<Profile | null> {
  if (!userId) {
    return null
  }

  try {
    // Try server-assisted fetch first to bypass client auth edge cases
    try {
      const response = await fetch("/api/profile/me", { cache: "no-store", credentials: "same-origin" })
      if (response.ok) {
        const { profile } = (await response.json()) as { profile?: Profile & { secret_number?: number } }
        if (profile) {
          console.info("[profile] Loaded profile via server endpoint")
          return profile
        }
      } else if (response.status !== 401) {
        console.warn("[profile] Server profile fetch failed", { status: response.status })
      }
    } catch (apiError) {
      console.error("[profile] Error calling /api/profile/me", apiError)
    }

    const supabase = getSupabaseClient()

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
      const { data: publicProfileData, error: publicProfileError } = await supabase
        .from("public_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

      if (publicProfileError) {
        console.error("[profile] Error fetching public profile", publicProfileError)
        throw publicProfileError
      }

      if (!publicProfileData) {
        console.warn("[profile] No profile found in private or public tables")
        return null
      }

      const profile: Profile = {
        ...publicProfileData,
      } as Profile

      return profile
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

    return profile
  } catch (error) {
    console.error("fetchProfileOnce: unexpected error:", error)

    if (retryCount < MAX_RETRIES) {
      console.warn("fetchProfileOnce: retrying after failure", { userId, attempt: retryCount + 1 })
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount)))
      return fetchProfileOnce(userId, retryCount + 1)
    }

    return null
  }
}
