"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Plus } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { api, type Product } from "@/lib/api"

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
        const response = await api.getProducts({ limit: 6 })
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product, index) => (
            <Card
              key={product._id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={
                    product.images[0] ||
                    `/placeholder.svg?height=400&width=400&query=delicious ${product.name || "/placeholder.svg"} plantain chips golden crispy`
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <Button
                  size="sm"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary hover:bg-primary/90 rounded-full p-2"
                  onClick={() => handleAddToCart(product)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                {product.stock < 10 && product.stock > 0 && (
                  <Badge className="absolute top-4 left-4 bg-destructive">Only {product.stock} left</Badge>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.9)</span>
                </div>

                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{product.name}</h3>

                {product.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">₦{product.price.toFixed(2)}</div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
