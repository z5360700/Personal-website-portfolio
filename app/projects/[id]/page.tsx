import ProjectDetailClient from "./ProjectDetailClient"

export async function generateStaticParams() {
  // Return the list of project IDs that should be statically generated
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }, { id: "6" }, { id: "7" }, { id: "8" }]
}

export default function ProjectDetail() {
  return <ProjectDetailClient />
}
