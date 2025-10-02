import NewsFeed from "@/widgets/news_feed"
import { SectionHeroSSR } from "@/widgets/section_hero_ssr"
import type { Metadata } from "next"
import { tServer } from "@/lib/server-translations"

interface NewsPageProps {
  searchParams: { page?: string; q?: string }
}

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const { t } = tServer()
  const page = Number.parseInt(searchParams.page || "1")
  const query = searchParams.q || ""

  const title = query
    ? `${t("news.searchTitle")}: "${query}" | ${t("news.siteTitle")}`
    : page > 1
      ? `${t("news.siteTitle")} - ${t("news.pageTitle")} ${page}`
      : `${t("news.title")} | DSML Kazakhstan`

  const description = query
    ? `${t("news.searchDescription")} "${query}" ${t("news.searchInNews")}`
    : t("news.description")

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
          alt: t("news.ogImageAlt"),
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
  const { t } = tServer()
  const page = Number.parseInt(searchParams.page || "1")
  const query = searchParams.q || ""

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: query ? `${t("news.searchTitle")}: "${query}"` : t("news.siteTitle"),
    description: t("news.description"),
    url: `https://www.dsml.kz/news${page > 1 ? `?page=${page}` : ""}${query ? `${page > 1 ? "&" : "?"}q=${query}` : ""}`,
    mainEntity: {
      "@type": "ItemList",
      name: t("news.siteTitle"),
      description: t("news.feedDescription"),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: t("nav.home"),
          item: "https://www.dsml.kz",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: t("nav.newsFeed"),
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

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800">
        <SectionHeroSSR
          titleKey="news.main_title"
          subtitleLine1Key="news.subtitle_line1"
          subtitleLine2Key="news.subtitle_line2"
          badgeKeys={["news.daily_updates", "news.current_news"]}
        />

        {/* News Feed */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <NewsFeed page={page} query={query} />
        </div>
      </div>
    </>
  )
}
