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

const speakers = [
  {
    name: "Ануар Аймолдин",
    role: "Founder, DSML.KZ",
    profileUrl: "https://www.dsml.kz/users/sneddy",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/anuar.jpg",
  },
  {
    name: "Ренат Алимбеков",
    role: "Data Science & Data Analytics Consultant",
    profileUrl: "https://www.dsml.kz/users/alimbekovkz",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/renat.jpg",
  },
  {
    name: "Аяна Мусабаева",
    role: "PhD researcher, MBZUAI",
    profileUrl: "https://www.dsml.kz/users/Ayana",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/ayana.jpg",
  },
  {
    name: "Жулдыз-Жан Сагимбаев",
    role: "Lead ML Engineer, Cerebra AI",
    profileUrl: "https://www.dsml.kz/users/cruigo93",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/zhzh.jpg",
  },
  {
    name: "Дулат Атабек",
    role: "Head of Quantitative Research, Atlas Capital",
    profileUrl: "https://www.dsml.kz/users/atabekdulat",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/dulat.jpg",
  },
  {
    name: "Джимми Ямазаки",
    role: "Deep Learning Engineer",
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
        <h1 className="text-3xl font-bold mb-2 font-pixel text-[#FFF32A] text-center">
          {t("nav.events") || "События"}
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-6">
          Следите за анонсами и участвуйте в мероприятиях DSML сообщества
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Анонсы
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Прошлые события
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
                <Badge className="bg-[#FFF32A] text-black font-semibold">АНОНС</Badge>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">DSML MEETUP 2025</CardTitle>
              <CardDescription className="text-lg">MOST IT Hub Almaty • 05.07.2025</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">5 июля 2025</p>
                    <p className="text-sm text-muted-foreground">Суббота</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">12:00 - 18:00</p>
                    <p className="text-sm text-muted-foreground">Сбор: 11:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">MOST IT Hub</p>
                    <p className="text-sm text-muted-foreground">Ходжанова 2/2</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">
                  5 июля в MOST IT Hub Almaty пройдет DSML meetup 2025! Вас ждут новые знакомства и интересные доклады
                  от резидентов dsml.kz.
                </p>
                <p>
                  Обсудим, как готовились задачи для первой республиканской AI олимпиады; как используются генеративные
                  модели в медицинской нейровизуализации; в чем разница подходов машинного обучения в академическом
                  рисерче и индустрии; world модели в современном обучении с подкреплением и много чего еще!
                </p>
              </div>

              {/* Speakers Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Спикеры
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {speakers.map((speaker, index) => (
                    <Link
                      key={index}
                      href={speaker.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="text-center space-y-2">
                        <div className="relative overflow-hidden rounded-lg aspect-square">
                          <BlobImage
                            src={speaker.imageUrl}
                            alt={speaker.name}
                            width={120}
                            height={120}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm group-hover:text-[#00AEC7] transition-colors">
                            {speaker.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{speaker.role}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  • и другие специалисты и резиденты нашего сообщества!
                </p>
              </div>

              {/* Pricing and Registration */}
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-[#00AEC7]" />
                      <span className="font-semibold">Стоимость участия</span>
                    </div>
                    <p className="text-2xl font-bold">5.000 ₸</p>
                    <p className="text-sm text-muted-foreground">Студентам бакалавриата и школьникам скидка 50%</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link href="https://forms.gle/az9sGAzZacJw5Zb56" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="w-full bg-[#FFF32A] text-black hover:bg-[#FFF32A]/90">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Зарегистрироваться
                      </Button>
                    </Link>
                    <Link href="https://t.me/DSMLmeetup" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="lg" className="w-full">
                        Задать вопрос
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
                <Badge variant="secondary">2019</Badge>
                <Badge variant="outline">Астана</Badge>
              </div>
              <CardTitle className="text-2xl">DSML AI Meetup</CardTitle>
              <CardDescription className="text-lg">
                Назарбаев Университет • Первый масштабный ивент по ИИ
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">
                  Шестой митап DSML сообщества и первый масштабный ивент в Казахстане, посвященный искусственному
                  интеллекту. Мероприятие было проведено в стенах Назарбаев Университета и включало как технические
                  доклады и туториалы, так и визионерские сессии и обзоры конференций.
                </p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">2019</p>
                    <p className="text-sm text-muted-foreground">Шестой митап DSML</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">Назарбаев Университет</p>
                    <p className="text-sm text-muted-foreground">Астана</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">200+ участников</p>
                    <p className="text-sm text-muted-foreground">Крупнейший ивент по AI в стране</p>
                  </div>
                </div>
              </div>

              {/* Videos Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Записи докладов
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
                      <p className="mt-2 text-sm font-medium text-center">Доклад {index + 1}</p>
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
                <Badge variant="secondary">2018</Badge>
                <Badge variant="outline">Астана</Badge>
              </div>
              <CardTitle className="text-2xl">AI Meetup Astana</CardTitle>
              <CardDescription className="text-lg">Astana Hub • Первый в Казахстане ивент по ИИ</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">
                  Пятый митап DSML сообщества и первый в Казахстане ивент, посвященный искусственному интеллекту.
                  Мероприятие было проведено в стенах Astana Hub и включало как теоретические доклады и туториалы по
                  генерации текста, так и визионерские сессии.
                </p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">2018</p>
                    <p className="text-sm text-muted-foreground">Пятый митап DSML</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">Astana Hub</p>
                    <p className="text-sm text-muted-foreground">Астана</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">100+ участников</p>
                    <p className="text-sm text-muted-foreground">Первопроходцы AI</p>
                  </div>
                </div>
              </div>

              {/* Videos Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Записи докладов
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
                      <p className="mt-2 text-sm font-medium text-center">Доклад {index + 1}</p>
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
                <Badge variant="secondary">2018</Badge>
                <Badge variant="outline">Алматы</Badge>
              </div>
              <CardTitle className="text-2xl">Тотальный митап</CardTitle>
              <CardDescription className="text-lg">
                Smart Point • Крупнейший митап по ML и анализу данных
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">
                  Крупнейший в свое время митап, посвященный машинному обучению и анализу данных. Мероприятие было
                  проведено в стенах Smart Point и собрало рекордное количество участников для обсуждения актуальных тем
                  в области data science.
                </p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">2018</p>
                    <p className="text-sm text-muted-foreground">Тотальный формат</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">Smart Point</p>
                    <p className="text-sm text-muted-foreground">Алматы</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#00AEC7]" />
                  <div>
                    <p className="font-semibold">200+ участников</p>
                    <p className="text-sm text-muted-foreground">Крупнейший митап</p>
                  </div>
                </div>
              </div>

              {/* Videos Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Записи докладов
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
                      <p className="mt-2 text-sm font-medium text-center">Доклад {index + 1}</p>
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
