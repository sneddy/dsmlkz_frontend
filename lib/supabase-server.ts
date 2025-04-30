import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Export the createServerClient function
export function createServerClient() {
  return createServerComponentClient<Database>({ cookies })
}
