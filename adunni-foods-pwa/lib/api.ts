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

export interface AdminProfile {
  username: string
  createdAt: string
}

export interface Notification {
  _id: string
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
  read: boolean
  createdAt: string
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
    if (raw && typeof raw === "object" && ("response" in raw || "message" in raw)) {
      const normalized: ApiResponse<T> = {
        success: true,
        data: (raw.response as T) ?? undefined,
        message: typeof (raw as any).message === "string" ? (raw as any).message : undefined,
      }
      return normalized
    }
    // If already in ApiResponse shape, return as-is
    if (raw && typeof raw === "object" && "success" in raw) {
      return raw as ApiResponse<T>
    }
    // Fallback: wrap raw as data
    return { success: true, data: raw as T }
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
    return this.request<Product>(`/products/${slug}`)
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

  // Notification methods
  async getNotifications(params?: { limit?: number }): Promise<ApiResponse<Notification[]>> {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    const query = searchParams.toString()
    return this.request<Notification[]>(`/notifications${query ? `?${query}` : ""}`)
  }

  async markNotificationRead(id: string): Promise<ApiResponse<Notification>> {
    return this.request<Notification>(`/notifications/${id}/read`, {
      method: "POST",
    })
  }

  async markAllNotificationsRead(): Promise<ApiResponse<null>> {
    return this.request<null>("/notifications/read-all", {
      method: "POST",
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

  // Settings methods
  async getAdminProfile(): Promise<ApiResponse<AdminProfile>> {
    return this.request<AdminProfile>("/settings/profile")
  }

  async updateAdminCredentials(payload: {
    currentPassword: string
    newUsername: string
    newPassword: string
    confirmNewPassword: string
  }): Promise<ApiResponse<{ username: string }>> {
    return this.request<{ username: string }>("/settings/credentials", {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }
}

export const api = new ApiClient(API_BASE_URL)
