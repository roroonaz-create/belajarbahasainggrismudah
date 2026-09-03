import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Never statically evaluated during next build: the handler performs live
// Supabase calls that must not run at build time.
export const dynamic = 'force-dynamic'

// Admin credentials
const ADMIN_EMAIL = 'admin@belajarbahasainggris.com'
const ADMIN_PASSWORD = '@@Asdf1290##'
const ADMIN_NAME = 'Admin'

export async function GET(request: Request) {
  try {
    // Check if admin already exists in database
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', ADMIN_EMAIL)
      .single()

    if (checkError && !checkError.message.includes('no rows')) {
      console.error('Error checking admin:', checkError)
    }

    if (existingUser) {
      return NextResponse.json(
        { 
          message: 'Admin sudah ada',
          email: ADMIN_EMAIL,
          password: '*** (rahasia)'
        },
        { status: 200 }
      )
    }

    // Create admin in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: {
        data: {
          name: ADMIN_NAME,
        },
      },
    })

    if (authError) {
      // If user already exists in auth
      if (authError.status === 400) {
        // Email is registered in auth but we cannot read it client-side;
        // mirror the users table and report the actual state.
        const { data: existingUserRow, error: rowError } = await supabase
          .from('users')
          .select('id, email')
          .eq('email', ADMIN_EMAIL)
          .single()

        if (rowError && !rowError.message.includes('no rows')) {
          console.error('Error checking admin:', rowError)
        }

        if (existingUserRow) {
          return NextResponse.json(
            {
              message: 'Admin sudah ada',
              email: ADMIN_EMAIL,
              password: '*** (rahasia)'
            },
            { status: 200 }
          )
        }

        return NextResponse.json(
          {
            message: 'Email admin sudah terdaftar di autentikasi namun belum ada di database. Hubungi administrator untuk menyelesaikan penyiapan.',
            error: authError.message
          },
          { status: 400 }
        )
      }
      
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error('Failed to create admin user')
    }

    // Insert admin into database
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          level: 'C2',
        },
      ])

    if (dbError) {
      console.error('Error inserting admin:', dbError)
      return NextResponse.json(
        { 
          message: 'Admin dibuat di auth tetapi gagal di database',
          error: dbError.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Admin berhasil dibuat',
        email: ADMIN_EMAIL,
        password: '*** (rahasia)',
        name: ADMIN_NAME,
        level: 'C2'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Setup admin error:', error)
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat setup admin',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}
