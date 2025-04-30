"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ImageCarouselProps {
  images: {
    src: string
    alt: string
    caption?: string
  }[]
  borderStyle?: React.CSSProperties
}

export function ImageCarousel({ images, borderStyle }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const length = images.length

  const next = () => {
    setCurrent((current + 1) % length)
  }

  const prev = () => {
    setCurrent((current - 1 + length) % length)
  }

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({
      ...prev,
      [index]: true,
    }))
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-lg" style={borderStyle}>
        <div className="flex justify-center items-center min-h-[500px] bg-black/5 p-4">
          <div className="relative w-full">
            <Image
              src={imageErrors[current] ? "/placeholder.svg?height=800&width=1200" : images[current].src}
              alt={images[current].alt}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              unoptimized
              onError={() => handleImageError(current)}
            />
            {images[current].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
                {images[current].caption}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm text-white border-[#00AEC7]"
          onClick={prev}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Предыдущий слайд</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm text-white border-[#00AEC7]"
          onClick={next}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Следующий слайд</span>
        </Button>
      </div>

      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <Button
              key={i}
              variant="outline"
              size="icon"
              className={`h-2 w-2 rounded-full ${
                i === current ? "bg-gradient-to-r from-[#FFF32A] to-[#00AEC7]" : "bg-gray-500/50"
              }`}
              onClick={() => setCurrent(i)}
            >
              <span className="sr-only">Перейти �� слайду {i + 1}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
        {current + 1} / {length}
      </div>
    </div>
  )
}
