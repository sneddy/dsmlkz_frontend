import { createServerClient } from "@/lib/supabase-server"

export type NewsItem = {
  id: string
  title: string
  excerpt?: string
  image?: string
  date?: string
}

export type NewsDetail = {
  id: string
  title: string
  content: string
  excerpt?: string
  image?: string
  date?: string
  channel_name?: string
  post_link?: string
  sender_name?: string
}

export async function getNewsList(): Promise<NewsItem[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("channels_content")
    .select("post_id, channel_name, html_text, image_url, created_at, sender_name")
    .eq("channel_id", -1001055767503)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching news list:", error)
    return []
  }

  return data.map((item) => ({
    id: item.post_id,
    title: item.channel_name || "DSML Kazakhstan",
    excerpt:
      item.html_text
        ?.replace(/<[^>]*>/g, "")
        .substring(0, 150)
        .trim() + "...",
    image: item.image_url || undefined,
    date: item.created_at,
  }))
}

export async function getNewsById(id: string): Promise<NewsDetail | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("channels_content").select("*").eq("post_id", id).single()

  if (error || !data) {
    return null
  }

  return {
    id: data.post_id,
    title: data.channel_name || "DSML Kazakhstan",
    content: data.html_text || "",
    excerpt:
      data.html_text
        ?.replace(/<[^>]*>/g, "")
        .substring(0, 150)
        .trim() + "...",
    image: data.image_url || undefined,
    date: data.created_at,
    channel_name: data.channel_name,
    post_link: data.post_link,
    sender_name: data.sender_name,
  }
}
