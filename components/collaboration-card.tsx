"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface CollaborationCardProps {
  title: string
  description: string
  details: string
  gradientBorderStyle: React.CSSProperties
}

export function CollaborationCard({ title, description, details, gradientBorderStyle }: CollaborationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card style={gradientBorderStyle} className="bg-background">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 pr-6">
            <CardTitle className="font-pixel text-[#00AEC7] text-sm md:text-base">{title}</CardTitle>
            <CardDescription className="text-xs md:text-sm">{description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 h-4 w-4 md:h-5 md:w-5 p-0 hover:bg-muted touch-manipulation"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <p className="text-xs md:text-sm text-muted-foreground">{details}</p>
        </CardContent>
      )}
    </Card>
  )
}
