"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CarFront, Package, User } from "lucide-react"

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <CarFront className="h-6 w-6" />
          <span className="hidden sm:inline-block">Auto Retail Inventory</span>
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
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.name}
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

