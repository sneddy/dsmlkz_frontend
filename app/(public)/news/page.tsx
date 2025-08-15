import NewsFeed from "@/widgets/news_feed"
import type { Metadata } from "next"

interface NewsPageProps {
  searchParams: { page?: string; q?: string }
}

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const page = Number.parseInt(searchParams.page || "1")
  const query = searchParams.q || ""

  const title = query
    ? `Поиск: "${query}" | Новости DSML Kazakhstan`
    : page > 1
      ? `Новости DSML Kazakhstan - Страница ${page}`
      : "Новости | DSML Kazakhstan"

  const description = query
    ? `Результаты поиска по запросу "${query}" в новостях DSML Kazakhstan`
    : "Актуальные новости и события в сфере Data Science и Machine Learning в Казахстане"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://www.dsml.kz/news${page > 1 ? `?page=${page}` : ""}${query ? `${page > 1 ? "&" : "?"}q=${query}` : ""}`,
      siteName: "DSML Kazakhstan",
      images: [
        {
          url: "https://www.dsml.kz/images/dsml-logo.png",
          width: 1200,
          height: 630,
          alt: "DSML Kazakhstan News",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.dsml.kz/images/dsml-logo.png"],
    },
    alternates: {
      canonical: `https://www.dsml.kz/news${page > 1 ? `?page=${page}` : ""}${query ? `${page > 1 ? "&" : "?"}q=${query}` : ""}`,
    },
  }
}

export default function NewsPage({ searchParams }: NewsPageProps) {
  const page = Number.parseInt(searchParams.page || "1")
  const query = searchParams.q || ""

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: query ? `Поиск: "${query}"` : "Новости DSML Kazakhstan",
    description: "Актуальные новости и события в сфере Data Science и Machine Learning в Казахстане",
    url: `https://www.dsml.kz/news${page > 1 ? `?page=${page}` : ""}${query ? `${page > 1 ? "&" : "?"}q=${query}` : ""}`,
    mainEntity: {
      "@type": "ItemList",
      name: "Новости DSML Kazakhstan",
      description: "Лента новостей сообщества Data Science и Machine Learning в Казахстане",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: "https://www.dsml.kz",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Новости",
          item: "https://www.dsml.kz/news",
        },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "DSML Kazakhstan",
      url: "https://www.dsml.kz",
      logo: {
        "@type": "ImageObject",
        url: "https://www.dsml.kz/images/dsml-logo.png",
      },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
          <NewsFeed page={page} query={query} />
        </div>
      </div>
    </>
  )
}
