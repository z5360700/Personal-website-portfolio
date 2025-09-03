"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoEmbedProps {
  videoId: string
  title: string
  thumbnail?: string
  className?: string
}

export default function VideoEmbed({ videoId, title, thumbnail, className = "" }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <div className={`relative w-full aspect-video rounded-lg overflow-hidden ${className}`}>
      {!isPlaying ? (
        <div
          className="relative w-full h-full bg-gray-900 flex items-center justify-center cursor-pointer"
          onClick={handlePlay}
        >
          {thumbnail && (
            <img
              src={thumbnail || "/placeholder.svg"}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Button size="lg" className="rounded-full w-16 h-16 p-0">
              <Play className="w-8 h-8 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      )}
    </div>
  )
}
