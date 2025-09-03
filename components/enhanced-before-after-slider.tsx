"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface EnhancedBeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeAlt: string
  afterAlt: string
  className?: string
}

export default function EnhancedBeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  className = "",
}: EnhancedBeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100
      setSliderPosition(Math.max(0, Math.min(100, percentage)))
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-lg cursor-col-resize select-none ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Before Image */}
      <div className="absolute inset-0">
        <Image src={beforeImage || "/placeholder.svg"} alt={beforeAlt} fill className="object-cover" priority />
      </div>

      {/* After Image */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        animate={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Image src={afterImage || "/placeholder.svg"} alt={afterAlt} fill className="object-cover" />
      </motion.div>

      {/* Slider Line */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
        style={{ left: `${sliderPosition}%` }}
        animate={{ left: `${sliderPosition}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div className="flex space-x-1">
            <div className="w-1 h-4 bg-gray-400 rounded"></div>
            <div className="w-1 h-4 bg-gray-400 rounded"></div>
          </div>
        </div>
      </motion.div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
        After
      </div>
    </div>
  )
}
