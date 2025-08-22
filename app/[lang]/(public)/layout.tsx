import type React from "react"
import { notFound } from "next/navigation"

const localeMapping = {
  en: "en",
  ru: "ru",
  kk: "kk",
} as const

export async function generateStaticParams() {
  return Object.keys(localeMapping).map((locale) => ({
    lang: locale,
  }))
}

import { LocaleProvider } from "@/contexts/locale-context"
import { LanguageProvider } from "@/contexts/language-context"
import { tServer } from "@/lib/server-translations"

export default async function LocalizedPublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  // Validate locale
  const { lang } = await params
  if (!localeMapping[lang as keyof typeof localeMapping]) {
    notFound()
  }

  const { translations } = await tServer(lang as "en" | "ru" | "kk")

  return (
    <LocaleProvider locale={lang}>
      {/* Pass locale and translations from URL to LanguageProvider */}
      <LanguageProvider language={lang as "en" | "ru" | "kk"} translations={translations}>
        {children}
      </LanguageProvider>
    </LocaleProvider>
  )
}
