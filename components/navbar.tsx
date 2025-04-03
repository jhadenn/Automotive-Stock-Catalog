"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

import { CarFront, User, LogOut, BellRing } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { isAuthenticated, signOut, user } = useAuth()
  const pathname = usePathname()
  const [showDropdown, setShowDropdown] = useState(false)
  
  // Extract the username from email (everything before @)
  const userName = user?.email ? user.email.split('@')[0] : 'User'

  const handleLogout = async () => {
    try {
      console.log('Logging out...')
      await signOut()
      setShowDropdown(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <CarFront className="h-6 w-6" />
          <span className="hidden sm:inline-block">Automotive Inventory</span>
        </div>

        <nav className="ml-8 flex gap-4">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            All Products
          </Link>
          <Link
            href="/categories"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/categories" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Categories
          </Link>
          {isAuthenticated && (
            <Link
              href="/alerts"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${
                pathname === "/alerts" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <BellRing className="h-4 w-4 mr-1" />
              Alerts
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <User className="h-4 w-4" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-background rounded-md shadow-lg z-10 border">
                  <div className="px-4 py-2 text-sm text-foreground">
                    {userName}
                  </div>
                  <div className="border-t"></div>
                  <button
                    className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center text-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

