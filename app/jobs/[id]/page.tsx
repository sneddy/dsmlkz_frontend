"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ExternalLink, Building2, Globe } from 'lucide-react'
import Link from "next/link"
import { BlobImage } from "@/components/ui/blob-image"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useTranslation } from "@/hooks/use-translation"

type JobPosting = {
  post_id: string
  channel_id: number
  channel_name: string | null
  message_id: number | null
  image_url: string | null
  created_at: string | null
  html_text: string | null
  post_link: string | null
  is_public: boolean | null
  sender_id: number | null
  sender_name: string | null
  inserted_at: string | null
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useTranslation()
  const [job, setJob] = useState<JobPosting | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchJob = async () => {
      if (!params?.id) {
        setError(t("jobs.job_not_found"))
        setLoading(false)
        return
      }

      try {
        console.log("Fetching job with ID:", params.id)

        // Try to fetch from channels_content table which exists according to the types
        const { data, error } = await supabase
          .from("channels_content")
          .select("*")
          .eq("post_id", params.id)
          .single()

        console.log("Supabase response:", { data, error })

        if (error) {
          console.error("Supabase error:", error)
          setError(t("jobs.job_not_found"))
          return
        }

        if (!data) {
          console.log("No job data found")
          setError(t("jobs.job_not_found"))
          return
        }

        setJob(data as JobPosting)
      } catch (err) {
        console.error("Error fetching job:", err)
        setError(t("jobs.error_occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [params?.id, supabase, t])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const extractTextFromHtml = (html: string | null) => {
    if (!html) return "No description available"
    // Simple HTML tag removal - in production you might want to use a proper HTML parser
    return html.replace(/<[^>]*>/g, '').trim()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back button skeleton */}
          <div className="mb-6">
            <Skeleton className="h-10 w-32 bg-gray-700" />
          </div>

          {/* Main card skeleton */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-xl bg-gray-600" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-3/4 bg-gray-600" />
                  <Skeleton className="h-6 w-1/2 bg-gray-600" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 bg-gray-600" />
                    <Skeleton className="h-6 w-24 bg-gray-600" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 bg-gray-600" />
                      <Skeleton className="h-5 w-32 bg-gray-600" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 bg-gray-600" />
                      <Skeleton className="h-5 w-28 bg-gray-600" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-600" />
                  <Skeleton className="h-4 w-full bg-gray-600" />
                  <Skeleton className="h-4 w-3/4 bg-gray-600" />
                </div>
              </div>
              <Skeleton className="h-12 w-full bg-gray-600" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-6 text-[#00AEC7] hover:text-[#00AEC7]/80 hover:bg-[#00AEC7]/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("jobs.back_to_jobs")}
          </Button>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">😕</div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {t("jobs.job_not_found")}
              </h1>
              <p className="text-gray-400 mb-6">
                {t("jobs.job_not_found_description")}
              </p>
              <Link href="/jobs">
                <Button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-white">
                  {t("jobs.back_to_jobs")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-6 text-[#00AEC7] hover:text-[#00AEC7]/80 hover:bg-[#00AEC7]/10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("jobs.back_to_jobs")}
        </Button>

        {/* Main Job Card */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-6 border-b border-gray-600/30">
            <div className="flex items-start gap-4">
              {/* Company Logo */}
              {job.image_url && (
                <div className="flex-shrink-0">
                  <BlobImage
                    src={job.image_url}
                    alt="Job posting image"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-600"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                  {job.sender_name ? `Job from ${job.sender_name}` : "Job Posting"}
                </CardTitle>
                <CardDescription className="text-lg text-[#00AEC7] font-semibold mb-3">
                  {job.channel_name || "DSML Community"}
                </CardDescription>

                {/* Key badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-[#00AEC7]/20 text-[#00AEC7] border-[#00AEC7]/30">
                    <Building2 className="h-3 w-3 mr-1" />
                    {job.channel_name || "Community"}
                  </Badge>
                  {job.is_public && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-8">
            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">{t("jobs.description")}</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {extractTextFromHtml(job.html_text)}
                </p>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-6 border-t border-gray-600/30">
              {job.post_link ? (
                <Link
                  href={job.post_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none"
                >
                  {t("jobs.open_in_telegram")}
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <div className="text-center text-gray-400">
                  {t("jobs.no_application_method")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
