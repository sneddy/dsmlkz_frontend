import type { Profile } from "../types"

const sanitizeNickname = (raw: string): string => {
  // Keep only letters/numbers/hyphens, collapse repeats, trim edges
  const cleaned = raw
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")

  // Enforce length and avoid all numbers/hyphens
  const validFormat = /^[a-zA-Z0-9-]+$/.test(cleaned)
  const tooShort = cleaned.length < 3 || cleaned.length > 20
  const onlyNumbers = /^\d+$/.test(cleaned)
  const onlyHyphens = /^-+$/.test(cleaned)
  const startsOrEndsWithHyphen = cleaned.startsWith("-") || cleaned.endsWith("-")
  const hasDoubleHyphen = cleaned.includes("--")

  if (!cleaned || !validFormat || tooShort || onlyNumbers || onlyHyphens || startsOrEndsWithHyphen || hasDoubleHyphen) {
    return ""
  }

  return cleaned
}

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
