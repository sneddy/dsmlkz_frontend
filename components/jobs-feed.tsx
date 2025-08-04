"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExternalLink, ChevronDown, Briefcase, Brain, Code, Filter, MapPin, Search, X } from "lucide-react"
import Link from "next/link"
import { BlobImage } from "@/components/ui/blob-image"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useTranslation } from "@/hooks/use-translation"

type TelegramPost = {
  post_id: string
  channel_name: string
  channel_id: number
  message_id: number
  image_url: string | null
  created_at: string
  html_text: string
  post_link: string | null
  sender_name: string | null
  location?: string | null
}

type JobsFeedProps = {
  channelIds: number[]
  showFullText?: boolean
}

export function JobsFeed({ channelIds, showFullText = false }: JobsFeedProps) {
  const [posts, setPosts] = useState<TelegramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedChannels, setSelectedChannels] = useState<number[]>(channelIds)
  const [showRemoteOnly, setShowRemoteOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const postsPerPage = 9
  const { t } = useTranslation()
  const supabase = getSupabaseClient()

  // Mock stats - replace with actual data from your API
  const stats = {
    total: 500,
    ml: 300,
    it: 200,
    remote: 150,
  }

  const fetchPosts = async (
    pageNumber = 1,
    append = false,
    channels = selectedChannels,
    remoteOnly = showRemoteOnly,
    search = searchQuery,
  ) => {
    try {
      if (pageNumber === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const offset = (pageNumber - 1) * postsPerPage

      // Build the query
      let query = supabase
        .from("channels_content")
        .select("*")
        .in("channel_id", channels)
        .order("created_at", { ascending: false })

      // Add search filter if search query exists
      if (search && search.trim()) {
        query = query.ilike("html_text", `%${search.trim()}%`)
      }

      const { data: channelsData, error: channelsError } = await query.range(offset, offset + postsPerPage - 1)

      if (channelsError) {
        throw channelsError
      }

      // Get post_ids for the job_details lookup
      const postIds = channelsData.map((post) => post.post_id)

      // Get job details for these posts
      const { data: jobDetailsData, error: jobDetailsError } = await supabase
        .from("job_details")
        .select("post_id, location")
        .in("post_id", postIds)

      if (jobDetailsError) {
        console.warn("Error fetching job details:", jobDetailsError)
      }

      // Create a map of post_id to location for quick lookup
      const locationMap = new Map()
      if (jobDetailsData) {
        jobDetailsData.forEach((detail) => {
          locationMap.set(detail.post_id, detail.location)
        })
      }

      // Combine the data
      let combinedData = channelsData.map((post) => ({
        ...post,
        location: locationMap.get(post.post_id) || null,
      })) as TelegramPost[]

      // Filter remote jobs if needed
      if (remoteOnly) {
        combinedData = combinedData.filter((post) => post.location?.toLowerCase().startsWith("remote"))
      }

      setHasMore(channelsData.length === postsPerPage)

      if (append) {
        setPosts((prevPosts) => [...prevPosts, ...combinedData])
      } else {
        setPosts(combinedData)
      }
    } catch (err) {
      console.error("Error fetching jobs:", err)
      setError(t("jobs.failed_to_load"))
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchPosts(1, false, selectedChannels, showRemoteOnly, searchQuery)
  }, [selectedChannels, showRemoteOnly, searchQuery])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage, true, selectedChannels, showRemoteOnly, searchQuery)
  }

  const handleChannelFilter = (channelId: number) => {
    if (selectedChannels.includes(channelId)) {
      // Remove channel if already selected
      const newChannels = selectedChannels.filter((id) => id !== channelId)
      setSelectedChannels(newChannels.length > 0 ? newChannels : channelIds)
    } else {
      // Add channel if not selected
      setSelectedChannels([...selectedChannels, channelId])
    }
  }

  const handleRemoteFilter = () => {
    setShowRemoteOnly(!showRemoteOnly)
  }

  const handleSearch = () => {
    setSearchQuery(searchInput.trim())
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearchInput("")
    setSearchQuery("")
  }

  const resetFilters = () => {
    setSelectedChannels(channelIds)
    setShowRemoteOnly(false)
    setSearchInput("")
    setSearchQuery("")
  }

  // Function to get channel type and icon
  const getChannelInfo = (channelId: number) => {
    if (channelId === -1001120572276) {
      return {
        type: "ML Jobs",
        icon: Brain,
        color: "text-purple-400",
        bgColor: "bg-purple-900/50",
        borderColor: "border-purple-700",
      }
    } else if (channelId === -1001944996511) {
      return {
        type: "IT Jobs",
        icon: Code,
        color: "text-blue-400",
        bgColor: "bg-blue-900/50",
        borderColor: "border-blue-700",
      }
    }
    return {
      type: "General",
      icon: Briefcase,
      color: "text-gray-400",
      bgColor: "bg-gray-800",
      borderColor: "border-gray-600",
    }
  }

  // Function to truncate text with overflow check
  const truncateText = (html: string, maxLength = 560) => {
    // Remove HTML tags
    let text = html.replace(/<br\s*\/?>/gi, " ")
    text = text.replace(/<[^>]*>?/gm, "")
    text = text.replace(/\s+/g, " ").trim()

    if (text.length <= maxLength) return { text, isTruncated: false }

    // Find good break point
    let breakPoint = text.lastIndexOf(" ", maxLength - 3)
    if (breakPoint === -1) breakPoint = maxLength - 3

    return {
      text: text.substring(0, breakPoint) + "...",
      isTruncated: true,
    }
  }

  // Compact date format with translations
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return t("jobs.yesterday")
    if (diffDays < 7) return `${diffDays} ${t("jobs.days_ago")}`

    // For dates older than a week, show day and month with translation
    const day = date.getDate()
    const month = date.getMonth()

    const monthKeys = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
    const monthKey = monthKeys[month]
    const monthName = t(`jobs.months.${monthKey}`)

    return `${day} ${monthName}`
  }

  if (error) {
    return (
      <Card className="mb-4 bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="text-center text-[#00AEC7] font-medium">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFF32A] mb-1">{stats.total}+</div>
            <div className="text-sm text-gray-400">{t("jobs.total_jobs")}</div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{stats.ml}+</div>
            <div className="text-sm text-gray-400">{t("jobs.ml_jobs")}</div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{stats.it}+</div>
            <div className="text-sm text-gray-400">{t("jobs.it_jobs")}</div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.remote}+</div>
            <div className="text-sm text-gray-400">{t("jobs.remote_jobs")}</div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-300 font-medium">
            <Search className="h-5 w-5" />
            <span>{t("jobs.search_job")}:</span>
          </div>

          <div className="flex-1 flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={t("jobs.search_placeholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#00AEC7] focus:ring-[#00AEC7]/20 pr-10"
              />
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-gray-900 px-6"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {searchQuery && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <span>{t("jobs.searching_for")}:</span>
            <span className="bg-[#00AEC7]/20 text-[#00AEC7] px-2 py-1 rounded-md font-medium">"{searchQuery}"</span>
            <button onClick={clearSearch} className="text-gray-400 hover:text-gray-200 transition-colors ml-2">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Channel Filter */}
      <div className="flex flex-wrap gap-3 items-center justify-center bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
        <div className="flex items-center gap-2 text-gray-300 font-medium">
          <Filter className="h-4 w-4" />
          <span>{t("jobs.filter_by_channel")}:</span>
        </div>

        {/* ML Jobs Filter */}
        <button
          onClick={() => handleChannelFilter(-1001120572276)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            selectedChannels.includes(-1001120572276)
              ? "bg-purple-600 text-white border-2 border-purple-500"
              : "bg-gray-700 text-gray-300 border-2 border-transparent hover:bg-purple-600/20 hover:text-purple-400"
          }`}
        >
          <Brain className="h-4 w-4" />
          <span>{t("jobs.mlJobs")}</span>
        </button>

        {/* IT Jobs Filter */}
        <button
          onClick={() => handleChannelFilter(-1001944996511)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            selectedChannels.includes(-1001944996511)
              ? "bg-blue-600 text-white border-2 border-blue-500"
              : "bg-gray-700 text-gray-300 border-2 border-transparent hover:bg-blue-600/20 hover:text-blue-400"
          }`}
        >
          <Code className="h-4 w-4" />
          <span>{t("jobs.itJobs")}</span>
        </button>

        {/* Remote Jobs Filter */}
        <button
          onClick={handleRemoteFilter}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            showRemoteOnly
              ? "bg-green-600 text-white border-2 border-green-500"
              : "bg-gray-700 text-gray-300 border-2 border-transparent hover:bg-green-600/20 hover:text-green-400"
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>{t("jobs.remoteJobs")}</span>
        </button>

        {/* Reset Filter */}
        {(selectedChannels.length !== channelIds.length || showRemoteOnly || searchQuery) && (
          <button onClick={resetFilters} className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 underline">
            {t("jobs.show_all")}
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card
              key={i}
              className="h-[53rem] bg-gray-800/80 border-gray-700 shadow-lg rounded-xl overflow-hidden animate-pulse"
            >
              <div className="h-1 bg-gradient-to-r from-gray-600 to-gray-500"></div>
              <CardHeader className="bg-gradient-to-r from-gray-800/10 to-gray-800/5 backdrop-blur-sm pb-3 border-b border-gray-700">
                <Skeleton className="h-3 w-20 bg-gray-600" />
              </CardHeader>
              <CardContent className="pt-4">
                <Skeleton className="h-[26rem] w-full mb-4 rounded-xl bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-600" />
                  <Skeleton className="h-4 w-full bg-gray-600" />
                  <Skeleton className="h-4 w-3/4 bg-gray-600" />
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                  <Skeleton className="h-12 w-32 rounded-xl bg-gray-600" />
                  <Skeleton className="h-12 w-24 rounded-xl bg-gray-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {posts.length === 0 ? (
            <Card className="mb-4 bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-center text-[#00AEC7] font-medium">
                  <p>{searchQuery ? t("jobs.no_search_results") : t("jobs.no_posts_available")}</p>
                  {searchQuery && <p className="text-sm text-gray-400 mt-2">{t("jobs.try_different_search")}</p>}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Grid of cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => {
                  const { text, isTruncated } = truncateText(post.html_text || "")
                  const channelInfo = getChannelInfo(post.channel_id)
                  const ChannelIcon = channelInfo.icon
                  const isRemote = post.location?.toLowerCase().startsWith("remote")

                  return (
                    <Card
                      key={post.post_id}
                      className="h-[53rem] bg-gray-800/80 border-gray-700 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col group"
                      style={{
                        animationDelay: `${posts.indexOf(post) * 50}ms`,
                        transform: "translateZ(0)", // Force hardware acceleration
                      }}
                    >
                      {/* Gradient accent strip */}
                      <div className="h-1 bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Header with glassmorphism effect and channel badge */}
                      <CardHeader className="bg-gradient-to-r from-gray-800/10 to-gray-800/5 backdrop-blur-sm pb-3 flex-shrink-0 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                          <CardDescription className="text-[#00AEC7] font-semibold text-sm tracking-wide">
                            {formatDate(post.created_at)}
                            {post.sender_name && (
                              <span className="text-gray-400 font-normal ml-2">• {post.sender_name}</span>
                            )}
                          </CardDescription>

                          <div className="flex items-center gap-2">
                            {/* Remote badge */}
                            {isRemote && (
                              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-900/50 text-green-400 text-xs font-medium border border-green-700">
                                <MapPin className="h-3 w-3" />
                                <span>{t("jobs.remote")}</span>
                              </div>
                            )}

                            {/* Channel type badge */}
                            <div
                              className={`flex items-center gap-1 px-2 py-1 rounded-full ${channelInfo.bgColor} ${channelInfo.color} border ${channelInfo.borderColor} text-xs font-medium`}
                            >
                              <ChannelIcon className="h-3 w-3" />
                              <span>{channelInfo.type}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      {/* Content with improved spacing */}
                      <CardContent className="pt-4 pb-6 flex-1 flex flex-col space-y-4">
                        {/* Enhanced image with modern hover effects - SQUARE ASPECT RATIO */}
                        {post.image_url && (
                          <div className="w-full aspect-square flex-shrink-0 relative group/image cursor-pointer overflow-hidden rounded-xl shadow-md">
                            <BlobImage
                              src={post.image_url}
                              alt="Job posting image"
                              width={400}
                              height={400}
                              className="w-full h-full object-cover transition-all duration-500 ease-out group-hover/image:scale-110 group-hover/image:brightness-110"
                            />
                            {/* Subtle overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        )}

                        {/* Text content with better typography - INCREASED HEIGHT BY 40% */}
                        <div className="flex-1 flex flex-col justify-between space-y-4">
                          <div className="min-h-[11.2rem] flex items-start">
                            <p className="text-gray-300 font-medium text-sm leading-relaxed tracking-wide overflow-hidden">
                              {text}
                            </p>
                          </div>

                          {/* Modern button layout */}
                          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                            {/* Primary CTA button */}
                            <Link
                              href={`/jobs/${post.post_id}`}
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-gray-900 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none"
                            >
                              {t("jobs.read_more")}
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
                                className="inline-flex items-center px-4 py-3 border-2 border-[#00AEC7]/30 text-[#00AEC7] hover:bg-[#00AEC7] hover:text-gray-900 hover:border-[#00AEC7] text-sm font-medium rounded-xl transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none group/btn"
                                title={t("jobs.open_in_telegram")}
                              >
                                <ExternalLink className="h-4 w-4 mr-2 transition-transform duration-200 group-hover/btn:scale-110" />
                                {t("jobs.apply")}
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* "Show more" button */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    size="lg"
                    className="flex items-center gap-3 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-gray-900 px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loadingMore ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
                        {t("jobs.loading")}
                      </>
                    ) : (
                      <>
                        {t("jobs.show_more")}
                        <ChevronDown className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-1" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
