"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/hooks/use-translation"

export function RulesContent() {
  const { t } = useTranslation()

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
  }

  // Array of only the recently added community values
  const communityValues = [
    "respectfulCommunication",
    "supportingNewcomers",
    "celebratingSuccess",
    "realConnections",
    "beyondAI",
  ]

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2 font-pixel text-[#FFF32A]">{t("rules.title")}</h1>
        <p className="text-[#00AEC7] text-center max-w-2xl mb-6 font-medium">{t("rules.description")}</p>
      </div>

      {/* Removed the welcome card section as requested */}

      <Tabs defaultValue="greeting" className="w-full mb-12">
        <TabsList className="grid grid-cols-3 mb-8 bg-gradient-to-r from-[#FFF32A]/20 to-[#00AEC7]/20">
          <TabsTrigger value="greeting" className="data-[state=active]:bg-[#FFF32A] data-[state=active]:text-black">
            {t("rules.greetingTitle")}
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-[#00AEC7] data-[state=active]:text-white">
            {t("rules.content")}
          </TabsTrigger>
          <TabsTrigger
            value="moderation"
            className="data-[state=active]:bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] data-[state=active]:text-white"
          >
            {t("rules.moderationTitle")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="greeting">
          <Card className="border-[#FFF32A] border-2">
            <CardHeader className="bg-[#FFF32A]/10">
              <CardTitle className="text-[#FFF32A]">{t("rules.greetingTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[#00AEC7] font-medium">{t("rules.greetingDescription")}</p>
              <p className="text-[#00AEC7] font-medium">{t("rules.greetingPart2")}</p>
              <p className="text-[#00AEC7] font-medium">{t("rules.greetingPart3")}</p>
              <ul className="list-disc pl-6 text-[#00AEC7] font-medium">
                <li>{t("rules.greetingBullet1")}</li>
                <li>{t("rules.greetingBullet2")}</li>
                <li>{t("rules.greetingBullet3")}</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card className="border-[#00AEC7] border-2">
            <CardHeader className="bg-[#00AEC7]/10">
              <CardTitle className="text-[#00AEC7]">{t("rules.content")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[#00AEC7] font-medium">{t("rules.contentDescription")}</p>
              <ul className="list-disc pl-6 text-[#00AEC7] font-medium">
                <li>{t("rules.contentBullet1")}</li>
                <li>{t("rules.contentBullet2")}</li>
                <li>{t("rules.contentBullet3")}</li>
                <li>{t("rules.contentBullet4")}</li>
                <li>{t("rules.contentBullet5")}</li>
              </ul>
              <p className="text-[#00AEC7] font-medium">{t("rules.contentPart2")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation">
          <Card
            className="border-2 border-gradient-to-r from-[#FFF32A] to-[#00AEC7]"
            style={{
              borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
            }}
          >
            <CardHeader className="bg-gradient-to-r from-[#FFF32A]/10 to-[#00AEC7]/10">
              <CardTitle className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-transparent bg-clip-text">
                {t("rules.moderationTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[#00AEC7] font-medium">{t("rules.moderationDescription")}</p>
              <p className="text-[#00AEC7] font-medium">{t("rules.moderationPart2")}</p>
              <ul className="list-disc pl-6 text-[#00AEC7] font-medium">
                <li>{t("rules.moderationBullet1")}</li>
                <li>{t("rules.moderationBullet2")}</li>
                <li>{t("rules.moderationBullet3")}</li>
                <li>{t("rules.moderationBullet4")}</li>
                <li>{t("rules.moderationBullet5")}</li>
              </ul>
              <p className="text-[#00AEC7] font-medium">{t("rules.moderationPart3")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Community Values Section - Only showing recently added values */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#FFF32A] font-pixel">{t("rules.valuesTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityValues.map((value) => (
            <Card key={value} className="overflow-hidden bg-black h-full" style={gradientBorderStyle}>
              <CardHeader className="bg-gradient-to-r from-[#FFF32A]/10 to-[#00AEC7]/10 p-4">
                <CardTitle className="text-lg text-[#FFF32A]">{t(`rules.${value}Title`)}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-[#00AEC7] font-medium">{t(`rules.${value}Description`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
