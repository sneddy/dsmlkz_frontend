import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default function RootPage() {
  const cookieStore = cookies()
  const preferredLang = cookieStore.get("preferred-language")?.value || "ru"

  redirect(`/${preferredLang}`)
}
