"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BlobImage } from "@/shared/ui/blob_image"
import { ExternalLink, MapPin, Building, GraduationCap, User, Globe } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

interface ProfileCardProps {
  profile: {
    id: string
    nickname: string
    first_name: string
    last_name: string
    current_city?: string
    university?: string
    relevant_company?: string
    relevant_position?: string
    about_you?: string
    linkedin?: string
    other_links?: string
    avatar_url?: string
  }
  showViewButton?: boolean
  className?: string
  compact?: boolean
}

export function ProfileCard({ 
  profile, 
  showViewButton = true, 
  className = "",
  compact = false 
}: ProfileCardProps) {
  const { t } = useTranslation()

  const getAvatarUrl = () => {
    if (profile.avatar_url) {
      return profile.avatar_url
    }
    // Fallback to DiceBear initials
    const name = `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
  }

  const getDisplayName = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`
    }
    if (profile.first_name) {
      return profile.first_name
    }
    if (profile.last_name) {
      return profile.last_name
    }
    return profile.nickname
  }

  if (compact) {
    return (
      <Card className={`bg-gray-800/30 backdrop-blur-sm border border-gray-700 hover:border-[#00AEC7]/50 transition-all duration-300 hover:scale-105 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <BlobImage
              src={getAvatarUrl()}
              alt={getDisplayName()}
              width={48}
              height={48}
              className="rounded-full h-12 w-12 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">
                {getDisplayName()}
              </h3>
              <p className="text-sm text-[#00AEC7] truncate">
                @{profile.nickname}
              </p>
              {profile.relevant_position && (
                <p className="text-sm text-gray-300 truncate">
                  {profile.relevant_position}
                  {profile.relevant_company && (
                    <span className="text-gray-400"> @ {profile.relevant_company}</span>
                  )}
                </p>
              )}
              {profile.current_city && (
                <p className="text-xs text-gray-400 truncate">
                  📍 {profile.current_city}
                </p>
              )}
            </div>
            {showViewButton && (
              <Link href={`/users/${profile.nickname}`}>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7]/10 flex-shrink-0"
                >
                  {t("view")}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-gray-800/30 backdrop-blur-sm border border-gray-700 hover:border-[#00AEC7]/50 transition-all duration-300 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <BlobImage
            src={getAvatarUrl()}
            alt={getDisplayName()}
            width={80}
            height={80}
            className="rounded-full h-20 w-20 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl text-white mb-2">
              {getDisplayName()}
            </CardTitle>
            <p className="text-lg text-[#00AEC7] mb-2">
              @{profile.nickname}
            </p>
            {profile.relevant_position && (
              <p className="text-gray-300">
                {profile.relevant_position}
                {profile.relevant_company && (
                  <span className="text-gray-400"> @ {profile.relevant_company}</span>
                )}
              </p>
            )}
          </div>
          {showViewButton && (
            <Link href={`/users/${profile.nickname}`}>
              <Button 
                variant="outline"
                className="border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7]/10"
              >
                {t("view")}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location */}
        {profile.current_city && (
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="h-4 w-4 text-[#00AEC7]" />
            <span>{profile.current_city}</span>
          </div>
        )}

        {/* Education */}
        {profile.university && (
          <div className="flex items-center gap-2 text-gray-300">
            <GraduationCap className="h-4 w-4 text-[#00AEC7]" />
            <span>{profile.university}</span>
          </div>
        )}

        {/* Work */}
        {profile.relevant_company && (
          <div className="flex items-center gap-2 text-gray-300">
            <Building className="h-4 w-4 text-[#00AEC7]" />
            <span>{profile.relevant_company}</span>
          </div>
        )}

        {/* About */}
        {profile.about_you && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#00AEC7]" />
              <span className="text-sm font-medium text-[#00AEC7]">О себе</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {profile.about_you}
            </p>
          </div>
        )}

        {/* Social Links */}
        {(profile.linkedin || profile.other_links) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#00AEC7]" />
              <span className="text-sm font-medium text-[#00AEC7]">Социальные сети</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#00AEC7] hover:text-[#00AEC7]/80 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  LinkedIn
                </a>
              )}
              {profile.other_links && (
                <a
                  href={profile.other_links}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#00AEC7] hover:text-[#00AEC7]/80 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Сайт
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
