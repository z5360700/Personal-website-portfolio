import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Project Details - Michael Lo Russo",
  description: "Detailed view of engineering projects by Michael Lo Russo",
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
