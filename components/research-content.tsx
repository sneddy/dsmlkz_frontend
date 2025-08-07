"use client"

import { SectionHero } from "@/components/section-hero"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Users, Video, BookOpen, PlayCircle } from 'lucide-react'

export default function ResearchContent() {
  const { t } = useTranslation()

  const handleJoinForm = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSf3SoRR2UEDvVAPI8VyamTNLaYlhLnOKfq94FhoxIc71C-ZBg/viewform?usp=sharing&ouid=101677006101023042026', '_blank')
  }

  const handlePlaylistView = () => {
    window.open('https://youtube.com/playlist?list=PLtm67qQGvjOxZ-GBIFHvK_SIWAOxhxe3G&si=LsDX4lpRPz2p4oIa', '_blank')
  }

  return (
    <div className="min-h-screen">
      <SectionHero
        title={t("research.title")}
        subtitle={t("research.subtitle")}
        description={t("research.description")}
      />
      
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Central Asian Researchers Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-8 w-8" style={{ color: '#00AEC7' }} />
              <h2 className="text-3xl font-bold">{t("research.sections.researchers.title")}</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("research.sections.researchers.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" style={{ color: '#00AEC7' }} />
                  {t("research.sections.researchers.joinForm")}
                </CardTitle>
                <CardDescription>
                  {t("research.sections.researchers.joinFormDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleJoinForm}
                  className="w-full"
                  style={{ backgroundColor: '#00AEC7', color: 'white' }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t("research.cta.submitProfile")}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: '#00AEC7' }} />
                  Research Directory
                </CardTitle>
                <CardDescription>
                  Browse researcher profiles and their publications from across Central Asia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  style={{ borderColor: '#00AEC7', color: '#00AEC7' }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Browse Researchers
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Research Seminars & Videos Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Video className="h-8 w-8" style={{ color: '#00AEC7' }} />
              <h2 className="text-3xl font-bold">{t("research.sections.seminars.title")}</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("research.sections.seminars.description")}
            </p>
          </div>

          {/* Horizontal Video Feed */}
          <div className="w-full">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {/* Video 1 - DSML Reading Club #1 */}
              <div className="flex-none w-80">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base leading-tight">DSML Reading Club #1</CardTitle>
                    <CardDescription className="text-sm">
                      Byte Latent Transformer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/JN-adAvbAcs?si=Qr4VAgkJLua9ZYVL" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Video 2 - DSML Reading Club #2 */}
              <div className="flex-none w-80">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base leading-tight">DSML Reading Club #2</CardTitle>
                    <CardDescription className="text-sm">
                      Visual Geometry Grounded Transformer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/TVZoU1m5WKI?si=_OZQqiG9fb-ZHFJ-" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Video 3 - DSML Reading Club #3 */}
              <div className="flex-none w-80">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base leading-tight">DSML Reading Club #3</CardTitle>
                    <CardDescription className="text-sm">
                      Computing General Random Walk Graph Kernels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/_SNLAOX1wqI?si=ZND-hbrrcvX4EBTz" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Video Playlist Section */}
          <div className="text-center space-y-6 mt-12">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <PlayCircle className="h-6 w-6" style={{ color: '#00AEC7' }} />
                  Complete Video Library
                </CardTitle>
                <CardDescription>
                  Access our full collection of research seminars, reading club sessions, and community presentations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handlePlaylistView}
                  size="lg"
                  className="w-full"
                  style={{ backgroundColor: '#00AEC7', color: 'white' }}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  View Full Playlist on YouTube
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 px-4 rounded-2xl" style={{ backgroundColor: '#00AEC7' }}>
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">
              {t("research.cta.joinHub")}
            </h2>
            <p className="text-xl text-white/90">
              Be part of the growing AI/ML research community in Central Asia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleJoinForm}
                size="lg"
                className="bg-white hover:bg-gray-100"
                style={{ color: '#00AEC7' }}
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                {t("research.cta.submitProfile")}
              </Button>
              <Button 
                onClick={handlePlaylistView}
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                <Video className="h-5 w-5 mr-2" />
                {t("research.cta.watchSeminars")}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
