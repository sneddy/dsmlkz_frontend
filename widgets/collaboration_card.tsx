"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface CollaborationCardProps {
  title: string
  description: string
  details: string
  trackLabel: string
}

export function CollaborationCard({ title, description, details, trackLabel }: CollaborationCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#07111f]/80 text-white shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#00AEC7]/50 hover:bg-[#0a1728]/90 hover:shadow-[0_24px_80px_rgba(0,174,199,0.1)]">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#FFF32A] via-[#00AEC7] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,243,42,0.08),transparent_32%),radial-gradient(circle_at_100%_0%,rgba(0,174,199,0.1),transparent_30%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardHeader className="relative p-6 pb-4">
        <CardTitle className="text-xl font-semibold leading-tight text-white transition-colors group-hover:text-[#EFFFFF]">
          {title}
        </CardTitle>
        <CardDescription className="font-semibold text-[#FFF32A]">{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative p-6 pt-0">
        <p className="text-sm leading-relaxed text-gray-300">{details}</p>
        <div className="mt-5 inline-flex items-center text-sm font-semibold text-[#67e8f9]">
          <span>{trackLabel}</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  )
}
