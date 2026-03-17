import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { ImageGallery } from "@/components/image-gallery"
import { FounderSection } from "@/components/founder-section"
import { EnhancedFeatures } from "@/components/enhanced-features"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { Navigation } from "@/components/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"
import { CartSidebar } from "@/components/cart-sidebar"
import { InstallPrompt } from "@/components/install-prompt"
import Script from "next/script"
import { VideoGalleryLazy } from "@/components/video-gallery-lazy"

export const metadata = {
  title: "Adunni Foods | Premium Nigerian Plantain Chips",
  description:
    "Fresh, crispy plantain chips made with authentic Nigerian recipes. Shop flavors, track orders, and enjoy fast delivery.",
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Script
        id="ld-json"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Adunni Foods",
            url: "https://adunnifoods.com",
            logo: "https://adunnifoods.com/adunnilogo.png",
            sameAs: [],
          }),
        }}
      />
      <Script
        id="ld-json-website"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Adunni Foods",
            url: "https://adunnifoods.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://adunnifoods.com/products?search={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <Navigation />
      <HeroSection />
      <FeaturedProducts />
      <VideoGalleryLazy />
      <ImageGallery />
      <FounderSection />
      <EnhancedFeatures />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <MobileNavigation />
      <CartSidebar />
      <InstallPrompt />
    </main>
  )
}
