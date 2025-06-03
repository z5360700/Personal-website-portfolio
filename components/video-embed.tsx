"use client"

import { useState, useEffect } from "react"

interface VideoEmbedProps {
  videoId: string
  title?: string
  isShort?: boolean
}

export default function VideoEmbed({ videoId, title = "YouTube video", isShort = false }: VideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div
        className="relative w-full bg-muted/50 flex items-center justify-center rounded-lg"
        style={{ aspectRatio: isShort ? "9/16" : "16/9" }}
      >
        <div className="animate-pulse text-center">
          <p className="text-foreground/70">Loading video...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div
        className="relative w-full bg-muted/50 flex items-center justify-center rounded-lg"
        style={{ aspectRatio: isShort ? "9/16" : "16/9" }}
      >
        <div className="text-center">
          <p className="text-destructive">Failed to load video</p>
          <a
            href={`https://www.youtube.com/${isShort ? "shorts/" : "watch?v="}${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline mt-2 inline-block"
          >
            Watch on YouTube
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full rounded-lg overflow-hidden ${isShort ? "max-w-sm mx-auto" : ""}`}>
      <div style={{ aspectRatio: isShort ? "9/16" : "16/9" }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}${isShort ? "?playsinline=1" : ""}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          onError={() => setHasError(true)}
        />
      </div>
    </div>
  )
}
