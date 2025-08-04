"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/hooks/use-translation"
import { Users, Heart, Trophy, UserCheck, Sparkles } from "lucide-react"

export function RulesContent() {
  const { t } = useTranslation()

  // Array of community values with icons
  const communityValues = [
    {
      key: "respectfulCommunication",
      icon: Users,
      color: "text-blue-400",
    },
    {
      key: "supportingNewcomers",
      icon: Heart,
      color: "text-red-400",
    },
    {
      key: "celebratingSuccess",
      icon: Trophy,
      color: "text-yellow-400",
    },
    {
      key: "realConnections",
      icon: UserCheck,
      color: "text-green-400",
    },
    {
      key: "beyondAI",
      icon: Sparkles,
      color: "text-purple-400",
    },
  ]

  return (
    <div className="container py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-block mb-6">
          <div className="bg-gradient-to-r from-[#00AEC7] to-[#FFF32A] p-1 rounded-xl">
            <div className="bg-gray-900 rounded-xl px-8 py-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white font-pixel">{t("rules.valuesTitle")}</h1>
            </div>
          </div>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">{t("rules.description")}</p>
      </div>

      {/* Community Guidelines Tabs */}
      <div className="mb-16">
        <Tabs defaultValue="greeting" className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-2 rounded-xl">
            <TabsTrigger
              value="greeting"
              className="data-[state=active]:bg-[#FFF32A] data-[state=active]:text-black data-[state=active]:font-semibold text-gray-300 hover:text-white transition-all duration-200 rounded-lg"
            >
              {t("rules.greetingTitle")}
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-[#00AEC7] data-[state=active]:text-white data-[state=active]:font-semibold text-gray-300 hover:text-white transition-all duration-200 rounded-lg"
            >
              {t("rules.content")}
            </TabsTrigger>
            <TabsTrigger
              value="moderation"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFF32A] data-[state=active]:to-[#00AEC7] data-[state=active]:text-white data-[state=active]:font-semibold text-gray-300 hover:text-white transition-all duration-200 rounded-lg"
            >
              {t("rules.moderationTitle")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="greeting" className="mt-8">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-[#FFF32A] border-2 hover:bg-gray-800/70 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-[#FFF32A]/10 to-[#FFF32A]/5 border-b border-[#FFF32A]/20">
                <CardTitle className="text-2xl text-[#FFF32A] flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  {t("rules.greetingTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <p className="text-gray-300 text-lg leading-relaxed">{t("rules.greetingDescription")}</p>
                <p className="text-gray-300 text-lg leading-relaxed">{t("rules.greetingPart2")}</p>
                <p className="text-gray-300 text-lg leading-relaxed">{t("rules.greetingPart3")}</p>
                <ul className="space-y-3 ml-6">
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-[#FFF32A] mt-2">•</span>
                    {t("rules.greetingBullet1")}
                  </li>
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-[#FFF32A] mt-2">•</span>
                    {t("rules.greetingBullet2")}
                  </li>
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-[#FFF32A] mt-2">•</span>
                    {t("rules.greetingBullet3")}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-8">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-[#00AEC7] border-2 hover:bg-gray-800/70 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-[#00AEC7]/10 to-[#00AEC7]/5 border-b border-[#00AEC7]/20">
                <CardTitle className="text-2xl text-[#00AEC7] flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  {t("rules.content")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <p className="text-gray-300 text-lg leading-relaxed">{t("rules.contentDescription")}</p>
                <ul className="space-y-3 ml-6">
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-[#00AEC7] mt-2">•</span>
                    {t("rules.contentBullet1")}
                  </li>
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-[#00AEC7] mt-2">•</span>
                    {t("rules.contentBullet2")}
                  </li>
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-[#00AEC7] mt-2">•</span>
                    {t("rules.contentBullet3")}
                  </li>
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-[#00AEC7] mt-2">•</span>
                    {t("rules.contentBullet4")}
                  </li>
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-[#00AEC7] mt-2">•</span>
                    {t("rules.contentBullet5")}
                  </li>
                </ul>
                <p className="text-gray-300 text-lg leading-relaxed">{t("rules.contentPart2")}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="mt-8">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-2 border-transparent bg-gradient-to-r from-[#FFF32A]/20 to-[#00AEC7]/20 hover:from-[#FFF32A]/30 hover:to-[#00AEC7]/30 transition-all duration-300">
              <div className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] p-[2px] rounded-t-lg">
                <CardHeader className="bg-gray-800 rounded-t-lg border-b border-gradient-to-r from-[#FFF32A]/20 to-[#00AEC7]/20">
                  <CardTitle className="text-2xl bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-transparent bg-clip-text flex items-center gap-3">
                    <Heart className="w-6 h-6 text-[#FFF32A]" />
                    {t("rules.moderationTitle")}
                  </CardTitle>
                </CardHeader>
              </div>
              <CardContent className="space-y-6 p-8 bg-gray-800 rounded-b-lg">
                <p className="text-gray-300 text-lg leading-relaxed">{t("rules.moderationDescription")}</p>
                <p className="text-gray-300 text-lg leading-relaxed">{t("rules.moderationPart2")}</p>
                <ul className="space-y-3 ml-6">
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-red-400 mt-2">•</span>
                    {t("rules.moderationBullet1")}
                  </li>
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-red-400 mt-2">•</span>
                    {t("rules.moderationBullet2")}
                  </li>
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-red-400 mt-2">•</span>
                    {t("rules.moderationBullet3")}
                  </li>
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-red-400 mt-2">•</span>
                    {t("rules.moderationBullet4")}
                  </li>
                  <li className="text-gray-300 text-lg flex items-start gap-3">
                    <span className="text-red-400 mt-2">•</span>
                    {t("rules.moderationBullet5")}
                  </li>
                </ul>
                <p className="text-gray-300 text-lg leading-relaxed">{t("rules.moderationPart3")}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Community Values Grid */}
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white font-pixel">Наши ценности</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communityValues.map((value) => {
            const IconComponent = value.icon
            return (
              <Card
                key={value.key}
                className="group bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 hover:border-[#00AEC7] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#00AEC7]/20"
              >
                <div className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] p-[2px] rounded-t-lg">
                  <CardHeader className="bg-gray-800 rounded-t-lg p-6">
                    <CardTitle className="text-xl text-white flex items-center gap-3 group-hover:text-[#FFF32A] transition-colors duration-300">
                      <IconComponent
                        className={`w-6 h-6 ${value.color} group-hover:text-[#FFF32A] transition-colors duration-300`}
                      />
                      {t(`rules.${value.key}Title`)}
                    </CardTitle>
                  </CardHeader>
                </div>
                <CardContent className="p-6 bg-gray-800 rounded-b-lg">
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {t(`rules.${value.key}Description`)}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-[#00AEC7]/10 to-[#FFF32A]/10 backdrop-blur-sm border border-gray-700 hover:border-[#00AEC7] transition-all duration-300">
          <CardContent className="p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 font-pixel">
              Присоединяйтесь к нашему сообществу
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Станьте частью крупнейшего AI сообщества Казахстана и развивайтесь вместе с нами
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-black font-semibold px-8 py-4 rounded-xl hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFF32A]/30">
                Зарегистрироваться
              </button>
              <button className="border-2 border-[#00AEC7] text-[#00AEC7] font-semibold px-8 py-4 rounded-xl hover:bg-[#00AEC7] hover:text-white transition-all duration-300">
                Узнать больше
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
