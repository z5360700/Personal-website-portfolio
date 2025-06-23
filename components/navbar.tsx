"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
// Import the MoonIcon and SunIcon from lucide-react
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"

// Update the Navbar component to include the theme toggle
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault()
    setIsOpen(false) // Close mobile menu

    // ALWAYS navigate to home page with hash - regardless of current page
    router.push(`/#${sectionId}`)
  }

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Projects", id: "projects" },
    { name: "Skills", id: "skills" },
    { name: "Contact", id: "contact" },
  ]

  // Direct link to the PDF file in the public folder
  const resumeUrl = "/Michael_LoRusso_CV.pdf"

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-gray-300 dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700"
          : "bg-gray-200 dark:bg-gray-800 shadow-sm",
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Portfolio
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={(e) => handleNavClick(link.id, e)}
              className="text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
            >
              {link.name}
            </button>
          ))}

          {/* Theme toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="default" asChild>
            <a href={resumeUrl} download="Michael_Lo_Russo_Resume.pdf">
              Resume
            </a>
          </Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {/* Theme toggle button for mobile */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-6 h-6 flex flex-col justify-center items-center"
          >
            <span
              className={cn(
                "block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out",
                isOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5",
              )}
            />
            <span
              className={cn(
                "block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out",
                isOpen ? "opacity-0" : "opacity-100",
              )}
            />
            <span
              className={cn(
                "block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out",
                isOpen ? "-rotate-45 -translate-y-0.5" : "translate-y-1.5",
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "md:hidden bg-gray-300 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {navLinks.map((link, index) => (
            <button
              key={link.name}
              onClick={(e) => handleNavClick(link.id, e)}
              className={cn(
                "text-foreground/80 hover:text-foreground py-2 transition-all duration-200 transform text-left",
                isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                `transition-delay-[${index * 50}ms]`,
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.name}
            </button>
          ))}
          <Button
            variant="default"
            className={cn(
              "w-full transition-all duration-200 transform",
              isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              "transition-delay-[250ms]",
            )}
            style={{ transitionDelay: "250ms" }}
            asChild
          >
            <a href={resumeUrl} download="Michael_Lo_Russo_Resume.pdf">
              Resume
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
