"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface CollaborationCardProps {
  title: string
  description: string
  details: string
  gradientBorderStyle: React.CSSProperties
}

export function CollaborationCard({ title, description, details, gradientBorderStyle }: CollaborationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card style={gradientBorderStyle} className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="font-pixel text-[#00AEC7] flex items-start justify-between gap-2">
          <span className="text-sm md:text-base leading-tight">{title}</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 p-1 rounded-full hover:bg-[#00AEC7]/10 transition-colors touch-manipulation"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-[#00AEC7]" />
            ) : (
              <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-[#00AEC7]" />
            )}
          </button>
        </CardTitle>
        <CardDescription className="text-xs md:text-sm font-medium text-[#FFF32A] pr-6">{description}</CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border-t border-[#00AEC7]/20 pt-3">
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{details}</p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
