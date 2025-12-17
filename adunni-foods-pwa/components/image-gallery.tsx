"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const galleryImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-08%20at%2014.04.54_b7290734.jpg-fwi1Hd2rf5mTBSJ1XrlGD2aLSRO917.jpeg",
    alt: "Founder showcasing Adunni Foods plantain chips products",
    caption: "Our founder proudly displaying our premium plantain chips collection",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-08%20at%2014.03.39_43794eb2.jpg-DEdW2jaZ92OAVveG7j7gWag5wWbbZU.jpeg",
    alt: "Happy customers at Adunni Foods market stall",
    caption: "Satisfied customers enjoying our products at local market events",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-08%20at%2014.03.42_d13befa1.jpg-cSqyR6TgyXadm7EgEFmjaCRheodaDu.jpeg",
    alt: "Customer with Adunni Foods branded bag",
    caption: "Customer with our signature branded packaging",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-08%20at%2014.04.56_01cc5f1f.jpg-uDmvPKA4w8wnCz4cHAMDsAzpBtMpxY.jpeg",
    alt: "Professional product display by founder",
    caption: "Professional display of our various plantain chip varieties",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-08%20at%2014.03.41_72b04582.jpg-9xaGh568V8nKUJk2sokvwMNVKsDl5q.jpeg",
    alt: "Customer examining Adunni Foods products",
    caption: "Customer appreciating the quality of our plantain chips",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-08%20at%2014.03.42_5d21f3d8.jpg-YNBuHa8KgeClTwMtqEyisrDbZXQQyO.jpeg",
    alt: "Happy customer with Adunni Foods bag",
    caption: "Another satisfied customer with our premium products",
  },
]

export function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const openModal = (index: number) => {
    setSelectedImage(index)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Our Story in Pictures</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See the passion, quality, and joy that goes into every package of Adunni Foods plantain chips
          </p>
        </div>

        {/* Scrollable Gallery */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 h-64 relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => openModal(index)}
              >
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-sm font-medium">{image.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
            onClick={prevImage}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
            onClick={nextImage}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={galleryImages[selectedImage].src || "/placeholder.svg"}
                alt={galleryImages[selectedImage].alt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                onClick={closeModal}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white text-lg font-medium bg-black/50 rounded-lg p-3">
                  {galleryImages[selectedImage].caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
