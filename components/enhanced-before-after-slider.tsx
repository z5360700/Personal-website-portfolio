"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface EnhancedBeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeAlt?: string
  afterAlt?: string
  className?: string
  title?: string
  description?: string
}

export default function EnhancedBeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  className,
  title = "Complete Transformation",
  description = "Use the slider below to see the dramatic transformation from the deteriorated starting condition to the fully renovated modern home.",
}: EnhancedBeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      updateSliderPosition(e.clientX)
    },
    [updateSliderPosition],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      updateSliderPosition(e.clientX)
    },
    [isDragging, updateSliderPosition],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true)
      updateSliderPosition(e.touches[0].clientX)
    },
    [updateSliderPosition],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      updateSliderPosition(e.touches[0].clientX)
    },
    [isDragging, updateSliderPosition],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  return (
    <div className={cn("w-full", className)}>
      {/* Header Section */}
      <div className="text-center mb-8">
        <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-foreground/70 max-w-4xl mx-auto text-lg leading-relaxed">{description}</p>
      </div>

      {/* Enhanced Slider Container */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
        <div
          ref={containerRef}
          className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] lg:h-[700px] rounded-xl overflow-hidden cursor-col-resize bg-muted/20"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* After Image (Background) */}
          <div className="absolute inset-0">
            <Image
              src={afterImage || "/placeholder.svg"}
              alt={afterAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
            {/* After Label */}
            <div className="absolute top-6 right-6 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
              After
            </div>
          </div>

          {/* Before Image (Clipped) */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            }}
          >
            <Image
              src={beforeImage || "/placeholder.svg"}
              alt={beforeAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
            {/* Before Label */}
            <div className="absolute top-6 left-6 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
              Before
            </div>
          </div>

          {/* Slider Line and Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-10"
            style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
          >
            {/* Slider Handle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl border-4 border-blue-500 flex items-center justify-center cursor-col-resize hover:scale-110 transition-transform duration-200">
              <div className="flex items-center justify-center">
                <div className="w-1 h-6 bg-blue-500 mr-1"></div>
                <div className="w-1 h-6 bg-blue-500"></div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            Drag to compare
          </div>
        </div>
      </div>
    </div>
  )
}
