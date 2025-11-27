"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { KeyboardEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/hooks/use-translation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { ProfileCard } from "@/widgets/profile_card"
import { CommunityFaceCard } from "@/widgets/community_face_card"
import type { Profile } from "@/features/auth/types"
import { useMobile } from "@/shared/lib/hooks/use-mobile"
import { SectionHero } from "@/widgets/section_hero"

type CommunityFace = {
  id: number
  name: string
  title: string | null
  title_ru: string | null
  description: string | null
  description_ru: string | null
  location: string | null
  image_path: string | null
  linkedin: string | null
  website: string | null
  telegram: string | null
  kaggle: string | null
}

export function FacesContent() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [highlights, setHighlights] = useState<CommunityFace[]>([])
  const [visibleProfiles, setVisibleProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchText, setSearchText] = useState("")
  const [appliedQuery, setAppliedQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"highlighted" | "random">("highlighted")
  const [highlightPage, setHighlightPage] = useState(0)
  const { t } = useTranslation()
  const supabase = getSupabaseClient()
  const isMobile = useMobile()

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true)

        const [{ data: profilesData, error: profilesError }, { data: highlightsData, error: highlightsError }] =
          await Promise.all([
            supabase
              .from("public_profiles" as any)
              .select("*, verified_profiles!inner(id)")
              .not("nickname", "is", null)
              .not("first_name", "is", null)
              .not("last_name", "is", null)
              .not("avatar_url", "is", null),
            supabase
              .from("community_faces" as any)
              .select("*")
              .order("display_order", { ascending: true })
              .order("name", { ascending: true }),
          ])

        if (profilesError) {
          throw profilesError
        }

        if (highlightsError) {
          console.error("Error fetching highlighted faces:", highlightsError)
        }

        setProfiles((profilesData as Profile[]) || [])
        setHighlights((highlightsData as CommunityFace[]) || [])
      } catch (err: any) {
        console.error("Error fetching community faces:", err, err?.message, err?.details)
        setError(err?.message || err?.details || "Failed to load community faces")
      } finally {
        setLoading(false)
      }
    }

    fetchCommunityData()
  }, [supabase])

  const pickRandomProfiles = useCallback(
    (source: Profile[]) => {
      const count = isMobile ? 1 : 3
      const shuffled = [...source]

      // Fisher-Yates shuffle for an unbiased order
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      return shuffled.slice(0, Math.min(count, shuffled.length))
    },
    [isMobile],
  )

  const filteredProfiles = useMemo(() => {
    const q = appliedQuery.trim().toLowerCase()
    if (!q) return profiles

    return profiles.filter((profile) => {
      const haystacks = [
        profile.first_name,
        profile.last_name,
        profile.nickname,
        profile.relevant_position,
        profile.relevant_company,
        profile.current_city,
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase())

      return haystacks.some((value) => value.includes(q))
    })
  }, [appliedQuery, profiles])

  useEffect(() => {
    if (profiles.length === 0) {
      setVisibleProfiles([])
      return
    }

    if (appliedQuery.trim()) {
      setVisibleProfiles(filteredProfiles)
      return
    }

    setVisibleProfiles(pickRandomProfiles(profiles))
  }, [profiles, pickRandomProfiles, appliedQuery, filteredProfiles])

  const handleRefresh = () => {
    if (profiles.length === 0 || appliedQuery.trim()) return
    setVisibleProfiles(pickRandomProfiles(profiles))
  }

  const handleSearch = () => {
    setAppliedQuery(searchText.trim())
    setActiveTab("random")
  }

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const displayCount = isMobile ? 1 : 3
  const isSearching = appliedQuery.trim().length > 0
  const nowShowingCount = isSearching ? filteredProfiles.length : Math.min(displayCount, profiles.length) || displayCount
  const highlightsPerPage = isMobile ? 3 : 6
  const totalHighlightPages = Math.max(1, Math.ceil(highlights.length / highlightsPerPage))
  const currentHighlightPage = Math.min(highlightPage, totalHighlightPages - 1)
  const highlightedVisible = (highlights || []).slice(
    currentHighlightPage * highlightsPerPage,
    currentHighlightPage * highlightsPerPage + highlightsPerPage,
  )

  useEffect(() => {
    setHighlightPage(0)
  }, [isMobile])

  const goPrevHighlights = () => {
    setHighlightPage((prev) => Math.max(0, prev - 1))
  }

  const goNextHighlights = () => {
    setHighlightPage((prev) => Math.min(totalHighlightPages - 1, prev + 1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <SectionHero
        title={t("faces.title")}
        subtitleLine1={t("faces.description")}
        gradientFrom="#00AEC7"
        gradientTo="#FFF32A"
      />

      <div className="container py-8 space-y-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "highlighted" | "random")} className="w-full">
          <TabsList className="grid w-full max-w-xl grid-cols-2 bg-white/10 border border-white/20 text-white">
            <TabsTrigger value="highlighted" className="data-[state=active]:bg-white data-[state=active]:text-black">
              {t("faces.highlightedTabLabel")}
            </TabsTrigger>
            <TabsTrigger value="random" className="data-[state=active]:bg-white data-[state=active]:text-black">
              {t("faces.randomTabLabel")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="highlighted" className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-xl font-semibold text-white">{t("faces.highlightedTitle")}</h2>
              <div className="flex flex-col sm:items-end gap-1">
                <p className="text-white/70 text-sm">
                  {t("faces.highlightedDescription")}{" "}
                  {highlights.length > highlightedVisible.length &&
                    t("faces.highlightedShowing", { count: highlightedVisible.length })}
                </p>
                {highlights.length > 0 && (
                  <div className="flex items-center gap-2 sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                      onClick={goPrevHighlights}
                      disabled={currentHighlightPage === 0 || loading}
                    >
                      {t("faces.prev")}
                    </Button>
                    <span className="text-white/70 text-sm">
                      {t("faces.pageOf", { page: currentHighlightPage + 1, total: totalHighlightPages })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                      onClick={goNextHighlights}
                      disabled={currentHighlightPage >= totalHighlightPages - 1 || loading}
                    >
                      {t("faces.next")}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6 space-y-4">
                      <Skeleton className="h-40 w-full rounded-md" />
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : highlights.length === 0 ? (
              <p className="text-white/70 text-sm">{t("faces.noHighlighted")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {highlightedVisible.map((face) => (
                  <CommunityFaceCard key={face.id} face={face} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="random" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">{t("faces.randomTitle")}</h2>
                <p className="text-white/70 text-sm">
                  {isSearching
                    ? t("faces.searchingNowShowing", { count: nowShowingCount })
                    : t("faces.nowShowing", { count: nowShowingCount })}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={t("faces.searchPlaceholder")}
                    className="pl-10 bg-white/90 border-white/40 text-black placeholder:text-muted-foreground"
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading} className="bg-[#00AEC7] text-white hover:bg-[#0095a8]">
                  {t("dashboard.search")}
                </Button>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                  disabled={loading || profiles.length === 0 || isSearching}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("faces.refresh")}
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Array.from({ length: displayCount }).map((_, i) => (
                  <Card key={i} className="overflow-hidden relative">
                    <CardContent className="p-6 space-y-4">
                      <Skeleton className="h-48 w-full rounded-md" />
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : visibleProfiles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {isSearching ? t("dashboard.noUsersFound") : t("faces.noResults")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {visibleProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} isPublic />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
