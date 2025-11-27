import { getTranslations } from "@/translations"
import { cookies } from "next/headers"

/**
 * Server-side translation function for RSC/metadata/JSON-LD
 * Reads language from cookies and returns translation function
 */
export async function tServer() {
  const cookieStore = await cookies()
  const language = cookieStore.get("language")?.value || "ru"

  const translations = getTranslations(language)

  return {
    t: (key: string, fallback?: string): string => {
      const keys = key.split(".")
      let value = translations

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k]
        } else {
          return fallback || key
        }
      }

      return typeof value === "string" ? value : fallback || key
    },
    language,
    translations,
  }
}

export const getServerTranslations = () => {
  return tServer()
}

export const getServerTranslation = (language: string, key: string, fallback?: string): string => {
  const translations = getTranslations(language)

  const keys = key.split(".")
  let value = translations

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      return fallback || key
    }
  }

  return typeof value === "string" ? value : fallback || key
}
