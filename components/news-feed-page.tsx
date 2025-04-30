"use client"

import { useTranslation } from "@/hooks/use-translation"
import { NewsFeed } from "@/components/news-feed"

export function NewsFeedPage() {
  const { t } = useTranslation()

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2 font-pixel text-[#FFF32A] text-center">{t("newsFeed.title")}</h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-6">{t("newsFeed.subtitle")}</p>
      </div>
      <NewsFeed showFullText={true} />
    </div>
  )
}
