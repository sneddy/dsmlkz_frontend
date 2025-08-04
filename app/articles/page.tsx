"use client"

import { useTranslation } from "@/hooks/use-translation"
import { ArticleCard } from "@/components/article-card"
import { articlesMetadata } from "./utils/articles-metadata"
import { SectionHero } from "@/components/section-hero"

export default function ArticlesPage() {
  const { t } = useTranslation()

  // Фильтруем статьи, чтобы не показывать скрытые
  const visibleArticles = articlesMetadata.filter((article) => !article.hidden)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <SectionHero
        title={t("articles.title") || "Статьи"}
        subtitleLine1={t("articles.description") || "Исследования, интервью и аналитика от экспертов DSML Kazakhstan"}
        gradientFrom="#FFF32A"
        gradientTo="#00AEC7"
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      />

      <div className="container py-8">
        {/* Articles Grid */}
        <div className="space-y-8">
          {visibleArticles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              preview={article.preview}
              imageUrl={article.imageUrl}
              slug={article.slug}
              language={article.language}
              hasCustomPage={article.hasCustomPage}
              isMarkdownBased={article.isMarkdownBased}
              date={article.date}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF32A]/5 to-[#00AEC7]/5 rounded-2xl blur-2xl"></div>
            <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-[#00AEC7]">Хотите поделиться своим опытом?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Присоединяйтесь к нашему сообществу авторов и делитесь знаниями с коллегами по всему Казахстану
              </p>
              <button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-black font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                Предложить статью
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
