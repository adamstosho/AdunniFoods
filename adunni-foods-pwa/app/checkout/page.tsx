import { CheckoutForm } from "@/components/checkout-form"
import { Navigation } from "@/components/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"

export const metadata = {
  title: "Checkout - Adunni Foods | Complete Your Order",
  description: "Complete your order for premium plantain chips. Fast and secure checkout process.",
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 lg:pt-20">
        <CheckoutForm />
      </div>
      <MobileNavigation />
    </main>
  )
}
