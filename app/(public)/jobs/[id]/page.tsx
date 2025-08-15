import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { formatJobDate, truncateJobText } from "@/lib/utils/jobs-utils"
import { ServerImage } from "@/components/ui/server-image"
import { ExternalLink, MapPin, Calendar, Building, Brain, Code } from "lucide-react"
import Link from "next/link"

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

async function getJob(id: string): Promise<JobPost | null> {
  try {
    const supabase = createServerClient()

    const { data: jobData, error } = await supabase.from("channels_content").select("*").eq("post_id", id).single()

    if (error || !jobData) {
      return null
    }

    // Get job details for location
    const { data: jobDetails } = await supabase.from("job_details").select("location").eq("post_id", id).single()

    return {
      ...jobData,
      location: jobDetails?.location || null,
    }
  } catch (error) {
    console.error("Error fetching job:", error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const job = await getJob(params.id)

  if (!job) {
    return {
      title: "Вакансия не найдена | DSML Kazakhstan",
      description: "Запрашиваемая вакансия не найдена или была удалена.",
    }
  }

  const { text } = truncateJobText(job.html_text || "", 160)
  const channelType = job.channel_id === -1001120572276 ? "ML" : "IT"
  const isRemote = job.location?.toLowerCase().startsWith("remote")

  const title = `${channelType} вакансия${isRemote ? " (Remote)" : ""} | DSML Kazakhstan`
  const description = text || `Актуальная ${channelType} вакансия от ${job.sender_name || job.channel_name}`

  return {
    title,
    description,
    keywords: [
      "вакансия",
      "работа",
      channelType.toLowerCase(),
      "machine learning",
      "data science",
      "IT",
      "Казахстан",
      isRemote ? "remote" : "",
      job.location || "",
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://www.dsml.kz/jobs/${params.id}`,
      siteName: "DSML Kazakhstan",
      images: job.image_url
        ? [
            {
              url: job.image_url,
              width: 1200,
              height: 630,
              alt: `${channelType} вакансия`,
            },
          ]
        : [
            {
              url: "https://www.dsml.kz/images/dsml-logo.png",
              width: 1200,
              height: 630,
              alt: "DSML Kazakhstan",
            },
          ],
      publishedTime: job.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: job.image_url ? [job.image_url] : ["https://www.dsml.kz/images/dsml-logo.png"],
    },
    alternates: {
      canonical: `https://www.dsml.kz/jobs/${params.id}`,
    },
  }
}

export default async function JobPage({
  params,
}: {
  params: { id: string }
}) {
  const job = await getJob(params.id)

  if (!job) {
    notFound()
  }

  const channelType = job.channel_id === -1001120572276 ? "ML" : "IT"
  const isRemote = job.location?.toLowerCase().startsWith("remote")
  const { text } = truncateJobText(job.html_text || "", 800)

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: `${channelType} вакансия`,
    description: text,
    datePosted: job.created_at,
    hiringOrganization: {
      "@type": "Organization",
      name: job.sender_name || job.channel_name,
    },
    jobLocation: job.location
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location,
          },
        }
      : undefined,
    employmentType: isRemote ? "CONTRACTOR" : "FULL_TIME",
    url: `https://www.dsml.kz/jobs/${params.id}`,
    image: job.image_url || "https://www.dsml.kz/images/dsml-logo.png",
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#00AEC7]">
              Главная
            </Link>
            <span>/</span>
            <Link href="/jobs" className="hover:text-[#00AEC7]">
              Вакансии
            </Link>
            <span>/</span>
            <span className="text-gray-300">{channelType} вакансия</span>
          </nav>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#00AEC7]" />
              <time dateTime={job.created_at} className="text-sm text-gray-400">
                {formatJobDate(job.created_at)}
              </time>
            </div>

            {job.sender_name && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-[#00AEC7]" />
                <span className="text-sm text-gray-400">{job.sender_name}</span>
              </div>
            )}

            {job.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#00AEC7]" />
                <span className="text-sm text-gray-400">{job.location}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {job.channel_id === -1001120572276 ? (
                <Brain className="h-4 w-4 text-purple-400" />
              ) : (
                <Code className="h-4 w-4 text-blue-400" />
              )}
              <span className="text-sm font-medium text-gray-300">{channelType}</span>
            </div>

            {isRemote && (
              <div className="px-3 py-1 bg-green-900/50 text-green-400 text-sm font-medium rounded-full border border-green-700">
                Remote
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          {job.image_url && (
            <div className="aspect-video w-full relative">
              <ServerImage
                src={job.image_url}
                alt="Job posting image"
                width={800}
                height={450}
                priority
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="p-8">
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">{job.html_text}</div>
            </div>

            {job.post_link && (
              <div className="mt-8 pt-6 border-t border-gray-600/30">
                <Link
                  href={job.post_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Откликнуться в Telegram
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center px-6 py-3 border border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7] hover:text-white rounded-xl transition-colors"
          >
            ← Все вакансии
          </Link>
        </div>
      </article>
    </>
  )
}
