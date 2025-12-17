import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { VideoGallery } from "@/components/video-gallery"
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

export const metadata = {
  title: "Adunni Foods | Premium Nigerian Plantain Chips",
  description:
    "Fresh, crispy plantain chips made with authentic Nigerian recipes. Shop flavors, track orders, and enjoy fast delivery.",
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturedProducts />
      <VideoGallery />
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
