import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/auth-helpers-nextjs"

export const dynamic = "force-dynamic"

const supabaseAdmin =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null

export async function GET(request: Request) {
  if (!supabaseAdmin) {
    console.error("[profile] Missing Supabase admin configuration")
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => cookieStore.set({ name, value, ...options }),
        remove: (name: string, options: any) => cookieStore.set({ name, value: "", ...options, maxAge: 0 }),
        getAll: () => cookieStore.getAll().map((c) => ({ name: c.name, value: c.value })),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set({ name, value, ...options }))
        },
      },
    },
  )

  const authHeader = request.headers.get("authorization")
  let bearerUserId: string | null = null

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length)
    try {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.getUser(token)
      if (authError) {
        console.warn("[profile] Bearer token auth failed", authError)
      }
      bearerUserId = authUser?.user?.id || null
    } catch (e) {
      console.error("[profile] Bearer token validation threw", e)
    }
  }

  const {
    data: { user, session },
    error: userError,
  } = await supabase.auth.getUser()

  const resolvedUserId = user?.id || bearerUserId

  if ((!resolvedUserId || !session) && !bearerUserId) {
    if (userError) {
      console.error("[profile] Failed to validate user in /api/profile/me", userError)
    } else {
      console.warn("[profile] No authenticated user in /api/profile/me")
    }
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const userId = resolvedUserId!

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
