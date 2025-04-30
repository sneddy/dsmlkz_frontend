"use client"

import { useRef, useEffect } from "react"
import { Search, X, Loader2, LogIn } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MemberMiniCard } from "@/components/member-mini-card"
import { useMemberSearch } from "@/hooks/use-member-search"
import { useTranslation } from "@/hooks/use-translation"
import { useOnClickOutside } from "@/hooks/use-click-outside"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function MemberSearch() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const {
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
  } = useMemberSearch()

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle clicks outside to close dropdown
  useOnClickOutside(searchRef, () => setShowResults(false))

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleClearSearch = () => {
    setQuery("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder={t("search.membersPlaceholder")}
          className="pl-10 pr-10 border-[#00b2b2]/30 focus-visible:ring-[#FFD700]/50 focus-visible:border-[#00b2b2]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          aria-expanded={showResults}
          aria-controls="search-results"
          aria-autocomplete="list"
          role="combobox"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results dropdown */}
      {showResults && (
        <div
          id="search-results"
          className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-80 overflow-y-auto"
          role="listbox"
        >
          {loading ? (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-[#00b2b2]" />
              <span className="ml-2 text-sm">{t("search.searching")}</span>
            </div>
          ) : error ? (
            <div className="p-4 text-sm">
              {error === "Please sign in to search members" ? (
                <div className="flex flex-col items-center">
                  <p className="text-destructive mb-2">{error}</p>
                  <Link href="/signin">
                    <Button size="sm" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      {t("auth.signIn")}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-destructive mb-2">{error}</p>
                  <p className="text-xs text-muted-foreground">
                    Try a different search term or check if there are any members in the database.
                  </p>
                </div>
              )}
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              {t("search.noResults")}
              <p className="text-xs mt-1">
                Try searching for a different name or check if there are members in the database.
              </p>
            </div>
          ) : (
            <div className="py-1">
              {results.map((member, index) => (
                <MemberMiniCard
                  key={member.id}
                  member={member}
                  isSelected={index === selectedIndex}
                  onClick={() => setShowResults(false)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
