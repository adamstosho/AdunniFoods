import { AdminLayout } from "@/components/admin/admin-layout"
import { ReviewManagement } from "@/components/admin/review-management"

export const metadata = {
    title: "Review Management | Adunni Foods Admin",
}

export default function AdminReviewsPage() {
    return (
        <AdminLayout>
            <ReviewManagement />
        </AdminLayout>
    )
}
