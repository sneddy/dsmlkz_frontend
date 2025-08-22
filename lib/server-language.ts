import { cookies } from "next/headers"

export type Language = "en" | "ru" | "kk"

/**
 * Получает предпочтительный язык из куков на сервере
 */
export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies()
  const preferredLang = cookieStore.get("preferred-language")?.value as Language
  return preferredLang || "ru"
}
