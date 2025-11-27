import type { Profile } from "../types"
import { sanitizeNickname } from "@/features/profile/utils/nickname"

// Создаем резервный профиль на основе данных пользователя
export const createFallbackProfile = (userId: string, email?: string): Profile => {
  const emailToUse = email || `${userId}@fallback.com`
  const emailPrefix = emailToUse.split("@")[0] || ""
  const nameParts = emailPrefix.split(".") || ["User"]
  const sanitizedNickname = sanitizeNickname(emailPrefix)

  return {
    id: userId,
    nickname: sanitizedNickname,
    first_name: nameParts[0] || "User",
    last_name: nameParts.length > 1 ? nameParts[1] : "",
    avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${nameParts.join(" ")}`,
  }
}
