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
  const [coolingObstacle, setCoolingObstacle] = useState<{ x: number; y: number } | null>(null)

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

  const coolingObstacleActive = Boolean(
    coolingObstacle &&
      coolingObstacle.x > 145 &&
      coolingObstacle.x < 720 &&
      coolingObstacle.y > 100 &&
      coolingObstacle.y < 345,
  )
  const coolingObstacleX = coolingObstacle?.x ?? 500
  const coolingObstacleY = coolingObstacle?.y ?? 250
  const getCoolingStockPath = (startY: number, endX: number, endY: number, offset: number) => {
    if (!coolingObstacleActive) {
      return `M744 ${startY} C650 ${startY + offset * 0.25} 555 ${endY + offset * 0.2} ${endX} ${endY}`
    }

    const bendY = Math.min(360, Math.max(82, coolingObstacleY + offset))
    return `M744 ${startY} C${coolingObstacleX + 110} ${startY} ${coolingObstacleX + 72} ${bendY} ${coolingObstacleX + 14} ${bendY} C${coolingObstacleX - 90} ${bendY} ${endX + 82} ${endY} ${endX} ${endY}`
  }
  const coolingDuctTopPath = coolingObstacleActive
    ? `M746 272 C${coolingObstacleX + 126} 258 ${coolingObstacleX + 78} ${coolingObstacleY - 36} ${coolingObstacleX} ${coolingObstacleY - 36} C${coolingObstacleX - 114} ${coolingObstacleY - 36} 472 262 356 274`
    : "M746 276 C642 262 520 254 356 274"
  const coolingDuctBottomPath = coolingObstacleActive
    ? `M746 322 C${coolingObstacleX + 126} 336 ${coolingObstacleX + 78} ${coolingObstacleY + 42} ${coolingObstacleX} ${coolingObstacleY + 42} C${coolingObstacleX - 114} ${coolingObstacleY + 42} 472 310 356 292`
    : "M746 322 C640 334 510 326 356 292"

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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 rounded-md border border-white/20 bg-black/55 px-3 py-2 text-left text-white backdrop-blur">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">Measured result</div>
                      <div className="text-2xl font-bold">7°C lower GPU temps</div>
                    </div>
                  </button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-primary/35 bg-primary/10 p-5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary/75">Measured gain</div>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-bold tracking-tight">7°C</span>
                  <span className="pb-1 text-sm font-semibold text-foreground/70">cooler under GPU load</span>
                </div>
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/10 p-5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary/75">Airflow change</div>
                <div className="mt-2 text-2xl font-bold tracking-tight">Front intake straight to GPU</div>
                <div className="mt-2 text-sm text-foreground/60">Less case turbulence. More useful air.</div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-5 rounded-lg border bg-muted/10 p-5 md:p-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-4">
                <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Airflow lab</div>
                <h2 className="text-2xl font-bold tracking-tight">The duct turns messy air into a path.</h2>
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
                    ? "Front fan air is funnelled directly into the GPU cooler."
                    : "Front fan air enters the case, then spills upward and around the GPU."}
                </p>
              </div>
              <div className="lg:col-span-8">
                <div
                  className="relative overflow-hidden rounded-lg border border-border/70 bg-background/70 p-2 md:p-4"
                  onPointerMove={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect()
                    setCoolingObstacle({
                      x: ((event.clientX - rect.left) / rect.width) * 860,
                      y: ((event.clientY - rect.top) / rect.height) * 430,
                    })
                  }}
                  onPointerLeave={() => setCoolingObstacle(null)}
                >
                  <svg className="h-auto w-full" viewBox="0 0 860 430" role="img" aria-label={`${coolingAirflowMode === "ducted" ? "Ducted" : "Stock"} PC airflow diagram`}>
                    <defs>
                      <linearGradient id="coolingAir" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.95" />
                        <stop offset="52%" stopColor="#38bdf8" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="coolingDuct" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#111827" stopOpacity="0.96" />
                        <stop offset="55%" stopColor="#1f2937" stopOpacity="0.94" />
                        <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
                      </linearGradient>
                      <linearGradient id="coolingCaseGlow" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.16" />
                        <stop offset="52%" stopColor="#0f172a" stopOpacity="0" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.12" />
                      </linearGradient>
                      <filter id="coolingGlow" x="-30%" y="-80%" width="160%" height="260%">
                        <feGaussianBlur stdDeviation="7" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <marker id="coolingArrow" markerHeight="14" markerUnits="userSpaceOnUse" markerWidth="14" orient="auto" refX="12" refY="7">
                        <path d="M0,0 L13,7 L0,14 Z" fill="#67e8f9" />
                      </marker>
                      <marker id="coolingHeatArrow" markerHeight="14" markerUnits="userSpaceOnUse" markerWidth="14" orient="auto" refX="12" refY="7">
                        <path d="M0,0 L13,7 L0,14 Z" fill="#f87171" />
                      </marker>
                    </defs>

                    <rect x="8" y="8" width="844" height="414" rx="18" fill="currentColor" className="text-black/5 dark:text-white/[0.025]" stroke="currentColor" strokeOpacity="0.12" />
                    <rect x="72" y="52" width="714" height="326" rx="18" fill="#030712" fillOpacity="0.72" stroke="#334155" strokeOpacity="0.68" />
                    <rect x="72" y="52" width="714" height="326" rx="18" fill="url(#coolingCaseGlow)" />

                    <g opacity="0.24" stroke="currentColor" className="text-foreground">
                      {Array.from({ length: 11 }).map((_, index) => (
                        <line key={`case-v-${index}`} x1={118 + index * 58} x2={118 + index * 58} y1="80" y2="352" strokeWidth="1" />
                      ))}
                      {Array.from({ length: 5 }).map((_, index) => (
                        <line key={`case-h-${index}`} x1="98" x2="762" y1={104 + index * 52} y2={104 + index * 52} strokeWidth="1" />
                      ))}
                    </g>

                    <g aria-hidden="true">
                      <rect x="78" y="54" width="34" height="322" fill="#111827" stroke="#475569" strokeOpacity="0.7" />
                      <rect x="745" y="66" width="30" height="300" rx="6" fill="#111827" stroke="#475569" strokeOpacity="0.62" />
                      <rect x="126" y="306" width="368" height="44" rx="8" fill="#0f172a" stroke="#334155" strokeOpacity="0.85" />
                      <rect x="116" y="82" width="34" height="34" rx="6" fill="#020617" stroke="#334155" />
                      {Array.from({ length: 6 }).map((_, index) => (
                        <line key={`rear-slot-${index}`} x1="84" x2="104" y1={174 + index * 18} y2={174 + index * 18} stroke="#64748b" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" />
                      ))}
                      {Array.from({ length: 22 }).map((_, index) => (
                        <line key={`top-rad-${index}`} x1={232 + index * 15} x2={238 + index * 15} y1="75" y2="75" stroke="#64748b" strokeOpacity="0.55" strokeWidth="8" strokeLinecap="round" />
                      ))}
                    </g>

                    <g>
                      <rect x="704" y="92" width="50" height="246" rx="16" fill="#082f49" fillOpacity="0.62" stroke="#38bdf8" strokeOpacity="0.45" />
                      {[132, 216, 300].map((fanY) => (
                        <g key={`front-fan-${fanY}`}>
                          <circle cx="730" cy={fanY} r="30" fill="#020617" stroke="#7dd3fc" strokeOpacity="0.82" strokeWidth="2" />
                          <circle cx="730" cy={fanY} r="8" fill="#38bdf8" fillOpacity="0.8" />
                          <g transform={`translate(730 ${fanY})`}>
                            <animateTransform attributeName="transform" dur="1.4s" repeatCount="indefinite" type="rotate" from={`0 0 0`} to={`360 0 0`} additive="sum" />
                            <path d="M0 -24 C8 -20 13 -11 8 -4 C3 -7 -1 -14 0 -24Z" fill="#67e8f9" fillOpacity="0.65" />
                            <path d="M24 0 C20 8 11 13 4 8 C7 3 14 -1 24 0Z" fill="#67e8f9" fillOpacity="0.65" />
                            <path d="M0 24 C-8 20 -13 11 -8 4 C-3 7 1 14 0 24Z" fill="#67e8f9" fillOpacity="0.65" />
                            <path d="M-24 0 C-20 -8 -11 -13 -4 -8 C-7 -3 -14 1 -24 0Z" fill="#67e8f9" fillOpacity="0.65" />
                          </g>
                        </g>
                      ))}
                      <text x="682" y="362" fill="currentColor" className="text-[11px] uppercase tracking-[0.22em] text-foreground/55">Front intake</text>
                    </g>

                    <g>
                      <rect x="188" y="168" width="390" height="54" rx="8" fill="#1f2937" stroke="#64748b" strokeOpacity="0.75" />
                      <rect x="206" y="182" width="154" height="18" rx="4" fill="#0f172a" stroke="#94a3b8" strokeOpacity="0.45" />
                      <text x="220" y="196" fill="#e5e7eb" className="text-[16px] font-bold tracking-[0.08em]">GEFORCE RTX</text>
                      {Array.from({ length: 18 }).map((_, index) => (
                        <line key={`gpu-fin-${index}`} x1={396 + index * 8} x2={400 + index * 8} y1="178" y2="212" stroke="#cbd5e1" strokeOpacity="0.24" strokeWidth="3" />
                      ))}
                      <rect x="244" y="224" width="286" height="56" rx="10" fill="#0f172a" stroke="#475569" strokeOpacity="0.8" />
                      {Array.from({ length: 17 }).map((_, index) => (
                        <line key={`gpu-sink-${index}`} x1={260 + index * 15} x2={260 + index * 15} y1="232" y2="272" stroke="#94a3b8" strokeOpacity="0.34" strokeWidth="3" />
                      ))}
                      <text x="246" y="158" fill="currentColor" className="text-[11px] uppercase tracking-[0.22em] text-foreground/55">GPU cooler intake</text>
                    </g>

                    <g>
                      <circle cx="130" cy="210" r="34" fill="#020617" stroke="#7dd3fc" strokeOpacity="0.7" strokeWidth="2" />
                      <circle cx="130" cy="210" r="11" fill="#38bdf8" fillOpacity="0.72" />
                      <path d="M112 192 C125 184 143 186 151 199" stroke="#67e8f9" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" fill="none" />
                      <path d="M148 228 C134 236 118 232 110 220" stroke="#67e8f9" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" fill="none" />
                      <text x="102" y="266" fill="currentColor" className="text-[11px] uppercase tracking-[0.22em] text-foreground/55">Rear exhaust</text>
                    </g>

                    {coolingObstacleActive && (
                      <g>
                        <circle cx={coolingObstacleX} cy={coolingObstacleY} r="26" fill="#020617" fillOpacity="0.82" stroke="#f8fafc" strokeOpacity="0.5" />
                        <circle cx={coolingObstacleX} cy={coolingObstacleY} r="39" fill="none" stroke="#f8fafc" strokeDasharray="4 8" strokeOpacity="0.25" />
                      </g>
                    )}
                    {coolingAirflowMode === "ducted" ? (
                      <g>
                        <path
                          d="M748 242 C646 232 556 230 482 248 C428 262 386 286 342 294 L342 330 C430 342 514 344 588 326 C664 308 716 294 748 302 Z"
                          fill="url(#coolingDuct)"
                          stroke="#64748b"
                          strokeOpacity="0.78"
                          strokeWidth="2"
                        />
                        <path d="M748 246 C642 242 522 246 355 282" stroke="#94a3b8" strokeOpacity="0.22" strokeWidth="2" fill="none" />
                        <path d="M748 298 C640 312 516 318 355 304" stroke="#94a3b8" strokeOpacity="0.18" strokeWidth="2" fill="none" />
                        {coolingObstacleActive ? (
                          <>
                            <path className="cooling-flow-pulse" d={coolingDuctTopPath} stroke="url(#coolingAir)" strokeWidth="10" strokeLinecap="round" markerEnd="url(#coolingArrow)" filter="url(#coolingGlow)" fill="none" />
                            <path className="cooling-flow-pulse cooling-flow-pulse-late" d={coolingDuctBottomPath} stroke="url(#coolingAir)" strokeWidth="10" strokeLinecap="round" markerEnd="url(#coolingArrow)" filter="url(#coolingGlow)" fill="none" />
                          </>
                        ) : (
                          <>
                            <path className="cooling-flow-pulse" d={coolingDuctTopPath} stroke="url(#coolingAir)" strokeWidth="13" strokeLinecap="round" markerEnd="url(#coolingArrow)" filter="url(#coolingGlow)" fill="none" />
                            <path className="cooling-flow-pulse cooling-flow-pulse-late" d={coolingDuctBottomPath} stroke="url(#coolingAir)" strokeWidth="13" strokeLinecap="round" markerEnd="url(#coolingArrow)" filter="url(#coolingGlow)" fill="none" />
                          </>
                        )}
                        <path d="M344 284 L382 264 L378 304 Z" fill="#67e8f9" fillOpacity="0.9" filter="url(#coolingGlow)" />
                        <rect x="412" y="288" width="88" height="28" rx="6" fill="#064e3b" fillOpacity="0.72" stroke="#34d399" strokeOpacity="0.65" />
                        <text x="430" y="307" fill="#a7f3d0" className="text-[13px] font-bold">guided</text>
                      </g>
                    ) : (
                      <g>
                        <path className="cooling-flow-pulse" d={getCoolingStockPath(132, 198, 94, -86)} stroke="url(#coolingAir)" strokeWidth="9" strokeLinecap="round" markerEnd="url(#coolingArrow)" filter="url(#coolingGlow)" fill="none" />
                        <path className="cooling-flow-pulse cooling-flow-pulse-late" d={getCoolingStockPath(216, 245, 235, 0)} stroke="url(#coolingAir)" strokeWidth="9" strokeLinecap="round" markerEnd="url(#coolingArrow)" filter="url(#coolingGlow)" fill="none" />
                        <path className="cooling-flow-pulse" d={getCoolingStockPath(300, 420, 350, 78)} stroke="url(#coolingAir)" strokeWidth="9" strokeLinecap="round" markerEnd="url(#coolingArrow)" filter="url(#coolingGlow)" fill="none" />
                        <path d="M360 112 C286 108 220 132 168 178" stroke="#f87171" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.72" markerEnd="url(#coolingHeatArrow)" fill="none" />
                        <path d="M512 342 C442 362 356 358 282 328" stroke="#f87171" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.55" markerEnd="url(#coolingHeatArrow)" fill="none" />
                        <rect x="432" y="120" width="90" height="28" rx="6" fill="#7f1d1d" fillOpacity="0.62" stroke="#f87171" strokeOpacity="0.58" />
                        <text x="448" y="139" fill="#fecaca" className="text-[13px] font-bold">spills away</text>
                      </g>
                    )}
                  </svg>
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
                  <div className="rounded-md border border-primary/25 bg-primary/10 p-3 text-xs font-medium text-primary">
                    Inspired by automotive intake ducting: move air intentionally, not generally.
                  </div>
                </div>
              </div>
            </section>

            {/* Story Steps */}
            <div className="rounded-lg border bg-muted/10 p-5 md:p-7">
              <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Timeline</div>
                  <h2 className="text-2xl font-bold tracking-tight">Project development story</h2>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-foreground/60">
                  From airflow problem to printed ducting, with each stage shown without image cropping.
                </p>
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

            <section className="rounded-lg border bg-muted/10 p-5 md:p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  { label: "Problem", value: "Air scattered inside the case." },
                  { label: "Fix", value: "Duct the intake toward the GPU." },
                  { label: "Result", value: "7°C lower under load." },
                ].map((item) => (
                  <div key={item.label} className="rounded-md border border-border/70 bg-background/70 p-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-primary/75">{item.label}</div>
                    <div className="mt-2 text-sm font-semibold leading-snug text-foreground/85">{item.value}</div>
                  </div>
                ))}
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
