import { ArticleCard } from "@/widgets/article_card"
import { articlesMetadata } from "./utils/articles-metadata"
import { tServer } from "@/lib/server-translations"

export const revalidate = 300

export default async function ArticlesPage() {
  const { t } = await tServer()

  const visibleArticles = articlesMetadata.filter((article) => !article.hidden)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div
        className="relative overflow-hidden py-16 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        style={{ backgroundImage: "linear-gradient(to right, #FFF32A, #00AEC7)" }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight font-pixel">
            {t("articles.title", "Статьи")}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t("articles.description", "Исследования, интервью и аналитика от экспертов DSML Kazakhstan")}
            <br />
          </p>
        </div>
      </div>

      <div className="container py-8">
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
              readMoreLabel={t("articles.readMore")}
              comingSoonLabel={t("articles.comingSoon")}
            />
          ))}
        </div>

        <div className="mt-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF32A]/5 to-[#00AEC7]/5 rounded-2xl blur-2xl"></div>
            <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-[#00AEC7]">{t("articles.contributeTitle")}</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                {t("articles.contributeDescription")}
              </p>
              <button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-black font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                {t("articles.proposeArticle")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
