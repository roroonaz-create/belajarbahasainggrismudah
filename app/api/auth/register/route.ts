import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Nama harus minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password harus minimal 6 karakter'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if user already exists by trying to sign up
    // Supabase v2 doesn't have getUserByEmail, so we use signUp and catch the error
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    // If error is "User already registered", return error
    if (signUpError && signUpError.message.includes('User already registered')) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    if (signUpError) {
      throw new Error(signUpError.message)
    }

    if (!authData.user) {
      throw new Error('Failed to create user')
    }

    // Insert user into database
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          name,
          email,
          level: 'A1',
        },
      ])
      .select('id, name, email, level, created_at')
      .single()

    if (dbError) {
      console.error('Error inserting user:', dbError)
    }

    return NextResponse.json(
      { 
        user: userData || {
          id: authData.user.id,
          name,
          email,
          level: 'A1',
          createdAt: new Date().toISOString(),
        }
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      )
    }
    
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    )
  }
}
