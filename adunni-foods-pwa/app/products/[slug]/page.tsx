import { ProductDetail } from "@/components/product-detail"
import { Navigation } from "@/components/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"
import { CartSidebar } from "@/components/cart-sidebar"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    return {
      title: `${params.slug.replace(/-/g, " ")} – Adunni Foods`,
      description:
        "Explore ingredients, price and details for our premium plantain chips flavor. Add to cart and enjoy fast delivery.",
    }
  } catch {
    return {
      title: "Product Not Found - Adunni Foods",
    }
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 lg:pt-20">
        <ProductDetail slug={params.slug} />
      </div>
      <MobileNavigation />
      <CartSidebar />
    </main>
  )
}
