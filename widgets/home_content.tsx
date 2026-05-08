"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type LucideIcon, ExternalLink, MessageCircle, Users, Calendar, Briefcase, ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import { CollaborationCard } from "@/widgets/collaboration_card"
import { trackGaEvent } from "@/shared/providers/analytics"
import { cn } from "@/lib/utils"

const LINKEDIN_URL = "https://www.linkedin.com/company/53101063/"

type ChannelCard = {
  title: string
  description: string
  metric: string
  href: string
  action: string
  icon: LucideIcon
  accent: string
  iconClass: string
  iconBg: string
  metricClass: string
  analyticsLabel: string
  contentType: string
  external: boolean
  featured?: boolean
  wide?: boolean
}

export function HomeContent() {
  const { t } = useTranslation()

  useEffect(() => {
    trackGaEvent("home_view", { page_path: "/" })
  }, [])

  const handleCta = (ctaLabel: string, destination: string) => () => {
    trackGaEvent("cta_click", {
      cta_label: ctaLabel,
      destination,
      page_path: "/",
      page_title: typeof document !== "undefined" ? document.title : undefined,
    })
  }

  const handleOutbound = (label: string, url: string, contentType: string) => () => {
    trackGaEvent("outbound_click", {
      link_url: url,
      link_text: label,
      content_type: contentType,
      page_path: "/",
      page_title: typeof document !== "undefined" ? document.title : undefined,
    })
  }

  const communityStats = [
    { icon: Users, label: t("home.stats.membersAcrossPlatforms"), value: "10,000+", color: "text-[#00AEC7]" },
    { icon: Users, label: t("home.stats.activeMembers"), value: "1,500", color: "text-[#FFF32A]" },
    { icon: Calendar, label: t("home.stats.offlineEventsHosted"), value: "8", color: "text-purple-400" },
    { icon: Briefcase, label: t("home.stats.jobPlacements"), value: "500+", color: "text-green-400" },
  ]

  const communityChannels: ChannelCard[] = [
    {
      title: t("home.discussionHubTitle"),
      description: t("home.discussionHubDescription"),
      metric: "1,500 members",
      href: "/auth/signup",
      action: "Register to join",
      icon: MessageCircle,
      accent: "from-[#00AEC7] via-[#6DE7F2] to-[#FFF32A]",
      iconClass: "text-[#00AEC7]",
      iconBg: "bg-[#00AEC7]/12",
      metricClass: "border-[#00AEC7]/25 bg-[#00AEC7]/10 text-[#67e8f9]",
      analyticsLabel: "discussion_signup",
      contentType: "community",
      external: false,
      featured: true,
    },
    {
      title: t("home.newsFeedTitle"),
      description: t("home.newsFeedDescription"),
      metric: "4,000 subscribers",
      href: "https://t.me/dsmlkz_news",
      action: "Subscribe in Telegram",
      icon: MessageCircle,
      accent: "from-[#FFF32A] via-[#B8F36B] to-[#00AEC7]",
      iconClass: "text-[#FFF32A]",
      iconBg: "bg-[#FFF32A]/12",
      metricClass: "border-[#FFF32A]/25 bg-[#FFF32A]/10 text-[#FFF32A]",
      analyticsLabel: "News & Updates",
      contentType: "news",
      external: true,
    },
    {
      title: t("home.dataJobsTitle"),
      description: t("home.dataJobsDescription"),
      metric: "9,500 subscribers",
      href: "https://t.me/ml_jobs_kz",
      action: "Subscribe in Telegram",
      icon: Briefcase,
      accent: "from-purple-400 via-[#00AEC7] to-[#FFF32A]",
      iconClass: "text-purple-300",
      iconBg: "bg-purple-500/12",
      metricClass: "border-purple-400/25 bg-purple-500/10 text-purple-200",
      analyticsLabel: "DS/ML Jobs",
      contentType: "jobs",
      external: true,
    },
    {
      title: t("home.itJobsTitle"),
      description: t("home.itJobsDescription"),
      metric: "7,300 subscribers",
      href: "https://t.me/it_jobs_kz",
      action: "Subscribe in Telegram",
      icon: Briefcase,
      accent: "from-orange-300 via-[#FFF32A] to-[#00AEC7]",
      iconClass: "text-orange-300",
      iconBg: "bg-orange-500/12",
      metricClass: "border-orange-300/25 bg-orange-500/10 text-orange-200",
      analyticsLabel: "IT Jobs Kazakhstan",
      contentType: "jobs",
      external: true,
    },
    {
      title: t("home.youtubeChannelTitle"),
      description: t("home.youtubeChannelDescription"),
      metric: "850 subscribers",
      href: "https://www.youtube.com/c/DataScienceKazakhstan",
      action: "Subscribe in YouTube",
      icon: Play,
      accent: "from-red-300 via-[#00AEC7] to-[#FFF32A]",
      iconClass: "text-red-300",
      iconBg: "bg-red-500/12",
      metricClass: "border-red-300/25 bg-red-500/10 text-red-200",
      analyticsLabel: "YouTube Channel",
      contentType: "video",
      external: true,
    },
    {
      title: t("home.linkedinPageTitle"),
      description: t("home.linkedinPageDescription"),
      metric: "1,850 followers",
      href: LINKEDIN_URL,
      action: "Subscribe on LinkedIn",
      icon: Users,
      accent: "from-blue-300 via-[#00AEC7] to-[#FFF32A]",
      iconClass: "text-blue-300",
      iconBg: "bg-blue-500/12",
      metricClass: "border-blue-300/25 bg-blue-500/10 text-blue-200",
      analyticsLabel: "LinkedIn Page",
      contentType: "social",
      external: true,
      wide: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-8 px-4 sm:py-10">
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-pixel font-bold mb-5 sm:mb-7 tracking-tight leading-tight px-4 text-white">
            <span className="bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] bg-clip-text text-transparent animate-pulse">
              DSML
            </span>{" "}
            <span className="bg-gradient-to-r from-[#00AEC7] via-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
              Kazakhstan
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 px-4 font-medium">
            {t("home.subtitle")}
          </p>

          {/* Buttons in hero section */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 mb-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-[#FFF32A] to-[#FFF32A]/90 text-black hover:from-[#FFF32A]/90 hover:to-[#FFF32A]/80 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group text-base font-pixel"
            >
              <Link href="/auth/signup" onClick={handleCta("signup_home", "/auth/signup")}>
                {t("home.joinButton")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7]/10 backdrop-blur-sm px-8 py-4 rounded-full transition-all duration-300 group bg-transparent text-base font-pixel"
            >
              <Link href="/events" onClick={handleCta("watch_events", "/events")}>
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {t("home.watchEvents")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Hero Image Section aligned with hero styling */}
      <section className="relative w-full overflow-hidden mb-4 sm:mb-6 px-4">
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-transparent">
          <div className="relative h-[14vh] w-full md:h-[20vh]">
            <picture>
              <source media="(min-width: 768px)" srcSet="/images/moon-hero-desktop.png" />
              <img
                src="/images/moon-hero-mobile.png"
                alt="DSML Kazakhstan Community"
                width={2475}
                height={1358}
                className="h-full w-full object-cover"
                decoding="async"
                fetchPriority="high"
              />
            </picture>
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Community Pulse */}
      <section className="py-6 sm:py-8">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-[#07111f]/80 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <div className="flex flex-col gap-1 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-white">{t("home.communityPulse")}</p>
              <p className="text-sm text-gray-400">{t("home.ecosystemSnapshot")}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {communityStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex flex-col items-center gap-2 border-white/10 px-3 py-5 text-center sm:flex-row sm:gap-4 sm:px-5 sm:text-left",
                    index % 2 === 1 ? "border-l" : "",
                    index > 1 ? "border-t lg:border-t-0" : "",
                    index > 0 ? "lg:border-l" : "",
                  )}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <div className="min-w-0">
                    <div className={cn("font-pixel text-2xl leading-none sm:text-3xl", stat.color)}>{stat.value}</div>
                    <div className="mt-1 text-xs font-medium text-gray-300 sm:text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Channels */}
      <section className="container px-4 py-10 md:px-6">
        <div className="mx-auto mb-8 max-w-4xl text-center">
          <h2 className="mb-6 break-words font-pixel text-2xl font-bold leading-tight sm:text-4xl md:text-5xl">
            <span className="inline-block max-w-full whitespace-normal break-words bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] bg-clip-text text-transparent drop-shadow-lg">
              {t("home.channelsTitle")}
            </span>
          </h2>
          <p className="text-base font-medium leading-relaxed text-gray-300 sm:text-lg">{t("home.communityDescription")}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {communityChannels.map((channel) => {
            const Icon = channel.icon
            const clickHandler = channel.external
              ? handleOutbound(channel.analyticsLabel, channel.href, channel.contentType)
              : handleCta(channel.analyticsLabel, channel.href)

            return (
              <Card
                key={channel.title}
                className={cn(
                  "group relative flex min-h-[246px] overflow-hidden rounded-lg border border-white/10 bg-[#07111f]/80 text-white shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#00AEC7]/55 hover:bg-[#0a1728]/90 hover:shadow-[0_24px_80px_rgba(0,174,199,0.12)]",
                  channel.featured && "md:col-span-2 xl:min-h-[270px]",
                  channel.wide && "md:col-span-2",
                )}
              >
                <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", channel.accent)} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,174,199,0.12),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(255,243,42,0.08),transparent_28%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex w-full flex-col">
                  <CardHeader className={cn("p-5 pb-3", channel.featured && "sm:p-7 sm:pb-4")}>
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10",
                          channel.iconBg,
                        )}
                      >
                        <Icon className={cn("h-5 w-5", channel.iconClass)} />
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "shrink-0 whitespace-nowrap rounded-full border px-3 py-1 font-pixel text-xs",
                          channel.metricClass,
                        )}
                      >
                        {channel.metric}
                      </Badge>
                    </div>
                    <div className="mt-4 min-w-0">
                      {channel.featured && (
                        <p className="mb-2 text-xs font-semibold text-[#FFF32A]">{t("home.featuredChannel")}</p>
                      )}
                      <CardTitle
                        className={cn(
                          "text-xl font-semibold leading-tight text-white transition-colors group-hover:text-[#EFFFFF]",
                          channel.featured && "sm:text-2xl",
                        )}
                      >
                        {channel.title}
                      </CardTitle>
                    </div>
                    <CardDescription
                      className={cn(
                        "mt-4 max-w-xl text-sm leading-relaxed text-gray-300",
                        channel.featured && "sm:text-base",
                      )}
                    >
                      {channel.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={cn("mt-auto p-5 pt-0", channel.featured && "sm:p-7 sm:pt-0")}>
                    <Link
                      href={channel.href}
                      target={channel.external ? "_blank" : undefined}
                      rel={channel.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center rounded-full border border-[#00AEC7]/25 bg-[#00AEC7]/10 px-3 py-2 text-sm font-semibold text-[#67e8f9] transition-colors hover:border-[#FFF32A]/40 hover:bg-[#FFF32A]/10 hover:text-[#FFF32A]"
                      onClick={clickHandler}
                    >
                      {channel.action}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </CardContent>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-pixel font-bold mb-8 leading-tight break-words">
              <span className="inline-block max-w-full whitespace-normal break-words bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] bg-clip-text text-transparent drop-shadow-lg">
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
              trackLabel={t("home.partnershipTrack")}
            />

            <CollaborationCard
              title={t("home.hiring.title")}
              description={t("home.hiring.description")}
              details={t("home.hiring.details")}
              trackLabel={t("home.partnershipTrack")}
            />

            <CollaborationCard
              title={t("home.corporateTraining.title")}
              description={t("home.corporateTraining.description")}
              details={t("home.corporateTraining.details")}
              trackLabel={t("home.partnershipTrack")}
            />

            <CollaborationCard
              title={t("home.consulting.title")}
              description={t("home.consulting.description")}
              details={t("home.consulting.details")}
              trackLabel={t("home.partnershipTrack")}
            />
          </div>

          {/* Enhanced CTA */}
          <div className="text-center px-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-[#00AEC7] to-[#00AEC7]/80 text-white hover:from-[#00AEC7]/90 hover:to-[#00AEC7]/70 font-pixel text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href="https://t.me/DSMLmeetup" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>{t("home.collaborationContact")}</span>
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-pixel font-bold mb-8 text-white leading-tight">
            {t("home.finalCtaTitle")}
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            {t("home.finalCtaDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-[#FFF32A] to-[#FFF32A]/80 text-black hover:from-[#FFF32A]/90 hover:to-[#FFF32A]/70 font-pixel font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group text-base"
            >
              <Link href="/auth/signup" onClick={handleCta("final_signup", "/auth/signup")}>
                {t("home.getStartedToday")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full transition-all duration-300 bg-transparent text-base font-pixel"
            >
              <Link href="/events" onClick={handleCta("final_events", "/events")}>
                {t("home.exploreEvents")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
