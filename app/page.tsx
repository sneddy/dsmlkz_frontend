import { redirect } from "next/navigation"
import { getServerLanguage } from "@/lib/server-language"

export default async function RootPage() {
  const preferredLang = await getServerLanguage()

  redirect(`/${preferredLang}`)
}
