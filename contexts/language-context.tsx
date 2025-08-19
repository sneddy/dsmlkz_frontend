"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getTranslations } from "@/translations/index"

type Language = "en" | "ru" | "kk"

type LanguageContextType = {
  language: Language
  translations: Record<string, any>
}

const defaultTranslations = getTranslations("en")
const defaultContext: LanguageContextType = {
  language: "en",
  translations: defaultTranslations,
}

const LanguageContext = createContext<LanguageContextType>(defaultContext)

export { LanguageContext }

export function LanguageProvider({
  children,
  language: initialLanguage,
  translations: initialTranslations,
}: {
  children: React.ReactNode
  language: Language
  translations: Record<string, any>
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [translations, setTranslations] = useState(initialTranslations)

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const { language: newLanguage } = event.detail
      console.log("[v0] LanguageProvider: language change event received", event.detail)

      if (newLanguage && newLanguage !== language) {
        setLanguage(newLanguage)
        const newTranslations = getTranslations(newLanguage)
        setTranslations(newTranslations)
        console.log("[v0] LanguageProvider: translations updated", {
          newLanguage,
          translationsCount: Object.keys(newTranslations).length,
        })
      }
    }

    window.addEventListener("languageChange", handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener("languageChange", handleLanguageChange as EventListener)
    }
  }, [language])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("preferred-language") as Language
      if (savedLanguage && savedLanguage !== language) {
        setLanguage(savedLanguage)
        const newTranslations = getTranslations(savedLanguage)
        setTranslations(newTranslations)
      }
    }
  }, [])

  const value = {
    language,
    translations,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  return context
}
