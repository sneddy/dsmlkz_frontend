"use client"

import { useState } from "react"
import { JobsFeed } from "@/components/jobs-feed"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Brain, Code, Users } from "lucide-react"

export function JobsContent() {
  const [activeTab, setActiveTab] = useState("all")
  const { t } = useTranslation()

  // Channel IDs для разных типов вакансий
  const channelIds = {
    all: -1001055767503, // Основной канал с новостями (пока используем его)
    ml: -1001055767503, // ML/Data Science вакансии
    it: -1001055767503, // IT/Development вакансии
  }

  const tabs = [
    {
      id: "all",
      label: t("jobs.all"),
      icon: Briefcase,
      channelId: channelIds.all,
    },
    {
      id: "ml",
      label: t("jobs.dataJobs"),
      icon: Brain,
      channelId: channelIds.ml,
    },
    {
      id: "it",
      label: t("jobs.itJobs"),
      icon: Code,
      channelId: channelIds.it,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
            {t("jobs.main_title")}
          </h1>
          <div className="space-y-2 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            <p>{t("jobs.subtitle_line1")}</p>
            <p>{t("jobs.subtitle_line2")}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="lg"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-white shadow-lg hover:shadow-xl"
                    : "border-2 border-[#00AEC7]/30 text-[#00AEC7] hover:bg-[#00AEC7] hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </Button>
            )
          })}
        </div>

        {/* Jobs Feed */}
        <div className="mb-12">
          <JobsFeed channelId={tabs.find((tab) => tab.id === activeTab)?.channelId || channelIds.all} />
        </div>

        {/* Call to Action Section */}
        <Card className="bg-gradient-to-r from-[#FFF32A]/10 to-[#00AEC7]/10 border-2 border-[#00AEC7]/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-[#00AEC7]" />
            </div>
            <CardTitle className="text-2xl text-[#FFF32A] mb-2">{t("jobs.postJob")}</CardTitle>
            <CardDescription className="text-[#00AEC7] text-lg">{t("jobs.postJobDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">{t("jobs.postJobContent")}</p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              {t("jobs.contactToPost")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
