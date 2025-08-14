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

// Создаем контекст с дефолтными значениями, чтобы избежать ошибки при серверном рендеринге
const defaultTranslations = getTranslations("en")
const defaultContext: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  translations: defaultTranslations,
}

const LanguageContext = createContext<LanguageContextType>(defaultContext)

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

    if (storedLanguage && ["en", "ru", "kk"].includes(storedLanguage)) {
      setLanguageState(storedLanguage)
      setTranslationsState(getTranslations(storedLanguage))
    } else {
      // Detect browser language
      try {
        const browserLanguage = navigator.language.split("-")[0]
        if (browserLanguage === "ru") {
          setLanguageState("ru")
          setTranslationsState(getTranslations("ru"))
        } else if (browserLanguage === "kk") {
          setLanguageState("kk")
          setTranslationsState(getTranslations("kk"))
        } else {
          setLanguageState("en")
          setTranslationsState(getTranslations("en"))
        }
      } catch (e) {
        console.error("Error detecting browser language:", e)
        // Fallback to English
        setLanguageState("en")
        setTranslationsState(getTranslations("en"))
      }
    }
  }, [isClient])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    setTranslationsState(getTranslations(newLanguage))

    try {
      if (isClient) {
        localStorage.setItem("language", newLanguage)
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
