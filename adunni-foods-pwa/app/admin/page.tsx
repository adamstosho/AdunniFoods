import { AdminLogin } from "@/components/admin/admin-login"

export const metadata = {
  title: "Admin Login - Adunni Foods | Dashboard Access",
  description: "Admin login for Adunni Foods dashboard. Manage products, orders, and business operations.",
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <AdminLogin />
    </main>
  )
}
