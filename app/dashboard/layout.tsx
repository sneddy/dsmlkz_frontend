import type React from "react"
import { ProfileProvider } from "@/features/profile/client/ProfileProvider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProfileProvider>{children}</ProfileProvider>
}
