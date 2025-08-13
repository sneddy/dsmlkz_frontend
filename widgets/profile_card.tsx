"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, Linkedin, Globe, Edit, Eye } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { BlobImage } from "@/shared/ui/blob_image"
import Link from "next/link"

// Функция для проверки, является ли URL сгенерированным аватаром
const isGeneratedAvatar = (url: string | null | undefined): boolean => {
  if (!url) return true
  return url.includes("dicebear.com") || url.includes("api.dicebear")
}

interface ProfileCardProps {
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
    other_links?: string
    avatar_url?: string
  } | null
  isPublic?: boolean
  error?: Error | null
  loading?: boolean
  onEditProfile?: () => void
}

export function ProfileCard({ profile, isPublic = false, error, loading, onEditProfile }: ProfileCardProps) {
  const { t } = useTranslation()
  const [imageError, setImageError] = useState(false)

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
          {!isPublic && (
            <Button className="mt-4" onClick={() => (window.location.href = "/profile?mode=create")}>
              Создать профиль
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Проверяем, является ли аватар сгенерированным
  const avatarUrl =
    profile.avatar_url && !imageError
      ? profile.avatar_url
      : `https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name} ${profile.last_name}`

  const isGenerated = isGeneratedAvatar(avatarUrl)

  // Определяем размеры в зависимости от типа аватара
  const imageContainerClass = isGenerated ? "w-[200px] h-auto p-2" : "w-[450px] h-auto p-4"
  const imageWidth = isGenerated ? 180 : 450
  const imageHeight = isGenerated ? 180 : 450

  // Основной рендеринг профиля
  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden relative" style={gradientBorderStyle}>
      {/* Белый фон - базовый слой */}
      <div className="absolute inset-0 bg-white"></div>

      {/* Фоновое изображение шаблона - второй слой */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('/images/card_background.png')`,
        }}
      ></div>

      {/* Изображение профиля вверху с изменением размера без обрезки */}
      <div className="relative w-full flex items-center justify-center bg-white z-10 p-4">
        <div
          className={`${imageContainerClass} flex items-center justify-center bg-white rounded-md`}
          style={gradientBorderStyle}
        >
          <BlobImage
            src={avatarUrl}
            alt={`${profile.first_name} ${profile.last_name}`}
            width={imageWidth}
            height={imageHeight}
            className="w-full h-auto object-contain"
            onError={() => setImageError(true)}
            fallbackSrc={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name} ${profile.last_name}`}
          />
        </div>
      </div>

      {/* Содержимое карточки - верхний слой */}
      <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
        {/* Name and Basic Info - имя teal цветом */}
        <h2 className="text-2xl font-bold text-[#00AEC7] mb-2">
          {profile.first_name} {profile.last_name}
        </h2>
        <p className="text-lg text-black mb-2">@{profile.nickname}</p>

        {/* Professional Information */}
        {profile.relevant_position && <p className="text-md font-medium text-[#00AEC7]">{profile.relevant_position}</p>}
        {profile.relevant_company && <p className="text-sm text-black mb-2">{profile.relevant_company}</p>}

        {/* Location */}
        {profile.current_city && (
          <div className="flex items-center justify-center gap-1 mb-4">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{profile.current_city}</span>
          </div>
        )}

        {/* About You Section with Gradient Border */}
        {profile.about_you && (
          <div className="w-full mb-4 p-4 rounded-md bg-white" style={gradientBorderStyle}>
            <h3 className="font-semibold mb-2 text-[#00AEC7]">{t("profile.aboutYou")}</h3>
            <p className="text-sm text-black">{profile.about_you}</p>
          </div>
        )}

        {/* Motivation Section with Gradient Border */}
        {profile.motivation && (
          <div className="w-full mb-4 p-4 rounded-md bg-white" style={gradientBorderStyle}>
            <h3 className="font-semibold mb-2 text-[#00AEC7]">{t("profile.motivation")}</h3>
            <p className="text-sm text-black">{profile.motivation}</p>
          </div>
        )}

        {/* Education Section with Gradient Border */}
        {profile.university && (
          <div className="w-full mb-4 p-4 rounded-md bg-white" style={gradientBorderStyle}>
            <h3 className="font-semibold mb-2 text-[#00AEC7]">{t("profile.education")}</h3>
            <p className="text-sm text-black">{profile.university}</p>
          </div>
        )}

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 mt-2">
          {profile.linkedin && (
            <Link
              href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00AEC7] hover:opacity-80 transition-opacity"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          )}
          {profile.other_links && (
            <Link
              href={profile.other_links.startsWith("http") ? profile.other_links : `https://${profile.other_links}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00AEC7] hover:opacity-80 transition-opacity"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Personal Website</span>
            </Link>
          )}
        </div>

        {/* Action Buttons - only show for non-public profiles */}
        {!isPublic && (
          <div className="w-full pt-4 mt-4 border-t border-gray-200">
            <div className="flex gap-3 justify-center">
              {onEditProfile && (
                <Button onClick={onEditProfile} size="sm" className="bg-[#00AEC7] text-white hover:bg-[#00AEC7]/90">
                  <Edit className="h-4 w-4 mr-2" />
                  {t("dashboard.editProfile")}
                </Button>
              )}
              <Link href={`/users/${profile.nickname}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7]/10 bg-transparent"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {t("dashboard.viewProfile")}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
