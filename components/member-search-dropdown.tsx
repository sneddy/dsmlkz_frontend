"use client"

import { useEffect } from "react"

import { useState } from "react"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, User, X, Loader2 } from "lucide-react"
import { useMemberSearch } from "@/hooks/use-member-search"
import { MemberMiniCard } from "@/components/member-mini-card"

export function MemberSearchDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { query, setQuery, results, loading, error, selectedIndex, setSelectedIndex, handleKeyDown } = useMemberSearch()

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle clicks outside to close dropdown
  useEffect(() => {
    if (!isOpen) return

    const handleDocumentClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleDocumentClick)
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick)
    }
  }, [isOpen])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setQuery("")
    }
  }

  const handleViewAllResults = () => {
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleClearSearch = () => {
    setQuery("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div ref={dropdownRef}>
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">{t("dashboard.findCommunityMembers")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[320px] p-0" align="end">
          <div className="flex items-center border-b p-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              ref={inputRef}
              placeholder={t("search.membersPlaceholder") || "Search members..."}
              className="flex h-8 w-full rounded-md border-0 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={handleClearSearch}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="max-h-[300px] overflow-auto">
            {loading ? (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-[#00b2b2]" />
                <span className="ml-2 text-sm">{t("search.searching") || "Searching..."}</span>
              </div>
            ) : error ? (
              <div className="p-4">
                <div className="text-sm text-destructive mb-2">{error}</div>
                <div className="text-xs text-muted-foreground">
                  Try a different search term or check if there are members in the database.
                </div>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="py-1">
                  {results.map((member, index) => (
                    <DropdownMenuItem key={member.id} asChild>
                      <div className="p-0">
                        <MemberMiniCard
                          member={member}
                          isSelected={index === selectedIndex}
                          onClick={() => setIsOpen(false)}
                        />
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuItem onClick={handleViewAllResults} className="justify-center border-t">
                  <span className="text-xs">{t("dashboard.viewAllResults")}</span>
                </DropdownMenuItem>
              </>
            ) : query.length > 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">{t("dashboard.noUsersFound")}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different search term or check if there are members in the database.
                </p>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <User className="mx-auto h-6 w-6 opacity-50" />
                <p className="mt-2">{t("dashboard.startTypingToSearch")}</p>
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
