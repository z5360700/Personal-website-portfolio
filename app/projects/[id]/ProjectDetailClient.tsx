"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import * as THREE from "three"
import {
  ArrowLeft,
  ArrowRight,
  Cable,
  CircuitBoard,
  Cpu,
  ExternalLink,
  Github,
  Gauge,
  Hammer,
  HardHat,
  Monitor,
  Play,
  Zap,
  Droplets,
  Home,
  PaintRoller,
  Layers,
  RotateCcw,
  Ruler,
  Timer,
  Wrench,
} from "lucide-react"
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
import ConstructionSlideshowModal from "@/components/construction-slideshow-modal"

const rubiksNavItems = [
  { label: "Demo", href: "#rubiks-demo" },
  { label: "Overview", href: "#rubiks-overview" },
  { label: "Pipeline", href: "#rubiks-pipeline" },
  { label: "Top turn", href: "#rubiks-trace" },
  { label: "Build", href: "#rubiks-build" },
  { label: "Stack", href: "#rubiks-stack" },
]

const rubiksMetricCards = [
  { icon: CircuitBoard, label: "Motors", value: "5", detail: "R, L, F, B, D" },
  { icon: RotateCcw, label: "Top turn", value: "13", detail: "move workaround" },
  { icon: Timer, label: "Solver", value: "<1s", detail: "local Kociemba" },
  { icon: Gauge, label: "Physical", value: "~65", detail: "moves after expansion" },
]

const rubiksPipelineSteps = [
  {
    icon: Monitor,
    stage: "Input",
    title: "Paint the cube state",
    description: "The browser checks colour counts before solving.",
    image: "/images/rubiks-ui-filled.png",
  },
  {
    icon: Cpu,
    stage: "Solve",
    title: "Kociemba runs locally",
    description: "Python returns a short two-phase move list.",
    image: "/images/rubiks-ui-solved.png",
  },
  {
    icon: Cable,
    stage: "Stream",
    title: "Serial talks to ESP32",
    description: "Moves become serial commands for the firmware.",
    image: "/images/4motorbreadboardwiring.jpg",
  },
  {
    icon: Wrench,
    stage: "Actuate",
    title: "The chassis does the work",
    description: "Five steppers turn the gripped faces.",
    image: "/images/5motordesignfinal.jpg",
  },
]

const rubiksNotationLegend = [
  { symbol: "R", label: "Right face clockwise" },
  { symbol: "L", label: "Left face clockwise" },
  { symbol: "F2 / B2", label: "Front or back half-turn" },
  { symbol: "D", label: "Bottom face clockwise" },
  { symbol: "'", label: "Prime: turn counter-clockwise" },
]

const rubiksMoveTrace = [
  {
    move: "R",
    title: "Right face clockwise",
    detail: "The right motor turns its face 90 deg clockwise, viewed from the right side.",
  },
  {
    move: "L",
    title: "Left face clockwise",
    detail: "The left motor turns its face 90 deg clockwise, viewed from the left side.",
  },
  {
    move: "F2",
    title: "Front face 180",
    detail: "The front motor makes a half-turn, equal to two quarter turns.",
  },
  {
    move: "B2",
    title: "Back face 180",
    detail: "The back motor makes the matching half-turn.",
  },
  {
    move: "R'",
    title: "Right face counter-clockwise",
    detail: "The right motor reverses one quarter turn.",
  },
  {
    move: "L'",
    title: "Left face counter-clockwise",
    detail: "The left motor reverses one quarter turn.",
  },
  {
    move: "D",
    title: "Bottom face clockwise",
    detail: "The bottom motor makes the key turn that substitutes for the missing top motor.",
  },
  {
    move: "L'",
    title: "Left face counter-clockwise",
    detail: "The left face starts restoring the cube's orientation.",
  },
  {
    move: "R'",
    title: "Right face counter-clockwise",
    detail: "The right face continues the restore step.",
  },
  {
    move: "B2",
    title: "Back face 180",
    detail: "The back face returns with another half-turn.",
  },
  {
    move: "F2",
    title: "Front face 180",
    detail: "The front face returns with another half-turn.",
  },
  {
    move: "L",
    title: "Left face clockwise",
    detail: "The left face closes the restore sequence.",
  },
  {
    move: "R",
    title: "Right face clockwise",
    detail: "The right face closes it. Net result: one top turn, no top motor.",
  },
]

const rubiksBuildPhotos = [
  {
    src: "/images/5motordesign.jpg",
    label: "Early 5-motor CAD",
    span: "col-span-12 md:col-span-7",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/5motordesignfinal.jpg",
    label: "Final chassis direction",
    span: "col-span-12 md:col-span-5",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/singlemotorwithbracket.jpg",
    label: "Motor and bracket detail",
    span: "col-span-6 md:col-span-4",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/motorwithadapterissue.jpg",
    label: "Adapter issue",
    span: "col-span-6 md:col-span-4",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/5motordesign.2.jpg",
    label: "Fitment iteration",
    span: "col-span-12 md:col-span-4",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/4motorbreadboardwiring.jpg",
    label: "Stepper driver wiring",
    span: "col-span-12",
    aspect: "aspect-[16/9]",
  },
]

const rubiksFaceTiles = [
  "#f8fafc",
  "#ef4444",
  "#22c55e",
  "#facc15",
  "#3b82f6",
  "#f97316",
  "#e2e8f0",
  "#ef4444",
  "#22c55e",
]

type RubiksFaceId = "u" | "l" | "f" | "r" | "b" | "d"
type RubiksTurnDirection = "clockwise" | "prime" | "half"

const rubiksPreviewModes = [
  { id: "animate", label: "Play" },
  { id: "start", label: "Start" },
  { id: "turn", label: "Turn" },
  { id: "result", label: "Result" },
] as const

type RubiksPreviewMode = (typeof rubiksPreviewModes)[number]["id"]

const getRubiksMoveVisual = (move: string) => {
  const face = move[0].toLowerCase() as RubiksFaceId
  const turn: RubiksTurnDirection = move.includes("2") ? "half" : move.includes("'") ? "prime" : "clockwise"
  const turnLabel = turn === "half" ? "180 degree turn" : turn === "prime" ? "counter-clockwise" : "clockwise"

  return {
    face,
    turn,
    turnLabel,
  }
}

const getInitialRubiksMove = () => {
  if (typeof window === "undefined") return 0

  const requestedMove = Number.parseInt(new URLSearchParams(window.location.search).get("move") || "", 10)

  if (!Number.isNaN(requestedMove) && requestedMove >= 1 && requestedMove <= rubiksMoveTrace.length) {
    return requestedMove - 1
  }

  return 0
}

const getInitialRubiksPreviewMode = (): RubiksPreviewMode => {
  if (typeof window === "undefined") return "animate"

  const requestedFrame = new URLSearchParams(window.location.search).get("frame")
  const requestedMode = rubiksPreviewModes.find((mode) => mode.id === requestedFrame)

  return requestedMode?.id || "animate"
}

type RubiksAxis = "x" | "y" | "z"

const rubiksStickerColors: Record<RubiksFaceId, string> = {
  u: "#f8fafc",
  l: "#f97316",
  f: "#22c55e",
  r: "#ef4444",
  b: "#3b82f6",
  d: "#facc15",
}

const rubiksFaceNormals: Record<RubiksFaceId, { axis: RubiksAxis; layer: number; rotation: [number, number, number] }> = {
  u: { axis: "y", layer: 1, rotation: [-Math.PI / 2, 0, 0] },
  l: { axis: "x", layer: -1, rotation: [0, -Math.PI / 2, 0] },
  f: { axis: "z", layer: 1, rotation: [0, 0, 0] },
  r: { axis: "x", layer: 1, rotation: [0, Math.PI / 2, 0] },
  b: { axis: "z", layer: -1, rotation: [0, Math.PI, 0] },
  d: { axis: "y", layer: -1, rotation: [Math.PI / 2, 0, 0] },
}

const rubiksClockwiseSigns: Record<RubiksFaceId, number> = {
  u: -1,
  l: 1,
  f: -1,
  r: -1,
  b: 1,
  d: 1,
}

const getRubiksSliceTurn = (face: RubiksFaceId, turn: RubiksTurnDirection) => {
  const faceNormal = rubiksFaceNormals[face]
  const turnSign = turn === "prime" ? -1 : 1
  const turnMagnitude = turn === "half" ? Math.PI : Math.PI / 2

  return {
    axis: faceNormal.axis,
    layer: faceNormal.layer,
    angle: rubiksClockwiseSigns[face] * turnSign * turnMagnitude,
  }
}

const disposeRubiksObject = (object: THREE.Object3D) => {
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh) && !(child instanceof THREE.LineSegments)) return

    if (child.geometry) {
      geometries.add(child.geometry)
    }

    const material = child.material
    if (Array.isArray(material)) {
      material.forEach((item) => materials.add(item))
    } else {
      materials.add(material)
    }
  })

  geometries.forEach((geometry) => geometry.dispose())
  materials.forEach((material) => material.dispose())
}

function RubiksPhysicalCube({
  activeFace,
  turn,
  previewMode,
  replayKey,
  moveLabel,
  moveTitle,
}: {
  activeFace: RubiksFaceId
  turn: RubiksTurnDirection
  previewMode: RubiksPreviewMode
  replayKey: number
  moveLabel: string
  moveTitle: string
}) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(4.2, 3.4, 5.6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.domElement.dataset.rubiksCanvas = "true"
    renderer.domElement.className = "rubiks-three-canvas"
    mount.appendChild(renderer.domElement)

    const root = new THREE.Group()
    root.rotation.set(-0.38, -0.62, 0.04)
    scene.add(root)

    const fixedGroup = new THREE.Group()
    const movingGroup = new THREE.Group()
    root.add(fixedGroup, movingGroup)

    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x14213d, 2.35)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4)
    keyLight.position.set(4, 5, 6)
    keyLight.castShadow = true
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x2f6df6, 1.6)
    rimLight.position.set(-4, 1.8, -3)
    scene.add(rimLight)

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.9, 72),
      new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.82,
        metalness: 0.08,
        transparent: true,
        opacity: 0.38,
      }),
    )
    floor.position.y = -1.82
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    const turnConfig = getRubiksSliceTurn(activeFace, turn)
    const cubieGeometry = new THREE.BoxGeometry(0.92, 0.92, 0.92, 3, 3, 3)
    const cubieEdgeGeometry = new THREE.EdgesGeometry(cubieGeometry)
    const stickerGeometry = new THREE.PlaneGeometry(0.72, 0.72)
    const edgeGeometry = new THREE.EdgesGeometry(stickerGeometry)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x07080c,
      roughness: 0.54,
      metalness: 0.18,
    })
    const sliceBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x08111f,
      emissive: 0x0f2f76,
      emissiveIntensity: 0.48,
      roughness: 0.52,
      metalness: 0.2,
    })
    const activeLineMaterial = new THREE.LineBasicMaterial({ color: 0x2f6df6, linewidth: 2 })
    const sliceLineMaterial = new THREE.LineBasicMaterial({
      color: 0x2f6df6,
      transparent: true,
      opacity: 0.82,
    })
    const stickerMaterials = Object.fromEntries(
      Object.entries(rubiksStickerColors).map(([face, color]) => [
        face,
        new THREE.MeshStandardMaterial({
          color,
          emissive: face === activeFace ? 0x101d45 : 0x000000,
          roughness: 0.48,
          metalness: 0.02,
          side: THREE.DoubleSide,
        }),
      ]),
    ) as Record<RubiksFaceId, THREE.MeshStandardMaterial>

    const makeSticker = (face: RubiksFaceId) => {
      const faceNormal = rubiksFaceNormals[face]
      const sticker = new THREE.Mesh(stickerGeometry.clone(), stickerMaterials[face])
      const outline = new THREE.LineSegments(edgeGeometry.clone(), activeLineMaterial)

      sticker.position[faceNormal.axis] = faceNormal.layer * 0.468
      outline.position.copy(sticker.position)
      sticker.rotation.set(...faceNormal.rotation)
      outline.rotation.copy(sticker.rotation)
      outline.scale.setScalar(face === activeFace ? 1.09 : 1.01)
      outline.visible = face === activeFace

      return { sticker, outline }
    }

    for (let x = -1; x <= 1; x += 1) {
      for (let y = -1; y <= 1; y += 1) {
        for (let z = -1; z <= 1; z += 1) {
          const cubie = new THREE.Group()
          cubie.position.set(x * 1.02, y * 1.02, z * 1.02)

          const coordinate = { x, y, z }
          const isMovingSlice = coordinate[turnConfig.axis] === turnConfig.layer
          const body = new THREE.Mesh(cubieGeometry.clone(), isMovingSlice ? sliceBodyMaterial : bodyMaterial)
          body.castShadow = true
          body.receiveShadow = true
          cubie.add(body)

          if (isMovingSlice) {
            const sliceOutline = new THREE.LineSegments(cubieEdgeGeometry.clone(), sliceLineMaterial)
            sliceOutline.scale.setScalar(1.035)
            cubie.add(sliceOutline)
          }

          if (y === 1) {
            const { sticker, outline } = makeSticker("u")
            cubie.add(sticker, outline)
          }
          if (y === -1) {
            const { sticker, outline } = makeSticker("d")
            cubie.add(sticker, outline)
          }
          if (x === 1) {
            const { sticker, outline } = makeSticker("r")
            cubie.add(sticker, outline)
          }
          if (x === -1) {
            const { sticker, outline } = makeSticker("l")
            cubie.add(sticker, outline)
          }
          if (z === 1) {
            const { sticker, outline } = makeSticker("f")
            cubie.add(sticker, outline)
          }
          if (z === -1) {
            const { sticker, outline } = makeSticker("b")
            cubie.add(sticker, outline)
          }

          const parent = isMovingSlice ? movingGroup : fixedGroup
          parent.add(cubie)
        }
      }
    }

    const getStaticAngle = () => {
      if (previewMode === "turn") return turnConfig.angle * 0.68
      if (previewMode === "result") return turnConfig.angle
      return 0
    }

    const resize = () => {
      const width = Math.max(mount.clientWidth, 320)
      const height = Math.max(mount.clientHeight, 320)

      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    const dragState = {
      active: false,
      x: 0,
      y: 0,
    }

    const handlePointerDown = (event: PointerEvent) => {
      dragState.active = true
      dragState.x = event.clientX
      dragState.y = event.clientY
      renderer.domElement.setPointerCapture(event.pointerId)
      renderer.domElement.classList.add("is-grabbing")
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragState.active) return

      const deltaX = event.clientX - dragState.x
      const deltaY = event.clientY - dragState.y
      dragState.x = event.clientX
      dragState.y = event.clientY

      root.rotation.y += deltaX * 0.008
      root.rotation.x = THREE.MathUtils.clamp(root.rotation.x + deltaY * 0.008, -1.25, 1.05)
    }

    const handlePointerUp = (event: PointerEvent) => {
      dragState.active = false
      renderer.domElement.releasePointerCapture(event.pointerId)
      renderer.domElement.classList.remove("is-grabbing")
    }

    renderer.domElement.addEventListener("pointerdown", handlePointerDown)
    renderer.domElement.addEventListener("pointermove", handlePointerMove)
    renderer.domElement.addEventListener("pointerup", handlePointerUp)
    renderer.domElement.addEventListener("pointercancel", handlePointerUp)

    const startedAt = performance.now()
    const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3)
    let animationFrame = 0

    const render = (time: number) => {
      let angle = getStaticAngle()

      if (previewMode === "animate") {
        const progress = THREE.MathUtils.clamp((time - startedAt - 160) / 1150, 0, 1)
        angle = turnConfig.angle * easeOutCubic(progress)
      }

      movingGroup.rotation[turnConfig.axis] = angle
      floor.rotation.z += 0.0012
      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(render)
    }

    animationFrame = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown)
      renderer.domElement.removeEventListener("pointermove", handlePointerMove)
      renderer.domElement.removeEventListener("pointerup", handlePointerUp)
      renderer.domElement.removeEventListener("pointercancel", handlePointerUp)
      disposeRubiksObject(root)
      cubieGeometry.dispose()
      cubieEdgeGeometry.dispose()
      stickerGeometry.dispose()
      edgeGeometry.dispose()
      floor.geometry.dispose()
      if (Array.isArray(floor.material)) {
        floor.material.forEach((material) => material.dispose())
      } else {
        floor.material.dispose()
      }
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [activeFace, turn, previewMode, replayKey])

  return (
    <div
      ref={mountRef}
      className="rubiks-three-cube"
      aria-label={`Interactive 3D cube preview for ${moveLabel}: ${moveTitle}`}
      role="img"
    />
  )
}

function ProjectDetailClient() {
  const router = useRouter()
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeRubiksMove, setActiveRubiksMove] = useState(getInitialRubiksMove)
  const [rubiksPreviewMode, setRubiksPreviewMode] = useState<RubiksPreviewMode>(getInitialRubiksPreviewMode)
  const [rubiksReplayKey, setRubiksReplayKey] = useState(0)
  const [showRubiksVideo, setShowRubiksVideo] = useState(false)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxAltPrefix, setLightboxAltPrefix] = useState("")

  // Construction slideshow modal state (project 1 only)
  const [slideshowOpen, setSlideshowOpen] = useState(false)
  const [slideshowImages, setSlideshowImages] = useState<string[]>([])
  const [slideshowIndex, setSlideshowIndex] = useState(0)
  const [slideshowAltPrefix, setSlideshowAltPrefix] = useState("")

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
      setShowRubiksVideo(false)
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

  useEffect(() => {
    if (!project || !window.location.hash) return

    requestAnimationFrame(() => {
      document.querySelector(window.location.hash)?.scrollIntoView()
    })
  }, [project])

  useEffect(() => {
    if (!project) return

    const requestedMove = Number.parseInt(new URLSearchParams(window.location.search).get("move") || "", 10)

    if (!Number.isNaN(requestedMove) && requestedMove >= 1 && requestedMove <= rubiksMoveTrace.length) {
      setActiveRubiksMove(requestedMove - 1)
    }

    setRubiksPreviewMode(getInitialRubiksPreviewMode())
  }, [project])

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

  // Construction slideshow handlers
  const openSlideshow = (images: string[], index: number, altPrefix: string) => {
    setSlideshowImages(images)
    setSlideshowIndex(index)
    setSlideshowAltPrefix(altPrefix)
    setSlideshowOpen(true)
  }

  const closeSlideshow = () => {
    setSlideshowOpen(false)
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

  const activeRubiksTrace = rubiksMoveTrace[activeRubiksMove]
  const activeRubiksVisual = getRubiksMoveVisual(activeRubiksTrace.move)
  const replayRubiksAnimation = () => {
    setRubiksPreviewMode("animate")
    setRubiksReplayKey((current) => current + 1)
  }
  const goToRubiksMove = (moveIndex: number) => {
    setActiveRubiksMove(Math.min(Math.max(moveIndex, 0), rubiksMoveTrace.length - 1))
    setRubiksReplayKey((current) => current + 1)
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-8">
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
            {/* HERO — title + description + tags on the left, quick stats on the right */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3 bg-muted/20 rounded-lg p-8 border flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {project.title}
                </h1>
                <p className="text-base text-foreground/70 mb-5 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                {[
                  { label: "Scope", value: "Foundation to Finish" },
                  { label: "Trades", value: "Framing · Roofing · Electrical · Plumbing" },
                  { label: "Context", value: "Built alongside Engineering degree" },
                  { label: "Standards", value: "Code-compliant throughout" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-muted/10 rounded-lg p-4 border flex flex-col justify-center"
                  >
                    <div className="text-[10px] uppercase tracking-widest text-foreground/50 mb-1">
                      {label}
                    </div>
                    <div className="text-sm font-semibold text-foreground/90 leading-snug">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SCOPE OF WORK — visual icon pills replacing text-heavy "Key Features" */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Scope of Work</h2>
                <p className="text-xs text-foreground/50 mt-1">
                  The trades and systems I worked across
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Ruler, label: "Planning", sub: "Assessment & layout" },
                  { icon: HardHat, label: "Framing", sub: "Timber structure" },
                  { icon: Home, label: "Roofing", sub: "Weatherproof shell" },
                  { icon: Zap, label: "Electrical", sub: "Wiring & lighting" },
                  { icon: Droplets, label: "Plumbing", sub: "Supply & drainage" },
                  { icon: Layers, label: "Insulation & Drywall", sub: "Thermal & interior" },
                  { icon: Hammer, label: "Kitchen & Bath", sub: "Fixtures & cabinetry" },
                  { icon: PaintRoller, label: "Finishing", sub: "Paint, flooring, trim" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="bg-background/40 hover:bg-background/60 transition-colors rounded-lg p-3 border border-border/60 flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-md bg-primary/15 text-primary flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{label}</div>
                      <div className="text-[11px] text-foreground/50 truncate">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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

            {/* Photo Galleries */}
            <div className="space-y-8">
              {project.exteriorGallery && (
                <ImageGallery
                  title="Exterior Construction"
                  subtitle="Framing, roofing and exterior finishing"
                  images={project.exteriorGallery}
                  selectedIndex={exteriorIndex}
                  onImageClick={openSlideshow}
                  onNavigate={navigateExterior}
                  altPrefix="Exterior construction"
                  columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  imageHeight="h-40"
                  showNavigation
                />
              )}

              {project.interiorGallery && (
                <ImageGallery
                  title="Interior Work"
                  subtitle="Insulation, drywall, electrical and plumbing rough-in"
                  images={project.interiorGallery}
                  selectedIndex={interiorIndex}
                  onImageClick={openSlideshow}
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
                  subtitle="Completed kitchen, bathrooms and living spaces"
                  images={project.finishedProductGallery}
                  selectedIndex={finishedIndex}
                  onImageClick={openSlideshow}
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
                  subtitle="Behind-the-scenes work and process shots"
                  images={project.miscellaneousGallery}
                  selectedIndex={additionalIndex}
                  onImageClick={openSlideshow}
                  onNavigate={navigateAdditional}
                  altPrefix="Additional photos"
                  columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  imageHeight="h-40"
                  showNavigation
                  maxImages={8}
                  showViewAll
                />
              )}
            </div>

            {/* Construction Slideshow Modal */}
            <ConstructionSlideshowModal
              images={slideshowImages}
              initialIndex={slideshowIndex}
              isOpen={slideshowOpen}
              onClose={closeSlideshow}
              altPrefix={slideshowAltPrefix}
            />

            {/* Technologies + Challenges side-by-side (replaces bottom tabs) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-muted/10 rounded-lg p-6 border">
                <h2 className="text-lg font-bold mb-4">Technologies & Skills</h2>
                <div className="space-y-4">
                  {Object.entries(project.technologies).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((item) => (
                          <span
                            key={item}
                            className="bg-background/60 border border-border/60 text-foreground/80 text-xs px-2.5 py-1 rounded-md"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted/10 rounded-lg p-6 border">
                <h2 className="text-lg font-bold mb-4">Challenges</h2>
                <div className="relative border-l-2 border-primary/40 pl-4">
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-sm">
                    {project.challenges}
                  </p>
                </div>
              </div>
            </div>
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

            {/* Before/After Slider */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <h2 className="text-xl font-bold text-center mb-6">Before &amp; After</h2>
              <div className="max-w-5xl mx-auto">
                <EnhancedBeforeAfterSlider
                  beforeImage="/images/pc-without-ducting.jpeg"
                  afterImage="/images/pc-cooling-installed.jpeg"
                  beforeAlt="PC without cooling ducting"
                  afterAlt="PC with custom cooling ducting installed"
                />
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
                          sizes="(max-width: 768px) 100vw, 50vw"
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
                      sizes="(max-width: 768px) 100vw, 50vw"
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
                      sizes="(max-width: 768px) 100vw, 50vw"
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
        ) : project.id === 7 ? (
          /* Rubik's Cube Solver layout */
          <div className="relative w-[calc(100vw-3rem)] pb-4 sm:w-full">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[-6rem] bottom-[-2rem] -z-10 overflow-hidden">
              <div className="absolute inset-0 rubiks-blueprint-bg" />
              <div className="absolute inset-x-0 top-0 h-2 rubiks-color-ribbon" />
            </div>

            <section id="rubiks-demo" className="scroll-mt-28 grid min-w-0 grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2">
              <div className="min-w-0 lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Project 7
                  <span className="h-1 w-1 rounded-full bg-primary/50" />
                  Robotics
                </div>
                <div className="space-y-4">
                  <h1 className="max-w-[21rem] break-words text-3xl sm:max-w-xl sm:text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
                    A 5-motor robot that solves a Rubik&apos;s cube end-to-end.
                  </h1>
                  <p className="max-w-[21rem] break-words text-sm sm:max-w-xl md:text-base leading-relaxed text-foreground/70">
                    Browser input, local solving, serial commands, and ESP32-driven stepper motion in one compact pipeline.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" className="rounded-md">
                    <a href="#rubiks-pipeline">
                      See pipeline
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="rounded-md bg-background/70">
                    <a href="#rubiks-trace">
                      Top-turn trick
                      <Play className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="min-w-0 lg:col-span-7 space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-border/70 bg-black shadow-2xl shadow-primary/10">
                  <div aria-hidden className="rubiks-video-scan absolute inset-y-0 left-0 z-10 w-1/3" />
                  {showRubiksVideo && project.videoGallery && project.videoGallery[0] ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${project.videoGallery[0].id}?autoplay=1&rel=0`}
                      title={project.videoGallery[0].title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  ) : (
                    <button
                      type="button"
                      aria-label="Play Rubik's Cube solver demo"
                      className="group relative h-full w-full"
                      onClick={() => setShowRubiksVideo(true)}
                    >
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                      <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-lg border border-white/20 bg-black/55 px-4 py-3 text-left text-white backdrop-blur-md">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Play className="h-5 w-5 fill-current" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">Watch the solve</span>
                          <span className="block text-xs text-white/70">Loads the demo video here</span>
                        </span>
                      </div>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {rubiksMetricCards.map(({ icon: Icon, label, value, detail }) => (
                    <div key={label} className="min-w-0 rubiks-panel rounded-lg border border-border/70 p-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">{label}</span>
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold leading-none">{value}</div>
                      <div className="mt-1 text-[11px] text-foreground/55">{detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <nav className="sticky top-20 z-30 my-10 max-w-full overflow-x-auto rounded-lg border border-border/70 bg-background/85 px-2 py-2 backdrop-blur-xl">
              <div className="flex min-w-max items-center justify-center gap-1">
                {rubiksNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-2 text-xs font-medium text-foreground/65 transition-colors hover:bg-primary/10 hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>

            <div className="space-y-14 md:space-y-20">
              <section id="rubiks-overview" className="scroll-mt-32 rubiks-panel rounded-xl border border-border/70 p-6 md:p-10">
                <div className="grid min-w-0 grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                  <div className="min-w-0 lg:col-span-4 space-y-6">
                    <div>
                      <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">Overview</div>
                      <h2 className="max-w-[18rem] break-words text-2xl md:text-3xl font-bold leading-tight sm:max-w-none">5 motors. Open top. Full solve.</h2>
                    </div>
                    <div className="grid w-36 grid-cols-3 gap-1.5 rounded-lg border border-border/70 bg-foreground/10 p-2">
                      {rubiksFaceTiles.map((color, index) => (
                        <div
                          key={`${color}-${index}`}
                          className="aspect-square rounded-sm border border-black/15 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="min-w-0 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                        The browser captures the cube state, Python solves it locally, and the ESP32 executes the moves.
                      </p>
                      <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                        The open top makes cube swaps easy. The cost: top-face turns need a workaround.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                        Four motors proved the concept. The fifth bottom-face motor made it a general solver.
                      </p>
                      <div className="overflow-x-auto rounded-md border border-border/70 bg-background/70 p-3 font-mono text-xs md:text-sm text-foreground/80">
                        U = R L F2 B2 R&apos; L&apos; D L&apos; R&apos; B2 F2 L R
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="rubiks-pipeline" className="scroll-mt-32">
                <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">Pipeline</div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">From colour input to physical motion</h2>
                  </div>
                  <p className="max-w-lg text-sm text-foreground/60">
                    Click the images to inspect each stage.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  {rubiksPipelineSteps.map((step, index) => {
                    const Icon = step.icon

                    return (
                      <div key={step.stage} className="group">
                        <button
                          type="button"
                          className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/70 bg-muted/10 text-left"
                          onClick={() => openLightbox([step.image], 0, step.title)}
                        >
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-90" />
                          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-background/90 px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm">
                            <Icon className="h-4 w-4 text-primary" />
                            {step.stage}
                          </div>
                        </button>
                        <div className="mt-4 flex gap-3">
                          <span className="mt-1 font-mono text-xs text-primary/75">{String(index + 1).padStart(2, "0")}</span>
                          <div>
                            <h3 className="font-semibold leading-snug">{step.title}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-foreground/60">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              <section id="rubiks-trace" className="scroll-mt-32 rubiks-panel rounded-xl border border-border/70 p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                  <div className="lg:col-span-5 space-y-4">
                    <div>
                      <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">Interactive</div>
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What is a U move?</h2>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/65">
                      In cube notation, U means rotate the upper face. This robot has no top motor, so firmware replaces
                      U with the 13 physical turns below.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {rubiksNotationLegend.map((item) => (
                        <div key={item.symbol} className="rounded-md border border-border/70 bg-background/70 px-3 py-2">
                          <div className="font-mono text-xs text-primary/80">{item.symbol}</div>
                          <div className="mt-1 text-xs text-foreground/65">{item.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${((activeRubiksMove + 1) / rubiksMoveTrace.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-5">
                    <div className="rounded-lg border border-border/70 bg-background/75 p-4 md:p-5">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-mono text-primary/80">{activeRubiksTrace.move}</div>
                          <div className="text-sm font-semibold">{activeRubiksTrace.title}</div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="rounded-md border border-border/70 bg-background/80 px-3 py-1.5 text-xs text-foreground/65">
                            {activeRubiksVisual.turnLabel}
                          </div>
                          <div className="flex rounded-md border border-border/70 bg-background/80 p-1">
                            {rubiksPreviewModes.map((mode) => (
                              <button
                                key={mode.id}
                                type="button"
                                aria-pressed={rubiksPreviewMode === mode.id}
                                onClick={() => {
                                  setRubiksPreviewMode(mode.id)
                                  if (mode.id === "animate") {
                                    setRubiksReplayKey((current) => current + 1)
                                  }
                                }}
                                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                  rubiksPreviewMode === mode.id
                                    ? "bg-primary text-primary-foreground"
                                    : "text-foreground/60 hover:text-foreground"
                                }`}
                              >
                                {mode.label}
                              </button>
                            ))}
                          </div>
                          <Button type="button" variant="outline" size="sm" className="h-8 rounded-md bg-background/80" onClick={replayRubiksAnimation}>
                            <RotateCcw className="h-3.5 w-3.5" />
                            Replay
                          </Button>
                        </div>
                      </div>

                      <RubiksPhysicalCube
                        activeFace={activeRubiksVisual.face}
                        turn={activeRubiksVisual.turn}
                        previewMode={rubiksPreviewMode}
                        replayKey={rubiksReplayKey}
                        moveLabel={activeRubiksTrace.move}
                        moveTitle={activeRubiksTrace.title}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {rubiksMoveTrace.map((item, index) => (
                        <button
                          key={`${item.move}-${index}`}
                          type="button"
                          onClick={() => goToRubiksMove(index)}
                          className={`rounded-md border px-3 py-2 font-mono text-xs transition-all ${
                            activeRubiksMove === index
                              ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                              : "border-border/70 bg-background/70 text-foreground/70 hover:border-primary/60 hover:text-foreground"
                          }`}
                        >
                          {item.move}
                        </button>
                      ))}
                    </div>

                    <div className="rounded-lg border border-border/70 bg-background/75 p-5">
                      <div className="mb-2 text-xs font-mono text-primary/80">
                        Step {activeRubiksMove + 1} of {rubiksMoveTrace.length}
                      </div>
                      <h3 className="text-lg font-semibold">{activeRubiksTrace.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                        {activeRubiksTrace.detail}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-md bg-background/80"
                          disabled={activeRubiksMove === 0}
                          onClick={() => goToRubiksMove(activeRubiksMove - 1)}
                        >
                          Previous
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="rounded-md"
                          onClick={() => {
                            setActiveRubiksMove((current) => (current + 1) % rubiksMoveTrace.length)
                            setRubiksReplayKey((current) => current + 1)
                          }}
                        >
                          Next move
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="rubiks-build" className="scroll-mt-32">
                <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">Build</div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Mechanical iteration gallery</h2>
                  </div>
                  <p className="max-w-md text-sm text-foreground/60">
                    Click any image to inspect the chassis, wiring, and fitment details.
                  </p>
                </div>
                <div className="grid grid-cols-12 gap-3 md:gap-4">
                  {rubiksBuildPhotos.map((photo) => (
                    <button
                      key={photo.src}
                      type="button"
                      className={`${photo.span} relative ${photo.aspect} overflow-hidden rounded-lg border border-border/70 bg-muted/10 text-left group`}
                      onClick={() =>
                        openLightbox(
                          project.hardwareGallery || [],
                          Math.max((project.hardwareGallery || []).indexOf(photo.src), 0),
                          "Build",
                        )
                      }
                    >
                      <Image
                        src={photo.src}
                        alt={photo.label}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm font-semibold text-white opacity-95">
                        {photo.label}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section id="rubiks-stack" className="scroll-mt-32 rubiks-panel rounded-xl border border-border/70 p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    <div className="mb-5 text-[11px] uppercase tracking-[0.25em] text-primary/80">Stack</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {Object.entries(project.technologies).map(([category, items]) => (
                        <div key={category}>
                          <h3 className="mb-2 text-xs font-semibold capitalize text-foreground/85">
                            {category.replace(/([A-Z])/g, " $1").trim()}
                          </h3>
                          <ul className="space-y-1">
                            {items.map((item) => (
                              <li key={item} className="text-[12px] leading-snug text-foreground/60">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-4 rounded-lg border border-border/70 bg-background/75 p-5">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">V2 ideas</div>
                    <ul className="space-y-3 text-sm leading-relaxed text-foreground/65">
                      <li>Computer-vision colour capture to remove manual state entry.</li>
                      <li>A 6th U-face mechanism for shorter physical solutions.</li>
                      <li>Telemetry overlay: solve time, move expansion, and motor execution time.</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : project.id === 6 ? (
          /* Custom Watch Build layout */
          <div className="space-y-8">
            <ProjectHeader project={project} />

            {/* Image + Specs side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-muted/10 rounded-lg p-6 border flex items-center justify-center">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={600}
                  height={600}
                  className="w-full h-auto rounded-lg max-h-[480px] object-contain"
                />
              </div>

              <div className="space-y-4">
                {/* Quick specs */}
                <div className="bg-muted/10 rounded-lg p-6 border h-full flex flex-col justify-center">
                  <h2 className="text-lg font-bold mb-5">Build Specs</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Movement", value: "Seiko NH35A" },
                      { label: "Type", value: "Mechanical Automatic" },
                      { label: "Power Reserve", value: "41 hours" },
                      { label: "Assembly", value: "Hand-built from individual parts" },
                      { label: "Environment", value: "Dust-free, clean room conditions" },
                      { label: "Parts Sourced", value: "Case, dial, hands, crystal, crown, bracelet" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start gap-4 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                        <span className="text-foreground/50 text-sm font-medium shrink-0">{label}</span>
                        <span className="text-foreground/90 text-sm text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-line">{project.longDescription}</p>
              </div>
            </div>

            {/* Video */}
            {project.videoGallery && (
              <div className="bg-muted/10 rounded-lg p-6 border">
                <h2 className="text-xl font-bold text-center mb-6">Watch the Build</h2>
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
