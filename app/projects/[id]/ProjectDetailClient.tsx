"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, Smile } from "lucide-react" // Added Smile icon
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BeforeAfterSlider from "@/components/before-after-slider"
import EnhancedBeforeAfterSlider from "@/components/enhanced-before-after-slider"
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
This project involved completely renovating a deteriorated building into a modern home. Working with my father, I gained hands-on experience in all aspects of construction.

From demolition to finishing touches, we handled everything - structural work, roofing, electrical, plumbing, and interior design. The project required careful planning and coordination of different trades.

The transformation showcases both my technical construction skills and project management abilities. Every step was completed with attention to building codes and quality standards.
`,
    image: "/images/construction-after.jpg",
    beforeImage: "/images/construction-before-new.png",
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
    tags: ["Construction", "Renovation", "Project Management", "Building Codes"],
    liveUrl: null,
    githubUrl: null,
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
    course: "MTRN3100",
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
        description:
          "Full demonstration of the Micromouse robot navigating through a complex maze environment using its sensor array and path planning algorithms.",
        isShort: false,
      },
      {
        id: "ZRjj2WblTCQ",
        title: "Early Testing - Accuracy Focus",
        description:
          "This video shows early testing of the micromouse robot where we prioritized getting accurate movement over speed. The robot demonstrates precise navigation and turning capabilities.",
        isShort: false,
      },
      {
        id: "B2lfw8Rdm6E",
        title: "PID Control Straight Line Demonstration",
        description:
          "This video demonstrates the PID controller in action alongside aid from LiDAR values, showing how the robot maintains a straight line path with precise motor control.",
        isShort: true,
      },
    ],
    tags: ["C++", "Python", "Arduino", "Computer Vision", "Robotics", "OpenCV"],
    liveUrl: null,
    githubUrl: "https://github.com/z5360700/micromouse-from2024",
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
    title: "Custom Cooling Funnels for PC Hardware",
    description:
      "Designed and 3D-printed cooling funnels using PLA material to direct airflow for GPU components, inspired by automotive ducted cooling systems.",
    longDescription: `
This project was inspired by ducted cooling systems found in automotive applications, where air is directed precisely to components that need cooling. The idea emerged from observing that airflow transfer in PC cases isn't well optimized, with much of the intake air not reaching critical components like the GPU effectively.

The project began with identifying the airflow optimization problem in my PC case, where front intake fans weren't efficiently directing cool air to the graphics card. Taking inspiration from automotive ducted parts that channel air directly to specific engine components, I designed custom cooling funnels to create a direct airflow path from the front case fans to the GPU.

The solution involved precise 3D modeling of the PC case components, designing custom ducting that would fit perfectly within the case constraints, and 3D printing the parts using PLA material for heat resistance and durability.
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
        aspectRatio: "aspect-video", // Changed from aspect-square to aspect-video
      },
      {
        title: "Adding Components",
        description:
          "Next, I modeled the GPU and intake fan positions to understand the exact path the air needed to travel.",
        image: "/images/pc-case-with-gpu.png",
        highlight: "Understanding the spatial relationship between components was essential for effective duct design.",
        aspectRatio: "aspect-video", // Changed from aspect-square to aspect-video
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
    tags: ["3D Printing", "Fusion360", "PLA Material", "Thermal Management", "CAD Design"],
    liveUrl: null,
    githubUrl: null,
    features: [
      "Custom 3D-modeled PC case components for precise fit",
      "Automotive-inspired ducted airflow design",
      "PLA material selection for ease of printing and durability",
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
        "PLA Filament 3D Printing",
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
  
  Material selection was important for this application. PLA was chosen for its ease of printing and good structural properties, making it ideal for prototyping and testing the ducting design.
  
  Validating the effectiveness of the cooling solution required establishing baseline temperature measurements and conducting controlled testing under various load conditions. Ensuring that the ducting actually improved cooling performance rather than just redirecting airflow was essential to the project's success.
`,
    results: `
  The custom cooling ducts proved highly effective, reducing GPU temperatures by 8°C under full load compared to the standard case configuration. This temperature reduction allowed the GPU to maintain higher boost clocks for longer periods, resulting in more consistent performance during demanding tasks like gaming and 3D rendering.
  
  An unexpected benefit was the reduction in fan noise, as the GPU's cooling system didn't need to work as hard to maintain safe temperatures. The direct airflow path also reduced dust accumulation on the GPU, as air was now following a more controlled path through the case.
  
  The project demonstrated how principles from automotive cooling systems could be successfully applied to PC hardware cooling, opening up possibilities for further optimization of other components like CPU coolers and memory modules.
`,
  },
  {
    id: 4,
    title: "Cat Door Monitoring System",
    description:
      "IoT monitoring system using ESP32 and break beam sensors to track cat movement through a pet door, with real-time Telegram notifications to prevent unauthorized access.",
    longDescription: `
This project was motivated by our family cat eating too much food and the discovery of another neighborhood cat sneaking into our house. The cat eats downstairs away from the kitchen, and we had caught the intruder cat inside the house around 3 times, prompting the need for a monitoring solution.

The system evolved through two major versions. Version 1 used a PIR sensor but proved unreliable as it was triggered by cockroaches and would activate when opening the door. Version 2 implemented break beam sensors, which worked much more effectively and reliably.

The ESP32 connects via WiFi to send notifications through a Telegram bot, providing real-time alerts whenever the beam is broken. This project was particularly rewarding because within the first 2 days of deployment, I immediately caught the other cat coming into the house and found him in the backyard.

Future versions will include double break beam sensors to determine direction of movement, and potentially RFID tags or camera-based identification using computer vision knowledge gained from the micromouse project.
`,
    image: "/images/cat-door-v2-system.png",
    designGallery: [
      "/images/cat-door-v1.jpeg",
      "/images/cat-door-cad-design.jpeg",
      "/images/cat-door-cad-slicing.jpeg",
      "/images/cat-door-3d-printed.png",
      "/images/cat-door-v2-system.png",
    ],
    notificationGallery: ["/images/cat-door-telegram-notifications.png"],
    videoGallery: [
      {
        id: "4Ufpr4eA3jw",
        title: "Cat Door Monitoring System V2 Demonstration",
        description:
          "Demonstration of the Version 2 cat door monitoring system using break beam sensors, ESP32, and Telegram notifications.",
        isShort: false,
      },
    ],
    tags: ["ESP32", "IoT", "Arduino", "3D Printing", "Telegram Bot", "Break Beam Sensors"],
    liveUrl: null,
    githubUrl: null,
    features: [
      "Evolution from PIR sensors (V1) to break beam sensors (V2) for improved reliability",
      "ESP32 WiFi connectivity for real-time communication",
      "Telegram bot integration for instant mobile notifications",
      "Custom 3D printed weatherproof housing designed in Fusion360",
      "LED status indicators for visual feedback",
      "Sensor debouncing to prevent false triggers",
      "Low power consumption for continuous operation",
      "Immediate detection and notification of unauthorized access",
      "Timestamped activity logs for behavior analysis",
      "Modular design for easy maintenance and upgrades",
    ],
    technologies: {
      hardware: [
        "ESP32 Development Board",
        "Break Beam Sensors (Transmitter & Receiver)",
        "LED Status Indicators",
        "3D Printed PLA Housing",
        "Breadboard Prototyping",
        "Weatherproof Connectors",
      ],
      software: [
        "Arduino IDE for ESP32 programming",
        "WiFi Libraries for network connectivity",
        "Telegram Bot API integration",
        "Sensor debouncing algorithms",
        "Real-time notification system",
        "Serial communication for debugging",
      ],
      design: [
        "Fusion360 CAD Software",
        "3D Modeling and Assembly",
        "Bambu Lab 3D Printing",
        "Weatherproof Enclosure Design",
        "Component Integration Planning",
        "Print Support Optimization",
      ],
    },
    challenges: `
The primary challenge was eliminating false positives from the initial PIR sensor design. The PIR sensor was too sensitive and would trigger from small animals like cockroaches, as well as when the door itself was opened. This led to the redesign using break beam sensors, which provide much more precise detection.

Designing a weatherproof housing that could accommodate all components while maintaining sensor alignment was another significant challenge. The 3D printed enclosure needed to protect the electronics from outdoor conditions while allowing proper sensor operation.

Implementing reliable WiFi connectivity and Telegram bot integration required careful handling of network timeouts and reconnection logic. The system needed to be robust enough to operate continuously without manual intervention.

Power management was also a consideration, as the system needed to run continuously while minimizing power consumption. Optimizing the ESP32 sleep modes and sensor polling frequency was essential for long-term operation.

Future development will focus on implementing directional detection using dual break beam sensors, which will require more sophisticated timing algorithms to determine whether the cat is entering or leaving the house.
`,
    results: `
The Version 2 system with break beam sensors proved highly effective, providing reliable detection without false positives. Within the first two days of deployment, the system successfully detected and alerted me to the neighborhood cat's intrusion, allowing me to locate and remove the intruder from the backyard.

The Telegram notification system provides excellent real-time monitoring capabilities, with timestamped alerts that help track the cat's movement patterns throughout the day. This data has been valuable for understanding feeding schedules and outdoor activity.

The 3D printed housing has proven durable in outdoor conditions, protecting the electronics while maintaining proper sensor alignment. The modular design has made it easy to perform maintenance and upgrades as needed.

The project successfully solved the original problem of unauthorized access while providing valuable insights into the cat's behavior patterns. The immediate success in catching the intruder cat validated the effectiveness of the monitoring approach.
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
    const projectId = Array.isArray(id) ? Number.parseInt(id[0]) : Number.parseInt(id as string)
    const foundProject = projectsData.find((p) => p.id === projectId)

    if (foundProject) {
      setProject(foundProject)
    } else {
      console.error(`Project with ID ${projectId} not found`)
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
            <div className="space-y-8">
              {/* Project Header */}
              <div className="text-center max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                  {project.course && (
                    <span className="bg-primary/90 text-white text-sm px-3 py-1 rounded">{project.course}</span>
                  )}
                </div>

                <p className="text-lg text-foreground/80 mb-6">{project.description}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* Project Description */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-card dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-border mb-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{project.longDescription}</p>
                  </div>
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
              {/* Enhanced Before/After Transformation Slider */}
              <div className="max-w-7xl mx-auto mb-12">
                <EnhancedBeforeAfterSlider
                  beforeImage="/images/construction-before-new.png"
                  afterImage="/images/construction-after.jpg"
                  beforeAlt="Before renovation - deteriorated condition"
                  afterAlt="After renovation - completed home"
                  title="Complete Transformation"
                  description="Use the slider below to see the dramatic transformation from the deteriorated starting condition to the fully renovated modern home."
                />
              </div>
              {/* Key Features, Skills & Tools, and Challenges Tabs */}
              <div className="max-w-6xl mx-auto mb-8">
                <Tabs defaultValue="features">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="features">Key Features</TabsTrigger>
                    <TabsTrigger value="technologies">Skills & Tools</TabsTrigger>
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
                    <h2 className="text-xl font-bold mb-4">Skills & Tools Used</h2>
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
              </div>

              {/* Photo Galleries with Clear Grouping */}
              <div className="space-y-32">
                {/* Group 1: Construction Progress */}
                <div className="bg-gray-50 dark:bg-gray-900/50 py-12 px-6 rounded-xl shadow-sm">
                  <div className="max-w-6xl mx-auto">
                    <h3 className="text-3xl font-bold mb-6 text-center">Construction Progress</h3>
                    <p className="text-foreground/70 max-w-3xl mx-auto mb-8 text-center">
                      Follow the journey from the initial stages to the near-complete exterior. Click any image to view
                      it in full size.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {project.exteriorGallery.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openLightbox(project.exteriorGallery, index, "Construction progress")}
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

                {/* Group 2: Interior Finishes */}
                <div className="bg-gray-50 dark:bg-gray-900/50 py-12 px-6 rounded-xl shadow-sm">
                  <div className="max-w-6xl mx-auto">
                    <h3 className="text-3xl font-bold mb-6 text-center">Interior Finishes</h3>
                    <p className="text-foreground/70 max-w-3xl mx-auto mb-8 text-center">
                      Explore the details of the newly renovated interior spaces, showcasing modern design and quality
                      craftsmanship. Click any image to view it in full size.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {project.interiorGallery.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openLightbox(project.interiorGallery, index, "Interior finishes")}
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

                {/* Group 3: Finished Product Photos */}
                {project.finishedProductGallery && project.finishedProductGallery.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 py-12 px-6 rounded-xl shadow-sm">
                    <div className="max-w-6xl mx-auto">
                      <h3 className="text-3xl font-bold mb-6 text-center">Finished Product Photos</h3>
                      <p className="text-foreground/70 max-w-3xl mx-auto mb-8 text-center">
                        Step inside and see the final results of the renovation. These photos highlight the completed
                        interiors and overall quality of the finished home. Click any image to view it in full size.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {project.finishedProductGallery.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openLightbox(project.finishedProductGallery, index, "Finished product")}
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

                {/* Group 4: Miscellaneous Pictures */}
                {project.miscellaneousGallery && project.miscellaneousGallery.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 py-12 px-6 rounded-xl shadow-sm">
                    <div className="max-w-6xl mx-auto">
                      <div className="text-center mb-6">
                        <p className="text-lg text-foreground/80 mb-2 flex items-center justify-center">
                          If you made it this far in the project it means you liked it!{" "}
                          <Smile className="inline-block ml-1 h-5 w-5" />
                        </p>
                        <p className="text-foreground/70 max-w-3xl mx-auto">
                          I hope you enjoy some more miscellaneous pictures I took.
                        </p>
                      </div>
                      <h3 className="text-3xl font-bold mb-6 text-center">Miscellaneous Pictures</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {project.miscellaneousGallery.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openLightbox(project.miscellaneousGallery, index, "Miscellaneous picture")}
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
          ) : project.id === 2 ? (
            // Special layout for Micromouse project
            <div className="space-y-12">
              {/* Project Header */}
              <div className="text-center max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                  {project.course && (
                    <span className="bg-primary/90 text-white text-sm px-3 py-1 rounded">{project.course}</span>
                  )}
                </div>

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
              <div className="max-w-4xl mx-auto mb-12">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
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

              {/* Video Demonstrations Section */}
              <div className="max-w-6xl mx-auto mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">Project Demonstrations</h3>
                  <p className="text-foreground/70 max-w-3xl mx-auto">
                    Watch the micromouse robot in action, demonstrating key features like PID control and autonomous
                    maze navigation.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left column - First two videos */}
                  <div className="space-y-8">
                    {project.videoGallery.slice(0, 2).map((video, index) => (
                      <div key={index} className="space-y-4">
                        <VideoEmbed videoId={video.id} title={video.title} isShort={video.isShort} />
                        <div>
                          <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                          <p className="text-foreground/70 text-sm">{video.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right column - PID video */}
                  <div className="space-y-4">
                    <VideoEmbed
                      videoId={project.videoGallery[2].id}
                      title={project.videoGallery[2].title}
                      isShort={project.videoGallery[2].isShort}
                    />
                    <div>
                      <h3 className="font-bold text-lg mb-2">{project.videoGallery[2].title}</h3>
                      <p className="text-foreground/70 text-sm">{project.videoGallery[2].description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hardware and Software Galleries */}
              <div className="max-w-6xl mx-auto">
                <Tabs defaultValue="hardware" className="mb-12">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="hardware">Hardware</TabsTrigger>
                    <TabsTrigger value="software">Software</TabsTrigger>
                  </TabsList>
                  <TabsContent value="hardware" className="mt-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold mb-2">Hardware Components</h3>
                      <p className="text-foreground/70">
                        Explore the physical components and assembly of the micromouse robot.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {project.hardwareGallery.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openLightbox(project.hardwareGallery, index, "Hardware")}
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
                  </TabsContent>
                  <TabsContent value="software" className="mt-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold mb-2">Software Implementation</h3>
                      <p className="text-foreground/70">
                        View the code implementation, algorithms, and software architecture.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.softwareGallery.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openLightbox(project.softwareGallery, index, "Software")}
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
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : project.id === 4 ? (
            // Special layout for Cat Door Monitoring System
            <div className="space-y-12">
              {/* Project Header */}
              <div className="text-center max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                  {project.course && (
                    <span className="bg-primary/90 text-white text-sm px-3 py-1 rounded">{project.course}</span>
                  )}
                </div>

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
              <div className="max-w-4xl mx-auto mb-12">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
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

              {/* Video Demonstration Section */}
              {project.videoGallery && project.videoGallery.length > 0 && (
                <div className="max-w-4xl mx-auto mb-12">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4">System Demonstration</h3>
                    <p className="text-foreground/70 max-w-3xl mx-auto mb-4">
                      Watch the Version 2 cat door monitoring system in action, demonstrating the break beam sensor
                      detection and real-time notifications.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
                      <p className="text-blue-800 dark:text-blue-200 text-center">
                        Notice how the <span className="text-sky-400 font-medium">blue LED turns on</span> when the cat
                        passes through.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {project.videoGallery.map((video, index) => (
                      <div key={index} className="space-y-4">
                        <VideoEmbed videoId={video.id} title={video.title} isShort={video.isShort} />
                        <div className="text-center">
                          <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                          <p className="text-foreground/70">{video.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Evolution Story */}
              <div className="max-w-6xl mx-auto mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">Project Evolution: From V1 to V2</h3>
                  <p className="text-foreground/70 max-w-3xl mx-auto">
                    Follow the development journey from the initial PIR sensor design to the final break beam sensor
                    solution.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  {/* Version 1 Story */}
                  <div className="space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="text-xl font-bold text-red-800 dark:text-red-200 mb-3">
                        Version 1: PIR Sensor (Failed)
                      </h4>
                      <p className="text-red-700 dark:text-red-300 mb-4">
                        The initial design used a PIR (Passive Infrared) sensor to detect motion through the cat door.
                        However, this approach proved unreliable due to false triggers from small animals like
                        cockroaches and activation when the door itself was opened.
                      </p>
                      <div
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openLightbox(["/images/cat-door-v1.jpeg"], 0, "Version 1 PIR sensor setup")}
                      >
                        <Image
                          src="/images/cat-door-v1.jpeg"
                          alt="Version 1 with PIR sensor"
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2 italic">
                        Click image to view full size - Version 1 setup with PIR sensor mounted above the cat door
                      </p>
                    </div>
                  </div>

                  {/* Version 2 Story */}
                  <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="text-xl font-bold text-green-800 dark:text-green-200 mb-3">
                        Version 2: Break Beam Sensor (Success)
                      </h4>
                      <p className="text-green-700 dark:text-green-300 mb-4">
                        The redesigned system uses break beam sensors that create an invisible infrared beam across the
                        door opening. This provides much more precise detection with virtually no false positives,
                        successfully solving the reliability issues of Version 1.
                      </p>
                      <div
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() =>
                          openLightbox(["/images/cat-door-v2-system.png"], 0, "Version 2 break beam sensor system")
                        }
                      >
                        <Image
                          src="/images/cat-door-v2-system.png"
                          alt="Version 2 with break beam sensors and ESP32"
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2 italic">
                        Click image to view full size - Version 2 system with ESP32, break beam sensors, and Arduino IDE
                        code
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Design and Manufacturing Process */}
              <div className="max-w-6xl mx-auto mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">Design & Manufacturing Process</h3>
                  <p className="text-foreground/70 max-w-3xl mx-auto">
                    The project required custom 3D printed housing to protect the electronics while maintaining sensor
                    alignment.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <div
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openLightbox(["/images/cat-door-cad-design.jpeg"], 0, "CAD design in Fusion360")}
                    >
                      <Image
                        src="/images/cat-door-cad-design.jpeg"
                        alt="CAD design in Fusion360"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold mb-1">CAD Design</h4>
                      <p className="text-sm text-foreground/70">3D modeling the sensor housing in Fusion360</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openLightbox(["/images/cat-door-cad-slicing.jpeg"], 0, "3D printing preparation")}
                    >
                      <Image
                        src="/images/cat-door-cad-slicing.jpeg"
                        alt="3D printing slicing preparation"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold mb-1">Print Preparation</h4>
                      <p className="text-sm text-foreground/70">Slicing software with support structures</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openLightbox(["/images/cat-door-3d-printed.png"], 0, "3D printed housing")}
                    >
                      <Image
                        src="/images/cat-door-3d-printed.png"
                        alt="3D printed housing on printer bed"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold mb-1">3D Printing</h4>
                      <p className="text-sm text-foreground/70">Completed housing on Bambu Lab printer</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() =>
                        openLightbox(["/images/cat-door-telegram-notifications.png"], 0, "Telegram notifications")
                      }
                    >
                      <Image
                        src="/images/cat-door-telegram-notifications.png"
                        alt="Telegram bot notifications on phone"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold mb-1">Real-time Alerts</h4>
                      <p className="text-sm text-foreground/70">Telegram notifications showing detection events</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results and Success Story */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-primary/5 p-8 rounded-lg border border-primary/20">
                  <h3 className="text-2xl font-bold mb-4 text-center">Immediate Success</h3>
                  <div className="prose dark:prose-invert max-w-none text-center">
                    <p className="text-lg mb-4">
                      The project was incredibly rewarding because within the first 2 days of deployment, I immediately
                      caught the neighborhood cat coming into the house and found him in the backyard!
                    </p>
                    <p className="text-foreground/80">
                      The system now provides reliable monitoring of our cat's movement patterns while successfully
                      preventing unauthorized access from the intruder cat. The real-time Telegram notifications allow
                      us to track feeding schedules and ensure our cat's food is protected.
                    </p>
                  </div>
                </div>
              </div>

              {/* Future Development */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-muted/30 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4 text-center">Future Enhancements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-2 text-primary">Next Version Features</h4>
                      <ul className="space-y-2 text-foreground/80">
                        <li>• Double break beam sensors for directional detection</li>
                        <li>• Determine if cat is entering or leaving</li>
                        <li>• RFID tags for individual cat identification</li>
                        <li>• Camera-based identification using computer vision</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2 text-primary">Technical Improvements</h4>
                      <ul className="space-y-2 text-foreground/80">
                        <li>• Enhanced weatherproofing for outdoor durability</li>
                        <li>• Battery backup for continuous operation</li>
                        <li>• Data logging for behavior analysis</li>
                        <li>• Integration with home automation systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : project.id === 3 ? (
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
                {/* Background that covers story steps only */}
                <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 rounded-2xl p-8 mb-16 border border-slate-200/50 dark:border-slate-700/30 shadow-sm">
                  <div className="relative">
                    {/* Main timeline line - much longer to ensure it covers everything */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "200rem" }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary/20 z-0 hidden md:block"
                      style={{ top: 0 }}
                    ></motion.div>

                    {/* Story steps */}
                    {project.storySteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`relative mb-24 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl shadow-sm border border-gray-200/40 dark:border-gray-600/40`}
                      >
                        {/* Timeline dot - hidden on mobile */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary border-4 border-white dark:border-gray-800 z-10 hidden md:block shadow-lg"></div>

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
                  </div>
                </div>

                {/* Gap section - no timeline line */}
                <div className="mb-24"></div>

                {/* Before/After Installation Comparison - Standalone section */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.3, delay: 0.1 }}
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

                {/* Testing Methodology Section */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.3, delay: 0.12 }}
                  className="relative mb-24"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-6">Testing Methodology</h3>
                    <div className="max-w-4xl mx-auto bg-muted/30 p-8 rounded-lg">
                      <p className="text-foreground/80 mb-4">
                        To validate the effectiveness of the cooling ducts, comprehensive testing was conducted under
                        controlled conditions. Both configurations were tested in an identical setup within a 21°C room
                        temperature environment.
                      </p>
                      <p className="text-foreground/80 mb-4">
                        The testing utilized MSI Afterburner for real-time monitoring and data logging, while Kombustor
                        v4.1.31.0 was used for stress testing the GPU. Each test session lasted 8 minutes to ensure the
                        system reached thermal steady state.
                      </p>
                      <p className="text-foreground/80">
                        The results showed a significant 7°C temperature difference at steady state between the ducted
                        and non-ducted configurations. Importantly, both the core clock and memory clock frequencies
                        remained stable throughout testing, indicating no thermal throttling occurred in either
                        configuration.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Test Results Comparison */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.3, delay: 0.13 }}
                  className="relative mb-24"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-6">Performance Test Results</h3>
                    <p className="text-foreground/70 mb-8 max-w-3xl mx-auto">
                      Side-by-side comparison of GPU monitoring data showing temperature, usage, clock speeds, and power
                      consumption during identical 8-minute stress tests.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                      {/* With Ducting Results */}
                      <div className="space-y-4">
                        <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg bg-muted/20">
                          <Image
                            src="/images/gpu-test-with-ducting.png"
                            alt="GPU monitoring data with ducted cooling"
                            fill
                            className="object-contain p-2"
                            onClick={() =>
                              openLightbox(["/images/gpu-test-with-ducting.png"], 0, "GPU test with ducting")
                            }
                          />
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                          <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">With Ducted Cooling</h4>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• Max Temperature: 63°C</li>
                            <li>• Core Clock: 2610 MHz (stable)</li>
                            <li>• Memory Clock: 10502 MHz</li>
                            <li>• Power Draw: ~197W</li>
                          </ul>
                        </div>
                      </div>

                      {/* Without Ducting Results */}
                      <div className="space-y-4">
                        <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg bg-muted/20">
                          <Image
                            src="/images/gpu-test-without-ducting.png"
                            alt="GPU monitoring data without ducted cooling"
                            fill
                            className="object-contain p-2"
                            onClick={() =>
                              openLightbox(["/images/gpu-test-without-ducting.png"], 0, "GPU test without ducting")
                            }
                          />
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">Without Ducted Cooling</h4>
                          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                            <li>• Max Temperature: 70°C</li>
                            <li>• Core Clock: 2530 MHz (stable)</li>
                            <li>• Memory Clock: 10502 MHz</li>
                            <li>• Power Draw: ~197W</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 max-w-4xl mx-auto bg-primary/5 p-6 rounded-lg border border-primary/20">
                      <h4 className="text-lg font-bold mb-3">Key Benefits</h4>
                      <p className="text-foreground/80">
                        The 7°C temperature reduction is particularly beneficial because it allows the GPU's cooling
                        fans to operate at lower speeds while maintaining the same thermal performance. This results in
                        significantly quieter operation during demanding workloads, improving the overall user
                        experience without sacrificing performance.
                      </p>
                    </div>
                  </div>
                </motion.div>
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

          {project.id !== 1 && (
            <Tabs defaultValue="features" className="mb-12 mt-16">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="features">Key Features</TabsTrigger>
                <TabsTrigger value="technologies">Technologies</TabsTrigger>
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
                <h2 className="text-xl font-bold mb-4">Technologies Used</h2>
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
          )}
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
