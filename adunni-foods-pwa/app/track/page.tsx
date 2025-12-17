import { OrderTracking } from "@/components/order-tracking"
import { Navigation } from "@/components/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"

export const metadata = {
  title: "Track Your Order - Adunni Foods | Order Status",
  description: "Track your plantain chips order status and delivery progress in real-time.",
}

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 lg:pt-20">
        <OrderTracking />
      </div>
      <MobileNavigation />
    </main>
  )
}
