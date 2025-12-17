"use client"

import Link from "next/link"
import { Home, Package, User, ShoppingCart, Search } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function MobileNavigation() {
  const pathname = usePathname()
  const { getTotalItems, toggleCart } = useCartStore()
  const totalItems = getTotalItems()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/products", icon: Package, label: "Products" },
    { href: "/track", icon: Search, label: "Track" }, // Added track order to mobile nav
    { href: "/about", icon: User, label: "About" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border lg:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-colors",
              pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}

        <button
          onClick={toggleCart}
          className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-foreground transition-colors relative"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-xs font-medium">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 right-1/2 translate-x-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
