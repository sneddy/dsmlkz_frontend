"use client"

import { useState, useEffect, useRef } from "react"
import { useSupabase } from "@/contexts/supabase-context"
import { Check, X, Loader2, Info } from "lucide-react"

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
  const [validationError, setValidationError] = useState<string | null>(null)
  const { supabase } = useSupabase()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastCheckedNicknameRef = useRef<string | null>(null)

  // Проверка формата nickname (латинские буквы, цифры, дефис, без пробелов)
  const validateNicknameFormat = (nickname: string): string | null => {
    if (!nickname || nickname.trim() === "") {
      return null
    }

    // Проверка на минимальную длину
    if (nickname.length < 3) {
      return "Minimum 3 characters required"
    }

    // Проверка на максимальную длину
    if (nickname.length > 20) {
      return "Maximum 20 characters allowed"
    }

    // Проверка на латинские символы, цифры и дефис без пробелов
    const validFormatRegex = /^[a-zA-Z0-9-]+$/
    if (!validFormatRegex.test(nickname)) {
      return "Only Latin letters, numbers and hyphens allowed"
    }

    // Проверка, что nickname не состоит только из цифр
    const onlyNumbersRegex = /^\d+$/
    if (onlyNumbersRegex.test(nickname)) {
      return "Cannot contain only numbers"
    }

    // Проверка, что nickname не состоит только из дефисов
    const onlyHyphensRegex = /^-+$/
    if (onlyHyphensRegex.test(nickname)) {
      return "Cannot contain only hyphens"
    }

    // Проверка, что nickname не начинается и не заканчивается дефисом
    if (nickname.startsWith("-") || nickname.endsWith("-")) {
      return "Cannot start or end with hyphen"
    }

    // Проверка на последовательные дефисы
    if (nickname.includes("--")) {
      return "Cannot contain consecutive hyphens"
    }

    return null
  }

  useEffect(() => {
    // Reset state when nickname changes
    setError(null)
    setValidationError(null)

    // If the nickname is the same as the initial nickname, it's valid (user is keeping their current nickname)
    if (initialNickname && nickname === initialNickname) {
      console.log("Nickname is the same as initial nickname, marking as available")
      setIsAvailable(true)
      if (onChange) onChange(true)
      return
    }

    // Validate nickname format first
    const formatError = validateNicknameFormat(nickname)
    if (formatError) {
      setValidationError(formatError)
      setIsAvailable(false)
      if (onChange) onChange(false)
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
        .maybeSingle() // Use maybeSingle to handle "No rows found" gracefully

      if (profileError && !profileError.message.includes("No rows found")) {
        console.error("Error checking nickname in profiles:", profileError)
        throw profileError
      }

      console.log("Profile data for nickname check:", profileData)

      // If nickname exists in profiles and doesn't belong to current user
      if (profileData) {
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
        .maybeSingle() // Use maybeSingle to handle "No rows found" gracefully

      if (publicError && !publicError.message.includes("No rows found")) {
        console.error("Error checking nickname in public_profiles:", publicError)
        // Don't throw here, just log the error
      }

      console.log("Public profile data for nickname check:", publicData)

      // If nickname exists in public_profiles and doesn't belong to current user
      if (publicData) {
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
        <NicknameInfoTooltip />
      </div>
    )
  }

  if (!nickname) {
    return (
      <div className="flex items-center h-5 mt-1">
        <NicknameInfoTooltip />
      </div>
    )
  }

  return (
    <div className="flex items-center h-5 mt-1">
      {isChecking ? (
        <div className="flex items-center text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Checking availability...
        </div>
      ) : validationError ? (
        <div className="flex items-center text-xs text-destructive">
          <X className="h-3 w-3 mr-1" />
          {validationError}
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
      <NicknameInfoTooltip />
    </div>
  )
}

// Компонент с tooltip для требований к nickname
function NicknameInfoTooltip() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative ml-2">
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <Info className="h-3 w-3" />
      </button>

      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-popover text-popover-foreground border rounded-md shadow-md p-3 text-xs w-64">
            <div className="font-medium mb-2">Nickname requirements:</div>
            <ul className="space-y-1">
              <li>• 3-20 characters long</li>
              <li>• Only Latin letters (a-z, A-Z), numbers (0-9) and hyphens (-)</li>
              <li>• No spaces or other special characters</li>
              <li>• Cannot be only numbers or only hyphens</li>
              <li>• Cannot start or end with hyphen</li>
              <li>• Cannot contain consecutive hyphens (--)</li>
            </ul>
            {/* Стрелочка tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border"></div>
          </div>
        </div>
      )}
    </div>
  )
}
