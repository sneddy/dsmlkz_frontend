"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BlobImage } from "@/shared/ui/blob_image"
import { 
  ExternalLink, 
  MapPin, 
  Building, 
  GraduationCap, 
  User, 
  Globe, 
  Edit, 
  Eye,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

interface ProfileDisplayCardProps {
  profile: {
    id?: string
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
  } | null
  variant?: "dashboard" | "faces" | "search"
  showViewButton?: boolean
  showEditButton?: boolean
  onEditProfile?: () => void
  className?: string
  compact?: boolean
  loading?: boolean
  error?: Error | null
  fixedLayout?: boolean
}

export function ProfileDisplayCard({ 
  profile, 
  variant = "faces",
  showViewButton = true, 
  showEditButton = false,
  onEditProfile,
  className = "",
  compact = false,
  loading = false,
  error = null,
  fixedLayout = false
}: ProfileDisplayCardProps) {
  const { t } = useTranslation()
  const [imageError, setImageError] = useState(false)

  // Сбрасываем ошибку изображения при смене профиля
  useEffect(() => {
    setImageError(false)
  }, [profile?.id, profile?.avatar_url])

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFD700, #00b2b2) 1",
  }

  // Показываем состояние загрузки
  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Загрузка профиля...</p>
        </CardContent>
      </Card>
    )
  }

  // Показываем состояние ошибки
  if (error && !profile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Ошибка загрузки профиля</h3>
          <p className="text-muted-foreground text-center mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
        </CardContent>
      </Card>
    )
  }

  // Показываем состояние отсутствия профиля
  if (!profile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground text-center">Профиль не найден</p>
          {showEditButton && (
            <Button className="mt-4" onClick={() => (window.location.href = "/profile?mode=create")}>
              Создать профиль
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  const getAvatarUrl = () => {
    // Если есть avatar_url и нет ошибки - используем его
    if (profile.avatar_url && !imageError) {
      // Проверяем, является ли это полным URL или нужно добавить базовый URL Supabase
      if (profile.avatar_url.startsWith('http')) {
        console.log(`Using full avatar URL for ${profile.nickname}:`, profile.avatar_url)
        return profile.avatar_url
      } else {
        // Если это относительный путь, добавляем базовый URL Supabase
        const fullUrl = `https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`
        console.log(`Using relative avatar URL for ${profile.nickname}:`, fullUrl)
        return fullUrl
      }
    }
    
    // Fallback to DiceBear initials
    const name = `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    if (name) {
      const fallbackUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
      console.log(`Using DiceBear name fallback for ${profile.nickname}:`, fallbackUrl)
      return fallbackUrl
    }
    
    // Если даже имени нет - используем nickname
    const nicknameFallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.nickname)}`
    console.log(`Using DiceBear nickname fallback for ${profile.nickname}:`, nicknameFallback)
    return nicknameFallback
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

  // Compact variant for faces and search
  if (compact) {
    return (
      <Card className={`bg-gray-800/30 backdrop-blur-sm border border-gray-700 hover:border-[#00AEC7]/50 transition-all duration-300 hover:scale-105 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <img
              src={getAvatarUrl()}
              alt={getDisplayName()}
              width={48}
              height={48}
              className="rounded-full h-12 w-12 flex-shrink-0 object-scale-down"
              onError={(e) => {
                setImageError(true)
                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getDisplayName())}`
              }}
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

  // Dashboard variant with gradient borders and background
  if (variant === "dashboard") {
    return (
              <Card className={`w-full max-w-2xl mx-auto overflow-hidden relative ${fixedLayout ? 'h-[720px]' : ''} ${className}`} style={gradientBorderStyle}>
        {/* Белый фон - базовый слой */}
        <div className="absolute inset-0 bg-white"></div>

        {/* Фоновое изображение шаблона - второй слой */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url('/images/card_background.png')`,
          }}
        ></div>

        {/* Изображение профиля на полную ширину с фиксированной высотой */}
        <div className={`relative w-full bg-white z-10 ${fixedLayout ? 'h-[280px]' : 'h-auto'}`}>
          <img
            src={getAvatarUrl()}
            alt={getDisplayName()}
            className={`w-full ${fixedLayout ? 'h-[280px]' : 'h-[300px]'} object-cover`}
            onError={(e) => {
              console.log(`Image failed to load for ${profile.nickname}, trying fallback`)
              setImageError(true)
              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getDisplayName())}`
            }}
          />
        </div>

        {/* Содержимое карточки - верхний слой с фиксированной структурой */}
        <CardContent className={`p-8 flex flex-col items-center text-center relative z-10 ${fixedLayout ? 'h-[460px]' : ''}`}>
          {/* Name and Basic Info - фиксированная высота */}
          <div className={`${fixedLayout ? 'h-[60px]' : ''} mb-4 flex flex-col justify-center`}>
            <h2 className="text-2xl font-bold text-[#00AEC7] mb-1 truncate max-w-full">
              {getDisplayName()}
            </h2>
            <p className="text-lg text-black truncate max-w-full">@{profile.nickname}</p>
          </div>

          {/* Professional Information - фиксированная высота */}
          <div className={`${fixedLayout ? 'h-[40px]' : ''} mb-4 flex flex-col justify-center`}>
            <p className={`text-md font-medium text-[#00AEC7] ${fixedLayout ? 'text-sm' : ''} truncate max-w-full ${!profile.relevant_position && fixedLayout ? 'invisible' : ''}`}>
              {profile.relevant_position || (fixedLayout ? 'Position' : '')}
            </p>
            <p className={`text-black ${fixedLayout ? 'text-xs' : 'text-sm'} truncate max-w-full ${!profile.relevant_company && fixedLayout ? 'invisible' : ''}`}>
              {profile.relevant_company || (fixedLayout ? 'Company' : '')}
            </p>
          </div>

          {/* Location - фиксированная высота */}
          <div className={`flex items-center justify-center gap-1 mb-4 ${fixedLayout ? 'h-[24px]' : ''} ${!profile.current_city && fixedLayout ? 'invisible' : ''}`}>
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {profile.current_city || (fixedLayout ? 'Location' : '')}
            </span>
          </div>

          {/* About You Section - фиксированная высота */}
          <div className={`w-full mb-4 p-4 rounded-md bg-white ${fixedLayout ? 'h-[120px]' : 'min-h-[80px]'} ${!profile.about_you && fixedLayout ? 'invisible' : ''}`} style={gradientBorderStyle}>
            <h3 className="font-semibold mb-2 text-[#00AEC7] text-sm">О себе</h3>
            <p className={`text-black ${fixedLayout ? 'text-xs leading-tight h-[80px]' : 'text-sm'} overflow-hidden`} style={{ 
              display: '-webkit-box',
              WebkitLineClamp: fixedLayout ? 5 : 3,
              WebkitBoxOrient: 'vertical'
            }}>
              {profile.about_you || (fixedLayout ? 'Информация о пользователе для поддержания единообразной компоновки карточек профилей' : '')}
            </p>
          </div>

          {/* Education Section - фиксированная высота */}
          <div className={`w-full mb-4 p-4 rounded-md bg-white ${fixedLayout ? 'h-[80px]' : 'min-h-[80px]'} ${!profile.university && fixedLayout ? 'invisible' : ''}`} style={gradientBorderStyle}>
            <h3 className="font-semibold mb-2 text-[#00AEC7] text-sm">Образование</h3>
            <p className={`text-black ${fixedLayout ? 'text-xs leading-tight h-[40px]' : 'text-sm'} overflow-hidden`} style={{ 
              display: '-webkit-box',
              WebkitLineClamp: fixedLayout ? 3 : 3,
              WebkitBoxOrient: 'vertical'
            }}>
              {profile.university || (fixedLayout ? 'Информация об образовании для поддержания единообразной компоновки карточек' : '')}
            </p>
          </div>

          {/* Social Links - фиксированная высота */}
          <div className={`flex items-center justify-center gap-4 ${fixedLayout ? 'h-[32px] mb-4' : 'mt-2'}`}>
            <Link
              href={profile.linkedin ? (profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`) : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[#00AEC7] hover:opacity-80 transition-opacity ${!profile.linkedin && fixedLayout ? 'invisible' : ''}`}
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href={profile.other_links ? (profile.other_links.startsWith("http") ? profile.other_links : `https://${profile.other_links}`) : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[#00AEC7] hover:opacity-80 transition-opacity ${!profile.other_links && fixedLayout ? 'invisible' : ''}`}
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Personal Website</span>
            </Link>
          </div>

          {/* Action Buttons - всегда внизу */}
          <div className={`w-full pt-4 border-t border-gray-200 ${fixedLayout ? 'mt-auto' : 'mt-4'}`}>
            <div className="flex gap-3 justify-center">
              {showEditButton && onEditProfile && (
                <Button onClick={onEditProfile} size="sm" className="bg-[#00AEC7] text-white hover:bg-[#00AEC7]/90">
                  <Edit className="h-4 w-4 mr-2" />
                  {t("dashboard.editProfile")}
                </Button>
              )}
              {showViewButton && (
                <Link href={`/users/${profile.nickname}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7]/10 bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t("view")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant for faces (full card without gradient borders)
  return (
    <Card className={`bg-gray-800/30 backdrop-blur-sm border border-gray-700 hover:border-[#00AEC7]/50 transition-all duration-300 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <img
            src={getAvatarUrl()}
            alt={getDisplayName()}
            width={80}
            height={80}
            className="rounded-full h-20 w-20 flex-shrink-0 object-scale-down"
            onError={(e) => {
              console.log(`Image failed to load for ${profile.nickname}, trying fallback`)
              setImageError(true)
              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getDisplayName())}`
            }}
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
