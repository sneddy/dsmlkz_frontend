"use server"

import { cookies } from "next/headers"

/**
 * Server action to set locale cookie
 */
export async function setLocale(locale: string) {
  const cookieStore = cookies()

  // Validate locale
  if (!["ru", "en"].includes(locale)) {
    throw new Error("Invalid locale")
  }

  // Set cookie with proper flags
  cookieStore.set("locale", locale, {
    path: "/",
    maxAge: 31536000, // 1 year
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false, // Allow client-side access for reading
  })
}
