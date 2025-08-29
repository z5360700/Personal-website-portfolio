"use client"

import { useRef } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"

const technologies = [
  { name: "C++", icon: "/images/solidworks-logo.png" },
  { name: "Python", icon: "/images/matlab-logo.png" },
  { name: "MATLAB", icon: "/images/matlab-logo.png" },
  { name: "Arduino", icon: "/images/solidworks-logo.png" },
  { name: "Fusion360", icon: "/images/fusion360-logo.png" },
  { name: "SolidWorks", icon: "/images/solidworks-logo.png" },
  { name: "3D Printing", icon: "/images/bambu-lab-logo.png" },
  { name: "ESP32", icon: "/images/solidworks-logo.png" },
]

export default function Technologies() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="technologies" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technologies</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>

        <div ref={ref} className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center gap-3 p-4 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative w-12 h-12">
                <Image src={tech.icon || "/placeholder.svg"} alt={tech.name} fill className="object-contain" />
              </div>
              <span className="text-sm font-medium text-center">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
