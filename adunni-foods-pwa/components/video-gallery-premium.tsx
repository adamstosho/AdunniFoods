"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface Video {
  id: number
  title: string
  thumbnail: string
  videoUrl: string
  description: string
}

const videos: Video[] = [
  {
    id: 1,
    title: "Behind the Scenes",
    thumbnail: "/gallery-production.png",
    videoUrl: "https://www.instagram.com/reel/DTcpppWjYee/embed/",
    description: "See how we craft our premium plantain chips with passion and tradition",
  },
  {
    id: 2,
    title: "Plantain Chips Reel",
    thumbnail: "/gallery-product-detail-2.png",
    videoUrl: "https://www.instagram.com/reel/DTideT7DW_0/embed/",
    description: "Experience the ultimate crunch in every bite",
  },
  {
    id: 3,
    title: "Customer Moments",
    thumbnail: "/gallery-product-4.png",
    videoUrl: "https://www.instagram.com/reel/DS-cedfjU41/embed/",
    description: "See what our customers love about Adunni Foods",
  },
  {
    id: 4,
    title: "Crispy Perfection",
    thumbnail: "/gallery-product-3.png",
    videoUrl: "https://www.instagram.com/reel/DAq7GmqM63D/embed/",
    description: "Our commitment to quality, from harvest to your table",
  },
]

interface VideoCardProps {
  video: Video
  isHovered: boolean
  onHover: (id: number | null) => void
  onClick: () => void
  isVisible: boolean
}

function VideoCard({ video, isHovered, onHover, onClick, isVisible }: VideoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Auto-play logic: Start playing when section is visible, or when hovering
  useEffect(() => {
    if (!isVisible) {
      setIsPlaying(false)
      return
    }

    // Auto-play when section comes into view (with small delay for smoothness)
    const autoplayTimer = setTimeout(() => {
      setIsPlaying(true)
    }, 300)

    return () => clearTimeout(autoplayTimer)
  }, [isVisible])

  // Handle hover - keep playing during hover
  useEffect(() => {
    if (isHovered && isVisible) {
      setIsPlaying(true)
    }
  }, [isHovered, isVisible])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "100px" }}
      onMouseEnter={() => onHover(video.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
        {/* Video Container */}
        <div className="relative aspect-[9/16] bg-black overflow-hidden">
          {/* Thumbnail */}
          <motion.img
            src={video.thumbnail}
            alt={video.title}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-500",
              isPlaying ? "opacity-0 scale-105" : "opacity-100 scale-100"
            )}
          />

          {/* Auto-playing iframe */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full"
            >
              <iframe
                ref={iframeRef}
                src={video.videoUrl}
                title={video.title}
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                scrolling="no"
                style={{ border: "none" }}
              />
            </motion.div>
          )}

          {/* Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
            animate={{ opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          />

          {/* Play Button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: isPlaying ? 0 : isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-white/40 shadow-2xl"
              animate={{ scale: isHovered && !isPlaying ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </motion.div>
          </motion.div>

          {/* Title & Description Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: isHovered ? 0 : 10,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-white/80 text-xs font-medium mb-2 uppercase tracking-widest">
                Premium Video
              </p>
              <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
                {video.description}
              </p>
            </motion.div>

            <motion.h3
              className="text-2xl font-bold text-white mb-0 font-serif"
              animate={{ y: isHovered ? 0 : -5 }}
              transition={{ duration: 0.3 }}
            >
              {video.title}
            </motion.h3>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface ModalProps {
  video: Video | null
  onClose: () => void
}

function VideoModal({ video, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 md:p-8 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Fixed positioning */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute -top-16 md:-top-14 right-0 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/20 shadow-lg"
            >
              <X className="h-6 w-6" />
            </motion.button>

            {/* Main Content Container */}
            <div className="bg-zinc-900/50 backdrop-blur rounded-2xl overflow-hidden border border-white/10">
              {/* Video Container */}
              <div className="relative w-full rounded-t-2xl overflow-hidden bg-black">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={video.videoUrl}
                    title={video.title}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    scrolling="no"
                    style={{ border: "none" }}
                  />
                </div>
              </div>

              {/* Video Info - Below video, scrollable if needed */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 md:p-8 text-center border-t border-white/10"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-serif line-clamp-2">
                  {video.title}
                </h2>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  {video.description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function VideoGalleryPremium() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Section visibility detection for auto-play
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={containerRef}
      className="py-20 md:py-32 bg-gradient-to-b from-background via-black/5 to-background overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 font-serif tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            See Our Story in Action
          </motion.h2>
          <motion.div
            className="w-20 h-1.5 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full mb-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Experience the crunch and the passion behind every batch of Adunni Foods plantain chips.
            Hover or click to watch our story unfold.
          </motion.p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isHovered={hoveredId === video.id}
              onHover={setHoveredId}
              onClick={() => setSelectedVideo(video)}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-20"
        >
          <p className="text-muted-foreground mb-4">
            Want to see more? Follow us on social media for daily updates
          </p>
          <motion.a
            href="#"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Follow @adunnifoods
          </motion.a>
        </motion.div>
      </div>

      {/* Video Modal */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </section>
  )
}
