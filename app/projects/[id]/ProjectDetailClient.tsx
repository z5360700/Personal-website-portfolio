"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import ImageLightbox from "@/components/image-lightbox"
import EnhancedBeforeAfterSlider from "@/components/enhanced-before-after-slider"

const projectData = {
  1: {
    title: "Residential Construction & Renovation",
    tagline: "Complete home transformation from foundation to finish",
    description:
      "A comprehensive residential renovation project showcasing structural engineering, project management, and construction expertise. This project involved complete renovation of a residential property including foundation work, framing, roofing, plumbing, electrical systems, and interior finishing.",
    heroImage: "/images/construction-after.jpg",
    beforeAfter: {
      before: "/images/construction-before-new.png",
      after: "/images/construction-after.jpg",
    },
    story: [
      {
        title: "Planning & Design Phase",
        description: "Initial assessment and architectural planning",
        image: "/images/construction-before.jpg",
        details:
          "Conducted thorough structural assessment, obtained necessary permits, and developed comprehensive renovation plans. This phase involved working with architects and engineers to ensure all modifications met local building codes and safety requirements.",
      },
      {
        title: "Foundation & Structural Work",
        description: "Core structural modifications and improvements",
        image: "/images/construction-1.jpg",
        details:
          "Reinforced existing foundation, installed new support beams, and modified load-bearing walls. All work was performed to exceed local building code requirements with proper inspection at each phase.",
      },
      {
        title: "Framing & Roofing",
        description: "New framing installation and roof reconstruction",
        image: "/images/construction-2.jpg",
        details:
          "Installed new wall framing, ceiling joists, and completely rebuilt the roof structure. Used engineered lumber for enhanced strength and durability.",
      },
      {
        title: "Systems Installation",
        description: "Electrical, plumbing, and HVAC systems",
        image: "/images/construction-3.jpg",
        details:
          "Complete rewiring of electrical systems, new plumbing installation, and HVAC system upgrade. All systems designed for energy efficiency and modern safety standards.",
      },
      {
        title: "Interior Finishing",
        description: "Drywall, flooring, and interior details",
        image: "/images/construction-4.jpg",
        details:
          "Professional drywall installation, hardwood flooring, custom cabinetry, and interior painting. Focus on high-quality finishes and attention to detail.",
      },
      {
        title: "Final Completion",
        description: "Project completion and final inspections",
        image: "/images/construction-5.jpg",
        details:
          "Final walkthrough, quality assurance checks, and official inspections. Project completed on time and within budget with all permits properly closed.",
      },
    ],
    gallery: [
      "/images/construction-1.jpg",
      "/images/construction-2.jpg",
      "/images/construction-3.jpg",
      "/images/construction-4.jpg",
      "/images/construction-5.jpg",
      "/images/interior-1.jpg",
      "/images/interior-2.jpg",
      "/images/interior-3.jpg",
      "/images/interior-4.jpg",
      "/images/interior-5.jpg",
      "/images/interior-6.jpg",
      "/images/interior-7.jpg",
      "/images/interior-8.jpg",
      "/images/finished-product-1.jpeg",
      "/images/finished-product-2.jpeg",
      "/images/finished-product-3.jpeg",
      "/images/finished-product-4.jpeg",
      "/images/finished-product-5.jpeg",
      "/images/finished-product-6.jpeg",
      "/images/finished-product-7.jpeg",
      "/images/misc-construction-1.jpeg",
      "/images/misc-construction-2.jpeg",
      "/images/misc-construction-3.jpeg",
      "/images/misc-construction-4.jpeg",
      "/images/misc-construction-5.jpeg",
      "/images/misc-construction-6.jpeg",
      "/images/misc-construction-7.jpeg",
      "/images/misc-construction-8.jpeg",
      "/images/misc-construction-9.jpeg",
      "/images/misc-construction-10.jpeg",
      "/images/misc-construction-11.jpeg",
      "/images/misc-construction-12.jpeg",
      "/images/misc-construction-13.jpeg",
      "/images/misc-construction-14.jpeg",
      "/images/misc-construction-15.jpeg",
      "/images/misc-construction-16.jpeg",
      "/images/misc-construction-17.jpeg",
      "/images/misc-construction-18.jpeg",
      "/images/misc-construction-19.jpeg",
    ],
    techStack: [
      { name: "Project Management", icon: "/images/hammer-logo.png" },
      { name: "Structural Engineering", icon: "/images/drill-logo.png" },
      { name: "Building Codes", icon: "/images/hammer-logo.png" },
      { name: "Construction Management", icon: "/images/drill-logo.png" },
    ],
    challenges: [
      "Coordinating multiple trades and subcontractors",
      "Ensuring all work met strict building code requirements",
      "Managing project timeline and budget constraints",
      "Dealing with unexpected structural issues discovered during renovation",
      "Maintaining quality standards while working within tight deadlines",
    ],
    learnings: [
      "Advanced project management and coordination skills",
      "Deep understanding of building codes and regulations",
      "Experience with structural engineering principles",
      "Quality control and inspection processes",
      "Budget management and cost estimation",
    ],
  },
  2: {
    title: "Micromouse Maze Navigation Robot",
    tagline: "Autonomous maze-solving robot with advanced navigation algorithms",
    description:
      "An autonomous robot designed to navigate through complex mazes using advanced sensors and algorithms. The robot employs LiDAR, IMU, and wheel encoders combined with sophisticated path planning algorithms and computer vision to efficiently solve mazes.",
    heroImage: "/images/micromouse-robot.jpeg",
    story: [
      {
        title: "Design & Planning",
        description: "Initial robot design and component selection",
        image: "/images/micromouse-prototype.jpeg",
        details:
          "Designed the mechanical structure and selected appropriate sensors including LiDAR for distance measurement, IMU for orientation tracking, and wheel encoders for precise movement control.",
      },
      {
        title: "Hardware Assembly",
        description: "Building and assembling the robot platform",
        image: "/images/micromouse-assembled.jpeg",
        details:
          "Assembled the robot chassis, mounted sensors, and integrated the control electronics. Ensured proper weight distribution and sensor placement for optimal performance.",
      },
      {
        title: "Algorithm Development",
        description: "Implementing navigation and pathfinding algorithms",
        image: "/images/micromouse-algorithm.jpeg",
        details:
          "Developed and implemented maze-solving algorithms including flood fill, A* pathfinding, and real-time obstacle avoidance. The algorithms were optimized for speed and accuracy.",
      },
      {
        title: "Programming & Testing",
        description: "Software development and system integration",
        image: "/images/micromouse-code1.jpeg",
        details:
          "Programmed the robot using C++ and Python, implementing sensor fusion, motor control, and decision-making logic. Extensive testing was performed to refine the algorithms.",
      },
      {
        title: "Laboratory Testing",
        description: "Testing and validation in controlled environment",
        image: "/images/micromouse-testing-lab.jpeg",
        details:
          "Conducted comprehensive testing in laboratory conditions, fine-tuning sensor calibration and algorithm parameters for optimal maze navigation performance.",
      },
      {
        title: "Competition Performance",
        description: "Final testing and competition participation",
        image: "/images/micromouse-workshop.jpeg",
        details:
          "Participated in micromouse competitions, achieving successful maze completion with competitive timing. The robot demonstrated reliable navigation and efficient pathfinding.",
      },
    ],
    gallery: [
      "/images/micromouse-robot.jpeg",
      "/images/micromouse-assembled.jpeg",
      "/images/micromouse-prototype.jpeg",
      "/images/micromouse-closeup.jpeg",
      "/images/micromouse-algorithm.jpeg",
      "/images/micromouse-code1.jpeg",
      "/images/micromouse-code2.jpeg",
      "/images/micromouse-testing-lab.jpeg",
      "/images/micromouse-workshop.jpeg",
    ],
    techStack: [
      { name: "C++", icon: "/images/solidworks-logo.png" },
      { name: "Python", icon: "/images/matlab-logo.png" },
      { name: "Arduino", icon: "/images/solidworks-logo.png" },
      { name: "OpenCV", icon: "/images/matlab-logo.png" },
    ],
    challenges: [
      "Implementing accurate sensor fusion for reliable navigation",
      "Optimizing pathfinding algorithms for real-time performance",
      "Calibrating sensors for consistent maze detection",
      "Managing power consumption for extended operation",
      "Debugging complex interactions between hardware and software",
    ],
    learnings: [
      "Advanced robotics programming and sensor integration",
      "Algorithm optimization and real-time system design",
      "Computer vision and image processing techniques",
      "Hardware-software integration and debugging",
      "Competition robotics and performance optimization",
    ],
  },
  3: {
    title: "Custom Cooling Funnels for PC Hardware",
    tagline: "3D-printed airflow optimization for high-performance computing",
    description:
      "Designed and manufactured custom cooling funnels using 3D printing technology to optimize airflow in PC cases. The project was inspired by automotive ducted cooling systems and focuses on directing airflow efficiently to GPU components for improved thermal performance.",
    heroImage: "/images/pc-cooling-installed.jpeg",
    beforeAfter: {
      before: "/images/pc-without-ducting.jpeg",
      after: "/images/pc-cooling-installed.jpeg",
    },
    story: [
      {
        title: "Problem Identification",
        description: "Analyzing thermal performance issues",
        image: "/images/pc-airflow-problem.jpeg",
        details:
          "Identified poor airflow patterns in the PC case leading to elevated GPU temperatures. Thermal analysis showed inefficient air circulation and hot spots around critical components.",
      },
      {
        title: "CAD Design Process",
        description: "3D modeling and design optimization",
        image: "/images/cooling-duct-design.png",
        details:
          "Used Fusion360 to design custom cooling ducts that would direct airflow from case fans directly to GPU intake areas. Multiple iterations were designed to optimize airflow while maintaining case compatibility.",
      },
      {
        title: "3D Printing & Manufacturing",
        description: "Prototyping and production using PLA material",
        image: "/images/printed-cooling-parts.jpeg",
        details:
          "3D printed the cooling ducts using PLA material for its ease of printing and adequate thermal properties. Multiple prototypes were created to test fit and airflow characteristics.",
      },
      {
        title: "Installation & Integration",
        description: "Installing the cooling system in PC case",
        image: "/images/cooling-duct-component.png",
        details:
          "Carefully installed the cooling ducts in the PC case, ensuring proper alignment with fans and GPU intake. The installation required precise positioning to maximize airflow efficiency.",
      },
      {
        title: "Performance Testing",
        description: "Thermal performance validation and optimization",
        image: "/images/gpu-test-without-ducting.png",
        details:
          "Conducted extensive thermal testing comparing performance with and without the cooling ducts. Temperature monitoring showed significant improvements in GPU cooling efficiency.",
      },
      {
        title: "Results & Optimization",
        description: "Final performance analysis and improvements",
        image: "/images/gpu-test-with-ducting.png",
        details:
          "Achieved measurable temperature reductions and improved thermal stability under load. The ducted cooling system demonstrated clear benefits for high-performance computing applications.",
      },
    ],
    gallery: [
      "/images/pc-cooling-installed.jpeg",
      "/images/pc-without-ducting.jpeg",
      "/images/cooling-duct-design.png",
      "/images/cooling-duct-component.png",
      "/images/printed-cooling-parts.jpeg",
      "/images/pc-airflow-problem.jpeg",
      "/images/gpu-test-without-ducting.png",
      "/images/gpu-test-with-ducting.png",
      "/images/pc-case-model.png",
      "/images/pc-case-with-gpu.png",
    ],
    techStack: [
      { name: "Fusion360", icon: "/images/fusion360-logo.png" },
      { name: "3D Printing", icon: "/images/bambu-lab-logo.png" },
      { name: "PLA Material", icon: "/images/bambu-lab-logo.png" },
      { name: "Thermal Analysis", icon: "/images/matlab-logo.png" },
    ],
    challenges: [
      "Designing ducts that fit within tight PC case constraints",
      "Optimizing airflow patterns for maximum cooling efficiency",
      "Ensuring 3D printed parts could withstand thermal cycling",
      "Balancing airflow direction with noise considerations",
      "Achieving proper fit and alignment with existing hardware",
    ],
    learnings: [
      "Advanced CAD design and 3D modeling techniques",
      "Understanding of fluid dynamics and airflow optimization",
      "3D printing design considerations and material properties",
      "Thermal management principles for electronic systems",
      "Iterative design process and performance validation",
    ],
  },
  4: {
    title: "Cat Door Monitoring System",
    tagline: "IoT-enabled pet monitoring with real-time notifications",
    description:
      "An intelligent IoT monitoring system designed to track cat movement through a pet door using ESP32 microcontroller and break beam sensors. The system provides real-time Telegram notifications and helps prevent unauthorized access while monitoring pet activity patterns.",
    heroImage: "/images/cat-door-v2-system.png",
    story: [
      {
        title: "System Design",
        description: "Planning the IoT monitoring architecture",
        image: "/images/cat-door-cad-design.jpeg",
        details:
          "Designed a comprehensive monitoring system using ESP32 as the main controller, break beam sensors for detection, and Telegram API for notifications. The system was planned to be reliable and energy-efficient.",
      },
      {
        title: "3D Modeling & Design",
        description: "CAD design for sensor housing and mounting",
        image: "/images/cat-door-cad-slicing.jpeg",
        details:
          "Created detailed 3D models for sensor housings and mounting brackets. The design ensured weather resistance and proper sensor alignment for accurate detection.",
      },
      {
        title: "3D Printing & Assembly",
        description: "Manufacturing components and system assembly",
        image: "/images/cat-door-3d-printed.png",
        details:
          "3D printed all custom components using weather-resistant materials. Assembled the complete system with proper cable management and weatherproofing for outdoor installation.",
      },
      {
        title: "Programming & Integration",
        description: "ESP32 programming and Telegram bot setup",
        image: "/images/cat-door-telegram-notifications.png",
        details:
          "Programmed the ESP32 to handle sensor inputs, WiFi connectivity, and Telegram API integration. Implemented logic to distinguish between different types of movement and reduce false alarms.",
      },
      {
        title: "Installation & Testing",
        description: "System deployment and performance validation",
        image: "/images/cat-door-v1.jpeg",
        details:
          "Installed the monitoring system on the pet door and conducted extensive testing. Fine-tuned sensor sensitivity and notification logic based on real-world usage patterns.",
      },
      {
        title: "System Optimization",
        description: "Performance improvements and feature additions",
        image: "/images/cat-door-v2-system.png",
        details:
          "Upgraded to version 2 with improved reliability, better power management, and additional features like activity logging and pattern recognition for different pets.",
      },
    ],
    gallery: [
      "/images/cat-door-v2-system.png",
      "/images/cat-door-v1.jpeg",
      "/images/cat-door-3d-printed.png",
      "/images/cat-door-cad-design.jpeg",
      "/images/cat-door-cad-slicing.jpeg",
      "/images/cat-door-telegram-notifications.png",
    ],
    techStack: [
      { name: "ESP32", icon: "/images/solidworks-logo.png" },
      { name: "Arduino IDE", icon: "/images/matlab-logo.png" },
      { name: "3D Printing", icon: "/images/bambu-lab-logo.png" },
      { name: "Telegram Bot API", icon: "/images/solidworks-logo.png" },
    ],
    challenges: [
      "Achieving reliable outdoor operation in various weather conditions",
      "Minimizing false alarms while maintaining detection accuracy",
      "Implementing efficient power management for battery operation",
      "Ensuring stable WiFi connectivity for remote notifications",
      "Designing weatherproof enclosures for electronic components",
    ],
    learnings: [
      "IoT system design and implementation",
      "ESP32 programming and sensor integration",
      "API integration and real-time communication",
      "3D printing for functional outdoor applications",
      "Power management and battery optimization techniques",
    ],
  },
  5: {
    title: "UR5e Robotic Writing System",
    tagline: "Precision robotic control for mathematical operations and text rendering",
    description:
      "A sophisticated MATLAB RTDE program that controls a UR5e collaborative robot to perform precise writing tasks. The system can trace individual digits using Hershey fonts, apply complex transformations including translation and rotation, and render complete mathematical operations in long-form with smooth, human-like motion.",
    heroImage: "/images/ur5e-math-operation.jpeg",
    story: [
      {
        title: "System Architecture",
        description: "MATLAB RTDE integration with UR5e robot",
        image: "/images/ur5e-robot-setup.jpeg",
        details:
          "Developed a comprehensive MATLAB program using the Real-Time Data Exchange (RTDE) protocol to communicate with the UR5e robot. The system architecture enables precise control of robot movements with real-time feedback and monitoring.",
      },
      {
        title: "Font Rendering System",
        description: "Hershey font implementation for digit tracing",
        image: "/images/ur5e-robot-side-view.jpeg",
        details:
          "Implemented Hershey font rendering system that converts text characters into precise robot trajectories. The system handles proper character spacing, pen lift operations between strokes, and maintains consistent writing quality.",
      },
      {
        title: "Transformation Engine",
        description: "Translation and rotation capabilities",
        image: "/images/ur5e-complex-equation.jpeg",
        details:
          "Developed transformation algorithms that can apply arbitrary X/Y translations and Z-axis rotations to writing operations. Uses transformation matrices to maintain precision while allowing flexible positioning of text and equations.",
      },
      {
        title: "Mathematical Operations",
        description: "Long-form arithmetic rendering",
        image: "/images/ur5e-math-operation.jpeg",
        details:
          "Created algorithms to solve and render mathematical operations including addition, subtraction, and multiplication in traditional long-form vertical layout. The system properly aligns digits, handles carry operations, and maintains mathematical formatting conventions.",
      },
    ],
    collapsibleSections: [
      {
        title: "Digit Tracing",
        content:
          "The system uses Hershey font rendering to convert individual digits into precise robot trajectories. Each character is broken down into vector paths that the robot can follow smoothly. The implementation includes proper character spacing algorithms, automatic pen lift detection between disconnected strokes, and consistent baseline alignment. The font rendering engine supports all digits 0-9 and basic mathematical symbols (+, -, ×, =) with optimized stroke order for efficient robot movement.",
      },
      {
        title: "Translation & Rotation",
        content:
          "Advanced transformation capabilities allow the robot to position text and equations anywhere within its workspace. The system implements homogeneous transformation matrices to handle arbitrary X/Y translations and Z-axis rotations while maintaining writing precision. Users can specify translation offsets and rotation angles, and the system automatically adjusts all trajectory points accordingly. This enables flexible layout of complex mathematical expressions and multi-line equations.",
      },
      {
        title: "Mathematical Operations",
        content:
          "The system can solve and render complete mathematical operations in traditional long-form vertical format. For addition and subtraction, it properly aligns digits by place value, handles carry and borrow operations, and draws appropriate lines and symbols. Multiplication operations are rendered with partial products properly aligned and summed. The algorithm automatically calculates spacing requirements and positions each element of the operation for clear, readable output.",
      },
    ],
    gallery: [
      "/images/ur5e-robot-setup.jpeg",
      "/images/ur5e-robot-side-view.jpeg",
      "/images/ur5e-math-operation.jpeg",
      "/images/ur5e-complex-equation.jpeg",
    ],
    techStack: [
      { name: "MATLAB", icon: "/images/matlab-logo.png" },
      { name: "UR5e Robot", icon: "/images/solidworks-logo.png" },
      { name: "RTDE Protocol", icon: "/images/matlab-logo.png" },
      { name: "RVC Toolbox", icon: "/images/solidworks-logo.png" },
    ],
    challenges: [
      "Implementing smooth trajectory generation for natural writing motion",
      "Synchronizing pen lift/down operations with robot movement",
      "Maintaining writing precision across different scales and orientations",
      "Optimizing path planning to minimize writing time while ensuring quality",
      "Handling real-time communication and error recovery with RTDE protocol",
    ],
    learnings: [
      "Advanced robotics programming and motion control",
      "Real-time communication protocols and system integration",
      "Trajectory planning and smooth motion generation",
      "Font rendering and vector graphics processing",
      "Mathematical algorithm implementation for automated problem solving",
    ],
  },
}

export default function ProjectDetailClient() {
  const params = useParams()
  const projectId = params.id as string
  const project = projectData[projectId as keyof typeof projectData]

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({})

  if (!project) {
    return <div>Project not found</div>
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={project.heroImage || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">{project.tagline}</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-lg md:text-xl leading-relaxed text-foreground/80">{project.description}</p>
        </div>
      </section>

      {/* Before/After Slider - Only for projects that have it */}
      {project.beforeAfter && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Before & After</h2>
            <EnhancedBeforeAfterSlider
              beforeImage={project.beforeAfter.before}
              afterImage={project.beforeAfter.after}
              beforeLabel="Before"
              afterLabel="After"
            />
          </div>
        </section>
      )}

      {/* Collapsible Sections - Only for UR5e project */}
      {project.collapsibleSections && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Technical Details</h2>
            <div className="space-y-4">
              {project.collapsibleSections.map((section, index) => (
                <Card key={index}>
                  <Collapsible open={openSections[section.title]} onOpenChange={() => toggleSection(section.title)}>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                        <h3 className="text-xl font-semibold">{section.title}</h3>
                        {openSections[section.title] ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6">
                        <p className="text-foreground/80 leading-relaxed">{section.content}</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Project Story Timeline - For projects with story */}
      {project.story && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-16">Project Journey</h2>

            <div className="relative">
              {/* Timeline line - hidden on mobile, visible on desktop */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary/20 h-full"></div>

              {project.story.map((step, index) => (
                <div key={index} className="relative mb-12 md:mb-16">
                  {/* Timeline dot - hidden on mobile, visible on desktop */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10"></div>

                  <div
                    className={`flex flex-col md:flex-row items-center gap-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="w-full md:w-1/2">
                      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                        <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-4">
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                      <p className="text-lg text-primary font-medium">{step.description}</p>
                      <p className="text-foreground/70 leading-relaxed">{step.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Gallery */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.gallery.map((image, index) => (
              <div
                key={index}
                className="relative h-64 rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Technologies Used</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {project.techStack.map((tech, index) => (
              <div key={index} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <Image src={tech.icon || "/placeholder.svg"} alt={tech.name} fill className="object-contain" />
                </div>
                <p className="font-medium">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges & Learnings */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Challenges</h2>
              <ul className="space-y-4">
                {project.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                    <p className="text-foreground/80">{challenge}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Key Learnings</h2>
              <ul className="space-y-4">
                {project.learnings.map((learning, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-foreground/80">{learning}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <ImageLightbox
        images={project.gallery}
        isOpen={lightboxOpen}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % project.gallery.length)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length)}
      />
    </div>
  )
}
