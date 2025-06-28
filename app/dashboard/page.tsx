"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProfileCard } from "@/components/profile-card"
import { MemberSearch } from "@/components/member-search"
import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"
import {
  Edit,
  ExternalLink,
  UserPlus,
  LogOut,
  CheckCircle,
  ArrowRight,
  Users,
  MessageCircle,
  FileText,
  Sparkles,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <ErrorBoundaryWrapper>
        <Dashboard />
      </ErrorBoundaryWrapper>
    </AuthGuard>
  )
}

// Обновленная функция для проверки, является ли профиль реальным (созданным пользователем)
function isRealProfile(profile: any): boolean {
  if (!profile) return false

  // Проверяем наличие обязательных полей вместо проверки только secret_number
  const requiredFields = ["nickname", "first_name", "last_name"]

  // Проверяем, что хотя бы одно из полей заполнено
  return requiredFields.some((field) => profile[field] && profile[field].trim() !== "")
}

// Обновим функцию isProfileComplete для проверки, что профиль полностью заполнен
function isProfileComplete(profile: any): boolean {
  if (!profile) return false

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

// Компонент для отображения шагов
function StepGuide({
  profile,
  profileComplete,
  realProfile,
}: { profile: any; profileComplete: boolean; realProfile: boolean }) {
  const { t } = useTranslation()

  const steps = [
    {
      id: 1,
      title: t("dashboard.step1Title"),
      description: t("dashboard.step1Description"),
      completed: realProfile && profileComplete,
      current: !realProfile || !profileComplete,
      icon: FileText,
    },
    {
      id: 2,
      title: t("dashboard.step2Title"),
      description: t("dashboard.step2Description"),
      completed: false, // Мы не можем отследить это автоматически
      current: realProfile && profileComplete,
      icon: MessageCircle,
    },
    {
      id: 3,
      title: t("dashboard.step3Title"),
      description: t("dashboard.step3Description"),
      completed: false, // Мы не можем отследить это автоматически
      current: false,
      icon: CheckCircle,
    },
  ]

  return (
    <Card className="border-2 border-dashed border-[#00AEC7]/30 bg-gradient-to-br from-[#00AEC7]/5 to-[#FFF32A]/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#00AEC7]" />
          <CardTitle className="text-[#00AEC7]">{t("dashboard.quickStartTitle")}</CardTitle>
        </div>
        <CardDescription>{t("dashboard.quickStartDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.completed
                    ? "bg-green-100 border-green-500 text-green-600"
                    : step.current
                      ? "bg-[#FFF32A] border-[#FFF32A] text-black"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-0.5 h-8 mt-2 ${step.completed ? "bg-green-300" : "bg-gray-200"}`} />
              )}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2 mb-1">
                <step.icon className="h-4 w-4 text-[#00AEC7]" />
                <h3
                  className={`font-medium ${
                    step.completed ? "text-green-600" : step.current ? "text-[#00AEC7]" : "text-gray-600"
                  }`}
                >
                  {step.title}
                </h3>
                {step.completed && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {t("dashboard.completed")}
                  </Badge>
                )}
                {step.current && <Badge className="bg-[#FFF32A] text-black text-xs">{t("dashboard.current")}</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Компонент информационного блока о дашборде
function DashboardInfo() {
  const { t } = useTranslation()

  return (
    <Card className="bg-gradient-to-r from-[#00AEC7]/10 to-[#FFF32A]/10 border-[#00AEC7]/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-[#00AEC7] flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#00AEC7] mb-2">{t("dashboard.whatIsDashboardTitle")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("dashboard.whatIsDashboardDescription")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-[#00AEC7]" />
                {t("dashboard.feature1")}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-[#FFF32A]" />
                {t("dashboard.feature2")}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-[#00AEC7]" />
                {t("dashboard.feature3")}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Обновим функцию Dashboard для лучшей обработки состояний
function Dashboard() {
  const { user, profile, loading, profileError, signOut, initialized } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const [isClient, setIsClient] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  // Добавим отладочный вывод для проверки состояния профиля
  useEffect(() => {
    if (profile) {
      console.log("Profile state:", {
        isRealProfile: isRealProfile(profile),
        isProfileComplete: isProfileComplete(profile),
        hasSecretNumber: profile.secret_number !== undefined && profile.secret_number !== null,
        requiredFields: {
          nickname: !!profile.nickname,
          first_name: !!profile.first_name,
          last_name: !!profile.last_name,
          current_city: !!profile.current_city,
          about_you: !!profile.about_you,
          motivation: !!profile.motivation,
        },
        wordCounts: {
          about_you: profile.about_you ? profile.about_you.trim().split(/\s+/).filter(Boolean).length : 0,
          motivation: profile.motivation ? profile.motivation.trim().split(/\s+/).filter(Boolean).length : 0,
        },
        profile: profile,
      })
    }
  }, [profile])

  // Проверяем, заполнен ли профиль полностью
  const profileComplete = isProfileComplete(profile)
  const realProfile = isRealProfile(profile)

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
    <div className="container py-8 space-y-8">
      {/* Заголовок и приветствие */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#00AEC7]">
          {t("dashboard.welcome")}
          {profile ? `, ${profile.first_name}` : ""}!
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("dashboard.description")}</p>
      </div>

      {/* Информационный блок о дашборде */}
      <DashboardInfo />

      {/* Пошаговый гайд */}
      <StepGuide profile={profile} profileComplete={profileComplete} realProfile={realProfile} />

      {/* Основной контент */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ProfileCard profile={profile} loading={loading} error={profileError} />
        </div>

        <div className="space-y-6">
          {/* Карточка для создания профиля - показываем только если профиль не существует или не реальный */}
          {(!profile || !realProfile) && !loading && !profileError && (
            <Card className="border-2 border-dashed border-[#FFF32A]/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#00AEC7]" />
                  <CardTitle className="text-[#00AEC7]">{t("dashboard.registerCardTitle")}</CardTitle>
                </div>
                <CardDescription>{t("dashboard.registerCardDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#FFF32A]/10 border border-[#FFF32A]/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground">{t("dashboard.reason_to_fill_profile")}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/profile?mode=create" className="w-full">
                  <Button className={`w-full ${yellowButtonStyle}`}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t("dashboard.registerCard")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}

          {/* Карточка для управления профилем - показываем только если профиль существует и реальный */}
          {profile && realProfile && (
            <Card style={gradientBorderStyle}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-[#00AEC7]" />
                  <CardTitle className="text-[#00AEC7]">
                    {profileComplete ? t("dashboard.profileCompleteTitle") : t("dashboard.incompleteProfile")}
                  </CardTitle>
                </div>
                {profileComplete && (
                  <Badge className="bg-green-100 text-green-700 w-fit">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {t("dashboard.profileReady")}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {profileComplete ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" className={`${yellowButtonStyle}`} onClick={handleEditProfile}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t("dashboard.editProfile")}
                    </Button>
                    <Link href={`/users/${profile.nickname}`}>
                      <Button variant="outline" className={`w-full ${yellowButtonStyle}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("dashboard.viewProfile")}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className={`${yellowButtonStyle} sm:col-span-2`}
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("dashboard.signOut")}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800">{t("dashboard.incompleteProfileMessage")}</p>
                    </div>
                    <Button className={`w-full ${yellowButtonStyle}`} onClick={handleEditProfile}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t("dashboard.completeProfileButton")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Telegram Verification Button - always visible but disabled when profile is incomplete */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="h-4 w-4 text-[#00AEC7]" />
                    <span className="font-medium text-[#00AEC7]">{t("dashboard.telegramVerificationTitle")}</span>
                  </div>
                  {!profileComplete && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-800">{t("dashboard.completeProfileForTelegram")}</p>
                    </div>
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
                      {profileComplete && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <Card style={gradientBorderStyle}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#00AEC7]" />
                <CardTitle className="text-[#00AEC7]">{t("dashboard.communityMembers")}</CardTitle>
              </div>
              <CardDescription>{t("dashboard.findCommunityMembers")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Using the exact same MemberSearch component from /search */}
              <MemberSearch />

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">💡 {t("dashboard.searchTip")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
