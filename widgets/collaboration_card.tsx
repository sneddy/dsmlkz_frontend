"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CollaborationCardProps {
  title: string
  description: string
  details: string
  gradientBorderStyle: React.CSSProperties
}

export function CollaborationCard({ title, description, details, gradientBorderStyle }: CollaborationCardProps) {
  return (
    <Card
      className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl"
      style={gradientBorderStyle}
    >
      <CardHeader>
        <CardTitle className="font-pixel text-[#00AEC7] group-hover:text-[#00AEC7]/80 transition-colors text-lg">
          {title}
        </CardTitle>
        <CardDescription className="text-[#FFF32A] font-medium">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 leading-relaxed text-sm">{details}</p>
      </CardContent>
    </Card>
  )
}
