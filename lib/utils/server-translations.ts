import { getTranslations } from "@/translations/index"
import { cookies } from "next/headers"

export async function getServerTranslations() {
  // Get language from cookies, fallback to 'ru'
  const cookieStore = await cookies()
  const language = cookieStore.get("language")?.value || "ru"

  const validLanguages = ["en", "ru", "kk"]
  const selectedLanguage = validLanguages.includes(language) ? language : "ru"

  const translations = getTranslations(selectedLanguage)

  const t = (key: string): string => {
    const keys = key.split(".")
    let result = translations

    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = result[k]
      } else {
        return key // Return key if translation not found
      }
    }

    return typeof result === "string" ? result : key
  }

  return { t, language: selectedLanguage }
}
