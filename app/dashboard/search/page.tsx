"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BlobImage } from "@/components/ui/blob-image"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import { getSupabaseClient } from "@/lib/supabase-client"

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
      router.push("/signin")
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
          "id, nickname, first_name, last_name, current_city, university, relevant_company, relevant_position, linkedin",
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
          "id, nickname, first_name, last_name, current_city, university, relevant_company, relevant_position, linkedin",
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
                <div key={member.id} className="flex items-center gap-4 p-4 border rounded-md">
                  <BlobImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.first_name} ${member.last_name}`}
                    alt={`${member.first_name} ${member.last_name}`}
                    width={48}
                    height={48}
                    className="rounded-full h-12 w-12"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {member.first_name} {member.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">@{member.nickname}</p>
                    {member.relevant_position && (
                      <p className="text-sm">
                        {member.relevant_position} {member.relevant_company ? `@ ${member.relevant_company}` : ""}
                      </p>
                    )}
                  </div>
                  <Link href={`/users/${member.nickname}`}>
                    <Button variant="outline" size="sm">
                      {t("view")}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
