"use client"

import { useContext } from "react"
import { LanguageContext } from "@/contexts/language-context"

// Safe version of useTranslation that doesn't throw when provider is missing
export function useSafeTranslation() {
  const context = useContext(LanguageContext)
  const t = (key: string, params?: Record<string, string | number>) => {
    if (!context) {
      return key
    }

    const { translations } = context
    const keys = key.split(".")
    let value = translations

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        return key
      }
    }

    if (typeof value !== "string") {
      return key
    }

    if (params) {
      return Object.entries(params).reduce(
        (acc, [paramKey, paramValue]) => acc.replace(`{{${paramKey}}}`, String(paramValue)),
        value,
      )
    }

    return value
  }

  return { t }
}
