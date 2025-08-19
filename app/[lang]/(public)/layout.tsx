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
  params: { lang: string }
}) {
  // Validate locale
  if (!localeMapping[params.lang as keyof typeof localeMapping]) {
    notFound()
  }

  const { translations } = await tServer(params.lang as "en" | "ru" | "kk")

  return (
    <LocaleProvider locale={params.lang}>
      {/* Pass locale and translations from URL to LanguageProvider */}
      <LanguageProvider language={params.lang as "en" | "ru" | "kk"} translations={translations}>
        {children}
      </LanguageProvider>
    </LocaleProvider>
  )
}
