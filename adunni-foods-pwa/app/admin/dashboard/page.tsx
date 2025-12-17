import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminLayout } from "@/components/admin/admin-layout"

export const metadata = {
  title: "Dashboard - Adunni Foods Admin",
  description: "Admin dashboard for managing Adunni Foods business operations.",
}

export default function DashboardPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}
