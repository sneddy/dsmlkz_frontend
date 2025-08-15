import type { Metadata } from "next"
import JobsFeedServer from "@/widgets/jobs_feed_server"
import SectionHeroServer from "@/widgets/section_hero_server"

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
  const page = Number.parseInt(searchParams.page || "1")
  const query = searchParams.q || ""
  const channels = searchParams.channels || "all"
  const remote = searchParams.remote === "true"

  const title = query
    ? `Поиск вакансий: "${query}" | DSML Kazakhstan`
    : `Вакансии ${channels === "ml" ? "ML" : channels === "it" ? "IT" : "ML/IT"}${remote ? " (Remote)" : ""} | DSML Kazakhstan`

  const description = query
    ? `Результаты поиска вакансий по запросу "${query}" в сообществе DSML Kazakhstan`
    : `Актуальные вакансии ${channels === "ml" ? "Machine Learning" : channels === "it" ? "IT" : "ML и IT"} в Казахстане${remote ? " с возможностью удаленной работы" : ""}. Найдите работу мечты в области Data Science и Machine Learning.`

  return {
    title,
    description,
    keywords: [
      "вакансии",
      "работа",
      "machine learning",
      "data science",
      "IT",
      "Казахстан",
      "remote",
      "удаленная работа",
      query,
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://www.dsml.kz/jobs${page > 1 ? `?page=${page}` : ""}${query ? `${page > 1 ? "&" : "?"}q=${encodeURIComponent(query)}` : ""}`,
      siteName: "DSML Kazakhstan",
      images: [
        {
          url: "https://www.dsml.kz/images/dsml-logo.png",
          width: 1200,
          height: 630,
          alt: "DSML Kazakhstan Jobs",
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
      canonical: `https://www.dsml.kz/jobs${page > 1 ? `?page=${page}` : ""}${query ? `${page > 1 ? "&" : "?"}q=${encodeURIComponent(query)}` : ""}`,
    },
  }
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const page = Number.parseInt(searchParams.page || "1")
  const query = searchParams.q || ""
  const channels = searchParams.channels || "all"
  const remote = searchParams.remote === "true"

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Вакансии DSML Kazakhstan",
    description: "Актуальные вакансии в области Machine Learning и Data Science в Казахстане",
    url: `https://www.dsml.kz/jobs`,
    mainEntity: {
      "@type": "ItemList",
      name: "Список вакансий",
      numberOfItems: "500+",
      itemListElement: {
        "@type": "JobPosting",
        hiringOrganization: {
          "@type": "Organization",
          name: "DSML Kazakhstan Community",
        },
      },
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
          name: "Вакансии",
          item: "https://www.dsml.kz/jobs",
        },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SectionHeroServer
        title="Вакансии ML/IT"
        subtitle="Найдите работу мечты в области Data Science и Machine Learning"
        description="Актуальные вакансии от ведущих компаний Казахстана и международных организаций"
      />

      <div className="container mx-auto px-4 py-8">
        <JobsFeedServer page={page} query={query} channels={channels} remote={remote} />
      </div>
    </>
  )
}
