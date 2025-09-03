"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Wrench, Cpu, Palette } from "lucide-react"

const skillCategories = [
  {
    title: "Programming",
    icon: <Code className="w-6 h-6" />,
    skills: ["C++", "Python", "MATLAB", "JavaScript", "TypeScript"],
    color: "text-blue-500",
  },
  {
    title: "Engineering Tools",
    icon: <Wrench className="w-6 h-6" />,
    skills: ["SolidWorks", "Fusion 360", "AutoCAD", "3D Printing", "CNC"],
    color: "text-green-500",
  },
  {
    title: "Electronics",
    icon: <Cpu className="w-6 h-6" />,
    skills: ["Arduino", "Raspberry Pi", "PCB Design", "Sensors", "IoT"],
    color: "text-purple-500",
  },
  {
    title: "Design",
    icon: <Palette className="w-6 h-6" />,
    skills: ["UI/UX", "Figma", "Adobe Creative Suite", "Prototyping"],
    color: "text-orange-500",
  },
]

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Technologies</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-foreground/80">
            A comprehensive overview of my technical skills and the tools I use to bring ideas to life.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`${category.color} mb-4`}>{category.icon}</div>
                  <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                  <div className="space-y-2">
                    {category.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="mr-2 mb-2">
                        {skill}
                      </Badge>
                    ))}
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
