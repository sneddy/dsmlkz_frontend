"use client"

import JobsFeedClientWrapper from "@/widgets/jobs_feed_client_wrapper"

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

interface JobsFeedDynamicWrapperProps {
  initialJobs: JobPost[]
  initialTotalCount: number
  initialPage: number
  initialQuery: string
  initialChannels: string
  initialRemote: boolean
}

export default function JobsFeedDynamicWrapper(props: JobsFeedDynamicWrapperProps) {
  return <JobsFeedClientWrapper {...props} />
}
