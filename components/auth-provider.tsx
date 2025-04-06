"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

/**
 * Type definition for the authentication context.
 * Provides authentication state and methods for user management.
 */
type AuthContextType = {
  /** The current authenticated user or null if not logged in */
  user: User | null
  /** Whether a user is currently authenticated */
  isAuthenticated: boolean
  /** Check if the current user is authorized for specific roles */
  isAuthorized: (roles?: string[]) => boolean
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<void>
  /** Create a new user account with email and password */
  signUp: (email: string, password: string) => Promise<void>
  /** Sign out the current user */
  signOut: () => Promise<void>
  /** Whether authentication state is still loading */
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication provider component that manages user authentication state.
 * 
 * This component:
 * 1. Sets up Supabase authentication
 * 2. Listens for auth state changes
 * 3. Provides methods for sign-in, sign-up, and sign-out
 * 4. Makes auth state and methods available via context
 * 
 * @param children - React components that will have access to auth context
 */
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

  /**
   * Sign in a user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @throws Error if sign-in fails
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  /**
   * Create a new user account with email and password
   * @param email - User's email address
   * @param password - User's password
   * @throws Error if sign-up fails
   */
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

  /**
   * Sign out the current user and redirect to the home page
   * Handles errors gracefully to ensure user state is reset even if backend logout fails
   */
  const signOut = async () => {
    try {
      console.log('Signing out...')
      
      // First check if we have a session to avoid the AuthSessionMissingError
      const { data: sessionData } = await supabase.auth.getSession()
      
      if (sessionData?.session) {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error('Error signing out:', error)
          // Continue with local cleanup even if backend signout fails
        }
      } else {
        console.log('No active session found, cleaning up local state only')
      }
      
      // Always reset the user state and redirect regardless of errors
      setUser(null)
      console.log('Sign out successful')
      router.push('/')
    } catch (err) {
      console.error('Unexpected error in signOut:', err)
      // Still reset user state and redirect even if there was an error
      setUser(null)
      router.push('/')
    }
  }

  /**
   * Check if the current user is authorized for specific roles
   * @param roles - Optional array of roles to check against
   * @returns True if user is authorized, false otherwise
   */
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

/**
 * Hook to access authentication context from any component.
 * Must be used within an AuthProvider component.
 * 
 * @returns The authentication context with user state and auth methods
 * @throws Error if used outside of an AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

