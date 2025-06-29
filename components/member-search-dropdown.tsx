"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, User, MapPin, Building, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/hooks/use-translation"
import { useMemberSearch } from "@/hooks/use-member-search"
import { useClickOutside } from "@/hooks/use-click-outside"
import Link from "next/link"

interface Member {
  id: string
  nickname: string
  first_name: string
  last_name: string
  current_city?: string
  relevant_company?: string
  relevant_position?: string
  about_you?: string
  avatar_url?: string
}

export function MemberSearchDropdown() {
  const { t } = useTranslation()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { members, loading, error } = useMemberSearch(query)

  useClickOutside(dropdownRef, () => {
    setIsOpen(false)
    setSelectedIndex(-1)
  })

  useEffect(() => {
    if (query.trim() && members.length > 0) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
    setSelectedIndex(-1)
  }, [query, members])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || members.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < members.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : members.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < members.length) {
          const member = members[selectedIndex]
          window.open(`/users/${member.nickname}`, "_blank")
          setIsOpen(false)
          setQuery("")
          setSelectedIndex(-1)
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleMemberClick = (member: Member) => {
    setIsOpen(false)
    setQuery("")
    setSelectedIndex(-1)
  }

  const clearSearch = () => {
    setQuery("")
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={t("search.placeholder")}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 h-12 text-base bg-white border-gray-200 focus:border-[#00AEC7] focus:ring-[#00AEC7] rounded-xl shadow-sm"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          >
            ×
          </Button>
        )}
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#00AEC7] animate-spin" />
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <Card className="border-0 shadow-2xl bg-white backdrop-blur-sm">
            <CardContent className="p-0 max-h-96 overflow-y-auto bg-white rounded-lg">
              {error && (
                <div className="p-4 text-center text-red-600 bg-white">
                  <p className="text-sm">{t("search.error")}</p>
                </div>
              )}

              {!loading && !error && members.length === 0 && query.trim() && (
                <div className="p-6 text-center text-gray-500 bg-white">
                  <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">{t("search.noResults")}</p>
                  <p className="text-xs text-gray-400 mt-1">{t("search.tryDifferentKeywords")}</p>
                </div>
              )}

              {members.length > 0 && (
                <div className="py-2 bg-white">
                  {members.map((member, index) => (
                    <Link
                      key={member.id}
                      href={`/users/${member.nickname}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleMemberClick(member)}
                      className={`block px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                        index === selectedIndex ? "bg-[#00AEC7]/5 border-l-4 border-[#00AEC7]" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {member.avatar_url ? (
                            <img
                              src={member.avatar_url || "/placeholder.svg"}
                              alt={`${member.first_name} ${member.last_name}`}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00AEC7] to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                              {member.first_name?.[0] || member.nickname[0]}
                            </div>
                          )}
                        </div>

                        {/* Member Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {member.first_name} {member.last_name}
                            </h4>
                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                              @{member.nickname}
                            </Badge>
                          </div>

                          {/* Position & Company */}
                          {(member.relevant_position || member.relevant_company) && (
                            <div className="flex items-center gap-1 mb-1">
                              <Building className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              <p className="text-sm text-gray-600 truncate">
                                {member.relevant_position}
                                {member.relevant_position && member.relevant_company && " • "}
                                {member.relevant_company}
                              </p>
                            </div>
                          )}

                          {/* Location */}
                          {member.current_city && (
                            <div className="flex items-center gap-1 mb-2">
                              <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              <p className="text-sm text-gray-500 truncate">{member.current_city}</p>
                            </div>
                          )}

                          {/* Bio Preview */}
                          {member.about_you && (
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                              {member.about_you.length > 100
                                ? `${member.about_you.substring(0, 100)}...`
                                : member.about_you}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Show more results hint */}
                  {members.length >= 10 && (
                    <div className="px-4 py-2 text-center border-t border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500">{t("search.showingFirst10")}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
