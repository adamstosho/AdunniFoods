"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Download } from "lucide-react"
import { api, type Order } from "@/lib/api"
import { toast } from "sonner"

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await api.getOrders({ limit: 100 })
      if (response.success && response.data) {
        setOrders(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery) ||
      order._id?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus as any)
      if (res.success && res.data) {
        setOrders((prev) => prev.map((order) => (order._id === orderId ? { ...order, status: res.data!.status } : order)))
        toast.success("Order status updated successfully!")
      } else {
        throw new Error(res.message || 'Failed')
      }
    } catch (error) {
      console.error("Failed to update order status:", error)
      toast.error("Failed to update order status")
    }
  }

  const exportCsv = async () => {
    try {
      const blob = await api.exportOrdersCsv()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export CSV failed:', error)
      toast.error('Failed to export CSV')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-xl border-border/60 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and deliveries</p>
        </div>
        <Button
          variant="outline"
          className="bg-transparent w-full justify-center sm:w-auto"
          onClick={exportCsv}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search orders by customer, phone, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Packed">Packed</SelectItem>
            <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="font-semibold text-lg mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all" ? "Try adjusting your filters" : "No orders have been placed yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order._id}>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg break-words">
                      #{order._id?.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {new Date(order.createdAt || "").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 md:justify-end">
                    <Badge className={getStatusColor(order.status || "Pending")}>
                      {order.status}
                    </Badge>
                    <span className="text-xl font-bold text-primary whitespace-nowrap">
                      ₦{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <p className="text-sm text-muted-foreground break-words">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground break-words">
                      {order.customerPhone}
                    </p>
                    <p className="text-sm text-muted-foreground break-words line-clamp-3">
                      {order.address}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {order.items.map((item, index) => (
                        <p
                          key={index}
                          className="text-sm text-muted-foreground flex justify-between gap-2"
                        >
                          <span className="truncate">
                          {item.qty}x {item.name} - ₦{(item.price * item.qty).toFixed(2)}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Payment:</span>
                    <Badge variant="outline" className="capitalize">
                      {order.paymentMethod.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && <OrderDetailsDialog order={selectedOrder} />}
                      </DialogContent>
                    </Dialog>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order._id!, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Packed">Packed</SelectItem>
                        <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function OrderDetailsDialog({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Order Information</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Order ID:</strong> #{order._id?.slice(-8).toUpperCase()}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt || "").toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Payment:</strong> {order.paymentMethod.replace("_", " ")}
            </p>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Customer Information</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Name:</strong> {order.customerName}
            </p>
            <p>
              <strong>Phone:</strong> {order.customerPhone}
            </p>
            <p>
              <strong>Address:</strong> {order.address}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Order Items</h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">₦{item.price.toFixed(2)} each</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Qty: {item.qty}</p>
                <p className="text-sm">₦{(item.price * item.qty).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-lg text-primary">₦{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
