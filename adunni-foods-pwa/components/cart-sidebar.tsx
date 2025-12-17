"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/store"

export function CartSidebar() {
  const { items, isOpen, setCartOpen, updateQuantity, removeItem, getTotalPrice } = useCartStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const totalPrice = getTotalPrice()

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Redirect to checkout page
    window.location.href = "/checkout"
  }

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart
            {items.length > 0 && <Badge variant="secondary">{items.length} items</Badge>}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-4">Add some delicious plantain chips to get started!</p>
                <Button onClick={() => setCartOpen(false)}>Continue Shopping</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <img
                        src={item.image || `/placeholder.svg?height=60&width=60&query=${item.name} plantain chips`}
                        alt={item.name}
                        className="w-15 h-15 object-cover rounded-md"
                      />

                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-primary font-semibold">₦{item.price.toFixed(2)}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product, item.qty - 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product, item.qty + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product)}
                        className="text-destructive hover:text-destructive p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">₦{totalPrice.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
