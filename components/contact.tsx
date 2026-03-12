"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Mail, MapPin, Linkedin } from "lucide-react"

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="contact" className="py-16">
      <div className="container mx-auto px-6">
        <div ref={ref} className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="border rounded-xl p-8 bg-muted/20"
          >
            <p className="text-xs text-foreground/40 mb-5 italic">
              This website took way too long to make.
            </p>

            <h2 className="text-xl font-bold mb-6">{"Let's connect"}</h2>

            <div className="space-y-4">
              <a
                href="mailto:lorussom28@gmail.com"
                className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <span className="text-sm">lorussom28@gmail.com</span>
              </a>

              <div className="flex items-center gap-3 text-foreground/60">
                <MapPin className="w-4 h-4 shrink-0 text-primary" />
                <span className="text-sm">Sydney, Australia</span>
              </div>

              <a
                href="https://www.linkedin.com/in/michael-lo-russo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4 shrink-0 text-primary" />
                <span className="text-sm">LinkedIn</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
