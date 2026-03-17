"use client"

import dynamic from "next/dynamic"

export const VideoGalleryLazy = dynamic(() => import("@/components/video-gallery").then((m) => m.VideoGallery), {
  ssr: false,
  loading: () => (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="h-10 w-3/4 mx-auto bg-muted rounded animate-pulse mb-4" />
          <div className="h-5 w-full bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-6 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_33%] rounded-2xl bg-muted aspect-[9/16] animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  ),
})

