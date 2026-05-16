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
  CheckCircle2,
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
  Lock,
  RotateCcw,
  Ruler,
  Timer,
  Wrench,
  AlertTriangle,
  TrendingDown,
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
  { icon: RotateCcw, label: "Solver moves", value: "~20", detail: "near-optimal Kociemba plan" },
  { icon: Timer, label: "Solve time", value: "<1s", detail: "local Python compute" },
  { icon: Gauge, label: "Physical", value: "~55", detail: "5-axis motor commands" },
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
    title: "Kociemba plans the solve",
    description: "Python computes a near-optimal plan of roughly 20 moves in under 1 second.",
    image: "/images/rubiks-ui-solved.png",
  },
  {
    icon: Cable,
    stage: "Stream",
    title: "Serial talks to ESP32",
    description: "The plan expands to roughly 55 physical motor commands for the 5-axis rig.",
    image: "/images/5motordiagramimage.jpg",
  },
  {
    icon: Wrench,
    stage: "Actuate",
    title: "The chassis does the work",
    description: "Five steppers turn the gripped faces.",
    image: "/images/final5motorcubedesign.jpg",
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

const rubiksMoveTraceUPrime = [
  {
    move: "R'",
    title: "Right face counter-clockwise",
    detail: "The right motor turns its face 90 deg counter-clockwise, viewed from the right side.",
  },
  {
    move: "L'",
    title: "Left face counter-clockwise",
    detail: "The left motor turns its face 90 deg counter-clockwise, viewed from the left side.",
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
    move: "R",
    title: "Right face clockwise",
    detail: "The right motor reverses one quarter turn.",
  },
  {
    move: "L",
    title: "Left face clockwise",
    detail: "The left motor reverses one quarter turn.",
  },
  {
    move: "D'",
    title: "Bottom face counter-clockwise",
    detail: "The bottom motor makes the key turn that substitutes for the missing top motor (in reverse).",
  },
  {
    move: "L",
    title: "Left face clockwise",
    detail: "The left face starts restoring the cube's orientation.",
  },
  {
    move: "R",
    title: "Right face clockwise",
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
    move: "L'",
    title: "Left face counter-clockwise",
    detail: "The left face closes the restore sequence.",
  },
  {
    move: "R'",
    title: "Right face counter-clockwise",
    detail: "The right face closes it. Net result: one top counter-turn, no top motor.",
  },
]

const rubiksBuildPhotos = [
  {
    src: "/images/final5motorcubedesign.jpg",
    label: "Final 5-motor cube grip",
    span: "col-span-12 md:col-span-7",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/5motordiagramimage.jpg",
    label: "Final 4-motor circuit",
    caption: "Circuit layout used for the completed 4-motor prototype.",
    span: "col-span-12 md:col-span-5",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/5motordesign.jpg",
    label: "Early 5-motor CAD",
    span: "col-span-12 md:col-span-5",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/5motordesignfinal.jpg",
    label: "Scrapped 4-motor chassis",
    caption: "This direction was abandoned because four motors could not solve every possible cube state.",
    span: "col-span-12 md:col-span-7",
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
    caption: "The tolerances were too tight, so heat and other removal methods were needed to free the plastic.",
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
    label: "4-motor stepper driver wiring",
    caption: "Driver wiring for the earlier 4-motor design only.",
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
  { id: "start", label: "Before" },
  { id: "result", label: "Result" },
] as const

const rubiksObjectives = {
  cw: {
    symbol: "U",
    label: "U move",
    detail: "Replicated by 13 physical moves on the surrounding faces (no top-face motor).",
    trace: rubiksMoveTrace,
  },
  ccw: {
    symbol: "U'",
    label: "U' move",
    detail: "Counter-clockwise top turn — the same 13-move equivalence run in reverse.",
    trace: rubiksMoveTraceUPrime,
  },
} as const

type RubiksDirection = keyof typeof rubiksObjectives

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
  if (typeof window === "undefined") return "start"

  const requestedFrame = new URLSearchParams(window.location.search).get("frame")
  const requestedMode = rubiksPreviewModes.find((mode) => mode.id === requestedFrame)

  return requestedMode?.id || "start"
}

const getInitialRubiksDirection = (): RubiksDirection => {
  if (typeof window === "undefined") return "cw"

  return new URLSearchParams(window.location.search).get("direction") === "ccw" ? "ccw" : "cw"
}

type RubiksAxis = "x" | "y" | "z"
type RubiksCubieState = {
  id: string
  position: THREE.Vector3
  quaternion: THREE.Quaternion
}

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

const getRubiksAxisVector = (axis: RubiksAxis) => {
  if (axis === "x") return new THREE.Vector3(1, 0, 0)
  if (axis === "y") return new THREE.Vector3(0, 1, 0)
  return new THREE.Vector3(0, 0, 1)
}

const roundRubiksPosition = (position: THREE.Vector3) =>
  new THREE.Vector3(Math.round(position.x), Math.round(position.y), Math.round(position.z))

const createInitialRubiksCubeState = () => {
  const cubies: RubiksCubieState[] = []

  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        cubies.push({
          id: `${x}:${y}:${z}`,
          position: new THREE.Vector3(x, y, z),
          quaternion: new THREE.Quaternion(),
        })
      }
    }
  }

  return cubies
}

const applyRubiksMoveToState = (state: RubiksCubieState[], move: string) => {
  const visual = getRubiksMoveVisual(move)
  const turnConfig = getRubiksSliceTurn(visual.face, visual.turn)
  const axisVector = getRubiksAxisVector(turnConfig.axis)
  const rotation = new THREE.Quaternion().setFromAxisAngle(axisVector, turnConfig.angle)

  return state.map((cubie) => {
    if (Math.round(cubie.position[turnConfig.axis]) !== turnConfig.layer) {
      return {
        ...cubie,
        position: cubie.position.clone(),
        quaternion: cubie.quaternion.clone(),
      }
    }

    return {
      ...cubie,
      position: roundRubiksPosition(cubie.position.clone().applyQuaternion(rotation)),
      quaternion: rotation.clone().multiply(cubie.quaternion),
    }
  })
}

const getRubiksCubeStateBeforeStep = (moveSequence: readonly { move: string }[], stepIndex: number) =>
  moveSequence
    .slice(0, stepIndex)
    .reduce((state, item) => applyRubiksMoveToState(state, item.move), createInitialRubiksCubeState())

const disposeRubiksObject = (object: THREE.Object3D) => {
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh) && !(child instanceof THREE.Line)) return

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
  stepIndex,
  moveSequence,
  direction,
  previewMode,
  replayKey,
  moveLabel,
  moveTitle,
  highlightTopFace = false,
}: {
  activeFace: RubiksFaceId
  turn: RubiksTurnDirection
  stepIndex: number
  moveSequence: readonly { move: string }[]
  direction: RubiksDirection
  previewMode: RubiksPreviewMode
  replayKey: number
  moveLabel: string
  moveTitle: string
  highlightTopFace?: boolean
}) {
  const mountRef = useRef<HTMLDivElement>(null)
  const viewRotationRef = useRef({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(6.55, 5.15, 8.6)
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
    root.rotation.set(viewRotationRef.current.x, viewRotationRef.current.y, viewRotationRef.current.z)
    root.position.y = 0.12
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

    const turnConfig = getRubiksSliceTurn(activeFace, turn)
    const isSettledFinalResult = previewMode === "result" && highlightTopFace
    const cubieStates = getRubiksCubeStateBeforeStep(moveSequence, stepIndex + (isSettledFinalResult ? 1 : 0))
    const cubieGeometry = new THREE.BoxGeometry(1.02, 1.02, 1.02, 3, 3, 3)
    const cubieEdgeGeometry = new THREE.EdgesGeometry(cubieGeometry)
    const stickerGeometry = new THREE.PlaneGeometry(0.8, 0.8)
    const topHighlightGeometry = new THREE.BoxGeometry(3.5, 0.05, 3.5)
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
    const sliceLineMaterial = new THREE.LineBasicMaterial({
      color: 0x2f6df6,
      transparent: true,
      opacity: 0.82,
    })
    const topHighlightMaterial = new THREE.MeshStandardMaterial({
      color: 0x2f6df6,
      emissive: 0x123b8f,
      emissiveIntensity: 0.85,
      roughness: 0.35,
      metalness: 0.08,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const topHighlightLineMaterial = new THREE.LineBasicMaterial({
      color: 0x7fb1ff,
      transparent: true,
      opacity: 0,
    })
    const targetPlateMaterial = new THREE.MeshStandardMaterial({
      color: 0x2f6df6,
      emissive: 0x123b8f,
      emissiveIntensity: 0.75,
      roughness: 0.38,
      metalness: 0.08,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const targetArrowMaterial = new THREE.LineBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0,
    })
    const targetArrowTubeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc857,
      emissive: 0xb45309,
      emissiveIntensity: 1.15,
      roughness: 0.3,
      metalness: 0.05,
      transparent: true,
      opacity: 0,
    })
    const targetPlateOutlineMaterial = new THREE.LineBasicMaterial({
      color: 0x8cc4ff,
      transparent: true,
      opacity: 0,
    })
    const targetArrowHeadMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xb45309,
      emissiveIntensity: 1.15,
      roughness: 0.35,
      metalness: 0.1,
      transparent: true,
      opacity: 0,
    })
    const motorBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x162033,
      roughness: 0.55,
      metalness: 0.38,
      transparent: true,
      opacity: 0.7,
    })
    const motorFaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x25364f,
      emissive: 0x123b8f,
      emissiveIntensity: 0.32,
      roughness: 0.5,
      metalness: 0.28,
      transparent: true,
      opacity: 0.78,
    })
    const motorCouplerMaterial = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x0f2f76,
      emissiveIntensity: 0.48,
      roughness: 0.34,
      metalness: 0.18,
      transparent: true,
      opacity: 0.68,
    })
    const stickerMaterials = Object.fromEntries(
      Object.entries(rubiksStickerColors).map(([face, color]) => [
        face,
        new THREE.MeshStandardMaterial({
          color,
          emissive: 0x000000,
          roughness: 0.48,
          metalness: 0.02,
          side: THREE.DoubleSide,
        }),
      ]),
    ) as Record<RubiksFaceId, THREE.MeshStandardMaterial>

    const makeSticker = (face: RubiksFaceId) => {
      const faceNormal = rubiksFaceNormals[face]
      const sticker = new THREE.Mesh(stickerGeometry.clone(), stickerMaterials[face])

      sticker.position[faceNormal.axis] = faceNormal.layer * 0.518
      sticker.rotation.set(...faceNormal.rotation)

      return sticker
    }

    cubieStates.forEach((cubieState) => {
      const { position } = cubieState
      const cubie = new THREE.Group()
      cubie.position.set(position.x * 1.12, position.y * 1.12, position.z * 1.12)
      cubie.quaternion.copy(cubieState.quaternion)

      const isMovingSlice = !isSettledFinalResult && Math.round(position[turnConfig.axis]) === turnConfig.layer
      const body = new THREE.Mesh(cubieGeometry.clone(), isMovingSlice ? sliceBodyMaterial : bodyMaterial)
      body.castShadow = true
      body.receiveShadow = true
      cubie.add(body)

      if (isMovingSlice) {
        const sliceOutline = new THREE.LineSegments(cubieEdgeGeometry.clone(), sliceLineMaterial)
        sliceOutline.scale.setScalar(1.035)
        cubie.add(sliceOutline)
      }

      const [startX, startY, startZ] = cubieState.id.split(":").map(Number)

      if (startY === 1) cubie.add(makeSticker("u"))
      if (startY === -1) cubie.add(makeSticker("d"))
      if (startX === 1) cubie.add(makeSticker("r"))
      if (startX === -1) cubie.add(makeSticker("l"))
      if (startZ === 1) cubie.add(makeSticker("f"))
      if (startZ === -1) cubie.add(makeSticker("b"))

      const parent = isMovingSlice ? movingGroup : fixedGroup
      parent.add(cubie)
    })

    const motorRig = new THREE.Group()
    const motorBodyGeometry = new THREE.BoxGeometry(0.62, 0.62, 0.62)
    const motorFaceGeometry = new THREE.BoxGeometry(0.66, 0.66, 0.06)
    const couplerGeometry = new THREE.CylinderGeometry(0.065, 0.065, 1.36, 16)
    const motorConfigs = [
      {
        bodyPosition: new THREE.Vector3(3.38, 0, 0),
        facePosition: new THREE.Vector3(3.0, 0, 0),
        faceRotation: new THREE.Euler(0, Math.PI / 2, 0),
        couplerPosition: new THREE.Vector3(2.32, 0, 0),
        couplerRotation: new THREE.Euler(0, 0, Math.PI / 2),
      },
      {
        bodyPosition: new THREE.Vector3(-3.38, 0, 0),
        facePosition: new THREE.Vector3(-3.0, 0, 0),
        faceRotation: new THREE.Euler(0, Math.PI / 2, 0),
        couplerPosition: new THREE.Vector3(-2.32, 0, 0),
        couplerRotation: new THREE.Euler(0, 0, Math.PI / 2),
      },
      {
        bodyPosition: new THREE.Vector3(0, 0, 3.38),
        facePosition: new THREE.Vector3(0, 0, 3.0),
        faceRotation: new THREE.Euler(0, 0, 0),
        couplerPosition: new THREE.Vector3(0, 0, 2.32),
        couplerRotation: new THREE.Euler(Math.PI / 2, 0, 0),
      },
      {
        bodyPosition: new THREE.Vector3(0, 0, -3.38),
        facePosition: new THREE.Vector3(0, 0, -3.0),
        faceRotation: new THREE.Euler(0, 0, 0),
        couplerPosition: new THREE.Vector3(0, 0, -2.32),
        couplerRotation: new THREE.Euler(Math.PI / 2, 0, 0),
      },
      {
        bodyPosition: new THREE.Vector3(0, -3.3, 0),
        facePosition: new THREE.Vector3(0, -2.92, 0),
        faceRotation: new THREE.Euler(Math.PI / 2, 0, 0),
        couplerPosition: new THREE.Vector3(0, -2.24, 0),
        couplerRotation: new THREE.Euler(0, 0, 0),
      },
    ]

    motorConfigs.forEach((config) => {
      const motor = new THREE.Group()
      const body = new THREE.Mesh(motorBodyGeometry, motorBodyMaterial)
      const facePlate = new THREE.Mesh(motorFaceGeometry, motorFaceMaterial)
      const coupler = new THREE.Mesh(couplerGeometry, motorCouplerMaterial)

      body.position.copy(config.bodyPosition)
      facePlate.position.copy(config.facePosition)
      facePlate.rotation.copy(config.faceRotation)
      coupler.position.copy(config.couplerPosition)
      coupler.rotation.copy(config.couplerRotation)
      body.castShadow = true
      facePlate.castShadow = true
      motor.add(body, facePlate, coupler)
      motorRig.add(motor)
    })
    root.add(motorRig)

    const topHighlight = new THREE.Group()
    const topPlate = new THREE.Mesh(topHighlightGeometry, topHighlightMaterial)
    const topOutline = new THREE.LineSegments(new THREE.EdgesGeometry(topHighlightGeometry), topHighlightLineMaterial)
    topHighlight.position.y = 1.7
    topHighlight.visible = false
    topHighlight.add(topPlate, topOutline)
    root.add(topHighlight)

    const targetCue = new THREE.Group()
    const targetPlate = new THREE.Mesh(topHighlightGeometry.clone(), targetPlateMaterial)
    const targetCueDirection = direction === "cw" ? "ccw" : "cw"
    const targetDirectionSign = targetCueDirection === "cw" ? -1 : 1
    const targetRadius = 2.24
    const targetArrowHeight = 2.84
    const targetStartAngle = targetCueDirection === "cw" ? Math.PI * -0.2 : Math.PI * 1.2
    const targetArcLength = Math.PI * 1.45 * targetDirectionSign
    const targetArcPoints = Array.from({ length: 44 }, (_, index) => {
      const progress = index / 43
      const angle = targetStartAngle + targetArcLength * progress

      return new THREE.Vector3(Math.cos(angle) * targetRadius, targetArrowHeight, Math.sin(angle) * targetRadius)
    })
    const targetArrowCurve = new THREE.CatmullRomCurve3(targetArcPoints)
    const targetArrow = new THREE.Mesh(new THREE.TubeGeometry(targetArrowCurve, 56, 0.018, 10, false), targetArrowTubeMaterial)
    const targetPlateOutline = new THREE.LineSegments(new THREE.EdgesGeometry(topHighlightGeometry), targetPlateOutlineMaterial)
    const targetArrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.42, 28), targetArrowHeadMaterial)
    const targetArrowEnd = targetArcPoints[targetArcPoints.length - 1]
    const targetArrowBeforeEnd = targetArcPoints[targetArcPoints.length - 4]
    const targetArrowDirection = targetArrowEnd.clone().sub(targetArrowBeforeEnd).normalize()

    targetPlate.position.y = 1.74
    targetPlateOutline.position.y = 1.77
    targetArrowHead.position.copy(targetArrowEnd)
    targetArrowHead.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetArrowDirection)
    targetCue.visible = false
    targetCue.add(targetPlate, targetPlateOutline, targetArrow, targetArrowHead)
    root.add(targetCue)

    const getStaticAngle = () => {
      if (isSettledFinalResult) return 0
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
      viewRotationRef.current = {
        x: root.rotation.x,
        y: root.rotation.y,
        z: root.rotation.z,
      }
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

    const setTopHighlightOpacity = (opacity: number) => {
      const visibleOpacity = THREE.MathUtils.clamp(opacity, 0, 1)
      topHighlight.visible = visibleOpacity > 0.01
      topHighlightMaterial.opacity = visibleOpacity * 0.24
      topHighlightLineMaterial.opacity = visibleOpacity * 0.95
      topHighlight.scale.setScalar(1 + visibleOpacity * 0.025)
    }

    const setTargetCueOpacity = (opacity: number) => {
      const visibleOpacity = THREE.MathUtils.clamp(opacity, 0, 1)
      targetCue.visible = visibleOpacity > 0.01
      targetPlateMaterial.opacity = visibleOpacity * 0.36
      targetArrowMaterial.opacity = visibleOpacity * 0.95
      targetArrowTubeMaterial.opacity = visibleOpacity * 0.98
      targetPlateOutlineMaterial.opacity = visibleOpacity * 0.95
      targetArrowHeadMaterial.opacity = visibleOpacity
      targetCue.scale.setScalar(1)
    }

    const render = (time: number) => {
      let angle = getStaticAngle()
      let moveProgress = previewMode === "result" ? 1 : 0

      if (previewMode === "animate") {
        const progress = THREE.MathUtils.clamp((time - startedAt - 160) / 1150, 0, 1)
        moveProgress = progress
        angle = turnConfig.angle * easeOutCubic(moveProgress)
      }

      movingGroup.rotation[turnConfig.axis] = angle
      setTopHighlightOpacity(highlightTopFace ? THREE.MathUtils.smoothstep(moveProgress, 0.78, 1) : 0)
      setTargetCueOpacity(previewMode === "start" || isSettledFinalResult ? 1 : 0)
      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(render)
    }

    animationFrame = window.requestAnimationFrame(render)

    return () => {
      viewRotationRef.current = {
        x: root.rotation.x,
        y: root.rotation.y,
        z: root.rotation.z,
      }
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
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [activeFace, turn, stepIndex, moveSequence, direction, previewMode, replayKey, highlightTopFace])

  return (
    <div
      ref={mountRef}
      className="rubiks-three-cube"
      aria-label={`Cumulative interactive 3D cube preview for step ${stepIndex + 1}, ${moveLabel}: ${moveTitle}`}
      role="img"
    />
  )
}

type PCCoolingMode = "stock" | "ducted"

type PCFlowCurve = {
  curve: THREE.CatmullRomCurve3
  color: number
  particleCount: number
  speed: number
  size: number
}

type WatchWaveDriftProps = {
  height?: number
  density?: number
  tone?: string
  accentTone?: string
  speed?: "slow" | "fast"
  className?: string
  idPrefix: string
}

function WatchWaveDrift({
  height = 260,
  density = 8,
  tone = "rgba(156, 180, 204, 0.16)",
  accentTone = "rgba(212, 165, 87, 0.28)",
  speed = "slow",
  className = "",
  idPrefix,
}: WatchWaveDriftProps) {
  const lines = Array.from({ length: density })
  const renderLines = (offset = 0) =>
    lines.map((_, index) => {
      const y = (height / (density + 1)) * (index + 1)
      const amplitude = 14 + (index % 3) * 6
      const phase = index % 2 === 0 ? 0 : 60
      const path = `M -40 ${y} C 100 ${y - amplitude}, 240 ${y + amplitude}, 400 ${y} S 720 ${y - amplitude}, 880 ${y} S 1200 ${y + amplitude}, 1640 ${y - amplitude + phase * 0.05}`
      const isAccent = index === Math.floor(density / 2)

      return (
        <path
          key={`${offset}-${index}`}
          d={path}
          fill="none"
          stroke={`url(#${idPrefix}-${isAccent ? "accent" : "fade"})`}
          strokeWidth={isAccent ? 1.4 : 0.9}
          strokeLinecap="round"
          transform={offset ? `translate(${offset} 0)` : undefined}
        />
      )
    })

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <svg
        viewBox={`0 0 1600 ${height}`}
        preserveAspectRatio="none"
        className={`block h-full w-[200%] ${speed === "slow" ? "watch-wave-drift-slow" : "watch-wave-drift-fast"}`}
      >
        <defs>
          <linearGradient id={`${idPrefix}-fade`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={tone} stopOpacity="0" />
            <stop offset="0.18" stopColor={tone} stopOpacity="1" />
            <stop offset="0.78" stopColor={tone} stopOpacity="1" />
            <stop offset="1" stopColor={tone} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-accent`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={accentTone} stopOpacity="0" />
            <stop offset="0.45" stopColor={accentTone} stopOpacity="1" />
            <stop offset="0.65" stopColor={accentTone} stopOpacity="1" />
            <stop offset="1" stopColor={accentTone} stopOpacity="0" />
          </linearGradient>
        </defs>
        {renderLines(0)}
        {renderLines(1600)}
      </svg>
    </div>
  )
}

function PCCoolingScene({ mode }: { mode: PCCoolingMode }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x05060a, 13, 24)

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(1.6, 0.6, 11.4)
    camera.lookAt(-0.4, 0.1, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Lights
    scene.add(new THREE.HemisphereLight(0x6e8cb8, 0x111827, 1.7))
    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(4, 6, 6)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x60a5fa, 0.85)
    rim.position.set(-4, 2, 4)
    scene.add(rim)

    // Case dimensions — taller mid-tower like the actual build
    const W = 5.6 // front-to-back (intake at +X, rear at -X)
    const H = 6.6 // top-to-bottom
    const D = 2.8 // closed-side at -Z, camera-facing open side at +Z

    // Case wireframe outline
    const caseGeo = new THREE.BoxGeometry(W, H, D)
    const caseLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(caseGeo),
      new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.55 }),
    )
    scene.add(caseLines)
    caseGeo.dispose()

    // Rear wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(D, H * 0.96),
      new THREE.MeshStandardMaterial({ color: 0x0e131c, roughness: 0.75, metalness: 0.2, side: THREE.DoubleSide }),
    )
    backWall.position.set(-W / 2, 0, 0)
    backWall.rotation.y = Math.PI / 2
    scene.add(backWall)

    // Bottom panel
    const bottomPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 0.96, D),
      new THREE.MeshStandardMaterial({ color: 0x080b12, roughness: 0.85, side: THREE.DoubleSide }),
    )
    bottomPanel.position.set(0, -H / 2, 0)
    bottomPanel.rotation.x = -Math.PI / 2
    scene.add(bottomPanel)

    // Top panel (slightly translucent — radiator sits below it)
    const topPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 0.96, D),
      new THREE.MeshStandardMaterial({
        color: 0x1f2937,
        roughness: 0.85,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
      }),
    )
    topPanel.position.set(0, H / 2, 0)
    topPanel.rotation.x = -Math.PI / 2
    scene.add(topPanel)

    // Closed side wall (motherboard tray) — slight tint, semi-transparent so we still see depth
    const sideWall = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 0.96, H * 0.96),
      new THREE.MeshStandardMaterial({
        color: 0x121826,
        roughness: 0.85,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      }),
    )
    sideWall.position.set(0, 0, -D / 2)
    scene.add(sideWall)

    // ---- Top: AIO radiator + 3 radiator fans ----
    const radiatorMat = new THREE.MeshStandardMaterial({ color: 0x0c1018, metalness: 0.5, roughness: 0.6 })
    const radiator = new THREE.Mesh(new THREE.BoxGeometry(W * 0.78, 0.32, D * 0.9), radiatorMat)
    radiator.position.set(0.05, H / 2 - 0.32, 0)
    scene.add(radiator)
    // Radiator fin lines on visible (front) side
    const finLineMat = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.6 })
    const radHalfW = (W * 0.78) / 2
    const finVerts: number[] = []
    for (let i = 0; i < 28; i++) {
      const x = -radHalfW + (i / 27) * (W * 0.78)
      finVerts.push(x + 0.05, H / 2 - 0.32 - 0.16, D * 0.45 + 0.001, x + 0.05, H / 2 - 0.32 + 0.16, D * 0.45 + 0.001)
    }
    const finsGeo = new THREE.BufferGeometry()
    finsGeo.setAttribute("position", new THREE.Float32BufferAttribute(finVerts, 3))
    scene.add(new THREE.LineSegments(finsGeo, finLineMat))

    // 3 radiator fans on bottom of radiator (pulling up through it)
    const fanRingGeo = new THREE.RingGeometry(0.18, 0.78, 28)
    const fanIntakeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      roughness: 0.4,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.3,
    })
    const fanRimMat = new THREE.MeshStandardMaterial({
      color: 0x4b5563,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      roughness: 0.5,
    })
    const radFanXs = [-1.6, 0.05, 1.6]
    for (const x of radFanXs) {
      const radFan = new THREE.Mesh(fanRingGeo, fanIntakeMat)
      radFan.rotation.x = -Math.PI / 2
      radFan.position.set(x, H / 2 - 0.5, 0)
      scene.add(radFan)
    }

    // ---- Front: 3 intake fans ----
    const intakeYs = [1.45, 0.0, -1.45]
    for (const y of intakeYs) {
      const fan = new THREE.Mesh(fanRingGeo, fanIntakeMat)
      fan.position.set(W / 2 - 0.04, y, 0)
      fan.rotation.y = Math.PI / 2
      scene.add(fan)
    }

    // ---- Back: rear exhaust fan ----
    const backFan = new THREE.Mesh(fanRingGeo, fanRimMat)
    backFan.position.set(-W / 2 + 0.04, 1.4, 0)
    backFan.rotation.y = Math.PI / 2
    scene.add(backFan)

    // ---- Motherboard plane (with subtle PCB texture via colored panels) ----
    const moboW = 3.6
    const moboH = 3.4
    const mobo = new THREE.Mesh(
      new THREE.PlaneGeometry(moboW, moboH),
      new THREE.MeshStandardMaterial({ color: 0x0b1220, roughness: 0.7, metalness: 0.2, side: THREE.DoubleSide }),
    )
    mobo.position.set(-0.7, 0.55, -D / 2 + 0.05)
    scene.add(mobo)
    // Mobo trace hint (a few faint horizontal lines)
    const traceMat = new THREE.LineBasicMaterial({ color: 0x1e3a8a, transparent: true, opacity: 0.45 })
    const traceVerts: number[] = []
    for (let i = 0; i < 6; i++) {
      const ty = 0.55 - moboH / 2 + 0.3 + (i / 5) * (moboH - 0.6)
      traceVerts.push(-0.7 - moboW / 2 + 0.2, ty, -D / 2 + 0.06, -0.7 + moboW / 2 - 0.2, ty, -D / 2 + 0.06)
    }
    const traceGeo = new THREE.BufferGeometry()
    traceGeo.setAttribute("position", new THREE.Float32BufferAttribute(traceVerts, 3))
    scene.add(new THREE.LineSegments(traceGeo, traceMat))

    // ---- CPU AIO pump block (visible on motherboard) ----
    const cpuBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.65, roughness: 0.4 }),
    )
    cpuBlock.position.set(-0.6, 1.3, -D / 2 + 0.28)
    scene.add(cpuBlock)
    // CPU block glowing logo
    const cpuLogo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.45, 0.45),
      new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.85 }),
    )
    cpuLogo.position.set(-0.6, 1.3, -D / 2 + 0.46)
    scene.add(cpuLogo)

    // ---- RAM sticks (4 thin vertical bars beside CPU) ----
    const ramMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.6, roughness: 0.4 })
    const ramHeatspreaderMat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      emissive: 0x0891b2,
      emissiveIntensity: 0.4,
    })
    for (let i = 0; i < 4; i++) {
      const ram = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.05, 0.16), ramMat)
      ram.position.set(0.55 + i * 0.18, 1.18, -D / 2 + 0.18)
      scene.add(ram)
      const ramTop = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.06, 0.17), ramHeatspreaderMat)
      ramTop.position.set(0.55 + i * 0.18, 1.7, -D / 2 + 0.18)
      scene.add(ramTop)
    }

    // ---- AIO tubes (2 cylinders from radiator down to CPU block) ----
    const tubeCurveA = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.45, H / 2 - 0.5, -D / 2 + 0.45),
      new THREE.Vector3(-0.45, H / 2 - 1.4, -D / 2 + 0.45),
      new THREE.Vector3(-0.5, H / 2 - 1.85, -D / 2 + 0.5),
      new THREE.Vector3(-0.55, 1.55, -D / 2 + 0.45),
    ])
    const tubeCurveB = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, H / 2 - 0.5, -D / 2 + 0.45),
      new THREE.Vector3(-0.15, H / 2 - 1.5, -D / 2 + 0.45),
      new THREE.Vector3(-0.3, H / 2 - 1.95, -D / 2 + 0.5),
      new THREE.Vector3(-0.45, 1.55, -D / 2 + 0.45),
    ])
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6, metalness: 0.2 })
    for (const tubeCurve of [tubeCurveA, tubeCurveB]) {
      const tubeGeo = new THREE.TubeGeometry(tubeCurve, 24, 0.08, 8, false)
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat)
      scene.add(tubeMesh)
    }

    // ---- GPU body (horizontal, hangs off mobo PCIe slot) ----
    const gpuW = 3.6
    const gpuH = 0.7
    const gpuD = 1.4
    const gpu = new THREE.Mesh(
      new THREE.BoxGeometry(gpuW, gpuH, gpuD),
      new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.55, roughness: 0.5 }),
    )
    gpu.position.set(-0.85, -0.55, 0.15)
    scene.add(gpu)

    // GPU brand stripe (subtle)
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(gpuW * 0.82, 0.05, gpuD + 0.012),
      new THREE.MeshStandardMaterial({ color: 0x334155, emissive: 0x0e7490, emissiveIntensity: 0.35 }),
    )
    stripe.position.set(-0.85, -0.18, 0.15)
    scene.add(stripe)

    // GPU bottom intake fans
    const gpuFanGeo = new THREE.RingGeometry(0.07, 0.34, 20)
    const gpuFanMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, side: THREE.DoubleSide, roughness: 0.5 })
    for (const xOff of [-1.05, 0, 1.05]) {
      const gpuFan = new THREE.Mesh(gpuFanGeo, gpuFanMat)
      gpuFan.rotation.x = Math.PI / 2
      gpuFan.position.set(-0.85 + xOff, -0.91, 0.15)
      scene.add(gpuFan)
    }

    // PCIe rear bracket on -X side
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, gpuH * 1.5, gpuD * 0.95),
      new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.4, metalness: 0.7 }),
    )
    bracket.position.set(-W / 2 + 0.08, -0.42, 0.15)
    scene.add(bracket)

    // ---- PSU shroud (large box across the bottom) ----
    const psuShroudH = 1.15
    const psuShroud = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.96, psuShroudH, D * 0.95),
      new THREE.MeshStandardMaterial({ color: 0x05080d, roughness: 0.85, metalness: 0.15 }),
    )
    psuShroud.position.set(0, -H / 2 + psuShroudH / 2, 0)
    scene.add(psuShroud)
    // Subtle highlight strip on top edge of PSU
    const psuStripe = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.96, 0.03, D * 0.95),
      new THREE.MeshStandardMaterial({ color: 0x1f2937 }),
    )
    psuStripe.position.set(0, -H / 2 + psuShroudH + 0.015, 0)
    scene.add(psuStripe)

    // ---- Duct (ducted mode only) — solid scoop matching the close-up photo ----
    if (mode === "ducted") {
      // Side-profile traced from the close-up: tall front face that catches the bottom
      // intake fan and the lower half of the middle fan, gentle quadratic curve over
      // the top that meets the GPU underside at the rear.
      const frontX = W / 2 - 0.12
      const psuTopY = -2.15
      const frontTopY = 0.0
      const backX = -2.05
      const backTopY = -0.95
      const ctrlX = 0.5
      const ctrlY = frontTopY - 0.55
      const ductDepth = D - 0.4

      const ductShape = new THREE.Shape()
      ductShape.moveTo(frontX, psuTopY)
      ductShape.lineTo(frontX, frontTopY)
      ductShape.quadraticCurveTo(ctrlX, ctrlY, backX, backTopY)
      ductShape.lineTo(backX, psuTopY)
      ductShape.lineTo(frontX, psuTopY)

      const ductGeom = new THREE.ExtrudeGeometry(ductShape, {
        depth: ductDepth,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.025,
        bevelSegments: 2,
        curveSegments: 36,
      })
      ductGeom.translate(0, 0, -ductDepth / 2)

      // Matte 3D-printed PLA finish — solid black, slightly translucent so airflow shows through
      const duct = new THREE.Mesh(
        ductGeom,
        new THREE.MeshStandardMaterial({
          color: 0x080a0e,
          roughness: 0.96,
          metalness: 0.04,
          transparent: true,
          opacity: 0.82,
          side: THREE.DoubleSide,
        }),
      )
      scene.add(duct)

      // Subtle layer-line stripes on the visible side (3D-printed look)
      const layerLineMat = new THREE.LineBasicMaterial({ color: 0x1f2937, transparent: true, opacity: 0.55 })
      const layerVerts: number[] = []
      const layerCount = 12
      for (let i = 1; i < layerCount; i++) {
        const ly = psuTopY + (i / layerCount) * (frontTopY - psuTopY)
        layerVerts.push(frontX - 0.001, ly, ductDepth / 2 + 0.001, backX + 0.5, ly, ductDepth / 2 + 0.001)
      }
      const layerGeo = new THREE.BufferGeometry()
      layerGeo.setAttribute("position", new THREE.Float32BufferAttribute(layerVerts, 3))
      scene.add(new THREE.LineSegments(layerGeo, layerLineMat))

      // Cyan silhouette accent so the duct still pops against the dark scene
      const ductEdgesMesh = new THREE.LineSegments(
        new THREE.EdgesGeometry(ductGeom),
        new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.85 }),
      )
      scene.add(ductEdgesMesh)

      // Glowing intake mouth on the front face — covers bottom + lower middle fan
      const intakeMouth = new THREE.Mesh(
        new THREE.PlaneGeometry(ductDepth * 0.86, frontTopY - psuTopY - 0.08),
        new THREE.MeshBasicMaterial({
          color: 0x67e8f9,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
        }),
      )
      intakeMouth.rotation.y = -Math.PI / 2
      intakeMouth.position.set(frontX - 0.001, (frontTopY + psuTopY) / 2, 0)
      scene.add(intakeMouth)

      // Outlet glows on the curved top above each GPU bottom intake fan.
      // Solve the quadratic-bezier for x to find the corresponding y on the curve.
      const yOnTopAt = (xTarget: number) => {
        let lo = 0
        let hi = 1
        for (let i = 0; i < 20; i++) {
          const m = (lo + hi) / 2
          const xm = (1 - m) * (1 - m) * frontX + 2 * (1 - m) * m * ctrlX + m * m * backX
          if (xm > xTarget) lo = m
          else hi = m
        }
        const t = (lo + hi) / 2
        return (1 - t) * (1 - t) * frontTopY + 2 * (1 - t) * t * ctrlY + t * t * backTopY
      }
      for (const fanX of [-1.05, 0, 1.05]) {
        const outletX = -0.85 + fanX
        const outletY = yOnTopAt(outletX) - 0.04
        const outlet = new THREE.Mesh(
          new THREE.CircleGeometry(0.32, 24),
          new THREE.MeshBasicMaterial({
            color: 0x67e8f9,
            transparent: true,
            opacity: 0.34,
            side: THREE.DoubleSide,
          }),
        )
        outlet.rotation.x = -Math.PI / 2
        outlet.position.set(outletX, outletY, 0.15)
        scene.add(outlet)
      }
    }

    // Curves
    const flowCurves: PCFlowCurve[] = []
    const heatCurves: PCFlowCurve[] = []

    if (mode === "ducted") {
      flowCurves.push(
        // Bottom intake → along the duct floor → emerges at GPU back fan → up through GPU
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.85, -1.45, 0),
            new THREE.Vector3(2.2, -1.6, 0),
            new THREE.Vector3(1.0, -1.75, 0),
            new THREE.Vector3(-0.5, -1.6, 0),
            new THREE.Vector3(-1.4, -1.3, 0.05),
            new THREE.Vector3(-1.7, -1.05, 0.15),
            new THREE.Vector3(-1.9, -0.7, 0.15),
            new THREE.Vector3(-1.9, -0.3, 0.15),
            new THREE.Vector3(-2.4, -0.4, 0),
            new THREE.Vector3(-2.85, -0.4, 0),
          ]),
          color: 0x67e8f9,
          particleCount: 60,
          speed: 0.14,
          size: 0.07,
        },
        // Lower-middle intake (caught by the upper part of the duct mouth) → curves
        // along the duct's inner top → exits through the GPU center fan upward
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.85, -0.25, 0),
            new THREE.Vector3(2.3, -0.35, 0),
            new THREE.Vector3(1.5, -0.55, 0),
            new THREE.Vector3(0.5, -0.8, 0),
            new THREE.Vector3(-0.4, -0.95, 0.1),
            new THREE.Vector3(-0.85, -1.0, 0.15),
            new THREE.Vector3(-0.85, -0.55, 0.15),
            new THREE.Vector3(-0.85, 0.1, 0.15),
            new THREE.Vector3(-0.85, 1.0, 0),
            new THREE.Vector3(0.05, 2.95, 0),
          ]),
          color: 0x67e8f9,
          particleCount: 50,
          speed: 0.12,
          size: 0.065,
        },
        // Bottom intake (depth variant) → along the duct → emerges at GPU front fan
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.85, -1.45, -0.4),
            new THREE.Vector3(2.1, -1.65, -0.35),
            new THREE.Vector3(1.3, -1.55, -0.2),
            new THREE.Vector3(0.5, -1.2, -0.05),
            new THREE.Vector3(0.1, -0.95, 0.1),
            new THREE.Vector3(-0.05, -0.95, 0.15),
            new THREE.Vector3(-0.05, -0.6, 0.15),
            new THREE.Vector3(-0.4, -0.3, 0.15),
            new THREE.Vector3(-1.4, -0.4, 0),
            new THREE.Vector3(-2.85, -0.4, 0),
          ]),
          color: 0xbae6fd,
          particleCount: 35,
          speed: 0.115,
          size: 0.055,
        },
        // Top intake → straight up to top radiator (above the duct, unaffected)
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.85, 1.45, 0),
            new THREE.Vector3(1.6, 1.7, 0.2),
            new THREE.Vector3(0.6, 2.05, -0.1),
            new THREE.Vector3(0.05, 2.4, 0),
            new THREE.Vector3(0.05, 2.95, 0),
          ]),
          color: 0x67e8f9,
          particleCount: 24,
          speed: 0.11,
          size: 0.06,
        },
        // Upper-middle intake (above the duct mouth) → straight up to middle radiator fan
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.85, 0.55, 0),
            new THREE.Vector3(2.0, 0.95, 0),
            new THREE.Vector3(1.0, 1.45, 0),
            new THREE.Vector3(0.6, 2.0, 0),
            new THREE.Vector3(0.4, 2.4, 0),
            new THREE.Vector3(0.05, 2.95, 0),
          ]),
          color: 0xbae6fd,
          particleCount: 22,
          speed: 0.10,
          size: 0.055,
        },
      )
    } else {
      // Stock mode: air disperses, doesn't reach GPU effectively
      flowCurves.push(
        // Top intake → top radiator
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.85, 1.45, 0),
            new THREE.Vector3(1.5, 1.6, 0.2),
            new THREE.Vector3(0.5, 1.95, -0.1),
            new THREE.Vector3(0.05, 2.4, 0),
            new THREE.Vector3(0.05, 2.95, 0),
          ]),
          color: 0x67e8f9,
          particleCount: 28,
          speed: 0.10,
          size: 0.06,
        },
        // Middle intake → drifts and partially exhausts up
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.85, 0, 0),
            new THREE.Vector3(1.8, 0.35, 0.3),
            new THREE.Vector3(0.6, 0.0, -0.2),
            new THREE.Vector3(-0.6, 0.4, 0),
            new THREE.Vector3(-1.6, 0.95, 0),
            new THREE.Vector3(-1.6, 2.0, 0),
            new THREE.Vector3(-1.6, 2.95, 0),
          ]),
          color: 0x67e8f9,
          particleCount: 30,
          speed: 0.09,
          size: 0.06,
        },
        // Bottom intake → mostly disperses around PSU shroud, bypasses GPU
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.85, -1.45, 0),
            new THREE.Vector3(1.6, -1.3, -0.3),
            new THREE.Vector3(0.4, -1.65, 0.4),
            new THREE.Vector3(-0.8, -1.45, 0),
            new THREE.Vector3(-2.0, -1.6, 0),
            new THREE.Vector3(-2.85, -1.4, 0),
          ]),
          color: 0xbae6fd,
          particleCount: 30,
          speed: 0.085,
          size: 0.055,
        },
        // Bottom intake (depth variant) — drifts upward weakly toward GPU but loses momentum
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.85, -1.45, 0.4),
            new THREE.Vector3(1.0, -1.0, 0.2),
            new THREE.Vector3(-0.4, -0.6, 0),
            new THREE.Vector3(-1.2, -0.3, -0.2),
            new THREE.Vector3(-2.0, -0.4, 0),
            new THREE.Vector3(-2.85, -0.6, 0),
          ]),
          color: 0xbae6fd,
          particleCount: 22,
          speed: 0.075,
          size: 0.05,
        },
      )

      // Hot air pooling above GPU
      heatCurves.push(
        {
          curve: new THREE.CatmullRomCurve3(
            [
              new THREE.Vector3(-2.0, -0.15, 0.15),
              new THREE.Vector3(-1.5, 0.45, 0.5),
              new THREE.Vector3(-0.6, 0.95, -0.3),
              new THREE.Vector3(-0.85, 1.4, 0),
              new THREE.Vector3(-1.5, 1.7, 0.25),
              new THREE.Vector3(-1.2, 0.55, -0.1),
              new THREE.Vector3(-2.0, -0.15, 0.15),
            ],
            true,
          ),
          color: 0xf87171,
          particleCount: 16,
          speed: 0.06,
          size: 0.075,
        },
        {
          curve: new THREE.CatmullRomCurve3(
            [
              new THREE.Vector3(0.0, -0.18, 0.15),
              new THREE.Vector3(0.3, 0.55, -0.3),
              new THREE.Vector3(-0.2, 1.05, 0.35),
              new THREE.Vector3(-0.6, 1.6, 0),
              new THREE.Vector3(0.1, 0.95, 0.15),
              new THREE.Vector3(0.0, -0.18, 0.15),
            ],
            true,
          ),
          color: 0xf87171,
          particleCount: 14,
          speed: 0.055,
          size: 0.075,
        },
      )
    }

    // Particle systems via instanced spheres
    type ParticleSystem = {
      mesh: THREE.InstancedMesh
      curve: THREE.CatmullRomCurve3
      count: number
      speed: number
      offsets: number[]
    }

    const buildSystem = (flow: PCFlowCurve): ParticleSystem => {
      const sphereGeo = new THREE.SphereGeometry(flow.size, 8, 8)
      const sphereMat = new THREE.MeshBasicMaterial({
        color: flow.color,
        transparent: true,
        opacity: 0.9,
      })
      const mesh = new THREE.InstancedMesh(sphereGeo, sphereMat, flow.particleCount)
      mesh.frustumCulled = false
      const offsets: number[] = []
      for (let i = 0; i < flow.particleCount; i++) offsets.push(i / flow.particleCount)
      scene.add(mesh)
      return { mesh, curve: flow.curve, count: flow.particleCount, speed: flow.speed, offsets }
    }

    const flowSystems = flowCurves.map(buildSystem)
    const heatSystems = heatCurves.map(buildSystem)

    // Resize
    const resize = () => {
      const w = Math.max(mount.clientWidth, 320)
      const h = Math.max(mount.clientHeight, 240)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const resizeObs = new ResizeObserver(resize)
    resizeObs.observe(mount)
    resize()

    const dummy = new THREE.Object3D()
    let frameId = 0
    const startTime = performance.now()

    const tmpPoint = new THREE.Vector3()
    const updateSystem = (sys: ParticleSystem, time: number) => {
      for (let i = 0; i < sys.count; i++) {
        const raw = (time * sys.speed + sys.offsets[i]) % 1
        const t = Math.min(Math.max(raw, 0), 0.9999)
        sys.curve.getPoint(t, tmpPoint)
        const fade = Math.sin(t * Math.PI)
        dummy.position.copy(tmpPoint)
        dummy.scale.setScalar(0.55 + fade * 0.7)
        dummy.updateMatrix()
        sys.mesh.setMatrixAt(i, dummy.matrix)
      }
      sys.mesh.instanceMatrix.needsUpdate = true
    }

    const render = (now: number) => {
      const t = (now - startTime) / 1000
      for (const sys of flowSystems) updateSystem(sys, t)
      for (const sys of heatSystems) updateSystem(sys, t)
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(render)
    }
    frameId = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObs.disconnect()

      const visited = new Set<THREE.Material | THREE.BufferGeometry>()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments || obj instanceof THREE.InstancedMesh) {
          if (!visited.has(obj.geometry)) {
            obj.geometry.dispose()
            visited.add(obj.geometry)
          }
          const mat = obj.material as THREE.Material | THREE.Material[]
          if (Array.isArray(mat)) {
            mat.forEach((m) => {
              if (!visited.has(m)) {
                m.dispose()
                visited.add(m)
              }
            })
          } else if (!visited.has(mat)) {
            mat.dispose()
            visited.add(mat)
          }
        }
      })

      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [mode])

  return (
    <div
      ref={mountRef}
      className="relative w-full overflow-hidden rounded-lg"
      style={{ aspectRatio: "4 / 3", minHeight: 280, background: "linear-gradient(180deg, #050810 0%, #0b1220 100%)" }}
      aria-label={`${mode === "ducted" ? "Ducted" : "Stock"} airflow simulation: case interior with intake fans and GPU`}
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
  const [rubiksDirection, setRubiksDirection] = useState<RubiksDirection>(getInitialRubiksDirection)
  const [isRubiksSequencePlaying, setIsRubiksSequencePlaying] = useState(false)
  const [showRubiksVideo, setShowRubiksVideo] = useState(false)
  const [coolingAirflowMode, setCoolingAirflowMode] = useState<"stock" | "ducted">("ducted")

  const activeRubiksObjective = rubiksObjectives[rubiksDirection]
  const activeMoveSequence = activeRubiksObjective.trace
  const safeRubiksMove = Math.min(activeRubiksMove, activeMoveSequence.length - 1)
  const activeRubiksTrace = activeMoveSequence[safeRubiksMove]
  const activeRubiksVisual = getRubiksMoveVisual(activeRubiksTrace.move)
  const isRubiksFinalStep = safeRubiksMove === activeMoveSequence.length - 1
  const shouldHighlightTopFace = isRubiksFinalStep && rubiksPreviewMode !== "start"
  const showRubiksFinalOutcome = isRubiksFinalStep && rubiksPreviewMode === "result"

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

    setRubiksDirection(getInitialRubiksDirection())
    setRubiksPreviewMode(getInitialRubiksPreviewMode())
  }, [project])

  useEffect(() => {
    if (!isRubiksSequencePlaying) return

    setRubiksPreviewMode("animate")

    const timer = window.setTimeout(() => {
      setActiveRubiksMove((current) => {
        const currentStep = Math.min(current, activeMoveSequence.length - 1)

        if (currentStep >= activeMoveSequence.length - 1) {
          setIsRubiksSequencePlaying(false)
          setRubiksPreviewMode("result")
          return currentStep
        }

        setRubiksReplayKey((key) => key + 1)
        return currentStep + 1
      })
    }, 1420)

    return () => window.clearTimeout(timer)
  }, [activeMoveSequence.length, isRubiksSequencePlaying, safeRubiksMove])

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

  const replayRubiksAnimation = () => {
    setIsRubiksSequencePlaying(false)
    setRubiksPreviewMode("animate")
    setRubiksReplayKey((current) => current + 1)
  }
  const resetRubiksDemo = () => {
    setIsRubiksSequencePlaying(false)
    setActiveRubiksMove(0)
    setRubiksPreviewMode("start")
    setRubiksReplayKey((current) => current + 1)
  }
  const goToRubiksMove = (moveIndex: number) => {
    setIsRubiksSequencePlaying(false)
    setActiveRubiksMove(Math.min(Math.max(moveIndex, 0), activeMoveSequence.length - 1))
    setRubiksReplayKey((current) => current + 1)
  }
  const playRubiksFullSequence = () => {
    setActiveRubiksMove(0)
    setRubiksPreviewMode("animate")
    setRubiksReplayKey((current) => current + 1)
    setIsRubiksSequencePlaying(true)
  }
  const setRubiksDirectionAndReset = (direction: RubiksDirection) => {
    if (direction === rubiksDirection) return
    setIsRubiksSequencePlaying(false)
    setRubiksDirection(direction)
    setActiveRubiksMove(0)
    setRubiksPreviewMode("start")
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
            <section className="relative overflow-hidden rounded-xl border bg-[#05070b] text-white">
              <div className="absolute inset-0 micromouse-maze-bg opacity-80" aria-hidden="true" />
              <div className="relative grid grid-cols-1 gap-8 p-5 md:p-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-5">
                  <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-cyan-300">Maze telemetry</div>
                  <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                    Micromouse maze navigation robot
                  </h1>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                    Autonomous maze-solving robot using LiDAR, IMU, wheel encoders, PID control, and path planning to map and navigate a maze in real time.
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      { label: "Finish", value: "Top-3" },
                      { label: "Planner", value: "BFS" },
                      { label: "Control", value: "PID" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-md border border-white/10 bg-white/[0.06] p-3">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">{item.label}</div>
                        <div className="mt-1 text-lg font-bold">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.githubUrl && (
                      <Button asChild size="sm" className="rounded-md">
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          Source
                        </a>
                      </Button>
                    )}
                    {project.videoGallery?.[0] && (
                      <Button asChild size="sm" variant="outline" className="rounded-md border-white/20 bg-white/5 text-white hover:bg-white/10">
                        <a href={`https://www.youtube.com/watch?v=${project.videoGallery[0].id}`} target="_blank" rel="noopener noreferrer">
                          <Play className="mr-2 h-4 w-4" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_0.72fr]">
                    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/35">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src="/images/micromouse-testing-lab.jpeg"
                          alt="Micromouse robot testing inside maze"
                          fill
                          className="object-cover opacity-80"
                          sizes="(max-width: 1024px) 100vw, 46vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 480" aria-hidden="true">
                          <defs>
                            <path id="micromouse-hero-route" d="M98 388 L98 318 L178 318 L178 246 L264 246 L264 176 L354 176 L354 102 L468 102 L468 172 L544 172" />
                            <filter id="micromouse-route-glow" x="-40%" y="-40%" width="180%" height="180%">
                              <feGaussianBlur stdDeviation="4" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>
                          <path d="M98 388 L98 318 L178 318 L178 246 L264 246 L264 176 L354 176 L354 102 L468 102 L468 172 L544 172" stroke="#67e8f9" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.35" fill="none" />
                          <path className="micromouse-route-dash" d="M98 388 L98 318 L178 318 L178 246 L264 246 L264 176 L354 176 L354 102 L468 102 L468 172 L544 172" stroke="#67e8f9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#micromouse-route-glow)" />
                          <circle r="9" fill="#22c55e" filter="url(#micromouse-route-glow)">
                            <animateMotion dur="5s" repeatCount="indefinite">
                              <mpath href="#micromouse-hero-route" />
                            </animateMotion>
                          </circle>
                        </svg>
                        <div className="absolute bottom-4 left-4 rounded-md border border-cyan-300/25 bg-black/55 px-3 py-2 backdrop-blur">
                          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">Run objective</div>
                          <div className="text-sm font-bold">Map, plan, drive, correct</div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="group relative min-h-[260px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] text-left"
                      onClick={() => openLightbox(["/images/micromouse-robot.jpeg"], 0, "Micromouse robot")}
                    >
                      <Image
                        src="/images/micromouse-robot.jpeg"
                        alt="Micromouse robot close-up"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 1024px) 100vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Robot build</div>
                        <div className="mt-1 text-lg font-bold">Compact sensor stack</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {[
                { icon: Monitor, label: "Sense", value: "LiDAR + IMU + encoders" },
                { icon: Cpu, label: "Think", value: "occupancy map + BFS" },
                { icon: Gauge, label: "Control", value: "PID steering" },
                { icon: Zap, label: "Result", value: "Top-3 competition finish" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-lg border bg-muted/10 p-4">
                  <Icon className="mb-3 h-5 w-5 text-primary" />
                  <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">{label}</div>
                  <div className="mt-1 text-sm font-bold leading-snug">{value}</div>
                </div>
              ))}
            </section>

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="rounded-xl border bg-muted/10 p-5 md:p-6 lg:col-span-5">
                <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Navigation stack</div>
                <h2 className="text-2xl font-bold tracking-tight">Small corrections, every cell.</h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                  The robot constantly fused distance, heading, and wheel motion so small errors did not compound across the maze.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    { step: "01", title: "Read sensors", detail: "LiDAR, IMU, and encoders update the local state." },
                    { step: "02", title: "Update map", detail: "The maze representation changes as walls are discovered." },
                    { step: "03", title: "Plan route", detail: "Breadth-first search chooses the next useful cell." },
                    { step: "04", title: "Drive cleanly", detail: "PID keeps straight runs and turns consistent." },
                  ].map((item) => (
                    <div key={item.step} className="grid grid-cols-[2.5rem_1fr] gap-3 rounded-md border border-border/70 bg-background/70 p-3">
                      <div className="font-mono text-xs font-bold text-primary">{item.step}</div>
                      <div>
                        <div className="text-sm font-bold">{item.title}</div>
                        <div className="mt-1 text-xs leading-relaxed text-foreground/60">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-muted/10 p-5 md:p-6 lg:col-span-7">
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Path planning</div>
                    <h2 className="text-2xl font-bold tracking-tight">Route chosen from noisy data</h2>
                  </div>
                  <span className="rounded-md border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    BFS + PID
                  </span>
                </div>
                <button
                  type="button"
                  className="group relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border/70 bg-background/60"
                  onClick={() => openLightbox(["/images/micromouse-algorithm.jpeg"], 0, "Micromouse path planning output")}
                >
                  <Image
                    src="/images/micromouse-algorithm.jpeg"
                    alt="Micromouse path planning visualisation"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 54vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/15" />
                  <div className="absolute bottom-4 left-4 rounded-md border border-white/20 bg-black/55 px-3 py-2 text-left text-white backdrop-blur">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">Planner output</div>
                    <div className="text-sm font-bold">Search graph to driveable path</div>
                  </div>
                </button>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {[
                {
                  title: "Prototype wiring",
                  image: "/images/micromouse-prototype.jpeg",
                  alt: "Micromouse prototype wiring",
                  text: "Early layout validation before final assembly.",
                },
                {
                  title: "Final hardware",
                  image: "/images/micromouse-closeup.jpeg",
                  alt: "Micromouse assembled hardware close-up",
                  text: "Sensors, power, and motor wiring packed into the chassis.",
                },
                {
                  title: "Competition maze",
                  image: "/images/micromouse-testing-lab.jpeg",
                  alt: "Micromouse testing maze",
                  text: "Real testing in the maze exposed drift and tuning issues.",
                },
              ].map((item) => (
                <button
                  key={item.title}
                  type="button"
                  className="group overflow-hidden rounded-xl border bg-muted/10 text-left"
                  onClick={() => openLightbox([item.image], 0, item.title)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/5 dark:bg-white/[0.03]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 1024px) 100vw, 31vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-foreground/60">{item.text}</p>
                  </div>
                </button>
              ))}
            </section>

            {project.videoGallery && (
              <section className="rounded-xl border bg-muted/10 p-5 md:p-6">
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Run footage</div>
                    <h2 className="text-2xl font-bold tracking-tight">Testing the control loop</h2>
                  </div>
                  <p className="max-w-md text-sm leading-relaxed text-foreground/60">
                    Short demos of maze navigation, accuracy tuning, and straight-line PID behaviour.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {project.videoGallery.map((video) => (
                    <div key={video.id} className="overflow-hidden rounded-lg border border-border/70 bg-background/70">
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.id}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-full w-full"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-bold leading-snug">{video.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-foreground/55">{video.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : project.id === 3 ? (
          /* PC Cooling project with story steps layout */
          <div className="space-y-10">
            <section className="relative overflow-hidden rounded-xl border bg-muted/10">
              <div className="absolute inset-0 cooling-flow-bg" aria-hidden="true" />
              <div className="relative grid grid-cols-1 gap-7 p-5 md:p-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-6">
                  <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-primary">Thermal airflow retrofit</div>
                  <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                    Custom cooling funnels for PC hardware
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/72 md:text-base">
                    A 3D-printed ducting system that channels front-intake airflow directly into the GPU instead of letting it disperse through the case.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-md border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground/75">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <button
                    type="button"
                    className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/70 bg-background/70"
                    onClick={() => openLightbox(["/images/pc-cooling-installed.jpeg"], 0, "Cooling funnel installed")}
                  >
                    <Image
                      src="/images/pc-cooling-installed.jpeg"
                      alt="Custom cooling funnel installed in PC case"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-xl border bg-gradient-to-br from-muted/15 via-muted/5 to-muted/15 p-5 md:p-7">
              <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
                {/* Problem */}
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-red-500/15 text-red-300">
                      <AlertTriangle size={16} />
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300/85">
                      Problem
                    </div>
                  </div>
                  <p className="text-base font-semibold leading-snug">Air scattered inside the case.</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-foreground/55">
                    Front intake disperses before it reaches the GPU.
                  </p>
                </div>

                <div className="hidden self-center text-foreground/30 md:block">
                  <ArrowRight size={22} />
                </div>

                {/* Fix */}
                <div className="rounded-lg border border-primary/35 bg-primary/[0.08] p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-primary">
                      <Wrench size={16} />
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/85">
                      Fix
                    </div>
                  </div>
                  <p className="text-base font-semibold leading-snug">Duct the intake to the GPU.</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-foreground/55">
                    3D-printed shroud channels air straight to the bottom-fan inlet.
                  </p>
                </div>

                <div className="hidden self-center text-foreground/30 md:block">
                  <ArrowRight size={22} />
                </div>

                {/* Result */}
                <div className="rounded-lg border border-emerald-500/35 bg-emerald-500/[0.07] p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-emerald-500/15 text-emerald-300">
                      <TrendingDown size={16} />
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300/85">
                      Result
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tracking-tight">7°C</span>
                    <span className="text-sm font-medium text-foreground/65">lower under load</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-foreground/55">
                    Higher sustained boost clocks. Quieter fans.
                  </p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-5 rounded-lg border bg-muted/10 p-5 md:p-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-4">
                <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Airflow lab</div>
                <h2 className="text-2xl font-bold tracking-tight">From intake to GPU.</h2>
                <div className="mt-5 inline-flex rounded-md border border-border/70 bg-background/80 p-1">
                  {[
                    { id: "stock", label: "Stock" },
                    { id: "ducted", label: "Ducted" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      aria-pressed={coolingAirflowMode === mode.id}
                      onClick={() => setCoolingAirflowMode(mode.id as "stock" | "ducted")}
                      className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                        coolingAirflowMode === mode.id
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/65">
                  {coolingAirflowMode === "ducted"
                    ? "The lower intake air is captured by the printed duct and delivered into the GPU cooler."
                    : "Without the duct, intake air disperses through the case and heat lingers around the GPU."}
                </p>
                <div className="mt-5 max-w-sm rounded-lg border border-border/70 bg-background/70 p-4">
                  <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 text-xs text-foreground/70">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
                    <span>Blue particles show useful intake air.</span>
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]" />
                    <span>Red haze shows heat that is not being cleared quickly.</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8">
                <div className="relative overflow-hidden rounded-lg border border-border/70">
                  <PCCoolingScene mode={coolingAirflowMode} />
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="rounded-lg border bg-muted/10 p-5 md:p-6 lg:col-span-8">
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Before / After</div>
                    <h2 className="text-2xl font-bold tracking-tight">Airflow redirected to the GPU</h2>
                  </div>
                  <p className="max-w-sm text-sm leading-relaxed text-foreground/60">
                    Slide between the open case and the installed ducting to see the final airflow path.
                  </p>
                </div>
                <EnhancedBeforeAfterSlider
                  beforeImage="/images/pc-without-ducting.jpeg"
                  afterImage="/images/pc-cooling-installed.jpeg"
                  beforeAlt="PC without cooling ducting"
                  afterAlt="PC with custom cooling ducting installed"
                />
              </div>

              <div className="rounded-lg border bg-muted/10 p-5 md:p-6 lg:col-span-4">
                <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Why it worked</div>
                <h2 className="text-xl font-bold tracking-tight">Less wasted airflow inside the case.</h2>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-foreground/70">
                  <p>
                    The stock case airflow entered from the front, then spread into empty internal volume before reaching the GPU.
                  </p>
                  <p>
                    The funnel creates a controlled path from intake fans to the GPU cooler, reducing recirculation and improving thermal consistency.
                  </p>
                </div>
              </div>
            </section>

            {/* Story Steps */}
            <div className="rounded-lg border bg-muted/10 p-5 md:p-7">
              <div className="mb-8">
                <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Timeline</div>
                <h2 className="text-2xl font-bold tracking-tight">Project development story</h2>
              </div>
              <div className="relative space-y-8 before:absolute before:left-3 before:top-2 before:hidden before:h-[calc(100%-1rem)] before:w-px before:bg-border md:before:block lg:before:left-1/2">
                {project.storySteps?.map((step, index) => {
                  const textPanel = (
                    <div className="rounded-lg border border-border/70 bg-background/70 p-4 md:p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <h3 className="text-lg font-bold leading-tight">{step.title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/75">{step.description}</p>
                      {step.highlight && (
                        <div className="mt-4 rounded-md border border-primary/25 bg-primary/10 px-3 py-2.5">
                          <p className="text-xs font-medium leading-relaxed text-primary">{step.highlight}</p>
                        </div>
                      )}
                    </div>
                  )
                  const imagePanel = (
                    <button
                      type="button"
                      className="group relative block w-full overflow-hidden rounded-lg border border-border/70 bg-background/80 p-3 text-left shadow-sm transition-colors hover:border-primary/45"
                      onClick={() => openLightbox([step.image], 0, `Step ${index + 1}`)}
                    >
                      <div className={`relative ${step.aspectRatio || "aspect-video"} min-h-[240px] overflow-hidden rounded-md bg-black/5 dark:bg-white/[0.03]`}>
                        <Image
                          src={step.image || "/placeholder.svg"}
                          alt={step.title}
                          fill
                          className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </button>
                  )

                  return (
                    <div key={index} className="relative grid grid-cols-1 gap-4 pl-10 md:pl-12 lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] lg:items-center lg:gap-6 lg:pl-0">
                      <div className="absolute left-0 top-5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-primary/40 bg-background text-[10px] font-bold text-primary lg:left-1/2 lg:-translate-x-1/2">
                        {index + 1}
                      </div>
                      <div className={index % 2 === 0 ? "lg:col-start-1" : "lg:col-start-3"}>
                        {textPanel}
                      </div>
                      <div className="hidden lg:col-start-2 lg:block" aria-hidden="true" />
                      <div className={index % 2 === 0 ? "lg:col-start-3" : "lg:col-start-1 lg:row-start-1"}>
                        {imagePanel}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Temperature Comparison Results */}
            <section className="rounded-lg border bg-muted/10 p-5 md:p-7">
              <div className="mb-7 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-7">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Measured evidence</div>
                  <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Temperature test results</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/65">
                    Same GPU workload, same case, same benchmark style. The ducted airflow reduced load temperature by 7°C.
                  </p>
                </div>
                <div className="rounded-lg border border-primary/35 bg-primary/10 p-4 lg:col-span-5">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-primary/75">Result delta</div>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-4xl font-bold tracking-tight">7°C</span>
                    <span className="pb-1 text-sm font-semibold text-foreground/70">cooler under load</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/10">
                    <div className="h-full w-[72%] rounded-full bg-primary" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {[
                  {
                    title: "Baseline",
                    subtitle: "Without ducting",
                    image: "/images/gpu-test-without-ducting.png",
                    alt: "GPU temperature test without ducting",
                    state: "Hotter GPU load temperature",
                    tone: "border-red-400/35 bg-red-500/10 text-red-300",
                    lightTone: "text-red-700 dark:text-red-300",
                    lightSubtone: "text-red-600 dark:text-red-400",
                  },
                  {
                    title: "Ducted airflow",
                    subtitle: "With cooling funnel",
                    image: "/images/gpu-test-with-ducting.png",
                    alt: "GPU temperature test with ducting",
                    state: "7°C lower GPU temperature",
                    tone: "border-emerald-400/35 bg-emerald-500/10 text-emerald-300",
                    lightTone: "text-emerald-700 dark:text-emerald-300",
                    lightSubtone: "text-emerald-600 dark:text-emerald-400",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-border/70 bg-background/70 p-4">
                    <div className="mb-3 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">{item.title}</div>
                        <h3 className="text-lg font-semibold">{item.subtitle}</h3>
                      </div>
                      <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${item.tone}`}>
                        {item.state}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-md border border-border/70 bg-black/5 dark:bg-white/[0.03]"
                      onClick={() => openLightbox([item.image], 0, item.alt)}
                    >
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-border/70 bg-background/70 p-4 text-sm leading-relaxed text-foreground/70">
                The result matters because a lower sustained GPU temperature helps the card hold boost clocks longer while reducing how hard the fans need to work.
              </div>
            </section>

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
          <div className="space-y-7">
            <section className="overflow-hidden rounded-xl border bg-[#05070b] text-white">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
                <button
                  type="button"
                  className="group relative min-h-[360px] overflow-hidden text-left md:min-h-[480px]"
                  onClick={() => openLightbox(["/images/cat-door-v1.jpeg"], 0, "Cat door monitor installed")}
                >
                  <Image
                    src="/images/cat-door-v1.jpeg"
                    alt="Cat door monitor installed on security door"
                    fill
                    className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/35 to-transparent" />
                  <div className="absolute inset-x-6 bottom-6 md:left-8 md:max-w-lg">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-300" />
                      Armed at pet door
                    </div>
                    <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                      Cat door monitoring system
                    </h1>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-white/72 md:text-base">
                      A compact ESP32 guard that watches the pet door and sends a phone alert when the beam is broken.
                    </p>
                  </div>
                </button>

                <div className="border-t border-white/10 bg-black/55 p-5 md:p-7 lg:border-l lg:border-t-0">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.24em] text-primary">Live console</div>
                      <h2 className="mt-2 text-xl font-bold">Beam activity</h2>
                    </div>
                    {project.videoGallery?.[0] && (
                      <Button asChild size="sm" className="h-9 rounded-md">
                        <a href={`https://www.youtube.com/watch?v=${project.videoGallery[0].id}`} target="_blank" rel="noopener noreferrer">
                          <Play className="mr-2 h-4 w-4" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="rounded-md border border-cyan-300/25 bg-cyan-300/10 p-3">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/70">Emitter</div>
                        <div className="mt-1 text-sm font-bold text-cyan-100">IR beam</div>
                      </div>
                      <div className="relative h-2 w-20 overflow-hidden rounded-full bg-cyan-200/20 md:w-28">
                        <div className="cat-door-beam absolute inset-y-0 left-0 w-1/2 rounded-full bg-cyan-200" />
                      </div>
                      <div className="rounded-md border border-cyan-300/25 bg-cyan-300/10 p-3 text-right">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/70">Receiver</div>
                        <div className="mt-1 text-sm font-bold text-cyan-100">ESP32</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { time: "05:24", event: "Beam broken", state: "cat detected" },
                        { time: "08:43", event: "Debounced event", state: "valid trigger" },
                        { time: "08:43", event: "Telegram sent", state: "phone alerted" },
                      ].map((item) => (
                        <div key={`${item.time}-${item.event}`} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/35 px-3 py-2">
                          <div>
                            <div className="text-sm font-semibold">{item.event}</div>
                            <div className="text-xs text-white/46">{item.state}</div>
                          </div>
                          <span className="font-mono text-xs text-primary">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-emerald-300/25 bg-emerald-400/10 p-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/70">Result</div>
                    <div className="mt-1 text-2xl font-bold">Intruder detected in 2 days</div>
                    <p className="mt-2 text-sm leading-relaxed text-white/62">
                      V2 replaced unreliable PIR sensing with a beam break across the opening.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-xl border bg-muted/10 p-5 md:p-6">
                <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">V1 to V2</div>
                <h2 className="text-2xl font-bold tracking-tight">The sensor choice made the project work.</h2>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                  <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-red-300">V1 PIR</div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                      Triggered on insects and nearby door movement.
                    </p>
                  </div>
                  <div className="hidden items-center text-primary sm:flex">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-300">V2 beam</div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                      Only fires when the pet-door opening is crossed.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="group grid grid-cols-1 overflow-hidden rounded-xl border bg-muted/10 text-left md:grid-cols-[0.78fr_1fr]"
                onClick={() => openLightbox(["/images/cat-door-telegram-notifications.png"], 0, "Telegram alert log")}
              >
                <div className="relative min-h-[260px] bg-black/5 dark:bg-white/[0.03]">
                  <Image
                    src="/images/cat-door-telegram-notifications.png"
                    alt="Telegram notification log"
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 34vw"
                  />
                </div>
                <div className="flex flex-col justify-center p-5 md:p-6">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Phone evidence</div>
                  <h2 className="text-2xl font-bold tracking-tight">Every detection became a timestamped alert.</h2>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                    The Telegram bot made the prototype useful immediately: beam break, timestamp, notification.
                  </p>
                </div>
              </button>
            </section>

            <section className="rounded-xl border bg-muted/10 p-4 md:p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  {
                    title: "CAD housing",
                    image: "/images/cat-door-cad-design.jpeg",
                    alt: "Cat door CAD housing design",
                  },
                  {
                    title: "Printed frame",
                    image: "/images/cat-door-3d-printed.png",
                    alt: "3D printed cat door monitor housing",
                  },
                  {
                    title: "Bench validation",
                    image: "/images/cat-door-v2-system.png",
                    alt: "ESP32 break beam bench test",
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border/70 bg-background/60"
                    onClick={() => openLightbox([item.image], 0, item.title)}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 30vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-sm font-bold text-white">{item.title}</div>
                  </button>
                ))}
              </div>
            </section>
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
                        Python runs Kociemba locally: a fast two-phase solver used in speed-solving software to compute a near-optimal solution of roughly 20 moves in under 1 second.
                      </p>
                      <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                        Kociemba assumes all six faces can turn. This robot keeps the top open, so U and U&apos; moves are expanded into a workaround using the surrounding motors.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                        The ESP32 still follows the same solve plan, but top-face requests are expanded for the 5-axis configuration, producing roughly 55 physical motor commands.
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

              <section id="rubiks-trace" className="scroll-mt-32 rubiks-panel rounded-xl border border-border/70 p-5 md:p-7">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8">
                  <div className="lg:col-span-4 space-y-3">
                    <div>
                      <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">Interactive</div>
                      <h2 className="text-2xl font-bold tracking-tight">What is a U move?</h2>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/65">
                      U rotates the upper face. This robot has no top motor, so the cube below carries 13 physical turns
                      forward until the same top-turn outcome appears.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {rubiksNotationLegend.map((item) => (
                        <div key={item.symbol} className="rounded-md border border-border/70 bg-background/70 px-2.5 py-2">
                          <div className="font-mono text-xs text-primary/80">{item.symbol}</div>
                          <div className="mt-1 text-xs text-foreground/65">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-5">
                    <div className="rounded-lg border border-border/70 bg-background/75 p-4 md:p-5">
                      <div className="mb-3 flex flex-col items-start justify-between gap-3 border-b border-border/60 pb-3 sm:flex-row sm:items-center">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                            Objective
                          </div>
                          <div className="mt-0.5 flex items-baseline gap-2">
                            <span className="text-lg font-semibold">{activeRubiksObjective.label}</span>
                            <span className="font-mono text-xs text-primary/80">
                              {activeRubiksObjective.symbol}
                            </span>
                          </div>
                        </div>
                        <div className="flex rounded-md border border-border/70 bg-background/80 p-1">
                          {([
                            { id: "cw" as const, label: "Clockwise" },
                            { id: "ccw" as const, label: "Counter" },
                          ]).map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              aria-pressed={rubiksDirection === option.id}
                              onClick={() => setRubiksDirectionAndReset(option.id)}
                              className={`w-20 rounded px-2.5 py-1 text-center text-xs font-medium transition-colors ${
                                rubiksDirection === option.id
                                  ? "bg-primary text-primary-foreground"
                                  : "text-foreground/60 hover:text-foreground"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-2 hidden text-[11px] text-foreground/55 sm:block">
                        {activeRubiksObjective.detail}
                      </div>
                      <div className="mb-4 space-y-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                            {showRubiksFinalOutcome ? "Result" : `Step ${safeRubiksMove + 1} / ${activeMoveSequence.length}`}
                          </div>
                          <div className="mt-0.5 flex items-baseline gap-2">
                            <span className="text-sm font-semibold">
                              {showRubiksFinalOutcome ? `${activeRubiksObjective.symbol} achieved` : activeRubiksTrace.title}
                            </span>
                            <span className="font-mono text-xs text-primary/80">
                              {showRubiksFinalOutcome ? activeRubiksObjective.symbol : activeRubiksTrace.move}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 rounded-md"
                            disabled={isRubiksSequencePlaying}
                            onClick={playRubiksFullSequence}
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                            {isRubiksSequencePlaying ? "Playing" : "Play full sequence"}
                          </Button>
                          <div className="flex rounded-md border border-border/70 bg-background/80 p-1">
                            {rubiksPreviewModes.map((mode) => (
                              <button
                                key={mode.id}
                                type="button"
                                aria-pressed={rubiksPreviewMode === mode.id}
                                onClick={() => {
                                  setIsRubiksSequencePlaying(false)
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
                          <Button type="button" variant="outline" size="sm" className="h-8 rounded-md bg-background/80" onClick={resetRubiksDemo}>
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset
                          </Button>
                        </div>
                      </div>

                      {rubiksPreviewMode === "start" && (
                        <div className="rubiks-cube-intent" aria-hidden="true">
                          <div className="rubiks-cube-intent-item">
                            <span className="rubiks-cube-intent-kicker">Target</span>
                            <span className="rubiks-cube-intent-value">
                              Top face {rubiksDirection === "cw" ? "clockwise" : "anticlockwise"}
                            </span>
                          </div>
                          <div className="rubiks-cube-intent-divider" />
                          <div className="rubiks-cube-intent-item">
                            <span className="rubiks-cube-intent-kicker">Constraint</span>
                            <span className="rubiks-cube-intent-value">
                              <Lock className="h-3.5 w-3.5" />
                              No top motor
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="relative">
                        {showRubiksFinalOutcome && (
                          <div className="rubiks-goal-complete" aria-hidden="true">
                            <span className="rubiks-goal-complete-icon">
                              <CheckCircle2 className="h-5 w-5" />
                            </span>
                            <span>
                              <span className="block text-[10px] uppercase tracking-[0.18em] text-emerald-200/75">
                                Goal complete
                              </span>
                              <span className="font-semibold text-white">
                                {activeRubiksObjective.symbol} rotation achieved
                              </span>
                            </span>
                          </div>
                        )}
                        <RubiksPhysicalCube
                          activeFace={activeRubiksVisual.face}
                          turn={activeRubiksVisual.turn}
                          stepIndex={safeRubiksMove}
                          moveSequence={activeMoveSequence}
                          direction={rubiksDirection}
                          previewMode={rubiksPreviewMode}
                          replayKey={rubiksReplayKey}
                          moveLabel={activeRubiksTrace.move}
                          moveTitle={activeRubiksTrace.title}
                          highlightTopFace={shouldHighlightTopFace}
                        />
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-foreground/10" aria-label={`Step ${safeRubiksMove + 1} of ${activeMoveSequence.length}`}>
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${((safeRubiksMove + 1) / activeMoveSequence.length) * 100}%` }}
                        />
                      </div>
                      {showRubiksFinalOutcome && (
                        <div className="mt-4 rounded-lg border border-emerald-400/35 bg-emerald-400/10 px-4 py-3 text-sm leading-relaxed text-foreground/75">
                          <span className="font-semibold text-foreground">{activeRubiksObjective.symbol} achieved.</span>{" "}
                          The highlighted top face is the final rotation produced by chaining the surrounding motors instead of using a top-face motor.
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {activeMoveSequence.map((item, index) => (
                        <button
                          key={`${item.move}-${index}`}
                          type="button"
                          onClick={() => goToRubiksMove(index)}
                          className={`rounded-md border px-3 py-2 font-mono text-xs transition-all ${
                            safeRubiksMove === index && !showRubiksFinalOutcome
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
                        {showRubiksFinalOutcome ? "Result" : `Step ${safeRubiksMove + 1} of ${activeMoveSequence.length}`}
                      </div>
                      <h3 className="text-lg font-semibold">
                        {showRubiksFinalOutcome ? `${activeRubiksObjective.symbol} achieved` : activeRubiksTrace.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                        {showRubiksFinalOutcome
                          ? "The top face reached the target rotation by chaining the surrounding face motors."
                          : activeRubiksTrace.detail}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-md bg-background/80"
                          disabled={safeRubiksMove === 0}
                          onClick={() => goToRubiksMove(safeRubiksMove - 1)}
                        >
                          Previous
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="rounded-md"
                          onClick={() => {
                            setIsRubiksSequencePlaying(false)
                            setActiveRubiksMove((current) => (current + 1) % activeMoveSequence.length)
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
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-4 text-white opacity-95">
                        <div className="text-sm font-semibold">{photo.label}</div>
                        {"caption" in photo && photo.caption && (
                          <div className="mt-1 max-w-xl text-xs font-medium leading-snug text-white/78">
                            {photo.caption}
                          </div>
                        )}
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
                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Next steps</div>
                    <ul className="space-y-3 text-sm leading-relaxed text-foreground/65">
                      <li>A cleaner manual-input interface where the cube state is entered on-screen, then solved and executed from one button.</li>
                      <li>Computer-vision colour capture to remove manual state entry.</li>
                      <li>A 6th U-face mechanism for shorter physical solutions.</li>
                      <li>A custom PCB design to replace the breadboard wiring with a cleaner, more reliable electronics stack.</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : project.id === 6 ? (
          /* Custom Watch Build — editorial / craft layout */
          <div className="relative overflow-hidden pb-20">
            <div aria-hidden className="pointer-events-none absolute inset-x-[-12%] top-[-7rem] h-[34rem] bg-[radial-gradient(circle_at_52%_18%,rgba(217,119,6,0.14),transparent_30%),radial-gradient(circle_at_76%_46%,rgba(59,130,246,0.1),transparent_26%)]" />
            <WatchWaveDrift
              idPrefix="watch-page-wave-a"
              height={520}
              density={10}
              speed="slow"
              tone="rgba(156,180,204,0.12)"
              accentTone="rgba(212,165,87,0.18)"
              className="absolute inset-x-0 top-24 h-[34rem] opacity-[0.42]"
            />
            <WatchWaveDrift
              idPrefix="watch-page-wave-b"
              height={360}
              density={7}
              speed="fast"
              tone="rgba(107,138,168,0.10)"
              accentTone="rgba(212,165,87,0.14)"
              className="absolute inset-x-0 top-[48rem] h-[24rem] opacity-[0.34]"
            />
            <div className="relative space-y-14 md:space-y-20">
            {/* HERO */}
            <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050507] px-5 py-12 text-center text-white shadow-2xl shadow-black/35 sm:px-8 md:px-12 md:py-16">
              <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(217,119,6,0.1),transparent_38%),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:auto,56px_56px,56px_56px]" />
              <WatchWaveDrift
                idPrefix="watch-hero-wave"
                height={520}
                density={11}
                speed="slow"
                tone="rgba(156,180,204,0.15)"
                accentTone="rgba(212,165,87,0.32)"
                className="absolute inset-x-0 top-0 h-full opacity-[0.55]"
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_54%_48%,rgba(212,165,87,0.08),transparent_48%)]" />
              <div className="absolute inset-0 block md:inset-y-0 md:left-auto md:right-0 md:w-[46%]">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt=""
                  fill
                  className="object-cover object-top opacity-[0.14] saturate-[1.05] md:opacity-[0.32]"
                  sizes="46vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/75 to-[#050507]/25 md:via-[#050507]/58 md:to-transparent" />
              </div>
              <div className="relative mx-auto w-full max-w-4xl min-w-0">
              <div className="mb-7 inline-flex max-w-[17rem] rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-center text-[9px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-amber-100/80 sm:max-w-full sm:text-[10px] sm:tracking-[0.28em]">
                Reference 001 &nbsp;·&nbsp; Custom build
              </div>
              <h1 className="mx-auto max-w-[18rem] break-words font-serif text-3xl font-medium leading-[1.04] tracking-tight sm:max-w-4xl sm:text-5xl md:text-7xl">
                A mechanical watch,
                <br className="hidden sm:block" />
                <span className="italic text-amber-100"> assembled by hand.</span>
              </h1>
              <p className="mx-auto mt-7 max-w-[17rem] break-words text-sm leading-relaxed text-white/70 sm:max-w-lg sm:text-base">
                Sourced and hand-built around a Seiko NH35 movement. Every part was fitted, aligned, cleaned, and tested at wristwatch scale.
              </p>
              <div className="mx-auto mt-8 grid w-full max-w-[17rem] grid-cols-1 gap-2 sm:max-w-xl sm:grid-cols-3 sm:gap-3">
                {[
                  { label: "Movement", value: "NH35" },
                  { label: "Beat rate", value: "21,600" },
                  { label: "Reserve", value: "41 h" },
                ].map((item) => (
                  <div key={item.label} className="min-w-0 rounded-lg border border-white/10 bg-white/[0.055] p-3 shadow-inner shadow-white/[0.02] backdrop-blur-sm sm:p-4">
                    <div className="truncate text-[8px] uppercase tracking-[0.16em] text-white/42 sm:text-[9px] sm:tracking-[0.2em]">{item.label}</div>
                    <div className="mt-1 text-base font-bold tracking-tight text-white sm:text-lg">{item.value}</div>
                  </div>
                ))}
              </div>
              </div>
            </section>

            {/* Frontispiece image */}
            <section className="relative flex justify-center px-2">
              <figure className="w-full max-w-4xl text-center">
                <button
                  type="button"
                  className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-2.5 shadow-2xl shadow-black/40 sm:p-3"
                  onClick={() => openLightbox(["/images/GrandSeikoImage.png"], 0, project.title)}
                >
                  <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(245,158,11,0.18),transparent_32%)] opacity-70" />
                  <Image
                    src="/images/GrandSeikoImage.png"
                    alt={project.title}
                    width={980}
                    height={980}
                    className="relative block h-[min(780px,92vw)] w-full rounded-xl object-cover transition-transform duration-700 group-hover:scale-[1.018]"
                    style={{ objectPosition: "center 40%" }}
                    priority
                  />
                  <div className="absolute bottom-5 left-5 rounded-lg border border-white/15 bg-black/55 px-3 py-2 text-left text-white shadow-lg shadow-black/30 backdrop-blur-md sm:bottom-6 sm:left-6">
                    <div className="text-[9px] uppercase tracking-[0.22em] text-white/45">Finished build</div>
                    <div className="mt-1 text-sm font-bold">Inspect close-up</div>
                  </div>
                </button>
                <figcaption className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                  Seiko NH35A &nbsp;·&nbsp; 41 h reserve &nbsp;·&nbsp; 21,600 vph
                </figcaption>
              </figure>
            </section>

            {/* Specs ticker — single horizontal line */}
            <section className="border-y border-border/35 py-5">
              <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-7 gap-y-2 px-4 text-[10px] uppercase tracking-[0.24em] text-foreground/50 sm:text-[11px]">
                <span>Mechanical automatic</span>
                <span aria-hidden className="text-foreground/20">·</span>
                <span>Hand-pressed dial &amp; hands</span>
                <span aria-hidden className="text-foreground/20">·</span>
                <span>Sourced parts</span>
                <span aria-hidden className="text-foreground/20">·</span>
                <span>Dust-free assembly</span>
              </div>
            </section>

            {/* Video — the page's centerpiece */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  icon: Layers,
                  label: "Source",
                  title: "Compatible parts",
                  text: "Case, dial, hands, crown, bracelet, crystal, and NH35 movement checked before assembly.",
                },
                {
                  icon: Wrench,
                  label: "Assemble",
                  title: "Small-force work",
                  text: "Hands and dial pressed carefully so nothing scratched, bent, or fouled.",
                },
                {
                  icon: CheckCircle2,
                  label: "Verify",
                  title: "Runs cleanly",
                  text: "Final check for dust, alignment, hand clearance, and reliable wrist operation.",
                },
              ].map(({ icon: Icon, label, title, text }) => (
                <div key={label} className="group rounded-xl border border-border/60 bg-background/45 p-5 shadow-lg shadow-black/[0.03] transition-colors hover:border-amber-500/35 hover:bg-amber-500/[0.045]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">{label}</div>
                    <div className="grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-background/70 text-amber-500 transition-colors group-hover:border-amber-500/40">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h2 className="font-serif text-2xl font-medium tracking-tight">{title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/62">{text}</p>
                </div>
              ))}
            </section>

            {project.videoGallery && project.videoGallery[0] && (
              <section className="grid grid-cols-1 gap-6 rounded-2xl border border-border/60 bg-background/45 p-4 shadow-xl shadow-black/[0.04] md:p-6 lg:grid-cols-[0.34fr_0.66fr] lg:items-center">
                <div className="p-2 md:p-4">
                  <div className="text-[10px] uppercase tracking-[0.34em] text-primary">Watch the build</div>
                  <h2 className="mt-3 font-serif text-3xl font-medium leading-tight md:text-4xl">The careful bit is the whole project.</h2>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/62">
                    Dust control, hand setting, alignment, and patience at a scale where every mark shows.
                  </p>
                </div>
                <div className="w-full">
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/35">
                    <iframe
                      src={`https://www.youtube.com/embed/${project.videoGallery[0].id}`}
                      title={project.videoGallery[0].title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Pull quote — amber accent reserved for this page */}
            <section className="mx-auto max-w-3xl px-2">
              <div className="rounded-2xl border border-amber-500/20 bg-[linear-gradient(135deg,rgba(217,119,6,0.08),transparent_42%)] p-6 shadow-xl shadow-black/[0.03] md:p-8">
                <p className="font-serif text-xl italic leading-[1.55] text-foreground/85 md:text-2xl">
                  A moment of rushing or frustration can mean a scratched dial, a bent hand, or dust trapped under the crystal &mdash; all of which mean taking everything apart and starting over.
                </p>
              </div>
            </section>

            {/* Sign-off */}
            <section className="pt-2 text-center">
              <p className="mx-auto max-w-md font-serif text-3xl italic leading-tight text-foreground/80">
                It runs. Within spec. On the wrist.
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-foreground/35">
                That&rsquo;s the whole result.
              </p>
            </section>
            </div>
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
