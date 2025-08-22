"use client"

import { useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { syncLanguage } from "@/lib/language-sync"

/**
 * Компонент для синхронизации языка между куками и контекстом
 * Автоматически запускается при загрузке страницы
 */
export function LanguageSyncProvider() {
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    // Синхронизируем язык только при загрузке страницы
    const syncedLanguage = syncLanguage()
    
    // Если язык из куков отличается от текущего, обновляем контекст
    if (syncedLanguage !== language) {
      console.log("[v0] LanguageSyncProvider: syncing language", {
        current: language,
        synced: syncedLanguage
      })
      setLanguage(syncedLanguage)
    }
  }, []) // Убираем зависимости чтобы избежать бесконечного цикла

  // Этот компонент не рендерит ничего
  return null
}
