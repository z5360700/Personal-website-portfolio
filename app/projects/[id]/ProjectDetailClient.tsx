"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BeforeAfterSlider from "@/components/before-after-slider"
import ImageLightbox from "@/components/image-lightbox"
import VideoEmbed from "@/components/video-embed"
import { motion } from "framer-motion"

// This would typically come from a database or API
const projectsData = [
  {
    id: 1,
    title: "Residential Construction & Renovation",
    description:
      "Complete residential building renovation from foundation to finish, including structural framing, roofing, plumbing, and electrical work.",
    longDescription: `
      This comprehensive residential construction project involved the complete renovation and reconstruction of a deteriorated building into a modern, fully functional residential structure. Working alongside my father, I gained hands-on experience in all aspects of construction from initial demolition through to final finishing.
      
      The project required careful planning, adherence to building codes and regulations, and coordination of multiple trades including electrical, plumbing, and structural work. The transformation showcases both technical construction skills and project management capabilities.
    `,
    image: "/images/construction-after.jpg",
    beforeImage: "/images/construction-before.jpg",
    exteriorGallery: [
      "/images/construction-before.jpg",
      "/images/construction-2.jpg",
      "/images/construction-4.jpg",
      "/images/construction-1.jpg",
      "/images/construction-3.jpg",
      "/images/construction-5.jpg",
      "/images/construction-after.jpg",
    ],
    interiorGallery: [
      "/images/interior-3.jpg",
      "/images/interior-5.jpg",
      "/images/interior-2.jpg",
      "/images/interior-4.jpg",
      "/images/interior-1.jpg",
      "/images/interior-7.jpg",
      "/images/interior-6.jpg",
      "/images/interior-8.jpg",
    ],
    tags: ["Construction", "Renovation", "Project Management", "Building Codes"],
    liveUrl: null,
    githubUrl: null,
    date: "May 2024 - February 2025",
    features: [
      "Complete structural assessment and planning",
      "Foundation and framing construction using timber frame techniques",
      "Roof installation with proper weatherproofing and insulation",
      "Electrical system installation and compliance with safety standards",
      "Plumbing installation including water supply and drainage systems",
      "Exterior cladding and weatherproofing application",
      "Interior insulation and drywall installation",
      "Modern kitchen and bathroom installations",
      "Recessed lighting and electrical finishing",
      "Luxury vinyl plank flooring installation",
      "Window and door installation with proper sealing",
      "Interior and exterior painting and finishing",
      "Project coordination and timeline management",
      "Compliance with local building codes and regulations",
    ],
    technologies: {
      construction: [
        "Timber Frame Construction",
        "Concrete Foundation Work",
        "Steel Roofing Systems",
        "Electrical Wiring & Lighting",
        "Plumbing Systems",
        "Insulation Installation",
      ],
      tools: ["Power Tools", "Hand Tools", "Measuring Equipment", "Safety Equipment", "Scaffolding", "Ladders"],
      compliance: ["Building Codes", "Safety Regulations", "Quality Standards", "Project Management"],
    },
    challenges: `
      One of the main challenges was working with the existing foundation while ensuring the new structure met current building standards. This required careful assessment of the existing structure and strategic reinforcement where necessary.
      
      The interior renovation presented unique challenges with coordinating electrical, plumbing, and HVAC systems within the existing structure. Proper sequencing of trades was critical to ensure quality workmanship and avoid conflicts between different systems.
      
      Weather conditions also posed challenges during the construction phase, requiring flexible scheduling and proper protection of materials and work areas. Coordinating multiple trades and ensuring quality workmanship while maintaining project timelines required strong organizational and communication skills.
      
      Ensuring compliance with all building codes and regulations while maintaining cost-effectiveness was another key challenge that required thorough planning and attention to detail throughout the construction process.
    `,
  },
  {
    id: 2,
    title: "Micromouse Maze Navigation Robot",
    description:
      "Autonomous robot designed to navigate through complex mazes using LiDAR, IMU, and wheel encoders with path planning algorithms and computer vision.",
    longDescription: `
      The Micromouse Maze Navigation Robot was developed as part of the MTRN3100 course, focusing on autonomous robotics and navigation systems. This project involved designing and implementing a robot capable of navigating through unknown maze environments efficiently.
      
      The robot utilizes multiple sensors including LiDAR for distance measurement, an Inertial Measurement Unit (IMU) for orientation tracking, and wheel encoders for precise movement control. These sensors work together to provide comprehensive environmental awareness and position tracking.
      
      A key feature of this project was the implementation of computer vision techniques to generate occupancy maps of the maze in real-time. Using these maps, the robot applies Breadth-First Search (BFS) algorithms to determine optimal paths while avoiding obstacles.
      
      The system also includes a manual override feature, allowing users to input directional commands (forward, left, right) for situations where direct control is preferred over autonomous navigation.
    `,
    image: "/images/micromouse-robot.jpeg",
    hardwareGallery: [
      "/images/micromouse-robot.jpeg",
      "/images/micromouse-prototype.jpeg",
      "/images/micromouse-workshop.jpeg",
      "/images/micromouse-assembled.jpeg",
      "/images/micromouse-closeup.jpeg",
    ],
    softwareGallery: [
      "/images/micromouse-code1.jpeg",
      "/images/micromouse-code2.jpeg",
      "/images/micromouse-algorithm.jpeg",
    ],
    videoGallery: [
      {
        id: "B2lfw8Rdm6E",
        title: "PID Control Straight Line Demonstration",
        description:
          "This video demonstrates the PID controller in action, showing how the robot maintains a straight line path with precise motor control.",
        isShort: true,
      },
      {
        id: "EOZJjVUmMxs",
        title: "Micromouse Maze Navigation",
        description:
          "Full demonstration of the Micromouse robot navigating through a complex maze environment using its sensor array and path planning algorithms.",
        isShort: false,
      },
    ],
    tags: ["C++", "Python", "Arduino", "Computer Vision", "Robotics", "OpenCV"],
    liveUrl: null,
    githubUrl: "https://github.com/yourusername/micromouse-robot",
    date: "May 2024 - August 2024",
    features: [
      "Autonomous maze navigation using sensor fusion",
      "Real-time occupancy map generation with computer vision",
      "Path planning with Breadth-First Search algorithm",
      "PID control for precise movement and turning",
      "Manual override with user-defined input sequences",
      "Obstacle detection and avoidance",
      "Real-time data processing on Arduino Nano",
    ],
    technologies: {
      hardware: [
        "Arduino Nano microcontroller",
        "LiDAR sensor for distance measurement",
        "IMU (Inertial Measurement Unit)",
        "Wheel encoders for odometry",
        "DC motors with motor drivers",
        "Custom PCB for component integration",
      ],
      software: [
        "C++ for embedded systems programming",
        "Python for high-level control and vision processing",
        "OpenCV for image processing and map generation",
        "PID control algorithms",
        "Breadth-First Search for path planning",
        "Serial communication protocols",
      ],
      tools: [
        "Arduino IDE",
        "Python development environment",
        "Git for version control",
        "CAD software for mechanical design",
        "Oscilloscope and multimeter for debugging",
      ],
    },
    challenges: `
      One of the primary challenges was achieving accurate localization within the maze environment. Small errors in sensor readings or wheel slippage could compound over time, leading to significant position estimation errors. We addressed this by implementing sensor fusion techniques that combined data from multiple sources to improve accuracy.
      
      Processing constraints were another significant challenge, as the Arduino Nano has limited computational resources. Optimizing the code for efficiency while maintaining real-time performance required careful algorithm selection and implementation.
      
      The integration of computer vision for map generation presented challenges in terms of processing speed and accuracy. We had to balance the resolution of the occupancy map with the processing capabilities of our system to ensure real-time performance.
      
      Tuning the PID controllers for consistent performance across different maze surfaces and conditions required extensive testing and parameter adjustment. We developed an adaptive control system that could adjust parameters based on detected surface conditions.
    `,
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description:
      "Work in progress - An interactive weather dashboard that displays current and forecasted weather data for any location.",
    longDescription: `
      Work in progress - This weather dashboard will provide users with accurate and up-to-date weather information for any location worldwide.
      It will feature a clean, intuitive interface that displays current conditions, hourly forecasts, and a 7-day outlook.
      
      Users will be able to save favorite locations, receive severe weather alerts, and view detailed meteorological data including
      temperature, precipitation, wind, humidity, and atmospheric pressure. The app will also include historical weather data
      and interactive weather maps.
    `,
    image: "/placeholder.svg?height=600&width=800",
    exteriorGallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    tags: ["React", "Redux", "Weather API", "Chart.js"],
    liveUrl: "#",
    githubUrl: "#",
    features: [
      "Current weather conditions",
      "Hourly and 7-day forecasts",
      "Interactive weather maps",
      "Location search and favorites",
      "Weather alerts and notifications",
      "Historical weather data",
      "Responsive design with dark mode",
    ],
    technologies: {
      frontend: ["React", "Redux", "Chart.js", "Leaflet Maps"],
      backend: ["Node.js", "Express", "OpenWeather API", "Redis caching"],
      deployment: ["Netlify", "Serverless Functions"],
    },
    challenges: `
      One challenge will be optimizing API usage to stay within rate limits while providing real-time data. We plan to implement
      a caching strategy with Redis that will significantly reduce API calls while keeping data fresh.
      
      Displaying complex meteorological data in an intuitive way will be another challenge. We plan to use Chart.js to create
      visualizations that make it easy for users to understand weather patterns and trends at a glance.
    `,
  },
  {
    id: 4,
    title: "Custom Cooling Funnels for PC Hardware",
    description:
      "Designed and 3D-printed cooling funnels using ABS material to direct airflow for CPU and GPU components, inspired by automotive ducted cooling systems.",
    longDescription: `
    This project was inspired by ducted cooling systems found in automotive applications, where air is directed precisely to components that need cooling. The idea emerged from observing that airflow transfer in PC cases isn't well optimized, with much of the intake air not reaching critical components like the GPU effectively.
    
    The project began with identifying the airflow optimization problem in my PC case, where front intake fans weren't efficiently directing cool air to the graphics card. Taking inspiration from automotive ducted parts that channel air directly to specific engine components, I designed custom cooling funnels to create a direct airflow path from the front case fans to the GPU.
    
    The solution involved precise 3D modeling of the PC case components, designing custom ducting that would fit perfectly within the case constraints, and 3D printing the parts using ABS material for heat resistance and durability.
  `,
    image: "/images/pc-cooling-installed.jpeg",
    designGallery: [
      "/images/pc-airflow-problem.jpeg",
      "/images/pc-case-model.png",
      "/images/pc-case-with-gpu.png",
      "/images/cooling-duct-design.png",
      "/images/cooling-duct-component.png",
    ],
    printingGallery: ["/images/bambu-studio-slicing.png", "/images/printed-cooling-parts.jpeg"],
    installationGallery: ["/images/pc-without-ducting.jpeg", "/images/pc-cooling-installed.jpeg"],
    storySteps: [
      {
        title: "The Problem",
        description:
          "I noticed that airflow in PC cases isn't optimized. Front intake fans push air in, but much of it disperses inside the case rather than reaching the GPU directly.",
        image: "/images/pc-airflow-problem.jpeg",
        highlight:
          "Green arrows show air coming in, red arrows show where it exits - but the path in between isn't direct",
        aspectRatio: "aspect-[4/3]", // Horizontal PC case photo
      },
      {
        title: "The Inspiration",
        description:
          "I drew inspiration from automotive cooling systems, where ducted parts channel air directly to engine components that need cooling the most.",
        image: "/images/rs3-carbon-intake.jpeg",
        highlight:
          "This is an RS3 carbon fiber air intake - in high-performance cars, every bit of airflow is carefully directed where it's needed most.",
        aspectRatio: "aspect-video",
      },
      {
        title: "Modeling the Case",
        description:
          "First, I created a precise 3D model of my PC case in Fusion360, ensuring all dimensions were accurate for a perfect fit.",
        image: "/images/pc-case-model.png",
        highlight: "",
        aspectRatio: "aspect-square", // 3D model view
      },
      {
        title: "Adding Components",
        description:
          "Next, I modeled the GPU and intake fan positions to understand the exact path the air needed to travel.",
        image: "/images/pc-case-with-gpu.png",
        highlight: "Understanding the spatial relationship between components was essential for effective duct design.",
        aspectRatio: "aspect-square", // 3D model view
      },
      {
        title: "Designing the Duct",
        description:
          "I designed a custom cooling funnel that would direct air from the front intake fans straight to the GPU's cooling system.",
        image: "/images/cooling-duct-design.png",
        highlight: "The duct features a gradually narrowing design to accelerate airflow as it approaches the GPU.",
        aspectRatio: "aspect-[3/2]", // 3D model view
      },
      {
        title: "Finalizing Components",
        description:
          "The final design included multiple components that would fit together perfectly while being printable on a standard 3D printer bed.",
        image: "/images/cooling-duct-component.png",
        highlight: "Each component was designed with both function and printability in mind.",
        aspectRatio: "aspect-[3/2]", // 3D model view
      },
      {
        title: "Slicing for Printing",
        description:
          "Using Bambu Studio, I prepared the 3D models for printing, setting up supports and optimizing print settings for ABS material.",
        image: "/images/bambu-studio-slicing.png",
        highlight: "The green areas show support structures needed for successful printing of complex geometries.",
        aspectRatio: "aspect-[4/3]", // Software screenshot
      },
      {
        title: "Printed Components",
        description: "After several hours of printing, the cooling duct components were ready for installation.",
        image: "/images/printed-cooling-parts.jpeg",
        highlight: "ABS material was chosen for its heat resistance and durability in the warm PC environment.",
        aspectRatio: "aspect-video",
      },
    ],
    tags: ["3D Printing", "Fusion360", "ABS Material", "Thermal Management", "CAD Design"],
    liveUrl: null,
    githubUrl: null,
    date: "August 2024 - January 2025",
    features: [
      "Custom 3D-modeled PC case components for precise fit",
      "Automotive-inspired ducted airflow design",
      "ABS material selection for heat resistance and durability",
      "Modular design allowing easy installation and removal",
      "Direct airflow channeling from intake fans to GPU",
      "Optimized internal geometry for minimal airflow restriction",
      "Split-part design for 3D printing feasibility",
      "Temperature monitoring and performance validation",
    ],
    technologies: {
      design: [
        "Fusion360 CAD Software",
        "3D Modeling and Assembly",
        "Airflow Simulation Principles",
        "Thermal Management Design",
        "Parametric Design Techniques",
      ],
      manufacturing: [
        "Bambu Studio Slicing Software",
        "ABS Filament 3D Printing",
        "Multi-part Assembly Design",
        "Support Structure Optimization",
        "Print Quality Optimization",
      ],
      testing: [
        "Temperature Monitoring",
        "Airflow Measurement",
        "Performance Benchmarking",
        "Thermal Imaging Analysis",
        "System Stability Testing",
      ],
    },
    challenges: `
      One of the primary challenges was accurately measuring and modeling the internal dimensions of the PC case while accounting for cable management and component clearances. The ducting needed to fit precisely without interfering with other components or restricting access for maintenance.
      
      Designing for 3D printing presented constraints in terms of overhang angles, support material requirements, and print bed size limitations. The duct had to be split into multiple parts that could be printed separately and assembled, while maintaining structural integrity and airflow efficiency.
      
      Material selection was critical, as the ducting would be exposed to warm air from the case fans. ABS was chosen for its higher temperature resistance compared to PLA, but this required careful print settings and bed adhesion management to prevent warping during printing.
      
      Validating the effectiveness of the cooling solution required establishing baseline temperature measurements and conducting controlled testing under various load conditions. Ensuring that the ducting actually improved cooling performance rather than just redirecting airflow was essential to the project's success.
    `,
    results: `
      The custom cooling ducts proved highly effective, reducing GPU temperatures by 8°C under full load compared to the standard case configuration. This temperature reduction allowed the GPU to maintain higher boost clocks for longer periods, resulting in more consistent performance during demanding tasks like gaming and 3D rendering.
      
      An unexpected benefit was the reduction in fan noise, as the GPU's cooling system didn't need to work as hard to maintain safe temperatures. The direct airflow path also reduced dust accumulation on the GPU, as air was now following a more controlled path through the case.
      
      The project demonstrated how principles from automotive cooling systems could be successfully applied to PC hardware cooling, opening up possibilities for further optimization of other components like CPU coolers and memory modules.
    `,
  },
]

export default function ProjectDetailClient() {
  const router = useRouter()
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxAltPrefix, setLightboxAltPrefix] = useState("")

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const projectId = Number.parseInt(id)
    const foundProject = projectsData.find((p) => p.id === projectId)

    if (foundProject) {
      setProject(foundProject)
    }
    setLoading(false)
  }, [id])

  const openLightbox = (images, index, altPrefix) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxAltPrefix(altPrefix)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)
  }

  const previousImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <main className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          {/* Special layout for Construction Project with full-width slider */}
          {project.id === 1 ? (
            <div className="space-y-12">
              {/* Project Header */}
              <div className="text-center max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                  {project.course && (
                    <span className="bg-primary/90 text-white text-sm px-3 py-1 rounded">{project.course}</span>
                  )}
                </div>

                {project.date && (
                  <p className="text-foreground/70 mb-4">
                    <span className="font-medium">Timeline:</span> {project.date}
                  </p>
                )}

                <p className="text-lg text-foreground/80 mb-6">{project.description}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Full-width Before/After Slider */}
              <div className="w-full max-w-7xl mx-auto mb-12">
                <BeforeAfterSlider
                  beforeImage={project.beforeImage}
                  afterImage={project.image}
                  beforeAlt="Before construction"
                  afterAlt="After construction"
                  className="before-after-slider-full"
                />
              </div>

              {/* Project Description */}
              <div className="max-w-4xl mx-auto">
                <div className="prose dark:prose-invert max-w-none mb-8">
                  <p>{project.longDescription}</p>
                </div>

                {project.liveUrl || project.githubUrl ? (
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {project.liveUrl && (
                      <Button asChild>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button variant="outline" asChild>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Github size={16} />
                          View Code
                        </a>
                      </Button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          ) : project.id === 4 ? (
            // Storytelling layout for PC Cooling project
            <div className="space-y-12">
              {/* Project Header */}
              <div className="text-center max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                  {project.course && (
                    <span className="bg-primary/90 text-white text-sm px-3 py-1 rounded">{project.course}</span>
                  )}
                </div>

                {project.date && (
                  <p className="text-foreground/70 mb-4">
                    <span className="font-medium">Timeline:</span> {project.date}
                  </p>
                )}

                <p className="text-lg text-foreground/80 mb-6">{project.description}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Story Timeline */}
              <div className="max-w-6xl mx-auto">
                <div className="relative">
                  {/* Timeline line - Covers all story steps including printed components */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${project.storySteps.length * 24}rem` }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary/20"
                    style={{ top: 0 }}
                  ></motion.div>

                  {/* Story steps */}
                  {project.storySteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: index * 0.3 }}
                      className={`relative mb-24 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-4 border-background z-10"></div>

                      {/* Content */}
                      <div
                        className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                      >
                        <div className={`${index % 2 === 0 ? "md:order-2" : "md:order-1"}`}>
                          <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                          <p className="text-foreground/80 mb-4">{step.description}</p>
                          {step.highlight && (
                            <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
                              <p className="italic text-foreground/90">{step.highlight}</p>
                            </div>
                          )}
                        </div>
                        <div className={`${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}>
                          <div
                            className={`relative ${step.aspectRatio || "aspect-video"} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-muted/20`}
                          >
                            <Image
                              src={step.image || "/placeholder.svg"}
                              alt={step.title}
                              fill
                              className="object-contain p-2"
                              onClick={() => step.image && openLightbox([step.image], 0, step.title)}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Gap section - no timeline line */}
                  <div className="mb-24"></div>

                  {/* Before/After Installation Comparison - Standalone section */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                    className="relative mb-24"
                  >
                    {/* Before/After Slider Section */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-6">Installation Comparison</h3>
                      <p className="text-foreground/70 mb-6 max-w-3xl mx-auto">
                        Use the slider below to compare the PC before and after installing the custom cooling ducts.
                        Notice how the ducts create a direct airflow path from the front intake fans to the GPU.
                      </p>
                      <div className="relative w-full max-w-4xl mx-auto h-[600px] bg-muted/20 rounded-lg overflow-hidden">
                        <BeforeAfterSlider
                          beforeImage="/images/pc-without-ducting.jpeg"
                          afterImage="/images/pc-cooling-installed.jpeg"
                          beforeAlt="PC without cooling ducts"
                          afterAlt="PC with cooling ducts installed"
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Results Section - Standalone */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                    className="relative"
                  >
                    {/* Results content */}
                    <div className="text-center">
                      <div className="max-w-4xl mx-auto bg-primary/5 p-8 rounded-lg border border-primary/20">
                        <h3 className="text-2xl font-bold mb-4">Project Results</h3>
                        <div className="prose dark:prose-invert max-w-none">
                          <p>{project.results}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Scroll to explore */}
              <div className="text-center animate-bounce">
                <p className="text-foreground/60 flex items-center justify-center gap-2">
                  Scroll to explore more details
                  <ChevronDown size={16} />
                </p>
              </div>
            </div>
          ) : (
            /* Regular layout for other projects */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="lg:col-span-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                  {project.course && (
                    <span className="bg-primary/90 text-white text-sm px-3 py-1 rounded">{project.course}</span>
                  )}
                </div>

                {project.date && (
                  <p className="text-foreground/70 mb-4">
                    <span className="font-medium">Timeline:</span> {project.date}
                  </p>
                )}

                <p className="text-lg text-foreground/80 mb-6">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="prose dark:prose-invert max-w-none mb-8">
                  <p>{project.longDescription}</p>
                </div>

                {project.liveUrl || project.githubUrl ? (
                  <div className="flex flex-wrap gap-4 mb-8">
                    {project.liveUrl && (
                      <Button asChild>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button variant="outline" asChild>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Github size={16} />
                          View Code
                        </a>
                      </Button>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="lg:col-span-1">
                <div className="relative aspect-video lg:aspect-square rounded-lg overflow-hidden">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="features" className="mb-12">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Key Features</TabsTrigger>
              <TabsTrigger value="technologies">{project.id === 1 ? "Skills & Tools" : "Technologies"}</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="p-6 border rounded-md mt-2">
              <h2 className="text-xl font-bold mb-4">Key Features</h2>
              <ul className="space-y-2">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="technologies" className="p-6 border rounded-md mt-2">
              <h2 className="text-xl font-bold mb-4">
                {project.id === 1 ? "Skills & Tools Used" : "Technologies Used"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(project.technologies).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-bold mb-2 capitalize">{category.replace(/([A-Z])/g, " $1").trim()}</h3>
                    <ul className="space-y-1">
                      {items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="challenges" className="p-6 border rounded-md mt-2">
              <h2 className="text-xl font-bold mb-4">Challenges & Solutions</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>{project.challenges}</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Construction Project Galleries */}
          {project.id === 1 && (
            <div className="space-y-12">
              {/* Exterior Construction Progress */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Exterior Construction Progress</h2>
                <p className="text-foreground/70 mb-6">
                  This gallery shows the complete exterior transformation from the original deteriorated structure to
                  the modern finished building. Click any image to view it in full size.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.exteriorGallery.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openLightbox(project.exteriorGallery, index, "Exterior construction progress")}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Exterior construction progress ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Interior Construction Progress */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Interior Construction Progress</h2>
                <p className="text-foreground/70 mb-6">
                  This gallery showcases the interior renovation from structural framing through to the completed modern
                  living space with kitchen, lighting, and flooring installations. Click any image to view it in full
                  size.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.interiorGallery.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openLightbox(project.interiorGallery, index, "Interior construction progress")}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Interior construction progress ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Micromouse Project Gallery */}
          {project.id === 2 && (
            <div className="space-y-12">
              {/* Video Demonstrations */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Video Demonstrations</h2>
                <p className="text-foreground/70 mb-6">
                  Watch the Micromouse robot in action! These videos demonstrate the robot's capabilities, including PID
                  control for straight-line movement and maze navigation.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {project.videoGallery.map((video, index) => (
                    <div key={index} className="space-y-3">
                      <VideoEmbed videoId={video.id} title={video.title} isShort={video.isShort} />
                      <h3 className="text-lg font-medium">{video.title}</h3>
                      <p className="text-foreground/70">{video.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware Gallery */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Hardware Development</h2>
                <p className="text-foreground/70 mb-6">
                  This gallery shows the hardware development process of the Micromouse robot, from early prototyping to
                  the final assembled robot. Click any image to view it in full size.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.hardwareGallery.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openLightbox(project.hardwareGallery, index, "Micromouse hardware")}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Micromouse hardware ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Software Gallery */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Software & Algorithms</h2>
                <p className="text-foreground/70 mb-6">
                  This gallery showcases the software development aspects of the project, including Arduino C++ code for
                  sensor integration and motor control, as well as Python algorithms for path planning and navigation.
                  Click any image to view it in full size.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.softwareGallery.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openLightbox(project.softwareGallery, index, "Micromouse software")}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Micromouse software ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Regular Project Gallery for other projects */}
          {project.id === 3 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.exteriorGallery.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openLightbox(project.exteriorGallery, index, `${project.title} screenshot`)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${project.title} screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PC Cooling Project - galleries removed, story timeline contains all visual content */}
        </div>
      </main>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
        altPrefix={lightboxAltPrefix}
      />
    </>
  )
}
