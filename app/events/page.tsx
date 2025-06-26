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
    name: "Джимми Ямазаки",
    role: "Deep Learning Engineer",
    profileUrl: "https://www.dsml.kz/users/yamazaki",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/speakers/max.jpg",
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
                src="https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/meetup2025/announce_vertical.png"
                alt="DSML MEETUP 2025"
                width={1200}
                height={400}
                className="w-full h-64 md:h-80 object-cover"
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
          <div className="text-center py-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Пока нет прошлых событий</h3>
              <p className="text-muted-foreground">Здесь будут отображаться завершенные мероприятия DSML сообщества</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
