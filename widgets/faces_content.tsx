"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { HeroSection } from "@/components/hero-section"
import { ProfileDisplayCard } from "@/shared/ui/profile_display_card"
import { BlobImage } from "@/shared/ui/blob_image"

type VerifiedProfile = {
  id: string
  nickname: string
  first_name: string
  last_name: string
  current_city?: string
  university?: string
  relevant_company?: string
  relevant_position?: string
  linkedin?: string
  about_you?: string
  avatar_url?: string
  other_links?: string
}

export function FacesContent() {
  const [profiles, setProfiles] = useState<VerifiedProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()
  const supabase = getSupabaseClient()

  const fetchRandomProfiles = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch profiles from the public API endpoint
      const response = await fetch('/api/faces')
      if (!response.ok) {
        throw new Error('Failed to fetch faces data')
      }

      const { profiles: allProfiles } = await response.json()

      // Randomly select 6 profiles
      const shuffled = allProfiles.sort(() => 0.5 - Math.random())
      const data = shuffled.slice(0, 6)

      console.log("Fetched verified profiles with avatars:", data)
      console.log("Avatar URLs check:", data?.map(p => ({ 
        nickname: p.nickname, 
        avatar_url: p.avatar_url,
        avatar_type: p.avatar_url ? (p.avatar_url.startsWith('http') ? 'full_url' : 'relative_path') : 'none'
      })))
      setProfiles(data || [])
    } catch (err: any) {
      console.error("Error fetching verified profiles:", err)
      setError(err.message || "Failed to load verified profiles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRandomProfiles()
  }, [])

  const handleRefresh = () => {
    fetchRandomProfiles()
  }

  return (
    <div className="min-h-screen">
      <HeroSection
        title={t("faces.title")}
        subtitle={t("faces.description")}
        primaryButton={{
          text: "Explore Community",
          href: "/dashboard",
        }}
        secondaryButton={{
          text: "Join Us",
          href: "/auth/signup",
        }}
      />

      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            {t("faces.verifiedMembers")}
          </h2>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7]/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("faces.refresh")}
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-gray-800/30 backdrop-blur-sm border border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={handleRefresh} className="bg-[#00AEC7] hover:bg-[#00AEC7]/90">
              Try Again
            </Button>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              {t("faces.noVerifiedProfiles")}
            </p>
            <Button onClick={handleRefresh} className="bg-[#00AEC7] hover:bg-[#00AEC7]/90">
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <ProfileDisplayCard 
                key={profile.id} 
                profile={profile}
                variant="dashboard"
                compact={false}
                showViewButton={true}
                fixedLayout={true}
              />
            ))}
          </div>
        )}

        {profiles.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">
              {t("faces.showingRandom")}
            </p>
            <Button 
              onClick={handleRefresh} 
              className="bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("faces.showDifferent")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
