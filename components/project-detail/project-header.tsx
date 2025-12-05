import type { Project } from "@/data/projects-data"

interface ProjectHeaderProps {
  project: Project
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="text-center bg-muted/20 rounded-lg p-6 border">
      <h1 className="text-2xl md:text-3xl font-bold mb-3">{project.title}</h1>
      {project.course && (
        <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium mb-3">
          Course: {project.course}
        </div>
      )}
      <p className="text-base text-foreground/80 mb-4 max-w-4xl mx-auto">{project.description}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
