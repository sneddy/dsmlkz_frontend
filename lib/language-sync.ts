export type Language = "en" | "ru" | "kk"

/**
 * Получает предпочтительный язык из куков на клиенте
 */
export function getClientLanguage(): Language {
  if (typeof window === "undefined") return "ru"
  
  // Сначала проверяем куки
  const cookies = document.cookie.split(";")
  const languageCookie = cookies.find(cookie => 
    cookie.trim().startsWith("preferred-language=")
  )
  
  if (languageCookie) {
    const lang = languageCookie.split("=")[1] as Language
    if (["en", "ru", "kk"].includes(lang)) {
      return lang
    }
  }
  
  // Fallback на localStorage
  const savedLanguage = localStorage.getItem("preferred-language") as Language
  if (savedLanguage && ["en", "ru", "kk"].includes(savedLanguage)) {
    return savedLanguage
  }
  
  return "ru"
}

/**
 * Устанавливает язык в куки и localStorage
 */
export function setClientLanguage(language: Language): void {
  if (typeof window === "undefined") return
  
  // Устанавливаем куки
  document.cookie = `preferred-language=${language}; path=/; max-age=31536000; SameSite=Lax`
  
  // Устанавливаем localStorage
  localStorage.setItem("preferred-language", language)
  
  // Отправляем событие для обновления LanguageProvider
  window.dispatchEvent(
    new CustomEvent("languageChange", { 
      detail: { language, source: "client" } 
    })
  )
}

/**
 * Синхронизирует язык между куками и localStorage
 */
export function syncLanguage(): Language {
  const clientLang = getClientLanguage()
  setClientLanguage(clientLang)
  return clientLang
}
