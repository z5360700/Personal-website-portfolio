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
        className="absolute bottom-0 left-0 w-full h-[70%] text-slate-600/30 dark:text-slate-300/40"
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.path
            key={i}
            d={`M-100,${400 + i * 15} C150,${380 + i * 10} 350,${
              420 + i * 12
            } 500,${400 + i * 15} C650,${380 + i * 18} 750,${
              450 + i * 8
            } 900,${420 + i * 10} C1050,${390 + i * 12} 1150,${440 + i * 5} 1300,${410 + i * 15}`}
            stroke="currentColor"
            strokeWidth={2 - i * 0.05}
            fill="transparent"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{
              pathLength: 1,
              opacity: 0.8 - i * 0.03,
              pathOffset: [0, i % 2 === 0 ? 0.2 : -0.2],
            }}
            transition={{
              duration: 10 + i * 0.5,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>
    </div>
  )
}
