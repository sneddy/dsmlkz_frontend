import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, MessageCircle, Users, Calendar, Briefcase, ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CollaborationCard } from "@/widgets/collaboration_card"

interface HomeContentSSRProps {
  translations: any
  lang: string
}

export function HomeContentSSR({ translations, lang }: HomeContentSSRProps) {
  const t = (key: string) => {
    const keys = key.split(".")
    let value = translations
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  const communityStats = [
    { icon: Users, label: "Members Across Platforms", value: "10,000+", color: "text-[#00AEC7]" },
    { icon: Users, label: "Active Members", value: "1,500", color: "text-[#FFF32A]" },
    { icon: Calendar, label: "Offline Events Hosted", value: "8", color: "text-purple-400" },
    { icon: Briefcase, label: "Job Placements", value: "500+", color: "text-green-400" },
  ]

  const gradientBorderStyle = {
    borderWidth: "2px",
    borderStyle: "solid",
    borderImage: "linear-gradient(135deg, #FFF32A, #00AEC7, #FFF32A) 1",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AEC7]/20 via-slate-900/80 to-[#FFF32A]/20"></div>
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-pixel font-bold mb-6 sm:mb-8 tracking-tight leading-tight px-4">
            <span className="bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] bg-clip-text text-transparent animate-pulse">
              DSML
            </span>{" "}
            <span className="bg-gradient-to-r from-[#00AEC7] via-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
              Kazakhstan
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4 font-medium">
            {t("home.subtitle")}
          </p>

          {/* Buttons in hero section */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 mb-16">
            <Link href={`/${lang}/auth/signup`} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#FFF32A] to-[#FFF32A]/90 text-black hover:from-[#FFF32A]/90 hover:to-[#FFF32A]/80 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group text-base font-pixel"
              >
                {t("home.joinButton")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href={`/${lang}/events`} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7]/10 backdrop-blur-sm px-8 py-4 rounded-full transition-all duration-300 group bg-transparent text-base font-pixel"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="relative w-full overflow-hidden mb-16">
        <div className="container px-4">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
            {/* Desktop image */}
            <div className="hidden md:block w-full h-[50vh] relative">
              <Image
                src="/images/moon-hero-desktop.png"
                alt="DSML Kazakhstan Community - Desktop Hero"
                fill
                className="object-cover"
                priority
                sizes="(min-width: 768px) 100vw, 0px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
            </div>
            {/* Mobile image */}
            <div className="block md:hidden w-full h-[40vh] relative">
              <Image
                src="/images/moon-hero-mobile.png"
                alt="DSML Kazakhstan Community - Mobile Hero"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 767px) 100vw, 0px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00AEC7]/5 to-[#FFF32A]/5"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-xl">
                  <stat.icon
                    className={`h-10 w-10 mx-auto mb-4 ${stat.color} group-hover:scale-110 transition-transform drop-shadow-lg`}
                  />
                  <div className={`text-3xl font-bold ${stat.color} mb-2 font-pixel`}>{stat.value}</div>
                  <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Description */}
      <section className="py-20 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-pixel font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] bg-clip-text text-transparent drop-shadow-lg">
                Our Community Channels
              </span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-16 font-medium">{t("home.communityDescription")}</p>
          </div>
        </div>
      </section>

      {/* Telegram Channels Section */}
      <section className="py-20 container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Discussion Hub */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-[#00AEC7]/20 rounded-xl backdrop-blur-sm">
                  <MessageCircle className="h-6 w-6 text-[#00AEC7]" />
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
                <Badge variant="secondary" className="bg-[#00AEC7]/10 text-[#00AEC7] border-[#00AEC7]/20 font-pixel">
                  <Users className="h-3 w-3 mr-1" />
                  1,500 members
                </Badge>
              </div>
              <Link
                href={`/${lang}/auth/signup`}
                className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group/link font-medium"
              >
                Register to join
                <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>

          {/* News Feed */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-[#FFF32A]/20 rounded-xl backdrop-blur-sm">
                  <MessageCircle className="h-6 w-6 text-[#FFF32A]" />
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
                <Badge variant="secondary" className="bg-[#FFF32A]/10 text-[#FFF32A] border-[#FFF32A]/20 font-pixel">
                  3,500 subscribers
                </Badge>
              </div>
              <Link
                href="https://t.me/dsmlkz_news"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group/link font-medium"
              >
                {t("home.joinButton")}
                <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>

          {/* DS Jobs */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-purple-500/20 rounded-xl backdrop-blur-sm">
                  <Briefcase className="h-6 w-6 text-purple-400" />
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
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-pixel">
                  8,700 subscribers
                </Badge>
              </div>
              <Link
                href="https://t.me/ml_jobs_kz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group/link font-medium"
              >
                {t("home.joinButton")}
                <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>

          {/* IT Jobs */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-orange-500/20 rounded-xl backdrop-blur-sm">
                  <Briefcase className="h-6 w-6 text-orange-400" />
                </div>
              </div>
              <CardTitle className="font-pixel text-[#00AEC7] text-lg group-hover:text-[#00AEC7]/80 transition-colors">
                {t("home.itJobsTitle")}
              </CardTitle>
              <CardDescription className="text-gray-400 leading-relaxed">{t("home.itJobsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20 font-pixel">
                  6,500 subscribers
                </Badge>
              </div>
              <Link
                href="https://t.me/it_jobs_kz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group/link font-medium"
              >
                {t("home.joinButton")}
                <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>

          {/* YouTube Channel */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-red-500/20 rounded-xl backdrop-blur-sm">
                  <Play className="h-6 w-6 text-red-400" />
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
                <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20 font-pixel">
                  800 subscribers
                </Badge>
              </div>
              <Link
                href="https://www.youtube.com/c/DataScienceKazakhstan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group/link font-medium"
              >
                {t("home.subscribeButton")}
                <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>

          {/* LinkedIn Page */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-600/20 rounded-xl backdrop-blur-sm">
                  <Users className="h-6 w-6 text-blue-400" />
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
                <Badge variant="secondary" className="bg-blue-600/10 text-blue-400 border-blue-600/20 font-pixel">
                  1,700 followers
                </Badge>
              </div>
              <Link
                href="https://www.linkedin.com/company/53101063/admin/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group/link font-medium"
              >
                {t("home.subscribeButton")}
                <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-24 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-pixel font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] bg-clip-text text-transparent drop-shadow-lg">
                {t("home.collaborationTitle")}
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed font-medium">
              {t("home.collaborationSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
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
          <div className="text-center px-4">
            <Link
              href="https://t.me/DSMLmeetup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#00AEC7] to-[#00AEC7]/80 text-white hover:from-[#00AEC7]/90 hover:to-[#00AEC7]/70 font-pixel text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <MessageCircle className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="truncate">{t("home.collaborationContact")}</span>
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#00AEC7]/10 via-transparent to-[#FFF32A]/10">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-pixel font-bold mb-8 text-white leading-tight">
            {t("home.cta.title")}
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            {t("home.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Link href={`/${lang}/auth/signup`} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#FFF32A] to-[#FFF32A]/80 text-black hover:from-[#FFF32A]/90 hover:to-[#FFF32A]/70 font-pixel font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group text-base"
              >
                {t("home.cta.getStartedButton")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href={`/${lang}/events`} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full transition-all duration-300 bg-transparent text-base font-pixel"
              >
                {t("home.cta.exploreEventsButton")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
