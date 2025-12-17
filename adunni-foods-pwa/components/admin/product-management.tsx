"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Package, Upload } from "lucide-react"
import { api, type Product } from "@/lib/api"
import { toast } from "sonner"

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.getProducts({ limit: 100 })
      if (response.success && response.data) {
        setProducts(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="aspect-square bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your plantain chips inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <AddProductForm onSuccess={() => setIsAddDialogOpen(false)} onProductAdded={fetchProducts} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search" : "Get started by adding your first product"}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <div className="aspect-square bg-muted">
                <img
                  src={
                    product.images[0] ||
                    `/placeholder.svg?height=300&width=300&query=${product.name || "/placeholder.svg"} plantain chips`
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <Badge variant={product.stock > 10 ? "secondary" : product.stock > 0 ? "destructive" : "outline"}>
                    {product.stock} in stock
                  </Badge>
                </div>
                {product.description && (
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">₦{product.price.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                      onClick={async () => {
                        try {
                          await api.deleteProduct(product._id)
                          toast.success('Product deleted')
                          fetchProducts()
                        } catch (e) {
                          toast.error('Failed to delete product')
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function AddProductForm({
  onSuccess,
  onProductAdded,
}: {
  onSuccess: () => void
  onProductAdded: () => void
}) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Optionally upload image first
      let images: string[] = []
      try {
        if (file) {
          const up = await api.uploadImage(file)
          if (up.success && up.data?.url) images = [up.data.url]
        }
      } catch (e) {
        console.warn('Image upload failed, continuing without image')
      }

      // Create product data
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images
      }

      // Call API to create product
      const response = await api.createProduct(productData)
      
      if (response.success) {
        toast.success("Product added successfully!")
        onProductAdded()
        onSuccess()
        setFormData({ name: "", slug: "", description: "", price: "", stock: "" })
      } else {
        throw new Error(response.message || "Failed to create product")
      }
    } catch (error) {
      console.error("Failed to add product:", error)
      toast.error("Failed to add product. Please check your backend connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Spicy Plantain Chips"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="e.g., spicy-plantain-chips"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your product..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₦)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Product Image</Label>
        <div className="flex items-center gap-3">
          <Input id="image" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Upload className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">Images are uploaded to the backend `/upload` endpoint.</p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Adding..." : "Add Product"}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
