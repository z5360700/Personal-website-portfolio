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
      "Complete residential building renovation from foundation to finish, including structural framing, roofing, plumbing, and electrical work.",
    image: "/images/construction-after.jpg",
    tags: ["Construction", "Renovation", "Project Management", "Building Codes"],
    githubUrl: "#",
  },
  {
    id: 2,
    title: "Micromouse Maze Navigation Robot",
    description:
      "Autonomous robot designed to navigate through complex mazes using LiDAR, IMU, and wheel encoders with path planning algorithms and computer vision.",
    image: "/images/micromouse-robot.jpeg",
    tags: ["C++", "Python", "Arduino", "Computer Vision", "Robotics", "OpenCV"],
    githubUrl: "https://github.com/z5360700/micromouse-from2024",
  },
  {
    id: 3,
    title: "Custom Cooling Funnels for PC Hardware",
    description:
      "Designed and 3D-printed cooling funnels using PLA material to direct airflow for GPU components, inspired by automotive ducted cooling systems.",
    image: "/images/pc-cooling-installed.jpeg",
    tags: ["3D Printing", "Fusion360", "PLA Material", "Thermal Management", "CAD Design"],
    githubUrl: "#",
  },
  {
    id: 4,
    title: "Cat Door Monitoring System",
    description:
      "IoT monitoring system using ESP32 and break beam sensors to track cat movement through a pet door, with real-time Telegram notifications to prevent unauthorized access.",
    image: "/images/cat-door-v2-system.png",
    tags: ["ESP32", "IoT", "Arduino", "3D Printing", "Telegram Bot", "Break Beam Sensors"],
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
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4 max-w-full overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-foreground/80">
            Here are some of my recent projects. Each project showcases different aspects of my engineering and
            technical skills.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card
                className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="relative h-[32rem] w-full overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                </div>
                <CardContent className="flex flex-col flex-grow p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-foreground/70 mb-4 flex-grow">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="bg-muted text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-auto">
                    {project.id === 1 || project.id === 3 ? (
                      // For construction project and PC cooling project, don't show GitHub button
                      <div className="ml-auto bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors duration-300 flex items-center gap-2 font-medium">
                        View Details
                        <ArrowRight size={16} />
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={(e) => handleGithubClick(e, project.githubUrl)}
                        >
                          <Github size={16} />
                          Code
                        </Button>
                        <div className="ml-auto bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors duration-300 flex items-center gap-2 font-medium">
                          View Details
                          <ArrowRight size={16} />
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
