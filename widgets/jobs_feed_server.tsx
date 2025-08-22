import { createServerPublicClient } from "@/lib/supabase-public"
import JobsFeedDynamicWrapper from "@/widgets/jobs_feed_dynamic_wrapper"
import { unstable_cache } from 'next/cache'

// Увеличиваем время кэширования
export const revalidate = 300 // 5 минут вместо 1 минуты

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

// Оптимизируем запрос - выбираем только нужные поля
async function fetchJobs(
  page = 1,
  query = "",
  channelIds = [-1001120572276, -1001944996511],
  remoteOnly = false,
): Promise<{ jobs: JobPost[]; totalCount: number }> {
  try {
    const supabase = createServerPublicClient()
    const page_size = 9
    const from = (page - 1) * page_size
    const to = from + page_size - 1

    // Выбираем только нужные поля вместо select("*")
    let qb = supabase
      .from("channels_content")
      .select("post_id, channel_name, channel_id, message_id, image_url, created_at, html_text, post_link, sender_name", { count: "exact" })
      .in("channel_id", channelIds)
      .eq("is_public", true)
      .order("created_at", { ascending: false })

    if (query) {
      // Используем более эффективный поиск
      qb = qb.or(`html_text.ilike.%${query}%,channel_name.ilike.%${query}%`)
    }

    const { data: channelsData, error: channelsError } = await qb.range(from, to)
    if (channelsError || !channelsData) {
      console.error("Error fetching jobs:", channelsError)
      return { jobs: [], totalCount: 0 }
    }

    // Оптимизируем второй запрос - только если нужны детали
    let location_map = new Map<string, string | null>()
    if (channelsData.length > 0) {
      const postIds = channelsData.map((p) => p.post_id)
      const { data: jobDetailsData, error: detailsError } = await supabase
        .from("job_details")
        .select("post_id, location")
        .in("post_id", postIds)
      
      if (!detailsError && jobDetailsData) {
        location_map = new Map(
          jobDetailsData.map((d: any) => [d.post_id, d.location])
        )
      }
    }

    // Объединяем данные
    const combined = channelsData.map((post: any) => ({
      ...post,
      location: location_map.get(post.post_id) ?? null,
    })) as JobPost[]

    // Фильтруем remote на сервере если возможно
    const finalJobs = remoteOnly 
      ? combined.filter((p) => p.location?.toLowerCase().includes("remote"))
      : combined

    // Получаем общее количество (кэшируем)
    const { count } = await qb.range(0, 0) // Только count

    return { jobs: finalJobs, totalCount: count || 0 }
  } catch (err) {
    console.error("Error fetching jobs:", err)
    return { jobs: [], totalCount: 0 }
  }
}

const getCachedJobs = unstable_cache(
  async (page: number, query: string, channelIds: number[], remoteOnly: boolean) => {
    return fetchJobs(page, query, channelIds, remoteOnly)
  },
  ['jobs-feed'],
  { revalidate: 300 } // 5 минут
)

interface JobsFeedServerProps {
  searchParams: Promise<{ page?: string; search?: string; channels?: string; remote?: string }>
  translations: any
}

export default async function JobsFeedServer({ 
  searchParams, 
  translations 
}: JobsFeedServerProps) {
  const { page: pageParam, search: searchParam, channels: channelsParam, remote: remoteParam } = await searchParams
  
  const page = Number.parseInt(pageParam || "1", 10)
  const query = searchParam || ""
  const channels = channelsParam || "all"
  const remote = remoteParam === "true"

  const channelIds =
    channels === "ml" ? [-1001120572276] : channels === "it" ? [-1001944996511] : [-1001120572276, -1001944996511]

  const { jobs, totalCount } = await getCachedJobs(page, query, channelIds, remote)

  return (
    <JobsFeedDynamicWrapper
      initialJobs={jobs}
      initialTotalCount={totalCount}
      initialPage={page}
      initialQuery={query}
      initialChannels={channels}
      initialRemote={remote}
      translations={translations}
    />
  )
}
