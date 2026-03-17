import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { ServiceWorkerRegistrar } from "@/components/service-worker-registrar"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://adunnifoods.com"),
  title: {
    default: "Adunni Foods - Premium Plantain Chips",
    template: "%s | Adunni Foods",
  },
  description:
    "Delicious, premium Nigerian plantain chips made with love. Order fresh, crispy plantain chips delivered to your door.",
  generator: "v0.app",
  keywords: [
    "plantain chips",
    "Nigerian snacks",
    "healthy snacks",
    "food delivery",
    "Adunni Foods",
    "Lagos snacks",
  ],
  authors: [{ name: "Adunni Foods" }],
  creator: "Adunni Foods",
  publisher: "Adunni Foods",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Adunni Foods - Premium Nigerian Plantain Chips",
    description:
      "Crispy, golden plantain chips made with authentic Nigerian recipes. Order online and enjoy fast delivery.",
    url: "/",
    siteName: "Adunni Foods",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Adunni Foods premium plantain chips",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adunni Foods - Premium Nigerian Plantain Chips",
    description:
      "Delicious, premium plantain chips made with love. Order fresh, crispy plantain chips delivered to your door.",
    images: ["/og-image.png"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#d97706",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/adunnilogo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/adunnilogo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Adunni Foods" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-body antialiased">
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  )
}
