import { OrderManagement } from "@/components/admin/order-management"
import { AdminLayout } from "@/components/admin/admin-layout"

export const metadata = {
  title: "Order Management - Adunni Foods Admin",
  description: "Manage customer orders, update status, and track deliveries.",
}

export default function OrdersPage() {
  return (
    <AdminLayout>
      <OrderManagement />
    </AdminLayout>
  )
}
