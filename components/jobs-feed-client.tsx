"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { ExternalLink, Search, Brain, Code, MapPin, Filter } from "lucide-react"
import Link from "next/link"
import { ServerImage } from "@/components/ui/server-image"
import { getSupabaseClient } from "@/lib/supabase-client"
import { getChannelInfo, truncateJobText } from "@/lib/utils/jobs-utils"

type JobPost = {
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

interface JobsFeedClientProps {
  initialJobs: JobPost[]
  initialTotalCount: number
  initialPage: number
  initialQuery: string
  initialChannels: string
  initialRemote: boolean
  translations: any
}

const formatDate = (dateString: string, locale: string, t: any) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return t.jobs?.yesterday || "Yesterday"
  } else if (diffDays <= 30) {
    return `${diffDays} ${t.jobs?.days_ago || "days ago"}`
  } else {
    const monthKey = date.toLocaleDateString("en", { month: "short" }).toLowerCase()
    const month = t.jobs?.months?.[monthKey] || monthKey
    return `${date.getDate()} ${month}`
  }
}

export default function JobsFeedClient({
  initialJobs,
  initialTotalCount,
  initialPage,
  initialQuery,
  initialChannels,
  initialRemote,
  translations: t,
}: JobsFeedClientProps) {
  const [jobs, setJobs] = useState<JobPost[]>(initialJobs)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [page, setPage] = useState(initialPage)
  const [query, setQuery] = useState(initialQuery)
  const [channels, setChannels] = useState(initialChannels)
  const [remote, setRemote] = useState(initialRemote)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const fetchJobs = useCallback(async (newPage = 1, newQuery = "", newChannels = "all", newRemote = false) => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const pageSize = 9
      const from = (newPage - 1) * pageSize
      const to = from + pageSize - 1

      // Parse channel filter
      const channelIds =
        newChannels === "ml"
          ? [-1001120572276]
          : newChannels === "it"
            ? [-1001944996511]
            : [-1001120572276, -1001944996511]

      // Build the query for channels_content
      let queryBuilder = supabase
        .from("channels_content")
        .select("*", { count: "exact" })
        .in("channel_id", channelIds)
        .order("created_at", { ascending: false })

      if (newQuery) {
        queryBuilder = queryBuilder.ilike("html_text", `%${newQuery}%`)
      }

      const { data: channelsData, error: channelsError, count } = await queryBuilder.range(from, to)

      if (channelsError) {
        console.error("Error fetching jobs:", channelsError)
        return
      }

      // Get job details for location info
      const postIds = channelsData?.map((post) => post.post_id) || []
      const { data: jobDetailsData } = await supabase
        .from("job_details")
        .select("post_id, location")
        .in("post_id", postIds)

      // Create location map
      const locationMap = new Map()
      if (jobDetailsData) {
        jobDetailsData.forEach((detail) => {
          locationMap.set(detail.post_id, detail.location)
        })
      }

      // Combine data
      let combinedData = (channelsData || []).map((post) => ({
        ...post,
        location: locationMap.get(post.post_id) || null,
      })) as JobPost[]

      // Filter remote jobs if needed
      if (newRemote) {
        combinedData = combinedData.filter((post) => post.location?.toLowerCase().startsWith("remote"))
      }

      setJobs(combinedData)
      setTotalCount(count || 0)
    } catch (err) {
      console.error("Error fetching jobs:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const newQuery = searchInputRef.current?.value || ""
      setQuery(newQuery)
      setPage(1)
      fetchJobs(1, newQuery, channels, remote)
    },
    [channels, remote, fetchJobs],
  )

  const handleChannelFilter = useCallback(
    (newChannels: string) => {
      setChannels(newChannels)
      setPage(1)
      fetchJobs(1, query, newChannels, remote)
    },
    [query, remote, fetchJobs],
  )

  const handleRemoteFilter = useCallback(
    (newRemote: boolean) => {
      setRemote(newRemote)
      setPage(1)
      fetchJobs(1, query, channels, newRemote)
    },
    [query, channels, fetchJobs],
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
      fetchJobs(newPage, query, channels, remote)
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [query, channels, remote, fetchJobs],
  )

  const pageSize = 9
  const totalPages = Math.ceil(totalCount / pageSize)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  // Mock stats - replace with actual data
  const stats = {
    total: 500,
    ml: 300,
    it: 200,
    remote: 150,
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFF32A] mb-1">{stats.total}+</div>
            <div className="text-sm text-gray-400">{t.jobs?.total_jobs || "Total Jobs"}</div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{stats.ml}+</div>
            <div className="text-sm text-gray-400">{t.jobs?.ml_jobs || "ML Jobs"}</div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{stats.it}+</div>
            <div className="text-sm text-gray-400">{t.jobs?.it_jobs || "IT Jobs"}</div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.remote}+</div>
            <div className="text-sm text-gray-400">{t.jobs?.remote_jobs || "Remote Jobs"}</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={searchInputRef}
              type="text"
              defaultValue={query}
              placeholder={t.jobs?.search_placeholder || "Search jobs..."}
              className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00AEC7] focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#00AEC7] text-white text-sm font-medium rounded-lg hover:bg-[#00AEC7]/80 transition-colors disabled:opacity-50"
            >
              {loading ? t.jobs?.loading || "Loading..." : t.jobs?.search_job || "Search"}
            </button>
          </form>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            {t.jobs?.filter_by_channel || "Filter by channel"}
          </button>
        </div>

        {showFilters && (
          <div className="max-w-2xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.jobs?.filter_by_channel || "Filter by channel"}
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "all", label: t.jobs?.filter_all || "All" },
                  { value: "ml", label: t.jobs?.filter_data_ai || "ML & Data Science" },
                  { value: "it", label: t.jobs?.filter_it_dev || "IT & Development" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChannelFilter(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      channels === option.value
                        ? "bg-[#00AEC7] text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.jobs?.remote || "Remote"}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRemoteFilter(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !remote ? "bg-[#00AEC7] text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  }`}
                >
                  {t.jobs?.filter_all || "All"}
                </button>
                <button
                  onClick={() => handleRemoteFilter(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    remote ? "bg-[#00AEC7] text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  }`}
                >
                  {t.jobs?.filter_remote || "Remote only"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00AEC7]"></div>
          <p className="mt-2 text-gray-400">{t.jobs?.loading || "Loading..."}</p>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && (
        <>
          {jobs.length === 0 ? (
            <Card className="mb-4 bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="text-center text-[#00AEC7] font-medium">
                  <p>
                    {query
                      ? t.jobs?.no_search_results?.replace("{{query}}", query) || `No results found for "${query}"`
                      : t.jobs?.no_results || "No results found"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <section aria-labelledby="jobs-heading">
              <h2 id="jobs-heading" className="sr-only">
                {t.jobs?.title || "Jobs"}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job, index) => {
                  const { text } = truncateJobText(job.html_text || "")
                  const channelInfo = getChannelInfo(job.channel_id)
                  const isFirstJob = index === 0
                  const isRemote = job.location?.toLowerCase().startsWith("remote")

                  return (
                    <article
                      key={job.post_id}
                      className="h-[56rem] bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] hover:bg-gray-800/70 transition-all duration-300 ease-out flex flex-col group"
                    >
                      <div className="h-1 bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <CardHeader className="bg-gradient-to-r from-gray-700/20 to-gray-600/10 backdrop-blur-sm pb-3 flex-shrink-0 border-b border-gray-600/20">
                        <div className="flex items-center justify-between">
                          <CardDescription className="text-[#00AEC7] font-semibold text-sm tracking-wide">
                            <time dateTime={job.created_at}>{formatDate(job.created_at, "en", t)}</time>
                            {job.sender_name && (
                              <span className="text-gray-400 font-normal ml-2">• {job.sender_name}</span>
                            )}
                          </CardDescription>

                          <div className="flex items-center gap-2">
                            {isRemote && (
                              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-900/50 text-green-400 text-xs font-medium border border-green-700">
                                <MapPin className="h-3 w-3" />
                                <span>{t.jobs?.remote || "Remote"}</span>
                              </div>
                            )}

                            <div
                              className={`flex items-center gap-1 px-2 py-1 rounded-full ${channelInfo.bgColor} ${channelInfo.color} border ${channelInfo.borderColor} text-xs font-medium`}
                            >
                              {job.channel_id === -1001120572276 ? (
                                <Brain className="h-3 w-3" />
                              ) : (
                                <Code className="h-3 w-3" />
                              )}
                              <span>{channelInfo.type}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-4 pb-6 flex-1 flex flex-col space-y-2">
                        {job.image_url && (
                          <div className="w-full aspect-square flex-shrink-0 relative group/image cursor-pointer overflow-hidden rounded-xl shadow-md">
                            <ServerImage
                              src={job.image_url}
                              alt="Job posting image"
                              width={400}
                              height={400}
                              priority={isFirstJob}
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="w-full h-full object-contain transition-all duration-500 ease-out group-hover/image:scale-110 group-hover/image:brightness-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        )}

                        <div className="flex-1 flex flex-col justify-between space-y-2">
                          <p className="text-gray-300 font-medium text-sm leading-relaxed line-clamp-12 tracking-wide">
                            {text}
                          </p>

                          <div className="flex justify-between items-center pt-2 border-t border-gray-600/30">
                            <Link
                              href={`/jobs/${job.post_id}`}
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none"
                            >
                              {t.jobs?.read_more || "Read More"}
                              <svg
                                className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>

                            {job.post_link && (
                              <Link
                                href={job.post_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-3 border-2 border-[#00AEC7]/30 text-[#00AEC7] hover:bg-[#00AEC7] hover:text-white hover:border-[#00AEC7] text-sm font-medium rounded-xl transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none group/btn"
                                title={t.jobs?.open_in_telegram || "Open in Telegram"}
                              >
                                <ExternalLink className="h-4 w-4 mr-2 transition-transform duration-200 group-hover/btn:scale-110" />
                                {t.jobs?.apply || "Apply"}
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              {hasPrevPage && (
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl hover:bg-gray-700/50 transition-colors disabled:opacity-50"
                >
                  ← {t.jobs?.previous || "Previous"}
                </button>
              )}

              <span className="px-4 py-2 text-gray-300">
                {t.jobs?.page || "Page"} {page} {t.jobs?.of || "of"} {totalPages}
              </span>

              {hasNextPage && (
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={loading}
                  className="px-6 py-3 bg-[#00AEC7] text-white rounded-xl hover:bg-[#00AEC7]/80 transition-colors disabled:opacity-50"
                >
                  {t.jobs?.next || "Next"} →
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
