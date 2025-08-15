import { getSupabaseClient } from "@/lib/supabase-client"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = getSupabaseClient()

  const { data: posts } = await supabase
    .from("channels_content")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (!posts) {
    return new NextResponse("No posts found", { status: 404 })
  }

  const rssItems = posts
    .map((post) => {
      const description =
        post.html_text
          ?.replace(/<[^>]*>/g, "")
          .substring(0, 300)
          .trim() + "..." || ""
      const pubDate = new Date(post.created_at).toUTCString()

      return `
    <item>
      <title><![CDATA[${post.channel_name || "DSML Kazakhstan News"}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>https://dsml.kz/news/${post.post_id}</link>
      <guid>https://dsml.kz/news/${post.post_id}</guid>
      <pubDate>${pubDate}</pubDate>
      ${post.image_url ? `<enclosure url="${post.image_url}" type="image/jpeg" />` : ""}
    </item>`
    })
    .join("")

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DSML Kazakhstan News</title>
    <description>Последние новости от сообщества DSML Kazakhstan</description>
    <link>https://dsml.kz/news</link>
    <atom:link href="https://dsml.kz/news.xml" rel="self" type="application/rss+xml" />
    <language>ru-RU</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  })
}
