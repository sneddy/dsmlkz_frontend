"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Info } from "lucide-react"
import { useState } from "react"
import { CollaborationModal } from "@/components/collaboration-modal"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CollaborationCardProps {
  title: string
  description: string
  details: string
  gradientBorderStyle: React.CSSProperties
}

export function CollaborationCard({ title, description, details, gradientBorderStyle }: CollaborationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleToggle = () => {
    if (isMobile) {
      setIsModalOpen(true)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <>
      <Card style={gradientBorderStyle} className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="font-pixel text-[#00AEC7] flex items-center justify-between">
            {title}
            <button
              onClick={handleToggle}
              className="ml-2 p-2 rounded-full hover:bg-[#00AEC7]/10 transition-colors touch-manipulation"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isMobile ? (
                <Info className="h-5 w-5 text-[#00AEC7]" />
              ) : isExpanded ? (
                <ChevronUp className="h-5 w-5 text-[#00AEC7]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#00AEC7]" />
              )}
            </button>
          </CardTitle>
          <CardDescription className="text-sm font-medium text-[#FFF32A] pr-8">{description}</CardDescription>
        </CardHeader>

        {!isMobile && isExpanded && (
          <CardContent className="pt-0">
            <div className="border-t border-[#00AEC7]/20 pt-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{details}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {isMobile && (
        <CollaborationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title}
          description={description}
          details={details}
        />
      )}
    </>
  )
}
