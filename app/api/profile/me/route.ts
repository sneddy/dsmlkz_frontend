import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

const supabaseAdmin =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null

export async function GET() {
  if (!supabaseAdmin) {
    console.error("[profile] Missing Supabase admin configuration")
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error("[profile] Failed to read session in /api/profile/me", sessionError)
    return NextResponse.json({ error: "Failed to read session" }, { status: 500 })
  }

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const { data: publicProfile, error: publicProfileError } = await supabaseAdmin
      .from("public_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (publicProfileError) {
      console.error("[profile] Error fetching public profile", publicProfileError)
    }

    const { data: privateProfile, error: privateProfileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (privateProfileError) {
      console.error("[profile] Error fetching private profile", privateProfileError)
    }

    const baseProfile = publicProfile || privateProfile

    if (!baseProfile) {
      return NextResponse.json({ profile: null })
    }

    const secretNumber = privateProfile?.secret_number ?? publicProfile?.secret_number ?? null

    const { data: avatarData, error: avatarError } = await supabaseAdmin
      .from("avatars")
      .select("url")
      .eq("user_id", userId)
      .eq("is_current", true)
      .maybeSingle()

    if (avatarError) {
      console.error("[profile] Error fetching avatar", avatarError)
    }

    const profile = {
      ...baseProfile,
      secret_number: secretNumber,
      avatar_url: baseProfile.avatar_url || avatarData?.url || null,
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("[profile] Unexpected error in /api/profile/me", error)
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 })
  }
}
