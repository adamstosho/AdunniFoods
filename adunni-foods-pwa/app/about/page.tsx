import { Navigation } from "@/components/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"
import { CartSidebar } from "@/components/cart-sidebar"
import { AboutSection } from "@/components/about-section"
import { FounderSection } from "@/components/founder-section"
import { EnhancedFeatures } from "@/components/enhanced-features"

export const metadata = {
  title: "About Us - Adunni Foods | Premium Plantain Chips",
  description:
    "Learn about Adunni Foods, our founder, mission and the quality behind our premium plantain chips.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 lg:pt-20">
        <section className="container mx-auto px-4 py-10">
          <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">About Adunni Foods</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            We craft delicious, premium plantain chips using authentic Nigerian recipes and the freshest ingredients.
          </p>
        </section>
        <AboutSection />
        <FounderSection />
        <EnhancedFeatures />
      </div>
      <MobileNavigation />
      <CartSidebar />
    </main>
  )
}


