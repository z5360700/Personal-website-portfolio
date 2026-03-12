"use client"

import { useState } from "react"
import { ConstructionSlideshowGallery } from "./construction-slideshow-gallery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Project } from "@/data/projects-data"

interface ConstructionSlideshowProps {
  project: Project
}

export function ConstructionSlideshow({ project }: ConstructionSlideshowProps) {
  const [activeTab, setActiveTab] = useState("exterior")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="exterior">Exterior</TabsTrigger>
          <TabsTrigger value="interior">Interior</TabsTrigger>
          <TabsTrigger value="finished">Finished</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
        </TabsList>

        {/* Exterior Construction */}
        <TabsContent value="exterior" className="space-y-4">
          {project.exteriorGallery && (
            <ConstructionSlideshowGallery
              title="Exterior Construction"
              images={project.exteriorGallery}
              altPrefix="Exterior construction"
            />
          )}
        </TabsContent>

        {/* Interior Work */}
        <TabsContent value="interior" className="space-y-4">
          {project.interiorGallery && (
            <ConstructionSlideshowGallery
              title="Interior Work"
              images={project.interiorGallery}
              altPrefix="Interior work"
            />
          )}
        </TabsContent>

        {/* Finished Product */}
        <TabsContent value="finished" className="space-y-4">
          {project.finishedProductGallery && (
            <ConstructionSlideshowGallery
              title="Finished Product"
              images={project.finishedProductGallery}
              altPrefix="Finished product"
            />
          )}
        </TabsContent>

        {/* Additional Photos */}
        <TabsContent value="additional" className="space-y-4">
          {project.miscellaneousGallery && (
            <ConstructionSlideshowGallery
              title="Additional Photos"
              images={project.miscellaneousGallery}
              altPrefix="Additional photos"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
