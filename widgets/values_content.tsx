"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { SectionHero } from "@/widgets/section_hero"
import { Users, MessageSquare, Shield, Heart, BookOpen, Lightbulb, Target, Globe, Award, UserCheck } from "lucide-react"

export function ValuesContent() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("welcome")

  const communityValues = [
    {
      icon: <Heart className="h-8 w-8 text-[#FFF32A]" />,
      title: t("values.values.respect.title"),
      description: t("values.values.respect.description"),
    },
    {
      icon: <BookOpen className="h-8 w-8 text-[#00AEC7]" />,
      title: t("values.values.learning.title"),
      description: t("values.values.learning.description"),
    },
    {
      icon: <UserCheck className="h-8 w-8 text-[#FFF32A]" />,
      title: t("values.values.collaboration.title"),
      description: t("values.values.collaboration.description"),
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-[#00AEC7]" />,
      title: t("values.values.innovation.title"),
      description: t("values.values.innovation.description"),
    },
    {
      icon: <Globe className="h-8 w-8 text-[#FFF32A]" />,
      title: t("values.values.diversity.title"),
      description: t("values.values.diversity.description"),
    },
    {
      icon: <Award className="h-8 w-8 text-[#00AEC7]" />,
      title: t("values.values.excellence.title"),
      description: t("values.values.excellence.description"),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <SectionHero
        title={t("values.title")}
        subtitleLine1={t("values.description")}
        gradientFrom="#00AEC7"
        gradientTo="#FFF32A"
      />

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="welcome" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("values.tabs.welcome")}
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t("values.tabs.content")}
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t("values.tabs.moderation")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="welcome" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#FFF32A]" />
                  {t("values.welcome.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/90 space-y-4">
                <p>{t("values.welcome.intro")}</p>
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-[#00AEC7] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">{t("values.welcome.mission.title")}</h4>
                      <p className="text-sm">{t("values.welcome.mission.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-[#FFF32A] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">{t("values.welcome.community.title")}</h4>
                      <p className="text-sm">{t("values.welcome.community.description")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-[#00AEC7]" />
                    {t("values.content.guidelines.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white/90">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFF32A] mt-1">•</span>
                      {t("values.content.guidelines.relevant")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFF32A] mt-1">•</span>
                      {t("values.content.guidelines.respectful")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFF32A] mt-1">•</span>
                      {t("values.content.guidelines.constructive")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFF32A] mt-1">•</span>
                      {t("values.content.guidelines.original")}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#FFF32A]" />
                    {t("values.content.prohibited.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white/90">
                  <div className="grid gap-3">
                    <Badge variant="destructive" className="w-fit">
                      {t("values.content.prohibited.spam")}
                    </Badge>
                    <Badge variant="destructive" className="w-fit">
                      {t("values.content.prohibited.harassment")}
                    </Badge>
                    <Badge variant="destructive" className="w-fit">
                      {t("values.content.prohibited.offtopic")}
                    </Badge>
                    <Badge variant="destructive" className="w-fit">
                      {t("values.content.prohibited.inappropriate")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#00AEC7]" />
                  {t("values.moderation.process.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/90 space-y-4">
                <p>{t("values.moderation.process.description")}</p>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-semibold">1</span>
                    <span>{t("values.moderation.steps.warning")}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-semibold">2</span>
                    <span>{t("values.moderation.steps.temporary")}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">3</span>
                    <span>{t("values.moderation.steps.permanent")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Community Values Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8 font-pixel">{t("values.values.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityValues.map((value, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-white/80 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-[#00AEC7]/20 to-[#FFF32A]/20 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4 font-pixel">{t("values.cta.title")}</h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">{t("values.cta.description")}</p>
              <Button size="lg" className="bg-[#00AEC7] hover:bg-[#0095a8] text-white font-semibold px-8">
                {t("values.cta.button")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
