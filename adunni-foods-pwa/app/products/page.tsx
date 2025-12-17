import { ProductCatalog } from "@/components/product-catalog"
import { Navigation } from "@/components/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"
import { CartSidebar } from "@/components/cart-sidebar"

export const metadata = {
  title: "Products - Adunni Foods | Premium Plantain Chips",
  description: "Browse our collection of premium plantain chips. Fresh, crispy, and made with love.",
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 lg:pt-20">
        <ProductCatalog />
      </div>
      <MobileNavigation />
      <CartSidebar />
    </main>
  )
}
