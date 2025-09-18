"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  image: string
  beforeImage?: string
  exteriorGallery?: string[]
  interiorGallery?: string[]
  finishedProductGallery?: string[]
  miscellaneousGallery?: string[]
  hardwareGallery?: string[]
  softwareGallery?: string[]
  designGallery?: string[]
  printingGallery?: string[]
  installationGallery?: string[]
  notificationGallery?: string[]
  gallery?: string[]
  videoGallery?: Array<{
    id: string
    title: string
    description: string
    isShort: boolean
  }>
  storySteps?: Array<{
    title: string
    description: string
    image: string
    highlight?: string
    aspectRatio?: string
  }>
  collapsibleSections?: Array<{
    title: string
    content: string
  }>
  tags: string[]
  liveUrl: string | null
  githubUrl: string | null
  features: string[]
  technologies: Record<string, string[]>
  challenges: string
  results?: string
  learnings?: string[]
  course?: string
  tagline?: string
}

// This would typically come from a database or API
const projectsData: Project[] = [
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
    title: "UR5e Robotic Writing System",
    description: "A robot that writes math problems and solves them on paper using MATLAB programming.",
    longDescription: `I programmed a UR5e robot to write and solve math problems on paper. The robot can write individual numbers, move them around the page, and even solve addition, subtraction, and multiplication problems in the traditional long-form style you'd see in school.

The coolest part is watching it work - the robot moves smoothly like a human hand, lifting the pen between strokes and positioning everything perfectly on the page. It's basically like having a robot do your math homework, but way more impressive.`,
    image: "/images/ur5e-main-setup.jpeg",
    gallery: ["/images/ur5e-main-setup.jpeg", "/images/ur5e-calculation-example.jpeg"],
    videoGallery: [
      {
        id: "pXVlnAXTHe0",
        title: "Robot Writing Numbers",
        description: "Watch the UR5e robot write individual digits with smooth, precise movements.",
        isShort: false,
      },
      {
        id: "O-SpeSzh-Yo",
        title: "Math Problem Solving",
        description:
          "The robot solves a complete multiplication problem, showing all the steps just like you would on paper.",
        isShort: false,
      },
      {
        id: "efF5-d9ksCc",
        title: "Advanced Calculations",
        description: "More complex mathematical operations demonstrated by the robotic writing system.",
        isShort: false,
      },
    ],
    tags: ["MATLAB", "UR5e Robot", "Robotics", "Programming"],
    liveUrl: null,
    githubUrl: null,
    features: [
      "Writes individual numbers and math symbols",
      "Solves addition, subtraction, and multiplication problems",
      "Moves text around the page to any position",
      "Smooth, human-like writing motion",
      "Automatic pen lifting between strokes",
      "Perfect spacing and alignment",
    ],
    technologies: {
      software: ["MATLAB Programming", "Robot Control Algorithms", "Motion Planning"],
      hardware: ["UR5e Collaborative Robot", "Writing Tool Attachment", "Grid Paper Workspace"],
    },
    challenges: `The biggest challenge was making the robot write smoothly like a human. I had to program it to know when to lift the pen, how fast to move, and where to position each part of the math problem.

Getting the spacing right was tricky too - the robot needed to know exactly where to put each number so the final answer would line up correctly, just like when you do long division or multiplication by hand.`,
    learnings: [
      "Robot programming and control",
      "Motion planning for smooth movement",
      "Coordinate systems and positioning",
      "MATLAB programming skills",
    ],
  },
  {
    id: 5,
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
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
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

  const openLightbox = (images: string[], index: number, altPrefix: string) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxAltPrefix(altPrefix)
    setLightboxOpen(true)
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
    <main className="min-h-screen pt-20 pb-16 overflow-x-hidden">
      <div className="container mx-auto px-4">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        {/* Special layout for UR5e Robotic Writing System */}
        {project.id === 4 ? (
          <div className="space-y-12">
            {/* Project Header */}
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
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
            <div className="max-w-4xl mx-auto mb-12">
              <div className="prose dark:prose-invert max-w-none text-center">
                <p className="text-lg leading-relaxed">{project.longDescription}</p>
              </div>
            </div>

            {/* Video Demonstrations */}
            <div className="max-w-6xl mx-auto mb-12">
              <h2 className="text-2xl font-bold text-center mb-8">Watch It In Action</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {project.videoGallery?.map((video, index) => (
                  <div key={index} className="space-y-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                      <p className="text-foreground/70 text-sm">{video.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="max-w-6xl mx-auto mb-12">
              <h2 className="text-2xl font-bold text-center mb-8">Project Photos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery?.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-64 md:h-80 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(project.gallery || [], index, "UR5e project")}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`UR5e project ${index + 1}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* What I Learned */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-muted/30 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">What I Learned</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold mb-4 text-primary">Key Skills</h3>
                    <ul className="space-y-2">
                      {project.learnings?.map((learning, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-foreground/80">{learning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold mb-4 text-primary">Challenges</h3>
                    <p className="text-foreground/80 leading-relaxed">{project.challenges}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Other project layouts remain the same */
          <div className="space-y-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
              <p className="text-lg text-foreground/80 mb-6">{project.description}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="max-w-4xl mx-auto mb-12">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="prose dark:prose-invert max-w-none mb-8">
                <p>{project.longDescription}</p>
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
          </div>
        )}
      </div>
    </main>
  )
}
