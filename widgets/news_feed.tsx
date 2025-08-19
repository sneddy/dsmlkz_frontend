import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { ExternalLink, Search } from "lucide-react"
import Link from "next/link"
import { ServerImage } from "@/components/ui/server-image"
import { createServerPublicClient } from "@/lib/supabase-public"
import { truncateText } from "@/lib/utils/text-utils"

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

function formatDate(dateString: string, locale: string, tNews: any): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return tNews?.yesterday || "Yesterday"
  if (diffDays <= 7) return `${diffDays} ${tNews?.days_ago || "days ago"}`
  const month = date.getMonth()
  const monthNames = tNews?.months || {}
  const monthKeys = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]
  const monthName = monthNames[monthKeys[month]] || monthKeys[month]
  return `${date.getDate()} ${monthName} ${date.getFullYear()}`
}

async function fetchPosts(page = 1, query = ""): Promise<{ posts: TelegramPost[]; totalCount: number }> {
  const supabase = createServerPublicClient() // ← force anon (cookie-proof)
  const pageSize = 9
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let qb = supabase
    .from("channels_content")
    .select("*", { count: "exact" })
    .eq("channel_id", -1001055767503)
    .order("created_at", { ascending: false })

  if (query) qb = qb.ilike("html_text", `%${query}%`)

  const { data, error, count } = await qb.range(from, to)
  if (error || !data) {
    console.error("Error fetching news:", error)
    return { posts: [], totalCount: 0 }
  }
  return { posts: data as TelegramPost[], totalCount: count ?? 0 }
}

export default async function NewsFeed({
  initialPage = 1,
  locale,
  translations,
  searchQuery = "",
}: {
  initialPage?: number
  locale: string
  translations?: any
  searchQuery?: string
}) {
  const tn = translations?.news ?? {}
  const { posts, totalCount } = await fetchPosts(initialPage, searchQuery)

  const pageSize = 9
  const totalPages = Math.ceil(totalCount / pageSize)
  const hasNextPage = initialPage < totalPages
  const hasPrevPage = initialPage > 1

  if (posts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="max-w-md mx-auto">
          <form method="GET" className="relative">
            <input
              type="text"
              name="q"
              placeholder={tn.search_placeholder || "Search news..."}
              defaultValue={searchQuery}
              className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00AEC7] focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#00AEC7] text-white text-sm font-medium rounded-lg hover:bg-[#00AEC7]/80 transition-colors"
            >
              {tn.search_button || "Search"}
            </button>
          </form>
        </div>

        <Card className="mb-4 bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center text-[#00AEC7] font-medium">
              <p>{tn.temporarily_unavailable || "News temporarily unavailable"}</p>
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
            placeholder={tn.search_placeholder || "Search news..."}
            defaultValue={searchQuery}
            className="w-full px-4 py-3 pl-12 bg-gray-800/50 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00AEC7] focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#00AEC7] text-white text-sm font-medium rounded-lg hover:bg-[#00AEC7]/80 transition-colors"
          >
            {tn.search_button || "Search"}
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
              <div className="h-1 bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

              <CardHeader className="bg-gradient-to-r from-gray-700/20 to-gray-600/10 backdrop-blur-sm pb-3 flex-shrink-0 border-b border-gray-600/20">
                <CardDescription className="text-[#00AEC7] font-semibold text-sm tracking-wide">
                  {formatDate(post.created_at, locale, tn)}
                  {post.sender_name && <span className="text-gray-400 font-normal ml-2">• {post.sender_name}</span>}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 pb-6 flex-1 flex flex-col space-y-4">
                {post.image_url && (
                  <div className="w-full aspect-square flex-shrink-0 relative group/image overflow-hidden rounded-xl shadow-md">
                    <ServerImage
                      src={post.image_url}
                      alt="Post image"
                      width={400}
                      height={400}
                      priority={isFirstPost}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-full object-cover transition-all duration-500 ease-out group-hover/image:scale-110 group-hover/image:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <p className="text-gray-300 font-medium text-sm leading-relaxed line-clamp-12 tracking-wide">
                    {text}
                  </p>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-600/30">
                    <Link
                      href={`/${locale}/news/${post.post_id}`}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none"
                    >
                      {tn.read_more || "Read More"}
                      <svg className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              href={`/${locale}/news${initialPage === 2 ? "" : `?page=${initialPage - 1}`}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
              className="px-6 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl hover:bg-gray-700/50 transition-colors"
            >
              ← {tn.previous_page || "Previous"}
            </Link>
          )}

          <span className="px-4 py-2 text-gray-300">
            {(tn.page_info || "Page")} {initialPage} {(tn.of || "of")} {totalPages}
          </span>

          {hasNextPage && (
            <Link
              href={`/${locale}/news?page=${initialPage + 1}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
              className="px-6 py-3 bg-[#00AEC7] text-white rounded-xl hover:bg-[#00AEC7]/80 transition-colors"
            >
              {tn.next_page || "Next"} →
            </Link>
          )}
        </div>
      )}

      {hasPrevPage && (
        <link
          rel="prev"
          href={`https://www.dsml.kz/${locale}/news${initialPage === 2 ? "" : `?page=${initialPage - 1}`}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
        />
      )}
      {hasNextPage && (
        <link
          rel="next"
          href={`https://www.dsml.kz/${locale}/news?page=${initialPage + 1}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
        />
      )}
    </div>
  )
}
