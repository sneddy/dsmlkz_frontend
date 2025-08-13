"use client"

import { JobsFeed } from "@/widgets/jobs_feed"
import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Users, TrendingUp, MapPin } from "lucide-react"

export function JobsContent() {
  const { t } = useTranslation()

  // Channel IDs for ML/Data Science and IT/Development
  const channelIds = [-1001120572276, -1001944996511]

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] rounded-lg mb-4">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600 text-sm">{t("jobs.total_jobs")}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">200+</h3>
            <p className="text-gray-600 text-sm">{t("jobs.ml_jobs_stat")}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">300+</h3>
            <p className="text-gray-600 text-sm">{t("jobs.it_jobs_stat")}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mb-4">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">150+</h3>
            <p className="text-gray-600 text-sm">{t("jobs.remote_jobs_stat")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Feed */}
      <JobsFeed channelIds={channelIds} />
    </div>
  )
}
