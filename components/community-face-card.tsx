"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BlobImage } from "@/components/ui/blob-image"
import { MapPin, Linkedin, Globe, MessageSquare, Award } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

interface CommunityFaceProps {
  face: {
    id: number
    name: string
    title: string | null
    title_ru: string | null
    description: string | null
    description_ru: string | null
    location: string | null
    image_path: string | null
    linkedin: string | null
    website: string | null
    telegram: string | null
    kaggle: string | null
  }
}

export function CommunityFaceCard({ face }: CommunityFaceProps) {
  const [imageError, setImageError] = useState(false)
  const { language } = useLanguage()

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
  }

  // Get the appropriate title based on language
  const title = language === "ru" && face.title_ru ? face.title_ru : face.title
  const description = language === "ru" && face.description_ru ? face.description_ru : face.description

  // Generate a fallback image URL if image_path is null or there's an error
  const fallbackImageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${face.name}`

  // Construct the full image URL from Supabase storage
  const imageUrl = face.image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/faces/${face.image_path.replace(/^faces\//, "")}`
    : fallbackImageUrl

  // Log both the original path and constructed URL for debugging
  console.log("Original image_path:", face.image_path)
  console.log("Constructed image URL:", imageUrl)

  return (
    <Card className="w-full overflow-hidden relative bg-white h-full" style={gradientBorderStyle}>
      {/* White background base layer */}
      <div className="absolute inset-0 bg-white"></div>

      {/* Background pattern layer - no opacity */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('/images/card_background.png')`,
        }}
      ></div>

      <CardContent className="p-4 flex flex-col items-center text-center relative z-10">
        {/* Profile Image */}
        <div
          className="w-[150px] h-[150px] mb-3 bg-white p-2 rounded-md relative z-10 flex items-center justify-center"
          style={gradientBorderStyle}
        >
          <BlobImage
            src={!imageError ? imageUrl : fallbackImageUrl}
            alt={face.name}
            width={130}
            height={130}
            className="w-[130px] h-[130px] object-cover"
            onError={() => setImageError(true)}
            fallbackSrc={fallbackImageUrl}
          />
        </div>

        {/* Name and Title */}
        <h2 className="text-lg font-bold text-[#00AEC7] mb-1">{face.name}</h2>

        {title && (
          <div className="flex items-center justify-center gap-1 mb-2">
            <Award className="h-4 w-4 text-[#00AEC7]" />
            <p className="text-sm font-medium text-[#00AEC7]">{title}</p>
          </div>
        )}

        {/* Location */}
        {face.location && (
          <div className="flex items-center justify-center gap-1 mb-3">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{face.location}</span>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="w-full mb-3 p-2 rounded-md bg-white/80" style={gradientBorderStyle}>
            <p className="text-xs text-black">{description}</p>
          </div>
        )}

        {/* Social Links */}
        <div className="flex items-center justify-center gap-3 mt-auto pt-1">
          {face.linkedin && (
            <Link
              href={face.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00AEC7] hover:opacity-80 transition-opacity"
              title="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          )}
          {face.website && (
            <Link
              href={face.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00AEC7] hover:opacity-80 transition-opacity"
              title="Website"
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">Website</span>
            </Link>
          )}
          {face.telegram && (
            <Link
              href={`https://t.me/${face.telegram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00AEC7] hover:opacity-80 transition-opacity"
              title="Telegram"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Telegram</span>
            </Link>
          )}
          {face.kaggle && (
            <Link
              href={face.kaggle}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00AEC7] hover:opacity-80 transition-opacity"
              title="Kaggle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 2L2 12l10 10 10-10z" />
              </svg>
              <span className="sr-only">Kaggle</span>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
