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

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    // Handle errors
    if (authError) {
      // Check if email already exists
      if (authError.status === 400 && authError.message.includes('already registered')) {
        return NextResponse.json(
          { message: 'Email sudah terdaftar' },
          { status: 400 }
        )
      }
      throw new Error(authError.message)
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
      // Still return success since auth user was created
      return NextResponse.json(
        {
          user: {
            id: authData.user.id,
            name,
            email,
            level: 'A1',
            createdAt: new Date().toISOString(),
          },
          message: 'User created but failed to insert into database'
        },
        { status: 201 }
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
      { 
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat registrasi',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}
