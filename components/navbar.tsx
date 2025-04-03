"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  CarFront, 
  User, 
  LogOut, 
  BellRing, 
  Package, 
  Menu, 
  X, 
  Grid3X3,
  Settings,
  ChevronRight
} from "lucide-react"
import { useState, useEffect } from "react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const { isAuthenticated, signOut, user } = useAuth()
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Extract the username from email (everything before @)
  const userName = user?.email ? user.email.split('@')[0] : 'User'

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      console.log('Logging out...')
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const NavLink = ({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary relative group",
        pathname === href 
          ? "text-primary" 
          : "text-muted-foreground",
        className
      )}
    >
      {children}
      <span className={cn(
        "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
        pathname === href ? "w-full" : "w-0 group-hover:w-full"
      )}></span>
    </Link>
  )

  return (
    <header className={cn(
      "sticky top-0 z-40 transition-all duration-200",
      scrolled 
        ? "bg-background/80 backdrop-blur-md border-b shadow-sm" 
        : "bg-background border-b"
    )}>
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="bg-primary/10 rounded-full p-1.5 flex items-center justify-center">
            <CarFront className="h-5 w-5 text-primary" />
          </div>
          <span className="hidden sm:inline-block">Automotive Inventory</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-10 hidden md:flex gap-6">
          <NavLink href="/">
            <span className="flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              Products
            </span>
          </NavLink>
          <NavLink href="/categories">
            <span className="flex items-center gap-1.5">
              <Grid3X3 className="h-4 w-4" />
              Categories
            </span>
          </NavLink>
          {isAuthenticated && (
            <NavLink href="/alerts">
              <span className="flex items-center gap-1.5">
                <BellRing className="h-4 w-4" />
                Alerts
              </span>
            </NavLink>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 overflow-hidden">
                  <div className="bg-primary/10 rounded-full w-full h-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-normal text-muted-foreground">Signed in as</span>
                    <span className="font-medium text-foreground">{userName}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm" className="h-9">
              <Link href="/login">Login</Link>
            </Button>
          )}
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col space-y-1 p-4">
            <Link
              href="/"
              className={`flex items-center space-x-2 rounded-lg px-3 py-2 ${
                pathname === "/" ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <Package className="h-5 w-5" />
              <span>Products</span>
            </Link>
            <Link
              href="/categories"
              className={`flex items-center space-x-2 rounded-lg px-3 py-2 ${
                pathname === "/categories" ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <Grid3X3 className="h-5 w-5" />
              <span>Categories</span>
            </Link>
            {isAuthenticated && (
              <Link
                href="/alerts"
                className={`flex items-center space-x-2 rounded-lg px-3 py-2 ${
                  pathname === "/alerts" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                <BellRing className="h-5 w-5" />
                <span>Alerts</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

