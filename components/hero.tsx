"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import WavyLines from "./wavy-lines"

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Direct link to the PDF file in the public folder
  const resumeUrl = "/Michael_LoRusso_CV.pdf"

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-16 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-12 z-10">
        {/* Profile Image - Made smaller */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative w-64 h-64 lg:w-80 lg:h-80">
            <div className="absolute inset-0 border-4 border-primary translate-x-4 translate-y-4 rounded-full"></div>
            <div className="relative w-full h-full overflow-hidden rounded-full border-4 border-white shadow-2xl">
              <Image
                src="/images/michael-profile.jpg"
                alt="Michael Lo Russo"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 256px, 320px"
                quality={85}
              />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="text-lg md:text-xl font-medium">Hi! I&apos;m</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Michael Lo Russo 👋
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-2xl mb-10"
          >
            <p className="text-foreground/70 text-lg">
              I&apos;m an engineering student from Sydney, specialising in Mechatronics, currently in my fourth year at
              the University of New South Wales.
            </p>
          </motion.div>

          {/* Make both buttons the same style */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Button size="lg" className="px-8 py-6 text-lg font-medium" asChild>
                <a href="#projects">View My Work</a>
              </Button>
            </motion.div>

            {/* Download Resume Button - Direct download of PDF file */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Button size="lg" className="px-8 py-6 text-lg font-medium" asChild>
                <a href={resumeUrl} download="Michael_Lo_Russo_Resume.pdf" className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Resume
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#about" className="text-foreground/70 hover:text-foreground transition-colors">
          <ArrowDown size={24} />
        </a>
      </div>

      {/* Wavy lines background */}
      <WavyLines />
    </section>
  )
}
