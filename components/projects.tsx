"use client"

import type React from "react"

import { useRef } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Github, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const projects = [
  {
    id: 1,
    title: "Residential Construction & Renovation",
    description:
      "Full residential build completed alongside engineering degree. Structural framing, roofing, plumbing, and electrical from foundation to finish. Managing real deadlines, tradespeople, and physical work while keeping up with coursework built resilience no classroom could.",
    image: "/images/construction-after.jpg",
    tags: ["Construction Management", "Structural", "Electrical", "Plumbing"],
    githubUrl: "#",
  },
  {
    id: 2,
    title: "Micromouse Maze Navigation Robot",
    description:
      "Autonomous maze-solving robot built from scratch. Integrated LiDAR, IMU, and wheel encoders with path planning algorithm for real-time decision making. Top-3 competition finish.",
    image: "/images/micromouse-robot.jpeg",
    tags: ["C/C++", "LiDAR", "IMU", "Path Planning", "Embedded Systems"],
    githubUrl: "https://github.com/z5360700/micromouse-from2024",
  },
  {
    id: 3,
    title: "Custom Cooling Funnels for PC Hardware",
    description:
      "Designed and 3D-printed ducted airflow funnels for GPU cooling, inspired by automotive cooling systems. Achieved 7°C reduction in GPU temperatures under load.",
    image: "/images/pc-cooling-installed.jpeg",
    tags: ["Fusion 360", "3D Printing", "PLA", "Thermal Engineering"],
    githubUrl: "#",
  },
  {
    id: 4,
    title: "UR5e Robotic Writing System",
    description:
      "MATLAB program using RTDE interface to command UR5e industrial robot arm to trace digits and execute mathematical operations. Implemented coordinate frame transformations with consistent positional accuracy.",
    image: "/images/ur5e-main-setup.jpeg",
    tags: ["MATLAB", "RTDE", "UR5e", "Robotics", "Coordinate Transforms"],
    githubUrl: "#",
  },
  {
    id: 5,
    title: "Cat Door Monitoring System",
    description:
      "IoT system built around ESP32 and break-beam sensors to detect and log cat movement through pet door. Sends real-time Telegram push notifications with complete end-to-end embedded + cloud pipeline.",
    image: "/images/cat-door-v2-system.png",
    tags: ["ESP32", "IoT", "Embedded C", "Telegram API", "Sensors"],
    githubUrl: "#",
  },
  {
    id: 6,
    title: "Custom Watch Build",
    description:
      "Sourced and hand-assembled individual components around Seiko NH35 movement. Precision assembly requiring dust-free environment, component compatibility verification, and steady hands for hand-setting.",
    image: "/images/WatchCoverImage.png",
    tags: ["Horology", "Precision Assembly", "Mechanical Engineering", "Component Sourcing"],
    githubUrl: "#",
  },
]

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const router = useRouter()

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`)
  }

  const handleGithubClick = (e: React.MouseEvent, githubUrl: string) => {
    e.stopPropagation()
    window.open(githubUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Projects</h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
          <p className="max-w-lg mx-auto text-foreground/70 text-sm md:text-base">
            A selection of engineering and hands-on projects I've built.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card
                className="overflow-hidden h-full flex flex-col hover-lift cursor-pointer group"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="relative h-48 md:h-52 w-full overflow-hidden bg-muted">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="flex flex-col flex-grow p-4">
                  <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-foreground/60 mb-3 flex-grow text-sm leading-relaxed line-clamp-3">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.id === 1 || project.id === 3 || project.id === 4 || project.id === 6 ? (
                      // For construction, PC cooling, and UR5e projects, don't show GitHub button
                      <div className="ml-auto bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors duration-300 flex items-center gap-1 font-medium text-sm">
                        View Details
                        <ArrowRight size={14} />
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 bg-transparent text-xs px-2 py-1"
                          onClick={(e) => handleGithubClick(e, project.githubUrl)}
                        >
                          <Github size={14} />
                          Code
                        </Button>
                        <div className="ml-auto bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors duration-300 flex items-center gap-1 font-medium text-sm">
                          View Details
                          <ArrowRight size={14} />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
