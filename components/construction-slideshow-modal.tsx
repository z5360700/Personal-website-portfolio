"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConstructionSlideshowModalProps {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  altPrefix?: string
}

export default function ConstructionSlideshowModal({
  images,
  initialIndex,
  isOpen,
  onClose,
  altPrefix = "Image",
}: ConstructionSlideshowModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Sync when opened to a new image
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex, isOpen])

  const prevIndex = (currentIndex - 1 + images.length) % images.length
  const nextIndex = (currentIndex + 1) % images.length
  const hasSiblings = images.length > 1

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length)
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      else if (e.key === "ArrowLeft") goPrev()
      else if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
            {currentIndex + 1} / {images.length}
          </div>

          <motion.div
            className="flex items-center justify-center w-full h-full px-16"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous image — left side, dimmed */}
            {hasSiblings && (
              <div
                className="hidden md:flex items-center justify-center w-48 lg:w-64 flex-shrink-0 mr-4 lg:mr-6 cursor-pointer"
                onClick={goPrev}
              >
                <div className="relative w-full h-40 lg:h-48 rounded-lg overflow-hidden opacity-40 hover:opacity-60 transition-opacity">
                  <Image
                    src={images[prevIndex] || "/placeholder.svg"}
                    alt={`${altPrefix} ${prevIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                </div>
              </div>
            )}

            {/* Current image — centre, full size */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative flex-1 max-w-3xl flex items-center justify-center"
              >
                <div className="relative w-full" style={{ maxHeight: "80vh" }}>
                  <Image
                    src={images[currentIndex] || "/placeholder.svg"}
                    alt={`${altPrefix} ${currentIndex + 1}`}
                    width={1200}
                    height={900}
                    className="object-contain max-h-[80vh] w-auto mx-auto rounded-lg"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Next image — right side, dimmed */}
            {hasSiblings && (
              <div
                className="hidden md:flex items-center justify-center w-48 lg:w-64 flex-shrink-0 ml-4 lg:ml-6 cursor-pointer"
                onClick={goNext}
              >
                <div className="relative w-full h-40 lg:h-48 rounded-lg overflow-hidden opacity-40 hover:opacity-60 transition-opacity">
                  <Image
                    src={images[nextIndex] || "/placeholder.svg"}
                    alt={`${altPrefix} ${nextIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Left arrow */}
          {hasSiblings && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); goPrev() }}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}

          {/* Right arrow */}
          {hasSiblings && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); goNext() }}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
