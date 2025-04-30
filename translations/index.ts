import { enTranslations } from "./en"
import { ruTranslations } from "./ru"
import { kkTranslations } from "./kk"

/**
 * Возвращает переводы для указанного языка
 * @param language Код языка ('en', 'ru', 'kk')
 * @returns Объект с переводами для указанного языка
 */
export const getTranslations = (language: string) => {
  switch (language) {
    case "ru":
      return ruTranslations
    case "kk":
      return kkTranslations
    default:
      return enTranslations
  }
}

/**
 * Проверяет наличие всех ключей переводов в указанном языке
 * @param sourceLanguage Исходный язык для сравнения (обычно 'en')
 * @param targetLanguage Целевой язык для проверки
 * @returns Массив отсутствующих ключей
 */
export const findMissingTranslations = (sourceLanguage: string, targetLanguage: string) => {
  const sourceTranslations = getTranslations(sourceLanguage)
  const targetTranslations = getTranslations(targetLanguage)

  const missingKeys: string[] = []

  // Рекурсивная функция для проверки ключей
  const checkKeys = (source: any, target: any, path = "") => {
    for (const key in source) {
      const currentPath = path ? `${path}.${key}` : key

      if (!(key in target)) {
        missingKeys.push(currentPath)
      } else if (typeof source[key] === "object" && source[key] !== null) {
        checkKeys(source[key], target[key], currentPath)
      }
    }
  }

  checkKeys(sourceTranslations, targetTranslations)

  return missingKeys
}

// Экспортируем все переводы для использования в инструментах разработки
export const translations = {
  en: enTranslations,
  ru: ruTranslations,
  kk: kkTranslations,
}

// Реэкспортируем getTranslations для обратной совместимости
export { getTranslations as getTranslationsFromIndex }
