"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { BlobImage } from "@/components/ui/blob-image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Linkedin, Globe, AlertTriangle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { getSupabaseClient } from "@/lib/supabase-client"
import Link from "next/link"

const isGeneratedAvatar = (url: string | null | undefined): boolean => {
  if (!url) return true
  return url.includes("dicebear.com") || url.includes("api.dicebear")
}

export default function UserProfile() {
  const params = useParams()
  const router = useRouter()
  const { t } = useTranslation()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [rawQueries, setRawQueries] = useState<string[]>([])
  const supabase = getSupabaseClient()

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFD700, #00b2b2) 1",
  }

  const addDebugInfo = (info: string) => {
    console.log(`[Profile Debug] ${info}`)
    setDebugInfo((prev) => [...prev, info])
  }

  const addRawQuery = (query: string) => {
    console.log(`[Raw SQL] ${query}`)
    setRawQueries((prev) => [...prev, query])
  }

  useEffect(() => {
    const fetchProfile = async () => {
      // Guard clause for undefined params
      if (!params || !params.nickname) {
        setLoading(false)
        setError("No nickname provided")
        addDebugInfo("No nickname parameter found in URL")
        return
      }

      // Get the raw nickname from URL
      const rawNickname = Array.isArray(params.nickname) ? params.nickname[0] : (params.nickname as string)

      addDebugInfo(`Raw nickname from URL: "${rawNickname}"`)

      try {
        setLoading(true)

        // DIRECT APPROACH: Try to get all profiles and find the match
        addDebugInfo("APPROACH 1: Fetching all public profiles to find match")
        const rawQuery1 = `SELECT * FROM public_profiles WHERE nickname ILIKE '%${rawNickname}%'`
        addRawQuery(rawQuery1)

        const { data: allProfiles, error: allProfilesError } = await supabase.from("public_profiles").select("*")

        if (allProfilesError) {
          addDebugInfo(`Error fetching all profiles: ${allProfilesError.message}`)
        } else {
          addDebugInfo(`Found ${allProfiles?.length || 0} total profiles in public_profiles`)

          // Log all nicknames for debugging
          if (allProfiles && allProfiles.length > 0) {
            addDebugInfo("All nicknames in public_profiles:")
            allProfiles.forEach((p, i) => {
              addDebugInfo(`${i + 1}. "${p.nickname}" (${typeof p.nickname})`)
            })

            // Try to find the profile with case-insensitive comparison
            const matchingProfile = allProfiles.find(
              (p) =>
                p.nickname && typeof p.nickname === "string" && p.nickname.toLowerCase() === rawNickname.toLowerCase(),
            )

            if (matchingProfile) {
              addDebugInfo(`Found matching profile: ${matchingProfile.nickname}`)
              setProfile(matchingProfile)
              setLoading(false)
              return
            } else {
              addDebugInfo(`No exact match found for "${rawNickname}" in ${allProfiles.length} profiles`)

              // Try partial match as fallback
              const partialMatch = allProfiles.find(
                (p) =>
                  p.nickname &&
                  typeof p.nickname === "string" &&
                  p.nickname.toLowerCase().includes(rawNickname.toLowerCase()),
              )

              if (partialMatch) {
                addDebugInfo(`Found partial match: ${partialMatch.nickname}`)
                setProfile(partialMatch)
                setLoading(false)
                return
              }
            }
          }
        }

        // APPROACH 2: Try direct query with exact match
        addDebugInfo("APPROACH 2: Trying direct query with exact match")
        const rawQuery2 = `SELECT * FROM public_profiles WHERE nickname = '${rawNickname}'`
        addRawQuery(rawQuery2)

        const { data: exactMatch, error: exactMatchError } = await supabase
          .from("public_profiles")
          .select("*")
          .eq("nickname", rawNickname)
          .maybeSingle()

        if (exactMatchError) {
          addDebugInfo(`Error with exact match query: ${exactMatchError.message}`)
        } else if (exactMatch) {
          addDebugInfo(`Found exact match: ${exactMatch.nickname}`)
          setProfile(exactMatch)
          setLoading(false)
          return
        } else {
          addDebugInfo(`No exact match found for "${rawNickname}"`)
        }

        // APPROACH 3: Try with ILIKE for case-insensitive match
        addDebugInfo("APPROACH 3: Trying ILIKE for case-insensitive match")
        const rawQuery3 = `SELECT * FROM public_profiles WHERE nickname ILIKE '${rawNickname}'`
        addRawQuery(rawQuery3)

        const { data: ilikeMatch, error: ilikeMatchError } = await supabase
          .from("public_profiles")
          .select("*")
          .ilike("nickname", rawNickname)
          .limit(10)

        if (ilikeMatchError) {
          addDebugInfo(`Error with ILIKE query: ${ilikeMatchError.message}`)
        } else if (ilikeMatch && ilikeMatch.length > 0) {
          addDebugInfo(`Found ${ilikeMatch.length} matches with ILIKE`)

          // Find exact case-insensitive match
          const exactCaseInsensitiveMatch = ilikeMatch.find(
            (p) => p.nickname && p.nickname.toLowerCase() === rawNickname.toLowerCase(),
          )

          if (exactCaseInsensitiveMatch) {
            addDebugInfo(`Found exact case-insensitive match: ${exactCaseInsensitiveMatch.nickname}`)
            setProfile(exactCaseInsensitiveMatch)
          } else {
            // Use first result if no exact case-insensitive match
            addDebugInfo(`Using first ILIKE result: ${ilikeMatch[0].nickname}`)
            setProfile(ilikeMatch[0])
          }

          setLoading(false)
          return
        } else {
          addDebugInfo(`No ILIKE matches found for "${rawNickname}"`)
        }

        // APPROACH 4: Try with pattern matching
        addDebugInfo("APPROACH 4: Trying pattern matching")
        const rawQuery4 = `SELECT * FROM public_profiles WHERE nickname LIKE '%${rawNickname}%'`
        addRawQuery(rawQuery4)

        const { data: patternMatch, error: patternMatchError } = await supabase
          .from("public_profiles")
          .select("*")
          .like("nickname", `%${rawNickname}%`)
          .limit(10)

        if (patternMatchError) {
          addDebugInfo(`Error with pattern matching query: ${patternMatchError.message}`)
        } else if (patternMatch && patternMatch.length > 0) {
          addDebugInfo(`Found ${patternMatch.length} matches with pattern matching`)
          setProfile(patternMatch[0])
          setLoading(false)
          return
        } else {
          addDebugInfo(`No pattern matches found for "${rawNickname}"`)
        }

        // If we get here, we couldn't find the profile
        throw new Error(`Profile not found for nickname: ${rawNickname}`)
      } catch (err: any) {
        console.error("Error in profile page:", err)
        setError(err.message || "Failed to load profile")
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [params, supabase])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-[#00AEC7]">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The requested user profile could not be found."}</p>

          {/* Debug info for development */}
          {process.env.NODE_ENV !== "production" && (
            <div className="w-full max-w-lg bg-gray-100 p-4 rounded-md mb-6 overflow-auto max-h-[400px]">
              <h3 className="font-bold mb-2">Debug Info:</h3>
              <ul className="text-xs mb-4">
                {debugInfo.map((info, i) => (
                  <li key={i} className="mb-1">
                    {info}
                  </li>
                ))}
              </ul>

              <h3 className="font-bold mb-2">Raw Queries:</h3>
              <ul className="text-xs font-mono bg-black text-white p-2 rounded">
                {rawQueries.map((query, i) => (
                  <li key={i} className="mb-2 overflow-x-auto">
                    {query}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={() => router.back()} className="bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-[#00AEC7] hover:text-[#00AEC7]/90">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("back")}
      </Button>

      <div className="max-w-3xl mx-auto">
        <Card className="w-full overflow-hidden relative bg-white" style={gradientBorderStyle}>
          {/* Белый фон - базовый слой */}
          <div className="absolute inset-0 bg-white"></div>

          {/* Фоновое изображение шаблона - второй слой */}
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url('/images/card_background.png')`,
            }}
          ></div>

          <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
            {/* Profile Image - прямоугольное */}
            {(() => {
              const avatarUrl =
                profile.avatar_url && !imageError
                  ? profile.avatar_url
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name} ${profile.last_name}`

              const isGenerated = isGeneratedAvatar(avatarUrl)

              // Определяем размеры в зависимости от типа аватара
              const containerClass = isGenerated ? "max-w-[200px] p-2" : "max-w-[450px] p-4"
              const imageWidth = isGenerated ? 180 : 450
              const imageHeight = isGenerated ? 180 : 450

              return (
                <div
                  className={`w-full ${containerClass} mb-6 bg-white rounded-md relative z-10`}
                  style={gradientBorderStyle}
                >
                  <BlobImage
                    src={avatarUrl}
                    alt={`${profile.first_name} ${profile.last_name}`}
                    width={imageWidth}
                    height={imageHeight}
                    className="w-full h-auto object-contain"
                    onError={() => setImageError(true)}
                    fallbackSrc={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name} ${profile.last_name}`}
                  />
                </div>
              )
            })()}

            {/* Name and Basic Info */}
            <h1 className="text-2xl font-bold text-[#00AEC7]">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-lg text-black mb-2">@{profile.nickname}</p>

            {/* Professional Information */}
            {profile.relevant_position && (
              <p className="text-md font-medium text-[#00AEC7]">{profile.relevant_position}</p>
            )}
            {profile.relevant_company && <p className="text-sm text-black mb-2">{profile.relevant_company}</p>}

            {/* Location */}
            {profile.current_city && (
              <div className="flex items-center justify-center gap-1 mb-4">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{profile.current_city}</span>
              </div>
            )}

            {/* About You Section with Gradient Border */}
            {profile.about_you && (
              <div className="w-full mb-4 p-4 rounded-md bg-white" style={gradientBorderStyle}>
                <h3 className="font-semibold mb-2 text-[#00AEC7]">{t("profile.aboutYou")}</h3>
                <p className="text-sm text-black">{profile.about_you}</p>
              </div>
            )}

            {/* Motivation Section with Gradient Border */}
            {profile.motivation && (
              <div className="w-full mb-4 p-4 rounded-md bg-white" style={gradientBorderStyle}>
                <h3 className="font-semibold mb-2 text-[#00AEC7]">{t("profile.motivation")}</h3>
                <p className="text-sm text-black">{profile.motivation}</p>
              </div>
            )}

            {/* Education Section with Gradient Border */}
            {profile.university && (
              <div className="w-full mb-4 p-4 rounded-md bg-white" style={gradientBorderStyle}>
                <h3 className="font-semibold mb-2 text-[#00AEC7]">{t("profile.education")}</h3>
                <p className="text-sm text-black">{profile.university}</p>
              </div>
            )}

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 mt-2">
              {profile.linkedin && (
                <Link
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00AEC7] hover:opacity-80 transition-opacity"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              )}
              {profile.other_links && (
                <Link
                  href={profile.other_links}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00AEC7] hover:opacity-80 transition-opacity"
                >
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Personal Website</span>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
