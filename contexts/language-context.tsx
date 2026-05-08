"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getTranslations } from "@/translations/index"

type Language = "en" | "ru" | "kk"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  translations: Record<string, any>
}

const isSupportedLanguage = (value: string | null): value is Language => value === "en" || value === "ru" || value === "kk"

const getCookieLanguage = (): Language | null => {
  if (typeof document === "undefined") return null

  const match = document.cookie.match(/(?:^|;\s*)language=(en|ru|kk)(?:;|$)/)
  return match?.[1] ? (match[1] as Language) : null
}

const persistLanguageCookie = (language: Language) => {
  if (typeof document === "undefined") return
  document.cookie = `language=${language}; path=/; max-age=31536000; samesite=lax`
}

// Создаем контекст с дефолтными значениями, чтобы избежать ошибки при серверном рендеринге
const defaultTranslations = getTranslations("en")
const defaultContext: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  translations: defaultTranslations,
}

const LanguageContext = createContext<LanguageContextType>(defaultContext)

export { LanguageContext }

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [translations, setTranslationsState] = useState<Record<string, any>>(defaultTranslations)
  const [isClient, setIsClient] = useState(false)

  // Устанавливаем флаг isClient после монтирования компонента
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Выполняем только на клиенте
    if (!isClient) return

    // Load language from localStorage or use browser language
    let storedLanguage: Language | null = null

    try {
      storedLanguage = localStorage.getItem("language") as Language | null
    } catch (e) {
      console.error("Error accessing localStorage:", e)
    }

    const cookieLanguage = getCookieLanguage()
    const preferredLanguage = isSupportedLanguage(storedLanguage) ? storedLanguage : cookieLanguage

    if (preferredLanguage) {
      setLanguageState(preferredLanguage)
      setTranslationsState(getTranslations(preferredLanguage))
      persistLanguageCookie(preferredLanguage)
    } else {
      // Detect browser language
      try {
        const browserLanguage = navigator.language.split("-")[0]
        if (browserLanguage === "ru") {
          setLanguageState("ru")
          setTranslationsState(getTranslations("ru"))
          persistLanguageCookie("ru")
        } else if (browserLanguage === "kk") {
          setLanguageState("kk")
          setTranslationsState(getTranslations("kk"))
          persistLanguageCookie("kk")
        } else {
          setLanguageState("en")
          setTranslationsState(getTranslations("en"))
          persistLanguageCookie("en")
        }
      } catch (e) {
        console.error("Error detecting browser language:", e)
        // Fallback to English
        setLanguageState("en")
        setTranslationsState(getTranslations("en"))
        persistLanguageCookie("en")
      }
    }
  }, [isClient])

  useEffect(() => {
    if (!isClient) return

    document.documentElement.lang = language
    document.documentElement.dataset.locale = language
  }, [isClient, language])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    setTranslationsState(getTranslations(newLanguage))

    try {
      if (isClient) {
        localStorage.setItem("language", newLanguage)
        persistLanguageCookie(newLanguage)
      }
    } catch (e) {
      console.error("Error setting language in localStorage:", e)
    }
  }

  const value = {
    language,
    setLanguage,
    translations,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  return context
}
