"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function WavyLines() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full text-slate-600/25 dark:text-slate-300/30"
        viewBox="0 0 1400 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.path
            key={i}
            d={`M${-400 + i * 30},${800 + i * 20} C${200 + i * 25},${600 - i * 15} ${400 + i * 20},${700 - i * 25} ${600 + i * 30},${500 - i * 20} C${800 + i * 25},${300 - i * 30} ${1000 + i * 20},${400 - i * 15} ${1200 + i * 35},${200 - i * 25} C${1400 + i * 30},${100 - i * 20} ${1500 + i * 25},${50 - i * 10} ${1600 + i * 40},${-50 - i * 15}`}
            stroke="currentColor"
            strokeWidth={3 - i * 0.08}
            fill="transparent"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.1 }}
            animate={{
              pathLength: 1,
              opacity: 0.6 - i * 0.02,
              pathOffset: [0, i % 2 === 0 ? 0.3 : -0.3],
            }}
            transition={{
              duration: 15 + i * 0.8,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: i * 0.05,
            }}
          />
        ))}

        {/* Additional diagonal lines for more coverage */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.path
            key={`diagonal-${i}`}
            d={`M${-300 - i * 40},${900 - i * 30} C${300 - i * 20},${700 + i * 20} ${500 - i * 30},${500 + i * 25} ${700 - i * 25},${300 + i * 15} C${900 - i * 35},${100 + i * 30} ${1100 - i * 20},${200 + i * 10} ${1300 - i * 45},${-100 + i * 25}`}
            stroke="currentColor"
            strokeWidth={2.5 - i * 0.1}
            fill="transparent"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.05 }}
            animate={{
              pathLength: 1,
              opacity: 0.4 - i * 0.025,
              pathOffset: [0, i % 2 === 0 ? -0.2 : 0.2],
            }}
            transition={{
              duration: 20 + i * 1.2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: i * 0.08,
            }}
          />
        ))}
      </svg>
    </div>
  )
}
