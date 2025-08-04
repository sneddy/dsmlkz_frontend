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
    .select("html_text, channel_name")
    .eq("post_id", params.id)
    .single()

  if (!data) return { title: "Новость не найдена" }

  // Извлекаем первые 100 символов для описания
  const description =
    data.html_text
      ?.replace(/<[^>]*>/g, "")
      .substring(0, 100)
      .trim() + "..."

  return {
    title: `${data.channel_name || "DSML KZ"} - Новость`,
    description: description || "Читайте последние новости от DSML Kazakhstan",
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Кнопка назад */}
      <div className="mb-6">
        <Link href="/news">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Назад к новостям
          </Button>
        </Link>
      </div>

      {/* Основная карточка новости */}
      <Card
        className="border-2 border-solid"
        style={{
          borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
        }}
      >
        <CardHeader className="bg-gradient-to-r from-[#FFF32A]/5 to-[#00AEC7]/5">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-[#FFF32A] mb-2">{post.channel_name || "DSML Kazakhstan"}</CardTitle>
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
                className="w-full max-h-96 object-cover rounded-lg border border-[#00AEC7]/20"
              />
            </div>
          )}

          {/* Контент */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-[#FFF32A] prose-a:text-[#00AEC7] prose-strong:text-[#00AEC7]"
            dangerouslySetInnerHTML={{ __html: processHtml(post.html_text || "") }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
