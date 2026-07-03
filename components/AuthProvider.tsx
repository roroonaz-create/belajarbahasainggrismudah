'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

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
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        const token = Cookies.get('token')
        if (token) {
          // Verify token with backend
          const response = await fetch('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
          } else {
            Cookies.remove('token')
          }
        }
      } catch (error) {
        console.error('Auth verification failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login gagal')
      }

      const data = await response.json()
      Cookies.set('token', data.token, { expires: 7 })
      setUser(data.user)
      router.push('/learn')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Registrasi gagal')
      }

      const data = await response.json()
      Cookies.set('token', data.token, { expires: 7 })
      setUser(data.user)
      router.push('/learn')
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
    router.push('/login')
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
