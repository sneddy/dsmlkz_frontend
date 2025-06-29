"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProfileCard } from "@/components/profile-card"
import { MemberSearch } from "@/components/member-search"
import { useTranslation } from "@/hooks/use-translation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Edit,
  ExternalLink,
  UserPlus,
  LogOut,
  MessageCircle,
  FileText,
  Heart,
  Clock,
  User,
  Search,
  Home,
  Check,
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

// Компонент Overview Tab
function OverviewTab({
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

  const getStepStatus = (stepId: number) => {
    switch (stepId) {
      case 1:
        return profileComplete ? "completed" : realProfile ? "in-progress" : "not-started"
      case 2:
        return profileComplete ? "in-progress" : "not-started"
      case 3:
        return "not-started" // This would be determined by actual Telegram verification
      default:
        return "not-started"
    }
  }

  const steps = [
    {
      id: 1,
      title: "Complete Profile",
      description: "Fill out your profile information",
      status: getStepStatus(1),
      icon: FileText,
    },
    {
      id: 2,
      title: "Connect Telegram",
      description: "Link your Telegram account",
      status: getStepStatus(2),
      icon: MessageCircle,
    },
    {
      id: 3,
      title: "Follow the invite link and enjoy",
      description: "Join our community chat",
      status: getStepStatus(3),
      icon: Heart,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#00AEC7]">
          Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}!
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-4xl mx-auto leading-relaxed">
          Your central hub for connecting with the DSML Kazakhstan Community. Here you can fill out your profile card,
          join our private Telegram chat, find other community residents, and get early access to new features.
        </p>
      </div>

      {/* Join Telegram Chat Widget - с фоновым изображением как в карточках */}
      <Card
        className="bg-gray-900/50 border border-gray-700 shadow-2xl backdrop-blur-sm relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/card_background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay для лучшей читаемости текста */}
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" />

        <CardHeader className="bg-[#00AEC7] text-white relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Join Telegram Chat</CardTitle>
              <CardDescription className="text-white/80">
                Follow these steps to join our private community
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6 relative z-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              {/* Step indicator */}
              <div className="flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    step.status === "completed"
                      ? "bg-green-500 border-green-400"
                      : step.status === "in-progress"
                        ? "bg-[#FFF32A] border-[#FFF32A]"
                        : "bg-gray-800 border-gray-600"
                  }`}
                >
                  {step.status === "completed" ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : step.status === "in-progress" ? (
                    <Clock className="h-5 w-5 text-black" />
                  ) : (
                    <step.icon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3
                    className={`font-semibold ${
                      step.status === "completed"
                        ? "text-green-400"
                        : step.status === "in-progress"
                          ? "text-[#00AEC7]"
                          : "text-gray-300"
                    }`}
                  >
                    Step {step.id}: {step.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      step.status === "completed"
                        ? "bg-green-900/50 text-green-400 border-green-700"
                        : step.status === "in-progress"
                          ? "bg-yellow-900/50 text-yellow-400 border-yellow-700"
                          : "bg-gray-800/50 text-gray-400 border-gray-600"
                    }`}
                  >
                    {step.status === "completed"
                      ? "Completed"
                      : step.status === "in-progress"
                        ? "In Progress"
                        : "Not Started"}
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm mb-3">{step.description}</p>

                {/* Step actions */}
                {step.id === 1 && (
                  <div className="space-y-2">
                    {!realProfile ? (
                      <Link href="/profile?mode=create">
                        <Button size="sm" className="bg-[#FFF32A] text-black hover:bg-[#FFF32A]/90">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Create Profile
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onEditProfile}
                        className="bg-gray-800/80 border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7] hover:text-white backdrop-blur-sm"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                )}

                {step.id === 2 && (
                  <div className="space-y-2">
                    <Link
                      href={
                        profileComplete
                          ? `https://t.me/databek_bot?start=verify_${profile.nickname}_${profile.secret_number || 0}`
                          : "#"
                      }
                      target={profileComplete ? "_blank" : undefined}
                      rel={profileComplete ? "noopener noreferrer" : undefined}
                      className={!profileComplete ? "pointer-events-none" : ""}
                    >
                      <Button
                        size="sm"
                        disabled={!profileComplete}
                        className={
                          profileComplete
                            ? "bg-[#FFF32A] text-black hover:bg-[#FFF32A]/90"
                            : "bg-gray-700/80 text-gray-500 cursor-not-allowed backdrop-blur-sm"
                        }
                      >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.296c-.146.658-.537.818-1.084.51l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.054 5.56-5.022c.242-.213-.054-.334-.373-.121L8.48 13.278l-2.95-.924c-.642-.204-.654-.642.135-.953l11.447-4.415c.538-.196 1.006.13.45 1.262z" />
                        </svg>
                        Connect Telegram
                      </Button>
                    </Link>
                    {!profileComplete && <p className="text-xs text-amber-400">Complete your profile first</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Profile Widget - также с фоновым изображением */}
      {realProfile && (
        <Card
          className="bg-gray-900/50 border border-gray-700 shadow-xl backdrop-blur-sm relative overflow-hidden"
          style={{
            backgroundImage: "url('/images/card_background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay для лучшей читаемости текста */}
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" />

          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00AEC7] to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
                  {profile?.first_name?.[0]?.toUpperCase() || "U"}
                </div>
              </div>

              {/* Name and username */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {profile?.first_name} {profile?.last_name}
                </h3>
                <p className="text-gray-300 text-sm">@{profile?.nickname}</p>
              </div>

              {/* View button */}
              <div className="flex-shrink-0">
                {profileComplete ? (
                  <Link href={`/users/${profile.nickname}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gray-800/80 border-gray-600 text-gray-300 backdrop-blur-sm hover:bg-gray-700/80"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onEditProfile}
                    className="bg-gray-800/80 border-[#00AEC7] text-[#00AEC7] backdrop-blur-sm hover:bg-[#00AEC7] hover:text-white"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sign Out Button */}
      {realProfile && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onSignOut}
            disabled={isSigningOut}
            className="bg-red-900/30 text-red-400 border-red-700/50 hover:bg-red-900/50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </Button>
        </div>
      )}
    </div>
  )
}

// Компонент Profile Tab
function ProfileTab({ profile, loading, error }: { profile: any; loading: boolean; error: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#00AEC7] mb-2">Your Profile</h2>
        <p className="text-gray-400">Manage your profile information and settings</p>
      </div>
      <ProfileCard profile={profile} loading={loading} error={error} />
    </div>
  )
}

// Компонент Search Tab
function SearchTab() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#00AEC7] mb-2">{t("dashboard.communityMembers")}</h2>
        <p className="text-gray-400">{t("dashboard.findCommunityMembers")}</p>
      </div>
      <Card className="bg-gray-900/50 border border-gray-700 shadow-xl backdrop-blur-sm">
        <CardContent className="p-6">
          <MemberSearch />
        </CardContent>
      </Card>
    </div>
  )
}

// Главный компонент Dashboard
function Dashboard() {
  const { user, profile, loading, profileError, signOut, initialized } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const [isClient, setIsClient] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

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
      <div className="container py-6 sm:py-12 space-y-6 sm:space-y-8">
        <div className="text-center space-y-4">
          <div className="h-12 sm:h-16 w-80 sm:w-96 bg-gray-800 rounded-2xl animate-pulse mx-auto" />
        </div>
        <div className="h-32 sm:h-48 bg-gray-800 rounded-2xl animate-pulse" />
        <div className="h-80 sm:h-96 bg-gray-800 rounded-2xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="container py-6 sm:py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-900/50 border border-gray-700">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[#00AEC7] data-[state=active]:text-white text-gray-400"
            >
              <Home className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-[#00AEC7] data-[state=active]:text-white text-gray-400"
            >
              <User className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className="data-[state=active]:bg-[#00AEC7] data-[state=active]:text-white text-gray-400"
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <TabsContent value="overview" className="mt-0">
          <OverviewTab
            profile={profile}
            profileComplete={profileComplete}
            realProfile={realProfile}
            onEditProfile={handleEditProfile}
            onSignOut={handleSignOut}
            isSigningOut={isSigningOut}
          />
        </TabsContent>

        <TabsContent value="profile" className="mt-0">
          <ProfileTab profile={profile} loading={loading} error={profileError} />
        </TabsContent>

        <TabsContent value="search" className="mt-0">
          <SearchTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
