import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, OrderItem } from "./api"

interface CartItem extends OrderItem {
  image?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
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

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product === product._id)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product === product._id ? { ...item, qty: item.qty + quantity } : item,
              ),
            }
          }

          return {
            items: [
              ...state.items,
              {
                product: product._id,
                name: product.name,
                qty: quantity,
                price: product.price,
                image: product.images[0],
              },
            ],
          }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product !== productId),
        }))
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((item) => (item.product === productId ? { ...item, qty: quantity } : item)),
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
}

export const useAppStore = create<AppStore>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}))
