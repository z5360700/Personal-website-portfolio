"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Github, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const projects = [
  {
    id: 1,
    title: "Residential Construction & Renovation",
    description:
      "Complete residential building renovation from foundation to finish, including structural framing, roofing, plumbing, and electrical work.",
    image: "/images/construction-after.jpg",
    tags: ["Construction", "Renovation", "Project Management", "Building Codes"],
    githubUrl: "#",
    date: "May 2024 - February 2025",
  },
  {
    id: 2,
    title: "Micromouse Maze Navigation Robot",
    description:
      "Autonomous robot designed to navigate through complex mazes using LiDAR, IMU, and wheel encoders with path planning algorithms and computer vision.",
    image: "/images/micromouse-robot.jpeg",
    tags: ["C++", "Python", "Arduino", "Computer Vision", "Robotics", "OpenCV"],
    githubUrl: "#",
    date: "May 2024 - August 2024",
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description:
      "Work in progress - An interactive weather dashboard that displays current and forecasted weather data for any location.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["React", "Redux", "Weather API", "Chart.js"],
    githubUrl: "#",
  },
  {
    id: 4,
    title: "Custom Cooling Funnels for PC Hardware",
    description:
      "Designed and 3D-printed cooling funnels using ABS material to direct airflow for CPU and GPU components, inspired by automotive ducted cooling systems.",
    image: "/images/pc-cooling-installed.jpeg",
    tags: ["3D Printing", "Fusion360", "ABS Material", "Thermal Management", "CAD Design"],
    githubUrl: "#",
    date: "August 2024 - January 2025",
  },
]

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
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
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-300"
                  />
                  {project.date && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {project.date}
                    </div>
                  )}
                </div>
                <CardContent className="flex flex-col flex-grow p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-foreground/70 mb-4 flex-grow">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="bg-muted text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-auto">
                    {project.id === 1 ? (
                      // For construction project, don't show GitHub button
                      <Button variant="ghost" size="sm" asChild className="ml-auto hover:bg-muted/80">
                        <Link href={`/projects/${project.id}`} className="flex items-center gap-1">
                          Details
                          <ArrowRight size={14} />
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Github size={16} />
                            Code
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" asChild className="ml-auto hover:bg-muted/80">
                          <Link href={`/projects/${project.id}`} className="flex items-center gap-1">
                            Details
                            <ArrowRight size={14} />
                          </Link>
                        </Button>
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
