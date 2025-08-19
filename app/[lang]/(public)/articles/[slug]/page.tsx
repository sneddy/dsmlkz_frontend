import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { BlobImage } from "@/shared/ui/blob_image"
import { MarkdownContent } from "@/shared/ui/markdown_content"
import { loadMarkdownFile } from "../../utils/markdown-loader"
import { notFound } from "next/navigation"
import { getArticleMetadata } from "../../utils/articles-metadata"
import { tServer } from "@/lib/server-translations"
import type { Metadata } from "next"

function parseRussianDate(dateString: string): Date | null {
  if (!dateString) return null

  // Russian month names mapping
  const russianMonths: { [key: string]: number } = {
    января: 0,
    февраля: 1,
    марта: 2,
    апреля: 3,
    мая: 4,
    июня: 5,
    июля: 6,
    августа: 7,
    сентября: 8,
    октября: 9,
    ноября: 10,
    декабря: 11,
  }

  // Try to parse Russian date format "13 августа 2025"
  const russianDateMatch = dateString.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/)
  if (russianDateMatch) {
    const [, day, monthName, year] = russianDateMatch
    const monthIndex = russianMonths[monthName.toLowerCase()]
    if (monthIndex !== undefined) {
      return new Date(Number.parseInt(year), monthIndex, Number.parseInt(day))
    }
  }

  // Try standard date parsing as fallback
  const standardDate = new Date(dateString)
  return isNaN(standardDate.getTime()) ? null : standardDate
}

// Gradient border style
const gradientBorderStyle = {
  borderWidth: "4px",
  borderStyle: "solid",
  borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
}

export async function generateMetadata({ params }: { params: { slug: string; lang: string } }): Promise<Metadata> {
  const { slug, lang } = params
  const metadata = getArticleMetadata(slug)

  if (!metadata) {
    return {
      title: "Article Not Found",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dsmlkz.org"
  const canonicalUrl = `${baseUrl}/${lang}/articles/${slug}`
  const parsedDate = metadata.date ? parseRussianDate(metadata.date) : null
  const publishDate = parsedDate ? parsedDate.toISOString() : new Date().toISOString()

  return {
    title: metadata.title,
    description: metadata.description || `Read ${metadata.title} on DSML Kazakhstan`,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/articles/${slug}`,
        ru: `${baseUrl}/ru/articles/${slug}`,
        kk: `${baseUrl}/kk/articles/${slug}`,
        "x-default": `${baseUrl}/en/articles/${slug}`,
      },
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description || `Read ${metadata.title} on DSML Kazakhstan`,
      url: canonicalUrl,
      siteName: "DSML Kazakhstan",
      locale: lang === "en" ? "en_US" : lang === "ru" ? "ru_RU" : "kk_KZ",
      type: "article",
      publishedTime: publishDate,
      modifiedTime: publishDate,
      images: metadata.imageUrl
        ? [
            {
              url: metadata.imageUrl.startsWith("http") ? metadata.imageUrl : `${baseUrl}${metadata.imageUrl}`,
              width: 1200,
              height: 630,
              alt: metadata.title,
            },
          ]
        : [
            {
              url: `${baseUrl}/images/og-default.png`,
              width: 1200,
              height: 630,
              alt: "DSML Kazakhstan",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description || `Read ${metadata.title} on DSML Kazakhstan`,
      images: metadata.imageUrl
        ? [metadata.imageUrl.startsWith("http") ? metadata.imageUrl : `${baseUrl}${metadata.imageUrl}`]
        : [`${baseUrl}/images/og-default.png`],
    },
    other: {
      "article:published_time": publishDate,
      "article:modified_time": publishDate,
      "article:author": "DSML Kazakhstan",
      "article:section": "Technology",
      "article:tag": "AI, Machine Learning, Data Science",
    },
  }
}

export default async function ArticlePage({ params }: { params: { slug: string; lang: string } }) {
  const { slug, lang } = params

  let t: any
  try {
    const serverTranslations = await tServer(lang)
    t = serverTranslations.t
  } catch (error) {
    console.error("[v0] Error loading server translations:", error)
    // Fallback function for translations
    t = (key: string) => key
  }

  // Get article metadata
  const metadata = getArticleMetadata(slug)

  if (!metadata) {
    return notFound()
  }

  // Check if this article has a custom page
  if (metadata.hasCustomPage && !metadata.isMarkdownBased) {
    return notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dsmlkz.org"
  const parsedDate = metadata.date ? parseRussianDate(metadata.date) : null
  const publishDate = parsedDate ? parsedDate.toISOString() : new Date().toISOString()
  const formattedDate = parsedDate
    ? parsedDate.toLocaleDateString(lang === "ru" ? "ru-RU" : lang === "kk" ? "kk-KZ" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : metadata.date || "" // Fallback to original date string if parsing fails

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: metadata.title,
    description: metadata.description || `Read ${metadata.title} on DSML Kazakhstan`,
    image: metadata.imageUrl
      ? metadata.imageUrl.startsWith("http")
        ? metadata.imageUrl
        : `${baseUrl}${metadata.imageUrl}`
      : `${baseUrl}/images/og-default.png`,
    datePublished: publishDate,
    dateModified: publishDate,
    author: {
      "@type": "Organization",
      name: "DSML Kazakhstan",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "DSML Kazakhstan",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/dsml-logo.png`,
        width: 200,
        height: 60,
      },
    },
    url: `${baseUrl}/${lang}/articles/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${lang}/articles/${slug}`,
    },
    inLanguage: lang === "en" ? "en-US" : lang === "ru" ? "ru-RU" : "kk-KZ",
  }

  // If it's not markdown-based and doesn't have a custom page, it's not available yet
  if (!metadata.isMarkdownBased) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="container py-8">
            <div className="mb-6">
              <Link
                href={`/${lang}/articles`}
                className="inline-flex items-center text-[#00AEC7] hover:text-[#00AEC7]/80 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("articles.backToArticles") || "Back to Articles"}
              </Link>
            </div>

            <div className="max-w-3xl mx-auto text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFF32A]/10 to-[#00AEC7]/10 rounded-2xl blur-3xl"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] rounded-full"></div>
                  <h1 className="text-3xl font-bold mb-4 text-[#00AEC7]">{metadata.title}</h1>
                  <p className="text-gray-300 mb-8">
                    {t("articles.comingSoon") || "This article will be available soon. Please check back later."}
                  </p>
                  <Link href={`/${lang}/articles`}>
                    <button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-black font-medium px-6 py-3 rounded-lg transition-all duration-300">
                      {t("articles.returnToArticles") || "Return to Articles"}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  let content: string | null = null
  try {
    content = await loadMarkdownFile(slug)
  } catch (error) {
    console.error("[v0] Error loading markdown file:", error)
    return notFound()
  }

  if (!content) {
    return notFound()
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container py-8">
          <div className="mb-6">
            <Link
              href={`/${lang}/articles`}
              className="inline-flex items-center text-[#00AEC7] hover:text-[#00AEC7]/80 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("articles.backToArticles") || "Back to Articles"}
            </Link>
          </div>

          <article className="max-w-4xl mx-auto">
            {/* Article Header */}
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFF32A]/5 to-[#00AEC7]/5 rounded-2xl blur-2xl"></div>
              <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7]"></div>

                <div className="p-8">
                  <BlobImage
                    src={metadata.imageUrl}
                    alt={metadata.title}
                    width={800}
                    height={450}
                    className="w-full h-auto rounded-lg mb-6"
                    style={gradientBorderStyle}
                    priority={true}
                  />

                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#00AEC7]">{metadata.title}</h1>

                  {metadata.date && (
                    <div className="flex items-center text-sm text-gray-400 mb-6">
                      <Calendar className="h-4 w-4 mr-2" />
                      <time dateTime={publishDate}>{formattedDate}</time>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFF32A]/5 to-[#00AEC7]/5 rounded-2xl blur-2xl"></div>
              <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <MarkdownContent content={content} />
              </div>
            </div>

            <div className="mt-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFF32A]/10 to-[#00AEC7]/10 rounded-2xl blur-3xl"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4 text-[#00AEC7]">
                    {t("articles.cta_title") || "Ready to Join the Future of AI in Central Asia?"}
                  </h2>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    {t("articles.cta_description") ||
                      "Connect with like-minded professionals, access exclusive resources, and accelerate your career in AI/ML."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href={`/${lang}/events`}>
                      <button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-black font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                        {t("articles.cta_button") || "Get Started Today"}
                      </button>
                    </Link>
                    <Link href={`/${lang}/articles`}>
                      <button className="border border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7] hover:text-black font-medium px-8 py-3 rounded-lg transition-all duration-300">
                        {t("articles.backToArticles") || "Back to Articles"}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  )
}
