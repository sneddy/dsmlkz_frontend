"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ExternalLink, ChevronDown } from "lucide-react"
import Link from "next/link"
import { BlobImage } from "@/components/ui/blob-image"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useTranslation } from "@/hooks/use-translation"

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

type NewsFeedProps = {
  showFullText?: boolean
}

export function NewsFeed({ showFullText = false }: NewsFeedProps) {
  const [posts, setPosts] = useState<TelegramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const postsPerPage = 9
  const { t } = useTranslation()
  const supabase = getSupabaseClient()

  const fetchPosts = async (pageNumber = 1, append = false) => {
    try {
      if (pageNumber === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const offset = (pageNumber - 1) * postsPerPage

      const { data, error } = await supabase
        .from("channels_content")
        .select("*")
        .eq("channel_id", -1001055767503)
        .order("created_at", { ascending: false })
        .range(offset, offset + postsPerPage - 1)

      if (error) {
        throw error
      }

      setHasMore(data.length === postsPerPage)

      if (append) {
        setPosts((prevPosts) => [...prevPosts, ...(data as TelegramPost[])])
      } else {
        setPosts(data as TelegramPost[])
      }
    } catch (err) {
      console.error("Error fetching news:", err)
      setError(t("news.failed_to_load"))
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage, true)
  }

  // Функция для обрезки текста с проверкой на переполнение
  const truncateText = (html: string, maxLength = 400) => {
    // Убираем HTML теги
    let text = html.replace(/<br\s*\/?>/gi, " ")
    text = text.replace(/<[^>]*>?/gm, "")
    text = text.replace(/\s+/g, " ").trim()

    if (text.length <= maxLength) return { text, isTruncated: false }

    // Находим хорошее место для обрезки
    let breakPoint = text.lastIndexOf(" ", maxLength - 3)
    if (breakPoint === -1) breakPoint = maxLength - 3

    return {
      text: text.substring(0, breakPoint) + "...",
      isTruncated: true,
    }
  }

  // Компактный формат даты с переводами
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return t("news.yesterday")
    if (diffDays < 7) return `${diffDays} ${t("news.days_ago")}`

    // Для дат старше недели показываем день и месяц с переводом
    const day = date.getDate()
    const month = date.getMonth()

    const monthKeys = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
    const monthKey = monthKeys[month]
    const monthName = t(`news.months.${monthKey}`)

    return `${day} ${monthName}`
  }

  if (error) {
    return (
      <Card className="mb-4 bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="text-center text-[#00AEC7] font-medium">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card
            key={i}
            className="h-[53rem] bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden animate-pulse"
          >
            <div className="h-1 bg-gradient-to-r from-gray-600 to-gray-500"></div>
            <CardHeader className="bg-gradient-to-r from-gray-700/20 to-gray-600/10 backdrop-blur-sm pb-3 border-b border-gray-600/20">
              <Skeleton className="h-3 w-20 bg-gray-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <Skeleton className="h-[26rem] w-full mb-4 rounded-xl bg-gray-600" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-600" />
                <Skeleton className="h-4 w-full bg-gray-600" />
                <Skeleton className="h-4 w-3/4 bg-gray-600" />
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-600">
                <Skeleton className="h-12 w-32 rounded-xl bg-gray-600" />
                <Skeleton className="h-12 w-24 rounded-xl bg-gray-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <Card className="mb-4 bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center text-[#00AEC7] font-medium">
              <p>{t("news.no_posts_available")}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Сетка карточек */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const { text, isTruncated } = truncateText(post.html_text || "")

              return (
                <Card
                  key={post.post_id}
                  className="h-[53rem] bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] hover:bg-gray-800/70 transition-all duration-300 ease-out flex flex-col group"
                  style={{
                    animationDelay: `${posts.indexOf(post) * 50}ms`,
                    transform: "translateZ(0)", // Force hardware acceleration
                  }}
                >
                  {/* Gradient accent strip */}
                  <div className="h-1 bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Header with glassmorphism effect */}
                  <CardHeader className="bg-gradient-to-r from-gray-700/20 to-gray-600/10 backdrop-blur-sm pb-3 flex-shrink-0 border-b border-gray-600/20">
                    <CardDescription className="text-[#00AEC7] font-semibold text-sm tracking-wide">
                      {formatDate(post.created_at)}
                      {post.sender_name && <span className="text-gray-400 font-normal ml-2">• {post.sender_name}</span>}
                    </CardDescription>
                  </CardHeader>

                  {/* Content with improved spacing */}
                  <CardContent className="pt-4 pb-6 flex-1 flex flex-col space-y-4">
                    {/* Enhanced image with modern hover effects */}
                    {post.image_url && (
                      <div className="w-full h-[26rem] flex-shrink-0 relative group/image cursor-pointer overflow-hidden rounded-xl shadow-md">
                        <BlobImage
                          src={post.image_url}
                          alt="Post image"
                          width={400}
                          height={416}
                          className="w-full h-full object-cover transition-all duration-500 ease-out group-hover/image:scale-110 group-hover/image:brightness-110"
                        />
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}

                    {/* Text content with better typography */}
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-gray-300 font-medium text-sm leading-relaxed line-clamp-8 tracking-wide">
                        {text}
                      </p>

                      {/* Modern button layout */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-600/30">
                        {/* Primary CTA button */}
                        <Link
                          href={`/news/${post.post_id}`}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none"
                        >
                          {t("news.read_more")}
                          <svg
                            className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>

                        {/* Secondary action button */}
                        {post.post_link && (
                          <Link
                            href={post.post_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-3 border-2 border-[#00AEC7]/30 text-[#00AEC7] hover:bg-[#00AEC7] hover:text-white hover:border-[#00AEC7] text-sm font-medium rounded-xl transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none group/btn"
                            title={t("news.open_in_telegram")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2 transition-transform duration-200 group-hover/btn:scale-110" />
                            {t("news.telegram")}
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Кнопка "Показать ещё" */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                size="lg"
                className="flex items-center gap-3 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-white px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loadingMore ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {t("news.loading")}
                  </>
                ) : (
                  <>
                    {t("news.show_more")}
                    <ChevronDown className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-1" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
