"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
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
      return
    }
    // Sync token into API client on refresh/navigation
    api.setToken(token)
  }, [router])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

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

    const shouldPoll = () => document.visibilityState === "visible"
    const startPolling = () => {
      if (interval) return
      void fetchNotifications()
      interval = setInterval(() => {
        if (shouldPoll()) void fetchNotifications()
      }, 30000)
    }
    const stopPolling = () => {
      if (!interval) return
      clearInterval(interval)
      interval = null
    }

    startPolling()

    const onVisibility = () => {
      if (shouldPoll()) startPolling()
      else stopPolling()
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      stopPolling()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleOpenNotifications = async () => {
    const nextOpen = !isNotificationsOpen
    setIsNotificationsOpen(nextOpen)
    if (nextOpen && unreadCount > 0) {
      try {
        await api.markAllNotificationsRead()
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      } catch (e) {
        console.error("Failed to mark notifications as read", e)
      }
    }
  }

  useEffect(() => {
    if (!isNotificationsOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsNotificationsOpen(false)
    }
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      // Close if user clicks outside the dropdown
      const dropdown = document.getElementById("admin-notifications-dropdown")
      const button = document.getElementById("admin-notifications-button")
      if (dropdown && dropdown.contains(target)) return
      if (button && button.contains(target)) return
      setIsNotificationsOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("click", onClick)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("click", onClick)
    }
  }, [isNotificationsOpen])

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
      name: "Reviews",
      href: "/admin/reviews",
      icon: MessageSquare,
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
        "flex h-full flex-col bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80",
        mobile ? "w-full" : "w-64",
      )}
    >
      <div className="flex items-center gap-2 border-b border-border p-6">
        <Image
          src="/adunnilogo.png"
          alt="Adunni Foods logo"
          width={32}
          height={32}
          priority
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
    <div className="min-h-screen bg-linear-to-br from-amber-50/40 via-background to-cyan-50/40">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col grow border-r border-border">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden relative z-50">
        <div className="flex items-center justify-between border-b border-border bg-card/95 p-4 backdrop-blur supports-backdrop-filter:bg-card/80">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 border-r border-border p-0">
                <div className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>Main navigation menu for the admin dashboard</SheetDescription>
                </div>
                <Sidebar mobile />
              </SheetContent>
            </Sheet>
            <Image
              src="/adunnilogo.png"
              alt="Adunni Foods logo"
              width={32}
              height={32}
              priority
              className="w-8 h-8 object-contain rounded-full border shadow-sm border-border"
            />
          </div>
          <div className="relative">
            <Button id="admin-notifications-button" variant="ghost" size="sm" onClick={handleOpenNotifications}>
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
            {isNotificationsOpen && (
              <div
                id="admin-notifications-dropdown"
                className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-32px)] rounded-xl border border-border bg-popover text-popover-foreground p-3 text-sm shadow-2xl ring-1 ring-black/5 dark:ring-white/10 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="text-base font-semibold tracking-tight">Notifications</span>
                  {loadingNotifications && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                      Refreshing
                    </span>
                  )}
                </div>
                
                <div className="h-px w-full bg-border/40 mb-2"></div>

                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-3">
                      <Bell className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No new notifications</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="max-h-[22rem] space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    {notifications.map((n) => (
                      <div
                        key={n._id}
                        className={cn(
                          "relative flex flex-col gap-1 rounded-lg px-3 py-3 transition-colors hover:bg-muted/50 group",
                          n.read 
                            ? "bg-transparent border border-transparent" 
                            : "bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100/50 dark:border-cyan-900/30"
                        )}
                      >
                        {!n.read && (
                          <span className="absolute left-0 top-1/2 -mt-1 h-2 w-1 rounded-r-full bg-cyan-500 font-bold" />
                        )}
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn("text-sm font-semibold", !n.read ? "text-foreground" : "text-foreground/80")}>
                            {n.title}
                          </p>
                          <p className="shrink-0 text-[10px] font-medium text-muted-foreground/70">
                            {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <p className={cn("text-xs leading-snug", !n.read ? "text-muted-foreground" : "text-muted-foreground/70")}>{n.message}</p>
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
