"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Code2, Hammer, Wrench, Settings, Layers3, CircuitBoard, Building, Cog } from "lucide-react"

const skills = [
  {
    category: "Programming & Software",
    icon: <Code2 className="w-6 h-6" />,
    items: ["C++", "Python", "MATLAB", "Arduino IDE", "OpenCV", "Git", "Visual Studio Code", "Embedded Systems"],
  },
  {
    category: "CAD & 3D Design",
    icon: <Layers3 className="w-6 h-6" />,
    items: ["Fusion360", "SolidWorks", "3D Modeling", "Parametric Design", "Assembly Design", "Technical Drawings"],
  },
  {
    category: "Manufacturing & Fabrication",
    icon: <Settings className="w-6 h-6" />,
    items: ["3D Printing (PLA/ABS)", "Bambu Studio", "Additive Manufacturing", "Prototyping", "Material Selection"],
  },
  {
    category: "Electronics & Robotics",
    icon: <CircuitBoard className="w-6 h-6" />,
    items: ["Arduino", "Microcontrollers", "Sensors (LiDAR, IMU)", "Motor Control", "PCB Integration", "IoT Systems"],
  },
  {
    category: "Construction & Building",
    icon: <Building className="w-6 h-6" />,
    items: [
      "Timber Framing",
      "Electrical Systems",
      "Plumbing",
      "Project Management",
      "Building Codes",
      "Safety Standards",
    ],
  },
  {
    category: "Tools & Equipment",
    icon: <Hammer className="w-6 h-6" />,
    items: ["Power Tools", "Hand Tools", "Measuring Equipment", "Oscilloscope", "Multimeter", "Safety Equipment"],
  },
  {
    category: "Engineering Analysis",
    icon: <Cog className="w-6 h-6" />,
    items: [
      "Thermal Management",
      "Airflow Analysis",
      "PID Control",
      "Sensor Fusion",
      "Path Planning",
      "Computer Vision",
    ],
  },
  {
    category: "Professional Skills",
    icon: <Wrench className="w-6 h-6" />,
    items: [
      "Problem Solving",
      "Project Coordination",
      "Technical Communication",
      "Team Collaboration",
      "Quality Assurance",
    ],
  },
]

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Technologies</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-foreground/80">
            Here are the engineering skills, technologies, and tools I use to bring ideas from concept to reality.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">{skill.icon}</div>
                <h3 className="text-lg font-bold">{skill.category}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="bg-muted px-3 py-1 rounded-full text-sm hover:bg-primary/10 transition-colors duration-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills Highlight */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-background rounded-lg p-8 shadow-sm border">
            <h3 className="text-2xl font-bold mb-6 text-center">Core Competencies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-primary">Engineering & Design</h4>
                <ul className="space-y-2 text-foreground/80">
                  <li>• Mechatronics system integration</li>
                  <li>• Autonomous robotics development</li>
                  <li>• Thermal management solutions</li>
                  <li>• Structural design and analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3 text-primary">Project Experience</h4>
                <ul className="space-y-2 text-foreground/80">
                  <li>• Complete construction renovation</li>
                  <li>• Maze navigation robot development</li>
                  <li>• Custom cooling system design</li>
                  <li>• Multi-trade project coordination</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
