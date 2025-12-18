"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, Menu, Bell, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { api, type Notification } from "@/lib/api"
import { toast } from "sonner"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin")
    }
  }, [router])

  useEffect(() => {
    let interval: NodeJS.Timeout

    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true)
        const res = await api.getNotifications({ limit: 15 })
        if (res.success && res.data) {
          setNotifications(res.data)
        }
      } catch (e) {
        console.error("Failed to fetch notifications", e)
      } finally {
        setLoadingNotifications(false)
      }
    }

    fetchNotifications()
    interval = setInterval(fetchNotifications, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleOpenNotifications = async () => {
    setIsNotificationsOpen((prev) => !prev)
    if (unreadCount > 0) {
      try {
        await api.markAllNotificationsRead()
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      } catch (e) {
        console.error("Failed to mark notifications as read", e)
      }
    }
  }

  const handleLogout = () => {
    api.clearToken()
    toast.success("Logged out successfully")
    router.push("/admin")
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={cn(
        "flex h-full flex-col bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80",
        mobile ? "w-full" : "w-64",
      )}
    >
      <div className="flex items-center gap-2 border-b border-border p-6">
        <img
          src="/adunnilogo.png"
          alt="Adunni Foods logo"
          className="w-8 h-8 object-contain rounded-full border shadow-sm border-border"
        />
        <div>
          <h2 className="font-heading font-bold text-lg">Adunni Foods</h2>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
                onClick={() => mobile && setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-background to-cyan-50/40">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r border-border">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between border-b border-border bg-card/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 border-r border-border p-0">
                <Sidebar mobile />
              </SheetContent>
            </Sheet>
            <img
              src="/adunnilogo.png"
              alt="Adunni Foods logo"
              className="w-8 h-8 object-contain rounded-full border shadow-sm border-border"
            />
          </div>
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={handleOpenNotifications}>
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
            {isNotificationsOpen && (
              <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-border bg-card/95 p-2 text-sm shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">Notifications</span>
                  {loadingNotifications && <span className="text-[11px] text-muted-foreground">Refreshing…</span>}
                </div>
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">No notifications yet</p>
                ) : (
                  <div className="max-h-80 space-y-1 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`rounded-lg px-2 py-2 ${n.read ? "bg-transparent" : "bg-primary/5"
                          } border border-border/50`}
                      >
                        <p className="text-xs text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="p-4 transition-all duration-300 ease-out sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
