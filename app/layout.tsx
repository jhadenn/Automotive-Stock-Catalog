import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import Navbar from "@/components/navbar"
import { ProductProvider } from "@/lib/product-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Auto Inventory",
  description: "Inventory management for automotive products!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProductProvider>
            <Navbar />
            <main className="container mx-auto px-4 py-4">{children}</main>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

