"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"

type Locale = "ru" | "en" | "kk"

const CANONICAL_PREFIX: Record<Locale, string> = {
  ru: "ru",
  en: "en",
  kk: "kk",
}

const LOCALE_RE = /^\/(ru|en|kk|eng)(?=\/|$)/

function buildHref(pathname: string, search: string, hash: string, target: Locale): string {
  const rest = pathname.replace(LOCALE_RE, "") || "/"
  const base = `/${CANONICAL_PREFIX[target]}${rest}`
  const withQuery = search ? `${base}?${search}` : base
  return hash ? `${withQuery}${hash}` : withQuery
}

function getCurrentSection(pathname: string): string {
  const withoutLocale = pathname.replace(LOCALE_RE, "")
  const segments = withoutLocale.split("/").filter(Boolean)
  return segments[0] || ""
}

export function LanguageSwitcher({ currentLocale }: { currentLocale?: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

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

    const hash = typeof window !== "undefined" ? window.location.hash : ""
    const href = buildHref(pathname, searchParams.toString(), hash, next)

    console.log("[v0] Language switch (full redirect):", {
      from: pathname,
      to: href,
      locale: next,
      section: getCurrentSection(pathname),
    })

    // Полный редирект для SSR перерендеринга
    if (typeof window !== "undefined") {
      window.location.href = href
    }
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
