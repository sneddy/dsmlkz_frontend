"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Star,
  Zap,
  Heart,
  Clock,
  Shield,
  Rocket,
  Target,
  TrendingUp,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

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

// Компонент прогресс-бара
function ProgressIndicator({
  profile,
  profileComplete,
  realProfile,
}: { profile: any; profileComplete: boolean; realProfile: boolean }) {
  const { t } = useTranslation()

  const getProgress = () => {
    if (!realProfile) return 0
    if (realProfile && !profileComplete) return 33
    if (profileComplete) return 66
    return 100 // Если все шаги завершены
  }

  const progress = getProgress()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{t("dashboard.yourProgress")}</h3>
        <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
          {progress}% {t("dashboard.complete")}
        </Badge>
      </div>
      <div className="space-y-2">
        <Progress value={progress} className="h-3 bg-gray-200/50 backdrop-blur-sm" />
        <div className="flex justify-between text-xs text-gray-600">
          <span>{t("dashboard.started")}</span>
          <span>{t("dashboard.almostThere")}</span>
          <span>{t("dashboard.completed")}</span>
        </div>
      </div>
    </div>
  )
}

// Компонент для отображения шагов
function StepGuide({
  profile,
  profileComplete,
  realProfile,
  onEditProfile,
  onSignOut,
  isSigningOut,
}: {
  profile: any
  profileComplete: boolean
  realProfile: boolean
  onEditProfile: () => void
  onSignOut: () => void
  isSigningOut: boolean
}) {
  const { t } = useTranslation()

  const steps = [
    {
      id: 1,
      title: t("dashboard.step1Title"),
      description: t("dashboard.step1Description"),
      completed: realProfile && profileComplete,
      current: !realProfile || !profileComplete,
      icon: FileText,
      estimatedTime: "5 min",
      difficulty: "Easy",
    },
    {
      id: 2,
      title: t("dashboard.step2Title"),
      description: t("dashboard.step2Description"),
      completed: false,
      current: realProfile && profileComplete,
      icon: MessageCircle,
      estimatedTime: "2 min",
      difficulty: "Easy",
    },
    {
      id: 3,
      title: t("dashboard.step3Title"),
      description: t("dashboard.step3Description"),
      completed: false,
      current: false,
      icon: CheckCircle,
      estimatedTime: "1 min",
      difficulty: "Easy",
    },
  ]

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50/30 border-0 shadow-2xl h-fit">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00AEC7]/5 via-transparent to-[#FFF32A]/5" />

      <CardHeader className="relative pb-6 bg-gradient-to-r from-[#00AEC7]/10 to-[#FFF32A]/10 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00AEC7] to-cyan-600 flex items-center justify-center shadow-lg">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFF32A] rounded-full flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-black" />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-[#00AEC7] to-cyan-600 bg-clip-text text-transparent">
                {t("dashboard.quickStartTitle")}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1 text-sm">
                {t("dashboard.quickStartDescription")}
              </CardDescription>
            </div>
          </div>
          <div className="hidden sm:block">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-[#00AEC7]/20 text-xs">
              <Target className="h-3 w-3 mr-1" />
              {t("dashboard.getStarted")}
            </Badge>
          </div>
        </div>

        <div className="mt-6">
          <ProgressIndicator profile={profile} profileComplete={profileComplete} realProfile={realProfile} />
        </div>
      </CardHeader>

      <CardContent className="relative p-6 space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="group relative">
            {/* Connection line */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-14 w-0.5 h-12 bg-gradient-to-b from-gray-300 to-gray-200 group-hover:from-[#00AEC7]/50 group-hover:to-[#00AEC7]/20 transition-all duration-500" />
            )}

            <div className="flex gap-4">
              {/* Step indicator */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                    step.completed
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-lg shadow-green-500/25"
                      : step.current
                        ? "bg-gradient-to-br from-[#FFF32A] to-yellow-400 border-[#FFF32A] shadow-lg shadow-yellow-500/25 animate-pulse"
                        : "bg-white border-gray-300 shadow-md hover:shadow-lg hover:border-[#00AEC7]/50"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <step.icon className={`h-5 w-5 ${step.current ? "text-black" : "text-gray-500"}`} />
                  )}
                </div>
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`text-lg font-bold transition-colors duration-300 ${
                        step.completed ? "text-green-600" : step.current ? "text-[#00AEC7]" : "text-gray-700"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <div className="flex gap-1">
                      {step.completed && (
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                          <Star className="h-2.5 w-2.5 mr-1" />
                          {t("dashboard.completed")}
                        </Badge>
                      )}
                      {step.current && (
                        <Badge className="bg-[#FFF32A] text-black border-yellow-300 text-xs">
                          <Zap className="h-2.5 w-2.5 mr-1" />
                          {t("dashboard.current")}
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-white/60 backdrop-blur-sm text-xs">
                        <Clock className="h-2.5 w-2.5 mr-1" />
                        {step.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed text-sm">{step.description}</p>

                {/* Step actions */}
                <div className="space-y-3">
                  {/* Step 1: Fill your profile */}
                  {step.id === 1 && (
                    <div className="space-y-3">
                      {!realProfile ? (
                        <Link href="/profile?mode=create" className="block relative z-10">
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-[#FFF32A] to-yellow-400 text-black hover:from-yellow-400 hover:to-[#FFF32A] border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold cursor-pointer"
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            {t("dashboard.createProfile")}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={onEditProfile}
                            className="relative z-10 bg-white/90 backdrop-blur-sm border-[#00AEC7]/30 text-[#00AEC7] hover:bg-[#00AEC7] hover:text-white transition-all duration-300 font-semibold cursor-pointer"
                          >
                            <Edit className="mr-2 h-3 w-3" />
                            {t("dashboard.editProfile")}
                          </Button>
                          {profileComplete && (
                            <Link href={`/users/${profile.nickname}`} className="relative z-10">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-white/90 backdrop-blur-sm border-[#FFF32A]/50 text-gray-700 hover:bg-[#FFF32A] hover:text-black transition-all duration-300 font-semibold cursor-pointer"
                              >
                                <ExternalLink className="mr-2 h-3 w-3" />
                                {t("dashboard.viewProfile")}
                              </Button>
                            </Link>
                          )}
                        </div>
                      )}
                      {realProfile && !profileComplete && (
                        <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-lg p-3 shadow-inner">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <p className="text-xs font-medium text-amber-800">
                              {t("dashboard.incompleteProfileMessage")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2: Attach your Telegram */}
                  {step.id === 2 && (
                    <div className="space-y-3">
                      {!profileComplete && (
                        <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-lg p-3 shadow-inner">
                          <div className="flex items-center gap-2">
                            <Shield className="h-3 w-3 text-blue-600" />
                            <p className="text-xs font-medium text-blue-800">
                              {t("dashboard.completeProfileForTelegram")}
                            </p>
                          </div>
                        </div>
                      )}
                      <Link
                        href={
                          profileComplete
                            ? `https://t.me/databek_bot?start=verify_${profile.nickname}_${profile.secret_number || 0}`
                            : "#"
                        }
                        target={profileComplete ? "_blank" : undefined}
                        rel={profileComplete ? "noopener noreferrer" : undefined}
                        className={`block relative z-10 ${!profileComplete ? "pointer-events-none" : "cursor-pointer"}`}
                        onClick={(e) => {
                          if (!profileComplete) {
                            e.preventDefault()
                            e.stopPropagation()
                          }
                        }}
                      >
                        <Button
                          size="sm"
                          disabled={!profileComplete}
                          className={`w-full font-semibold transition-all duration-300 transform hover:scale-[1.02] relative z-10 ${
                            profileComplete
                              ? "bg-gradient-to-r from-[#FFF32A] to-yellow-400 text-black hover:from-yellow-400 hover:to-[#FFF32A] border-0 shadow-lg hover:shadow-xl cursor-pointer"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed border-0"
                          }`}
                        >
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.296c-.146.658-.537.818-1.084.51l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.054 5.56-5.022c.242-.213-.054-.334-.373-.121L8.48 13.278l-2.95-.924c-.642-.204-.654-.642.135-.953l11.447-4.415c.538-.196 1.006.13.45 1.262z" />
                          </svg>
                          {t("dashboard.attachTelegram")}
                          {profileComplete && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Step 3: Join our Discussion Hub */}
                  {step.id === 3 && (
                    <div className="space-y-3">
                      <div className="bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-lg p-3 shadow-inner">
                        <div className="flex items-center gap-2">
                          <Heart className="h-3 w-3 text-green-600" />
                          <p className="text-xs font-medium text-green-800">{t("dashboard.enjoyTelegramCommunity")}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Sign Out Button */}
        {realProfile && (
          <div className="border-t border-gray-200/50 pt-6 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={onSignOut}
              disabled={isSigningOut}
              className="w-full bg-red-50/80 backdrop-blur-sm text-red-600 border-red-200/50 hover:bg-red-100 hover:border-red-300 transition-all duration-300 font-semibold"
            >
              <LogOut className="mr-2 h-3 w-3" />
              {isSigningOut ? t("dashboard.signingOut") : t("dashboard.signOut")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Компонент информационного блока о дашборде
function DashboardInfo() {
  const { t } = useTranslation()

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white via-gray-50 to-cyan-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00AEC7]/5 via-transparent to-[#FFF32A]/5" />

      <CardContent className="relative pt-8">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#00AEC7] to-cyan-600 flex items-center justify-center shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <TrendingUp className="h-8 w-8 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#00AEC7] to-cyan-600 bg-clip-text text-transparent mb-3">
              {t("dashboard.whatIsDashboardTitle")}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">{t("dashboard.whatIsDashboardDescription")}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { color: "bg-[#00AEC7]", text: t("dashboard.feature1"), icon: Edit },
                { color: "bg-[#FFF32A]", text: t("dashboard.feature2"), icon: Users },
                { color: "bg-green-500", text: t("dashboard.feature3"), icon: Rocket },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-sm text-gray-600 group p-3 rounded-lg hover:bg-white/60 transition-all duration-300"
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${feature.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="group-hover:text-gray-800 transition-colors duration-300 font-medium">
                    {feature.text}
                  </span>
                </div>
              ))}
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

  // Проверяем, заполнен ли профиль полностью
  const profileComplete = isProfileComplete(profile)
  const realProfile = isRealProfile(profile)

  // Используем useEffect для установки isClient в true после монтирования компонента
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleEditProfile = () => {
    router.push("/profile")
  }

  // Улучшенная функция выхода из системы
  const handleSignOut = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)

    toast({
      title: t("dashboard.signingOut"),
      description: t("dashboard.pleaseWait"),
    })

    try {
      const timeoutId = setTimeout(() => {
        console.warn("Sign out timeout - forcing page reload")
        window.location.replace("/")
      }, 3000)

      await signOut()
      clearTimeout(timeoutId)
    } catch (error) {
      console.error("Error during sign out:", error)
      setIsSigningOut(false)

      toast({
        title: t("dashboard.error"),
        description: t("dashboard.signOutError"),
        variant: "destructive",
      })

      setTimeout(() => {
        window.location.replace("/")
      }, 1000)
    }
  }

  // Loading state
  if (!initialized) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#00AEC7]/20 border-t-[#00AEC7] rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-[#FFF32A]/20 border-b-[#FFF32A] rounded-full animate-spin animate-reverse" />
          </div>
        </div>
      </div>
    )
  }

  // Redirect if no user
  if (!user) {
    router.push("/signin")
    return null
  }

  // Client-side skeleton
  if (!isClient) {
    return (
      <div className="container py-12 space-y-8">
        <div className="text-center space-y-4">
          <div className="h-16 w-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse mx-auto" />
        </div>
        <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse" />
          <div className="h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="relative inline-block">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-[#00AEC7] via-cyan-500 to-blue-600 bg-clip-text text-transparent leading-tight">
            {t("dashboard.welcome")}
          </h1>
          {profile && (
            <div className="mt-4">
              <span className="text-4xl md:text-6xl font-black bg-gradient-to-r from-[#FFF32A] via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {profile.first_name}!
              </span>
            </div>
          )}
          <div className="absolute -top-6 -right-6 text-4xl animate-bounce">✨</div>
          <div className="absolute -bottom-4 -left-6 text-3xl animate-pulse">🚀</div>
        </div>
      </div>

      {/* Dashboard Info */}
      <DashboardInfo />

      {/* Main Content Grid - Profile Card и Quick Start Guide рядом */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Profile Card */}
        <div className="w-full">
          <ProfileCard profile={profile} loading={loading} error={profileError} />
        </div>

        {/* Quick Start Guide */}
        <div className="w-full">
          <StepGuide
            profile={profile}
            profileComplete={profileComplete}
            realProfile={realProfile}
            onEditProfile={handleEditProfile}
            onSignOut={handleSignOut}
            isSigningOut={isSigningOut}
          />
        </div>
      </div>

      {/* Community Search - размещаем ниже */}
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden bg-gradient-to-br from-white via-gray-50 to-cyan-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00AEC7]/5 via-transparent to-[#FFF32A]/5" />

          <CardHeader className="relative pb-4 bg-gradient-to-r from-[#00AEC7]/10 to-[#FFF32A]/10 border-b border-gray-200/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00AEC7] to-cyan-600 flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#00AEC7] to-cyan-600 bg-clip-text text-transparent">
                  {t("dashboard.communityMembers")}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">{t("dashboard.findCommunityMembers")}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative p-8 space-y-6">
            <div className="transform hover:scale-[1.01] transition-transform duration-200">
              <MemberSearch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
