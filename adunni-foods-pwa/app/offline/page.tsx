import OfflinePageClient from "./OfflinePageClient"

export const metadata = {
  title: "Offline – Adunni Foods",
  description: "You’re offline. Some features may be unavailable until your connection is restored.",
}

export default function OfflinePage() {
  return <OfflinePageClient />
}
