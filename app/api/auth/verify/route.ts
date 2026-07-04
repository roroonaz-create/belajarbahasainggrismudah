import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { message: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json(
        { message: 'Token tidak valid' },
        { status: 401 }
      )
    }

    // Get user from database
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('id, name, email, level, created_at')
      .eq('email', user.email)
      .single()

    if (dbError || !userData) {
      return NextResponse.json(
        { message: 'User tidak ditemukan' },
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
