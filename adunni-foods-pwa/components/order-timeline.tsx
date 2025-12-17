"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Package, Truck, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderTimelineProps {
  currentStatus: string
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const steps = [
    {
      id: "Pending",
      title: "Order Received",
      description: "We've received your order and are preparing it",
      icon: Clock,
      time: "Just now",
    },
    {
      id: "Packed",
      title: "Order Packed",
      description: "Your plantain chips are packed and ready",
      icon: Package,
      time: "2-4 hours",
    },
    {
      id: "Out for Delivery",
      title: "Out for Delivery",
      description: "Your order is on the way to you",
      icon: Truck,
      time: "Within 24 hours",
    },
    {
      id: "Completed",
      title: "Delivered",
      description: "Your order has been delivered successfully",
      icon: Home,
      time: "Delivered",
    },
  ]

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStatus)
  }

  const currentStepIndex = getCurrentStepIndex()

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return "completed"
    if (stepIndex === currentStepIndex) return "current"
    return "pending"
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-6">Order Progress</h3>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />
          <div
            className="absolute left-6 top-12 w-0.5 bg-primary transition-all duration-500"
            style={{
              height: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
          />

          <div className="space-y-8">
            {steps.map((step, index) => {
              const status = getStepStatus(index)
              const StepIcon = step.icon

              return (
                <div key={step.id} className="relative flex items-start gap-4">
                  {/* Step Icon */}
                  <div
                    className={cn(
                      "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                      status === "completed" && "bg-primary border-primary text-primary-foreground",
                      status === "current" && "bg-primary border-primary text-primary-foreground animate-pulse",
                      status === "pending" && "bg-background border-border text-muted-foreground",
                    )}
                  >
                    {status === "completed" ? <CheckCircle className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={cn(
                          "font-medium",
                          status === "current" && "text-primary",
                          status === "completed" && "text-foreground",
                          status === "pending" && "text-muted-foreground",
                        )}
                      >
                        {step.title}
                      </h4>
                      {status === "current" && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                      {status === "completed" && (
                        <Badge className="text-xs bg-green-100 text-green-800 border-green-200">Completed</Badge>
                      )}
                    </div>
                    <p
                      className={cn("text-sm mb-1", status === "pending" ? "text-muted-foreground" : "text-foreground")}
                    >
                      {step.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Estimated Delivery</h4>
              <p className="text-sm text-muted-foreground">
                {currentStatus === "Completed"
                  ? "Your order has been delivered!"
                  : currentStatus === "Out for Delivery"
                    ? "Arriving today within 2 hours"
                    : currentStatus === "Packed"
                      ? "Within 24 hours"
                      : "Processing - 2-4 hours to pack"}
              </p>
            </div>
            {currentStatus !== "Completed" && (
              <Badge variant="outline" className="bg-background">
                In Progress
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
