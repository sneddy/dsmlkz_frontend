"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useLanguageSwitcher } from "@/hooks/use-language-switcher"

type Locale = "ru" | "en" | "kk"

const LOCALE_RE = /^\/(ru|en|kk|eng)(?=\/|$)/

export function LanguageSwitcher({ currentLocale }: { currentLocale?: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const switchLanguage = useLanguageSwitcher()

  const normalizedCurrent = useMemo<Locale>(() => {
    // Extract locale from pathname first
    const match = pathname.match(LOCALE_RE)
    if (match) {
      const urlLocale = match[1]
      if (urlLocale === "eng") return "en"
      return (["ru", "en", "kk"].includes(urlLocale) ? urlLocale : "en") as Locale
    }

    // Fallback to prop or default
    const lc = (currentLocale || "en").toLowerCase()
    if (lc === "eng") return "en"
    return (["ru", "en", "kk"].includes(lc) ? lc : "en") as Locale
  }, [pathname, currentLocale])

  const go = (next: Locale) => {
    if (next === normalizedCurrent) return
    switchLanguage(next)
  }

  const Btn = ({ code, label }: { code: Locale; label: string }) => (
    <Button
      variant={normalizedCurrent === code ? "default" : "outline"}
      size="sm"
      onClick={() => go(code)}
      className="min-w-[40px]"
    >
      {label}
    </Button>
  )

  return (
    <div className="flex items-center gap-2">
      <Btn code="ru" label="RU" />
      <Btn code="en" label="EN" />
      <Btn code="kk" label="KK" />
    </div>
  )
}
