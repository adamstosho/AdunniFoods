"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-3JuRMrq25YrIGsCYA1lXAUNGQNkeqg.jpeg"
          alt="Delicious golden plantain chips"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
      </div>

      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-16 h-16 bg-primary/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/30 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-accent/30 rounded-full blur-xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-primary/20 rounded-full blur-lg animate-bounce delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            <span className="block text-primary drop-shadow-lg">Adunni Foods</span>
            Premium Plantain Chips
            <span className="block text-2xl md:text-3xl lg:text-4xl font-normal mt-2 text-white/90">
              Made with Love & Tradition
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            Experience the authentic taste of Nigeria with our crispy, golden plantain chips. Crafted fresh daily using
            traditional methods and the finest locally-sourced plantains.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 text-lg font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-primary/25 border-2 border-primary/20"
            >
              <Link href="/products" className="flex items-center gap-2">
                Order Fresh Chips Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-foreground px-10 py-5 text-lg font-bold rounded-full transition-all duration-300 hover:scale-105 bg-white/10 backdrop-blur-sm"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Our Story
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              100% Natural Ingredients
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Same Day Delivery
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Made Fresh Daily
            </div>
          </div>
        </div>

        <div
          className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2000+</div>
            <div className="text-white/90 text-sm md:text-base font-medium">Happy Customers</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5★</div>
            <div className="text-white/90 text-sm md:text-base font-medium">Average Rating</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24h</div>
            <div className="text-white/90 text-sm md:text-base font-medium">Fresh Delivery</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-white/90 text-sm md:text-base font-medium">Natural</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
