"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search } from "lucide-react"

type TelegramPost = {
  post_id: string
  channel_name: string
  message_id: number
  image_url: string | null
  created_at: string
  html_text: string
  post_link: string | null
  sender_name: string | null
}

type NewsFeedClientProps = {
  initialPosts: TelegramPost[]
  translations: any
}

export function NewsFeedClient({ initialPosts, translations }: NewsFeedClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim()) {
      setIsSearching(true)
      // TODO: Implement client-side search or server action
      setTimeout(() => setIsSearching(false), 1000)
    } else {
      setIsSearching(false)
    }
  }

  return (
    <>
      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={translations?.search_placeholder || "Search news..."}
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00AEC7] focus:ring-[#00AEC7]/20"
          />
          {isSearching && searchQuery.trim() && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#00AEC7] border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <Button
          size="lg"
          className="flex items-center gap-3 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-white px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out focus:ring-2 focus:ring-[#00AEC7]/50 focus:outline-none"
        >
          {translations?.show_more || "Show More"}
          <ChevronDown className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-1" />
        </Button>
      </div>
    </>
  )
}
