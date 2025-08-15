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
    "home.signIn": "Войти",
    "home.signUp": "Регистрация",
    "auth.signOut": "Выйти",
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
    t: (key: string) => context.translations[key] || fallbacks[key] || key,
  }
}
