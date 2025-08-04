"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { SectionHero } from "@/components/section-hero"
import { MessageSquare, Heart, Lightbulb, Award, Calendar, Gamepad2 } from "lucide-react"

export function ValuesContent() {
  const { t } = useTranslation()

  const communityValues = [
    {
      icon: <MessageSquare className="h-8 w-8 text-[#00AEC7]" />,
      title: t("values.values.respect.title"),
      description: t("values.values.respect.description"),
    },
    {
      icon: <Heart className="h-8 w-8 text-[#FFF32A]" />,
      title: t("values.values.newcomers.title"),
      description: t("values.values.newcomers.description"),
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-[#00AEC7]" />,
      title: t("values.values.innovation.title"),
      description: t("values.values.innovation.description"),
    },
    {
      icon: <Award className="h-8 w-8 text-[#FFF32A]" />,
      title: t("values.values.celebration.title"),
      description: t("values.values.celebration.description"),
    },
    {
      icon: <Calendar className="h-8 w-8 text-[#00AEC7]" />,
      title: t("values.values.meetings.title"),
      description: t("values.values.meetings.description"),
    },
    {
      icon: <Gamepad2 className="h-8 w-8 text-[#FFF32A]" />,
      title: t("values.values.interests.title"),
      description: t("values.values.interests.description"),
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

      <div className="container py-12">
        {/* Community Values Section */}
        <div className="mb-12">
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

        {/* Mission and Community Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">{t("values.welcome.mission.title")}</CardTitle>
            </CardHeader>
            <CardContent className="text-white/90">
              <p>{t("values.welcome.mission.description")}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">{t("values.welcome.community.title")}</CardTitle>
            </CardHeader>
            <CardContent className="text-white/90">
              <p>{t("values.welcome.community.description")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
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
