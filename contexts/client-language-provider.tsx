"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { LanguageProvider } from "@/contexts/language-context"
import { getTranslations } from "@/translations/index"

type Language = "en" | "ru" | "kk"

export function ClientLanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState(() => getTranslations("en"))

  useEffect(() => {
    let detectedLanguage: Language = "en"

    if (pathname.startsWith("/ru/")) {
      detectedLanguage = "ru"
    } else if (pathname.startsWith("/kk/")) {
      detectedLanguage = "kk"
    } else if (pathname.startsWith("/en/")) {
      detectedLanguage = "en"
    } else {
      // For non-localized routes like /auth/*, /dashboard/*, detect from localStorage or browser
      const savedLang = typeof window !== "undefined" ? localStorage.getItem("preferred-language") : null
      if (savedLang && ["en", "ru", "kk"].includes(savedLang)) {
        detectedLanguage = savedLang as Language
      } else {
        const browserLang = typeof window !== "undefined" ? navigator.language.split("-")[0] : "en"
        if (browserLang === "ru" || browserLang === "kk") {
          detectedLanguage = browserLang as Language
        }
      }
    }

    if (detectedLanguage !== language) {
      setLanguage(detectedLanguage)
      setTranslations(getTranslations(detectedLanguage))
    }
  }, [pathname, language])

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail.language as Language
      console.log("[v0] ClientLanguageProvider: language change event received:", newLanguage)

      if (typeof window !== "undefined") {
        localStorage.setItem("preferred-language", newLanguage)
      }

      if (newLanguage !== language) {
        setLanguage(newLanguage)
        setTranslations(getTranslations(newLanguage))
        console.log("[v0] ClientLanguageProvider: language updated to:", newLanguage)
      }
    }

    window.addEventListener("languageChange", handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener("languageChange", handleLanguageChange as EventListener)
    }
  }, [language])

  return (
    <LanguageProvider language={language} translations={translations}>
      {children}
    </LanguageProvider>
  )
}
