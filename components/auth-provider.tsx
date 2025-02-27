"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "owner" | "manager" | "employee" | "customer" | "guest"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => void
  logout: () => void
  isAuthenticated: boolean
  isAuthorized: (requiredRoles?: string[]) => boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isAuthorized: () => false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (email: string, password: string) => {
    // In a real app, you would validate credentials with an API
    // This is a mock implementation
    const mockUser: User = {
      id: "1",
      name: email.split("@")[0],
      email,
      role: email.includes("owner")
        ? "owner"
        : email.includes("manager")
          ? "manager"
          : email.includes("employee")
            ? "employee"
            : "customer",
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const isAuthenticated = !!user

  const isAuthorized = (requiredRoles?: string[]) => {
    if (!user) return false
    if (!requiredRoles) return true
    return requiredRoles.includes(user.role)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

