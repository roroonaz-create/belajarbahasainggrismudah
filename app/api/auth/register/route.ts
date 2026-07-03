import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await db.query(
      `INSERT INTO users (name, email, password, level)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, level, created_at`,
      [name, email, hashedPassword, 'A1']
    )

    const user = result.rows[0]

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
      { message: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    )
  }
}
