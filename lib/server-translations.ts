import { getTranslations as getTranslationsFromIndex } from "@/translations"

// Default language to use on the server
const DEFAULT_LANGUAGE = "en"

// Re-export getTranslations from the index file
export const getTranslations = getTranslationsFromIndex

export function getServerTranslation(key: string, language: string = DEFAULT_LANGUAGE) {
  const translations = getTranslations(language)

  // Split the key by dots to access nested properties
  const keys = key.split(".")
  let value = translations

  // Navigate through the nested properties
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      // Return the key if translation not found
      console.log(`Translation key not found: ${key}`, value)
      return key
    }
  }

  // If the value is not a string, return the key
  if (typeof value !== "string") {
    console.log(`Translation value is not a string: ${key}`, value)
    return key
  }

  return value
}
