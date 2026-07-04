import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Handle specific Supabase errors
      if (error.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { message: 'Email atau password salah' },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { message: error.message || 'Terjadi kesalahan saat login' },
        { status: 401 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { message: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Get user data from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name, email, level, created_at')
      .eq('email', email)
      .single()

    if (userError) {
      console.error('Error fetching user:', userError)
      return NextResponse.json(
        { message: 'User data tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          level: userData.level,
          createdAt: userData.created_at,
        },
        token: data.session?.access_token || ''
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      )
    }
    
    console.error('Login error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Terjadi kesalahan saat login' },
      { status: 500 }
    )
  }
}
