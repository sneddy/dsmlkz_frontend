import { createClient } from "@supabase/supabase-js"

export function createServerPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, anon, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
      },
    },
  })
}
