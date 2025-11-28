"use client"

import { SectionHero } from "@/widgets/section_hero"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ExternalLink,
  Users,
  Video,
  BookOpen,
  PlayCircle,
  Globe,
  Target,
  User,
  Lightbulb,
  Sparkles,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function ResearchContent() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleJoinForm = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSf3SoRR2UEDvVAPI8VyamTNLaYlhLnOKfq94FhoxIc71C-ZBg/viewform?usp=sharing&ouid=101677006101023042026",
      "_blank",
    )
  }

  const handlePlaylistView = () => {
    window.open("https://youtube.com/playlist?list=PLtm67qQGvjOxZ-GBIFHvK_SIWAOxhxe3G&si=LsDX4lpRPz2p4oIa", "_blank")
  }

  const goals = [
    {
      icon: Globe,
      title: t("research.goals.collaborations.title"),
      description: t("research.goals.collaborations.description"),
    },
    {
      icon: Lightbulb,
      title: t("research.goals.education.title"),
      description: t("research.goals.education.description"),
    },
    {
      icon: Target,
      title: t("research.goals.visibility.title"),
      description: t("research.goals.visibility.description"),
    },
    {
      icon: User,
      title: t("research.goals.branding.title"),
      description: t("research.goals.branding.description"),
    },
  ]

  // Define benefits arrays directly to avoid translation issues
  const profileBenefits = [
    t("research.join.profile.benefits.0") || "Simple 5-minute registration",
    t("research.join.profile.benefits.1") || "Network with regional peers",
    t("research.join.profile.benefits.2") || "Boost your visibility in Central Asia",
    t("research.join.profile.benefits.3") || "Discover collaboration opportunities",
  ]

  const spreadBenefits = [
    t("research.join.spread.benefits.0") || "Share with your network",
    t("research.join.spread.benefits.1") || "Recommend colleagues",
    t("research.join.spread.benefits.2") || "Post in research groups",
    t("research.join.spread.benefits.3") || "Help us grow the community",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800">
      <SectionHero
        title={t("research.title")}
        subtitleLine1={t("research.subtitle")}
        subtitleLine2={t("research.description")}
      />

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Our Mission Section */}
        <section
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-center space-y-6 mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-[#FFF32A]" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
                {t("research.mission.title")}
              </h2>
            </div>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto">{t("research.mission.description")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.map((goal, index) => (
              <Card
                key={index}
                className="text-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:shadow-2xl hover:shadow-[#00AEC7]/20 transition-all duration-300 hover:scale-105 group"
              >
                <CardContent className="pt-6">
                  <goal.icon className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition-transform text-[#00AEC7]" />
                  <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-[#FFF32A] transition-colors">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{goal.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Join the Movement Section */}
        <section
          className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-8 w-8 text-[#00AEC7]" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
                {t("research.join.title")}
              </h2>
            </div>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto">{t("research.join.description")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:shadow-2xl hover:shadow-[#00AEC7]/20 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white group-hover:text-[#FFF32A] transition-colors">
                  <BookOpen className="h-5 w-5 text-[#00AEC7]" />
                  {t("research.join.profile.title")}
                </CardTitle>
                <CardDescription className="text-gray-400">{t("research.join.profile.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-400 space-y-2">
                  {profileBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#00AEC7] rounded-full"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleJoinForm}
                  className="w-full bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-black font-semibold hover:shadow-lg hover:shadow-[#00AEC7]/30 transition-all duration-300 hover:scale-105"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t("research.join.profile.button")}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:shadow-2xl hover:shadow-[#00AEC7]/20 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white group-hover:text-[#FFF32A] transition-colors">
                  <Users className="h-5 w-5 text-[#00AEC7]" />
                  {t("research.join.spread.title")}
                </CardTitle>
                <CardDescription className="text-gray-400">{t("research.join.spread.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-400 space-y-2">
                  {spreadBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#00AEC7] rounded-full"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7]/10 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-transparent"
                  onClick={() =>
                    navigator.share?.({
                      title: "Central Asia AI/ML Research Hub",
                      url: window.location.href,
                    }) || navigator.clipboard.writeText(window.location.href)
                  }
                >
                  <Users className="h-4 w-4 mr-2" />
                  {t("research.join.spread.button")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Research Seminars & Videos Section */}
        <section
          className={`space-y-8 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Video className="h-8 w-8 text-[#00AEC7]" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
                {t("research.learning.title")}
              </h2>
            </div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t("research.learning.description")}</p>
          </div>

          {/* Horizontal Video Feed */}
          <div className="w-full">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
              {/* Video 1 - DSML Reading Club #1 */}
              <div className="flex-none w-80">
                <Card className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:shadow-2xl hover:shadow-[#00AEC7]/20 transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-[#00AEC7]/10 text-[#00AEC7] border-[#00AEC7]/20">Reading Club</Badge>
                    </div>
                    <CardTitle className="text-base leading-tight text-white group-hover:text-[#FFF32A] transition-colors">
                      DSML Reading Club #1
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-400">Byte Latent Transformer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/JN-adAvbAcs?si=Qr4VAgkJLua9ZYVL"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Video 2 - DSML Reading Club #2 */}
              <div className="flex-none w-80">
                <Card className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:shadow-2xl hover:shadow-[#00AEC7]/20 transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-[#00AEC7]/10 text-[#00AEC7] border-[#00AEC7]/20">Reading Club</Badge>
                    </div>
                    <CardTitle className="text-base leading-tight text-white group-hover:text-[#FFF32A] transition-colors">
                      DSML Reading Club #2
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-400">
                      Visual Geometry Grounded Transformer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/TVZoU1m5WKI?si=_OZQqiG9fb-ZHFJ-"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Video 3 - DSML Reading Club #3 */}
              <div className="flex-none w-80">
                <Card className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:shadow-2xl hover:shadow-[#00AEC7]/20 transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-[#00AEC7]/10 text-[#00AEC7] border-[#00AEC7]/20">Reading Club</Badge>
                    </div>
                    <CardTitle className="text-base leading-tight text-white group-hover:text-[#FFF32A] transition-colors">
                      DSML Reading Club #3
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-400">
                      Computing General Random Walk Graph Kernels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/_SNLAOX1wqI?si=ZND-hbrrcvX4EBTz"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Simplified Video Playlist Button */}
          <div className="text-center mt-8">
            <Button
              onClick={handlePlaylistView}
              size="lg"
              className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-black font-semibold hover:shadow-lg hover:shadow-[#00AEC7]/30 transition-all duration-300 hover:scale-105"
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              {t("research.learning.button")}
            </Button>
          </div>
        </section>

        {/* Call to Action */}
        <section
          className={`text-center py-16 px-4 rounded-2xl transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{
            background: "linear-gradient(135deg, #00AEC7 0%, #0891b2 50%, #00AEC7 100%)",
            boxShadow: "0 25px 50px -12px rgba(0, 174, 199, 0.25)",
          }}
        >
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-[#FFF32A]" />
            </div>
            <h2 className="text-3xl font-bold text-white">{t("research.cta.title")}</h2>
            <p className="text-xl text-white/90">{t("research.cta.description")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleJoinForm}
                size="lg"
                className="bg-gradient-to-r from-[#FFF32A] to-[#FFF32A] text-black font-semibold hover:shadow-lg hover:shadow-[#FFF32A]/30 transition-all duration-300 hover:scale-105"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                {t("research.cta.joinButton")}
              </Button>
              <Button
                onClick={handlePlaylistView}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <Video className="h-5 w-5 mr-2" />
                {t("research.cta.watchButton")}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
