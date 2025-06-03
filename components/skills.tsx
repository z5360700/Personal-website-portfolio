"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Code2, Database, Layout, Palette, Server, Terminal, Smartphone, Figma } from "lucide-react"

const skills = [
  {
    category: "Frontend",
    icon: <Layout className="w-6 h-6" />,
    items: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Vue.js"],
  },
  {
    category: "Styling",
    icon: <Palette className="w-6 h-6" />,
    items: ["Tailwind CSS", "Styled Components", "SASS/SCSS", "CSS Modules", "Material UI"],
  },
  {
    category: "Backend",
    icon: <Server className="w-6 h-6" />,
    items: ["Node.js", "Express", "Python", "Django", "PHP", "Laravel"],
  },
  {
    category: "Database",
    icon: <Database className="w-6 h-6" />,
    items: ["MongoDB", "PostgreSQL", "MySQL", "Firebase", "Supabase", "Redis"],
  },
  {
    category: "DevOps",
    icon: <Terminal className="w-6 h-6" />,
    items: ["Git", "GitHub Actions", "Docker", "AWS", "Vercel", "Netlify"],
  },
  {
    category: "Mobile",
    icon: <Smartphone className="w-6 h-6" />,
    items: ["React Native", "Flutter", "Progressive Web Apps", "Responsive Design"],
  },
  {
    category: "UI/UX",
    icon: <Figma className="w-6 h-6" />,
    items: ["Figma", "Adobe XD", "Sketch", "User Research", "Wireframing", "Prototyping"],
  },
  {
    category: "Other",
    icon: <Code2 className="w-6 h-6" />,
    items: ["RESTful APIs", "GraphQL", "WebSockets", "Testing", "Agile/Scrum", "CI/CD"],
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
            Here are the technologies and tools I work with to bring ideas to life.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">{skill.icon}</div>
                <h3 className="text-lg font-bold">{skill.category}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span key={item} className="bg-muted px-3 py-1 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
