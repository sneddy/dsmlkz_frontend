import fs from "fs"
import path from "path"

type Translations = Record<string, any>

export const getTranslations = (lang: string): Translations => {
  const translations: Translations = {}
  const language = ["en", "ru", "kk"].includes(lang) ? lang : "en"

  try {
    const langDir = path.join(process.cwd(), "translations", language)

    if (!fs.existsSync(langDir)) {
      console.warn(`Translation directory not found: ${langDir}`)
      return {}
    }

    const files = fs.readdirSync(langDir)

    for (const file of files) {
      if (file.endsWith(".json")) {
        const key = path.basename(file, ".json")
        const filePath = path.join(langDir, file)

        try {
          const content = JSON.parse(fs.readFileSync(filePath, "utf-8"))
          translations[key] = content
        } catch (error) {
          console.error(`Error parsing translation file ${filePath}:`, error)
        }
      }
    }
  } catch (error) {
    console.error(`Error loading translations for language ${language}:`, error)
  }

  return translations
}

export const getAvailableLanguages = (): string[] => {
  try {
    const translationsDir = path.join(process.cwd(), "translations")
    return fs.readdirSync(translationsDir).filter((item) => {
      const itemPath = path.join(translationsDir, item)
      return fs.statSync(itemPath).isDirectory()
    })
  } catch (error) {
    console.error("Error getting available languages:", error)
    return ["en"]
  }
}

export const getAllTranslations = (): Record<string, Translations> => {
  const languages = getAvailableLanguages()
  const allTranslations: Record<string, Translations> = {}

  for (const lang of languages) {
    allTranslations[lang] = getTranslations(lang)
  }

  return allTranslations
}

export const findMissingTranslations = (sourceLang: string, targetLang: string): string[] => {
  const sourceTranslations = getTranslations(sourceLang)
  const targetTranslations = getTranslations(targetLang)

  const missingKeys: string[] = []

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
