import { getTranslations } from "@/translations"

/**
 * Server-side translation function for RSC/metadata/JSON-LD
 * Now takes language as required parameter instead of reading from cookies
 */
export async function tServer(language: string) {
  const translations = getTranslations(language)

  const t = (key: string, fallback?: string): string => {
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

  return { t, translations }
}

// export function tServerNews() {
//   return tServer("ru")
// }

// export function tServerJobs() {
//   return tServer("en")
// }

export const getServerTranslations = (language: string) => {
  return getTranslations(language)
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
