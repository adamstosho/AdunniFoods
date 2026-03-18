"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const getGalleryImages = () => [
  {
    src: "/founder-main.png",
    alt: "Zimbiat Mojirayo Toyin showcasing Adunni Foods products",
    caption: "Our founder proudly displaying our premium plantain chips collection",
  },
  {
    src: "/gallery-production.png",
    alt: "High-quality production of Adunni Foods plantain chips",
    caption: "Meticulous preparation of our crispy, golden plantain chips",
  },
  {
    src: "/gallery-product-3.png",
    alt: "Premium plantain chips in eco-friendly packaging",
    caption: "Premium plantain chips presented in our signature eco-friendly packaging",
  },
  {
    src: "/gallery-founder-products.jpg",
    alt: "Founder with multiple product varieties",
    caption: "A variety of packaging options to suit every customer's needs",
  },
  {
    src: "/gallery-product-detail-1.png",
    alt: "Close up of Adunni Foods plantain chips packaging",
    caption: "Premium, hygienic packaging ensuring freshness and quality",
  },
  {
    src: "/gallery-product-4.png",
    alt: "Close up of crispy plantain chips",
    caption: "A closer look at the natural, golden crunch of Adunni Foods chips",
  },
  {
    src: "/gallery-product-detail-2.png",
    alt: "Crispy plantain chips close up",
    caption: "The perfect crunch in every bite, made with 100% natural ingredients",
  },
  {
    src: "/our-story-main.png",
    alt: "Adunni Foods brand story visual",
    caption: "Building a legacy of excellence in Nigerian healthy snacks",
  },
]

export function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const openModal = (index: number) => setSelectedImage(index)
  const closeModal = () => setSelectedImage(null)

  const galleryImages = getGalleryImages()

  // Auto-scroll horizontally (smooth, mobile-friendly)
  useEffect(() => {
    if (!api) return
    if (selectedImage !== null) return

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    let interval: ReturnType<typeof setInterval> | null = null
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null

    const start = () => {
      if (interval) return
      interval = setInterval(() => {
        if (document.visibilityState !== "visible") return
        api.scrollNext()
      }, 3500)
    }

    const stop = () => {
      if (!interval) return
      clearInterval(interval)
      interval = null
    }

    const scheduleResume = () => {
      if (resumeTimeout) clearTimeout(resumeTimeout)
      resumeTimeout = setTimeout(() => {
        start()
      }, 4500)
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") start()
      else stop()
    }

    // Pause on user interaction (dragging) and resume after a delay.
    api.on("pointerDown", stop)
    api.on("pointerUp", scheduleResume)
    document.addEventListener("visibilitychange", onVisibility)

    start()

    return () => {
      stop()
      if (resumeTimeout) clearTimeout(resumeTimeout)
      document.removeEventListener("visibilitychange", onVisibility)
      api.off("pointerDown", stop)
      api.off("pointerUp", scheduleResume)
    }
  }, [api, selectedImage])

  return (
    <section className="py-20 lg:py-28 bg-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary font-medium tracking-larger uppercase text-sm mb-4 block">
            Visual Journey
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Our Story in Pictures
          </h2>
          <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            See the passion, quality, and joy that goes into every package of Adunni Foods plantain chips
          </p>
        </motion.div>

        {/* Premium Embla Carousel Gallery */}
        {mounted && (
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative max-w-7xl mx-auto"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6 lg:-ml-8">
              {galleryImages.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:pl-6 lg:pl-8 basis-[85%] sm:basis-1/2 lg:basis-1/3"
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative h-[400px] md:h-[450px] cursor-pointer rounded-2xl overflow-hidden shadow-lg border border-border/50 bg-background"
                    onClick={() => openModal(index)}
                  >
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    
                    {/* Elegant Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    
                    {/* Animated Caption */}
                    <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 translate-y-4 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <div className="w-10 h-1 bg-primary mb-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                      <p className="text-white text-base lg:text-lg font-medium leading-tight">
                        {image.caption}
                      </p>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Elegant Navigation Controls */}
            <div className="hidden md:block">
              <CarouselPrevious className="absolute -left-6 lg:-left-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-background hover:bg-primary hover:text-primary-foreground border-border shadow-2xl transition-all duration-300 hover:scale-110 z-10" />
              <CarouselNext className="absolute -right-6 lg:-right-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-background hover:bg-primary hover:text-primary-foreground border-border shadow-2xl transition-all duration-300 hover:scale-110 z-10" />
            </div>
          </Carousel>
        </motion.div>
        )}

        {/* Modal Viewer */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-100 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 lg:p-12"
              onClick={closeModal}
            >
              <Button
                variant="outline"
                size="icon"
                className="absolute top-6 right-6 lg:top-10 lg:right-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border-white/20 hover:border-white transition-all duration-300 z-50"
                onClick={closeModal}
              >
                <X className="w-6 h-6" />
              </Button>
              <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-6xl w-full max-h-full flex flex-col items-center justify-center pointer-events-none"
              >
                <img
                  src={galleryImages[selectedImage].src || "/placeholder.svg"}
                  alt={galleryImages[selectedImage].alt}
                  loading="lazy"
                  className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl ring-1 ring-white/10 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 text-center max-w-3xl pointer-events-auto"
                >
                  <p className="text-white text-lg md:text-xl font-medium tracking-wide">
                    {galleryImages[selectedImage].caption}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
