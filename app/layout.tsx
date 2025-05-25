import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { WebSocketProvider } from "@/lib/websocket-context"
import { RealTimeProvider } from "@/lib/real-time-data"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Saint Community Pako-Obadiah Reporting App",
  description: "Real-time church community reporting and management system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <WebSocketProvider>
            <RealTimeProvider>
              {children}
              <Toaster />
            </RealTimeProvider>
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
