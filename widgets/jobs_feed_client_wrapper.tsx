"use client"

import dynamic from "next/dynamic"

const JobsFeedClient = dynamic(() => import("@/components/jobs-feed-client"), {
  ssr: false,
  loading: () => (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00AEC7]"></div>
      <p className="mt-2 text-gray-400">Loading...</p>
    </div>
  ),
})

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

interface JobsFeedClientWrapperProps {
  initialJobs: JobPost[]
  initialTotalCount: number
  initialPage: number
  initialQuery: string
  initialChannels: string
  initialRemote: boolean
  translations: any
}

export default function JobsFeedClientWrapper(props: JobsFeedClientWrapperProps) {
  return <JobsFeedClient {...props} />
}
