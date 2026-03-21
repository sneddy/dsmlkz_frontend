import { createClient } from "@supabase/supabase-js"
import { FacesContent } from "@/widgets/faces_content"
import type { CommunityFace } from "@/widgets/faces_content"
import type { Profile } from "@/features/auth/types"
import type { Database } from "@/types/supabase"

export const revalidate = 300

type VerifiedProfileRow = Database["public"]["Views"]["verified_profiles"]["Row"]

function createPublicServerSupabaseClient() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function mapVerifiedProfile(row: VerifiedProfileRow): Profile | null {
  if (!row.profile_id || !row.nickname || !row.first_name || !row.last_name || !row.avatar_url) {
    return null
  }

  return {
    id: row.profile_id,
    nickname: row.nickname,
    first_name: row.first_name,
    last_name: row.last_name,
    current_city: row.current_city ?? undefined,
    university: row.university ?? undefined,
    relevant_company: row.relevant_company ?? undefined,
    relevant_position: row.relevant_position ?? undefined,
    about_you: row.about_you ?? undefined,
    motivation: row.motivation ?? undefined,
    linkedin: row.linkedin ?? undefined,
    other_links: row.other_links ?? undefined,
    avatar_url: row.avatar_url,
  }
}

export default async function Faces() {
  const supabase = createPublicServerSupabaseClient()

  try {
    const [{ data: verifiedProfilesData, error: verifiedProfilesError }, { data: highlightsData, error: highlightsError }] =
      await Promise.all([
        supabase
          .from("verified_profiles")
          .select(
            "profile_id, nickname, first_name, last_name, current_city, university, relevant_company, relevant_position, about_you, motivation, linkedin, other_links, avatar_url",
          )
          .not("profile_id", "is", null)
          .not("nickname", "is", null)
          .not("first_name", "is", null)
          .not("last_name", "is", null)
          .not("avatar_url", "is", null),
        supabase.from("community_faces").select("*").order("display_order", { ascending: true }).order("name", { ascending: true }),
      ])

    if (verifiedProfilesError) {
      throw verifiedProfilesError
    }

    if (highlightsError) {
      throw highlightsError
    }

    const initialProfiles = (verifiedProfilesData ?? [])
      .map(mapVerifiedProfile)
      .filter((profile): profile is Profile => profile !== null)

    return <FacesContent initialProfiles={initialProfiles} initialHighlights={(highlightsData as CommunityFace[]) ?? []} />
  } catch (error: any) {
    console.error("Failed to fetch faces page data:", error)
    return <FacesContent initialError={error?.message ?? "Failed to load community faces"} />
  }
}
