"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Search, Brain, Code, MapPin, Filter } from "lucide-react"
import Link from "next/link"
import { ServerImage } from "@/components/ui/server-image"
import { getSupabaseClient } from "@/lib/supabase-client"
import { formatJobDate, getChannelInfo, processJobHtml } from "@/lib/utils/jobs-utils"

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
}

const PAGE_SIZE = 3

export default function JobsFeedClient({
  initialJobs,
  initialTotalCount,
  initialPage,
  initialQuery,
  initialChannels,
  initialRemote,
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
      const from = (newPage - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      // Parse channel filter
      const channelIds =
        newChannels === "ml"
          ? [-1001120572276]
          : newChannels === "it"
            ? [-1001944996511]
            : [-1001120572276, -1001944996511]

      let remotePostIds: string[] = []
      if (newRemote) {
        const { data: remoteData, error: remoteError } = await supabase
          .from("job_details")
          .select("post_id")
          .ilike("location", "remote%")

        if (remoteError) {
          console.error("Error fetching remote job ids:", remoteError)
          return
        }

        remotePostIds = (remoteData || []).map((item: { post_id: string }) => item.post_id)
        if (remotePostIds.length === 0) {
          setJobs([])
          setTotalCount(0)
          return
        }
      }

      // Build the query for channels_content
      let queryBuilder = supabase
        .from("channels_content")
        .select("*", { count: "exact" })
        .in("channel_id", channelIds)
        .order("created_at", { ascending: false })

      if (newQuery) {
        queryBuilder = queryBuilder.ilike("html_text", `%${newQuery}%`)
      }

      if (newRemote && remotePostIds.length > 0) {
        queryBuilder = queryBuilder.in("post_id", remotePostIds)
      }

      const { data: channelsData, error: channelsError, count } = await queryBuilder.range(from, to)

      if (channelsError) {
        console.error("Error fetching jobs:", channelsError)
        return
      }

      // Get job details for location info
      const postIds = channelsData?.map((post: { post_id: string }) => post.post_id) || []
      const { data: jobDetailsData } = await supabase
        .from("job_details")
        .select("post_id, location")
        .in("post_id", postIds)

      // Create location map
      const locationMap = new Map<string, string | null>()
      if (jobDetailsData) {
        jobDetailsData.forEach((detail: { post_id: string; location: string | null }) => {
          locationMap.set(detail.post_id, detail.location)
        })
      }

      // Combine data
      let combinedData = (channelsData || []).map((post: JobPost) => ({
        ...post,
        location: locationMap.get(post.post_id) || null,
      })) as JobPost[]

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

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
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
            <div className="text-sm text-gray-400">Всего вакансий</div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{stats.ml}+</div>
            <div className="text-sm text-gray-400">ML вакансии</div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{stats.it}+</div>
            <div className="text-sm text-gray-400">IT вакансии</div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.remote}+</div>
            <div className="text-sm text-gray-400">Удаленные</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row sm:items-center bg-gray-900/60 border border-gray-800/70 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                defaultValue={query}
                placeholder="Поиск вакансий..."
                className="w-full rounded-xl border border-gray-800 bg-transparent py-3 pl-11 pr-4 text-white placeholder-gray-400 focus:border-[#00AEC7] focus:outline-none focus:ring-2 focus:ring-[#00AEC7]/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-[#00AEC7] px-5 py-3 text-sm font-semibold text-black shadow-md transition-colors hover:bg-[#00AEC7]/90 disabled:opacity-50"
            >
              {loading ? "..." : "Найти"}
            </button>
          </form>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Фильтры
          </button>
        </div>

        {showFilters && (
          <div className="max-w-2xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "all", label: "Все" },
                  { value: "ml", label: "ML/AI" },
                  { value: "it", label: "IT" },
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Тип работы</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRemoteFilter(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !remote ? "bg-[#00AEC7] text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  }`}
                >
                  Все
                </button>
                <button
                  onClick={() => handleRemoteFilter(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    remote ? "bg-[#00AEC7] text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  }`}
                >
                  Только удаленные
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
          <p className="mt-2 text-gray-400">Загрузка вакансий...</p>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && (
        <>
          {jobs.length === 0 ? (
            <Card className="mb-4 bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="text-center text-[#00AEC7] font-medium">
                  <p>{query ? `Ничего не найдено по запросу "${query}"` : "Вакансии временно недоступны"}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <section aria-labelledby="jobs-heading">
              <h2 id="jobs-heading" className="sr-only">
                Список вакансий
              </h2>
              <div className="space-y-8">
                {jobs.map((job, index) => {
                  const channelInfo = getChannelInfo(job.channel_id)
                  const isFirstJob = index === 0
                  const isRemote = job.location?.toLowerCase().startsWith("remote")

                  return (
                    <article
                      key={job.post_id}
                      className="relative overflow-hidden border-gray-800/70 bg-gray-900/60 shadow-xl backdrop-blur-sm rounded-3xl"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A]" />

                      <CardContent className="space-y-6 p-6 sm:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-[0.25em] text-[#00AEC7]/80">Новая вакансия</p>
                            <p className="text-lg font-semibold text-white">
                              <time dateTime={job.created_at}>{formatJobDate(job.created_at)}</time>
                            </p>
                            {job.sender_name && <p className="text-sm text-gray-400">{job.sender_name}</p>}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {isRemote && (
                              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-900/50 text-green-400 text-xs font-semibold border border-green-700">
                                <MapPin className="h-3 w-3" />
                                <span>Remote</span>
                              </div>
                            )}

                            <div
                              className={`flex items-center gap-1 px-3 py-1 rounded-full ${channelInfo.bgColor} ${channelInfo.color} border ${channelInfo.borderColor} text-xs font-semibold`}
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

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                          {job.image_url && (
                            <div className="rounded-2xl border border-gray-800/60 bg-black/20 p-3 flex justify-center lg:w-[38%] xl:w-[36%]">
                              <ServerImage
                                src={job.image_url}
                                alt="Job posting image"
                                width={600}
                                height={400}
                                priority={isFirstJob}
                                sizes="(max-width: 768px) 100vw, 360px"
                                className="w-full h-auto max-h-[400px] object-contain"
                              />
                            </div>
                          )}

                          <div className="flex-1 flex flex-col gap-4">
                            <div
                              className="prose prose-invert max-w-none prose-headings:text-[#FFF32A] prose-a:text-[#00AEC7] prose-strong:text-[#00AEC7] prose-p:text-gray-100 prose-li:text-gray-200 text-base leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: processJobHtml(job.html_text || "") }}
                            />

                            <div className="flex flex-wrap justify-between gap-3 pt-3 border-t border-gray-700/50">
                              <Link
                                href={`/jobs/${job.post_id}`}
                                className="inline-flex items-center gap-2 rounded-full border border-gray-700/80 px-4 py-2 text-sm font-semibold text-white hover:border-[#00AEC7] hover:text-[#00AEC7] transition-colors"
                              >
                                Читать отдельно
                              </Link>

                              {job.post_link && (
                                <Link
                                  href={job.post_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-full bg-[#00AEC7] px-4 py-2 text-sm font-semibold text-black hover:bg-[#00AEC7]/90 transition-colors"
                                  title="Откликнуться в Telegram"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Откликнуться
                                </Link>
                              )}
                            </div>
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
            <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
              {hasPrevPage && (
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-800/70 border border-gray-700 text-white rounded-xl hover:bg-gray-700/60 transition-colors disabled:opacity-50 text-sm font-semibold"
                >
                  ← Предыдущая
                </button>
              )}

              <span className="px-4 py-2 text-gray-300 text-sm">
                Страница {page} из {totalPages}
              </span>

              {hasNextPage && (
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={loading}
                  className="px-6 py-3 bg-[#00AEC7] text-black rounded-xl hover:bg-[#00AEC7]/90 transition-colors disabled:opacity-50 text-sm font-semibold"
                >
                  Следующая →
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
