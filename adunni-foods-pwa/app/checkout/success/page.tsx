import { OrderSuccess } from "@/components/order-success"
import { Navigation } from "@/components/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"

export const metadata = {
  title: "Order Confirmed - Adunni Foods | Thank You!",
  description: "Your order has been confirmed. Thank you for choosing Adunni Foods!",
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 lg:pt-20">
        <OrderSuccess />
      </div>
      <MobileNavigation />
    </main>
  )
}
