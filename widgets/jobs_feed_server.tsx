import { createServerClient } from "@/lib/supabase-server"
import JobsFeedDynamicWrapper from "@/widgets/jobs_feed_dynamic_wrapper"

export const revalidate = 60

const PAGE_SIZE = 3

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
    const supabase = await createServerClient()
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let remotePostIds: string[] | null = null
    if (remoteOnly) {
      const { data: remoteData, error: remoteError } = await supabase
        .from("job_details")
        .select("post_id")
        .ilike("location", "remote%")

      if (remoteError) {
        console.error("Error fetching remote job ids:", remoteError)
        return { jobs: [], totalCount: 0 }
      }

      remotePostIds = (remoteData || []).map((item) => item.post_id)
      if (remotePostIds.length === 0) return { jobs: [], totalCount: 0 }
    }

    // Build the query for channels_content
    let queryBuilder = supabase
      .from("channels_content")
      .select("*", { count: "exact" })
      .in("channel_id", channelIds)
      .order("created_at", { ascending: false })

    if (query) {
      queryBuilder = queryBuilder.ilike("html_text", `%${query}%`)
    }

    if (remoteOnly && remotePostIds) {
      queryBuilder = queryBuilder.in("post_id", remotePostIds)
    }

    const { data: channelsData, error: channelsError, count } = await queryBuilder.range(from, to)

    if (channelsError) {
      console.error("Error fetching jobs:", channelsError)
      return { jobs: [], totalCount: 0 }
    }

    // Get job details for location info
    const postIds = channelsData.map((post) => post.post_id)
    const { data: jobDetailsData } = await supabase
      .from("job_details")
      .select("post_id, location")
      .in("post_id", postIds)

    const locationMap = new Map()
    if (jobDetailsData) {
      jobDetailsData.forEach((detail) => {
        locationMap.set(detail.post_id, detail.location)
      })
    }

    const combinedData = channelsData.map((post) => ({
      ...post,
      location: locationMap.get(post.post_id) || null,
    })) as JobPost[]

    return { jobs: combinedData, totalCount: count || 0 }
  } catch (err) {
    console.error("Error fetching jobs:", err)
    return { jobs: [], totalCount: 0 }
  }
}

export default async function JobsFeedServer({
  page = 1,
  query = "",
  channels = "all",
  remote = false,
}: {
  page?: number
  query?: string
  channels?: string
  remote?: boolean
}) {
  // Parse channel filter
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
    />
  )
}
