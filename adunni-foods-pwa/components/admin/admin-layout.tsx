"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, Menu, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin")
    }
  }, [router])

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
    <div className={cn("flex flex-col h-full", mobile ? "w-full" : "w-64")}>
      <div className="flex items-center gap-2 p-6 border-b border-border">
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

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r border-border">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar mobile />
              </SheetContent>
            </Sheet>
            <img
              src="/adunnilogo.png"
              alt="Adunni Foods logo"
              className="w-8 h-8 object-contain rounded-full border shadow-sm border-border"
            />
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
