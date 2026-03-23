"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(ios)

    // Check if already installed
    // @ts-ignore
    const standalone = window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches
    setIsStandalone(standalone)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    if (ios && !standalone) {
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [isStandalone])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  if (!showPrompt || isStandalone) return null
  if (!deferredPrompt && !isIOS) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="shadow-lg border-amber-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-heading">Install Adunni Foods</CardTitle>
              <CardDescription className="text-sm">Get the full app experience with offline access</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isIOS && !deferredPrompt ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground bg-amber-50 p-3 rounded-lg border border-amber-100 italic">
                Tap the <span className="font-bold text-amber-700">Share</span> icon (the square with an arrow) 
                and then select <span className="font-bold text-amber-700">"Add to Home Screen"</span> to install.
              </div>
              <Button onClick={handleDismiss} variant="outline" className="w-full">
                Got it
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleInstall} className="flex-1 bg-amber-600 hover:bg-amber-700">
                <Download className="w-4 h-4 mr-2" />
                Install Now
              </Button>
              <Button variant="outline" onClick={handleDismiss}>
                Later
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
