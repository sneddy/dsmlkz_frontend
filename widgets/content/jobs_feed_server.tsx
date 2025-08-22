import { createServerPublicClient } from "@/lib/supabase-public"
import JobsFeedDynamicWrapper from "@/widgets/jobs_feed_dynamic_wrapper"

export const revalidate = 60

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

    let qb = supabase
      .from("channels_content")
      .select("*", { count: "exact" })
      .in("channel_id", channelIds)
      .eq("is_public", true)
      .order("created_at", { ascending: false })

    if (query) qb = qb.ilike("html_text", `%${query}%`)

    const { data: channelsData, error: channelsError } = await qb.range(from, to)
    if (channelsError || !channelsData) {
      console.error("Error fetching jobs:", channelsError)
      return { jobs: [], totalCount: 0 }
    }

    const postIds = channelsData.map((p) => p.post_id)
    const { data: jobDetailsData, error: detailsError } = await supabase
      .from("job_details")
      .select("post_id, location")
      .in("post_id", postIds)
    if (detailsError) console.error("job_details error:", detailsError)

    const location_map = new Map<string, string | null>(
      (jobDetailsData ?? []).map((d: any) => [d.post_id as string, d.location as string | null]),
    )

    let combined = channelsData.map((post: any) => ({
      ...post,
      location: location_map.get(post.post_id) ?? null,
    })) as JobPost[]

    if (remoteOnly) {
      combined = combined.filter((p) => p.location?.toLowerCase().startsWith("remote"))
    }

    let countQ = supabase
      .from("channels_content")
      .select("post_id", { count: "exact", head: true })
      .in("channel_id", channelIds)
      .eq("is_public", true)

    if (query) countQ = countQ.ilike("html_text", `%${query}%`)
    const { count } = await countQ

    return { jobs: combined, totalCount: count || 0 }
  } catch (err) {
    console.error("Error fetching jobs:", err)
    return { jobs: [], totalCount: 0 }
  }
}

export default async function JobsFeedServer({
  searchParams,
  locale,
  translations,
}: {
  searchParams?: { page?: string; search?: string; location?: string; type?: string }
  locale: string
  translations: any
}) {
  const page = Number.parseInt(searchParams?.page || "1", 10)
  const query = searchParams?.search || ""
  const channels = "all"
  const remote = false

  const channelIds =
    channels === "ml" ? [-1001120572276] : channels === "it" ? [-1001944996511] : [-1001120572276, -1001944996511]

  const { jobs, totalCount } = await fetchJobs(page, query, channelIds, remote)

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
