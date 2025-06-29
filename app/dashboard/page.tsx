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

function isRealProfile(profile: any): boolean {
  if (!profile) return false
  const requiredFields = ["nickname", "first_name", "last_name"]
  return requiredFields.some((field) => profile[field] && profile[field].trim() !== "")
}

function isProfileComplete(profile: any): boolean {
  if (!profile) return false
  const requiredFields = ["nickname", "first_name", "last_name", "current_city", "about_you", "motivation"]

  for (const field of requiredFields) {
    if (!profile[field] || profile[field].trim() === "") {
      return false
    }
  }

  // Updated to check for 15 words instead of 10
  const aboutYouWords = profile.about_you.trim().split(/\s+/).filter(Boolean).length
  const motivationWords = profile.motivation.trim().split(/\s+/).filter(Boolean).length

  if (aboutYouWords < 15 || motivationWords < 15) {
    return false
  }

  return true
}

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

  // Gradient border style like in profile card
  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFD700, #00b2b2) 1",
  }

  const getStepStatus = (stepId: number) => {
    switch (stepId) {
      case 1:
        return profileComplete ? "completed" : realProfile ? "in-progress" : "not-started"
      case 2:
        return profileComplete ? "in-progress" : "not-started"
      case 3:
        return "not-started"
      default:
        return "not-started"
    }
  }

  const steps = [
    {
      id: 1,
      title: t("dashboard.completeProfileStep"),
      description: t("dashboard.completeProfileStepDesc"),
      status: getStepStatus(1),
      icon: FileText,
    },
    {
      id: 2,
      title: t("dashboard.connectTelegramStep"),
      description: t("dashboard.connectTelegramStepDesc"),
      status: getStepStatus(2),
      icon: MessageCircle,
    },
    {
      id: 3,
      title: t("dashboard.followInviteLinkStep"),
      description: t("dashboard.followInviteLinkStepDesc"),
      status: getStepStatus(3),
      icon: Heart,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: "#00AEC7" }}>
          {t("dashboard.welcome")}
          {profile?.first_name ? `, ${profile.first_name}` : ""}!
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-4xl mx-auto leading-relaxed">
          {t("dashboard.description")}
        </p>
      </div>

      {/* Join Telegram Chat Widget */}
      <Card className="shadow-lg border-0 bg-white overflow-hidden" style={gradientBorderStyle}>
        <div className="relative rounded-xl min-h-[400px]">
          {/* Фоновое изображение - исправлен URL для горизонтального фона */}
          <div
            className="absolute inset-0 block sm:hidden"
            style={{
              backgroundImage: `url('https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/general/card_background.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              backgroundImage: `url('https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/general/background_horizontal.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Полупрозрачный белый overlay для читаемости - уменьшена прозрачность */}
          <div className="absolute inset-0 bg-white bg-opacity-20" />

          <div className="relative z-10 h-full">
            <CardHeader style={{ backgroundColor: "#00AEC7" }} className="text-white relative z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">{t("dashboard.joinTelegramChat")}</CardTitle>
                  <CardDescription className="text-white text-opacity-90">
                    {t("dashboard.followStepsToJoin")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6 relative z-20">
              {steps.map((step) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        step.status === "completed"
                          ? "bg-green-500 border-green-400"
                          : step.status === "in-progress"
                            ? "border-yellow-400"
                            : "bg-gray-200 border-gray-300"
                      }`}
                      style={step.status === "in-progress" ? { backgroundColor: "#FFF32A" } : undefined}
                    >
                      {step.status === "completed" ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : step.status === "in-progress" ? (
                        <Clock className="h-5 w-5 text-black" />
                      ) : (
                        <step.icon className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3
                        className="font-semibold"
                        style={{
                          color: step.status === "completed" ? "#16a34a" : "#00AEC7",
                        }}
                      >
                        {t("dashboard.step")} {step.id}: {step.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          step.status === "completed"
                            ? "bg-green-100 text-green-700 border-green-300"
                            : step.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                              : "bg-gray-100 text-gray-600 border-gray-300"
                        }`}
                      >
                        {step.status === "completed"
                          ? t("dashboard.completed")
                          : step.status === "in-progress"
                            ? t("dashboard.inProgress")
                            : t("dashboard.notStarted")}
                      </Badge>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{step.description}</p>

                    {step.id === 1 && (
                      <div className="space-y-2">
                        {!realProfile ? (
                          <Link href="/profile?mode=create">
                            <Button
                              size="sm"
                              className="text-black hover:opacity-90 border-0"
                              style={{ backgroundColor: "#FFF32A", ...gradientBorderStyle }}
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              {t("dashboard.createProfile")}
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={onEditProfile}
                            className="bg-white bg-opacity-90 border-0 hover:text-white"
                            style={{
                              color: "#00AEC7",
                              ...gradientBorderStyle,
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#00AEC7"
                              e.currentTarget.style.color = "white"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)"
                              e.currentTarget.style.color = "#00AEC7"
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t("dashboard.editProfile")}
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
                            className={`border-0 ${
                              profileComplete
                                ? "text-black hover:opacity-90"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            style={profileComplete ? { backgroundColor: "#FFF32A", ...gradientBorderStyle } : undefined}
                          >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.296c-.146.658-.537.818-1.084.51l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.054 5.56-5.022c.242-.213-.054-.334-.373-.121L8.48 13.278l-2.95-.924c-.642-.204-.654-.642.135-.953l11.447-4.415c.538-.196 1.006.13.45 1.262z" />
                            </svg>
                            {t("dashboard.attachTelegram")}
                          </Button>
                        </Link>
                        {!profileComplete && (
                          <p className="text-xs text-amber-600">{t("dashboard.completeProfileFirst")}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </div>
        </div>
      </Card>

      {/* Profile Widget */}
      {realProfile && (
        <Card className="shadow-lg border-0 bg-white overflow-hidden" style={gradientBorderStyle}>
          <div className="relative rounded-xl min-h-[120px]">
            {/* Фоновое изображение - исправлен URL для горизонтального фона */}
            <div
              className="absolute inset-0 block sm:hidden"
              style={{
                backgroundImage: `url('https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/general/card_background.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div
              className="absolute inset-0 hidden sm:block"
              style={{
                backgroundImage: `url('https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/general/background_horizontal.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />

            {/* Полупрозрачный белый overlay для читаемости - уменьшена прозрачность */}
            <div className="absolute inset-0 bg-white bg-opacity-20" />

            <div className="relative z-10 h-full">
              <CardContent className="p-6 relative z-20">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{
                        background: "linear-gradient(to bottom right, #00AEC7, #0891b2)",
                      }}
                    >
                      {profile?.first_name?.[0]?.toUpperCase() || "U"}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {profile?.first_name} {profile?.last_name}
                    </h3>
                    <p className="text-gray-600 text-sm">@{profile?.nickname}</p>
                  </div>

                  <div className="flex-shrink-0">
                    {profileComplete ? (
                      <Link href={`/users/${profile.nickname}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-700 hover:bg-gray-50 border-0 bg-transparent"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            ...gradientBorderStyle,
                          }}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {t("dashboard.view")}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onEditProfile}
                        className="bg-white bg-opacity-90 border-0 hover:text-white"
                        style={{
                          color: "#00AEC7",
                          ...gradientBorderStyle,
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#00AEC7"
                          e.currentTarget.style.color = "white"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)"
                          e.currentTarget.style.color = "#00AEC7"
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t("dashboard.complete")}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      )}

      {/* Sign Out Button */}
      {realProfile && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onSignOut}
            disabled={isSigningOut}
            className="bg-red-50 text-red-600 hover:bg-red-100 border-0"
            style={gradientBorderStyle}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isSigningOut ? t("dashboard.signingOut") : t("dashboard.signOut")}
          </Button>
        </div>
      )}
    </div>
  )
}

function ProfileTab({
  profile,
  loading,
  error,
  onEditProfile,
}: {
  profile: any
  loading: boolean
  error: any
  onEditProfile: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#00AEC7" }}>
          {t("dashboard.yourProfile")}
        </h2>
        <p className="text-gray-400">{t("dashboard.manageProfileSettings")}</p>
      </div>
      <ProfileCard profile={profile} loading={loading} error={error} onEditProfile={onEditProfile} />
    </div>
  )
}

function SearchTab() {
  const { t } = useTranslation()

  // Gradient border style like in profile card
  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFD700, #00b2b2) 1",
  }

  return (
    <div className="space-y-6">
      {/* Search Widget */}
      <Card className="shadow-lg border-0 bg-white overflow-hidden" style={gradientBorderStyle}>
        <div className="relative rounded-xl min-h-[500px]">
          {/* Фоновое изображение - исправлен URL для горизонтального фона */}
          <div
            className="absolute inset-0 block sm:hidden"
            style={{
              backgroundImage: `url('https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/general/card_background.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              backgroundImage: `url('https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/general/background_horizontal.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Полупрозрачный белый overlay для читаемости - уменьшена прозрачность */}
          <div className="absolute inset-0 bg-white bg-opacity-20" />

          <div className="relative z-10 h-full">
            {/* Заголовок внутри карточки */}
            <CardHeader className="text-center relative z-20">
              <CardTitle className="text-2xl font-bold" style={{ color: "#00AEC7" }}>
                {t("dashboard.communityMembers")}
              </CardTitle>
              <CardDescription className="text-gray-600">{t("dashboard.findCommunityMembers")}</CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-0 relative z-20">
              {/* Оставляем место для dropdown - добавляем padding-bottom */}
              <div className="pb-80">
                <MemberSearch />
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Dashboard() {
  const { user, profile, loading, profileError, signOut, initialized } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const [isClient, setIsClient] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const profileComplete = isProfileComplete(profile)
  const realProfile = isRealProfile(profile)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleEditProfile = () => {
    router.push("/profile")
  }

  const handleSignOut = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)

    toast({
      title: t("dashboard.signingOut"),
      description: t("dashboard.signingOutMessage"),
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
        description: t("dashboard.signOutErrorMessage"),
        variant: "destructive",
      })

      setTimeout(() => {
        window.location.replace("/")
      }, 1000)
    }
  }

  if (!initialized) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="relative">
            <div
              className="w-16 h-16 border-4 rounded-full animate-spin"
              style={{
                borderColor: "rgba(0, 174, 199, 0.2)",
                borderTopColor: "#00AEC7",
              }}
            />
            <div
              className="absolute inset-0 w-16 h-16 border-4 rounded-full animate-spin animate-reverse"
              style={{
                borderColor: "rgba(255, 243, 42, 0.2)",
                borderBottomColor: "#FFF32A",
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/signin")
    return null
  }

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
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-900 bg-opacity-50 border border-gray-700">
            <TabsTrigger
              value="overview"
              className="text-gray-400"
              style={{
                backgroundColor: activeTab === "overview" ? "#00AEC7" : "transparent",
                color: activeTab === "overview" ? "white" : "#9ca3af",
              }}
            >
              <Home className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("dashboard.overview")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-gray-400"
              style={{
                backgroundColor: activeTab === "profile" ? "#00AEC7" : "transparent",
                color: activeTab === "profile" ? "white" : "#9ca3af",
              }}
            >
              <User className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("dashboard.profile")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className="text-gray-400"
              style={{
                backgroundColor: activeTab === "search" ? "#00AEC7" : "transparent",
                color: activeTab === "search" ? "white" : "#9ca3af",
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("dashboard.search")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

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
          <ProfileTab profile={profile} loading={loading} error={profileError} onEditProfile={handleEditProfile} />
        </TabsContent>

        <TabsContent value="search" className="mt-0">
          <SearchTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
