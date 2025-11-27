"use client"

import { useLanguage } from "@/contexts/language-context"

export function useTranslation() {
  const { translations } = useLanguage()

  const t = (key: string, params?: Record<string, string | number>) => {
    // Split the key by dots to access nested properties
    const keys = key.split(".")
    let value = translations

    // Navigate through the nested properties
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        // Return the key if translation not found
        console.log(`Translation key not found: ${key}`)
        return key
      }
    }

    // If the value is not a string, return the key
    if (typeof value !== "string") {
      console.log(`Translation value is not a string: ${key}`)
      return key
    }

    // Replace parameters in the translation
    if (params) {
      return Object.entries(params).reduce<string>(
        (acc, [paramKey, paramValue]) => acc.replace(`{{${paramKey}}}`, String(paramValue)),
        value,
      )
    }

    return value
  }

  return { t }
}
