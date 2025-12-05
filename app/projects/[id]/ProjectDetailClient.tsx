"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnhancedBeforeAfterSlider from "@/components/enhanced-before-after-slider"
import ImageLightbox from "@/components/image-lightbox"

import { projectsData, type Project } from "@/data/projects-data"
import { ProjectHeader } from "@/components/project-detail/project-header"
import { ProjectTabs } from "@/components/project-detail/project-tabs"
import { ImageGallery } from "@/components/project-detail/image-gallery"
import { VideoGallery } from "@/components/project-detail/video-gallery"
import { ResultsSection } from "@/components/project-detail/results-section"

function ProjectDetailClient() {
  const router = useRouter()
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxAltPrefix, setLightboxAltPrefix] = useState("")

  const exteriorRef = useRef<HTMLDivElement>(null)
  const interiorRef = useRef<HTMLDivElement>(null)
  const finishedRef = useRef<HTMLDivElement>(null)
  const additionalRef = useRef<HTMLDivElement>(null)

  const [exteriorIndex, setExteriorIndex] = useState(0)
  const [interiorIndex, setInteriorIndex] = useState(0)
  const [finishedIndex, setFinishedIndex] = useState(0)
  const [additionalIndex, setAdditionalIndex] = useState(0)

  useEffect(() => {
    const projectId = Array.isArray(id) ? Number.parseInt(id[0]) : Number.parseInt(id as string)
    const foundProject = projectsData.find((p) => p.id === projectId)

    if (foundProject) {
      setProject(foundProject)
    } else {
      console.error(`Project with ID ${projectId} not found`)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    if (!project || lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [project, lightboxOpen])

  // Lightbox functions
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

  // Gallery navigation functions for Construction project
  const navigateExterior = (direction: "prev" | "next") => {
    if (!project?.exteriorGallery) return
    const length = project.exteriorGallery.length
    setExteriorIndex((prev) => (direction === "next" ? (prev + 1) % length : (prev - 1 + length) % length))
  }

  const navigateInterior = (direction: "prev" | "next") => {
    if (!project?.interiorGallery) return
    const length = project.interiorGallery.length
    setInteriorIndex((prev) => (direction === "next" ? (prev + 1) % length : (prev - 1 + length) % length))
  }

  const navigateFinished = (direction: "prev" | "next") => {
    if (!project?.finishedProductGallery) return
    const length = project.finishedProductGallery.length
    setFinishedIndex((prev) => (direction === "next" ? (prev + 1) % length : (prev - 1 + length) % length))
  }

  const navigateAdditional = (direction: "prev" | "next") => {
    if (!project?.miscellaneousGallery) return
    const length = project.miscellaneousGallery.length
    setAdditionalIndex((prev) => (direction === "next" ? (prev + 1) % length : (prev - 1 + length) % length))
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-3 max-w-7xl">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        {/* Construction project layout */}
        {project.id === 1 ? (
          <div className="space-y-8">
            <ProjectHeader project={project} />

            {/* Before/After Slider */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <h2 className="text-xl font-bold text-center mb-6">Transformation</h2>
              <div className="max-w-5xl mx-auto">
                <EnhancedBeforeAfterSlider
                  beforeImage={project.beforeImage || "/placeholder.svg"}
                  afterImage={project.image}
                  beforeAlt="Before renovation"
                  afterAlt="After renovation"
                />
              </div>
            </div>

            {/* Project Description */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed">{project.longDescription}</p>
              </div>
            </div>

            {/* Photo Galleries */}
            <div className="space-y-8">
              {project.exteriorGallery && (
                <ImageGallery
                  title="Exterior Construction"
                  images={project.exteriorGallery}
                  selectedIndex={exteriorIndex}
                  onImageClick={openLightbox}
                  onNavigate={navigateExterior}
                  altPrefix="Exterior construction"
                  showNavigation
                />
              )}

              {project.interiorGallery && (
                <ImageGallery
                  title="Interior Work"
                  images={project.interiorGallery}
                  selectedIndex={interiorIndex}
                  onImageClick={openLightbox}
                  onNavigate={navigateInterior}
                  altPrefix="Interior work"
                  columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  imageHeight="h-40"
                  showNavigation
                />
              )}

              {project.finishedProductGallery && (
                <ImageGallery
                  title="Finished Product"
                  images={project.finishedProductGallery}
                  selectedIndex={finishedIndex}
                  onImageClick={openLightbox}
                  onNavigate={navigateFinished}
                  altPrefix="Finished product"
                  columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  imageHeight="h-40"
                  showNavigation
                />
              )}

              {project.miscellaneousGallery && (
                <ImageGallery
                  title="Additional Photos"
                  images={project.miscellaneousGallery}
                  selectedIndex={additionalIndex}
                  onImageClick={openLightbox}
                  onNavigate={navigateAdditional}
                  altPrefix="Additional photos"
                  showNavigation
                  maxImages={18}
                  showViewAll
                />
              )}
            </div>

            <ProjectTabs project={project} />
          </div>
        ) : project.id === 2 ? (
          /* Micromouse project layout */
          <div className="space-y-8">
            <ProjectHeader project={project} />

            {/* Main Project Image */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="relative aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
            </div>

            {/* Project Description */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-line">{project.longDescription}</p>
              </div>
            </div>

            {/* GitHub Link */}
            {project.githubUrl && (
              <div className="text-center bg-muted/10 rounded-lg p-4 border">
                <Button asChild>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github size={16} />
                    View Source Code
                  </a>
                </Button>
              </div>
            )}

            {/* Video Demonstrations */}
            {project.videoGallery && <VideoGallery title="Video Demonstrations" videos={project.videoGallery} />}

            {/* Hardware and Software Galleries */}
            <div className="space-y-8">
              {project.hardwareGallery && (
                <ImageGallery
                  title="Hardware Development"
                  images={project.hardwareGallery}
                  onImageClick={openLightbox}
                  altPrefix="Hardware development"
                  columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  imageHeight="h-40"
                />
              )}

              {project.softwareGallery && (
                <ImageGallery
                  title="Software Development"
                  images={project.softwareGallery}
                  onImageClick={openLightbox}
                  altPrefix="Software development"
                  columns="grid-cols-1 md:grid-cols-3"
                  imageHeight="h-48"
                />
              )}
            </div>

            <ProjectTabs project={project} />
          </div>
        ) : project.id === 3 ? (
          /* PC Cooling project with story steps layout */
          <div className="space-y-8">
            <ProjectHeader project={project} />

            {/* Main Project Image */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="relative aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
            </div>

            {/* Project Description */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-line">{project.longDescription}</p>
              </div>
            </div>

            {/* Story Steps */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <h2 className="text-xl font-bold text-center mb-8">Project Development Story</h2>
              <div className="space-y-8">
                {project.storySteps?.map((step, index) => (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    <div className={`space-y-3 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-bold">{step.title}</h3>
                      </div>
                      <p className="text-foreground/80 leading-relaxed text-sm">{step.description}</p>
                      {step.highlight && (
                        <div className="bg-primary/10 border-l-4 border-primary p-3 rounded-r-lg">
                          <p className="text-xs text-primary font-medium">{step.highlight}</p>
                        </div>
                      )}
                    </div>
                    <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <div
                        className={`relative ${step.aspectRatio || "aspect-video"} rounded-lg overflow-hidden cursor-pointer group`}
                        onClick={() => openLightbox([step.image], 0, `Step ${index + 1}`)}
                      >
                        <Image
                          src={step.image || "/placeholder.svg"}
                          alt={step.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {project.gallery && (
              <ImageGallery
                title="All Project Images"
                images={project.gallery}
                onImageClick={openLightbox}
                altPrefix="Project images"
              />
            )}

            {/* Temperature Comparison Results */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <h2 className="text-xl font-bold text-center mb-6">Temperature Test Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center">Without Ducting</h3>
                  <div
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() =>
                      openLightbox(["/images/gpu-test-without-ducting.png"], 0, "GPU test without ducting")
                    }
                  >
                    <Image
                      src="/images/gpu-test-without-ducting.png"
                      alt="GPU temperature test without ducting"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-red-700 dark:text-red-300 font-semibold">Higher GPU temperatures</p>
                    <p className="text-red-600 dark:text-red-400 text-sm">Less efficient cooling performance</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center">With Ducting</h3>
                  <div
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(["/images/gpu-test-with-ducting.png"], 0, "GPU test with ducting")}
                  >
                    <Image
                      src="/images/gpu-test-with-ducting.png"
                      alt="GPU temperature test with ducting"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="text-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-700 dark:text-green-300 font-semibold">8°C temperature reduction</p>
                    <p className="text-green-600 dark:text-green-400 text-sm">Improved cooling efficiency</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Key Improvement</h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  The custom ducting system achieved an 8°C reduction in GPU temperatures under full load, allowing for
                  better performance and reduced fan noise.
                </p>
              </div>
            </div>

            {project.results && <ResultsSection results={project.results} />}

            <ProjectTabs project={project} />
          </div>
        ) : project.id === 4 ? (
          /* UR5e Robotic Writing System */
          <div className="space-y-8">
            <ProjectHeader project={project} />

            {/* Main Project Image */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="relative aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
            </div>

            {/* Project Description */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base">{project.longDescription}</p>
              </div>

              {(project.liveUrl || project.githubUrl) && (
                <div className="flex flex-wrap justify-center gap-4 mt-6">
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

            {/* Video Demonstrations */}
            {project.videoGallery && <VideoGallery title="Watch It In Action" videos={project.videoGallery} />}

            {/* Image Gallery */}
            {project.gallery && (
              <ImageGallery
                title="Project Photos"
                images={project.gallery}
                onImageClick={openLightbox}
                altPrefix="UR5e project"
                columns="grid-cols-1 md:grid-cols-2"
                imageHeight="h-48 md:h-64"
              />
            )}

            {/* What I Learned */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <h2 className="text-xl font-bold text-center mb-6">What I Learned</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-3 text-primary">Key Skills</h3>
                  <ul className="space-y-2">
                    {project.learnings?.map((learning, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-foreground/80 text-sm">{learning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-3 text-primary">Challenges</h3>
                  <p className="text-foreground/80 leading-relaxed text-sm">{project.challenges}</p>
                </div>
              </div>
            </div>
          </div>
        ) : project.id === 5 ? (
          /* Cat Door project layout */
          <div className="space-y-8">
            <ProjectHeader project={project} />

            {/* Main Project Image */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="relative aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
            </div>

            {/* Project Description */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-line">{project.longDescription}</p>
              </div>
            </div>

            {/* Video Demonstration */}
            {project.videoGallery && (
              <div className="bg-muted/10 rounded-lg p-6 border">
                <h2 className="text-xl font-bold text-center mb-6">System Demonstration</h2>
                {project.videoGallery.map((video, index) => (
                  <div key={index} className="space-y-3 max-w-4xl mx-auto">
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
                      <h3 className="font-bold text-sm mb-1">{video.title}</h3>
                      <p className="text-foreground/70 text-xs">{video.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Design Evolution and Notifications */}
            <div className="space-y-8">
              {project.designGallery && (
                <ImageGallery
                  title="Design Evolution"
                  images={project.designGallery}
                  onImageClick={openLightbox}
                  altPrefix="Design evolution"
                  columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  imageHeight="h-40"
                />
              )}

              {/* Notification Gallery */}
              {project.notificationGallery && (
                <div className="bg-muted/10 rounded-lg p-6 border">
                  <h2 className="text-xl font-bold text-center mb-6">Telegram Notifications</h2>
                  <div className="flex justify-center">
                    {project.notificationGallery.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-full max-w-sm h-80 rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => openLightbox(project.notificationGallery || [], index, "Telegram notifications")}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Telegram notification ${index + 1}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {project.results && <ResultsSection results={project.results} />}

            <ProjectTabs project={project} />
          </div>
        ) : (
          /* Default project layout for any other projects */
          <div className="space-y-8">
            <ProjectHeader project={project} />

            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="relative aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
            </div>

            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base">{project.longDescription}</p>
              </div>

              {(project.liveUrl || project.githubUrl) && (
                <div className="flex flex-wrap justify-center gap-4 mt-6">
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

            <div className="bg-muted/10 rounded-lg p-6 border">
              <Tabs defaultValue="features" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="features">Key Features</TabsTrigger>
                  <TabsTrigger value="technologies">Technologies</TabsTrigger>
                  <TabsTrigger value="challenges">Challenges</TabsTrigger>
                </TabsList>
                <TabsContent value="features" className="mt-4">
                  <h2 className="text-lg font-bold mb-4">Key Features</h2>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="technologies" className="mt-4">
                  <h2 className="text-lg font-bold mb-4">Technologies Used</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(project.technologies).map(([category, items]) => (
                      <div key={category}>
                        <h3 className="font-bold mb-2 capitalize text-sm">
                          {category.replace(/([A-Z])/g, " $1").trim()}
                        </h3>
                        <ul className="space-y-1">
                          {items.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-primary">•</span>
                              <span className="text-xs">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="challenges" className="mt-4">
                  <h2 className="text-lg font-bold mb-4">Challenges & Solutions</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-sm">{project.challenges}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

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
      </div>
    </main>
  )
}

export default ProjectDetailClient
