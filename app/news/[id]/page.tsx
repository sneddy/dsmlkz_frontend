import { getNewsById } from "@/entities/news/api"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BlobImage } from "@/shared/ui/blob_image"
import { absoluteUrl, trimExcerpt } from "@/lib/seo"

export const revalidate = 1800 // ISR 30 minutes

export async function generateMetadata({ params }: { params: { id: string } }) {
  const item = await getNewsById(params.id)

  if (!item) {
    return {
      title: "News Not Found — DSML Kazakhstan",
      description: "The requested news article was not found",
    }
  }

  const description = trimExcerpt(item.excerpt || item.content)

  return {
    title: `${item.title} — DSML Kazakhstan`,
    description,
    openGraph: {
      title: `${item.title} — DSML Kazakhstan`,
      description,
      type: "article",
      url: absoluteUrl(`/news/${params.id}`),
      images: [{ url: absoluteUrl(item.image || "/images/dsml-logo.png") }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} — DSML Kazakhstan`,
      description,
      images: [absoluteUrl(item.image || "/images/dsml-logo.png")],
    },
    alternates: {
      canonical: absoluteUrl(`/news/${params.id}`),
    },
  }
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const item = await getNewsById(params.id)

  if (!item) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const processHtml = (html: string) => {
    return html.replace(/\n/g, "<br />").replace(/<br \/><br \/>/g, "</p><p>")
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: trimExcerpt(item.excerpt || item.content),
    image: [absoluteUrl(item.image || "/images/dsml-logo.png")],
    url: absoluteUrl(`/news/${params.id}`),
    datePublished: new Date(item.date).toISOString(),
    dateModified: new Date(item.date).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/news/${params.id}`),
    },
    author: {
      "@type": "Organization",
      name: "DSML KZ Новости",
    },
    publisher: {
      "@type": "Organization",
      name: "DSML Kazakhstan",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/dsml-logo.png"),
      },
    },
    articleSection: "News",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/news">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад к новостям
            </Button>
          </Link>
        </div>

        {/* Main news card */}
        <Card className="border-2 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <div className="h-1 bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A]"></div>

          <CardHeader className="bg-gradient-to-r from-gray-700/20 to-gray-600/10 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl text-[#FFF32A] mb-2 font-pixel">{item.title}</h1>
                {item.channel_name && <p className="text-[#00AEC7] font-medium">{item.channel_name}</p>}
                {item.date && (
                  <p className="text-[#00AEC7] font-medium">
                    {formatDate(item.date)}
                    {item.sender_name && ` • ${item.sender_name}`}
                  </p>
                )}
              </div>
              {item.post_link && (
                <Link
                  href={item.post_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7] hover:text-white text-sm font-medium rounded-md transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Открыть в Telegram
                </Link>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Image */}
            {item.image && (
              <div className="mb-6">
                <BlobImage
                  src={item.image}
                  alt="News image"
                  width={800}
                  height={400}
                  className="w-full max-h-96 object-cover rounded-lg border border-gray-600/30"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#FFF32A] prose-a:text-[#00AEC7] prose-strong:text-[#00AEC7] prose-p:text-gray-300 prose-li:text-gray-300"
              dangerouslySetInnerHTML={{ __html: processHtml(item.content) }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
