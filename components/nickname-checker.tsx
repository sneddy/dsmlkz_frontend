"use client"

import { useState, useEffect, useRef } from "react"
import { useSupabase } from "@/contexts/supabase-context"
import { Check, X, Loader2 } from "lucide-react"

interface NicknameCheckerProps {
  nickname: string
  currentUserId: string
  initialNickname?: string
  onChange?: (isAvailable: boolean) => void
}

export function NicknameChecker({ nickname, currentUserId, initialNickname, onChange }: NicknameCheckerProps) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { supabase } = useSupabase()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastCheckedNicknameRef = useRef<string | null>(null)

  useEffect(() => {
    // Reset state when nickname changes
    setError(null)

    // If the nickname is the same as the initial nickname, it's valid (user is keeping their current nickname)
    if (initialNickname && nickname === initialNickname) {
      console.log("Nickname is the same as initial nickname, marking as available")
      setIsAvailable(true)
      if (onChange) onChange(true)
      return
    }

    // Don't check empty nicknames
    if (!nickname || nickname.trim() === "") {
      setIsAvailable(null)
      if (onChange) onChange(false)
      return
    }

    // Don't check if the nickname is the same as the last checked one
    if (nickname === lastCheckedNicknameRef.current) {
      return
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Debounce the check to avoid too many requests
    timeoutRef.current = setTimeout(() => {
      checkNickname(nickname)
    }, 500)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [nickname, currentUserId, initialNickname, onChange])

  const checkNickname = async (nicknameToCheck: string) => {
    // Don't check if the nickname is the same as the last checked one
    if (nicknameToCheck === lastCheckedNicknameRef.current) {
      return
    }

    setIsChecking(true)
    lastCheckedNicknameRef.current = nicknameToCheck

    try {
      console.log(
        "Checking nickname:",
        nicknameToCheck,
        "Current user ID:",
        currentUserId,
        "Initial nickname:",
        initialNickname,
      )

      // First check profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("nickname", nicknameToCheck)
        .neq("id", currentUserId || "")

      if (profileError) {
        console.error("Error checking nickname in profiles:", profileError)
        throw profileError
      }

      console.log("Profile data for nickname check:", profileData)

      // If nickname exists in profiles and doesn't belong to current user
      if (profileData && profileData.length > 0) {
        setIsAvailable(false)
        if (onChange) onChange(false)
        return
      }

      // Then check public_profiles as fallback
      const { data: publicData, error: publicError } = await supabase
        .from("public_profiles")
        .select("id")
        .eq("nickname", nicknameToCheck)
        .neq("id", currentUserId || "")

      if (publicError) {
        console.error("Error checking nickname in public_profiles:", publicError)
        // Don't throw here, just log the error
      }

      console.log("Public profile data for nickname check:", publicData)

      // If nickname exists in public_profiles and doesn't belong to current user
      if (publicData && publicData.length > 0) {
        setIsAvailable(false)
        if (onChange) onChange(false)
        return
      }

      // If we get here, the nickname is available
      setIsAvailable(true)
      if (onChange) onChange(true)
    } catch (error) {
      console.error("Error checking nickname availability:", error)
      setError("Error checking availability")
      if (onChange) onChange(false)
    } finally {
      setIsChecking(false)
    }
  }

  // If the nickname is the same as the initial nickname, it's valid (user is keeping their current nickname)
  if (initialNickname && nickname === initialNickname) {
    return (
      <div className="flex items-center h-5 mt-1">
        <div className="flex items-center text-xs text-green-500">
          <Check className="h-3 w-3 mr-1" />
          Current nickname
        </div>
      </div>
    )
  }

  if (!nickname) return null

  return (
    <div className="flex items-center h-5 mt-1">
      {isChecking ? (
        <div className="flex items-center text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Checking...
        </div>
      ) : error ? (
        <div className="flex items-center text-xs text-destructive">
          <X className="h-3 w-3 mr-1" />
          {error}
        </div>
      ) : isAvailable === true ? (
        <div className="flex items-center text-xs text-green-500">
          <Check className="h-3 w-3 mr-1" />
          Available
        </div>
      ) : isAvailable === false ? (
        <div className="flex items-center text-xs text-destructive">
          <X className="h-3 w-3 mr-1" />
          Already taken
        </div>
      ) : null}
    </div>
  )
}
