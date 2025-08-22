import { getSupabaseClient } from "@/lib/supabase-client"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlobImage } from "@/components/ui/blob-image"

type TelegramPost = {
  post_id: string
  channel_name: string
  message_id: number
  image_url: string | null
  created_at: string
  html_text: string
  post_link: string | null
  sender_name: string | null
}

export async function generateMetadata({ params }: { params: { id: string; lang: string } }) {
  const supabase = getSupabaseClient()
  const { data } = await supabase
    .from("channels_content")
    .select("html_text, channel_name, image_url")
    .eq("post_id", params.id)
    .single()

  if (!data) return { title: "Новость не найдена" }

  const description =
    data.html_text
      ?.replace(/<[^>]*>/g, "")
      .substring(0, 160)
      .trim() + "..."

  const ogImage = data.image_url
    ? {
        url: data.image_url,
        width: 1200,
        height: 630,
        alt: `${data.channel_name || "DSML KZ"} - Новость`,
        type: "image/jpeg",
      }
    : null

  return {
    title: `${data.channel_name || "DSML KZ"} - Новость`,
    description: description || "Читайте последние новости от DSML Kazakhstan",
    openGraph: {
      title: `${data.channel_name || "DSML KZ"} - Новость`,
      description: description || "Читайте последние новости от DSML Kazakhstan",
      images: ogImage ? [ogImage] : [],
      type: "article",
      url: `https://dsml.kz/${params.lang}/news/${params.id}`,
      siteName: "DSML Kazakhstan",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.channel_name || "DSML KZ"} - Новость`,
      description: description || "Читайте последние новости от DSML Kazakhstan",
      images: data.image_url ? [data.image_url] : [],
      site: "@dsmlkz",
    },
  }
}

export default async function NewsDetailPage({ params }: { params: { id: string; lang: string } }) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("channels_content").select("*").eq("post_id", params.id).single()

  if (!data || error) {
    notFound()
  }

  const post = data as TelegramPost

  // Функция для форматирования даты
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

  // Обработка HTML контента
  const processHtml = (html: string) => {
    return html.replace(/\n/g, "<br />").replace(/<br \/><br \/>/g, "</p><p>")
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.channel_name || "DSML Kazakhstan News",
    description:
      post.html_text
        ?.replace(/<[^>]*>/g, "")
        .substring(0, 160)
        .trim() + "...",
    image: post.image_url ? [post.image_url] : [],
    datePublished: post.created_at,
    author: {
      "@type": "Organization",
      name: post.channel_name || "DSML Kazakhstan",
    },
    publisher: {
      "@type": "Organization",
      name: "DSML Kazakhstan",
      logo: {
        "@type": "ImageObject",
        url: "https://dsml.kz/images/dsml-logo.png",
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container py-8">
          <div className="mb-6">
            <Link
              href={`/${params.lang}/news`}
              className="inline-flex items-center text-[#00AEC7] hover:text-[#00AEC7]/80 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к новостям
            </Link>
          </div>

          <article className="max-w-4xl mx-auto">
            <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      {post.channel_name || "DSML KZ"}
                    </span>
                    {post.sender_name && (
                      <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                        {post.sender_name}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(post.created_at)}
                  </div>
                </div>
                <CardTitle className="text-2xl text-[#00AEC7]">
                  Новость от {post.channel_name || "DSML Kazakhstan"}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {post.image_url && (
                  <div className="relative">
                    <BlobImage
                      src={post.image_url}
                      alt="News image"
                      width={800}
                      height={600}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                <div
                  className="prose prose-invert max-w-none text-white"
                  dangerouslySetInnerHTML={{
                    __html: `<p>${processHtml(post.html_text || "")}</p>`,
                  }}
                />

                {post.post_link && (
                  <div className="pt-4 border-t border-gray-700">
                    <Button asChild className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-black">
                      <Link href={post.post_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Открыть оригинальный пост
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </article>
        </div>
      </div>
    </>
  )
}
