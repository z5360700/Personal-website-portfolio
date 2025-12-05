import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Project } from "@/data/projects-data"

interface ProjectTabsProps {
  project: Project
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  return (
    <div className="bg-muted/10 rounded-lg p-6 border">
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="technologies">Technologies</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="features" className="mt-4">
          <h2 className="text-lg font-bold mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="technologies" className="mt-4">
          <h2 className="text-lg font-bold mb-4">Technologies Used</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(project.technologies).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-bold mb-2 text-primary capitalize text-sm">
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <ul className="space-y-1">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-foreground/60 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-foreground/80 text-xs">{item}</span>
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
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-sm">{project.challenges}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
