import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Fetch all verified profiles
    const { data: allProfiles, error: fetchError } = await supabaseAdmin
      .from("verified_profiles")
      .select(`
        id,
        nickname,
        first_name,
        last_name,
        current_city,
        university,
        relevant_company,
        relevant_position,
        linkedin,
        about_you,
        other_links
      `)

    if (fetchError) {
      console.error("Error fetching verified profiles:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    // For each profile, fetch the current avatar URL
    const profilesWithAvatars = await Promise.all(
      (allProfiles || []).map(async (profile) => {
        try {
          const { data: avatarData, error: avatarError } = await supabaseAdmin
            .from("avatars")
            .select("url")
            .eq("user_id", profile.id)
            .eq("is_current", true)
            .maybeSingle()

          if (avatarError) {
            console.error(`Error fetching avatar for ${profile.nickname}:`, avatarError)
          }

          return {
            ...profile,
            avatar_url: avatarData?.url || null
          }
        } catch (error) {
          console.error(`Error processing avatar for ${profile.nickname}:`, error)
          return {
            ...profile,
            avatar_url: null
          }
        }
      })
    )

    return NextResponse.json({
      profiles: profilesWithAvatars,
      total: profilesWithAvatars.length
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "An error occurred while fetching faces data" }, { status: 500 })
  }
}
