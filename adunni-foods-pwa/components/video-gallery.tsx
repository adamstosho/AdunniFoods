"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Volume2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type VideoType = "youtube" | "instagram" | "tiktok"

interface Video {
  id: number
  title: string
  videoUrl: string
  duration: string
  type: VideoType
  tiktokId?: string
  instagramId?: string
}

const videos: Video[] = [
  {
    id: 1,
    title: "How We Make Our Plantain Chips",
    videoUrl: "https://www.tiktok.com/embed/v2/7509048070475140408",
    tiktokId: "7509048070475140408",
    duration: "0:56",
    type: "tiktok" as const,
  },
  {
    id: 2,
    title: "Customer Testimonials",
    videoUrl: "https://www.instagram.com/reel/DRcAi2XjPO0/embed/",
    instagramId: "DRcAi2XjPO0",
    duration: "0:45",
    type: "instagram" as const,
  },
  {
    id: 3,
    title: "Behind the Scenes at Adunni Foods",
    videoUrl: "https://www.tiktok.com/embed/v2/7555462854888148242",
    tiktokId: "7555462854888148242",
    duration: "0:58",
    type: "tiktok" as const,
  },
  {
    id: 4,
    title: "Quality Control Process",
    videoUrl: "https://www.tiktok.com/embed/v2/7583992708742581522",
    tiktokId: "7583992708742581522",
    duration: "0:30",
    type: "tiktok" as const,
  },
]

// Helper to get embed URL with autoplay + mute for preview
function getPreviewUrl(video: Video) {
  if (video.type === "youtube") {
    // YouTube: autoplay, muted, loop, no controls, playlist for loop
    const videoId = video.videoUrl.split("/embed/")[1]?.split("?")[0]
    return `${video.videoUrl}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`
  }
  if (video.type === "instagram") {
    // Instagram doesn't support autoplay params well, but we can try
    return `${video.videoUrl}?autoplay=1`
  }
  if (video.type === "tiktok") {
    return `${video.videoUrl}?autoplay=1&mute=1`
  }
  return video.videoUrl
}

// Helper to get embed URL with sound for modal
function getModalUrl(video: Video) {
  if (video.type === "youtube") {
    return `${video.videoUrl}?autoplay=1&rel=0`
  }
  return video.videoUrl
}

export function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const tiktokContainerRef = useRef<HTMLDivElement>(null)

  // Load TikTok embed script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.tiktok.com/embed.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script if needed
    }
  }, [])

  // Re-initialize TikTok embed when modal opens
  useEffect(() => {
    if (selectedVideo?.type === "tiktok" && typeof window !== "undefined") {
      // @ts-ignore - TikTok global
      if (window.tiktokEmbed) {
        // @ts-ignore
        window.tiktokEmbed.lib.render()
      }
    }
  }, [selectedVideo])

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
              <div className="relative overflow-hidden rounded-xl bg-muted aspect-[9/16] md:aspect-square">
                {/* Embedded video preview - autoplay, muted, looping */}
                {video.type === "youtube" && (
                  <iframe
                    src={getPreviewUrl(video)}
                    title={video.title}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    allow="autoplay; encrypted-media"
                    style={{ border: 'none' }}
                  />
                )}

                {video.type === "instagram" && (
                  <iframe
                    src={getPreviewUrl(video)}
                    title={video.title}
                    className="absolute inset-0 w-full h-full scale-150 origin-center pointer-events-none"
                    allow="autoplay; encrypted-media"
                    style={{ border: 'none' }}
                    scrolling="no"
                  />
                )}

                {video.type === "tiktok" && (
                  <iframe
                    src={getPreviewUrl(video)}
                    title={video.title}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    allow="autoplay; encrypted-media"
                    style={{ border: 'none' }}
                    scrolling="no"
                  />
                )}

                {/* Overlay with click-to-unmute indicator */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                {/* Click to play with sound indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 rounded-full p-3 shadow-lg">
                    <Volume2 className="h-6 w-6 text-foreground" />
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm z-10">
                  {video.duration}
                </div>

                {/* Platform badges */}
                {video.type === "tiktok" && (
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs z-10 flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                    TikTok
                  </div>
                )}
                {video.type === "instagram" && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-2 py-1 rounded text-xs z-10 flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Instagram
                  </div>
                )}
                {video.type === "youtube" && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs z-10 flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YouTube
                  </div>
                )}
              </div>
              <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary transition-colors text-center">
                {video.title}
              </h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Click to play with sound
              </p>
            </motion.div>
          ))}
        </div>

        {/* Video Modal - plays with sound */}
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative bg-background rounded-xl overflow-hidden max-w-2xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-20 bg-background/80 hover:bg-background"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="h-4 w-4" />
              </Button>

              {selectedVideo.type === "tiktok" ? (
                <div className="flex justify-center py-4 max-h-[80vh] overflow-auto" ref={tiktokContainerRef}>
                  <blockquote
                    className="tiktok-embed"
                    cite={`https://www.tiktok.com/@adunnifoods_plantainchip/video/${selectedVideo.tiktokId}`}
                    data-video-id={selectedVideo.tiktokId}
                    style={{ maxWidth: '605px', minWidth: '325px' }}
                  >
                    <section>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.tiktok.com/@adunnifoods_plantainchip/video/${selectedVideo.tiktokId}`}
                      >
                        Loading TikTok video...
                      </a>
                    </section>
                  </blockquote>
                </div>
              ) : selectedVideo.type === "instagram" ? (
                <div className="flex justify-center py-4">
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    className="w-full max-w-md"
                    style={{ minHeight: '600px', border: 'none' }}
                    allowFullScreen
                    scrolling="no"
                  />
                </div>
              ) : (
                <div className="aspect-video">
                  <iframe
                    src={getModalUrl(selectedVideo)}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ border: 'none' }}
                  />
                </div>
              )}

              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-foreground">{selectedVideo.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Now playing with sound</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
