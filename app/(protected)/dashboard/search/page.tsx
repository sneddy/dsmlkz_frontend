"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, ArrowLeft } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { ProfileDisplayCard } from "@/shared/ui/profile_display_card"

type CommunityMember = {
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

export default function MemberSearch() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    // Initial search with query parameter if present
    if (initialQuery) {
      performSearch(initialQuery)
    } else {
      fetchMembers()
    }
  }, [user, router, initialQuery])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, nickname, first_name, last_name, current_city, university, relevant_company, relevant_position, linkedin, about_you, avatar_url, other_links",
        )
        .not("id", "eq", user?.id || "")
        .order("first_name", { ascending: true })
        .limit(20)

      if (error) {
        throw error
      }

      setMembers(data as CommunityMember[])
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      fetchMembers()
      return
    }

    try {
      setSearching(true)

      // Use Supabase's ilike with wildcards at both ends for better partial matching
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, nickname, first_name, last_name, current_city, university, relevant_company, relevant_position, linkedin, about_you, avatar_url, other_links",
        )
        .not("id", "eq", user?.id || "")
        .or(`nickname.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .order("first_name", { ascending: true })

      if (error) {
        throw error
      }

      setMembers(data as CommunityMember[])
    } catch (error) {
      console.error("Error searching members:", error)
    } finally {
      setSearching(false)
      setLoading(false)
    }
  }

  const handleSearch = () => {
    performSearch(searchQuery)
    // Update URL with search query
    router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("back")}
        </Button>
        <h1 className="text-2xl font-bold">{t("dashboard.communityMembers")}</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("dashboard.findCommunityMembers")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("dashboard.searchPlaceholder")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button onClick={handleSearch} disabled={searching}>
              {searching ? t("dashboard.searching") : t("dashboard.search")}
            </Button>
          </div>

          {loading || searching ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-md">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("dashboard.noUsersFound")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <ProfileDisplayCard
                  key={member.id}
                  profile={member}
                  variant="search"
                  compact={true}
                  showViewButton={true}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
