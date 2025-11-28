"use client"

import { useEffect } from "react"
import { trackGaEvent } from "@/shared/providers/analytics"

type ArticleViewTrackerProps = {
  slug: string
  title: string
}

export function ArticleViewTracker({ slug, title }: ArticleViewTrackerProps) {
  useEffect(() => {
    trackGaEvent("article_view", {
      page_path: `/articles/${slug}`,
      article_slug: slug,
      article_title: title,
    })
  }, [slug, title])

  useEffect(() => {
    const thresholds = [25, 50, 75, 100]
    const seen = new Set<number>()

    const handleScroll = () => {
      if (typeof document === "undefined") return
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      const clientHeight = document.documentElement.clientHeight || window.innerHeight
      const percent = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100))

      thresholds.forEach((threshold) => {
        if (percent >= threshold && !seen.has(threshold)) {
          seen.add(threshold)
          trackGaEvent("scroll_depth", {
            page_path: `/articles/${slug}`,
            page_title: title,
            article_slug: slug,
            depth: threshold,
          })
        }
      })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [slug, title])

  return null
}
