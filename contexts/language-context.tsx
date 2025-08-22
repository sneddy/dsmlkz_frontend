"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getTranslations } from "@/translations/index"
import { getClientLanguage, setClientLanguage, type Language } from "@/lib/language-sync"

type LanguageContextType = {
  language: Language
  translations: Record<string, any>
  setLanguage: (lang: Language) => void
}

const defaultTranslations = getTranslations("ru")
const defaultContext: LanguageContextType = {
  language: "ru",
  translations: defaultTranslations,
  setLanguage: () => {},
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
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const [translations, setTranslations] = useState(initialTranslations)

  // Функция для установки языка
  const setLanguage = (newLanguage: Language) => {
    if (newLanguage !== language) {
      setLanguageState(newLanguage)
      const newTranslations = getTranslations(newLanguage)
      setTranslations(newTranslations)
      
      // Обновляем куки и localStorage
      setClientLanguage(newLanguage)
      
      console.log("[v0] LanguageProvider: language updated", {
        newLanguage,
        translationsCount: Object.keys(newTranslations).length,
      })
    }
  }

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const { language: newLanguage, source } = event.detail
      console.log("[v0] LanguageProvider: language change event received", event.detail)

      if (newLanguage && newLanguage !== language && source !== "client") {
        setLanguageState(newLanguage)
        const newTranslations = getTranslations(newLanguage)
        setTranslations(newTranslations)
        console.log("[v0] LanguageProvider: translations updated from event", {
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

  // Инициализация языка при монтировании
  useEffect(() => {
    if (typeof window !== "undefined") {
      const clientLang = getClientLanguage()
      
      // Если язык из куков отличается от текущего, обновляем
      if (clientLang !== language) {
        console.log("[v0] LanguageProvider: syncing language from cookies", {
          current: language,
          fromCookies: clientLang
        })
        
        setLanguageState(clientLang)
        const newTranslations = getTranslations(clientLang)
        setTranslations(newTranslations)
      }
    }
  }, [])

  const value = {
    language,
    translations,
    setLanguage,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  return context
}
