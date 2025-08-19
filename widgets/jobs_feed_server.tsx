import { createServerClient } from "@/lib/supabase-server"
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
    const supabase = createServerClient()
    const pageSize = 9
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Build the query for channels_content
    let queryBuilder = supabase
      .from("channels_content")
      .select("*", { count: "exact" })
      .in("channel_id", channelIds)
      .order("created_at", { ascending: false })

    if (query) {
      queryBuilder = queryBuilder.ilike("html_text", `%${query}%`)
    }

    const { data: channelsData, error: channelsError } = await queryBuilder.range(from, to)

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

    // Create location map
    const locationMap = new Map()
    if (jobDetailsData) {
      jobDetailsData.forEach((detail) => {
        locationMap.set(detail.post_id, detail.location)
      })
    }

    // Combine data
    let combinedData = channelsData.map((post) => ({
      ...post,
      location: locationMap.get(post.post_id) || null,
    })) as JobPost[]

    // Filter remote jobs if needed
    if (remoteOnly) {
      combinedData = combinedData.filter((post) => post.location?.toLowerCase().startsWith("remote"))
    }

    // Get total count for pagination
    const { count } = await supabase
      .from("channels_content")
      .select("*", { count: "exact", head: true })
      .in("channel_id", channelIds)

    return { jobs: combinedData, totalCount: count || 0 }
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
  const channels = "all" // Default to all channels
  const remote = false // Default to all jobs

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
      translations={translations}
    />
  )
}
