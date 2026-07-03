import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Email atau password salah' },
        { status: 401 }
      )
    }

    const user = result.rows[0]

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    return NextResponse.json(
      { 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          level: user.level,
          createdAt: user.created_at,
        },
        token 
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
      { message: 'Terjadi kesalahan saat login' },
      { status: 500 }
    )
  }
}
