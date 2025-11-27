export const validateNicknameFormat = (nickname: string): string | null => {
  if (!nickname || nickname.trim() === "") {
    return null
  }

  if (nickname.length < 3) {
    return "Minimum 3 characters required"
  }

  if (nickname.length > 20) {
    return "Maximum 20 characters allowed"
  }

  const validFormatRegex = /^[a-zA-Z0-9-]+$/
  if (!validFormatRegex.test(nickname)) {
    return "Only Latin letters, numbers and hyphens allowed"
  }

  if (/^\d+$/.test(nickname)) {
    return "Cannot contain only numbers"
  }

  if (/^-+$/.test(nickname)) {
    return "Cannot contain only hyphens"
  }

  if (nickname.startsWith("-") || nickname.endsWith("-")) {
    return "Cannot start or end with hyphen"
  }

  if (nickname.includes("--")) {
    return "Cannot contain consecutive hyphens"
  }

  return null
}

export const sanitizeNickname = (raw: string): string => {
  const cleaned = raw
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")

  const formatError = validateNicknameFormat(cleaned)
  if (formatError || !cleaned) {
    return ""
  }

  return cleaned
}
