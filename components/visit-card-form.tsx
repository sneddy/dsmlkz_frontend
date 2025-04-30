"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BlobImage } from "@/components/ui/blob-image"
import { Download, Share2, MapPin, Linkedin, Globe } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import html2canvas from "html2canvas"
import Link from "next/link"

interface VisitCardFormProps {
  profile: {
    nickname: string
    first_name: string
    last_name: string
    current_city?: string
    university?: string
    relevant_company?: string
    relevant_position?: string
    about_you?: string
    motivation?: string
    linkedin?: string
    other_links?: string // Изменено с personal_website на other_links
  }
}

export function VisitCardForm({ profile }: VisitCardFormProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const cardRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFD700, #00b2b2) 1",
  }

  const downloadCard = async () => {
    if (!cardRef.current) return

    try {
      const canvas = await html2canvas(cardRef.current)
      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `${profile.first_name}-${profile.last_name}-dsml-card.png`
      link.click()
    } catch (error) {
      console.error("Error generating card:", error)
    }
  }

  const shareCard = async () => {
    if (!cardRef.current) return

    try {
      const canvas = await html2canvas(cardRef.current)
      canvas.toBlob(async (blob) => {
        if (!blob) return

        if (navigator.share) {
          const file = new File([blob], `${profile.first_name}-${profile.last_name}-dsml-card.png`, {
            type: "image/png",
          })
          await navigator.share({
            title: "DSML Kazakhstan Visit Card",
            files: [file],
          })
        } else {
          // Fallback if Web Share API is not available
          downloadCard()
        }
      })
    } catch (error) {
      console.error("Error sharing card:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center rounded-md border p-1">
          <Button variant={theme === "light" ? "default" : "ghost"} size="sm" onClick={() => setTheme("light")}>
            {t("profile.lightTheme")}
          </Button>
          <Button variant={theme === "dark" ? "default" : "ghost"} size="sm" onClick={() => setTheme("dark")}>
            {t("profile.darkTheme")}
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <div ref={cardRef} className={`w-full max-w-md ${theme === "dark" ? "dark bg-slate-900" : ""}`}>
          <Card
            className={`border-2 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"} relative overflow-hidden`}
          >
            <div
              className={`absolute inset-0 ${theme === "dark" ? "opacity-20" : "opacity-30"}`}
              style={{
                backgroundImage: "url(/images/card_background.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col items-center text-center">
                {/* Profile Image */}
                <BlobImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name} ${profile.last_name}`}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  width={96}
                  height={96}
                  className="rounded-full h-24 w-24 mb-4"
                />

                {/* Name and Basic Info */}
                <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : ""}`}>
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className={`${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>
                  @{profile.nickname}
                </p>

                {/* Professional Information */}
                {profile.relevant_position && (
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : ""}`}>
                    {profile.relevant_position}
                  </p>
                )}
                {profile.relevant_company && (
                  <p className={`text-sm ${theme === "dark" ? "text-slate-400" : ""}`}>{profile.relevant_company}</p>
                )}

                {/* Location */}
                {profile.current_city && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <MapPin className={`h-3 w-3 ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`} />
                    <span className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>
                      {profile.current_city}
                    </span>
                  </div>
                )}
              </div>

              {/* About You Section with Gradient Border */}
              {profile.about_you && (
                <div
                  className={`w-full mt-4 p-3 rounded-md ${theme === "dark" ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur-sm`}
                  style={gradientBorderStyle}
                >
                  <h3 className={`text-sm font-semibold mb-1 ${theme === "dark" ? "text-white" : ""}`}>
                    {t("profile.aboutYou")}
                  </h3>
                  <p className={`text-xs ${theme === "dark" ? "text-slate-300" : ""}`}>{profile.about_you}</p>
                </div>
              )}

              {/* Education */}
              {profile.university && (
                <div className="mt-3 text-center">
                  <span className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>
                    {t("profile.education")}:
                  </span>
                  <span className={`text-xs ml-1 ${theme === "dark" ? "text-white" : ""}`}>{profile.university}</span>
                </div>
              )}

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3 mt-3">
                {profile.linkedin && (
                  <Link
                    href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${theme === "dark" ? "text-white" : "text-foreground"} hover:opacity-80 transition-opacity`}
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                )}
                {profile.other_links && (
                  <Link
                    href={
                      profile.other_links.startsWith("http") ? profile.other_links : `https://${profile.other_links}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${theme === "dark" ? "text-white" : "text-foreground"} hover:opacity-80 transition-opacity`}
                  >
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Personal Website</span>
                  </Link>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>
                  DSML Kazakhstan Community
                </div>
                <div className={`text-xs font-medium ${theme === "dark" ? "text-primary" : "text-primary"}`}>
                  dsml.kz
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={downloadCard} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {t("profile.download")}
        </Button>
        <Button variant="outline" onClick={shareCard} className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          {t("profile.share")}
        </Button>
      </div>
    </div>
  )
}
