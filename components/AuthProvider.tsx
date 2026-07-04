'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  name: string
  email: string
  level: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch user data from database by email
  const fetchUserData = async (email: string) => {
    const { data: userData, error } = await supabase
      .from('users')
      .select('id, name, email, level, created_at')
      .eq('email', email)
      .single()
    
    if (error || !userData) {
      console.error('Error fetching user data:', error)
      return null
    }
    
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      level: userData.level,
      createdAt: userData.created_at,
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }

        if (session) {
          const userData = await fetchUserData(session.user.email)
          if (userData) {
            setUser(userData)
          }
        }
      } catch (error) {
        console.error('Auth verification failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const userData = await fetchUserData(session.user.email)
          if (userData) {
            setUser(userData)
          }
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user) {
        const userData = await fetchUserData(data.user.email)
        if (userData) {
          setUser(userData)
          router.push('/learn')
        } else {
          throw new Error('User data not found')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (authError) {
        // Handle email already exists
        if (authError.status === 400) {
          throw new Error('Email sudah terdaftar')
        }
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('Failed to create user')
      }

      // Insert user into database
      const { error: dbError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name,
            email,
            level: 'A1',
          },
        ])

      if (dbError) {
        console.error('Error inserting user:', dbError)
        // User still created in auth, so we can proceed
      }

      // Fetch user data
      const userData = await fetchUserData(email)
      if (userData) {
        setUser(userData)
        router.push('/learn')
      } else {
        // If user data not found, create it manually
        setUser({
          id: authData.user.id,
          name,
          email,
          level: 'A1',
          createdAt: new Date().toISOString(),
        })
        router.push('/learn')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
