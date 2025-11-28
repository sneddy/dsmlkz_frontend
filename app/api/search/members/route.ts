import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Add this line to make the route compatible with static export
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
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

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Debug: Check if we have profiles in the database
    const { data: profilesCheck, error: profilesCheckError } = await supabase
      .from("public_profiles")
      .select("id")
      .limit(1)

    console.log("Profiles check:", profilesCheck, profilesCheckError)

    // Perform the search
    const { data, error } = await supabase
      .from("public_profiles")
      .select(
        "id, nickname, first_name, last_name, current_city, university, relevant_company, relevant_position, avatar_url",
      )
      .or(`nickname.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      .order("first_name", { ascending: true })
      .limit(10)

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Filter out the current user if authenticated
    const results = user?.id ? data.filter((profile) => profile.id !== user.id) : data

    return NextResponse.json({
      results,
      debug: {
        query,
        profilesCheck: profilesCheck?.length || 0,
        authenticated: !!user,
        totalResults: data.length,
        filteredResults: results.length,
      },
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "An error occurred while searching for members" }, { status: 500 })
  }
}
