import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
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

export async function POST(request: Request) {
  try {
    console.log("Profile update API route called")

    // Create a regular client to check authentication
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      console.log("No session found, returning 401")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.user.id

    // Validate request body
    let profileData
    try {
      profileData = await request.json()
    } catch (e) {
      console.error("Invalid JSON in request body:", e)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    console.log("Updating profile for user:", userId)
    console.log("Profile data:", profileData)

    // Check if service role key is available
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("SUPABASE_SERVICE_ROLE_KEY is not defined")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Validate required fields
    if (!profileData.nickname || !profileData.first_name || !profileData.last_name) {
      return NextResponse.json({ error: "Nickname, first name, and last name are required" }, { status: 400 })
    }

    // Get the current profile to check if the nickname is changing and if secret_number exists
    const { data: currentProfile, error: currentProfileError } = await supabaseAdmin
      .from("profiles")
      .select("nickname, secret_number")
      .eq("id", userId)
      .maybeSingle()

    console.log("Current profile fetch result:", { currentProfile, error: currentProfileError })

    // Проверяем, существует ли профиль
    const profileExists = currentProfile !== null

    // Only check for nickname conflicts if the nickname is changing
    if (!profileExists || (currentProfile && profileData.nickname !== currentProfile.nickname)) {
      // Check if nickname is already taken by another user
      const { data: existingUser, error: nicknameCheckError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("nickname", profileData.nickname)
        .neq("id", userId)
        .maybeSingle()

      if (nicknameCheckError) {
        console.error("Error checking nickname:", nicknameCheckError)
        return NextResponse.json({ error: "Error checking nickname availability" }, { status: 500 })
      }

      if (existingUser) {
        return NextResponse.json({ error: "This nickname is already taken by another user" }, { status: 409 })
      }
    }

    // Remove email field if present to avoid schema errors
    const { email, ...profileDataWithoutEmail } = profileData

    // УПРОЩЕННАЯ ЛОГИКА ГЕНЕРАЦИИ SECRET_NUMBER
    let secretNumber = 42 // fallback по умолчанию

    if (profileExists && currentProfile?.secret_number) {
      secretNumber = currentProfile.secret_number
      console.log("Using existing secret_number:", secretNumber)
    } else {
      try {
        const randomNumber = Math.floor(Math.random() * 900) + 100
        if (!isNaN(randomNumber) && randomNumber > 0) {
          secretNumber = randomNumber
          console.log("Generated new random secret_number:", secretNumber)
        } else {
          console.log("Random number generation failed, using fallback 42")
        }
      } catch (error) {
        console.error("Error generating random number:", error)
        console.log("Using fallback secret_number: 42")
      }
    }

    // Добавим дополнительную проверку для отладки
    console.log("Profile exists:", profileExists)
    console.log("Current profile from DB:", currentProfile)
    console.log("Final secret number to be used:", secretNumber)

    // Также убедимся, что secret_number включен в данные для обновления
    const dataToUpdate = {
      ...profileDataWithoutEmail,
      id: userId, // Ensure user ID is included
      secret_number: secretNumber, // Always include the secret_number
      updated_at: profileDataWithoutEmail.updated_at || new Date().toISOString(),
    }

    // Добавим дополнительную проверку для поля birthday
    // Если birthday пустой или undefined, установим его как null
    if (dataToUpdate.birthday === "" || dataToUpdate.birthday === undefined) {
      dataToUpdate.birthday = null
    }

    console.log("Final data to update:", dataToUpdate)

    // Use the admin client to bypass RLS
    console.log("Executing upsert operation with admin client")

    // Используем upsert без eq для создания новой записи, если она не существует
    const { data, error } = await supabaseAdmin.from("profiles").upsert(dataToUpdate).select()

    if (error) {
      console.error("Error updating profile:", error)

      // Handle specific error types
      if (error.code === "23505") {
        // PostgreSQL unique constraint violation
        return NextResponse.json({ error: "This nickname is already taken by another user" }, { status: 409 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Also update the public_profiles table if it exists
    try {
      // We don't need to explicitly update public_profiles since it's a view
      // that automatically joins with the avatars table
      console.log("Profile updated successfully, public_profiles view will reflect changes automatically")
    } catch (publicProfileError) {
      console.error("Error with public_profiles:", publicProfileError)
      // Don't fail the request if public profile update fails
    }

    console.log("Profile updated successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in profile update API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
