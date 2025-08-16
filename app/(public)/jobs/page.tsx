import type { Metadata } from "next"
import JobsFeedServer from "@/widgets/jobs_feed_server"
import { SectionHeroSSR } from "@/widgets/section_hero_ssr"
import { getServerTranslations } from "@/lib/utils/server-translations"

type SearchParams = {
  page?: string
  q?: string
  channels?: string
  remote?: string
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const { t } = getServerTranslations()
  const page = Number.parseInt(searchParams.page || "1")
  const query = searchParams.q || ""
  const channels = searchParams.channels || "all"
  const remote = searchParams.remote === "true"

  let title = `${t("jobs.title")} | DSML Kazakhstan`
  if (page > 1) {
    title = `${t("jobs.title")} - ${t("jobs.pageTitle")} ${page} | DSML Kazakhstan`
  }
  if (query) {
    title = `${t("jobs.searchTitle")}: "${query}"${page > 1 ? ` - ${t("jobs.pageTitle")} ${page}` : ""} | DSML Kazakhstan`
  }

  const description = query
    ? `${t("jobs.searchDescription")} "${query}" ${t("jobs.searchInJobs")}`
    : `${t("jobs.description")}${channels === "ml" ? ` ${t("jobs.mlJobs")}` : channels === "it" ? ` ${t("jobs.itJobs")}` : ` ${t("jobs.mlItJobs")}`}${remote ? ` ${t("jobs.remoteWork")}` : ""}. ${t("jobs.findDreamJob")}`

  const hasFilters = query || channels !== "all" || remote
  const canonicalUrl = hasFilters
    ? "https://www.dsml.kz/jobs"
    : `https://www.dsml.kz/jobs${page > 1 ? `?page=${page}` : ""}`

  const robots = hasFilters ? "noindex,follow" : "index,follow"

  return {
    title,
    description,
    keywords: [
      t("jobs.keywords.vacancies"),
      t("jobs.keywords.work"),
      t("jobs.keywords.machineLearning"),
      t("jobs.keywords.dataScience"),
      t("jobs.keywords.it"),
      t("jobs.keywords.kazakhstan"),
      t("jobs.keywords.remote"),
      query,
    ].filter(Boolean),
    robots,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "DSML Kazakhstan",
      images: [
        {
          url: "https://www.dsml.kz/images/dsml-logo.png",
          width: 1200,
          height: 630,
          alt: t("jobs.ogImageAlt"),
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
      canonical: canonicalUrl,
    },
    ...(page > 1 &&
      !hasFilters && {
        other: {
          prev: `https://www.dsml.kz/jobs${page > 2 ? `?page=${page - 1}` : ""}`,
        },
      }),
    ...(page >= 1 &&
      !hasFilters && {
        other: {
          ...(page > 1 && { prev: `https://www.dsml.kz/jobs${page > 2 ? `?page=${page - 1}` : ""}` }),
          next: `https://www.dsml.kz/jobs?page=${page + 1}`,
        },
      }),
  }
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { t } = getServerTranslations()
  const page = Number.parseInt(searchParams.page || "1")
  const query = searchParams.q || ""
  const channels = searchParams.channels || "all"
  const remote = searchParams.remote === "true"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("jobs.siteTitle"),
    description: t("jobs.description"),
    url: "https://www.dsml.kz/jobs",
    mainEntity: {
      "@type": "ItemList",
      name: t("jobs.listTitle"),
      numberOfItems: "500+",
      itemListElement: [], // Will be populated by server component
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
          name: t("nav.jobsFeed"),
          item: "https://www.dsml.kz/jobs",
        },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {page > 1 && !query && !channels && !remote && (
        <link rel="prev" href={`https://www.dsml.kz/jobs${page > 2 ? `?page=${page - 1}` : ""}`} />
      )}
      {!query && !channels && !remote && <link rel="next" href={`https://www.dsml.kz/jobs?page=${page + 1}`} />}

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800">
        <SectionHeroSSR
          title={t("jobs.main_title")}
          subtitleLine1={t("jobs.subtitle_line1")}
          subtitleLine2={t("jobs.subtitle_line2")}
        />

        <div className="container mx-auto px-4 py-8">
          <JobsFeedServer page={page} query={query} channels={channels} remote={remote} />
        </div>
      </div>
    </>
  )
}
