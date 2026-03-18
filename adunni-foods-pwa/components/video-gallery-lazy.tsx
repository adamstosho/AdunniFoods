"use client"

import dynamic from "next/dynamic"

export const VideoGalleryLazy = dynamic(() => import("@/components/video-gallery-premium").then((m) => m.VideoGalleryPremium), {
  ssr: false,
  loading: () => (
    <section className="py-20 md:py-32 bg-muted/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="h-12 w-2/3 mx-auto bg-muted rounded-lg animate-pulse mb-6" />
          <div className="h-6 w-full bg-muted rounded animate-pulse mb-4" />
          <div className="h-6 w-4/5 mx-auto bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-3xl bg-muted aspect-[9/16] animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  ),
})

