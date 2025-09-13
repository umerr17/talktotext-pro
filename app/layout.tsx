import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "TalkToText Pro - AI-Powered Meeting Notes Rewriter",
  description:
    "Transform your meeting recordings into structured, professional notes with AI. Upload, transcribe, and get organized summaries, action items, and key insights.",
  keywords: ["AI", "meeting notes", "transcription", "productivity", "business"],
  authors: [{ name: "TalkToText Pro" }],
  creator: "TalkToText Pro",
  publisher: "TalkToText Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://talktotextpro.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TalkToText Pro - AI-Powered Meeting Notes Rewriter",
    description: "Transform your meeting recordings into structured, professional notes with AI.",
    url: "https://talktotextpro.com",
    siteName: "TalkToText Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TalkToText Pro - AI Meeting Notes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalkToText Pro - AI-Powered Meeting Notes Rewriter",
    description: "Transform your meeting recordings into structured, professional notes with AI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${dmSans.variable} ${GeistMono.variable} antialiased overflow-x-hidden`}>        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
