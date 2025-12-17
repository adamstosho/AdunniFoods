import { AdminLayout } from "@/components/admin/admin-layout"
import { Analytics } from "@/components/admin/analytics"

export const metadata = {
  title: "Analytics - Adunni Foods Admin",
  description: "View detailed sales analytics, revenue trends, and top products.",
}

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <Analytics />
    </AdminLayout>
  )
}

