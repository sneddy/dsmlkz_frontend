export const i18n = {
  defaultLocale: "en",
  locales: ["en", "ru", "kk"],
} as const

export type Locale = (typeof i18n)["locales"][number]

// Mapping for URL compatibility
export const localeMapping: Record<string, Locale> = {
  eng: "en", // Legacy support - redirect to en
  en: "en",
  ru: "ru",
  kk: "kk",
}

export const reverseLocaleMapping: Record<Locale, string> = {
  en: "en", // Changed from eng to en for standard compliance
  ru: "ru",
  kk: "kk",
}
