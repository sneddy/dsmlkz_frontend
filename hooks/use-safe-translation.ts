"use client"

import { useContext } from "react"
import { LanguageContext } from "@/contexts/language-context"

export function useSafeTranslation() {
  const context = useContext(LanguageContext)
  const fallbacks: Record<string, string> = {
    "nav.home": "Главная",
    "nav.newsFeed": "Новости",
    "nav.jobsFeed": "Вакансии",
    "nav.research": "Исследования",
    "nav.articles": "Статьи",
    "nav.events": "Ивенты",
    "nav.faces": "Лица",
    "nav.rules": "Правила",
    "nav.signin": "Войти",
    "nav.signup": "Регистрация",
    "nav.signout": "Выйти",
  }

  const getNestedTranslation = (translations: any, key: string): string | undefined => {
    const keys = key.split(".")
    let result = translations

    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = result[k]
      } else {
        return undefined
      }
    }

    return typeof result === "string" ? result : undefined
  }

  if (!context) {
    // Return safe fallback values when LanguageProvider is not available
    return {
      language: "ru" as const,
      setLanguage: () => {},
      t: (key: string) => fallbacks[key] || key,
    }
  }

  return {
    ...context,
    t: (key: string) => {
      const translation = getNestedTranslation(context.translations, key)
      return translation || fallbacks[key] || key
    },
  }
}
