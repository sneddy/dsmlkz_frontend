"use client"

import { useState } from "react"
import { motion, useInView } from "framer-motion"
import { BlobImage } from "@/shared/ui/blob_image"

interface InterviewCardProps {
  imageUrl: string
  index: number
  total: number
  isLast?: boolean
}

export function InterviewCard({ imageUrl, index, total, isLast = false }: InterviewCardProps) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  const [imageLoaded, setImageLoaded] = useState(false)

  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
  }

  const zIndex = total - index

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`relative mb-8 ${isLast ? "" : "mb-16"}`}
      style={{ zIndex }}
    >
      <div className="bg-background rounded-lg overflow-hidden shadow-lg" style={gradientBorderStyle}>
        <div className="p-4">
          <BlobImage
            src={imageUrl}
            alt={`Интервью, часть ${index + 1}`}
            width={1200}
            height={800}
            className={`w-full h-auto rounded-md transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            fallbackSrc="/placeholder.svg?height=800&width=1200"
            onLoad={() => setImageLoaded(true)}
          />

          {!imageLoaded && <div className="w-full h-64 bg-gray-800 animate-pulse rounded-md"></div>}
        </div>
      </div>

      <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-gray-800 rounded-full h-1 w-24">
          <div
            className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] h-1 rounded-full"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  )
}
