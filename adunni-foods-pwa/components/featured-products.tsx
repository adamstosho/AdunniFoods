"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Plus } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { api, type Product } from "@/lib/api"
import Link from "next/link"
import { motion } from "framer-motion"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("[v0] Fetching featured products...")
        const response = await api.getProducts({ limit: 8 })
        console.log("[v0] Featured products response:", response)
        if (response.success && response.data) {
          setProducts(response.data)
          console.log("[v0] Featured products loaded successfully:", response.data.length)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch featured products:", error)
        setError("Unable to load featured products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    addItem(product)
  }

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">Featured Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="flex flex-col overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardContent className="flex-1 p-5">
                  <div className="h-4 bg-muted rounded animate-pulse mb-3" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3 mb-6" />
                  <div className="mt-auto h-10 w-full bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || products.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Our Bestsellers
            </Badge>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {error
                ? "Unable to load products at the moment"
                : "Discover our most popular plantain chips, loved by customers across Nigeria"}
            </p>
          </div>

          {error && (
            <div className="text-center">
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Our Bestsellers
          </Badge>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">Featured Products</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our most popular plantain chips, loved by customers across Nigeria
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 section-divider pt-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {products.map((product) => (
            <motion.div 
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
              }}
            >
              <Card
                className="group h-full flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card border-border/50"
              >
              <div className="relative aspect-square overflow-hidden bg-muted/10">
                <img
                  src={
                    product.images[0] ||
                    `/placeholder.svg?height=400&width=400&query=delicious ${product.name || "/placeholder.svg"} plantain chips golden crispy`
                  }
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                {product.stock < 10 && product.stock > 0 && (
                  <Badge className="absolute top-4 left-4 bg-destructive shadow-md">Only {product.stock} left</Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="secondary" className="absolute top-4 left-4 shadow-md bg-white/90 text-black">Sold Out</Badge>
                )}
              </div>

              <CardContent className="flex flex-col flex-1 p-5 lg:p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                  <span className="text-xs text-muted-foreground font-medium ml-1.5">(4.9)</span>
                </div>

                <Link href={`/products/${product.slug}`} className="mb-2">
                  <h3 className="font-heading font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {product.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
                )}

                {!product.description && <div className="flex-1" />}

                <div className="mt-auto pt-4 border-t border-border/40">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Price</span>
                    <span className="text-xl font-bold text-primary">₦{product.price.toLocaleString()}</span>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            <a href="/products">View All Products</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
