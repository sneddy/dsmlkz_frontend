import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { tServer } from "@/lib/server-translations"
import NewsFeed from "@/widgets/news_feed"
import HeroSection from "@/components/hero-section"

const SUPPORTED_LANGS = ["en", "ru", "kk"] as const
type SupportedLang = (typeof SUPPORTED_LANGS)[number]

function normalizeLocale(lang: string): "en" | "ru" | "kk" {
  if (lang === "en") return "en"
  if (lang === "ru") return "ru"
  if (lang === "kk") return "kk"
  return "en"
}

interface NewsPageProps {
  params: { lang: string }
  searchParams: { page?: string }
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const lang = params.lang as SupportedLang
  if (!SUPPORTED_LANGS.includes(lang as SupportedLang)) {
    return {}
  }

  const locale = normalizeLocale(lang)
  const t = await tServer(locale)

  return {
    title: t.news?.title || "News - DSML Kazakhstan",
    description: t.news?.description || "Latest news and updates from DSML Kazakhstan community",
    alternates: {
      canonical: `/${lang}/news`,
      languages: {
        en: "/en/news",
        ru: "/ru/news",
        kk: "/kk/news",
      },
    },
  }
}

export default async function NewsPage({ params, searchParams }: NewsPageProps) {
  const lang = params.lang as SupportedLang

  if (!SUPPORTED_LANGS.includes(lang)) {
    notFound()
  }

  const locale = normalizeLocale(lang)
  const t = await tServer(locale)
  const page = Number.parseInt(searchParams.page || "1", 10)

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title={t.news?.main_title || "News"}
        subtitle={t.news?.subtitle_line1 || "Latest news and updates from DSML Kazakhstan community"}
        description={t.news?.subtitle_line2 || "Stay up to date with the latest events"}
        primaryButton={{
          text: t.news?.daily_updates || "Daily Updates",
        }}
        secondaryButton={{
          text: t.news?.current_news || "Current News",
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <NewsFeed initialPage={page} locale={locale} translations={t} />
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({
    lang,
  }))
}
