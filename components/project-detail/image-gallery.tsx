"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ImageGalleryProps {
  title: string
  images: string[]
  selectedIndex?: number
  onImageClick: (images: string[], index: number, altPrefix: string) => void
  onNavigate?: (direction: "prev" | "next") => void
  altPrefix: string
  columns?: string
  imageHeight?: string
  showNavigation?: boolean
  maxImages?: number
  showViewAll?: boolean
}

export function ImageGallery({
  title,
  images,
  selectedIndex = 0,
  onImageClick,
  onNavigate,
  altPrefix,
  columns = "grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  imageHeight = "h-32",
  showNavigation = false,
  maxImages,
  showViewAll = false,
}: ImageGalleryProps) {
  const displayImages = maxImages ? images.slice(0, maxImages) : images

  return (
    <div className="bg-muted/10 rounded-lg p-6 border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-center w-full">{title}</h2>
      </div>
      {/* </CHANGE> */}
      <div className={`grid ${columns} gap-3`}>
        {displayImages.map((image, index) => (
          <div
            key={index}
            className={`relative ${imageHeight} rounded-lg overflow-hidden cursor-pointer group ${
              index === selectedIndex && showNavigation ? "ring-4 ring-primary" : ""
            }`}
            onClick={() => onImageClick(images, index, altPrefix)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${altPrefix} ${index + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>
      {showViewAll && maxImages && images.length > maxImages && (
        <div className="text-center mt-4">
          <Button variant="outline" onClick={() => onImageClick(images, 0, altPrefix)}>
            View All {images.length} Photos
          </Button>
        </div>
      )}
    </div>
  )
}
