"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function NavigationHandler() {
  const router = useRouter()

  useEffect(() => {
    // Handle hash navigation when the page loads
    const handleHashNavigation = () => {
      const hash = window.location.hash
      if (hash) {
        const sectionId = hash.substring(1) // Remove the #
        const element = document.getElementById(sectionId)
        if (element) {
          // Small delay to ensure page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }, 100)
        }
      }
    }

    // Handle initial load
    handleHashNavigation()

    // Handle browser back/forward navigation
    window.addEventListener("hashchange", handleHashNavigation)

    return () => {
      window.removeEventListener("hashchange", handleHashNavigation)
    }
  }, [])

  return null
}
