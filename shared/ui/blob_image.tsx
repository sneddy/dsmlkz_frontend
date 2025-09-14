"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface BlobImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  fallbackSrc?: string
}

export function BlobImage({ src, alt, width, height, className, fallbackSrc = "/placeholder.svg" }: BlobImageProps) {
  const [error, setError] = useState(false)

  return (
    <div className="bg-gray-800/30 rounded-lg overflow-hidden flex items-center justify-center">
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        width={width}
        height={height}
        className={cn("object-scale-down", className)}
        onError={() => setError(true)}
      />
    </div>
  )
}
