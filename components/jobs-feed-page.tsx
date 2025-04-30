"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/hooks/use-translation"
import { JobsFeed } from "@/components/jobs-feed"

export function JobsFeedPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("aimoldin")

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2 font-pixel text-[#FFF32A]">{t("jobs.title")}</h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-6">{t("jobs.description")}</p>
      </div>

      <Tabs defaultValue="aimoldin" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="aimoldin">{t("jobs.dataJobs")}</TabsTrigger>
          <TabsTrigger value="it">{t("jobs.itJobs")}</TabsTrigger>
        </TabsList>

        <TabsContent value="aimoldin">
          <JobsFeed channelId={-1001120572276} showFullText={true} />
        </TabsContent>

        <TabsContent value="it">
          <JobsFeed channelId={-1001944996511} showFullText={true} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
