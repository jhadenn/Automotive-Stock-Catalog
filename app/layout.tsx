import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import Navbar from "@/components/navbar"
import { ProductProvider } from "@/lib/product-context"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: "%s | Auto Inventory",
    default: "Auto Inventory - Automotive Stock Management"
  },
  description: "Manage your automotive inventory with ease",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <ProductProvider>
              <Navbar />
              <main className="container mx-auto px-4 py-4">{children}</main>
            </ProductProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

