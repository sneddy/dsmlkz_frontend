// Static imports for all translation files
import enCommon from "./en/common.json"
import enNews from "./en/news.json"
import enNav from "./en/nav.json"
import enJobs from "./en/jobs.json"
import enFaces from "./en/faces.json"
import enSearch from "./en/search.json"
import enRegisterCard from "./en/register_card.json"
import enProfile from "./en/profile.json"
import enRules from "./en/rules.json"
import enAuth from "./en/auth.json"
import enArticles from "./en/articles.json"
import enEvents from "./en/events.json"
import enEventsPast from "./en/events_past.json"
import enEventsAnnouncements from "./en/events_announcements.json"
import enDashboard from "./en/dashboard.json"
import enHome from "./en/home.json"
import enResearch from "./en/research.json"
import enValues from "./en/values.json"

import ruCommon from "./ru/common.json"
import ruNews from "./ru/news.json"
import ruNav from "./ru/nav.json"
import ruJobs from "./ru/jobs.json"
import ruFaces from "./ru/faces.json"
import ruSearch from "./ru/search.json"
import ruRegisterCard from "./ru/register_card.json"
import ruProfile from "./ru/profile.json"
import ruRules from "./ru/rules.json"
import ruAuth from "./ru/auth.json"
import ruArticles from "./ru/articles.json"
import ruEvents from "./ru/events.json"
import ruEventsPast from "./ru/events_past.json"
import ruEventsAnnouncements from "./ru/events_announcements.json"
import ruDashboard from "./ru/dashboard.json"
import ruHome from "./ru/home.json"
import ruResearch from "./ru/research.json"
import ruValues from "./ru/values.json"

import kkCommon from "./kk/common.json"
import kkNews from "./kk/news.json"
import kkNav from "./kk/nav.json"
import kkJobs from "./kk/jobs.json"
import kkFaces from "./kk/faces.json"
import kkSearch from "./kk/search.json"
import kkRegisterCard from "./kk/register_card.json"
import kkProfile from "./kk/profile.json"
import kkRules from "./kk/rules.json"
import kkAuth from "./kk/auth.json"
import kkArticles from "./kk/articles.json"
import kkEvents from "./kk/events.json"
import kkEventsPast from "./kk/events_past.json"
import kkEventsAnnouncements from "./kk/events_announcements.json"
import kkDashboard from "./kk/dashboard.json"
import kkHome from "./kk/home.json"
import kkResearch from "./kk/research.json"
import kkValues from "./kk/values.json"

type Translations = Record<string, any>

// Client-side translations object
const clientTranslations: Record<string, Translations> = {
  en: {
    common: enCommon,
    news: enNews,
    nav: enNav,
    jobs: enJobs,
    faces: enFaces,
    search: enSearch,
    register_card: enRegisterCard,
    profile: enProfile,
    rules: enRules,
    auth: enAuth,
    articles: enArticles,
    events: enEvents,
    events_past: enEventsPast,
    events_announcements: enEventsAnnouncements,
    dashboard: enDashboard,
    home: enHome,
    research: enResearch,
    values: enValues,
  },
  ru: {
    common: ruCommon,
    news: ruNews,
    nav: ruNav,
    jobs: ruJobs,
    faces: ruFaces,
    search: ruSearch,
    register_card: ruRegisterCard,
    profile: ruProfile,
    rules: ruRules,
    auth: ruAuth,
    articles: ruArticles,
    events: ruEvents,
    events_past: ruEventsPast,
    events_announcements: ruEventsAnnouncements,
    dashboard: ruDashboard,
    home: ruHome,
    research: ruResearch,
    values: ruValues,
  },
  kk: {
    common: kkCommon,
    news: kkNews,
    nav: kkNav,
    jobs: kkJobs,
    faces: kkFaces,
    search: kkSearch,
    register_card: kkRegisterCard,
    profile: kkProfile,
    rules: kkRules,
    auth: kkAuth,
    articles: kkArticles,
    events: kkEvents,
    events_past: kkEventsPast,
    events_announcements: kkEventsAnnouncements,
    dashboard: kkDashboard,
    home: kkHome,
    research: kkResearch,
    values: kkValues,
  },
}

// Main function to get translations
export const getTranslations = (lang: string): Translations => {
  const language = ["en", "ru", "kk"].includes(lang) ? lang : "en"
  return clientTranslations[language] || clientTranslations.en
}

// Utility functions
export const getAvailableLanguages = (): string[] => {
  return Object.keys(clientTranslations)
}

export const getAllTranslations = (): Record<string, Translations> => {
  return clientTranslations
}

// Function to find missing translation keys
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
