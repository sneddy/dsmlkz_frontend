import type { Profile } from "../types"

// Создаем резервный профиль на основе данных пользователя
export const createFallbackProfile = (userId: string, email?: string): Profile => {
  const emailToUse = email || `${userId}@fallback.com`
  const nameParts = emailToUse.split("@")[0].split(".") || ["User"]
  return {
    id: userId,
    nickname: "",
    first_name: nameParts[0] || "User",
    last_name: nameParts.length > 1 ? nameParts[1] : "",
    avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${nameParts.join(" ")}`,
  }
}
