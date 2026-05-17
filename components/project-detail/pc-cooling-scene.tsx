"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

type PCCoolingMode = "stock" | "ducted"

type PCFlowCurve = {
  curve: THREE.CatmullRomCurve3
  color: number
  particleCount: number
  speed: number
  size: number
}

export default function PCCoolingScene({ mode }: { mode: PCCoolingMode }) {
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
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.display = "block"
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
