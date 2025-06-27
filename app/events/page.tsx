"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BlobImage } from "@/components/ui/blob-image"
import { Calendar, Clock, MapPin, Users, ExternalLink, Ticket } from "lucide-react"
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
]

export default function EventsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("upcoming")

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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                            alt={t(`events_announcements.dsml_meetup_2025.speakers.${speaker.key}.name`)}
                            width={120}
                            height={160}
                            className="w-full h-auto object-contain transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm group-hover:text-[#00AEC7] transition-colors">
                            {t(`events_announcements.dsml_meetup_2025.speakers.${speaker.key}.name`)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t(`events_announcements.dsml_meetup_2025.speakers.${speaker.key}.role`)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {t("events_announcements.dsml_meetup_2025.speakers_note")}
                </p>
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
