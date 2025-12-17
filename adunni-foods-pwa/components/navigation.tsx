"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { getTotalItems, toggleCart } = useCartStore()

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const totalItems = getTotalItems()

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        !isMounted ? "bg-background/90 backdrop-blur-sm" : isScrolled ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border" : "bg-background/90 backdrop-blur-sm",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
           
            <img
              src="/adunnilogo.png"
              width={40}
              height={40}
              alt="Adunni Foods logo"
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain rounded-full border shadow-md border-border p-1 hover:scale-105 transition-all duration-300 hover:shadow-primary/25 "
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link
              href="/products"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Products
            </Link>
            <Link
              href="/track"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Track Order
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Cart Button */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={toggleCart} className="relative p-2 hover:bg-primary/10">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border">
            <div className="py-4 space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/track"
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Track Order
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
