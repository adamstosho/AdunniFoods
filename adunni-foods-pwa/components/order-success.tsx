"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MessageCircle, Home, Package, Copy, Check } from "lucide-react"
import Link from "next/link"

import { useSettings } from "@/lib/hooks"

export function OrderSuccess() {
  const [orderId, setOrderId] = useState<string>("")
  const [whatsappUrl, setWhatsappUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const { settings } = useSettings()

  useEffect(() => {
    const storedOrderId = sessionStorage.getItem("lastOrderId")
    const storedWhatsappUrl = sessionStorage.getItem("whatsappUrl")

    if (storedOrderId) {
      setOrderId(storedOrderId)
    }
    if (storedWhatsappUrl) {
      setWhatsappUrl(storedWhatsappUrl)
    }

    // Clear stored data after use
    sessionStorage.removeItem("lastOrderId")
    sessionStorage.removeItem("whatsappUrl")
  }, [])

  const copyOrderId = async () => {
    if (orderId) {
      await navigator.clipboard.writeText(orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const phone = settings?.whatsappPhone || "2347030322419"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Thank you for your order! We've received your request and will start preparing your delicious plantain chips
          right away.
        </p>

        {/* Order Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {orderId && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono font-medium">{orderId}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyOrderId} className="bg-transparent">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    Step 1
                  </Badge>
                  <p className="text-sm font-medium">Order Received</p>
                  <p className="text-xs text-muted-foreground">We've got your order</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">
                    Step 2
                  </Badge>
                  <p className="text-sm font-medium">Preparing</p>
                  <p className="text-xs text-muted-foreground">Making your chips fresh</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">
                    Step 3
                  </Badge>
                  <p className="text-sm font-medium">Delivery</p>
                  <p className="text-xs text-muted-foreground">On the way to you</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Order Confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a WhatsApp message confirming your order details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Preparation</p>
                  <p className="text-sm text-muted-foreground">
                    We'll start preparing your fresh plantain chips immediately
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Delivery Updates</p>
                  <p className="text-sm text-muted-foreground">
                    We'll keep you updated via WhatsApp throughout the delivery process
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          {whatsappUrl && (
            <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Continue on WhatsApp
              </a>
            </Button>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline" size="lg" className="flex-1 bg-transparent">
              <Link href="/products">
                <Package className="w-5 h-5 mr-2" />
                Order More
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 bg-transparent">
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Contact Support */}
        <Card className="mt-8 bg-muted/50 border-none">
          <CardContent className="p-6">
            <h4 className="font-medium mb-2">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions about your order, don't hesitate to reach out to us.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Support
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                <a href={`tel:+${phone}`}>{`Call +${phone}`}</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
