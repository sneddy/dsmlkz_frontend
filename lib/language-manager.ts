// Единый менеджер для управления языками
export class LanguageManager {
    private static instance: LanguageManager
    private currentLanguage: string = 'ru'
    private listeners: Set<(lang: string) => void> = new Set()
  
    static getInstance(): LanguageManager {
      if (!LanguageManager.instance) {
        LanguageManager.instance = new LanguageManager()
      }
      return LanguageManager.instance
    }
  
    // Устанавливаем язык и уведомляем всех слушателей
    setLanguage(lang: string, source: 'url' | 'cookie' | 'manual' = 'manual') {
      console.log(`[LanguageManager] Setting language: ${lang} (source: ${source})`)
      
      this.currentLanguage = lang
      
      // Сохраняем в localStorage для CSR
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-language', lang)
      }
      
      // Сохраняем в cookie для SSR
      if (typeof document !== 'undefined') {
        document.cookie = `preferred-language=${lang};path=/;max-age=31536000`
      }
      
      // Уведомляем всех слушателей
      this.notifyListeners(lang)
      
      // Отправляем событие для совместимости
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('languageChange', {
            detail: { language: lang, source }
          })
        )
      }
    }
  
    // Получаем текущий язык
    getLanguage(): string {
      return this.currentLanguage
    }
  
    // Подписываемся на изменения языка
    subscribe(listener: (lang: string) => void): () => void {
      this.listeners.add(listener)
      return () => this.listeners.delete(listener)
    }
  
    // Уведомляем всех слушателей
    private notifyListeners(lang: string) {
      this.listeners.forEach(listener => listener(lang))
    }
  
    // Инициализация языка при загрузке
    initializeLanguage(urlLang?: string, cookieLang?: string) {
      let targetLang = 'ru' // По умолчанию
      
      // Приоритет: URL > Cookie > localStorage > default
      if (urlLang && ['en', 'ru', 'kk'].includes(urlLang)) {
        targetLang = urlLang
        console.log(`[LanguageManager] Language from URL: ${targetLang}`)
      } else if (cookieLang && ['en', 'ru', 'kk'].includes(cookieLang)) {
        targetLang = cookieLang
        console.log(`[LanguageManager] Language from cookie: ${targetLang}`)
      } else if (typeof window !== 'undefined') {
        const localLang = localStorage.getItem('preferred-language')
        if (localLang && ['en', 'ru', 'kk'].includes(localLang)) {
          targetLang = localLang
          console.log(`[LanguageManager] Language from localStorage: ${targetLang}`)
        }
      }
      
      this.setLanguage(targetLang, 'url')
      return targetLang
    }
  }
  
  export const languageManager = LanguageManager.getInstance()


