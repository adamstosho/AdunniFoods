"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, RefreshCw, TrendingUp, DollarSign, ShoppingCart, Clock } from "lucide-react"
import { api, type Order } from "@/lib/api"
import { toast } from "sonner"

type StatusFilter = "all" | "Pending" | "Packed" | "Out for Delivery" | "Completed"

interface DateRange {
  start: string
  end: string
}

export function Analytics() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    const toIsoDate = (d: Date) => d.toISOString().slice(0, 10)

    return {
      start: toIsoDate(thirtyDaysAgo),
      end: toIsoDate(today),
    }
  })

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        // Fetch a reasonable number of recent orders; filtering is done client-side
        const res = await api.getOrders({ limit: 500 })
        if (res.success && res.data) {
          setOrders(res.data)
        } else {
          throw new Error(res.message || "Failed to load analytics data")
        }
      } catch (error) {
        console.error("Failed to fetch analytics orders:", error)
        toast.error("Failed to load analytics data")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    if (!orders.length) return []

    const start = dateRange.start ? new Date(dateRange.start) : null
    const end = dateRange.end ? new Date(dateRange.end) : null
    if (end) {
      // Include the entire end date
      end.setHours(23, 59, 59, 999)
    }

    return orders.filter((order) => {
      const createdAt = order.createdAt ? new Date(order.createdAt) : null

      if (createdAt) {
        if (start && createdAt < start) return false
        if (end && createdAt > end) return false
      }

      if (statusFilter !== "all" && order.status !== statusFilter) return false

      return true
    })
  }, [orders, dateRange, statusFilter])

  const {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    pendingCount,
    completedCount,
    revenueByDate,
    topProducts,
  } = useMemo(() => {
    let totalRevenue = 0
    let totalOrders = filteredOrders.length
    let pendingCount = 0
    let completedCount = 0

    const revenueByDateMap = new Map<string, number>()
    const productStats = new Map<string, { qty: number; revenue: number }>()

    for (const order of filteredOrders) {
      const status = order.status || "Pending"
      if (status === "Pending") pendingCount++
      if (status === "Completed") completedCount++

      // Treat only completed orders as revenue
      if (status === "Completed") {
        totalRevenue += order.totalAmount
      }

      const createdAt = order.createdAt ? new Date(order.createdAt) : null
      const dateKey = createdAt ? createdAt.toISOString().slice(0, 10) : "Unknown"
      const prev = revenueByDateMap.get(dateKey) || 0
      if (status === "Completed") {
        revenueByDateMap.set(dateKey, prev + order.totalAmount)
      }

      // Top products by quantity and revenue from all filtered orders
      for (const item of order.items) {
        const key = item.name || item.product
        const existing = productStats.get(key) || { qty: 0, revenue: 0 }
        existing.qty += item.qty
        existing.revenue += item.qty * item.price
        productStats.set(key, existing)
      }
    }

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const revenueByDate = Array.from(revenueByDateMap.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const topProducts = Array.from(productStats.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      pendingCount,
      completedCount,
      revenueByDate,
      topProducts,
    }
  }, [filteredOrders])

  const resetFilters = () => {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    const toIsoDate = (d: Date) => d.toISOString().slice(0, 10)

    setStatusFilter("all")
    setDateRange({
      start: toIsoDate(thirtyDaysAgo),
      end: toIsoDate(today),
    })
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-xl border-border/60 shadow-sm">
              <CardContent className="space-y-3 p-6">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-8 w-32 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-xl border-border/60 shadow-sm">
              <CardHeader>
                <div className="h-5 w-32 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-32 rounded bg-muted" />
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Deep insights into your sales performance, orders, and top products.
          </p>
        </div>
        <Button variant="outline" className="bg-transparent" onClick={resetFilters}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Start Date
          </label>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            End Date
          </label>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Order Status</label>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Packed">Packed</SelectItem>
              <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden rounded-xl border-border/60 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₦{totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-xl border-border/60 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-xl border-border/60 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
                <p className="text-2xl font-bold">₦{avgOrderValue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-xl border-border/60 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending vs Completed</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">{pendingCount}</span> pending ·{" "}
                  <span className="font-semibold">{completedCount}</span> completed
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Day</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByDate.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                No completed orders found for the selected period.
              </p>
            ) : (
              <div className="space-y-3">
                {revenueByDate.map(({ date, revenue }) => {
                  const maxRevenue = revenueByDate.reduce(
                    (max, item) => (item.revenue > max ? item.revenue : max),
                    0,
                  )
                  const percentage = maxRevenue ? (revenue / maxRevenue) * 100 : 0
                  return (
                    <div key={date} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {new Date(date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="font-medium">₦{revenue.toFixed(2)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                No product data available for the selected period.
              </p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="w-7 h-7 flex items-center justify-center rounded-full">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.qty} units sold
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-primary">₦{product.revenue.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

