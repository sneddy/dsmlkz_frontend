"use client"

import { useTranslation } from "@/hooks/use-translation"
import { ArticleCard } from "@/components/article-card"
import { articlesMetadata } from "./utils/articles-metadata"

export default function ArticlesPage() {
  const { t } = useTranslation()

  // Фильтруем статьи, чтобы не показывать скрытые
  const visibleArticles = articlesMetadata.filter((article) => !article.hidden)

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2 font-pixel text-[#FFF32A] text-center">
          {t("nav.articles") || "Статьи"}
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-6">{t("articles.description")}</p>
      </div>

      <div className="space-y-6">
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
    </div>
  )
}
