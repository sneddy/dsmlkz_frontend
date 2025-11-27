"use client"

import JobsFeedClient from "@/components/jobs-feed-client"

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
}

export default function JobsFeedClientWrapper(props: JobsFeedClientWrapperProps) {
  return <JobsFeedClient {...props} />
}
