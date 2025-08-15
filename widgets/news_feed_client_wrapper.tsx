"use client"

import dynamic from "next/dynamic"

const NewsFeedClient = dynamic(
  () => import("@/components/news-feed-client").then((mod) => ({ default: mod.NewsFeedClient })),
  {
    ssr: false,
    loading: () => null,
  },
)

export function NewsFeedClientWrapper() {
  return <NewsFeedClient />
}
