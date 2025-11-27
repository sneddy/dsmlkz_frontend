"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useProfile } from "@/features/profile/client/useProfile"
import { useTranslation } from "@/hooks/use-translation"
import { toast } from "@/shared/lib/hooks/use-toast"
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
  const { profile, loadingProfile, profileError, refreshProfile } = useProfile()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const hasStartedProfileLoad = useRef(false)
  const [isOffline, setIsOffline] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [profileLoaded, setProfileLoaded] = useState(false)

  // Check if we're in create mode
  const mode = searchParams.get("mode")
  const isCreateMode = mode === "create"

  // Add useEffect to detect network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      // Try to refresh data when coming back online
      refreshProfile().catch((error) => {
        console.error("[profile] Failed to refresh after reconnecting", error)
        setLoadError("Failed to load profile. Please try again.")
      })
    }
    const handleOffline = () => setIsOffline(true)

    // Check initial status
    setIsOffline(!navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [refreshProfile])

  useEffect(() => {
    hasStartedProfileLoad.current = false
    setProfileLoaded(false)
  }, [user?.id])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin")
    }
  }, [user, loading, router])

  // Track when the profile load cycle finishes so we can drive redirects
  useEffect(() => {
    if (loadingProfile) {
      hasStartedProfileLoad.current = true
      return
    }

    if (!profileLoaded && hasStartedProfileLoad.current) {
      setProfileLoaded(true)
    }
  }, [loadingProfile, profileLoaded])

  useEffect(() => {
    if (profileError) {
      console.error("[profile] Failed to load profile", profileError)
      setLoadError(profileError.message || "Failed to load profile. Please try again.")
    } else if (!loadingProfile) {
      setLoadError(null)
    }
  }, [profileError, loadingProfile])

  // If we're in create mode but profile exists, redirect to edit mode
  useEffect(() => {
    if (isCreateMode && profile && !loading && profileLoaded) {
      toast({
        title: t("profile.profileExists"),
        description: t("profile.redirectingToEdit"),
      })
      router.push("/profile")
    }
  }, [isCreateMode, profile, loading, profileLoaded, router, t])

  // If we're in edit mode but profile doesn't exist, redirect to create mode
  useEffect(() => {
    if (!isCreateMode && !profile && !loading && profileLoaded && !loadError) {
      toast({
        title: t("profile.noProfileFound"),
        description: t("profile.redirectingToCreate"),
      })
      router.push("/profile?mode=create")
    }
  }, [isCreateMode, profile, loading, profileLoaded, loadError, router, t])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!isCreateMode && !profile && (loadingProfile || !profileLoaded)) {
    return (
      <div className="container py-8">
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Show error state if we couldn't load the profile
  if (loadError && !profile && !isCreateMode) {
    return (
      <div className="container py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              {t("profile.loadError")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{loadError}</p>
            <div className="flex gap-4">
              <Button onClick={() => window.location.reload()}>Refresh Page</Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Create an empty profile template for create mode
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
            {/* Network status indicator */}
            {isOffline && (
              <div className="p-3 mb-4 text-sm text-white bg-yellow-500 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t("profile.offline")}
              </div>
            )}

            {/* Profile form component */}
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
