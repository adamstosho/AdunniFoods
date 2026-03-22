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
          <DialogContent className="sm:max-w-[700px] p-0 border-border/60 shadow-2xl overflow-hidden rounded-xl">
            <DialogHeader className="px-6 py-5 border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-900/50">
              <DialogTitle className="text-xl font-heading font-semibold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
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
                      {product.packagingType}
                    </Badge>
                  )}
                  {product.unit && (
                    <Badge variant="outline" className="text-xs">
                      per {product.unit}
                    </Badge>
                  )}
                  {product.cartonPrice && (
                    <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                      Carton: ₦{product.cartonPrice.toFixed(0)} ({product.unitsPerCarton || 1} units)
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
    cartonPrice: product?.cartonPrice?.toString() || "",
    unitsPerCarton: product?.unitsPerCarton?.toString() || "1",
    unit: product?.unit || "kg" as ProductUnit,
    weight: product?.weight?.toString() || "",
    packagingType: product?.packagingType || "plastic" as PackagingType,
    stock: product?.stock?.toString() || "",
  })

  useEffect(() => {
    setFormData({
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      category: product?.category || "ripe_plantain_chips",
      price: product?.price?.toString() || "",
      cartonPrice: product?.cartonPrice?.toString() || "",
      unitsPerCarton: product?.unitsPerCarton?.toString() || "1",
      unit: product?.unit || "kg",
      weight: product?.weight?.toString() || "",
      packagingType: product?.packagingType || "plastic",
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
        cartonPrice: formData.cartonPrice ? parseFloat(formData.cartonPrice) : undefined,
        unitsPerCarton: formData.unitsPerCarton ? parseInt(formData.unitsPerCarton) : 1,
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
    plastic: "Plastic",
    pouch: "Pouch",
    none: "None",
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh] sm:max-h-[80vh]">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-foreground/90">Product Name <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={isPlantainChips ? "e.g., Ripe Plantain Chips 1kg" : "e.g., Fresh Orange Juice"}
              className="bg-background/80 h-11"
              required
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold text-foreground/90">Category <span className="text-destructive">*</span></Label>
            <div className="relative">
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="flex h-11 w-full appearance-none rounded-md border border-input bg-background/80 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-50">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold text-foreground/90">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Write a brief description of the product..."
            className="resize-none bg-background/80 min-h-[90px]"
          />
        </div>

        {/* Pricing, Stock, and Dimensions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-5 rounded-xl border border-border/60 bg-muted/20">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-semibold text-foreground/90">Price (₦) <span className="text-destructive">*</span></Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              className="bg-background h-10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cartonPrice" className="text-sm font-semibold text-foreground/90">Carton Price (optional)</Label>
            <Input
              id="cartonPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.cartonPrice}
              onChange={(e) => setFormData({ ...formData, cartonPrice: e.target.value })}
              placeholder="0.00"
              className="bg-background h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitsPerCarton" className="text-sm font-semibold text-foreground/90">Units/Carton</Label>
            <Input
              id="unitsPerCarton"
              type="number"
              min="1"
              value={formData.unitsPerCarton}
              onChange={(e) => setFormData({ ...formData, unitsPerCarton: e.target.value })}
              placeholder="12"
              className="bg-background h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock" className="text-sm font-semibold text-foreground/90">Stock Qty <span className="text-destructive">*</span></Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="100"
              className="bg-background h-10"
              required
            />
          </div>

          {isPlantainChips ? (
            <>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="weight" className="text-sm font-semibold text-foreground/90">Weight (kg) <span className="text-destructive">*</span></Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.001"
                  min="0.01"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g., 0.25"
                  className="bg-background h-10"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="packagingType" className="text-sm font-semibold text-foreground/90">Packaging <span className="text-destructive">*</span></Label>
                 <div className="relative">
                  <select
                    id="packagingType"
                    value={formData.packagingType}
                    onChange={(e) => setFormData({ ...formData, packagingType: e.target.value as PackagingType })}
                    className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="plastic">Plastic</option>
                    <option value="pouch">Pouch</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-50">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  </div>
                 </div>
              </div>
            </>
          ) : (
             <div className="col-span-2 hidden md:block"></div>
          )}
        </div>

        {/* Product Image */}
        <div className="space-y-3 pt-2">
          <Label htmlFor="image" className="text-sm font-semibold text-foreground/90">Product Image</Label>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-5 border border-dashed border-border/80 rounded-xl bg-background/50 hover:bg-muted/40 transition-colors">
            {product?.images?.[0] && !file ? (
              <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-lg border border-border shadow-sm group">
                <img
                  src={product.images[0]}
                  alt="Current product"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs text-white font-medium">Current</span>
                </div>
              </div>
            ) : file ? (
               <div className="w-24 h-24 shrink-0 bg-primary/10 border-primary/30 border rounded-lg flex flex-col items-center justify-center p-2 text-center">
                 <Upload className="w-6 h-6 text-primary mb-2" />
                 <span className="text-[10px] text-primary font-semibold line-clamp-2 leading-tight">{file.name}</span>
               </div>
            ) : (
                <div className="w-24 h-24 shrink-0 bg-muted/60 border border-border rounded-lg flex items-center justify-center">
                 <Upload className="w-7 h-7 text-muted-foreground/60" />
               </div>
            )}
            <div className="flex-1 space-y-2 text-center sm:text-left w-full">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Label 
                  htmlFor="image" 
                  className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-5 shadow-sm w-full sm:w-auto"
                >
                  Choose Image
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <p className="text-xs text-muted-foreground/80">
                {file ? "New image selected." : "Use a 1:1 aspect ratio image, 5MB max."}
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Settings (Slug) */}
        <div className="space-y-2 pt-2">
          <Label htmlFor="slug" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Advanced: URL Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated-from-name"
            className="bg-background/40 text-muted-foreground h-9 font-mono text-xs"
            required
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="p-4 sm:p-5 border-t border-border/40 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-end gap-3 rounded-b-xl shrink-0">
        <Button type="button" variant="outline" onClick={onSuccess} className="w-full sm:w-auto bg-background">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto min-w-[140px] shadow-md font-semibold">
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin"></span>
              Saving...
            </span>
          ) : (
             product ? "Save Changes" : "Create Product"
          )}
        </Button>
      </div>
    </form>
  )
}
