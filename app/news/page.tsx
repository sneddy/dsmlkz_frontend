"use client"

import { NewsFeed } from "@/components/news-feed"
import { useTranslation } from "@/hooks/use-translation"

export default function NewsPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* SEO Meta */}
      <title>{t("news.page_title")}</title>
      <meta name="description" content={t("news.page_description")} />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#00AEC7] to-[#FFF32A] py-16 px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight font-pixel">
            {t("news.main_title")}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t("news.subtitle_line1")} <br />
            <span className="font-semibold">{t("news.subtitle_line2")}</span>
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/30">
              {t("news.daily_updates")}
            </span>
            <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/30">
              {t("news.current_news")}
            </span>
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <NewsFeed />
      </div>
    </div>
  )
}
