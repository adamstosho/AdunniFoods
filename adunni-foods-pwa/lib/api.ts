const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface Product {
  _id: string
  name: string
  slug: string
  description?: string
  price: number
  stock: number
  images: string[]
  createdAt: string
}

export interface OrderItem {
  product: string
  name: string
  qty: number
  price: number
}

export interface Order {
  _id?: string
  customerName: string
  customerPhone: string
  address: string
  items: OrderItem[]
  totalAmount: number
  paymentMethod: "bank_transfer" | "mobile_money" | "cash_on_delivery"
  status?: "Pending" | "Packed" | "Out for Delivery" | "Completed"
  createdAt?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const MOCK_PRODUCTS: Product[] = [
  {
    _id: "1",
    name: "Original Plantain Chips",
    slug: "original-plantain-chips",
    description:
      "Our classic plantain chips made with premium plantains, lightly salted and perfectly crispy. A timeless favorite that captures the natural sweetness of ripe plantains.",
    price: 25.0,
    stock: 50,
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CJk4Pi61qi99IlMvr0vpXHN9M5lSHK.png"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Spicy Plantain Chips",
    slug: "spicy-plantain-chips",
    description:
      "For those who love a kick! Our spicy plantain chips are seasoned with a blend of African spices and scotch bonnet peppers for the perfect heat.",
    price: 30.0,
    stock: 35,
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EDfrGac5gpjK69TgRIU2VKF7rEeOgx.png"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "Pepper Plantain Chips",
    slug: "pepper-plantain-chips",
    description:
      "A medium-heat option with black pepper and aromatic spices. Perfect balance of flavor and spice that appeals to everyone.",
    price: 28.0,
    stock: 42,
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-3JuRMrq25YrIGsCYA1lXAUNGQNkeqg.jpeg"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "Honey Glazed Plantain Chips",
    slug: "honey-glazed-plantain-chips",
    description:
      "A sweet twist on our classic recipe. These chips are lightly glazed with pure honey for a delightful sweet and salty combination.",
    price: 35.0,
    stock: 28,
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CJk4Pi61qi99IlMvr0vpXHN9M5lSHK.png"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    name: "Garlic Herb Plantain Chips",
    slug: "garlic-herb-plantain-chips",
    description:
      "Savory plantain chips seasoned with roasted garlic, thyme, and other aromatic herbs. A gourmet option for sophisticated palates.",
    price: 32.0,
    stock: 38,
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-3JuRMrq25YrIGsCYA1lXAUNGQNkeqg.jpeg"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "6",
    name: "BBQ Plantain Chips",
    slug: "bbq-plantain-chips",
    description:
      "Smoky barbecue flavor meets crispy plantain perfection. Our special BBQ seasoning blend creates an irresistible snack.",
    price: 30.0,
    stock: 45,
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EDfrGac5gpjK69TgRIU2VKF7rEeOgx.png"],
    createdAt: new Date().toISOString(),
  },
]

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("admin_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      console.log("[v0] Making API request to:", url)
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const raw = await response.json()
      console.log("[v0] API request successful")
      // Normalize backend shape { message, response }
      if (raw && typeof raw === 'object' && ('response' in raw || 'message' in raw)) {
        const normalized: ApiResponse<T> = {
          success: true,
          data: (raw.response as T) ?? undefined,
          message: typeof raw.message === 'string' ? raw.message : undefined,
        }
        return normalized
      }
      // If already in ApiResponse shape, return as-is
      if (raw && typeof raw === 'object' && ('success' in raw)) {
        return raw as ApiResponse<T>
      }
      // Fallback: wrap raw as data
      return { success: true, data: raw as T }
    } catch (error) {
      console.log("[v0] API request failed, using mock data:", error)
      if (endpoint.includes("/products") && !endpoint.includes("/products/")) {
        return {
          success: true,
          data: MOCK_PRODUCTS as T,
          message: "Using demo data - API unavailable",
        }
      }
      throw error
    }
  }

  // Product methods
  async getProducts(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.search) searchParams.set("search", params.search)

    const query = searchParams.toString()
    return this.request<Product[]>(`/products${query ? `?${query}` : ""}`)
  }

  async getProduct(slug: string): Promise<ApiResponse<Product>> {
    try {
      return await this.request<Product>(`/products/${slug}`)
    } catch (error) {
      const mockProduct = MOCK_PRODUCTS.find((p) => p.slug === slug || p._id === slug)
      if (mockProduct) {
        return {
          success: true,
          data: mockProduct,
          message: "Using demo data - API unavailable",
        }
      }
      throw error
    }
  }

  async createProduct(product: Omit<Product, '_id' | 'createdAt'>): Promise<ApiResponse<Product>> {
    return this.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    })
  }

  async updateProduct(id: string, product: Partial<Omit<Product, '_id' | 'createdAt'>>): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    })
  }

  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/products/${id}`, {
      method: "DELETE",
    })
  }

  // Order methods
  async createOrder(order: Order): Promise<ApiResponse<Order & { whatsappUrl?: string }>> {
    return this.request<Order & { whatsappUrl?: string }>("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    })
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}`)
  }

  async updateOrderStatus(id: string, status: Order["status"]): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}` , {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  }

  async exportOrdersCsv(params?: { startDate?: string; endDate?: string; status?: Order["status"] }): Promise<Blob> {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.set("startDate", params.startDate)
    if (params?.endDate) searchParams.set("endDate", params.endDate)
    if (params?.status) searchParams.set("status", String(params.status))
    const query = searchParams.toString()
    const url = `${this.baseURL}/orders/export/csv${query ? `?${query}` : ""}`
    const response = await fetch(url, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined,
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.blob()
  }

  // Admin methods
  async login(username: string, password: string): Promise<ApiResponse<{ token: string }>> {
    const response = await this.request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
    return response
  }

  async getOrders(params?: {
    page?: number
    limit?: number
    status?: string
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<Order[]>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.status) searchParams.set("status", params.status)
    if (params?.startDate) searchParams.set("startDate", params.startDate)
    if (params?.endDate) searchParams.set("endDate", params.endDate)

    const query = searchParams.toString()
    return this.request<Order[]>(`/orders${query ? `?${query}` : ""}`)
  }

  // Upload methods
  async uploadImage(file: File): Promise<ApiResponse<{ url: string; publicId?: string }>> {
    const form = new FormData()
    form.append("file", file)
    const url = `${this.baseURL}/upload`
    const response = await fetch(url, {
      method: "POST",
      headers: this.token ? { Authorization: `Bearer ${this.token}` } as any : undefined,
      body: form,
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
  }
}

export const api = new ApiClient(API_BASE_URL)
