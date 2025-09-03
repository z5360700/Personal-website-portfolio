"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function NavigationHandler() {
  const router = useRouter()

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }

    // Handle initial load with hash
    if (window.location.hash) {
      setTimeout(handleHashChange, 100)
    }

    // Handle browser back/forward navigation
    window.addEventListener("hashchange", handleHashChange)
    window.addEventListener("popstate", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
      window.removeEventListener("popstate", handleHashChange)
    }
  }, [router])

  return null
}
