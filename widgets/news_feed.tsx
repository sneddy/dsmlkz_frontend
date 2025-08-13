"use client"

import { useState, useCallback, useRef } from "react"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const postsPerPage = 9
  const { t } = useTranslation()
  const supabase = getSupabaseClient()
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  const fetchPosts = useCallback(
    async (pageNumber = 1, append = false, query = "") => {
      try {
        if (pageNumber === 1 && !append) {
          setLoading(true)
        } else {
          setLoadingMore(true)
        }

        const offset = (pageNumber - 1) * postsPerPage

        let supabaseQuery = supabase
          .from("channels_content")
          .select("*")
          .eq("channel_id", -1001055767503)
          .order("created_at", { ascending: false })

        // Добавляем поиск по тексту если есть запрос
        if (query.trim()) {
          supabaseQuery = supabaseQuery.ilike("html_text", `%${query.trim()}%`)
        }

        const { data, error } = await supabaseQuery.range(offset, offset + postsPerPage - 1)

        if (error) {
          throw error
        }

        setHasMore(data.length === postsPerPage)

        if (append) {
          setPosts((prevPosts) => [...prevPosts, ...(data as TelegramPost[])])
        } else {
          setPosts(data as TelegramPost[])
        }
      } catch (err) {
        console.error("Error fetching news:", err)
        setError(t("news.failed_to_load"))
      } finally {
        setLoading(false)
        setLoadingMore(false)
        setIsSearching(false)
        if (!isInitialized) {
          setIsInitialized(true)
        }
      }
    },
    [supabase, t, isInitialized],
  )

  // ... existing code continues with all the rest of the component logic ...
}
