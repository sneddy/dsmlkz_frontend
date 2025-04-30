import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
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
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

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
    const results = session?.user?.id ? data.filter((profile) => profile.id !== session.user.id) : data

    return NextResponse.json({
      results,
      debug: {
        query,
        profilesCheck: profilesCheck?.length || 0,
        authenticated: !!session,
        totalResults: data.length,
        filteredResults: results.length,
      },
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "An error occurred while searching for members" }, { status: 500 })
  }
}
