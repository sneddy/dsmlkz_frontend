"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BlobImage } from "@/shared/ui/blob_image"
import { Calendar, Clock, MapPin, Users, ExternalLink, Ticket, ChevronDown, ChevronUp, Coffee } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import { SectionHero } from "@/widgets/section_hero"

type EventItem = {
  id: string
  startsAt: string
  endsAt: string
  translationPrefix: string
  imageUrl?: string
  registerUrl?: string
  contactUrl?: string
}

type PastVideoEvent = {
  id: string
  translationPrefix: string
  videos: string[]
}

const dsmlMeetup2025: EventItem = {
  id: "dsml-meetup-2025",
  startsAt: "2025-07-05T12:00:00+05:00",
  endsAt: "2025-07-05T18:00:00+05:00",
  translationPrefix: "events_announcements.dsml_meetup_2025",
  imageUrl: "/images/announce_horizontal.png",
  registerUrl: "https://forms.gle/az9sGAzZacJw5Zb56",
  contactUrl: "https://t.me/DSMLmeetup",
}

const speakerProfiles = [
  {
    key: "anuar",
    profileUrl: "https://dsml.kz/users/sneddy",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/anuar.jpg",
  },
  {
    key: "renat",
    profileUrl: "https://dsml.kz/users/alimbekovkz",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/renat.jpg",
  },
  {
    key: "ayana",
    profileUrl: "https://dsml.kz/users/Ayana",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/ayana.jpg",
  },
  {
    key: "zhzh",
    profileUrl: "https://dsml.kz/users/cruigo93",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/zhzh.jpg",
  },
  {
    key: "dulat",
    profileUrl: "https://dsml.kz/users/atabekdulat",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/dulat.jpg",
  },
  {
    key: "max",
    profileUrl: "https://dsml.kz/users/yamazaki",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/max.jpg",
  },
  {
    key: "ivan",
    profileUrl: "#",
    imageUrl: "/placeholder-user.jpg",
  },
]

const meetup2025Talks = [
  "anuar_welcome",
  "zhuldyzhan",
  "ayana",
  "jimmy",
  "renat",
  "dulat",
  "ivan",
  "anuar_delivery",
]

const pastVideoEvents: PastVideoEvent[] = [
  {
    id: "dsml-ai-meetup-2019",
    translationPrefix: "events_past.dsml_ai_meetup_2019",
    videos: ["j5VnAxAjgnQ", "HDsJaxpQ2oI", "BUTUC3wk548", "gU1BcfZLpQk", "4U278oeSHt8", "5DE681nlHtM", "s7dJ8ltrkj4"],
  },
  {
    id: "ai-meetup-astana-2018",
    translationPrefix: "events_past.ai_meetup_astana_2018",
    videos: ["l5V_UD5ouG0", "hTwvqDu4Q9I", "iI1ekmGFL0o", "kwzRijN0V28"],
  },
  {
    id: "total-meetup-2018",
    translationPrefix: "events_past.total_meetup_2018",
    videos: ["Ta-Wvfmqfpo", "-5yhoxGI-jM", "Yhr58V7h6BM", "sYBa4UScneU"],
  },
]

export default function EventsPage() {
  const { t } = useTranslation()
  const now = new Date()
  const upcomingEvents = [dsmlMeetup2025].filter((event) => new Date(event.endsAt) >= now)
  const recentPastEvents = [dsmlMeetup2025].filter((event) => new Date(event.endsAt) < now)
  const [activeTab, setActiveTab] = useState(upcomingEvents.length > 0 ? "upcoming" : "past")
  const [showProgram, setShowProgram] = useState(false)

  const renderMeetup2025Card = (event: EventItem, isPast: boolean) => {
    const prefix = event.translationPrefix

    return (
      <Card key={event.id} className="overflow-hidden">
        <div className="relative">
          <BlobImage
            src={event.imageUrl || "/images/announce_horizontal.png"}
            alt={t(`${prefix}.title`)}
            width={1200}
            height={400}
            className="w-full h-auto object-contain"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-[#FFF32A] text-black font-semibold">
              {isPast ? t("events.pastEvent") : t(`${prefix}.badge`)}
            </Badge>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">{t(`${prefix}.title`)}</CardTitle>
          <CardDescription className="text-lg">{t(`${prefix}.subtitle`)}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-[#00AEC7]" />
              <div>
                <p className="font-semibold">{t(`${prefix}.date`)}</p>
                <p className="text-sm text-muted-foreground">{t(`${prefix}.day`)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#00AEC7]" />
              <div>
                <p className="font-semibold">{t(`${prefix}.time`)}</p>
                <p className="text-sm text-muted-foreground">{t(`${prefix}.gathering`)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#00AEC7]" />
              <div>
                <p className="font-semibold">{t(`${prefix}.venue`)}</p>
                <p className="text-sm text-muted-foreground">{t(`${prefix}.address`)}</p>
              </div>
            </div>
          </div>

          {isPast && (
            <div className="rounded-lg border border-[#00AEC7]/30 bg-[#00AEC7]/10 p-4 text-sm text-[#67e8f9]">
              {t("events.eventEnded")}
            </div>
          )}

          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed">{t(`${prefix}.description_1`)}</p>
            <p>{t(`${prefix}.description_2`)}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t(`${prefix}.speakers_title`)}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {speakerProfiles.map((speaker) => (
                <Link key={speaker.key} href={speaker.profileUrl} target="_blank" rel="noopener noreferrer" className="group">
                  <div className="text-center space-y-2">
                    <div className="relative overflow-hidden rounded-lg">
                      <BlobImage
                        src={speaker.imageUrl}
                        alt={t(`${prefix}.speakers.${speaker.key}.name`)}
                        width={120}
                        height={160}
                        className="w-full h-auto object-contain transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">{t(`${prefix}.speakers_note`)}</p>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowProgram(!showProgram)}
              className="w-full flex items-center justify-center gap-2 bg-muted/50 hover:bg-muted"
            >
              {showProgram ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showProgram ? t(`${prefix}.hide_program`) : t(`${prefix}.show_program`)}
            </Button>

            {showProgram && (
              <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="bg-muted/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4 text-[#00AEC7]">{t(`${prefix}.program_title`)}</h4>
                  <div className="space-y-6">
                    {meetup2025Talks.slice(0, 4).map((talkKey, index) => (
                      <ProgramTalk key={talkKey} prefix={prefix} talkKey={talkKey} accent={index % 2 === 0 ? "#FFF32A" : "#00AEC7"} />
                    ))}

                    <div className="border-l-4 border-gray-300 pl-4">
                      <div className="flex items-start gap-3">
                        <Coffee className="w-4 h-4 text-gray-500 mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Badge variant="outline" className="text-xs font-mono">
                              {t(`${prefix}.talks.break_time`)}
                            </Badge>
                            <p className="font-medium text-gray-600">{t(`${prefix}.talks.break`)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {meetup2025Talks.slice(4).map((talkKey, index) => (
                      <ProgramTalk key={talkKey} prefix={prefix} talkKey={talkKey} accent={index % 2 === 0 ? "#FFF32A" : "#00AEC7"} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-[#00AEC7]" />
                  <span className="font-semibold">{t(`${prefix}.pricing_title`)}</span>
                </div>
                <p className="text-2xl font-bold">{t(`${prefix}.price`)}</p>
                <p className="text-sm text-muted-foreground">{t(`${prefix}.discount`)}</p>
              </div>
              <div className="flex flex-col gap-3">
                {!isPast && event.registerUrl && (
                  <Button asChild size="lg" className="w-full bg-[#FFF32A] text-black hover:bg-[#FFF32A]/90">
                    <Link href={event.registerUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t(`${prefix}.register_button`)}
                    </Link>
                  </Button>
                )}
                {event.contactUrl && (
                  <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                    <Link href={event.contactUrl} target="_blank" rel="noopener noreferrer">
                      {t(`${prefix}.ask_question_button`)}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden">
            <BlobImage
              src="https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers_all_horizontal.png"
              alt={t(`${prefix}.speakers_title`)}
              width={1200}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen">
      <SectionHero
        title={t("nav.events")}
        subtitleLine1={t("events.description")}
        gradientFrom="#00AEC7"
        gradientTo="#FFF32A"
      />

      <div className="container py-8">
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
            {upcomingEvents.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-semibold text-[#00AEC7]">{t("events.noUpcomingTitle")}</h2>
                  <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("events.noUpcomingDescription")}</p>
                </CardContent>
              </Card>
            ) : (
              upcomingEvents.map((event) => renderMeetup2025Card(event, false))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {recentPastEvents.map((event) => renderMeetup2025Card(event, true))}
            {pastVideoEvents.map((event) => (
              <PastVideoEventCard key={event.id} event={event} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ProgramTalk({ prefix, talkKey, accent }: { prefix: string; talkKey: string; accent: string }) {
  const { t } = useTranslation()

  return (
    <div className="border-l-4 pl-4" style={{ borderColor: accent }}>
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: accent }} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <Badge variant="outline" className="text-xs font-mono">
              {t(`${prefix}.talks.${talkKey}.time`)}
            </Badge>
            <h5 className="font-semibold text-[#00AEC7]">{t(`${prefix}.talks.${talkKey}.speaker`)}</h5>
          </div>
          <p className="font-medium mb-2">{t(`${prefix}.talks.${talkKey}.topic`)}</p>
          <p className="text-sm text-muted-foreground">{t(`${prefix}.talks.${talkKey}.abstract`)}</p>
        </div>
      </div>
    </div>
  )
}

function PastVideoEventCard({ event }: { event: PastVideoEvent }) {
  const { t } = useTranslation()
  const prefix = event.translationPrefix

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{t(`${prefix}.year`)}</Badge>
          <Badge variant="outline">{t(`${prefix}.location`)}</Badge>
        </div>
        <CardTitle className="text-2xl">{t(`${prefix}.title`)}</CardTitle>
        <CardDescription className="text-lg">{t(`${prefix}.subtitle`)}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed">{t(`${prefix}.description`)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#00AEC7]" />
            <div>
              <p className="font-semibold">{t(`${prefix}.year`)}</p>
              <p className="text-sm text-muted-foreground">{t(`${prefix}.meetup_number`)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-[#00AEC7]" />
            <div>
              <p className="font-semibold">{t(`${prefix}.venue`)}</p>
              <p className="text-sm text-muted-foreground">{t(`${prefix}.location`)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-[#00AEC7]" />
            <div>
              <p className="font-semibold">{t(`${prefix}.participants`)}</p>
              <p className="text-sm text-muted-foreground">{t(`${prefix}.participants_note`)}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            {t(`${prefix}.videos_title`)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.videos.map((videoId, index) => (
              <div key={videoId} className="group">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`${t(`${prefix}.title`)} - ${t("events_past.talk_number")} ${index + 1}`}
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
  )
}
