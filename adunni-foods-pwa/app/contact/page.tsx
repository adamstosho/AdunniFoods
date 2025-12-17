import { Navigation } from "@/components/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"
import { CartSidebar } from "@/components/cart-sidebar"
import { ContactSection } from "@/components/contact-section"

export const metadata = {
  title: "Contact Us - Adunni Foods",
  description: "Get in touch with Adunni Foods for orders, partnerships, or support.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 lg:pt-20">
        <section className="container mx-auto px-4 py-10">
          <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            We’d love to hear from you. Send us a message and we’ll respond quickly.
          </p>
        </section>
        <ContactSection />
      </div>
      <MobileNavigation />
      <CartSidebar />
    </main>
  )
}


