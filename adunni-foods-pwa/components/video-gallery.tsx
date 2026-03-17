"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { Volume2, X, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"

type VideoType = "instagram"

interface Video {
  id: number
  title: string
  videoUrl: string
  duration: string
  type: VideoType
}

const videos: Video[] = [
  {
    id: 1,
    title: "Behind the Scenes",
    videoUrl: "https://www.instagram.com/adunnifoods_plantainchips/reel/DTcpppWjYee/",
    duration: "0:30",
    type: "instagram" as const,
  },
  {
    id: 2,
    title: "Plantain Chips Reel",
    videoUrl: "https://www.instagram.com/adunnifoods_plantainchips/reel/DTideT7DW_0/",
    duration: "0:30",
    type: "instagram" as const,
  },
  {
    id: 3,
    title: "Customer Moments",
    videoUrl: "https://www.instagram.com/adunnifoods_plantainchips/reel/DS-cedfjU41/",
    duration: "0:30",
    type: "instagram" as const,
  },
  {
    id: 4,
    title: "Crispy Perfection",
    videoUrl: "https://www.instagram.com/adunnifoods_plantainchips/reel/DS-cedfjU41/",
    duration: "0:25",
    type: "instagram" as const,
  },
]

function toInstagramEmbedUrl(url: string) {
  if (url.includes("/embed/")) return url
  const match = url.match(/instagram\.com\/[^/]+\/reel\/([^/]+)\//i)
  if (match?.[1]) return `https://www.instagram.com/reel/${match[1]}/embed/`
  return url
}

function getPreviewUrl(video: Video) {
  const embed = toInstagramEmbedUrl(video.videoUrl)
  return `${embed}?autoplay=1&muted=1`
}

function getModalUrl(video: Video) {
  const embed = toInstagramEmbedUrl(video.videoUrl)
  return `${embed}?autoplay=1`
}

export function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [activeIds, setActiveIds] = useState<Set<number>>(new Set())
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    loop: true,
    skipSnaps: false,
    dragFree: true
  })
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  // Intersection Observer for lazy loading iframes
  const itemEls = useRef(new Map<number, HTMLElement>())
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setActiveIds((prev) => {
          const next = new Set(prev)
          for (const e of entries) {
            const idAttr = (e.target as HTMLElement).dataset.videoId
            if (idAttr) {
              const id = Number(idAttr)
              if (e.isIntersecting) next.add(id)
              else next.delete(id)
            }
          }
          return next
        })
      },
      { rootMargin: "200px", threshold: 0.1 }
    )

    itemEls.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-24 bg-linear-to-b from-background via-muted/5 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif tracking-tight">
            See Our Story in Action
          </h2>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the crunch and the passion behind every batch of Adunni Foods plantain chips.
          </p>
        </motion.div>

        <div className="relative group/carousel">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 md:-ml-6">
              {videos.map((video, index) => (
                <div 
                  key={video.id} 
                  className="flex-[0_0_85%] min-w-0 pl-4 md:flex-[0_0_45%] lg:flex-[0_0_33.33%] md:pl-6"
                  ref={(el) => { if (el) itemEls.current.set(video.id, el) }}
                  data-video-id={video.id}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-muted shadow-2xl transition-all duration-500 group-hover:shadow-primary/20">
                      {/* Video Preview */}
                      <iframe
                        src={activeIds.has(video.id) ? getPreviewUrl(video) : "about:blank"}
                        title={video.title}
                        className="absolute inset-0 w-full h-full scale-[1.6] origin-center pointer-events-none transition-transform duration-700 group-hover:scale-[1.7]"
                        allow="autoplay; encrypted-media; fullscreen"
                        style={{ border: "none" }}
                        scrolling="no"
                      />

                      {/* Glass Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-60" />

                      {/* Content Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-1/2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-primary/90 backdrop-blur-md text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            Reel
                          </span>
                          <span className="bg-black/40 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <Clock className="w-3 h-3 text-white" /> {video.duration}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{video.title}</h3>
                        <p className="text-white/70 text-sm transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          Click to play with sound
                        </p>
                      </div>

                      {/* Play Button Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
                          <Volume2 className="h-8 w-8 text-white fill-current" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center mt-12 gap-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground shadow-lg"
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <div className="flex gap-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 shadow-sm",
                    selectedIndex === index ? "bg-primary w-8" : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                  )}
                  onClick={() => scrollTo(index)}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground shadow-lg"
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative bg-zinc-900 rounded-3xl overflow-hidden max-w-[450px] w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-6 right-6 z-20 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/20"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="aspect-[9/16] w-full flex items-center justify-center bg-black">
                  <iframe
                    src={getModalUrl(selectedVideo)}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    style={{ border: "none" }}
                    scrolling="no"
                  />
                </div>

                <div className="p-6 bg-linear-to-t from-black to-zinc-900 border-t border-white/5">
                  <h3 className="text-xl font-bold text-white mb-1">{selectedVideo.title}</h3>
                  <p className="text-zinc-400 text-sm">Now playing with sound on Adunni Foods</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
