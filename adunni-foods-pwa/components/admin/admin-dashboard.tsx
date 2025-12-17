"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, Clock, AlertCircle } from "lucide-react"
import { api, type Order } from "@/lib/api"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch products and orders
        const [productsResponse, ordersResponse] = await Promise.all([
          api.getProducts({ limit: 100 }),
          api.getOrders({ limit: 100 }),
        ])

        if (productsResponse.success && productsResponse.data) {
          const products = productsResponse.data
          const lowStock = products.filter((p) => p.stock < 10).length

          setStats((prev) => ({
            ...prev,
            totalProducts: products.length,
            lowStockProducts: lowStock,
          }))
        }

        if (ordersResponse.success && ordersResponse.data) {
          const orders = ordersResponse.data
          const pending = orders.filter((o) => o.status === "Pending").length
          const completed = orders.filter((o) => o.status === "Completed").length
          const revenue = orders.filter((o) => o.status === "Completed").reduce((sum, o) => sum + o.totalAmount, 0)

          setStats((prev) => ({
            ...prev,
            totalOrders: orders.length,
            pendingOrders: pending,
            completedOrders: completed,
            totalRevenue: revenue,
          }))

          // Get recent orders (last 5)
          setRecentOrders(orders.slice(0, 5))
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Total Revenue",
      value: `₦${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-xl border-border/60 shadow-sm">
              <CardContent className="p-6 space-y-3">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-8 w-32 rounded bg-muted" />
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
      <div className="space-y-1">
        <h1 className="font-heading font-bold text-3xl text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="overflow-hidden rounded-xl border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {stats.lowStockProducts > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/80 shadow-sm backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Low Stock Alert</p>
                <p className="text-sm text-yellow-700">
                  {stats.lowStockProducts} product{stats.lowStockProducts > 1 ? "s" : ""} running low on stock
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                View Products
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No orders yet</p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">#{order._id?.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt || "").toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₦{order.totalAmount.toFixed(2)}</p>
                      <Badge className={getStatusColor(order.status || "Pending")}>{order.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View All Orders
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Export Sales Report
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Customer Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
