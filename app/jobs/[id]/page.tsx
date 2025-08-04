"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, MapPin, Calendar, User, Building, Briefcase, Brain, Code } from "lucide-react"
import Link from "next/link"
import { BlobImage } from "@/components/ui/blob-image"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useTranslation } from "@/hooks/use-translation"

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
  company?: string | null
  position?: string | null
  salary?: string | null
}

export default function JobDetailPage() {
  const params = useParams()
  const { t } = useTranslation()
  const [job, setJob] = useState<JobPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching job with ID:", params.id)

        if (!params.id) {
          throw new Error("No job ID provided")
        }

        // Get the job post from channels_content
        const { data: jobData, error: jobError } = await supabase
          .from("channels_content")
          .select("*")
          .eq("post_id", params.id)
          .single()

        console.log("Job data:", jobData)
        console.log("Job error:", jobError)

        if (jobError) {
          if (jobError.code === "PGRST116") {
            throw new Error("Job not found")
          }
          throw jobError
        }

        if (!jobData) {
          throw new Error("Job not found")
        }

        // Get job details (optional)
        const { data: jobDetailsData, error: jobDetailsError } = await supabase
          .from("job_details")
          .select("*")
          .eq("post_id", params.id)
          .maybeSingle()

        if (jobDetailsError) {
          console.warn("Error fetching job details:", jobDetailsError)
        }

        // Combine the data
        const combinedJob = {
          ...jobData,
          location: jobDetailsData?.location || null,
          company: jobDetailsData?.company || null,
          position: jobDetailsData?.position || null,
          salary: jobDetailsData?.salary || null,
        } as JobPost

        console.log("Combined job:", combinedJob)
        setJob(combinedJob)
      } catch (err) {
        console.error("Error fetching job:", err)
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchJob()
    }
  }, [params.id, supabase])

  const getChannelInfo = (channelId: number) => {
    if (channelId === -1001120572276) {
      return {
        type: "ML Jobs",
        icon: Brain,
        color: "text-purple-400",
        bgColor: "bg-purple-900/50",
        borderColor: "border-purple-700",
      }
    } else if (channelId === -1001944996511) {
      return {
        type: "IT Jobs",
        icon: Code,
        color: "text-blue-400",
        bgColor: "bg-blue-900/50",
        borderColor: "border-blue-700",
      }
    }
    return {
      type: "General",
      icon: Briefcase,
      color: "text-gray-400",
      bgColor: "bg-gray-800",
      borderColor: "border-gray-600",
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button Skeleton */}
          <div className="h-6 w-32 bg-gray-700 rounded mb-6 animate-pulse"></div>

          <Card className="bg-gray-800/80 border-gray-700 shadow-xl">
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-20 bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-600 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-3/4 bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-5 w-1/2 bg-gray-600 rounded animate-pulse"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 w-24 bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-600 rounded animate-pulse"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="w-full max-w-2xl mx-auto h-96 bg-gray-600 rounded-lg animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-600 rounded animate-pulse"></div>
                </div>
                <div className="flex gap-4 pt-6 border-t border-gray-700">
                  <div className="h-12 w-32 bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-12 w-40 bg-gray-600 rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            href="/jobs"
            className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("jobs.back_to_jobs") || "Back to Jobs"}
          </Link>

          <Card className="bg-gray-800/80 border-gray-700 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="text-6xl">😔</div>
                <h2 className="text-2xl font-bold text-white">
                  {error === "Job not found"
                    ? t("jobs.job_not_found") || "Job Not Found"
                    : t("jobs.error_occurred") || "An Error Occurred"}
                </h2>
                <p className="text-gray-400">
                  {error === "Job not found"
                    ? t("jobs.job_not_found_desc") || "The job you're looking for doesn't exist or has been removed."
                    : t("jobs.error_occurred_desc") || "Something went wrong while loading the job details."}
                </p>
                <div className="pt-4">
                  <Link href="/jobs">
                    <Button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-gray-900 hover:scale-105 transition-transform">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t("jobs.back_to_jobs") || "Back to Jobs"}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const channelInfo = getChannelInfo(job.channel_id)
  const ChannelIcon = channelInfo.icon
  const isRemote = job.location?.toLowerCase().includes("remote")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/jobs"
          className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("jobs.back_to_jobs") || "Back to Jobs"}
        </Link>

        <Card className="bg-gray-800/80 border-gray-700 shadow-xl">
          {/* Header */}
          <CardHeader className="border-b border-gray-700">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={`${channelInfo.bgColor} ${channelInfo.color} border ${channelInfo.borderColor}`}>
                    <ChannelIcon className="h-3 w-3 mr-1" />
                    {channelInfo.type}
                  </Badge>
                  {isRemote && (
                    <Badge className="bg-green-900/50 text-green-400 border border-green-700">
                      <MapPin className="h-3 w-3 mr-1" />
                      {t("jobs.remote")}
                    </Badge>
                  )}
                </div>
                {job.position && <CardTitle className="text-2xl text-white">{job.position}</CardTitle>}
                {job.company && (
                  <p className="text-gray-400 flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    {job.company}
                  </p>
                )}
              </div>
              <div className="text-right text-sm text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(job.created_at)}
                </div>
                {job.sender_name && (
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-1" />
                    {job.sender_name}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Job Image */}
              {job.image_url && (
                <div className="w-full max-w-2xl mx-auto">
                  <BlobImage
                    src={job.image_url}
                    alt="Job posting"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.location && (
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-5 w-5 mr-3 text-[#00AEC7]" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center text-gray-300">
                    <Briefcase className="h-5 w-5 mr-3 text-[#00AEC7]" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div className="prose prose-invert max-w-none">
                <div
                  className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: job.html_text || "" }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
                {job.post_link && (
                  <Link href={job.post_link} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-gray-900 hover:scale-105 transition-transform">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t("jobs.apply")}
                    </Button>
                  </Link>
                )}
                {job.post_link && (
                  <Link href={job.post_link} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7] hover:text-gray-900 bg-transparent"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t("jobs.open_in_telegram")}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
