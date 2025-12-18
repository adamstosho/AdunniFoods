"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Package, Phone, MessageCircle } from "lucide-react"
import { OrderDetails } from "@/components/order-details"
import { api, type Order } from "@/lib/api"
import { toast } from "sonner"

const trackingSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
})

type TrackingFormData = z.infer<typeof trackingSchema>

import { useSettings } from "@/lib/hooks"

export function OrderTracking() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const { settings } = useSettings()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TrackingFormData>({
    resolver: zodResolver(trackingSchema),
  })

  const onSubmit = async (data: TrackingFormData) => {
    setLoading(true)
    setSearched(true)

    try {
      const response = await api.trackOrder(data.orderId, data.customerPhone)
      if (response.success && response.data) {
        setOrder(response.data)
        toast.success("Order found!")
      } else {
        setOrder(null)
        toast.error(response.message || "Order not found. Please check your details.")
      }
    } catch (error) {
      console.error("Tracking error:", error)
      toast.error("An error occurred while tracking. Please try again.")
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  const handleNewSearch = () => {
    setOrder(null)
    setSearched(false)
    reset()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">Track Your Order</h1>
          <p className="text-muted-foreground text-lg">
            Enter your order details below to track the status and delivery progress of your plantain chips.
          </p>
        </div>

        {!order ? (
          /* Tracking Form */
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find Your Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Order ID *</Label>
                  <Input
                    id="orderId"
                    {...register("orderId")}
                    placeholder="Enter your order ID (e.g. 658...)"
                    className={errors.orderId ? "border-destructive" : ""}
                  />
                  {errors.orderId && <p className="text-sm text-destructive">{errors.orderId.message}</p>}
                  <p className="text-xs text-muted-foreground">
                    You can find your order ID in the confirmation message sent to your WhatsApp
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    {...register("customerPhone")}
                    placeholder="e.g. 08012345678"
                    className={errors.customerPhone ? "border-destructive" : ""}
                  />
                  {errors.customerPhone && <p className="text-sm text-destructive">{errors.customerPhone.message}</p>}
                  <p className="text-xs text-muted-foreground">
                    Use the same phone number you provided when placing the order
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? "Searching..." : "Track Order"}
                </Button>
              </form>

              {searched && !order && !loading && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Can't find your order? Make sure you've entered the correct details.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    <a
                      href={`https://wa.me/${settings?.whatsappPhone || "2347030322419"}?text=I need help tracking my order`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Get Help on WhatsApp
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Order Details */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-2xl">Order Details</h2>
              <Button variant="outline" onClick={handleNewSearch} className="bg-transparent">
                Track Another Order
              </Button>
            </div>
            <OrderDetails order={order} />
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-12 bg-muted/50 border-none">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about your order or need assistance, we're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                <a href={`https://wa.me/${settings?.whatsappPhone || "2347030322419"}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Support
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                <a href={`tel:+${settings?.whatsappPhone || "2347030322419"}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  {`Call +${settings?.whatsappPhone || "2347030322419"}`}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
