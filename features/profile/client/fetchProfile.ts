import { getSupabaseClient } from "@/lib/supabase-client"
import type { Profile } from "@/features/auth/types"
import { MAX_RETRIES, RETRY_DELAY } from "@/features/auth/constants"
import { createLogger } from "@/lib/logger"

const logger = createLogger("profile")

export async function fetchProfileOnce(userId: string, retryCount = 0): Promise<Profile | null> {
  if (!userId) {
    return null
  }

  try {
    const supabase = getSupabaseClient()
    // Make sure we have a valid session before fetching
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData?.session?.access_token
    if (!sessionData?.session) {
      const { data: refreshed } = await supabase.auth.refreshSession()
      if (refreshed?.session?.access_token) {
        sessionData.session = refreshed.session
      }
    }

    // Try server-assisted fetch first to bypass client auth edge cases
    try {
      const response = await fetch("/api/profile/me", {
        cache: "no-store",
        credentials: "same-origin",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      })
      if (response.ok) {
        const { profile } = (await response.json()) as { profile?: Profile & { secret_number?: number } }
        if (profile) {
          logger.info("Loaded profile via server endpoint")
          return profile
        }
      } else if (response.status !== 401) {
        logger.warn("Server profile fetch failed", { status: response.status })
      }
    } catch (apiError) {
      logger.error("Error calling /api/profile/me", apiError)
    }

    // Fetch profile from Supabase
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (profileError) {
      logger.error("Error fetching profile", profileError)
      throw profileError
    }

    if (!profileData) {
      const { data: publicProfileData, error: publicProfileError } = await supabase
        .from("public_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

      if (publicProfileError) {
        logger.error("Error fetching public profile", publicProfileError)
        throw publicProfileError
      }

      if (!publicProfileData) {
        logger.warn("No profile found in private or public tables")
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
      logger.error("Error fetching avatar", avatarError)
    }

    const profile: Profile = {
      ...profileData,
      avatar_url: avatarUrl,
    } as Profile

    return profile
  } catch (error) {
    logger.error("Unexpected error fetching profile", error)

    if (retryCount < MAX_RETRIES) {
      logger.warn("Retrying profile fetch after failure", { userId, attempt: retryCount + 1 })
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount)))
      return fetchProfileOnce(userId, retryCount + 1)
    }

    return null
  }
}
