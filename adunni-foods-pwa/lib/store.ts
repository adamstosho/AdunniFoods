import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, OrderItem } from "./api"

interface CartItem extends OrderItem {
  image?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity?: number, unitType?: 'unit' | 'carton') => void
  removeItem: (productId: string, unitType?: 'unit' | 'carton') => void
  updateQuantity: (productId: string, quantity: number, unitType?: 'unit' | 'carton') => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  toggleCart: () => void
  setCartOpen: (open: boolean) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, quantity = 1, unitType = 'unit') => {
        set((state) => {
          const price = unitType === 'carton' && product.cartonPrice ? product.cartonPrice : product.price
          const existingItem = state.items.find(
            (item) => item.product === product._id && item.unitType === unitType
          )
    
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product === product._id && item.unitType === unitType
                  ? { ...item, qty: item.qty + quantity }
                  : item
              ),
            }
          }
    
          return {
            items: [
              ...state.items,
              {
                product: product._id,
                name: unitType === 'carton' ? `${product.name} (Carton)` : product.name,
                qty: quantity,
                price: price,
                unitType: unitType as 'unit' | 'carton',
                image: product.images[0],
              },
            ],
          }
        })
      },
    
      removeItem: (productId: string, unitType = 'unit') => {
        set((state) => ({
          items: state.items.filter((item) => !(item.product === productId && item.unitType === unitType)),
        }))
      },
    
      updateQuantity: (productId: string, quantity: number, unitType = 'unit') => {
        if (quantity <= 0) {
          get().removeItem(productId, unitType)
          return
        }
    
        set((state) => ({
          items: state.items.map((item) =>
            item.product === productId && item.unitType === unitType ? { ...item, qty: quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.qty, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.qty, 0)
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setCartOpen: (open: boolean) => set({ isOpen: open }),
    }),
    {
      name: "adunni-cart-storage",
    },
  ),
)

interface AppStore {
  isLoading: boolean
  setLoading: (loading: boolean) => void
  // Persistence fields
  adminToken: string | null
  setAdminToken: (token: string | null) => void
  storeSettings: any | null
  setStoreSettings: (settings: any) => void
  lastTracking: { orderId: string; customerPhone: string } | null
  setLastTracking: (details: { orderId: string; customerPhone: string } | null) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isLoading: false,
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      adminToken: null,
      setAdminToken: (token) => set({ adminToken: token }),
      storeSettings: null,
      setStoreSettings: (settings) => set({ storeSettings: settings }),
      lastTracking: null,
      setLastTracking: (details) => set({ lastTracking: details }),
    }),
    {
      name: "adunni-app-storage",
      partialize: (state) => ({
        adminToken: state.adminToken,
        storeSettings: state.storeSettings,
        lastTracking: state.lastTracking,
      }),
    },
  ),
)
