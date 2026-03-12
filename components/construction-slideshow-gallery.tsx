"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConstructionSlideshowGalleryProps {
  title: string
  images: string[]
  altPrefix: string
}

export function ConstructionSlideshowGallery({
  title,
  images,
  altPrefix,
}: ConstructionSlideshowGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious()
    if (e.key === "ArrowRight") handleNext()
  }

  useEffect(() => {
    if (!isClient) return
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [images.length])

  if (!isClient) return null

  const previousIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
  const previousImage = images[previousIndex]
  const currentImage = images[currentIndex]

  return (
    <div className="bg-muted/10 rounded-lg p-6 border">
      <div className="flex flex-col gap-4">
        {/* Title and Counter */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Image Grid - Previous and Current */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Previous Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            {currentIndex > 0 ? (
              <Image
                src={previousImage}
                alt={`${altPrefix} - previous`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                Start of gallery
              </div>
            )}
          </div>

          {/* Current Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <Image
              src={currentImage}
              alt={`${altPrefix} - current`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            aria-label="Previous image"
            className="gap-2"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            aria-label="Next image"
            className="gap-2"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>

        {/* Keyboard hint */}
        <p className="text-xs text-muted-foreground text-center">Use arrow keys to navigate</p>
      </div>
    </div>
  )
}
