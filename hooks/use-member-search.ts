"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"

type Member = {
  id: string
  nickname: string
  first_name: string
  last_name: string
  current_city?: string
  university?: string
  relevant_company?: string
  relevant_position?: string
  avatar_url?: string
}

export function useMemberSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const searchMembers = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log("Searching for:", searchQuery)

      const response = await fetch(`/api/search/members?q=${encodeURIComponent(searchQuery)}`)

      console.log("Search response status:", response.status)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to search members")
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to search members")
        }
      }

      const data = await response.json()
      console.log("Search results:", data)

      setResults(data.results || [])
      setShowResults(true)
      setSelectedIndex(-1) // Reset selection when new results come in
    } catch (err) {
      console.error("Error searching members:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (query.trim() === "") {
      setResults([])
      setShowResults(false)
      return
    }

    debounceTimerRef.current = setTimeout(() => {
      searchMembers(query)
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query, searchMembers])

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showResults || results.length === 0) return

      // Arrow down
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
      }
      // Arrow up
      else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      }
      // Enter
      else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault()
        const selectedMember = results[selectedIndex]
        if (selectedMember) {
          window.location.href = `/users/${selectedMember.nickname}`
        }
      }
      // Escape
      else if (e.key === "Escape") {
        e.preventDefault()
        setShowResults(false)
      }
    },
    [showResults, results, selectedIndex],
  )

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    showResults,
    setShowResults,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
  }
}
