"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Mail, MapPin, Linkedin } from "lucide-react"

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div ref={ref} className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="border rounded-2xl p-10 bg-muted/30"
          >
            <p className="text-sm text-foreground/50 mb-6 italic">
              This website took way too long to make.
            </p>

            <h2 className="text-2xl font-bold mb-8">{"Let's get in touch"}</h2>

            <div className="space-y-5">
              <a
                href="mailto:lorussom28@gmail.com"
                className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors group"
              >
                <Mail className="w-5 h-5 shrink-0 text-primary" />
                <span className="text-sm">lorussom28@gmail.com</span>
              </a>

              <div className="flex items-center gap-4 text-foreground/70">
                <MapPin className="w-5 h-5 shrink-0 text-primary" />
                <span className="text-sm">Sydney, Australia</span>
              </div>

              <a
                href="https://www.linkedin.com/in/michael-lo-russo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors group"
              >
                <Linkedin className="w-5 h-5 shrink-0 text-primary" />
                <span className="text-sm">linkedin.com/in/michael-lo-russo</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
