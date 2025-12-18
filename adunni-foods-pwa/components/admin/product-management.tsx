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
import { api, type Product, type ProductCategory, type ProductUnit, type PackagingType } from "@/lib/api"
import { toast } from "sonner"

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await api.deleteProduct(id)
      toast.success("Product deleted successfully")
      fetchProducts()
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete product")
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) setEditingProduct(null)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
  )

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-xl border-border/60 shadow-sm">
              <div className="aspect-square bg-muted" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your plantain chips inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onSuccess={() => handleDialogChange(false)}
              onProductSaved={fetchProducts}
            />
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
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden rounded-xl border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-square bg-muted relative group">
                <img
                  src={
                    product.images?.[0] ||
                    `/placeholder.svg?height=300&width=300&query=${product.name || "/placeholder.svg"} plantain chips`
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Category Badge Overlay */}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-black/70 text-white text-xs">
                    {product.category?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Uncategorized'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg leading-snug line-clamp-2">{product.name}</h3>
                  <Badge variant={product.stock > 10 ? "secondary" : product.stock > 0 ? "destructive" : "outline"}>
                    {product.stock} in stock
                  </Badge>
                </div>

                {/* Product attributes */}
                <div className="flex flex-wrap gap-1">
                  {product.weight && (
                    <Badge variant="outline" className="text-xs">
                      {product.weight}kg
                    </Badge>
                  )}
                  {product.packagingType && product.packagingType !== 'none' && (
                    <Badge variant="outline" className="text-xs capitalize">
                      {product.packagingType === 'refill' ? 'Refill Pack' : 'Bucket'}
                    </Badge>
                  )}
                  {product.unit && (
                    <Badge variant="outline" className="text-xs">
                      per {product.unit}
                    </Badge>
                  )}
                </div>

                {product.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">₦{product.price?.toFixed(2) || '0.00'}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                      onClick={() => handleDelete(product._id)}
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

function ProductForm({
  product,
  onSuccess,
  onProductSaved,
}: {
  product: Product | null
  onSuccess: () => void
  onProductSaved: () => void
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    category: product?.category || "ripe_plantain_chips" as ProductCategory,
    price: product?.price?.toString() || "",
    unit: product?.unit || "kg" as ProductUnit,
    weight: product?.weight?.toString() || "",
    packagingType: product?.packagingType || "bucket" as PackagingType,
    stock: product?.stock?.toString() || "",
  })

  useEffect(() => {
    setFormData({
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      category: product?.category || "ripe_plantain_chips",
      price: product?.price?.toString() || "",
      unit: product?.unit || "kg",
      weight: product?.weight?.toString() || "",
      packagingType: product?.packagingType || "bucket",
      stock: product?.stock?.toString() || "",
    })
    setFile(null)
  }, [product])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  // Determine if we should show kg-based fields
  const isPlantainChips = formData.category === "ripe_plantain_chips" || formData.category === "unripe_plantain_chips"

  // Auto-set unit based on category
  useEffect(() => {
    if (isPlantainChips) {
      setFormData(prev => ({ ...prev, unit: "kg" }))
    } else if (formData.category === "fruit_juice") {
      setFormData(prev => ({ ...prev, unit: "bottle", packagingType: "none" }))
    } else if (formData.category === "loaded_plantain") {
      setFormData(prev => ({ ...prev, unit: "piece", packagingType: "none" }))
    }
  }, [formData.category, isPlantainChips])

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let images: string[] = product?.images || []

      if (file) {
        try {
          const up = await api.uploadImage(file)
          if (up.success && up.data?.url) {
            images = [up.data.url]
          } else {
            throw new Error("Upload response invalid")
          }
        } catch (e) {
          console.error("Image upload failed:", e)
          toast.error("Failed to upload image. Product will be saved without new image.")
        }
      }

      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        unit: formData.unit,
        weight: isPlantainChips && formData.weight ? parseFloat(formData.weight) : undefined,
        packagingType: isPlantainChips ? formData.packagingType : "none" as PackagingType,
        stock: parseInt(formData.stock),
        images: images,
      }

      let response;
      if (product) {
        response = await api.updateProduct(product._id, productData)
      } else {
        response = await api.createProduct(productData)
      }

      if (response.success) {
        toast.success(product ? "Product updated!" : "Product added!")
        onProductSaved()
        onSuccess()
      } else {
        throw new Error(response.message || "Operation failed")
      }
    } catch (error) {
      console.error("Failed to save product:", error)
      toast.error("Failed to save product. " + (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryLabels: Record<ProductCategory, string> = {
    ripe_plantain_chips: "Ripe Plantain Chips",
    unripe_plantain_chips: "Unripe Plantain Chips",
    fruit_juice: "Fruit Juice",
    loaded_plantain: "Loaded Plantain",
  }

  const packagingLabels: Record<PackagingType, string> = {
    bucket: "Bucket",
    refill: "Refill (Nylon Seal)",
    none: "None",
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category">Product Category *</Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          required
        >
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder={isPlantainChips ? "e.g., Ripe Plantain Chips 1kg Bucket" : "e.g., Fresh Orange Juice"}
          required
        />
      </div>

      {/* Slug (auto-generated but editable) */}
      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug *</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="auto-generated-from-name"
          required
        />
        <p className="text-xs text-muted-foreground">Auto-generated from product name. Edit if needed.</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your product..."
          rows={2}
        />
      </div>

      {/* Packaging Type (only for plantain chips) */}
      {isPlantainChips && (
        <div className="space-y-2">
          <Label htmlFor="packagingType">Packaging Type *</Label>
          <select
            id="packagingType"
            value={formData.packagingType}
            onChange={(e) => setFormData({ ...formData, packagingType: e.target.value as PackagingType })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          >
            <option value="bucket">Bucket</option>
            <option value="refill">Refill (Nylon Seal)</option>
          </select>
        </div>
      )}

      {/* Weight (for kg-based products) */}
      {isPlantainChips && (
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg) *</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            min="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            placeholder="e.g., 1, 0.5, 2"
            required
          />
          <p className="text-xs text-muted-foreground">Enter weight in kilograms (e.g., 0.5 for 500g, 1 for 1kg)</p>
        </div>
      )}

      {/* Price and Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">
            Price (₦) {isPlantainChips ? "per unit" : ""} *
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="0"
            required
          />
        </div>
      </div>

      {/* Product Image */}
      <div className="space-y-2">
        <Label htmlFor="image">Product Image</Label>
        {product?.images?.[0] && !file && (
          <div className="mb-2">
            <img
              src={product.images[0]}
              alt="Current product"
              className="w-20 h-20 object-cover rounded-md border"
            />
            <p className="text-xs text-green-600 mt-1">Current image</p>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Upload className="w-4 h-4 text-muted-foreground" />
        </div>
        {file && (
          <p className="text-xs text-blue-600">New image selected: {file.name}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {product?.images?.[0] ? "Upload a new image to replace the current one." : "Upload a product image."}
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4 sticky bottom-0 bg-background pb-2">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Saving..." : (product ? "Update Product" : "Add Product")}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
