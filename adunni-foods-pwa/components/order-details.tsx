"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { OrderTimeline } from "@/components/order-timeline"
import { MapPin, Phone, User, CreditCard, MessageCircle } from "lucide-react"
import type { Order } from "@/lib/api"

interface OrderDetailsProps {
  order: Order
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Packed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEstimatedDelivery = (status: string, createdAt: string) => {
    const orderDate = new Date(createdAt)
    const now = new Date()

    switch (status) {
      case "Pending":
        return "Processing - Estimated 2-4 hours"
      case "Packed":
        return "Ready for delivery - Within 24 hours"
      case "Out for Delivery":
        return "Arriving today - Within 2 hours"
      case "Completed":
        return "Delivered"
      default:
        return "Processing"
    }
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                Order #{order._id?.slice(-8).toUpperCase()}
                <Badge className={getStatusColor(order.status || "Pending")}>{order.status}</Badge>
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Placed on{" "}
                {new Date(order.createdAt || "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">₦{order.totalAmount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                {getEstimatedDelivery(order.status || "Pending", order.createdAt || "")}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Order Timeline */}
      <OrderTimeline currentStatus={order.status || "Pending"} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={`/abstract-geometric-shapes.png?height=60&width=60&query=${item.name} plantain chips`}
                      alt={item.name}
                      className="w-15 h-15 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Quantity: {item.qty}</p>
                      <p className="text-sm font-medium text-primary">₦{item.price.toFixed(2)} each</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₦{(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₦{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Information */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-sm">{order.address}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="capitalize">{order.paymentMethod.replace("_", " ")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="bg-muted/50 border-none">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Need Help?
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Contact us if you have any questions about your order
              </p>
              <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <a
                  href={`https://wa.me/2348144665646?text=Hi, I need help with my order ${order._id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
