"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProfileCard } from "@/components/profile-card"
import { MemberSearch } from "@/components/member-search"
import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"
import { Edit, ExternalLink, UserPlus, LogOut } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <ErrorBoundaryWrapper>
        <Dashboard />
      </ErrorBoundaryWrapper>
    </AuthGuard>
  )
}

// Изменим функцию isProfileComplete, чтобы она проверяла все обязательные поля

// Добавим новую функцию для проверки, является ли профиль реальным (созданным пользователем)
// или резервным (автоматически сгенерированным)
function isRealProfile(profile: any): boolean {
  if (!profile) return false

  // Если у профиля есть поле secret_number, значит он был сохранен в базе данных
  // и является реальным профилем, созданным пользователем
  return profile.secret_number !== undefined && profile.secret_number !== null
}

// Обновим функцию isProfileComplete для проверки, что профиль полностью заполнен
function isProfileComplete(profile: any): boolean {
  if (!profile) return false

  // Сначала проверяем, что это реальный профиль
  if (!isRealProfile(profile)) return false

  // Check that all required fields are present and not empty
  const requiredFields = ["nickname", "first_name", "last_name", "current_city", "about_you", "motivation"]

  // Check that all required fields are filled and not empty
  for (const field of requiredFields) {
    if (!profile[field] || profile[field].trim() === "") {
      return false
    }
  }

  // Additionally check that about_you and motivation contain at least 10 words
  const aboutYouWords = profile.about_you.trim().split(/\s+/).filter(Boolean).length
  const motivationWords = profile.motivation.trim().split(/\s+/).filter(Boolean).length

  if (aboutYouWords < 10 || motivationWords < 10) {
    return false
  }

  return true
}

// Обновим функцию Dashboard для лучшей обработки состояний
function Dashboard() {
  const { user, profile, loading, profileError, signOut, initialized } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const [isClient, setIsClient] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  // Проверяем, заполнен ли профиль полностью
  const profileComplete = isProfileComplete(profile)

  // Используем useEffect для установки isClient в true после монтирования компонента
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Define the gradient border style
  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFEB3B, #00AEC7) 1",
  }

  const handleEditProfile = () => {
    router.push("/profile")
  }

  // Обновим функцию handleSignOut для лучшей обработки выхода из системы

  // Улучшенная функция выхода из системы
  const handleSignOut = async () => {
    if (isSigningOut) return // Предотвращаем повторные нажатия

    setIsSigningOut(true)

    // Показываем уведомление о выходе
    toast({
      title: "Signing out...",
      description: "Please wait while we sign you out.",
    })

    try {
      // Добавляем таймаут безопасности для случая, если signOut зависнет
      const timeoutId = setTimeout(() => {
        console.warn("Sign out timeout - forcing page reload")
        window.location.replace("/")
      }, 3000)

      // Вызываем signOut напрямую
      await signOut()

      // Очищаем таймаут, если signOut выполнился успешно
      clearTimeout(timeoutId)
    } catch (error) {
      console.error("Error during sign out:", error)
      setIsSigningOut(false)

      toast({
        title: "Error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      })

      // В случае ошибки, все равно пытаемся перенаправить пользователя
      setTimeout(() => {
        window.location.replace("/")
      }, 1000)
    }
  }

  // Показываем загрузку только если не инициализировано
  // Но НЕ блокируем рендеринг, если просто loading=true, так как это может быть загрузка профиля
  if (!initialized) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  // Если нет пользователя после инициализации, перенаправляем на страницу входа
  if (!user) {
    router.push("/signin")
    return null
  }

  // Если компонент еще не смонтирован на клиенте, показываем скелетон
  if (!isClient) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-1">
            <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="md:col-span-1 space-y-6">
            <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-60 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  // Общий стиль для всех кнопок на странице дашборда
  const yellowButtonStyle = "bg-[#FFF32A] text-black hover:bg-[#FFF32A]/90 border-[#FFF32A]"

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#00AEC7]">
          {t("dashboard.welcome")}
          {profile ? `, ${profile.first_name}` : ""}!
        </h1>
        <p className="text-muted-foreground">{t("dashboard.description")}</p>
      </div>

      {/* Изменяем сетку с 1:3 на 1:1 (50% на 50%) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-1">
          <ProfileCard profile={profile} loading={loading} error={profileError} />
        </div>

        <div className="md:col-span-1 space-y-6">
          {(!profile || !isRealProfile(profile)) && !loading && !profileError && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#00AEC7]">{t("dashboard.registerCardTitle")}</CardTitle>
                <CardDescription>{t("dashboard.registerCardDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{t("dashboard.reason_to_fill_profile")}</p>
              </CardContent>
              <CardFooter>
                <Link href="/profile?mode=create" className="w-full">
                  <Button className={`w-full ${yellowButtonStyle}`}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t("dashboard.registerCard")}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}

          {profile && isRealProfile(profile) && (
            <Card style={gradientBorderStyle}>
              <CardHeader>
                <CardTitle className="text-[#00AEC7]">
                  {profileComplete ? t("dashboard.profileCompleteTitle") : t("dashboard.incompleteProfile")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileComplete ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      className={`w-full sm:flex-1 ${yellowButtonStyle}`}
                      onClick={handleEditProfile}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {t("dashboard.editProfile")}
                    </Button>
                    <Link href={`/users/${profile.nickname}`} className="w-full sm:flex-1">
                      <Button variant="outline" className={`w-full ${yellowButtonStyle}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("dashboard.viewProfile")}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className={`w-full sm:flex-1 ${yellowButtonStyle}`}
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("dashboard.signOut")}
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-4">{t("dashboard.incompleteProfileMessage")}</p>
                    <Button className={`w-full ${yellowButtonStyle}`} onClick={handleEditProfile}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t("dashboard.completeProfileButton")}
                    </Button>
                  </>
                )}

                {/* Telegram Verification Button - always visible but disabled when profile is incomplete */}
                <div className="mt-10">
                  {!profileComplete && (
                    <p className="text-sm text-amber-500 mb-2">
                      {t("dashboard.completeProfileForTelegram") ||
                        "Please complete your profile to verify with Telegram"}
                    </p>
                  )}
                  <Link
                    href={
                      profileComplete
                        ? `https://t.me/databek_bot?start=verify_${profile.nickname}_${profile.secret_number || 0}`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full ${!profileComplete ? "pointer-events-none" : ""}`}
                    onClick={(e) => !profileComplete && e.preventDefault()}
                  >
                    <Button
                      className={`w-full ${profileComplete ? yellowButtonStyle : "bg-[#FFF32A]/50 text-black border-[#FFF32A]/50"}`}
                      disabled={!profileComplete}
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.296c-.146.658-.537.818-1.084.51l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.054 5.56-5.022c.242-.213-.054-.334-.373-.121L8.48 13.278l-2.95-.924c-.642-.204-.654-.642.135-.953l11.447-4.415c.538-.196 1.006.13.45 1.262z" />
                      </svg>
                      {t("dashboard.completeRegistration")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <Card style={gradientBorderStyle}>
            <CardHeader>
              <CardTitle className="text-[#00AEC7]">{t("dashboard.communityMembers")}</CardTitle>
              <CardDescription>{t("dashboard.findCommunityMembers")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Using the exact same MemberSearch component from /search */}
              <MemberSearch />

              <div className="mt-4 text-sm text-muted-foreground">
                <p>{t("dashboard.searchTip") || "Search for members by name, nickname, or position"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
