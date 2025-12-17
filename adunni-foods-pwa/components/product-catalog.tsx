"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, Star, Plus, Grid, List } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { api, type Product } from "@/lib/api"
import Link from "next/link"

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("[v0] Fetching products...")
        const response = await api.getProducts({ limit: 50 })
        console.log("[v0] Products response:", response)
        if (response.success && response.data) {
          setProducts(response.data)
          // Set initial price range based on products
          const prices = response.data.map((p) => p.price)
          const maxPrice = Math.max(...prices)
          setPriceRange([0, Math.ceil(maxPrice)])
          console.log("[v0] Products loaded successfully:", response.data.length)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch products:", error)
        setError("Unable to load products. Please check your connection and try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      return matchesSearch && matchesPrice
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchQuery, sortBy, priceRange])

  const handleAddToCart = (product: Product) => {
    addItem(product)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-destructive" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Unable to Load Products</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-muted rounded animate-pulse mb-4 w-48" />
          <div className="h-4 bg-muted rounded animate-pulse w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3 mb-4" />
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">Our Products</h1>
        <p className="text-muted-foreground text-lg">
          Discover our full range of premium plantain chips, made fresh daily with the finest ingredients.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Filter Toggle */}
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <Card className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    min={0}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₦{priceRange[0]}</span>
                    <span>₦{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredAndSortedProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid/List */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button
            onClick={() => {
              setSearchQuery("")
              setPriceRange([0, 100])
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              viewMode={viewMode}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
  onAddToCart: () => void
}

function ProductCard({ product, viewMode, onAddToCart }: ProductCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex">
          <div className="w-48 aspect-square">
            <img
              src={
                product.images[0] ||
                `/placeholder.svg?height=200&width=200&query=delicious ${product.name || "/placeholder.svg"} plantain chips golden crispy`
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.9)</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">₦{product.price.toFixed(2)}</div>
            </div>

            {product.description && <p className="text-muted-foreground mb-4 line-clamp-2">{product.description}</p>}

            <div className="flex items-center justify-between">
              <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
              <Button
                onClick={onAddToCart}
                disabled={product.stock === 0}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
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
          onClick={onAddToCart}
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

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">₦{product.price.toFixed(2)}</div>
          <Button
            onClick={onAddToCart}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
