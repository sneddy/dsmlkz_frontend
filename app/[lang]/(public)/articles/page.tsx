import { tServer } from "@/lib/server-translations"
import { ArticleCard } from "@/widgets/article_card"
import { articlesMetadata } from "../utils/articles-metadata"
import HeroSection from "@/components/hero-section"
import type { Metadata } from "next"

interface ArticlesPageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: ArticlesPageProps): Promise<Metadata> {
  const { lang } = await params
  const { t } = await tServer(lang)

  return {
    title: t("articles.title") || "Articles | DSML Kazakhstan",
    description: t("articles.description") || "Latest articles about AI, ML, and Data Science",
    alternates: {
      canonical: `/${lang}/articles`,
      languages: {
        en: "/en/articles",
        ru: "/ru/articles",
        kk: "/kk/articles",
      },
    },
  }
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { lang } = await params
  const { t, translations } = await tServer(lang)

  // Фильтруем статьи, чтобы не показывать скрытые
  const visibleArticles = articlesMetadata.filter((article) => !article.hidden)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <HeroSection
        title={t("articles.title") || "Articles"}
        subtitle={t("articles.description") || "Latest articles about AI, ML, and Data Science"}
        description="Читайте экспертные материалы, интервью и исследования от ведущих специалистов в области Data Science и Machine Learning"
        primaryButton={{
          text: t("articles.cta_button") || "Get Started",
          href: "#cta",
        }}
        secondaryButton={{
          text: "Все статьи",
          href: "#articles",
        }}
      />

      <div className="container py-8">
        {/* Articles Grid */}
        <div className="space-y-8" id="articles">
          {visibleArticles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              preview={article.preview}
              imageUrl={article.imageUrl}
              slug={article.slug}
              language={lang} // Pass current language from URL params
              hasCustomPage={article.hasCustomPage}
              isMarkdownBased={article.isMarkdownBased}
              date={article.date}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16" id="cta">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF32A]/5 to-[#00AEC7]/5 rounded-2xl blur-2xl"></div>
            <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-[#00AEC7]">{t("articles.cta_title") || "Ready to Join?"}</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">{t("articles.cta_description") || "Connect with professionals"}</p>
              <button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-black font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                {t("articles.cta_button") || "Get Started"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
