"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isAuthorized: (roles?: string[]) => boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes in auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, !!session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    try {
      console.log('Signing out...')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
      console.log('Sign out successful')
      router.push('/')
    } catch (err) {
      console.error('Unexpected error in signOut:', err)
      throw err
    }
  }

  const isAuthorized = (roles?: string[]) => {
    // If no roles specified, just check authentication
    if (!roles || roles.length === 0) return !!user
    
    // For now, any authenticated user is authorized
    // In a real app, you would check user roles in the database
    return !!user
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthorized,
        signIn,
        signUp,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// You can add this temporary debug code to your login page
const testAuth = async () => {
  const supabase = createClientComponentClient()
  
  // Test the connection
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  console.log('Current session:', session)
  console.log('Session error:', sessionError)
  
  // Test sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'your-test-email@example.com',
    password: 'your-test-password'
  })
  
  console.log('Sign in result:', data)
  console.log('Sign in error:', error)
}

// Call this function from a button or useEffect

