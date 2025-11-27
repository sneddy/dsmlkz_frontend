import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { ExternalLink, Search } from "lucide-react"
import Link from "next/link"
import { ServerImage } from "@/components/ui/server-image"
import { createServerClient } from "@/lib/supabase-server"
import { truncateText, formatDate } from "@/lib/utils/text-utils"

export const revalidate = 60

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
    const pageSize = 9
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

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

export default async function NewsFeed({ page = 1, query = "" }: { page?: number; query?: string }) {
  const { posts, totalCount } = await fetchPosts(page, query)
  const pageSize = 9
  const totalPages = Math.ceil(totalCount / pageSize)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  if (posts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="max-w-md mx-auto">
          <form method="GET" className="relative">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Поиск новостей..."
              className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00AEC7] focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#00AEC7] text-white text-sm font-medium rounded-lg hover:bg-[#00AEC7]/80 transition-colors"
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
      <div className="max-w-md mx-auto">
        <form method="GET" className="relative">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Поиск новостей..."
            className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00AEC7] focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#00AEC7] text-white text-sm font-medium rounded-lg hover:bg-[#00AEC7]/80 transition-colors"
          >
            Найти
          </button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => {
          const { text } = truncateText(post.html_text || "")
          const isFirstPost = index === 0

          return (
            <Card
              key={post.post_id}
              className="h-[56rem] bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] hover:bg-gray-800/70 transition-all duration-300 ease-out flex flex-col group"
            >
              <div className="h-1 bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader className="bg-gradient-to-r from-gray-700/20 to-gray-600/10 backdrop-blur-sm pb-3 flex-shrink-0 border-b border-gray-600/20">
                <CardDescription className="text-[#00AEC7] font-semibold text-sm tracking-wide">
                  {formatDate(post.created_at)}
                  {post.sender_name && <span className="text-gray-400 font-normal ml-2">• {post.sender_name}</span>}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 pb-6 flex-1 flex flex-col space-y-4">
                {post.image_url && (
                  <div className="w-full aspect-square flex-shrink-0 relative group/image cursor-pointer overflow-hidden rounded-xl shadow-md">
                    <ServerImage
                      src={post.image_url}
                      alt="Post image"
                      width={400}
                      height={400}
                      priority={isFirstPost}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-full object-cover transition-all duration-500 ease-out group-hover/image:scale-110 group-hover/image:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-between space-y-2">
                  {/* увеличели количество строк с line-clamp-10 до line-clamp-12 */}
                  <p className="text-gray-300 font-medium text-sm leading-relaxed line-clamp-12 tracking-wide">
                    {text}
                  </p>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-600/30">
                    <Link
                      href={`/news/${post.post_id}`}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none"
                    >
                      Читать далее
                      <svg
                        className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    {post.post_link && (
                      <Link
                        href={post.post_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-3 border-2 border-[#00AEC7]/30 text-[#00AEC7] hover:bg-[#00AEC7] hover:text-white hover:border-[#00AEC7] text-sm font-medium rounded-xl transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none group/btn"
                        title="Открыть в Telegram"
                      >
                        <ExternalLink className="h-4 w-4 mr-2 transition-transform duration-200 group-hover/btn:scale-110" />
                        Telegram
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          {hasPrevPage && (
            <Link
              href={`/news${page === 2 ? "" : `?page=${page - 1}`}${query ? `${page === 2 ? "?" : "&"}q=${encodeURIComponent(query)}` : ""}`}
              className="px-6 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl hover:bg-gray-700/50 transition-colors"
            >
              ← Предыдущая
            </Link>
          )}

          <span className="px-4 py-2 text-gray-300">
            Страница {page} из {totalPages}
          </span>

          {hasNextPage && (
            <Link
              href={`/news?page=${page + 1}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
              className="px-6 py-3 bg-[#00AEC7] text-white rounded-xl hover:bg-[#00AEC7]/80 transition-colors"
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
