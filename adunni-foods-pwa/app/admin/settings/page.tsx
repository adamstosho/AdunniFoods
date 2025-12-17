import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminSettings } from "@/components/admin/settings"

export const metadata = {
  title: "Settings - Adunni Foods Admin",
  description: "Manage admin account settings and security.",
}

export default function SettingsPage() {
  return (
    <AdminLayout>
      <AdminSettings />
    </AdminLayout>
  )
}

