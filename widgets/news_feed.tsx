import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Search } from "lucide-react"
import Link from "next/link"
import { ServerImage } from "@/components/ui/server-image"
import { createServerClient } from "@/lib/supabase-server"
import { formatDate } from "@/lib/utils/text-utils"

export const revalidate = 60

const PAGE_SIZE = 3

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

async function fetchPosts(page = 1, query = ""): Promise<{ posts: TelegramPost[]; totalCount: number }> {
  try {
    const supabase = await createServerClient()
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let queryBuilder = supabase
      .from("channels_content")
      .select("*", { count: "exact" })
      .eq("channel_id", -1001055767503)
      .order("created_at", { ascending: false })

    if (query) {
      queryBuilder = queryBuilder.ilike("html_text", `%${query}%`)
    }

    const { data, error, count } = await queryBuilder.range(from, to)

    if (error) {
      console.error("Error fetching news:", error)
      return { posts: [], totalCount: 0 }
    }

    return { posts: data as TelegramPost[], totalCount: count || 0 }
  } catch (err) {
    console.error("Error fetching news:", err)
    return { posts: [], totalCount: 0 }
  }
}

const processHtml = (html: string) => {
  return html.replace(/\n/g, "<br />").replace(/<br \/><br \/>/g, "</p><p>")
}

export default async function NewsFeed({ page = 1, query = "" }: { page?: number; query?: string }) {
  const { posts, totalCount } = await fetchPosts(page, query)
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  if (posts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="max-w-3xl mx-auto">
          <form
            method="GET"
            className="flex flex-col gap-3 sm:flex-row sm:items-center bg-gray-900/60 border border-gray-800/70 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Поиск новостей..."
                className="w-full rounded-xl border border-gray-800 bg-transparent py-3 pl-11 pr-4 text-white placeholder-gray-400 focus:border-[#00AEC7] focus:outline-none focus:ring-2 focus:ring-[#00AEC7]/50"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-[#00AEC7] px-5 py-3 text-sm font-semibold text-black shadow-md transition-colors hover:bg-[#00AEC7]/90"
            >
              Найти
            </button>
          </form>
        </div>

        <Card className="mb-4 bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center text-[#00AEC7] font-medium">
              <p>{query ? `Ничего не найдено по запросу "${query}"` : "Новости временно недоступны"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="max-w-3xl mx-auto">
        <form
          method="GET"
          className="flex flex-col gap-3 sm:flex-row sm:items-center bg-gray-900/60 border border-gray-800/70 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Поиск новостей..."
              className="w-full rounded-xl border border-gray-800 bg-transparent py-3 pl-11 pr-4 text-white placeholder-gray-400 focus:border-[#00AEC7] focus:outline-none focus:ring-2 focus:ring-[#00AEC7]/50"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-[#00AEC7] px-5 py-3 text-sm font-semibold text-black shadow-md transition-colors hover:bg-[#00AEC7]/90"
          >
            Найти
          </button>
        </form>
      </div>

      <div className="space-y-8">
        {posts.map((post, index) => {
          const isFirstPost = index === 0
          return (
            <Card
              key={post.post_id}
              className="relative overflow-hidden border-gray-800/70 bg-gray-900/60 shadow-xl backdrop-blur-sm rounded-3xl"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A]" />
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#00AEC7]/80">Свежая новость</p>
                    <p className="text-lg font-semibold text-white">{formatDate(post.created_at)}</p>
                    {post.sender_name && <p className="text-sm text-gray-400">{post.sender_name}</p>}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/news/${post.post_id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-700/80 px-4 py-2 text-sm font-semibold text-white hover:border-[#00AEC7] hover:text-[#00AEC7] transition-colors"
                    >
                      Читать отдельно
                    </Link>
                    {post.post_link && (
                      <Link
                        href={post.post_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#00AEC7] px-4 py-2 text-sm font-semibold text-black hover:bg-[#00AEC7]/90 transition-colors"
                        title="Открыть в Telegram"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Telegram
                      </Link>
                    )}
                  </div>
                </div>

                {post.image_url && (
                  <div className="rounded-2xl border border-gray-800/60 bg-black/20 p-3">
                    <ServerImage
                      src={post.image_url}
                      alt="Post image"
                      width={1200}
                      height={800}
                      priority={isFirstPost}
                      sizes="(max-width: 768px) 100vw, 720px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                )}

                <div
                  className="prose prose-invert max-w-none prose-headings:text-[#FFF32A] prose-a:text-[#00AEC7] prose-strong:text-[#00AEC7] prose-p:text-gray-100 prose-li:text-gray-200 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: processHtml(post.html_text || "") }}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
          {hasPrevPage && (
            <Link
              href={`/news${page === 2 ? "" : `?page=${page - 1}`}${query ? `${page === 2 ? "?" : "&"}q=${encodeURIComponent(query)}` : ""}`}
              className="px-6 py-3 bg-gray-800/70 border border-gray-700 text-white rounded-xl hover:bg-gray-700/60 transition-colors text-sm font-semibold"
            >
              ← Предыдущая
            </Link>
          )}

          <span className="px-4 py-2 text-gray-300 text-sm">
            Страница {page} из {totalPages}
          </span>

          {hasNextPage && (
            <Link
              href={`/news?page=${page + 1}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
              className="px-6 py-3 bg-[#00AEC7] text-black rounded-xl hover:bg-[#00AEC7]/90 transition-colors text-sm font-semibold"
            >
              Следующая →
            </Link>
          )}
        </div>
      )}

      {hasPrevPage && (
        <link
          rel="prev"
          href={`https://www.dsml.kz/news${page === 2 ? "" : `?page=${page - 1}`}${query ? `${page === 2 ? "?" : "&"}q=${encodeURIComponent(query)}` : ""}`}
        />
      )}
      {hasNextPage && (
        <link
          rel="next"
          href={`https://www.dsml.kz/news?page=${page + 1}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
        />
      )}
    </div>
  )
}
