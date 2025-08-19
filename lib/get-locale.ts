import { match } from "@formatjs/intl-localematcher"
import { headers } from "next/headers"
import { i18n, type Locale, localeMapping } from "./i18n-config"

export function getLocale(): Locale {
  // Get locale from URL if available
  const headersList = headers()
  const pathname = headersList.get("x-pathname") || ""

  // Extract locale from pathname
  const segments = pathname.split("/")
  const potentialLocale = segments[1]

  if (potentialLocale && localeMapping[potentialLocale]) {
    return localeMapping[potentialLocale]
  }

  // Fallback to browser language detection
  const acceptLanguage = headersList.get("accept-language")

  if (!acceptLanguage) {
    return i18n.defaultLocale
  }

  try {
    return match(
      acceptLanguage.split(",").map((lang) => lang.split(";")[0].trim()),
      i18n.locales,
      i18n.defaultLocale,
    ) as Locale
  } catch {
    return i18n.defaultLocale
  }
}
