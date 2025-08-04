"use client"

import { useTranslation } from "@/hooks/use-translation"
import { JobsFeed } from "./jobs-feed"

export function JobsFeedPage() {
  const { t } = useTranslation()

  const channelIds = [-1001120572276, -1001944996511]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#00AEC7] to-[#FFF32A] py-16 px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight font-pixel">
            {t("jobs.main_title")}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t("jobs.subtitle_line1")} <br />
            <span className="font-semibold">{t("jobs.subtitle_line2")}</span>
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/30">
              500+ {t("jobs.total_jobs")}
            </span>
            <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/30">
              {t("jobs.remote_jobs")} Available
            </span>
          </div>
        </div>
      </div>

      {/* Jobs Feed */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <JobsFeed channelIds={channelIds} />
      </div>

      {/* Call to Action Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4 font-pixel">{t("jobs.postJob")}</h2>
          <p className="text-xl text-gray-300 mb-2">{t("jobs.postJobDesc")}</p>
          <p className="text-gray-400 mb-8">{t("jobs.postJobContent")}</p>
          <a
            href="mailto:contact@dsml.kz"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            {t("jobs.contactToPost")}
          </a>
        </div>
      </div>
    </div>
  )
}
