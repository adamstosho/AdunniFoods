import { ProductManagement } from "@/components/admin/product-management"
import { AdminLayout } from "@/components/admin/admin-layout"

export const metadata = {
  title: "Product Management - Adunni Foods Admin",
  description: "Manage plantain chips products, inventory, and pricing.",
}

export default function ProductsPage() {
  return (
    <AdminLayout>
      <ProductManagement />
    </AdminLayout>
  )
}
