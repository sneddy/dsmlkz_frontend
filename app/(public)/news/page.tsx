import NewsFeed from "@/widgets/news_feed"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Новости | DSML Kazakhstan",
  description: "Актуальные новости и события в сфере Data Science и Machine Learning в Казахстане",
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#00AEC7] to-[#FFF32A] py-16 px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight font-pixel">Новости DSML</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Актуальные новости и события <br />
            <span className="font-semibold">в мире Data Science и ML</span>
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/30">
              Ежедневные обновления
            </span>
            <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/30">
              Актуальные новости
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
