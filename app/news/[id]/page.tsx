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

export async function generateMetadata({ params }: { params: { id: string } }) {
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
      url: `https://dsml.kz/news/${params.id}`,
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

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
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
        .substring(0, 200)
        .trim() + "..." || "",
    image: post.image_url || "",
    datePublished: post.created_at,
    dateModified: post.created_at,
    author: {
      "@type": "Organization",
      name: post.sender_name || post.channel_name || "DSML Kazakhstan",
    },
    publisher: {
      "@type": "Organization",
      name: "DSML Kazakhstan",
      logo: {
        "@type": "ImageObject",
        url: "https://dsml.kz/images/dsml-logo.png",
      },
    },
    url: `https://dsml.kz/news/${params.id}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://dsml.kz/news/${params.id}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Кнопка назад */}
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

          {/* Основная карточка новости */}
          <Card className="border-2 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="h-1 bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A]"></div>

            <CardHeader className="bg-gradient-to-r from-gray-700/20 to-gray-600/10 backdrop-blur-sm">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-[#FFF32A] mb-2 font-pixel">
                    {post.channel_name || "DSML Kazakhstan"}
                  </CardTitle>
                  <p className="text-[#00AEC7] font-medium">
                    {formatDate(post.created_at)}
                    {post.sender_name && ` • ${post.sender_name}`}
                  </p>
                </div>
                {post.post_link && (
                  <Link
                    href={post.post_link}
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
              {/* Изображение */}
              {post.image_url && (
                <div className="mb-6">
                  <BlobImage
                    src={post.image_url}
                    alt="News image"
                    width={800}
                    height={400}
                    className="w-full max-h-96 object-cover rounded-lg border border-gray-600/30"
                  />
                </div>
              )}

              {/* Контент */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-[#FFF32A] prose-a:text-[#00AEC7] prose-strong:text-[#00AEC7] prose-p:text-gray-300 prose-li:text-gray-300"
                dangerouslySetInnerHTML={{ __html: processHtml(post.html_text || "") }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
