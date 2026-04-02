import { readFileSync, writeFileSync, existsSync } from "fs"

// Try multiple candidate paths
const candidates = [
  "/vercel/share/v0-project/components/projects.tsx",
  "/home/user/v0-project/components/projects.tsx",
  "./components/projects.tsx",
  "components/projects.tsx",
]

let filePath = null
for (const p of candidates) {
  if (existsSync(p)) {
    filePath = p
    console.log("[v0] Found file at:", p)
    break
  } else {
    console.log("[v0] Not found:", p)
  }
}

if (!filePath) {
  console.error("[v0] Could not find projects.tsx in any candidate path.")
  process.exit(1)
}

const content = readFileSync(filePath, "utf8")

const updated = content.replace(
  /image: "\/placeholder\.svg",/,
  'image: "/images/RubikCubeFrontImage.png",'
)

if (updated === content) {
  console.log("[v0] No change made — pattern not found.")
  const lines = content.split("\n")
  lines.forEach((line, i) => {
    if (line.includes("placeholder") || line.includes("Rubik")) {
      console.log(`[v0] Line ${i + 1}: ${line.trim()}`)
    }
  })
} else {
  writeFileSync(filePath, updated, "utf8")
  console.log("[v0] Successfully updated Rubik's Cube image path.")
}
