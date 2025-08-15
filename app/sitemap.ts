import { getSupabaseClient } from "@/lib/supabase-client"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getSupabaseClient()

  // Get all news posts for sitemap
  const { data: posts } = await supabase
    .from("channels_content")
    .select("post_id, created_at")
    .order("created_at", { ascending: false })

  const newsUrls =
    posts?.map((post) => ({
      url: `https://dsml.kz/news/${post.post_id}`,
      lastModified: new Date(post.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || []

  return [
    {
      url: "https://dsml.kz",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://dsml.kz/news",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...newsUrls,
  ]
}
