"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function OfflinePageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-heading text-gray-900">You're Offline</CardTitle>
          <CardDescription className="text-gray-600">
            It looks like you've lost your internet connection. Don't worry, you can still browse some content!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Some features may not be available while offline. Please check your connection and try again.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => window.location.reload()} className="bg-amber-600 hover:bg-amber-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
