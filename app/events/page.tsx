"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BlobImage } from "@/components/ui/blob-image"
import { Calendar, Clock, MapPin, Users, ExternalLink, Ticket, ChevronDown, ChevronUp, Coffee } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

const speakerProfiles = [
  {
    key: "anuar",
    profileUrl: "https://www.dsml.kz/users/sneddy",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/anuar.jpg",
  },
  {
    key: "renat",
    profileUrl: "https://www.dsml.kz/users/alimbekovkz",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/renat.jpg",
  },
  {
    key: "ayana",
    profileUrl: "https://www.dsml.kz/users/Ayana",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/ayana.jpg",
  },
  {
    key: "zhzh",
    profileUrl: "https://www.dsml.kz/users/cruigo93",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/zhzh.jpg",
  },
  {
    key: "dulat",
    profileUrl: "https://www.dsml.kz/users/atabekdulat",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/dulat.jpg",
  },
  {
    key: "max",
    profileUrl: "https://www.dsml.kz/users/yamazaki",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/max.jpg",
  },
  {
    key: "ivan",
    profileUrl: "#",
    imageUrl: "/images/speakers/ivan.jpg",
  },
]

export default function EventsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showProgram, setShowProgram] = useState(false)

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2 font-pixel text-[#FFF32A] text-center">{t("nav.events")}</h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-6">{t("events.description")}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t("events.upcoming")}
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("events.past")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-8">
          {/* Main Event Card */}
          <Card className="overflow-hidden">
            <div className="relative">
              <BlobImage
                src="/images/announce_horizontal.png"
                alt="DSML MEETUP 2025"
                width={1200}
                height={400}
                className="w-full h-auto object-contain"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-[#FFF32A] text-black font-semibold">
                  {t("events_announcements.dsml_meetup_2025.badge")}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">{t("events_announcements.dsml_meetup_2025.title")}</CardTitle>
              <CardDescription className="text-lg">
                {t("events_announcements.dsml_meetup_2025.subtitle")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">{t("events_announcements.dsml_meetup_2025.date")}</p>
                    <p className="text-sm text-muted-foreground">{t("events_announcements.dsml_meetup_2025.day")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">{t("events_announcements.dsml_meetup_2025.time")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("events_announcements.dsml_meetup_2025.gathering")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">{t("events_announcements.dsml_meetup_2025.venue")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("events_announcements.dsml_meetup_2025.address")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">{t("events_announcements.dsml_meetup_2025.description_1")}</p>
                <p>{t("events_announcements.dsml_meetup_2025.description_2")}</p>
              </div>

              {/* Speakers Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t("events_announcements.dsml_meetup_2025.speakers_title")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                  {speakerProfiles.map((speaker, index) => (
                    <Link
                      key={index}
                      href={speaker.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="text-center space-y-2">
                        <div className="relative overflow-hidden rounded-lg">
                          <BlobImage
                            src={speaker.imageUrl}
                            alt={`Speaker ${index + 1}`}
                            width={120}
                            height={160}
                            className="w-full h-auto object-contain transition-transform group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {t("events_announcements.dsml_meetup_2025.speakers_note")}
                </p>

                {/* Expandable Program Timeline */}
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowProgram(!showProgram)}
                    className="w-full flex items-center justify-center gap-2 bg-muted/50 hover:bg-muted"
                  >
                    {showProgram ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {showProgram
                      ? t("events_announcements.dsml_meetup_2025.hide_program")
                      : t("events_announcements.dsml_meetup_2025.show_program")}
                  </Button>

                  {showProgram && (
                    <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="bg-muted/30 rounded-lg p-6">
                        <h4 className="text-lg font-semibold mb-4 text-[#00AEC7]">
                          {t("events_announcements.dsml_meetup_2025.program_title")}
                        </h4>

                        <div className="space-y-6">
                          {/* Talk 1 - Anuar Welcome */}
                          <div className="border-l-4 border-[#FFF32A] pl-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-[#FFF32A] rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {t("events_announcements.dsml_meetup_2025.talks.anuar_welcome.time")}
                                  </Badge>
                                  <h5 className="font-semibold text-[#00AEC7]">
                                    {t("events_announcements.dsml_meetup_2025.talks.anuar_welcome.speaker")}
                                  </h5>
                                </div>
                                <p className="font-medium mb-2">
                                  {t("events_announcements.dsml_meetup_2025.talks.anuar_welcome.topic")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {t("events_announcements.dsml_meetup_2025.talks.anuar_welcome.abstract")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Talk 2 - Zhuldyzhan */}
                          <div className="border-l-4 border-[#00AEC7] pl-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-[#00AEC7] rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {t("events_announcements.dsml_meetup_2025.talks.zhuldyzhan.time")}
                                  </Badge>
                                  <h5 className="font-semibold text-[#00AEC7]">
                                    {t("events_announcements.dsml_meetup_2025.talks.zhuldyzhan.speaker")}
                                  </h5>
                                </div>
                                <p className="font-medium mb-2">
                                  {t("events_announcements.dsml_meetup_2025.talks.zhuldyzhan.topic")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {t("events_announcements.dsml_meetup_2025.talks.zhuldyzhan.abstract")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Talk 3 - Ayana */}
                          <div className="border-l-4 border-[#FFF32A] pl-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-[#FFF32A] rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {t("events_announcements.dsml_meetup_2025.talks.ayana.time")}
                                  </Badge>
                                  <h5 className="font-semibold text-[#00AEC7]">
                                    {t("events_announcements.dsml_meetup_2025.talks.ayana.speaker")}
                                  </h5>
                                </div>
                                <p className="font-medium mb-2">
                                  {t("events_announcements.dsml_meetup_2025.talks.ayana.topic")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {t("events_announcements.dsml_meetup_2025.talks.ayana.abstract")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Talk 4 - Jimmy Yamazaki */}
                          <div className="border-l-4 border-[#00AEC7] pl-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-[#00AEC7] rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {t("events_announcements.dsml_meetup_2025.talks.jimmy.time")}
                                  </Badge>
                                  <h5 className="font-semibold text-[#00AEC7]">
                                    {t("events_announcements.dsml_meetup_2025.talks.jimmy.speaker")}
                                  </h5>
                                </div>
                                <p className="font-medium mb-2">
                                  {t("events_announcements.dsml_meetup_2025.talks.jimmy.topic")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {t("events_announcements.dsml_meetup_2025.talks.jimmy.abstract")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Break */}
                          <div className="border-l-4 border-gray-300 pl-4">
                            <div className="flex items-start gap-3">
                              <Coffee className="w-4 h-4 text-gray-500 mt-2 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {t("events_announcements.dsml_meetup_2025.talks.break_time")}
                                  </Badge>
                                  <p className="font-medium text-gray-600">
                                    {t("events_announcements.dsml_meetup_2025.talks.break")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Talk 5 - Renat */}
                          <div className="border-l-4 border-[#FFF32A] pl-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-[#FFF32A] rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {t("events_announcements.dsml_meetup_2025.talks.renat.time")}
                                  </Badge>
                                  <h5 className="font-semibold text-[#00AEC7]">
                                    {t("events_announcements.dsml_meetup_2025.talks.renat.speaker")}
                                  </h5>
                                </div>
                                <p className="font-medium mb-2">
                                  {t("events_announcements.dsml_meetup_2025.talks.renat.topic")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {t("events_announcements.dsml_meetup_2025.talks.renat.abstract")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Talk 6 - Dulat */}
                          <div className="border-l-4 border-[#00AEC7] pl-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-[#00AEC7] rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {t("events_announcements.dsml_meetup_2025.talks.dulat.time")}
                                  </Badge>
                                  <h5 className="font-semibold text-[#00AEC7]">
                                    {t("events_announcements.dsml_meetup_2025.talks.dulat.speaker")}
                                  </h5>
                                </div>
                                <p className="font-medium mb-2">
                                  {t("events_announcements.dsml_meetup_2025.talks.dulat.topic")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {t("events_announcements.dsml_meetup_2025.talks.dulat.abstract")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Talk 7 - Ivan NEW SPEAKER */}
                          <div className="border-l-4 border-[#FFF32A] pl-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-[#FFF32A] rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {t("events_announcements.dsml_meetup_2025.talks.ivan.time")}
                                  </Badge>
                                  <h5 className="font-semibold text-[#00AEC7]">
                                    {t("events_announcements.dsml_meetup_2025.talks.ivan.speaker")}
                                  </h5>
                                </div>
                                <p className="font-medium mb-2">
                                  {t("events_announcements.dsml_meetup_2025.talks.ivan.topic")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {t("events_announcements.dsml_meetup_2025.talks.ivan.abstract")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Talk 8 - Anuar Delivery */}
                          <div className="border-l-4 border-[#00AEC7] pl-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-[#00AEC7] rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {t("events_announcements.dsml_meetup_2025.talks.anuar_delivery.time")}
                                  </Badge>
                                  <h5 className="font-semibold text-[#00AEC7]">
                                    {t("events_announcements.dsml_meetup_2025.talks.anuar_delivery.speaker")}
                                  </h5>
                                </div>
                                <p className="font-medium mb-2">
                                  {t("events_announcements.dsml_meetup_2025.talks.anuar_delivery.topic")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {t("events_announcements.dsml_meetup_2025.talks.anuar_delivery.abstract")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing and Registration */}
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-[#00AEC7]" />
                      <span className="font-semibold">{t("events_announcements.dsml_meetup_2025.pricing_title")}</span>
                    </div>
                    <p className="text-2xl font-bold">{t("events_announcements.dsml_meetup_2025.price")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("events_announcements.dsml_meetup_2025.discount")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link href="https://forms.gle/az9sGAzZacJw5Zb56" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="w-full bg-[#FFF32A] text-black hover:bg-[#FFF32A]/90">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t("events_announcements.dsml_meetup_2025.register_button")}
                      </Button>
                    </Link>
                    <Link href="https://t.me/DSMLmeetup" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="lg" className="w-full bg-transparent">
                        {t("events_announcements.dsml_meetup_2025.ask_question_button")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* All Speakers Image */}
              <div className="rounded-lg overflow-hidden">
                <BlobImage
                  src="https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers_all_horizontal.png"
                  alt="Все спикеры DSML MEETUP 2025"
                  width={1200}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {/* DSML AI Meetup 2019 */}
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{t("events_past.dsml_ai_meetup_2019.year")}</Badge>
                <Badge variant="outline">{t("events_past.dsml_ai_meetup_2019.location")}</Badge>
              </div>
              <CardTitle className="text-2xl">{t("events_past.dsml_ai_meetup_2019.title")}</CardTitle>
              <CardDescription className="text-lg">{t("events_past.dsml_ai_meetup_2019.subtitle")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">{t("events_past.dsml_ai_meetup_2019.description")}</p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">{t("events_past.dsml_ai_meetup_2019.year")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("events_past.dsml_ai_meetup_2019.meetup_number")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">{t("events_past.dsml_ai_meetup_2019.venue")}</p>
                    <p className="text-sm text-muted-foreground">{t("events_past.dsml_ai_meetup_2019.location")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">{t("events_past.dsml_ai_meetup_2019.participants")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("events_past.dsml_ai_meetup_2019.participants_note")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Videos Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  {t("events_past.dsml_ai_meetup_2019.videos_title")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: "j5VnAxAjgnQ", title: "Доклад 1" },
                    { id: "HDsJaxpQ2oI", title: "Доклад 2" },
                    { id: "BUTUC3wk548", title: "Доклад 3" },
                    { id: "gU1BcfZLpQk", title: "Доклад 4" },
                    { id: "4U278oeSHt8", title: "Доклад 5" },
                    { id: "5DE681nlHtM", title: "Доклад 6" },
                    { id: "s7dJ8ltrkj4", title: "Доклад 7" },
                  ].map((video, index) => (
                    <div key={video.id} className="group">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.id}`}
                          title={`DSML AI Meetup 2019 - ${video.title}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          className="transition-transform group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium text-center">
                        {t("events_past.talk_number")} {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Meetup Astana 2018 */}
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{t("events_past.ai_meetup_astana_2018.year")}</Badge>
                <Badge variant="outline">{t("events_past.ai_meetup_astana_2018.location")}</Badge>
              </div>
              <CardTitle className="text-2xl">{t("events_past.ai_meetup_astana_2018.title")}</CardTitle>
              <CardDescription className="text-lg">{t("events_past.ai_meetup_astana_2018.subtitle")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">{t("events_past.ai_meetup_astana_2018.description")}</p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">{t("events_past.ai_meetup_astana_2018.year")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("events_past.ai_meetup_astana_2018.meetup_number")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">{t("events_past.ai_meetup_astana_2018.venue")}</p>
                    <p className="text-sm text-muted-foreground">{t("events_past.ai_meetup_astana_2018.location")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">{t("events_past.ai_meetup_astana_2018.participants")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("events_past.ai_meetup_astana_2018.participants_note")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Videos Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  {t("events_past.ai_meetup_astana_2018.videos_title")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: "l5V_UD5ouG0", title: "Доклад 1" },
                    { id: "hTwvqDu4Q9I", title: "Доклад 2" },
                    { id: "iI1ekmGFL0o", title: "Доклад 3" },
                    { id: "kwzRijN0V28", title: "Доклад 4" },
                  ].map((video, index) => (
                    <div key={video.id} className="group">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.id}`}
                          title={`AI Meetup Astana 2018 - ${video.title}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          className="transition-transform group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium text-center">
                        {t("events_past.talk_number")} {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Тотальный митап 2018 */}
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{t("events_past.total_meetup_2018.year")}</Badge>
                <Badge variant="outline">{t("events_past.total_meetup_2018.location")}</Badge>
              </div>
              <CardTitle className="text-2xl">{t("events_past.total_meetup_2018.title")}</CardTitle>
              <CardDescription className="text-lg">{t("events_past.total_meetup_2018.subtitle")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">{t("events_past.total_meetup_2018.description")}</p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">{t("events_past.total_meetup_2018.year")}</p>
                    <p className="text-sm text-muted-foreground">{t("events_past.total_meetup_2018.meetup_number")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">{t("events_past.total_meetup_2018.venue")}</p>
                    <p className="text-sm text-muted-foreground">{t("events_past.total_meetup_2018.location")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">{t("events_past.total_meetup_2018.participants")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("events_past.total_meetup_2018.participants_note")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Videos Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  {t("events_past.total_meetup_2018.videos_title")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: "Ta-Wvfmqfpo", title: "Доклад 1" },
                    { id: "-5yhoxGI-jM", title: "Доклад 2" },
                    { id: "Yhr58V7h6BM", title: "Доклад 3" },
                    { id: "sYBa4UScneU", title: "Доклад 4" },
                  ].map((video, index) => (
                    <div key={video.id} className="group">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.id}`}
                          title={`Тотальный митап 2018 - ${video.title}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          className="transition-transform group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium text-center">
                        {t("events_past.talk_number")} {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
