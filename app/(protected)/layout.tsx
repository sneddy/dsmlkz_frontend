import type React from "react"
import { ProfileProvider } from "@/features/profile/client/ProfileProvider"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProfileProvider>{children}</ProfileProvider>
}
