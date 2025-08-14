import type { Profile } from "../../auth/types"

export const readProfileCache = (userId: string): Profile | null => {
  try {
    if (typeof window === "undefined") return null

    const storedProfile = localStorage.getItem(`profile_${userId}`)
    if (!storedProfile) return null

    return JSON.parse(storedProfile)
  } catch (error) {
    console.error("Error reading profile cache:", error)
    return null
  }
}

export const writeProfileCache = (userId: string, profile: Profile): void => {
  try {
    if (typeof window === "undefined") return

    localStorage.setItem(`profile_${userId}`, JSON.stringify(profile))
  } catch (error) {
    console.error("Error writing profile cache:", error)
  }
}

export const clearProfileCache = (userId: string): void => {
  try {
    if (typeof window === "undefined") return

    localStorage.removeItem(`profile_${userId}`)
  } catch (error) {
    console.error("Error clearing profile cache:", error)
  }
}

export const mergeProfileCache = (userId: string, patch: Partial<Profile>): void => {
  try {
    if (typeof window === "undefined") return

    const currentProfile = readProfileCache(userId)
    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        ...patch,
        updated_at: new Date().toISOString(),
      }
      writeProfileCache(userId, updatedProfile)
    }
  } catch (error) {
    console.error("Error merging profile cache:", error)
  }
}
