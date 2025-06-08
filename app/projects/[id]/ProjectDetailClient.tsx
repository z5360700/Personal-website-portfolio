"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnhancedBeforeAfterSlider from "@/components/enhanced-before-after-slider"
import VideoEmbed from "@/components/video-embed"
import ImageLightbox from "@/components/image-lightbox"

interface Project {
  id: number
  title: string
  description: string
  longDescription?: string
  image: string
  tags: string[]
  liveUrl?: string | null
  githubUrl?: string | null
  features?: string[]
  technologies?: Record<string, string[]>
  challenges?: string
  course?: string
  beforeImage?: string
  exteriorGallery?: string[]
  interiorGallery?: string[]
  finishedProductGallery?: string[]
  miscellaneousGallery?: string[]
  hardwareGallery?: string[]
  softwareGallery?: string[]
  videoGallery?: Array<{
    id: string
    title: string
    description: string
    isShort: boolean
  }>
  designGallery?: string[]
  printingGallery?: string[]
  installationGallery?: string[]
  notificationGallery?: string[]
  storySteps?: Array<{
    title: string
    description: string
    image: string
    highlight: string
    aspectRatio: string
  }>
  results?: string
}

// Project data
const projectsData: Project[] = [
  {
    id: 1,
    title: "Residential Construction & Renovation",
    description:
      "Complete residential building renovation from foundation to finish, including structural framing, roofing, plumbing, and electrical work.",
    longDescription:
      "This project involved completely renovating a deteriorated building into a modern home. Working with my father, I gained hands-on experience in all aspects of construction.",
    image: "/images/construction-after.jpg",
    beforeImage: "/images/construction-before-new.png",
    tags: ["Construction", "Renovation", "Project Management", "Building Codes"],
    liveUrl: null,
    githubUrl: null,
    features: [
      "Complete structural assessment and planning",
      "Foundation and framing construction using timber frame techniques",
      "Roof installation with proper weatherproofing and insulation",
      "Electrical system installation and compliance with safety standards",
    ],
    technologies: {
      construction: ["Timber Frame Construction", "Concrete Foundation Work", "Steel Roofing Systems"],
      tools: ["Power Tools", "Hand Tools", "Measuring Equipment", "Safety Equipment"],
    },
    challenges:
      "One of the main challenges was working with the existing foundation while ensuring the new structure met current building standards.",
    exteriorGallery: [
      "/images/construction-before.jpg",
      "/images/construction-2.jpg",
      "/images/construction-4.jpg",
      "/images/construction-1.jpg",
      "/images/construction-3.jpg",
      "/images/construction-5.jpg",
      "/images/construction-primed-exterior.jpeg",
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
    finishedProductGallery: [
      "/images/finished-product-1.jpeg",
      "/images/finished-product-2.jpeg",
      "/images/finished-product-3.jpeg",
      "/images/finished-product-4.jpeg",
      "/images/finished-product-5.jpeg",
      "/images/finished-product-6.jpeg",
      "/images/finished-product-7.jpeg",
    ],
    miscellaneousGallery: [
      "/images/misc-construction-1.jpeg",
      "/images/misc-construction-2.jpeg",
      "/images/misc-construction-3.jpeg",
      "/images/misc-construction-4.jpeg",
      "/images/misc-construction-5.jpeg",
    ],
  },
  {
    id: 2,
    title: "Micromouse Maze Navigation Robot",
    description:
      "Autonomous robot designed to navigate through complex mazes using LiDAR, IMU, and wheel encoders with path planning algorithms and computer vision.",
    longDescription:
      "The Micromouse Maze Navigation Robot was developed as part of the MTRN3100 course, focusing on autonomous robotics and navigation systems.",
    image: "/images/micromouse-robot.jpeg",
    course: "MTRN3100",
    tags: ["C++", "Python", "Arduino", "Computer Vision", "Robotics", "OpenCV"],
    liveUrl: null,
    githubUrl: "https://github.com/z5360700/micromouse-from2024",
    features: [
      "Autonomous maze navigation using sensor fusion",
      "Real-time occupancy map generation with computer vision",
      "Path planning with Breadth-First Search algorithm",
      "PID control for precise movement and turning",
    ],
    technologies: {
      hardware: [
        "Arduino Nano microcontroller",
        "LiDAR sensor for distance measurement",
        "IMU (Inertial Measurement Unit)",
      ],
      software: [
        "C++ for embedded systems programming",
        "Python for high-level control and vision processing",
        "OpenCV for image processing",
      ],
    },
    challenges: "One of the primary challenges was achieving accurate localization within the maze environment.",
    hardwareGallery: [
      "/images/micromouse-robot.jpeg",
      "/images/micromouse-prototype.jpeg",
      "/images/micromouse-workshop.jpeg",
      "/images/micromouse-assembled.jpeg",
      "/images/micromouse-closeup.jpeg",
      "/images/micromouse-testing-lab.jpeg",
    ],
    softwareGallery: [
      "/images/micromouse-code1.jpeg",
      "/images/micromouse-code2.jpeg",
      "/images/micromouse-algorithm.jpeg",
    ],
    videoGallery: [
      {
        id: "EOZJjVUmMxs",
        title: "Micromouse Maze Navigation",
        description: "Full demonstration of the Micromouse robot navigating through a complex maze environment.",
        isShort: false,
      },
      {
        id: "ZRjj2WblTCQ",
        title: "Early Testing - Accuracy Focus",
        description:
          "This video shows early testing of the micromouse robot where we prioritized getting accurate movement over speed.",
        isShort: false,
      },
      {
        id: "B2lfw8Rdm6E",
        title: "PID Control Straight Line Demonstration",
        description: "This video demonstrates the PID controller in action alongside aid from LiDAR values.",
        isShort: true,
      },
    ],
  },
  {
    id: 3,
    title: "Custom Cooling Funnels for PC Hardware",
    description:
      "Designed and 3D-printed cooling funnels using PLA material to direct airflow for GPU components, inspired by automotive ducted cooling systems.",
    longDescription:
      "This project was inspired by ducted cooling systems found in automotive applications, where air is directed precisely to components that need cooling.",
    image: "/images/pc-cooling-installed.jpeg",
    tags: ["3D Printing", "Fusion360", "PLA Material", "Thermal Management", "CAD Design"],
    liveUrl: null,
    githubUrl: null,
    features: [
      "Custom 3D-modeled PC case components for precise fit",
      "Automotive-inspired ducted airflow design",
      "PLA material selection for ease of printing and durability",
      "Modular design allowing easy installation and removal",
    ],
    technologies: {
      design: ["Fusion360 CAD Software", "3D Modeling and Assembly", "Airflow Simulation Principles"],
      manufacturing: ["Bambu Studio Slicing Software", "PLA Filament 3D Printing", "Multi-part Assembly Design"],
    },
    challenges:
      "One of the primary challenges was accurately measuring and modeling the internal dimensions of the PC case.",
    results:
      "The custom cooling ducts proved highly effective, reducing GPU temperatures by 8°C under full load compared to the standard case configuration.",
    storySteps: [
      {
        title: "The Problem",
        description:
          "I noticed that airflow in PC cases isn't optimized. Front intake fans push air in, but much of it disperses inside the case rather than reaching the GPU directly.",
        image: "/images/pc-airflow-problem.jpeg",
        highlight:
          "Green arrows show air coming in, red arrows show where it exits - but the path in between isn't direct",
        aspectRatio: "aspect-[4/3]",
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
        aspectRatio: "aspect-video",
      },
      {
        title: "Adding Components",
        description:
          "Next, I modeled the GPU and intake fan positions to understand the exact path the air needed to travel.",
        image: "/images/pc-case-with-gpu.png",
        highlight: "Understanding the spatial relationship between components was essential for effective duct design.",
        aspectRatio: "aspect-video",
      },
      {
        title: "Designing the Duct",
        description:
          "I designed a custom cooling funnel that would direct air from the front intake fans straight to the GPU's cooling system.",
        image: "/images/cooling-duct-design.png",
        highlight: "The duct features a gradually narrowing design to accelerate airflow as it approaches the GPU.",
        aspectRatio: "aspect-[3/2]",
      },
      {
        title: "Finalizing Components",
        description:
          "The final design included multiple components that would fit together perfectly while being printable on a standard 3D printer bed.",
        image: "/images/cooling-duct-component.png",
        highlight: "Each component was designed with both function and printability in mind.",
        aspectRatio: "aspect-[3/2]",
      },
      {
        title: "Slicing for Printing",
        description:
          "Using Bambu Studio, I prepared the 3D models for printing, setting up supports and optimizing print settings for ABS material.",
        image: "/images/bambu-studio-slicing.png",
        highlight: "The green areas show support structures needed for successful printing of complex geometries.",
        aspectRatio: "aspect-[4/3]",
      },
      {
        title: "Printed Components",
        description: "After several hours of printing, the cooling duct components were ready for installation.",
        image: "/images/printed-cooling-parts.jpeg",
        highlight: "ABS material was chosen for its heat resistance and durability in the warm PC environment.",
        aspectRatio: "aspect-video",
      },
    ],
  },
  {
    id: 4,
    title: "Cat Door Monitoring System",
    description:
      "IoT monitoring system using ESP32 and break beam sensors to track cat movement through a pet door, with real-time Telegram notifications to prevent unauthorized access.",
    longDescription:
      "This project was motivated by our family cat eating too much food and the discovery of another neighborhood cat sneaking into our house.",
    image: "/images/cat-door-v2-system.png",
    tags: ["ESP32", "IoT", "Arduino", "3D Printing", "Telegram Bot", "Break Beam Sensors"],
    liveUrl: null,
    githubUrl: null,
    features: [
      "Evolution from PIR sensors (V1) to break beam sensors (V2) for improved reliability",
      "ESP32 WiFi connectivity for real-time communication",
      "Telegram bot integration for instant mobile notifications",
      "Custom 3D printed weatherproof housing designed in Fusion360",
    ],
    technologies: {
      hardware: ["ESP32 Development Board", "Break Beam Sensors (Transmitter & Receiver)", "LED Status Indicators"],
      software: [
        "Arduino IDE for ESP32 programming",
        "WiFi Libraries for network connectivity",
        "Telegram Bot API integration",
      ],
    },
    challenges: "The primary challenge was eliminating false positives from the initial PIR sensor design.",
    results:
      "The Version 2 system with break beam sensors proved highly effective, providing reliable detection without false positives.",
    videoGallery: [
      {
        id: "4Ufpr4eA3jw",
        title: "Cat Door Monitoring System V2 Demonstration",
        description:
          "Demonstration of the Version 2 cat door monitoring system using break beam sensors, ESP32, and Telegram notifications.",
        isShort: false,
      },
    ],
  },
]

export default function ProjectDetailClient() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxAltPrefix, setLightboxAltPrefix] = useState("")

  useEffect(() => {
    const projectId = Array.isArray(id) ? Number.parseInt(id[0]) : Number.parseInt(id as string)
    const foundProject = projectsData.find((p) => p.id === projectId)

    if (foundProject) {
      setProject(foundProject)
    }
    setLoading(false)
  }, [id])

  const openLightbox = (images: string[], index: number, altPrefix: string) => {
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
      <main className="min-h-screen pt-20 pb-16 overflow-x-hidden">
        <div className="container mx-auto px-4 max-w-full">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          {/* Special layout for Construction Project */}
          {project.id === 1 ? (
            <div className="space-y-8 w-full">
              {/* Project Header */}
              <div className="text-center max-w-4xl mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">{project.title}</h1>
                  {project.course && (
                    <span className="bg-primary/90 text-white text-sm px-3 py-1 rounded">{project.course}</span>
                  )}
                </div>

                <p className="text-base sm:text-lg text-foreground/80 mb-6">{project.description}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Description */}
              <div className="max-w-4xl mx-auto px-4">
                <div className="bg-card dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg border border-border mb-6">
                  <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
                    <p>{project.longDescription}</p>
                  </div>
                </div>

                {(project.liveUrl || project.githubUrl) && (
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
                )}
              </div>

              {/* Enhanced Before/After Transformation Slider */}
              {project.beforeImage && (
                <div className="w-full max-w-7xl mx-auto mb-12 px-4">
                  <EnhancedBeforeAfterSlider
                    beforeImage={project.beforeImage}
                    afterImage={project.image}
                    beforeAlt="Before renovation - deteriorated condition"
                    afterAlt="After renovation - completed home"
                    title="Complete Transformation"
                    description="Use the slider below to see the dramatic transformation from the deteriorated starting condition to the fully renovated modern home."
                  />
                </div>
              )}

              {/* Key Features, Skills & Tools, and Challenges Tabs */}
              <div className="max-w-6xl mx-auto mb-8 px-4">
                <Tabs defaultValue="features">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="features" className="text-xs sm:text-sm">
                      Key Features
                    </TabsTrigger>
                    <TabsTrigger value="technologies" className="text-xs sm:text-sm">
                      Skills & Tools
                    </TabsTrigger>
                    <TabsTrigger value="challenges" className="text-xs sm:text-sm">
                      Challenges
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="features" className="p-4 sm:p-6 border rounded-md mt-2">
                    <h2 className="text-lg sm:text-xl font-bold mb-4">Key Features</h2>
                    <ul className="space-y-2 text-sm sm:text-base">
                      {project.features?.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="technologies" className="p-4 sm:p-6 border rounded-md mt-2">
                    <h2 className="text-lg sm:text-xl font-bold mb-4">Skills & Tools Used</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.entries(project.technologies || {}).map(([category, items]) => (
                        <div key={category}>
                          <h3 className="font-bold mb-2 capitalize text-sm sm:text-base">
                            {category.replace(/([A-Z])/g, " $1").trim()}
                          </h3>
                          <ul className="space-y-1 text-sm sm:text-base">
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
                  <TabsContent value="challenges" className="p-4 sm:p-6 border rounded-md mt-2">
                    <h2 className="text-lg sm:text-xl font-bold mb-4">Challenges & Solutions</h2>
                    <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
                      <p>{project.challenges}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Photo Galleries */}
              <div className="space-y-16 sm:space-y-32 w-full">
                {/* Construction Progress */}
                {project.exteriorGallery && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 py-8 sm:py-12 px-4 sm:px-6 rounded-xl shadow-sm w-full">
                    <div className="max-w-6xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Construction Progress</h3>
                      <p className="text-foreground/70 max-w-3xl mx-auto mb-6 sm:mb-8 text-center text-sm sm:text-base">
                        Follow the journey from the initial stages to the near-complete exterior. Click any image to
                        view it in full size.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                        {project.exteriorGallery.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openLightbox(project.exteriorGallery!, index, "Construction progress")}
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Construction progress ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Interior Finishes */}
                {project.interiorGallery && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 py-8 sm:py-12 px-4 sm:px-6 rounded-xl shadow-sm w-full">
                    <div className="max-w-6xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Interior Finishes</h3>
                      <p className="text-foreground/70 max-w-3xl mx-auto mb-6 sm:mb-8 text-center text-sm sm:text-base">
                        Explore the details of the newly renovated interior spaces. Click any image to view it in full
                        size.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                        {project.interiorGallery.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openLightbox(project.interiorGallery!, index, "Interior finishes")}
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Interior finish ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Finished Product Photos */}
                {project.finishedProductGallery && project.finishedProductGallery.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 py-8 sm:py-12 px-4 sm:px-6 rounded-xl shadow-sm w-full">
                    <div className="max-w-6xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
                        Finished Product Photos
                      </h3>
                      <p className="text-foreground/70 max-w-3xl mx-auto mb-6 sm:mb-8 text-center text-sm sm:text-base">
                        Step inside and see the final results of the renovation. Click any image to view it in full
                        size.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                        {project.finishedProductGallery.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openLightbox(project.finishedProductGallery!, index, "Finished product")}
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Finished product ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Miscellaneous Pictures */}
                {project.miscellaneousGallery && project.miscellaneousGallery.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 py-8 sm:py-12 px-4 sm:px-6 rounded-xl shadow-sm w-full">
                    <div className="max-w-6xl mx-auto">
                      <div className="text-center mb-6">
                        <p className="text-base sm:text-lg text-foreground/80 mb-2 flex items-center justify-center flex-wrap">
                          If you made it this far in the project it means you liked it!{" "}
                          <Smile className="inline-block ml-1 h-5 w-5" />
                        </p>
                        <p className="text-foreground/70 max-w-3xl mx-auto text-sm sm:text-base">
                          I hope you enjoy some more miscellaneous pictures I took.
                        </p>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
                        Miscellaneous Pictures
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                        {project.miscellaneousGallery.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openLightbox(project.miscellaneousGallery!, index, "Miscellaneous picture")}
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Miscellaneous picture ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : project.id === 3 ? (
            // PC Cooling Project Layout
            <div className="space-y-12 w-full">
              {/* Project Header */}
              <div className="text-center max-w-4xl mx-auto px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
                <p className="text-lg text-foreground/80 mb-6">{project.description}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Main Project Image */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
              </div>

              {/* Project Description */}
              <div className="max-w-4xl mx-auto">
                <div className="prose dark:prose-invert max-w-none mb-8">
                  <p>{project.longDescription}</p>
                </div>
              </div>

              {/* Story Steps Section with Background */}
              {project.storySteps && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl border border-blue-200 dark:border-blue-700 p-6 sm:p-8 mx-4 max-w-6xl mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Project Development Story</h3>
                    <p className="text-foreground/70 max-w-3xl mx-auto text-sm sm:text-base">
                      Follow the complete journey from identifying the problem to implementing the solution.
                    </p>
                  </div>

                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-blue-300 dark:bg-blue-600 h-[3000px] sm:h-[3500px]"></div>

                    <div className="space-y-8 sm:space-y-12">
                      {project.storySteps.map((step, index) => (
                        <div key={index} className="relative flex items-start gap-4 sm:gap-8">
                          {/* Timeline dot */}
                          <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm border">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
                              <div>
                                <h4 className="text-lg sm:text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">
                                  {step.title}
                                </h4>
                                <p className="text-foreground/80 mb-3 text-sm sm:text-base">{step.description}</p>
                                {step.highlight && (
                                  <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 italic">
                                    {step.highlight}
                                  </p>
                                )}
                              </div>
                              <div
                                className={`relative ${step.aspectRatio} rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity`}
                                onClick={() => openLightbox([step.image], 0, step.title)}
                              >
                                <Image
                                  src={step.image || "/placeholder.svg"}
                                  alt={step.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {project.results && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">Project Results</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-green-700 dark:text-green-300">{project.results}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : project.id === 2 ? (
            // Micromouse Project Layout
            <div className="space-y-12 w-full">
              {/* Project Header */}
              <div className="text-center max-w-4xl mx-auto px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
                <p className="text-lg text-foreground/80 mb-6">{project.description}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Main Project Image */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
              </div>

              {/* Project Description */}
              <div className="max-w-4xl mx-auto">
                <div className="prose dark:prose-invert max-w-none mb-8">
                  <p>{project.longDescription}</p>
                </div>
              </div>

              {/* Video Demonstrations for projects with videos */}
              {project.videoGallery && project.videoGallery.length > 0 && (
                <div className="max-w-6xl mx-auto mb-12 px-4">
                  <div className="text-center mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Project Demonstrations</h3>
                    <p className="text-foreground/70 max-w-3xl mx-auto text-sm sm:text-base">
                      Watch the project in action and see key features demonstrated.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {project.videoGallery.map((video, index) => (
                      <div key={index} className="space-y-4">
                        <VideoEmbed videoId={video.id} title={video.title} isShort={video.isShort} />
                        <div>
                          <h3 className="font-bold text-base sm:text-lg mb-2">{video.title}</h3>
                          <p className="text-foreground/70 text-sm">{video.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hardware and Software Galleries for Micromouse */}
              <div className="max-w-6xl mx-auto px-4">
                <Tabs defaultValue="hardware" className="mb-12">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="hardware">Hardware</TabsTrigger>
                    <TabsTrigger value="software">Software</TabsTrigger>
                  </TabsList>
                  <TabsContent value="hardware" className="mt-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-2">Hardware Components</h3>
                      <p className="text-foreground/70 text-sm sm:text-base">
                        Explore the physical components and assembly of the micromouse robot.
                      </p>
                    </div>
                    {project.hardwareGallery && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                        {project.hardwareGallery.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openLightbox(project.hardwareGallery!, index, "Hardware")}
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Hardware ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="software" className="mt-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-2">Software Implementation</h3>
                      <p className="text-foreground/70 text-sm sm:text-base">
                        View the code implementation, algorithms, and software architecture.
                      </p>
                    </div>
                    {project.softwareGallery && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                        {project.softwareGallery.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openLightbox(project.softwareGallery!, index, "Software")}
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Software ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            // Default layout for other projects
            <div className="space-y-12 w-full">
              <div className="text-center max-w-4xl mx-auto px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
                <p className="text-lg text-foreground/80 mb-6">{project.description}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Main Project Image */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
              </div>

              {/* Project Description */}
              <div className="max-w-4xl mx-auto">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed">
                    This is a detailed view of the {project.title.toLowerCase()}. More comprehensive project details and
                    galleries will be added soon.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
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
