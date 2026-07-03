import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { message: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string; email: string }

    // Get user from database
    const result = await db.query(
      'SELECT id, name, email, level, created_at FROM users WHERE id = $1',
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    const user = result.rows[0]

    return NextResponse.json(
      { 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          level: user.level,
          createdAt: user.created_at,
        } 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { message: 'Token tidak valid' },
      { status: 401 }
    )
  }
}
