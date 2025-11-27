import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export async function createServerClient() {
  const cookieStore = await cookies()
  const isMutable = cookieStore.constructor.name === "RequestCookies"

  const mutateCookie = (cb: () => void) => {
    if (!isMutable) {
      return
    }
    try {
      cb()
    } catch (error) {
      console.warn("Skipping cookie mutation outside server action:", error)
    }
  }

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          mutateCookie(() => cookieStore.set({ name, value, ...options }))
        },
        remove(name: string, options: any) {
          mutateCookie(() => cookieStore.set({ name, value: "", ...options }))
        },
      },
    },
  )
}
