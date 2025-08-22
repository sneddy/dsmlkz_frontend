"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useProfile } from "@/features/profile/client/useProfile"
import { useTranslation } from "@/hooks/use-translation"
import { toast } from "@/hooks/use-toast"
import { AuthGuard } from "@/features/auth/auth_guard"
import { ErrorBoundaryWrapper } from "@/shared/ui/error_boundary_wrapper"
import { ProfileForm } from "@/features/profile/profile_form"

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ErrorBoundaryWrapper>
        <ProfileContainer />
      </ErrorBoundaryWrapper>
    </AuthGuard>
  )
}

function ProfileContainer() {
  const { user, loading } = useAuth()
  const { profile, loadingProfile, profileError } = useProfile()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const [isOffline, setIsOffline] = useState(false)

  const mode = searchParams.get("mode")
  const isCreateMode = mode === "create"

  console.log("[v0] Profile loading state:", {
    loading,
    loadingProfile,
    profileLoaded: !loadingProfile && !profileError,
    profile: !!profile,
    isCreateMode,
    profileError: !!profileError,
  })

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    setIsOffline(!navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (isCreateMode && profile && !loading && !loadingProfile) {
      toast({
        title: t("profile.profileExists"),
        description: t("profile.redirectingToEdit"),
      })
      router.push("/profile")
    }
  }, [isCreateMode, profile, loading, loadingProfile, router, t])

  useEffect(() => {
    if (!isCreateMode && !profile && !loading && !loadingProfile && !profileError) {
      toast({
        title: t("profile.noProfileFound"),
        description: t("profile.redirectingToCreate"),
      })
      router.push("/profile?mode=create")
    }
  }, [isCreateMode, profile, loading, loadingProfile, profileError, router, t])

  if (loading || loadingProfile) {
    return (
      <div className="container py-8">
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">{loading ? "Loading your profile..." : "Preparing profile data..."}</p>
          {loadingProfile && (
            <p className="text-xs text-muted-foreground mt-2">If this takes too long, try refreshing the page</p>
          )}
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (profileError && !isCreateMode) {
    return (
      <div className="container py-8">
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive mb-4">Failed to load profile</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const emptyProfile = {
    id: user.id,
    nickname: "",
    first_name: "",
    last_name: "",
    current_city: "",
    university: "",
    relevant_company: "",
    relevant_position: "",
    about_you: "",
    motivation: "",
    linkedin: "",
    other_links: "",
    avatar_url: "",
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("back")}
      </Button>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{isCreateMode ? t("profile.createProfile") : t("profile.editProfile")}</CardTitle>
            <CardDescription>
              {isCreateMode ? t("profile.createProfileDescription") : t("profile.editProfileDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isOffline && (
              <div className="p-3 mb-4 text-sm text-white bg-yellow-500 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t("profile.offline")}
              </div>
            )}

            <ProfileForm
              initialProfile={isCreateMode ? emptyProfile : profile}
              isCreateMode={isCreateMode}
              isOffline={isOffline}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
