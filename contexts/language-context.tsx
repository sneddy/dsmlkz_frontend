"use client"

import type React from "react"
import { createContext, useContext } from "react"
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
  language,
  translations,
}: {
  children: React.ReactNode
  language: Language
  translations: Record<string, any>
}) {
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
