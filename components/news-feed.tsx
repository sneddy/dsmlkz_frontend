"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ExternalLink, ChevronDown } from "lucide-react"
import Link from "next/link"
import { BlobImage } from "@/components/ui/blob-image"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useTranslation } from "@/hooks/use-translation"

type TelegramPost = {
  post_id: string
  channel_name: string
  message_id: number
  image_url: string | null
  created_at: string
  html_text: string
  post_link: string | null
  sender_name: string | null
}

type NewsFeedProps = {
  showFullText?: boolean
}

export function NewsFeed({ showFullText = false }: NewsFeedProps) {
  const [posts, setPosts] = useState<TelegramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const postsPerPage = 5
  const { t } = useTranslation()
  const supabase = getSupabaseClient()

  // Gradient border style - same as profile card
  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
  }

  const fetchPosts = async (pageNumber = 1, append = false) => {
    try {
      if (pageNumber === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      // Calculate offset based on page number
      const offset = (pageNumber - 1) * postsPerPage

      // Fetch posts from the specified channel with pagination
      const { data, error } = await supabase
        .from("channels_content")
        .select("*")
        .eq("channel_id", -1001055767503)
        .order("created_at", { ascending: false })
        .range(offset, offset + postsPerPage - 1)

      if (error) {
        throw error
      }

      // Check if we have more posts to load
      setHasMore(data.length === postsPerPage)

      if (append) {
        setPosts((prevPosts) => [...prevPosts, ...(data as TelegramPost[])])
      } else {
        setPosts(data as TelegramPost[])
      }
    } catch (err) {
      console.error("Error fetching news:", err)
      setError("Failed to load news feed. Please try again later.")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage, true)
  }

  // Function to convert HTML to plain text and truncate if needed
  const formatText = (html: string, maxLength = 200) => {
    // First replace <br> tags with newlines for plain text
    let text = html.replace(/<br\s*\/?>/gi, "\n")
    // Then remove all other HTML tags
    text = text.replace(/<[^>]*>?/gm, "")
    // Normalize whitespace
    text = text.replace(/\s+/g, " ").trim()

    if (showFullText || text.length <= maxLength) return text

    // Find a good breaking point (end of sentence or space)
    let breakPoint = text.lastIndexOf(". ", maxLength - 3)
    if (breakPoint === -1 || breakPoint < maxLength / 2) {
      breakPoint = text.lastIndexOf(" ", maxLength - 3)
    }
    if (breakPoint === -1) breakPoint = maxLength - 3

    return text.substring(0, breakPoint) + "..."
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Process HTML to ensure line breaks are properly handled
  const processHtml = (html: string) => {
    return html
      .replace(/\n/g, "<br />") // Replace newlines with <br> tags
      .replace(/<br \/><br \/>/g, "</p><p>") // Replace double breaks with paragraph breaks
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center text-[#00AEC7] font-medium">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-4">
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="text-center text-[#00AEC7] font-medium">
              <p>No posts available at the moment.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {posts.map((post) => (
            <Card key={post.post_id} className="mb-4" style={gradientBorderStyle}>
              <CardHeader className="bg-gradient-to-r from-[#FFF32A]/10 to-[#00AEC7]/10">
                <CardTitle className="text-lg text-[#FFF32A]">{post.channel_name || "Telegram Post"}</CardTitle>
                <CardDescription className="text-[#00AEC7] font-medium">
                  {formatDate(post.created_at)}
                  {post.sender_name && ` • ${post.sender_name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Text content on the left */}
                  <div className={`flex-1 ${post.image_url ? "md:w-3/5" : "w-full"}`}>
                    {showFullText ? (
                      <div
                        className="mb-3 prose prose-compact max-w-none prose-headings:text-[#FFF32A] prose-a:text-[#00AEC7]"
                        dangerouslySetInnerHTML={{ __html: processHtml(post.html_text || "") }}
                      />
                    ) : (
                      <p className="mb-3 text-[#00AEC7] font-medium">{formatText(post.html_text || "")}</p>
                    )}
                  </div>

                  {/* Image on the right - increased from 1/3 to 2/5 (20% larger) */}
                  {post.image_url && (
                    <div className="md:w-2/5">
                      <BlobImage
                        src={post.image_url}
                        alt="Post image"
                        width={400}
                        height={200}
                        className="rounded-md w-full h-auto object-cover border-2 border-[#00AEC7]"
                      />
                    </div>
                  )}
                </div>

                {post.post_link && (
                  <Link
                    href={post.post_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#FFF32A] hover:underline mt-3 font-bold"
                  >
                    View on Telegram <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Show More Button */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-white"
              >
                {loadingMore ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    Show More <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
