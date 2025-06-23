"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeImage, setActiveImage] = useState<"personal" | "samsung" | "store">("personal")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const images = ["personal", "samsung", "store"] as const
  const currentIndex = images.indexOf(activeImage)

  const handleImageChange = useCallback(
    (newImage: "personal" | "samsung" | "store") => {
      if (isTransitioning || newImage === activeImage) return

      setIsTransitioning(true)
      setActiveImage(newImage)

      // Reset transition lock after animation completes
      setTimeout(() => {
        setIsTransitioning(false)
      }, 500) // Slightly longer than the 0.4s animation
    },
    [activeImage, isTransitioning],
  )

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (isTransitioning) return

      const newIndex =
        direction === "left" ? (currentIndex + 1) % images.length : (currentIndex - 1 + images.length) % images.length

      handleImageChange(images[newIndex])
    },
    [currentIndex, handleImageChange, isTransitioning],
  )

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-lg mx-auto lg:mx-0 mt-8 mb-8 lg:mb-0"
          >
            {/* Card deck container */}
            <motion.div
              className="relative w-full h-[400px] sm:h-96 md:h-[450px] lg:h-[500px]"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const threshold = 50
                if (info.offset.x > threshold) {
                  handleSwipe("right")
                } else if (info.offset.x < -threshold) {
                  handleSwipe("left")
                }
              }}
            >
              {/* Personal photo card */}
              <motion.div
                className="absolute inset-0 cursor-pointer"
                style={{
                  zIndex: activeImage === "personal" ? 30 : activeImage === "samsung" ? 15 : 10,
                }}
                animate={{
                  x: activeImage === "personal" ? 0 : activeImage === "samsung" ? -50 : -100,
                  y: activeImage === "personal" ? 0 : activeImage === "samsung" ? -20 : -40,
                  rotate: activeImage === "personal" ? 0 : activeImage === "samsung" ? -4 : -8,
                  scale: activeImage === "personal" ? 1 : 0.95,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onMouseEnter={() => handleImageChange("personal")}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg border-4 border-white shadow-xl">
                  <Image
                    src="/images/about-michael.jpeg"
                    alt="Michael Lo Russo in a restaurant setting"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </motion.div>

              {/* Samsung office photo card */}
              <motion.div
                className="absolute inset-0 cursor-pointer"
                style={{
                  zIndex:
                    activeImage === "samsung"
                      ? 30
                      : activeImage === "personal"
                        ? 25
                        : activeImage === "store"
                          ? 15
                          : 20,
                }}
                animate={{
                  x: activeImage === "samsung" ? 0 : activeImage === "personal" ? 50 : -50,
                  y: activeImage === "samsung" ? 0 : activeImage === "personal" ? 20 : -20,
                  rotate: activeImage === "samsung" ? 0 : activeImage === "personal" ? 4 : -4,
                  scale: activeImage === "samsung" ? 1 : 0.95,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onMouseEnter={() => handleImageChange("samsung")}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg border-4 border-white shadow-xl">
                  <Image
                    src="/images/michael-samsung.png"
                    alt="Michael Lo Russo at Samsung Office"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </motion.div>

              {/* Samsung Store photo card */}
              <motion.div
                className="absolute inset-0 cursor-pointer"
                style={{
                  zIndex: activeImage === "store" ? 30 : activeImage === "samsung" ? 25 : 10,
                }}
                animate={{
                  x: activeImage === "store" ? 0 : activeImage === "samsung" ? 50 : 80,
                  y: activeImage === "store" ? 0 : activeImage === "samsung" ? 20 : 35,
                  rotate: activeImage === "store" ? 0 : activeImage === "samsung" ? 4 : 6,
                  scale: activeImage === "store" ? 1 : 0.95,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onMouseEnter={() => handleImageChange("store")}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg border-4 border-white shadow-xl">
                  <Image
                    src="/images/michael-samsung-store.jpeg"
                    alt="Michael Lo Russo at Samsung Store"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Instructions - responsive text */}
            <div className="absolute -bottom-12 sm:-bottom-14 lg:-bottom-16 left-0 right-0 text-center text-foreground/60 text-sm">
              <span className="hidden md:inline">Hover over photos to bring them forward</span>
              <span className="md:hidden">Swipe left or right to browse photos</span>
            </div>

            {/* Mobile navigation dots */}
            <div className="flex justify-center gap-2 mt-4 md:hidden">
              {images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => handleImageChange(image)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    activeImage === image ? "bg-primary" : "bg-primary/30"
                  }`}
                  aria-label={`View ${image} photo`}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-4">Who I Am</h3>
            <p className="text-foreground/80 leading-relaxed">
              I&apos;m a mechatronics engineering student who thrives on solving problems and watching my ideas come to
              life. One of my proudest achievements was building a house with my family. It taught me that with the
              right mindset, I can tackle any challenge. Before engineering, I also played semi-professional football,
              which instilled in me discipline, teamwork, and resilience.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              I&apos;m fascinated by microcontrollers and creating mini IoT systems, projects I have plenty planned for
              the future. I&apos;m also grateful for my part-time role at Samsung, where I&apos;m continually improving
              my communication and presentation skills. The confidence I gained from building that house pushes me every
              day to dive into new technical challenges, and the experience at Samsung reinforces my ability to explain
              ideas clearly and work effectively in a team.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              When I&apos;m not messing around with electronics, you&apos;ll find me at the gym or playing Marvel
              Rivals. My next big goal is to step into an engineering role where I can collaborate with others, keep
              learning, and build solutions that genuinely help people. I can&apos;t wait to see where this journey
              takes me and to keep growing both personally and professionally.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {/* C++ Logo */}
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-background rounded-lg p-3 shadow-sm flex items-center justify-center w-16 h-16 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                title="C++"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#00599C">
                  <path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.109c-3.92 0-7.109-3.189-7.109-7.109S8.08 4.891 12 4.891a7.133 7.133 0 016.156 3.552l-3.076 1.781A3.567 3.567 0 0012 8.445c-1.96 0-3.554 1.595-3.554 3.555S10.04 15.555 12 15.555a3.57 3.57 0 003.08-1.778l3.077 1.80A7.135 7.135 0 0112 19.109zm7.109-6.714h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79v.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79v.79z" />
                </svg>
              </motion.div>

              {/* MATLAB Logo */}
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-background rounded-lg p-2 shadow-sm flex items-center justify-center w-16 h-16 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                title="MATLAB"
              >
                <Image src="/images/matlab-logo.png" alt="MATLAB" width={40} height={40} className="object-contain" />
              </motion.div>

              {/* SolidWorks Logo */}
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-background rounded-lg p-2 shadow-sm flex items-center justify-center w-16 h-16 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                title="SolidWorks"
              >
                <Image
                  src="/images/solidworks-logo.png"
                  alt="SolidWorks"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </motion.div>

              {/* Fusion 360 Logo */}
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-background rounded-lg p-2 shadow-sm flex items-center justify-center w-16 h-16 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                title="Fusion 360"
              >
                <Image
                  src="/images/fusion360-logo.png"
                  alt="Fusion 360"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </motion.div>

              {/* Bambu Lab Logo */}
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-background rounded-lg p-2 shadow-sm flex items-center justify-center w-16 h-16 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                title="Bambu Lab"
              >
                <Image
                  src="/images/bambu-lab-logo.png"
                  alt="Bambu Lab"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </motion.div>

              {/* VS Code Logo */}
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-background rounded-lg p-3 shadow-sm flex items-center justify-center w-16 h-16 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                title="Visual Studio Code"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#007ACC">
                  <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
                </svg>
              </motion.div>

              {/* Power Drill Icon */}
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-background rounded-lg p-2 shadow-sm flex items-center justify-center w-16 h-16 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                title="Power Tools"
              >
                <Image
                  src="/images/drill-logo.png"
                  alt="Power Drill"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </motion.div>

              {/* Hammer Icon */}
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-background rounded-lg p-2 shadow-sm flex items-center justify-center w-16 h-16 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                title="Hand Tools"
              >
                <Image src="/images/hammer-logo.png" alt="Hammer" width={40} height={40} className="object-contain" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
