import { getTranslations } from "@/translations"

/**
 * Получает переводы для серверных компонентов
 * @param language Код языка
 * @returns Объект с переводами
 */
export const getServerTranslations = (language: string) => {
  return getTranslations(language)
}

/**
 * Получает конкретный перевод по ключу
 * @param language Код языка
 * @param key Ключ перевода в формате "module.key" или "module.nested.key"
 * @param fallback Значение по умолчанию
 * @returns Переведенная строка
 */
export const getServerTranslation = (language: string, key: string, fallback?: string): string => {
  const translations = getTranslations(language)

  const keys = key.split(".")
  let value = translations

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      return fallback || key
    }
  }

  return typeof value === "string" ? value : fallback || key
}
