"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const videos = [
  {
    id: 1,
    title: "How We Make Our Plantain Chips",
    thumbnail: "/placeholder.svg?height=300&width=400&text=Making+Process",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video URLs
    duration: "2:45",
  },
  {
    id: 2,
    title: "Customer Testimonials",
    thumbnail: "/placeholder.svg?height=300&width=400&text=Happy+Customers",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1:30",
  },
  {
    id: 3,
    title: "Behind the Scenes at Adunni Foods",
    thumbnail: "/placeholder.svg?height=300&width=400&text=Behind+Scenes",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "3:20",
  },
  {
    id: 4,
    title: "Quality Control Process",
    thumbnail: "/placeholder.svg?height=300&width=400&text=Quality+Control",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2:15",
  },
]

export function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<(typeof videos)[0] | null>(null)

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4 font-serif">See Our Story in Action</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how we craft our delicious plantain chips with love, care, and the finest ingredients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative overflow-hidden rounded-xl bg-muted">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-primary rounded-full p-4">
                    <Play className="h-6 w-6 text-primary-foreground fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>
              <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary transition-colors">
                {video.title}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative bg-background rounded-xl overflow-hidden max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="aspect-video">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground">{selectedVideo.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
