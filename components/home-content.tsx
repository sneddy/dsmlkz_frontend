"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NewsFeed } from "@/components/news-feed"
import { useTranslation } from "@/hooks/use-translation"
import { useEffect, useState } from "react"

export function HomeContent() {
  const { t } = useTranslation()
  const [isClient, setIsClient] = useState(false)

  // Устанавливаем флаг isClient после монтирования компонента
  useEffect(() => {
    setIsClient(true)
  }, [])

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
  }

  // Если компонент еще не смонтирован на клиенте, показываем скелетон
  if (!isClient) {
    return (
      <div className="flex flex-col gap-8 py-8 bg-black">
        <div className="container py-8">
          <div className="h-96 bg-gray-800 animate-pulse rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-800 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 py-8 bg-black">
      {/* Hero Section */}
      <section className="relative w-full z-0">
        <div className="relative w-full">
          <Image
            src="/images/hero-banner.png"
            alt="DSML Kazakhstan - Deeper Is Better"
            width={1920}
            height={600}
            className="w-full h-auto object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 pb-6 md:pb-10">
            <div className="container px-4 md:px-6 text-center">
              <div className="bg-black/30 p-5 rounded-lg backdrop-blur-sm inline-block">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl text-[#FFF32A] mb-3 font-pixel">
                  {t("home.title")}
                </h1>
                <p className="mx-auto max-w-[650px] text-[#FFF32A] text-base md:text-lg mb-5">{t("home.subtitle")}</p>
                <Link href="/signup">
                  <Button className="bg-[#FFF32A] text-black hover:bg-[#FFF32A]/90">{t("home.joinButton")}</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Telegram Channels Section */}
      <section className="container px-4 md:px-6 py-6">
        <h2 className="text-2xl font-bold mb-4 font-pixel text-[#FFF32A] text-center">{t("home.channelsTitle")}</h2>
        <p className="text-center mb-8 max-w-3xl mx-auto text-white">{t("home.communityDescription")}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Discussion Hub */}
          <Card style={gradientBorderStyle}>
            <CardHeader>
              <CardTitle className="font-pixel text-[#00AEC7]">{t("home.discussionHubTitle")}</CardTitle>
              <CardDescription>{t("home.discussionHubDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <span className="bg-[#00AEC7]/10 text-[#00AEC7] text-xs font-medium px-2 py-1 rounded-full">
                  1,500+ active members
                </span>
              </div>
              <Link href="/signup" className="flex items-center text-[#00AEC7] hover:underline">
                Register to join <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          {/* News Feed */}
          <Card style={gradientBorderStyle}>
            <CardHeader>
              <CardTitle className="font-pixel text-[#00AEC7]">{t("home.newsFeedTitle")}</CardTitle>
              <CardDescription>{t("home.newsFeedDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <span className="bg-[#00AEC7]/10 text-[#00AEC7] text-xs font-medium px-2 py-1 rounded-full">
                  3,400 subscribers
                </span>
              </div>
              <Link
                href="https://t.me/main_ds_kz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[#00AEC7] hover:underline"
              >
                {t("home.joinButton")} <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          {/* DS Jobs */}
          <Card style={gradientBorderStyle}>
            <CardHeader>
              <CardTitle className="font-pixel text-[#00AEC7]">{t("home.dataJobsTitle")}</CardTitle>
              <CardDescription>{t("home.dataJobsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <span className="bg-[#00AEC7]/10 text-[#00AEC7] text-xs font-medium px-2 py-1 rounded-full">
                  8,200 subscribers
                </span>
              </div>
              <Link
                href="https://t.me/ml_jobs_kz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[#00AEC7] hover:underline"
              >
                {t("home.joinButton")} <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          {/* IT Jobs */}
          <Card style={gradientBorderStyle}>
            <CardHeader>
              <CardTitle className="font-pixel text-[#00AEC7]">{t("home.itJobsTitle")}</CardTitle>
              <CardDescription>{t("home.itJobsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <span className="bg-[#00AEC7]/10 text-[#00AEC7] text-xs font-medium px-2 py-1 rounded-full">
                  6,000 subscribers
                </span>
              </div>
              <Link
                href="https://t.me/it_jobs_kz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[#00AEC7] hover:underline"
              >
                {t("home.joinButton")} <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          {/* YouTube Channel */}
          <Card style={gradientBorderStyle}>
            <CardHeader>
              <CardTitle className="font-pixel text-[#00AEC7]">{t("home.youtubeChannelTitle")}</CardTitle>
              <CardDescription>{t("home.youtubeChannelDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <span className="bg-[#00AEC7]/10 text-[#00AEC7] text-xs font-medium px-2 py-1 rounded-full">
                  Educational content
                </span>
              </div>
              <Link
                href="https://www.youtube.com/c/DataScienceKazakhstan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[#00AEC7] hover:underline"
              >
                {t("home.subscribeButton")} <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          {/* LinkedIn Page */}
          <Card style={gradientBorderStyle}>
            <CardHeader>
              <CardTitle className="font-pixel text-[#00AEC7]">{t("home.linkedinPageTitle")}</CardTitle>
              <CardDescription>{t("home.linkedinPageDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <span className="bg-[#00AEC7]/10 text-[#00AEC7] text-xs font-medium px-2 py-1 rounded-full">
                  1,200 followers
                </span>
              </div>
              <Link
                href="https://www.linkedin.com/company/53101063/admin/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[#00AEC7] hover:underline"
              >
                {t("home.subscribeButton")} <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Community Values Section */}
      <section className="bg-muted py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-6 text-center font-pixel text-[#FFF32A]">{t("rules.valuesTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-background" style={gradientBorderStyle}>
              <CardHeader>
                <CardTitle className="font-pixel text-[#00AEC7]">{t("home.communityFirst")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("home.communityFirstDesc")}</p>
              </CardContent>
            </Card>
            <Card className="bg-background" style={gradientBorderStyle}>
              <CardHeader>
                <CardTitle className="font-pixel text-[#00AEC7]">{t("home.continuousLearning")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("home.continuousLearningDesc")}</p>
              </CardContent>
            </Card>
            <Card className="bg-background" style={gradientBorderStyle}>
              <CardHeader>
                <CardTitle className="font-pixel text-[#00AEC7]">{t("home.careerGrowth")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("home.careerGrowthDesc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News Feed Section - moved to the end */}
      <section className="container px-4 md:px-6 py-6">
        <h2 className="text-2xl font-bold mb-6 font-pixel text-[#FFF32A] text-center">{t("newsFeed.title")}</h2>
        <NewsFeed showFullText={false} />
      </section>
    </div>
  )
}
