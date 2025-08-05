"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, MessageCircle, Users, Calendar, Briefcase, ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/hooks/use-translation"
import { useEffect, useState } from "react"
import { CollaborationCard } from "@/components/collaboration-card"

export function HomeContent() {
  const { t } = useTranslation()
  const [isClient, setIsClient] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Устанавливаем флаг isClient после монтирования компонента
  useEffect(() => {
    setIsClient(true)
    // Добавляем небольшую задержку для плавной анимации появления
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const gradientBorderStyle = {
    borderWidth: "2px",
    borderStyle: "solid",
    borderImage: "linear-gradient(135deg, #FFF32A, #00AEC7, #FFF32A) 1",
  }

  // Если компонент еще не смонтирован на клиенте, показываем улучшенный скелетон
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800">
        <div className="container py-8 space-y-8">
          <div className="h-96 bg-gradient-to-r from-slate-800 to-slate-700 animate-pulse rounded-2xl mb-8 shadow-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 bg-gradient-to-br from-slate-800 to-slate-700 animate-pulse rounded-xl shadow-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const communityStats = [
    { icon: Users, label: "Members Across Platforms", value: "10,000+", color: "text-[#00AEC7]" },
    { icon: Users, label: "Active Members", value: "1,500", color: "text-[#FFF32A]" },
    { icon: Calendar, label: "Offline Events Hosted", value: "8", color: "text-purple-400" },
    { icon: Briefcase, label: "Job Placements", value: "500+", color: "text-green-400" },
  ]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Hero Section with transparent background and gradient text */}
      <section className="relative overflow-hidden py-16 px-4 bg-transparent">
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight font-pixel bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
            {t("home.title")}
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
            {t("home.subtitle")}
          </p>

          {/* Buttons in hero section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-white to-white/90 text-black hover:from-white/90 hover:to-white/80 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {t("home.joinButton")}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/events">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 rounded-full transition-all duration-300 group bg-transparent"
              >
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Watch Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Image Section with new transparent wide image */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full">
          <Image
            src="/images/moon-hero-transparent-wide.png"
            alt="DSML Kazakhstan Community"
            width={1920}
            height={800}
            className="w-full h-[80vh] object-cover"
            priority
          />
        </div>
      </section>

      {/* Stats Section - Updated with new stats */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00AEC7]/5 to-[#FFF32A]/5"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
                  <stat.icon
                    className={`h-8 w-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform`}
                  />
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Description - Enhanced typography */}
      <section className="py-16 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-pixel">
              <span className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
                {t("home.channelsTitle")}
              </span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-12">{t("home.communityDescription")}</p>
          </div>
        </div>
      </section>

      {/* Telegram Channels Section - Simplified cards without growth indicators */}
      <section className="py-16 container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Discussion Hub */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#00AEC7]/20 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-[#00AEC7]" />
                </div>
              </div>
              <CardTitle className="font-pixel text-[#00AEC7] text-lg group-hover:text-[#00AEC7]/80 transition-colors">
                {t("home.discussionHubTitle")}
              </CardTitle>
              <CardDescription className="text-gray-400 leading-relaxed">
                {t("home.discussionHubDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-[#00AEC7]/10 text-[#00AEC7] border-[#00AEC7]/20">
                  <Users className="h-3 w-3 mr-1" />
                  1,500 members
                </Badge>
              </div>
              <Link
                href="/signup"
                className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group/link"
              >
                Register to join
                <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>

          {/* News Feed */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#FFF32A]/20 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-[#FFF32A]" />
                </div>
              </div>
              <CardTitle className="font-pixel text-[#00AEC7] text-lg group-hover:text-[#00AEC7]/80 transition-colors">
                {t("home.newsFeedTitle")}
              </CardTitle>
              <CardDescription className="text-gray-400 leading-relaxed">
                {t("home.newsFeedDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-[#FFF32A]/10 text-[#FFF32A] border-[#FFF32A]/20">
                  3,500 subscribers
                </Badge>
              </div>
              <Link
                href="https://t.me/dsmlkz_news"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group/link"
              >
                {t("home.joinButton")}
                <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>

          {/* DS Jobs */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Briefcase className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <CardTitle className="font-pixel text-[#00AEC7] text-lg group-hover:text-[#00AEC7]/80 transition-colors">
                {t("home.dataJobsTitle")}
              </CardTitle>
              <CardDescription className="text-gray-400 leading-relaxed">
                {t("home.dataJobsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                  8,700 subscribers
                </Badge>
              </div>
              <Link
                href="https://t.me/ml_jobs_kz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group/link"
              >
                {t("home.joinButton")}
                <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>

          {/* IT Jobs */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Briefcase className="h-5 w-5 text-orange-400" />
                </div>
              </div>
              <CardTitle className="font-pixel text-[#00AEC7] text-lg group-hover:text-[#00AEC7]/80 transition-colors">
                {t("home.itJobsTitle")}
              </CardTitle>
              <CardDescription className="text-gray-400 leading-relaxed">{t("home.itJobsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                  6,400 subscribers
                </Badge>
              </div>
              <Link
                href="https://t.me/it_jobs_kz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group/link"
              >
                {t("home.joinButton")}
                <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>

          {/* YouTube Channel */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Play className="h-5 w-5 text-red-400" />
                </div>
              </div>
              <CardTitle className="font-pixel text-[#00AEC7] text-lg group-hover:text-[#00AEC7]/80 transition-colors">
                {t("home.youtubeChannelTitle")}
              </CardTitle>
              <CardDescription className="text-gray-400 leading-relaxed">
                {t("home.youtubeChannelDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
                  Educational content
                </Badge>
              </div>
              <Link
                href="https://www.youtube.com/c/DataScienceKazakhstan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group/link"
              >
                {t("home.subscribeButton")}
                <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>

          {/* LinkedIn Page */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <CardTitle className="font-pixel text-[#00AEC7] text-lg group-hover:text-[#00AEC7]/80 transition-colors">
                {t("home.linkedinPageTitle")}
              </CardTitle>
              <CardDescription className="text-gray-400 leading-relaxed">
                {t("home.linkedinPageDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-blue-600/10 text-blue-400 border-blue-600/20">
                  1,700 followers
                </Badge>
              </div>
              <Link
                href="https://www.linkedin.com/company/53101063/admin/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group/link"
              >
                {t("home.subscribeButton")}
                <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Collaboration Section - Enhanced with modern design */}
      <section className="py-20 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-[#00AEC7]/20 text-[#00AEC7] border-[#00AEC7]/30">
              🤝 Partnership Opportunities
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-pixel">
              <span className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
                {t("home.collaborationTitle")}
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">{t("home.collaborationSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <CollaborationCard
              title={t("home.mediaSupport.title")}
              description={t("home.mediaSupport.description")}
              details={t("home.mediaSupport.details")}
              gradientBorderStyle={gradientBorderStyle}
            />

            <CollaborationCard
              title={t("home.hiring.title")}
              description={t("home.hiring.description")}
              details={t("home.hiring.details")}
              gradientBorderStyle={gradientBorderStyle}
            />

            <CollaborationCard
              title={t("home.corporateTraining.title")}
              description={t("home.corporateTraining.description")}
              details={t("home.corporateTraining.details")}
              gradientBorderStyle={gradientBorderStyle}
            />

            <CollaborationCard
              title={t("home.consulting.title")}
              description={t("home.consulting.description")}
              details={t("home.consulting.details")}
              gradientBorderStyle={gradientBorderStyle}
            />
          </div>

          {/* Enhanced CTA */}
          <div className="text-center">
            <Link href="https://t.me/DSMLmeetup" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00AEC7] to-[#00AEC7]/80 text-white hover:from-[#00AEC7]/90 hover:to-[#00AEC7]/70 font-pixel text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <MessageCircle className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                {t("home.collaborationContact")}
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Values Section - Enhanced with modern cards */}
      <section className="py-20 bg-gradient-to-br from-slate-900/50 to-black/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-[#FFF32A]/20 text-[#FFF32A] border-[#FFF32A]/30">💎 Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-pixel">
              <span className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
                Community Values
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
              <CardHeader>
                <div className="p-3 bg-[#00AEC7]/20 rounded-xl w-fit mb-4">
                  <Users className="h-6 w-6 text-[#00AEC7]" />
                </div>
                <CardTitle className="font-pixel text-[#00AEC7] group-hover:text-[#00AEC7]/80 transition-colors">
                  {t("home.communityFirst")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 leading-relaxed">{t("home.communityFirstDesc")}</p>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
              <CardHeader>
                <div className="p-3 bg-[#FFF32A]/20 rounded-xl w-fit mb-4">
                  <MessageCircle className="h-6 w-6 text-[#FFF32A]" />
                </div>
                <CardTitle className="font-pixel text-[#00AEC7] group-hover:text-[#00AEC7]/80 transition-colors">
                  {t("home.continuousLearning")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 leading-relaxed">{t("home.continuousLearningDesc")}</p>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
              <CardHeader>
                <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4">
                  <Briefcase className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="font-pixel text-[#00AEC7] group-hover:text-[#00AEC7]/80 transition-colors">
                  {t("home.careerGrowth")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 leading-relaxed">{t("home.careerGrowthDesc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#00AEC7]/10 via-transparent to-[#FFF32A]/10">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-pixel text-white">
            Ready to Join the Future of AI in Central Asia?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Connect with like-minded professionals, access exclusive resources, and accelerate your career in AI/ML.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#FFF32A] to-[#FFF32A]/80 text-black hover:from-[#FFF32A]/90 hover:to-[#FFF32A]/70 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/events">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 rounded-full transition-all duration-300 bg-transparent"
              >
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
