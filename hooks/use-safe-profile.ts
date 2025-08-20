"use client"

import { useContext } from "react"
import { ProfileContext } from "@/features/profile/client/ProfileProvider"

const useSafeProfile = () => {
  const context = useContext(ProfileContext)

  // Если контекст недоступен, возвращаем дефолтные значения
  if (!context) {
    return { profile: null, loadingProfile: false, profileError: null }
  }

  return context
}

export { useSafeProfile }
export default useSafeProfile
