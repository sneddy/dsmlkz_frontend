import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { tServer } from "@/lib/server-translations"
import JobsFeedServer from "@/widgets/jobs_feed_server"
import HeroSection from "@/components/hero-section"

const SUPPORTED_LANGS = ["en", "ru", "kk"] as const
type SupportedLang = (typeof SUPPORTED_LANGS)[number]

function normalizeLocale(lang: string): "en" | "ru" | "kk" {
  if (lang === "en") return "en"
  if (lang === "ru") return "ru"
  if (lang === "kk") return "kk"
  return "en"
}

interface JobsPageProps {
  params: { lang: string }
  searchParams: { page?: string; search?: string; location?: string; type?: string }
}

export async function generateMetadata({ params }: JobsPageProps): Promise<Metadata> {
  const lang = params.lang as SupportedLang
  if (!SUPPORTED_LANGS.includes(lang as SupportedLang)) {
    return {}
  }

  const locale = normalizeLocale(lang)
  const t = await tServer(locale)

  return {
    title: t.jobs?.title || "Jobs - DSML Kazakhstan",
    description: t.jobs?.description || "Find your next career opportunity in data science and machine learning",
    alternates: {
      canonical: `/${lang}/jobs`,
      languages: {
        en: "/en/jobs",
        ru: "/ru/jobs",
        kk: "/kk/jobs",
      },
    },
  }
}

export default async function JobsPage({ params, searchParams }: JobsPageProps) {
  const lang = params.lang as SupportedLang

  if (!SUPPORTED_LANGS.includes(lang)) {
    notFound()
  }

  const locale = normalizeLocale(lang)
  const t = await tServer(locale)

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title={t.jobs?.main_title || "Jobs"}
        subtitle={t.jobs?.subtitle_line1 || "Find your dream job in Data Science, Machine Learning and IT"}
        description={t.jobs?.subtitle_line2 || "Join leading tech companies in Kazakhstan"}
        primaryButton={{
          text: t.jobs?.search_job || "Search Jobs",
        }}
        secondaryButton={{
          text: t.jobs?.postJob || "Post a Job",
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <JobsFeedServer searchParams={searchParams} locale={locale} translations={t} />
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({
    lang,
  }))
}
