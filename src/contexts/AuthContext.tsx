'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { apiClient } from '@/lib/api'

interface AuthContextType {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ needsPassword?: boolean } | null>
  signInWithPassword: (credentials: { email: string; password: string; remember?: boolean }) => Promise<void>
  signUpWithPassword: (credentials: { email: string; password: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error getting initial session:', error)
          }
        } else {
          setSession(session)
          setUser(session?.user ?? null)
          
          // Set the Supabase token in the API client
          if (session?.access_token) {
            apiClient.setSupabaseToken(session.access_token)
          } else {
            apiClient.clearToken()
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error in getInitialSession:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth state changed:', event, session?.user?.email)
        }
        setSession(session)
        setUser(session?.user ?? null)
        
        // Update API client token when auth state changes
        if (session?.access_token) {
          apiClient.setSupabaseToken(session.access_token)
        } else {
          apiClient.clearToken()
        }
        
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      // Clear any stale data
      localStorage.clear()
      setSession(null)
      setUser(null)
      // Clear API client token
      apiClient.clearToken()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error signing out:', error)
      }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        throw error
      }
      
      // Return null for now - the actual result will be handled in the callback
      return null
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error signing in with Google:', error)
      }
      throw error
    }
  }

  const signInWithPassword = async (credentials: { email: string; password: string; remember?: boolean }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })
      
      if (error) {
        throw error
      }
      
      // The auth state change will be handled by the onAuthStateChange listener
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error signing in with password:', error)
      }
      throw error
    }
  }

  const signUpWithPassword = async (credentials: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password
      })
      
      if (error) {
        throw error
      }
      
      // The auth state change will be handled by the onAuthStateChange listener
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error signing up with password:', error)
      }
      throw error
    }
  }

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signOut,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
