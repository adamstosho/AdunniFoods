"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Smartphone, Banknote, User, MessageCircle } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { api, type Order } from "@/lib/api"
import { toast } from "sonner"

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(10, "Please enter a complete address"),
  paymentMethod: z.enum(["bank_transfer", "mobile_money", "cash_on_delivery"]),
  notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const { items, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "bank_transfer",
    },
  })

  const watchedPaymentMethod = watch("paymentMethod")

  useEffect(() => {
    if (items.length === 0) {
      router.push("/products")
    }
  }, [items, router])

  const totalPrice = getTotalPrice()
  const deliveryFee = totalPrice >= 50 ? 0 : 5
  const finalTotal = totalPrice + deliveryFee

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)

    try {
      const orderData: Order = {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        address: data.address,
        items: items.map((item) => ({
          product: item.product,
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
        totalAmount: finalTotal,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      }

      const orderSummary = items
        .map((item) => `${item.qty}x ${item.name} - ₦${(item.price * item.qty).toFixed(2)}`)
        .join("\n")
      const whatsappMessage = encodeURIComponent(
        `🛒 *New Order from ${data.customerName}*\n\n` +
          `📱 Phone: ${data.customerPhone}\n` +
          `📍 Address: ${data.address}\n\n` +
          `*Order Details:*\n${orderSummary}\n\n` +
          `💰 Total: ₦${finalTotal.toFixed(2)}\n` +
          `💳 Payment: ${paymentMethods.find((p) => p.id === data.paymentMethod)?.name}\n` +
          `${data.notes ? `📝 Notes: ${data.notes}\n` : ""}` +
          `\nPlease confirm this order. Thank you! 🙏`,
      )

      const response = await api.createOrder(orderData)

      if (response.success && response.data) {
        clearCart()
        // Store order details for success page
        sessionStorage.setItem("lastOrderId", response.data._id || "")
        sessionStorage.setItem("whatsappMessage", whatsappMessage)

        setTimeout(() => {
          window.open(`https://wa.me/2348144665646?text=${whatsappMessage}`, "_blank")
        }, 2000)

        router.push("/checkout/success")
        toast.success("Order placed successfully! Redirecting to WhatsApp...")
      } else {
        throw new Error(response.message || "Failed to create order")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const paymentMethods = [
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      description: "Transfer to our bank account",
      icon: CreditCard,
    },
    {
      id: "mobile_money",
      name: "Mobile Money",
      description: "Pay with mobile money",
      icon: Smartphone,
    },
    {
      id: "cash_on_delivery",
      name: "Cash on Delivery",
      description: "Pay when you receive your order",
      icon: Banknote,
    },
  ]

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Checkout Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Customer Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        {...register("customerName")}
                        placeholder="Enter your full name"
                        className={errors.customerName ? "border-destructive" : ""}
                      />
                      {errors.customerName && <p className="text-sm text-destructive">{errors.customerName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone Number *</Label>
                      <Input
                        id="customerPhone"
                        {...register("customerPhone")}
                        placeholder="e.g., 08123456789"
                        className={errors.customerPhone ? "border-destructive" : ""}
                      />
                      {errors.customerPhone && (
                        <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      {...register("address")}
                      placeholder="Enter your complete delivery address including landmarks"
                      rows={3}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      {...register("notes")}
                      placeholder="Any special instructions for your order"
                      rows={2}
                    />
                  </div>
                </div>

                <Separator />

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </h3>

                  <RadioGroup
                    value={watchedPaymentMethod}
                    onValueChange={(value) => setValue("paymentMethod", value as any)}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label
                          htmlFor={method.id}
                          className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <method.icon className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-muted-foreground">{method.description}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {/* Payment Instructions */}
                  {watchedPaymentMethod === "bank_transfer" && (
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                        <div className="text-sm space-y-1">
                          <p>
                            <strong>Bank:</strong> First Bank of Nigeria
                          </p>
                          <p>
                            <strong>Account Name:</strong> Adunni Foods Ltd
                          </p>
                          <p>
                            <strong>Account Number:</strong> 1234567890
                          </p>
                          <p className="text-muted-foreground mt-2">
                            Please send payment confirmation via WhatsApp after transfer.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {watchedPaymentMethod === "mobile_money" && (
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Mobile Money Details</h4>
                        <div className="text-sm space-y-1">
                          <p>
                            <strong>Provider:</strong> MTN Mobile Money
                          </p>
                          <p>
                            <strong>Number:</strong> 08144665646
                          </p>
                          <p>
                            <strong>Name:</strong> Adunni Foods
                          </p>
                          <p className="text-muted-foreground mt-2">
                            Please send payment confirmation via WhatsApp after transfer.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {watchedPaymentMethod === "cash_on_delivery" && (
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Cash on Delivery</h4>
                        <p className="text-sm text-muted-foreground">
                          Pay with cash when your order is delivered. Please have the exact amount ready.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg"
                >
                  {isSubmitting ? "Processing Order..." : `Place Order & Send to WhatsApp - ₦${finalTotal.toFixed(2)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product} className="flex items-center gap-3">
                    <img
                      src={item.image || `/placeholder.svg?height=50&width=50&query=${item.name} plantain chips`}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                    </div>
                    <div className="text-sm font-medium">₦{(item.price * item.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₦{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? "Free" : `₦${deliveryFee.toFixed(2)}`}</span>
                </div>
                {totalPrice >= 50 && <div className="text-xs text-green-600">Free delivery on orders over ₦50!</div>}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₦{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Contact Info */}
              <Card className="bg-muted/50 border-none">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Need Help?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">Contact us on WhatsApp for any questions</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    <a
                      href="https://wa.me/2348144665646?text=I need help with my order"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
