"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Plus, Minus, Heart, Share2, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { api, type Product } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ProductDetailProps {
  slug: string
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        // Since the API uses ID instead of slug, we'll need to fetch all products
        // and find by slug. In a real app, you'd have a proper slug-based endpoint
        const response = await api.getProducts({ limit: 100 })
        if (response.success && response.data) {
          const foundProduct = response.data.find((p) => p.slug === slug)
          if (foundProduct) {
            setProduct(foundProduct)
          } else {
            router.push("/products")
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
        router.push("/products")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug, router])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg animate-pulse" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
            <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button asChild>
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    )
  }

  const images =
    product.images.length > 0
      ? product.images
      : [`/placeholder.svg?height=600&width=600&query=delicious ${product.name} plantain chips golden crispy detailed`]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </nav>

      {/* Back Button */}
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
              <span className="text-muted-foreground ml-2">(4.9) • 127 reviews</span>
            </div>

            <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold text-primary">₦{product.price.toFixed(2)}</div>
              <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
            </div>

            {product.description && (
              <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg"
              >
                Add to Cart - ₦{(product.price * quantity).toFixed(2)}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-4 ${isWishlisted ? "text-red-500 border-red-500" : ""}`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="lg" className="px-4 bg-transparent">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-none bg-muted/50">
              <CardContent className="p-4 text-center">
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-medium text-sm">Free Delivery</div>
                <div className="text-xs text-muted-foreground">Orders over ₦50</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-muted/50">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-medium text-sm">Quality Guarantee</div>
                <div className="text-xs text-muted-foreground">100% fresh</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-muted/50">
              <CardContent className="p-4 text-center">
                <RotateCcw className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-medium text-sm">Easy Returns</div>
                <div className="text-xs text-muted-foreground">7-day policy</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl mb-4">Product Description</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description ||
                      "Our premium plantain chips are made from the finest, hand-selected plantains, carefully sliced and cooked to golden perfection. Each batch is prepared using traditional Nigerian methods, ensuring an authentic taste that brings back memories of home."}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    We use only natural ingredients and traditional cooking methods to preserve the authentic flavor and
                    nutritional value of our plantains. No artificial preservatives, colors, or flavors are added to our
                    products.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ingredients" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl mb-4">Ingredients</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Fresh plantains (100% natural)</li>
                  <li>• Palm oil (sustainably sourced)</li>
                  <li>• Sea salt</li>
                  <li>• Natural spices (varies by flavor)</li>
                </ul>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Allergen Information</h4>
                  <p className="text-sm text-muted-foreground">
                    This product is naturally gluten-free and vegan. Manufactured in a facility that may process nuts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  {[
                    {
                      name: "Adunni O.",
                      rating: 5,
                      comment: "Absolutely delicious! Tastes just like the ones my grandmother used to make.",
                      date: "2 days ago",
                    },
                    {
                      name: "Kemi A.",
                      rating: 5,
                      comment: "Perfect crunch and flavor. Will definitely order again!",
                      date: "1 week ago",
                    },
                    {
                      name: "Tunde M.",
                      rating: 4,
                      comment: "Great quality plantain chips. Fast delivery too.",
                      date: "2 weeks ago",
                    },
                  ].map((review, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <span className="font-medium">{review.name}</span>
                        <span className="text-sm text-muted-foreground">• {review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
