"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { Project } from "@/types"

function ProjectDetailClient() {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!id) {
          setError("Project ID is missing.")
          return
        }

        const response = await fetch(`/api/projects/${id}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.status}`)
        }
        const data = await response.json()
        setProject(data)
      } catch (error: any) {
        setError(error.message || "Failed to fetch project.")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (loading) {
    return <div>Loading project details...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!project) {
    return <div>Project not found.</div>
  }

  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      {/* Display other project details here */}
    </div>
  )
}

export default function ProjectDetailClient() {
  return <ProjectDetailClient />
}
